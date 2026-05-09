import { Link } from '@tanstack/react-router'
import { BookOpen, ChartBar as BarChart2, Users, Award, Shield, Globe, ChevronRight, GraduationCap, Layers, Zap, CircleCheck as CheckCircle, ArrowRight, Star, TrendingUp, Brain, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Blended Course Management',
    desc: 'Build rich courses with video, quizzes, SCORM packages, and live sessions in one unified platform.',
  },
  {
    icon: Brain,
    title: 'Adaptive Learning Paths',
    desc: 'AI-driven paths that adjust to each learner — unlock modules conditionally based on performance.',
  },
  {
    icon: BarChart2,
    title: 'Predictive Analytics',
    desc: 'Identify at-risk students early with engagement heatmaps, grade trends, and automated alerts.',
  },
  {
    icon: Award,
    title: 'Gamification Engine',
    desc: 'XP points, rarity-tiered badges, and leaderboards that keep students motivated every day.',
  },
  {
    icon: Shield,
    title: 'GDPR & NDPA Compliant',
    desc: 'Built-in consent records, audit logs, data export, and right-to-erasure flows out of the box.',
  },
  {
    icon: Globe,
    title: 'Multi-Tenant Ready',
    desc: 'Serve hundreds of schools from one instance, each with custom branding and isolated data.',
  },
]

const audiences = [
  {
    role: 'Students',
    icon: GraduationCap,
    color: 'bg-sky-50 border-sky-200',
    iconColor: 'text-sky-600',
    points: [
      'Interactive lessons and self-paced content',
      'Real-time progress tracking and XP rewards',
      'Discussion forums and peer collaboration',
      'Mobile-first experience on any device',
    ],
  },
  {
    role: 'Teachers',
    icon: Layers,
    color: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    points: [
      'Drag-and-drop course and module builder',
      'Inline gradebook with bulk import/export',
      'Class analytics and engagement reports',
      'Question bank with randomised assessments',
    ],
  },
  {
    role: 'Administrators',
    icon: TrendingUp,
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    points: [
      'School-wide enrolment and user management',
      'GDPR compliance dashboard and audit trail',
      'Cross-school reporting and data exports',
      'SSO via Google Workspace and Microsoft 365',
    ],
  },
]

const stats = [
  { value: '50,000+', label: 'Active Learners' },
  { value: '1,200+', label: 'Courses Published' },
  { value: '98%', label: 'Uptime SLA' },
  { value: '40+', label: 'Countries' },
]

const testimonials = [
  {
    name: 'Dr. Amara Osei',
    role: 'Head of Curriculum, Oakridge Academy',
    quote: 'EduFlow transformed how our teachers build and deliver lessons. The analytics alone saved us hours every week.',
    avatar: 'AO',
  },
  {
    name: 'Marcus Lindqvist',
    role: 'IT Director, Nordic Schools Group',
    quote: 'Deploying across 14 schools was seamless. Multi-tenancy and SSO worked out of the box — truly enterprise-grade.',
    avatar: 'ML',
  },
  {
    name: 'Priya Nair',
    role: 'Grade 11 Student',
    quote: 'I love the badges and XP system. It actually makes me want to finish my assignments on time!',
    avatar: 'PN',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">EduFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#for-who" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Who It's For</a>
            <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Stories</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors px-4 py-2 rounded-lg flex items-center gap-1.5"
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-32">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-50 opacity-60" />
          <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-sky-50 opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-brand-100">
            <Zap className="w-3.5 h-3.5" />
            The Future of Learning is Adaptive
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
            Education That<br />
            <span className="text-brand-600">Moves With You</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A world-class LMS built for modern schools — SCORM-ready, gamified,
            GDPR-compliant, and designed to help every student reach their potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-brand-200 hover:shadow-brand-300 hover:-translate-y-0.5 text-base"
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-xl border border-slate-200 transition-all text-base"
            >
              Sign In to Your School
            </Link>
          </div>

          {/* Hero image / mockup */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800 border-b border-slate-700">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="ml-3 flex-1 bg-slate-700 rounded-md h-5 max-w-xs text-xs text-slate-400 flex items-center px-3">
                  app.eduflow.io/app/learn/dashboard
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="bg-slate-50 p-6 grid grid-cols-3 gap-4 text-left">
                {/* Sidebar mock */}
                <div className="bg-slate-900 rounded-xl p-4 space-y-3">
                  <div className="h-8 w-24 bg-brand-600 rounded-md" />
                  {['Dashboard', 'My Courses', 'Learning Path', 'Badges', 'Forums'].map(label => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-700 rounded" />
                      <span className="text-xs text-slate-400">{label}</span>
                    </div>
                  ))}
                </div>
                {/* Main content mock */}
                <div className="col-span-2 space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-700 mb-3">Active Courses</div>
                    {[
                      { title: 'Advanced Mathematics', pct: 72, color: 'bg-brand-500' },
                      { title: 'World History', pct: 45, color: 'bg-emerald-500' },
                      { title: 'English Literature', pct: 88, color: 'bg-amber-500' },
                    ].map(c => (
                      <div key={c.title} className="mb-2">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>{c.title}</span><span>{c.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'XP Earned', value: '2,840', color: 'text-brand-600' },
                      { label: 'Badges', value: '12', color: 'text-amber-600' },
                    ].map(s => (
                      <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="text-xs text-slate-500">{s.label}</div>
                        <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-brand-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything a Modern School Needs</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              From content delivery to compliance, EduFlow covers the entire academic lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <f.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section id="for-who" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for Everyone in Your School</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Role-based dashboards mean each person only sees what matters to them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map(a => (
              <div key={a.role} className={`rounded-2xl border p-8 ${a.color}`}>
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm`}>
                  <a.icon className={`w-6 h-6 ${a.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-5">For {a.role}</h3>
                <ul className="space-y-3">
                  {a.points.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Schools Worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed text-sm mb-6">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Learning?</h2>
          <p className="text-slate-400 text-lg mb-10">
            Join thousands of educators already using EduFlow. Set up your school in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              Create Your School
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-8 py-4 rounded-xl border border-slate-700 transition-all text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">EduFlow</span>
          </div>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'GDPR', 'Contact'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-slate-600">© 2026 EduFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
