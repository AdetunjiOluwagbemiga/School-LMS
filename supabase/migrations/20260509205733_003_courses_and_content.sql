/*
  # Courses, Modules, Enrollments, and Content

  1. New Types
    - `course_status`: draft, published, archived
    - `delivery_mode`: self_paced, instructor_led, blended
    - `content_type`: lesson, video, pdf, scorm, xapi, quiz, etc.

  2. New Tables
    - `courses` - Course catalog per tenant
    - `course_instructors` - Many-to-many courses <-> teachers
    - `modules` - Ordered modules within a course
    - `enrollments` - Student enrollment records
    - `content_items` - Individual learning objects within modules
    - `content_progress` - Per-user progress on each content item

  3. Security
    - RLS enabled on all tables
*/

do $$ begin
  create type public.course_status as enum ('draft','published','archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.delivery_mode as enum ('self_paced','instructor_led','blended');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.content_type as enum (
    'lesson','video','pdf','audio','scorm','xapi','h5p','link','assignment','quiz','survey','microlesson'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  title           text not null,
  slug            text not null,
  description     text,
  thumbnail_url   text,
  status          course_status not null default 'draft',
  delivery_mode   delivery_mode not null default 'self_paced',
  category        text,
  tags            text[] default '{}',
  difficulty      text check (difficulty in ('beginner','intermediate','advanced')),
  language        text not null default 'en',
  estimated_hours numeric(6,2),
  credits         numeric(5,2) default 0,
  passing_grade   numeric(5,2) not null default 60,
  is_featured     boolean not null default false,
  enrollment_cap  integer,
  sort_order      integer not null default 0,
  metadata        jsonb default '{}',
  created_by      uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (tenant_id, slug)
);

create index if not exists idx_courses_tenant on public.courses (tenant_id, status);

create table if not exists public.course_instructors (
  course_id  uuid not null references public.courses(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  is_lead    boolean not null default false,
  primary key (course_id, user_id)
);

create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id),
  title       text not null,
  description text,
  sort_order  integer not null default 0,
  is_required boolean not null default true,
  unlock_at   timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists idx_modules_course on public.modules (course_id, sort_order);

create table if not exists public.enrollments (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references public.courses(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id),
  enrolled_by   uuid references public.profiles(id),
  status        text not null default 'active' check (status in ('active','completed','dropped','suspended')),
  progress_pct  numeric(5,2) not null default 0,
  started_at    timestamptz,
  completed_at  timestamptz,
  expires_at    timestamptz,
  created_at    timestamptz not null default now(),
  unique (course_id, user_id)
);

create index if not exists idx_enrollments_user on public.enrollments (user_id, tenant_id);
create index if not exists idx_enrollments_course on public.enrollments (course_id);

create table if not exists public.content_items (
  id              uuid primary key default gen_random_uuid(),
  module_id       uuid not null references public.modules(id) on delete cascade,
  tenant_id       uuid not null references public.tenants(id),
  title           text not null,
  content_type    content_type not null,
  body            text,
  file_url        text,
  external_url    text,
  scorm_version   text,
  duration_mins   integer,
  sort_order      integer not null default 0,
  is_mandatory    boolean not null default true,
  points_value    integer not null default 0,
  metadata        jsonb default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_content_module on public.content_items (module_id, sort_order);

create table if not exists public.content_progress (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  tenant_id       uuid not null references public.tenants(id),
  status          text not null default 'not_started' check (status in ('not_started','in_progress','completed','failed')),
  score           numeric(6,2),
  time_spent_secs integer not null default 0,
  scorm_data      jsonb default '{}',
  last_position   text,
  attempts        integer not null default 0,
  completed_at    timestamptz,
  updated_at      timestamptz not null default now(),
  unique (content_item_id, user_id)
);

alter table public.courses enable row level security;
alter table public.course_instructors enable row level security;
alter table public.modules enable row level security;
alter table public.enrollments enable row level security;
alter table public.content_items enable row level security;
alter table public.content_progress enable row level security;
