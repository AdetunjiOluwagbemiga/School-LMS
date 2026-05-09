/*
  # Auth Profiles and RBAC

  1. New Tables
    - `profiles` - Extended user profiles linked to auth.users
    - `user_roles` - Role assignments per user per tenant
    - `parent_students` - Parent-child linkage for K-12

  2. New Types
    - `app_role` enum: super_admin, school_admin, registrar, teacher, student, parent

  3. Functions
    - `handle_new_user` trigger to auto-create profile on signup
    - `get_my_role` helper for RLS policies

  4. Security
    - RLS enabled on all tables
*/

do $$ begin
  create type public.app_role as enum (
    'super_admin', 'school_admin', 'registrar', 'teacher', 'student', 'parent'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  tenant_id       uuid references public.tenants(id) on delete cascade,
  full_name       text not null default '',
  display_name    text,
  avatar_url      text,
  date_of_birth   date,
  phone           text,
  locale          text default 'en',
  timezone        text default 'UTC',
  bio             text,
  metadata        jsonb default '{}',
  gdpr_consent    boolean not null default false,
  gdpr_consent_at timestamptz,
  last_active_at  timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_profiles_tenant on public.profiles (tenant_id);

create table if not exists public.user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  role        app_role not null,
  granted_by  uuid references public.profiles(id),
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz,
  unique (user_id, tenant_id, role)
);

create index if not exists idx_user_roles_user on public.user_roles (user_id, tenant_id);
create index if not exists idx_user_roles_tenant on public.user_roles (tenant_id, role);

create table if not exists public.parent_students (
  parent_id  uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  approved   boolean not null default false,
  primary key (parent_id, student_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := (new.raw_user_meta_data->>'tenant_id')::uuid;
  insert into public.profiles (id, tenant_id, full_name)
  values (
    new.id,
    v_tenant_id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.get_my_role(p_tenant_id uuid)
returns app_role language sql stable security definer as $$
  select role from public.user_roles
  where user_id = auth.uid()
    and tenant_id = p_tenant_id
  order by case role
    when 'super_admin'  then 1
    when 'school_admin' then 2
    when 'registrar'    then 3
    when 'teacher'      then 4
    when 'student'      then 5
    when 'parent'       then 6
  end
  limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.parent_students enable row level security;
