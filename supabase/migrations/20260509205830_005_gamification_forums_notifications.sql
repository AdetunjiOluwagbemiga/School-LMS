/*
  # Gamification, Forums, Notifications, Compliance

  1. New Tables
    - `badges` - Badge definitions with criteria and rarity
    - `user_badges` - Earned badges per user
    - `point_ledger` - XP/points transaction log
    - `forums` - Forum boards per course or school-wide
    - `threads` - Discussion threads
    - `posts` - Thread replies (nested)
    - `notifications` - In-app notifications
    - `consent_records` - GDPR/NDPA consent audit trail
    - `audit_log` - Action audit log
    - `learning_paths` - Adaptive learning path definitions
    - `path_nodes` - Nodes in a learning path
    - `path_edges` - Conditional edges between nodes
    - `user_path_progress` - Per-user path progress
    - `user_daily_stats` - Aggregated daily engagement stats

  2. Security
    - RLS enabled on all tables
*/

-- Gamification
create table if not exists public.badges (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants(id) on delete cascade,
  name         text not null,
  description  text,
  icon_url     text,
  criteria     jsonb not null default '{}',
  points_value integer not null default 0,
  rarity       text not null default 'common' check (rarity in ('common','uncommon','rare','epic','legendary')),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.user_badges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  badge_id    uuid not null references public.badges(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id),
  earned_at   timestamptz not null default now(),
  context     jsonb default '{}',
  unique (user_id, badge_id)
);

create table if not exists public.point_ledger (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id),
  points      integer not null,
  reason      text not null,
  source_type text,
  source_id   uuid,
  created_at  timestamptz not null default now()
);

create index if not exists idx_point_ledger_user on public.point_ledger (user_id, tenant_id);

-- Forums
create table if not exists public.forums (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  course_id   uuid references public.courses(id) on delete cascade,
  title       text not null,
  description text,
  is_general  boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.threads (
  id            uuid primary key default gen_random_uuid(),
  forum_id      uuid not null references public.forums(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id),
  author_id     uuid not null references public.profiles(id),
  title         text not null,
  body          text not null,
  is_pinned     boolean not null default false,
  is_locked     boolean not null default false,
  is_resolved   boolean not null default false,
  view_count    integer not null default 0,
  reply_count   integer not null default 0,
  last_reply_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_threads_forum on public.threads (forum_id, created_at desc);

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.threads(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id),
  author_id   uuid not null references public.profiles(id),
  parent_id   uuid references public.posts(id),
  body        text not null,
  is_solution boolean not null default false,
  reactions   jsonb not null default '{}',
  is_deleted  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text,
  link        text,
  read_at     timestamptz,
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications (user_id, tenant_id, created_at desc);

-- Compliance
create table if not exists public.consent_records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id),
  consent_type  text not null,
  consented     boolean not null,
  ip_address    text,
  user_agent    text,
  version       text not null,
  created_at    timestamptz not null default now()
);

create table if not exists public.audit_log (
  id          bigserial primary key,
  tenant_id   uuid references public.tenants(id),
  actor_id    uuid references public.profiles(id),
  action      text not null,
  target_type text,
  target_id   uuid,
  old_value   jsonb,
  new_value   jsonb,
  ip_address  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_tenant on public.audit_log (tenant_id, created_at desc);

-- Adaptive Learning
create table if not exists public.learning_paths (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  title       text not null,
  description text,
  course_id   uuid references public.courses(id),
  is_adaptive boolean not null default true,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

create table if not exists public.path_nodes (
  id              uuid primary key default gen_random_uuid(),
  path_id         uuid not null references public.learning_paths(id) on delete cascade,
  content_item_id uuid references public.content_items(id),
  assessment_id   uuid references public.assessments(id),
  title           text not null,
  position_x      integer not null default 0,
  position_y      integer not null default 0,
  node_type       text not null default 'content' check (node_type in ('start','content','assessment','branch','end')),
  unlock_rules    jsonb default '{}',
  created_at      timestamptz not null default now()
);

create table if not exists public.path_edges (
  id          uuid primary key default gen_random_uuid(),
  path_id     uuid not null references public.learning_paths(id) on delete cascade,
  from_node   uuid not null references public.path_nodes(id) on delete cascade,
  to_node     uuid not null references public.path_nodes(id) on delete cascade,
  condition   jsonb default '{}'
);

create table if not exists public.user_path_progress (
  id              uuid primary key default gen_random_uuid(),
  path_id         uuid not null references public.learning_paths(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  tenant_id       uuid not null references public.tenants(id),
  current_node_id uuid references public.path_nodes(id),
  completed_nodes uuid[] default '{}',
  status          text not null default 'active' check (status in ('active','completed','paused')),
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  unique (path_id, user_id)
);

-- Daily stats for analytics
create table if not exists public.user_daily_stats (
  user_id          uuid not null references public.profiles(id) on delete cascade,
  tenant_id        uuid not null references public.tenants(id),
  stat_date        date not null,
  minutes_active   integer not null default 0,
  items_completed  integer not null default 0,
  points_earned    integer not null default 0,
  logins           integer not null default 0,
  risk_score       numeric(4,3) default 0,
  risk_factors     jsonb default '{}',
  primary key (user_id, stat_date)
);

-- Enable RLS
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.point_ledger enable row level security;
alter table public.forums enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.notifications enable row level security;
alter table public.consent_records enable row level security;
alter table public.audit_log enable row level security;
alter table public.learning_paths enable row level security;
alter table public.path_nodes enable row level security;
alter table public.path_edges enable row level security;
alter table public.user_path_progress enable row level security;
alter table public.user_daily_stats enable row level security;
