export type AppRole = 'super_admin' | 'school_admin' | 'registrar' | 'teacher' | 'student' | 'parent'

export type CourseStatus = 'draft' | 'published' | 'archived'
export type DeliveryMode = 'self_paced' | 'instructor_led' | 'blended'
export type ContentType = 'lesson' | 'video' | 'pdf' | 'audio' | 'scorm' | 'xapi' | 'h5p' | 'link' | 'assignment' | 'quiz' | 'survey' | 'microlesson'
export type QuestionType = 'mcq_single' | 'mcq_multi' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'fill_blank'
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface Tenant {
  id: string
  slug: string
  name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  font_family: string
  plan: 'free' | 'pro' | 'enterprise'
  max_students: number
  locale: string
  timezone: string
  features: Record<string, unknown>
  gdpr_dpa_signed: boolean
  ndpa_accepted: boolean
  is_active: boolean
  created_at: string
}

export interface Profile {
  id: string
  tenant_id: string | null
  full_name: string
  display_name: string | null
  avatar_url: string | null
  date_of_birth: string | null
  phone: string | null
  locale: string
  bio: string | null
  gdpr_consent: boolean
  last_active_at: string | null
  is_active: boolean
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  tenant_id: string
  role: AppRole
  granted_at: string
  expires_at: string | null
}

export interface Course {
  id: string
  tenant_id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  status: CourseStatus
  delivery_mode: DeliveryMode
  category: string | null
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null
  language: string
  estimated_hours: number | null
  credits: number
  passing_grade: number
  is_featured: boolean
  enrollment_cap: number | null
  sort_order: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  tenant_id: string
  title: string
  description: string | null
  sort_order: number
  is_required: boolean
  unlock_at: string | null
  created_at: string
}

export interface Enrollment {
  id: string
  course_id: string
  user_id: string
  tenant_id: string
  status: 'active' | 'completed' | 'dropped' | 'suspended'
  progress_pct: number
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export interface ContentItem {
  id: string
  module_id: string
  tenant_id: string
  title: string
  content_type: ContentType
  body: string | null
  file_url: string | null
  external_url: string | null
  duration_mins: number | null
  sort_order: number
  is_mandatory: boolean
  points_value: number
  created_at: string
}

export interface ContentProgress {
  id: string
  content_item_id: string
  user_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  score: number | null
  time_spent_secs: number
  attempts: number
  completed_at: string | null
}

export interface Question {
  id: string
  bank_id: string
  tenant_id: string
  type: QuestionType
  stem: string
  options: QuestionOption[]
  correct_answer: unknown
  explanation: string | null
  points: number
  difficulty: 'easy' | 'medium' | 'hard' | null
  tags: string[]
  bloom_level: string | null
  media_url: string | null
  created_at: string
}

export interface QuestionOption {
  id: string
  text: string
  is_correct: boolean
  feedback?: string
}

export interface Assessment {
  id: string
  content_item_id: string | null
  tenant_id: string
  title: string
  instructions: string | null
  time_limit_mins: number | null
  max_attempts: number
  passing_score: number
  shuffle_questions: boolean
  shuffle_options: boolean
  show_results: 'after_submit' | 'after_due' | 'never'
  due_at: string | null
  question_ids: string[]
  created_by: string | null
  created_at: string
}

export interface AssessmentAttempt {
  id: string
  assessment_id: string
  user_id: string
  tenant_id: string
  attempt_number: number
  status: 'in_progress' | 'submitted' | 'graded' | 'timed_out'
  answers: Record<string, unknown>
  score: number | null
  max_score: number | null
  passed: boolean | null
  time_taken_secs: number | null
  started_at: string
  submitted_at: string | null
}

export interface GradeItem {
  id: string
  course_id: string
  tenant_id: string
  title: string
  category: string
  weight: number
  max_points: number
  due_at: string | null
  sort_order: number
}

export interface Grade {
  id: string
  grade_item_id: string
  user_id: string
  tenant_id: string
  points_earned: number | null
  letter_grade: string | null
  feedback: string | null
  graded_at: string | null
  is_excused: boolean
  override: boolean
}

export interface Badge {
  id: string
  tenant_id: string
  name: string
  description: string | null
  icon_url: string | null
  criteria: Record<string, unknown>
  points_value: number
  rarity: BadgeRarity
  is_active: boolean
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  tenant_id: string
  earned_at: string
  badge?: Badge
}

export interface Forum {
  id: string
  tenant_id: string
  course_id: string | null
  title: string
  description: string | null
  is_general: boolean
  sort_order: number
  created_at: string
}

export interface Thread {
  id: string
  forum_id: string
  tenant_id: string
  author_id: string
  title: string
  body: string
  is_pinned: boolean
  is_locked: boolean
  is_resolved: boolean
  view_count: number
  reply_count: number
  last_reply_at: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Post {
  id: string
  thread_id: string
  tenant_id: string
  author_id: string
  parent_id: string | null
  body: string
  is_solution: boolean
  reactions: Record<string, number>
  is_deleted: boolean
  created_at: string
  author?: Profile
}

export interface Notification {
  id: string
  tenant_id: string
  user_id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

export interface LearningPath {
  id: string
  tenant_id: string
  title: string
  description: string | null
  course_id: string | null
  is_adaptive: boolean
  created_at: string
}

export interface PathNode {
  id: string
  path_id: string
  content_item_id: string | null
  assessment_id: string | null
  title: string
  position_x: number
  position_y: number
  node_type: 'start' | 'content' | 'assessment' | 'branch' | 'end'
  unlock_rules: Record<string, unknown>
}

export interface UserDailyStat {
  user_id: string
  tenant_id: string
  stat_date: string
  minutes_active: number
  items_completed: number
  points_earned: number
  logins: number
  risk_score: number
  risk_factors: Record<string, unknown>
}
