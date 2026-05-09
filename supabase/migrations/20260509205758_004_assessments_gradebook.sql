/*
  # Assessments, Question Banks, Gradebook

  1. New Types
    - `question_type` enum for MCQ, true/false, essay, etc.

  2. New Tables
    - `question_banks` - Reusable question repositories per tenant
    - `questions` - Individual questions with options/answers
    - `assessments` - Quiz/exam configuration
    - `assessment_attempts` - Student attempt records
    - `grade_items` - Gradebook categories/items per course
    - `grades` - Individual student grades
    - `grading_scales` - Letter grade conversion scales

  3. Security
    - RLS enabled on all tables
*/

do $$ begin
  create type public.question_type as enum (
    'mcq_single','mcq_multi','true_false','short_answer','essay','matching','fill_blank'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.question_banks (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  name        text not null,
  description text,
  category    text,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now()
);

create table if not exists public.questions (
  id              uuid primary key default gen_random_uuid(),
  bank_id         uuid not null references public.question_banks(id) on delete cascade,
  tenant_id       uuid not null references public.tenants(id),
  type            question_type not null,
  stem            text not null,
  options         jsonb default '[]',
  correct_answer  jsonb,
  explanation     text,
  points          numeric(6,2) not null default 1,
  difficulty      text check (difficulty in ('easy','medium','hard')),
  tags            text[] default '{}',
  bloom_level     text,
  media_url       text,
  created_by      uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_questions_bank on public.questions (bank_id);
create index if not exists idx_questions_tags on public.questions using gin (tags);

create table if not exists public.assessments (
  id                uuid primary key default gen_random_uuid(),
  content_item_id   uuid references public.content_items(id) on delete set null,
  tenant_id         uuid not null references public.tenants(id),
  title             text not null,
  instructions      text,
  time_limit_mins   integer,
  max_attempts      integer not null default 1,
  passing_score     numeric(5,2) not null default 60,
  shuffle_questions boolean not null default false,
  shuffle_options   boolean not null default false,
  show_results      text not null default 'after_submit' check (show_results in ('after_submit','after_due','never')),
  due_at            timestamptz,
  available_from    timestamptz,
  question_draw     integer,
  bank_id           uuid references public.question_banks(id),
  question_ids      uuid[] default '{}',
  created_by        uuid references public.profiles(id),
  created_at        timestamptz not null default now()
);

create table if not exists public.assessment_attempts (
  id              uuid primary key default gen_random_uuid(),
  assessment_id   uuid not null references public.assessments(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  tenant_id       uuid not null references public.tenants(id),
  attempt_number  integer not null default 1,
  status          text not null default 'in_progress' check (status in ('in_progress','submitted','graded','timed_out')),
  question_order  uuid[] not null default '{}',
  answers         jsonb not null default '{}',
  score           numeric(6,2),
  max_score       numeric(6,2),
  passed          boolean,
  time_taken_secs integer,
  auto_graded     boolean not null default true,
  grader_id       uuid references public.profiles(id),
  grader_feedback text,
  started_at      timestamptz not null default now(),
  submitted_at    timestamptz,
  graded_at       timestamptz
);

create index if not exists idx_attempts_assessment on public.assessment_attempts (assessment_id, user_id);

create table if not exists public.grade_items (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references public.courses(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id),
  title         text not null,
  category      text not null default 'assignment',
  weight        numeric(5,2) not null default 100,
  max_points    numeric(8,2) not null default 100,
  assessment_id uuid references public.assessments(id),
  due_at        timestamptz,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.grades (
  id            uuid primary key default gen_random_uuid(),
  grade_item_id uuid not null references public.grade_items(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id),
  attempt_id    uuid references public.assessment_attempts(id),
  points_earned numeric(8,2),
  letter_grade  text,
  feedback      text,
  graded_by     uuid references public.profiles(id),
  graded_at     timestamptz,
  is_excused    boolean not null default false,
  override      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (grade_item_id, user_id)
);

create index if not exists idx_grades_user on public.grades (user_id, tenant_id);

create table if not exists public.grading_scales (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  name       text not null,
  is_default boolean not null default false,
  scale      jsonb not null default '[]'
);

alter table public.question_banks enable row level security;
alter table public.questions enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.grade_items enable row level security;
alter table public.grades enable row level security;
alter table public.grading_scales enable row level security;
