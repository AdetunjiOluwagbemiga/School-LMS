/*
  # Row Level Security Policies

  Comprehensive RLS policies for all tables.
  Principle: every row is tenant-scoped; users only see data within their tenant.
  Roles gate access levels via get_my_role().
*/

-- Helper to check if user is super admin
create or replace function public.is_super_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'super_admin'
  );
$$;

-- Helper to check if user belongs to a tenant
create or replace function public.is_tenant_member(p_tenant_id uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and tenant_id = p_tenant_id
  );
$$;

-- Helper to check if user is teacher/admin for tenant
create or replace function public.is_tenant_staff(p_tenant_id uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and tenant_id = p_tenant_id
      and role in ('super_admin','school_admin','teacher','registrar')
  );
$$;

-- ── TENANTS ──────────────────────────────────────────────────────────────────

create policy "tenants: super admin full access"
  on public.tenants for all
  using (is_super_admin());

create policy "tenants: members read own"
  on public.tenants for select
  using (is_tenant_member(id));

-- ── PROFILES ─────────────────────────────────────────────────────────────────

create policy "profiles: own full access"
  on public.profiles for all
  using (id = auth.uid());

create policy "profiles: staff read tenant"
  on public.profiles for select
  using (
    tenant_id is not null
    and is_tenant_staff(tenant_id)
  );

create policy "profiles: insert own"
  on public.profiles for insert
  with check (id = auth.uid());

-- ── USER ROLES ────────────────────────────────────────────────────────────────

create policy "user_roles: own read"
  on public.user_roles for select
  using (user_id = auth.uid());

create policy "user_roles: staff read tenant"
  on public.user_roles for select
  using (is_tenant_staff(tenant_id));

create policy "user_roles: admin write"
  on public.user_roles for insert
  with check (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.tenant_id = tenant_id
        and ur.role in ('super_admin','school_admin')
    )
  );

-- ── COURSES ───────────────────────────────────────────────────────────────────

create policy "courses: staff full access"
  on public.courses for all
  using (is_tenant_staff(tenant_id));

create policy "courses: students read published enrolled"
  on public.courses for select
  using (
    status = 'published'
    and exists (
      select 1 from public.enrollments e
      where e.course_id = courses.id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
  );

-- ── MODULES ───────────────────────────────────────────────────────────────────

create policy "modules: staff full access"
  on public.modules for all
  using (is_tenant_staff(tenant_id));

create policy "modules: enrolled students read"
  on public.modules for select
  using (
    exists (
      select 1 from public.enrollments e
      where e.course_id = modules.course_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
  );

-- ── ENROLLMENTS ───────────────────────────────────────────────────────────────

create policy "enrollments: own read"
  on public.enrollments for select
  using (user_id = auth.uid());

create policy "enrollments: staff full access"
  on public.enrollments for all
  using (is_tenant_staff(tenant_id));

create policy "enrollments: own update progress"
  on public.enrollments for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── CONTENT ITEMS ─────────────────────────────────────────────────────────────

create policy "content_items: staff full access"
  on public.content_items for all
  using (is_tenant_staff(tenant_id));

create policy "content_items: enrolled students read"
  on public.content_items for select
  using (
    exists (
      select 1 from public.modules m
      join public.enrollments e on e.course_id = m.course_id
      where m.id = content_items.module_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
  );

-- ── CONTENT PROGRESS ─────────────────────────────────────────────────────────

create policy "content_progress: own full access"
  on public.content_progress for all
  using (user_id = auth.uid());

create policy "content_progress: staff read"
  on public.content_progress for select
  using (is_tenant_staff(tenant_id));

-- ── ASSESSMENTS ───────────────────────────────────────────────────────────────

create policy "assessments: staff full access"
  on public.assessments for all
  using (is_tenant_staff(tenant_id));

create policy "assessments: enrolled students read"
  on public.assessments for select
  using (is_tenant_member(tenant_id));

-- ── ASSESSMENT ATTEMPTS ───────────────────────────────────────────────────────

create policy "assessment_attempts: own full access"
  on public.assessment_attempts for all
  using (user_id = auth.uid());

create policy "assessment_attempts: staff read"
  on public.assessment_attempts for select
  using (is_tenant_staff(tenant_id));

-- ── QUESTIONS ─────────────────────────────────────────────────────────────────

create policy "questions: staff full access"
  on public.questions for all
  using (is_tenant_staff(tenant_id));

create policy "question_banks: staff full access"
  on public.question_banks for all
  using (is_tenant_staff(tenant_id));

-- ── GRADES ────────────────────────────────────────────────────────────────────

create policy "grades: own read"
  on public.grades for select
  using (user_id = auth.uid());

create policy "grades: staff full access"
  on public.grades for all
  using (is_tenant_staff(tenant_id));

create policy "grade_items: staff full access"
  on public.grade_items for all
  using (is_tenant_staff(tenant_id));

create policy "grade_items: enrolled students read"
  on public.grade_items for select
  using (is_tenant_member(tenant_id));

create policy "grading_scales: staff full access"
  on public.grading_scales for all
  using (is_tenant_staff(tenant_id));

create policy "grading_scales: members read"
  on public.grading_scales for select
  using (is_tenant_member(tenant_id));

-- ── GAMIFICATION ─────────────────────────────────────────────────────────────

create policy "badges: staff manage"
  on public.badges for all
  using (is_tenant_staff(tenant_id));

create policy "badges: members read"
  on public.badges for select
  using (is_tenant_member(tenant_id));

create policy "user_badges: own read"
  on public.user_badges for select
  using (user_id = auth.uid());

create policy "user_badges: staff read"
  on public.user_badges for select
  using (is_tenant_staff(tenant_id));

create policy "user_badges: system insert"
  on public.user_badges for insert
  with check (is_tenant_member(tenant_id));

create policy "point_ledger: own read"
  on public.point_ledger for select
  using (user_id = auth.uid());

create policy "point_ledger: staff read"
  on public.point_ledger for select
  using (is_tenant_staff(tenant_id));

create policy "point_ledger: insert own"
  on public.point_ledger for insert
  with check (user_id = auth.uid() and is_tenant_member(tenant_id));

-- ── FORUMS ────────────────────────────────────────────────────────────────────

create policy "forums: staff full access"
  on public.forums for all
  using (is_tenant_staff(tenant_id));

create policy "forums: members read"
  on public.forums for select
  using (is_tenant_member(tenant_id));

create policy "threads: members read"
  on public.threads for select
  using (is_tenant_member(tenant_id));

create policy "threads: members insert"
  on public.threads for insert
  with check (author_id = auth.uid() and is_tenant_member(tenant_id));

create policy "threads: own update"
  on public.threads for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "threads: staff manage"
  on public.threads for all
  using (is_tenant_staff(tenant_id));

create policy "posts: members read"
  on public.posts for select
  using (is_tenant_member(tenant_id));

create policy "posts: members insert"
  on public.posts for insert
  with check (author_id = auth.uid() and is_tenant_member(tenant_id));

create policy "posts: own update"
  on public.posts for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

create policy "notifications: own full access"
  on public.notifications for all
  using (user_id = auth.uid());

-- ── COMPLIANCE ────────────────────────────────────────────────────────────────

create policy "consent_records: own read"
  on public.consent_records for select
  using (user_id = auth.uid());

create policy "consent_records: own insert"
  on public.consent_records for insert
  with check (user_id = auth.uid());

create policy "consent_records: staff read"
  on public.consent_records for select
  using (is_tenant_staff(tenant_id));

create policy "audit_log: staff read"
  on public.audit_log for select
  using (is_tenant_staff(tenant_id));

create policy "audit_log: insert authenticated"
  on public.audit_log for insert
  with check (auth.uid() is not null);

-- ── ADAPTIVE LEARNING ─────────────────────────────────────────────────────────

create policy "learning_paths: staff full access"
  on public.learning_paths for all
  using (is_tenant_staff(tenant_id));

create policy "learning_paths: members read"
  on public.learning_paths for select
  using (is_tenant_member(tenant_id));

create policy "path_nodes: staff full access"
  on public.path_nodes for all
  using (is_tenant_staff((select tenant_id from public.learning_paths where id = path_id)));

create policy "path_nodes: members read"
  on public.path_nodes for select
  using (is_tenant_member((select tenant_id from public.learning_paths where id = path_id)));

create policy "path_edges: staff full access"
  on public.path_edges for all
  using (is_tenant_staff((select tenant_id from public.learning_paths where id = path_id)));

create policy "path_edges: members read"
  on public.path_edges for select
  using (is_tenant_member((select tenant_id from public.learning_paths where id = path_id)));

create policy "user_path_progress: own full access"
  on public.user_path_progress for all
  using (user_id = auth.uid());

create policy "user_path_progress: staff read"
  on public.user_path_progress for select
  using (is_tenant_staff(tenant_id));

-- ── ANALYTICS ─────────────────────────────────────────────────────────────────

create policy "user_daily_stats: own read"
  on public.user_daily_stats for select
  using (user_id = auth.uid());

create policy "user_daily_stats: staff read"
  on public.user_daily_stats for select
  using (is_tenant_staff(tenant_id));

create policy "user_daily_stats: own upsert"
  on public.user_daily_stats for insert
  with check (user_id = auth.uid());

create policy "user_daily_stats: own update"
  on public.user_daily_stats for update
  using (user_id = auth.uid());

-- ── PARENT-STUDENT ────────────────────────────────────────────────────────────

create policy "parent_students: own read"
  on public.parent_students for select
  using (parent_id = auth.uid() or student_id = auth.uid());

create policy "parent_students: staff manage"
  on public.parent_students for all
  using (is_tenant_staff(tenant_id));
