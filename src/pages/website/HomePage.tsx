import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Award, ChartBar as BarChart2, Shield, Brain, Globe, ChevronRight, GraduationCap, Users, Star, CircleCheck, Zap, Calendar, Newspaper, CirclePlay as PlayCircle } from 'lucide-react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { useTenantSettings } from '@/hooks/useTenantSettings'

const features = [
  { icon: BookOpen, title: 'World-Class Curriculum', desc: 'Cambridge IGCSE, A-Levels, and Nigerian National Curriculum delivered by expert educators.' },
  { icon: Brain, title: 'Innovation & Technology', desc: 'Fully equipped STEM lab, robotics programme, and 1:1 device programme from Year 7.' },
  { icon: Award, title: 'Extra-Curricular Excellence', desc: '18 sports, 12 clubs, and a nationally acclaimed arts and music programme.' },
  { icon: Shield, title: 'Safe & Nurturing Environment', desc: '24/7 security, pastoral care team, and an award-winning safeguarding programme.' },
  { icon: BarChart2, title: 'Proven Academic Results', desc: 'Consistently ranking in the top 5 schools nationally for examination performance.' },
  { icon: Globe, title: 'Global Community', desc: 'Students from 28 nationalities preparing for universities on every continent.' },
]

const programs = [
  { level: 'Primary (KG–Year 6)', age: 'Ages 4–11', desc: 'Inquiry-based learning that builds confidence, curiosity, and core literacy & numeracy skills.', color: 'bg-sky-50 border-sky-200 text-sky-700' },
  { level: 'Junior Secondary (JSS1–3)', age: 'Ages 11–14', desc: 'Broad curriculum covering STEM, humanities, arts, and language in preparation for specialisation.', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { level: 'Senior Secondary (IGCSE)', age: 'Ages 14–16', desc: 'Cambridge International GCSE with up to 12 subject choices and extensive exam preparation.', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { level: 'Sixth Form (A-Levels)', age: 'Ages 16–18', desc: 'Cambridge A-Levels with dedicated university counselling and UCAS/Common App support.', color: 'bg-rose-50 border-rose-200 text-rose-700' },
]

const news = [
  {
    title: 'Oakridge Sweeps National Coding Championship',
    category: 'Achievement',
    date: 'Apr 28, 2026',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
    to: '/news',
  },
  {
    title: 'IGCSE Results 2025: 97% Pass Rate',
    category: 'Academics',
    date: 'Mar 15, 2026',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg',
    to: '/news',
  },
  {
    title: 'New STEM Lab Opens — Powered by Solar Energy',
    category: 'Campus',
    date: 'Feb 1, 2026',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg',
    to: '/news',
  },
]

const testimonials = [
  { name: 'Mrs. Adaeze Okeke', role: 'Parent, Year 10', quote: 'The teaching quality and pastoral care at Oakridge are second to none. My daughter grew academically and as a person.', avatar: 'AO' },
  { name: 'Tobi Adeyinka', role: 'Class of 2024 – Now at UCL', quote: 'Oakridge gave me the academic rigour and confidence to secure a place at one of the world\'s top universities.', avatar: 'TA' },
  { name: 'Mr. Chukwuemeka Eze', role: 'Parent, JSS2 & SS1', quote: 'The EduFlow portal makes it easy to track both my children\'s progress in real time. Truly a modern school.', avatar: 'CE' },
]

export function HomePage() {
  const { settings } = useTenantSettings()
  const { homepage, branding } = settings

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url('${homepage.hero_image_url || 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/20">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Ranked #1 Private School in Lagos, 2025
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-6">
              {homepage.hero_headline}
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-xl">
              {homepage.hero_subtext}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg text-base"
              >
                Apply for 2026/2027
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all text-base"
              >
                <PlayCircle className="w-4 h-4" />
                Virtual Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Principal welcome card */}
        <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 w-72">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-white">
            {homepage.principal_photo_url && (
              <img
                src={homepage.principal_photo_url}
                alt={homepage.principal_name}
                className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white/30"
              />
            )}
            <blockquote className="text-sm leading-relaxed text-slate-200 italic mb-4">
              "{homepage.principal_quote}"
            </blockquote>
            <div>
              <div className="text-sm font-semibold">{homepage.principal_name}</div>
              <div className="text-xs text-slate-400">{homepage.principal_title}, {branding.school_name}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {homepage.stats.map(s => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-brand-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Oakridge */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Families Choose Oakridge</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">A holistic education that prepares students for life, not just exams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all">
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

      {/* Programs */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Academic Programmes</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">From early years through A-Levels, a structured pathway to university.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map(p => (
              <div key={p.level} className={`rounded-2xl border p-6 ${p.color.split(' ').slice(0, 2).join(' ')}`}>
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${p.color}`}>{p.age}</div>
                <h3 className="font-bold text-slate-900 mb-3 text-base">{p.level}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{p.desc}</p>
                <Link to="/curriculum" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News + Calendar teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Latest News</h2>
                  <p className="text-slate-500 text-sm mt-1">Stories from our school community</p>
                </div>
                <Link to="/news" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                  All stories <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-6">
                {news.map(n => (
                  <Link key={n.title} to={n.to as any} className="flex gap-4 group">
                    <img src={n.image} alt={n.title} className="w-24 h-20 rounded-xl object-cover shrink-0 group-hover:opacity-90 transition-opacity" />
                    <div>
                      <div className="text-xs font-semibold text-brand-600 mb-1">{n.category}</div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors mb-1">{n.title}</h3>
                      <div className="text-xs text-slate-400">{n.date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Upcoming</h2>
                  <p className="text-slate-500 text-sm mt-1">Key dates this term</p>
                </div>
                <Link to="/calendar" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                  Full calendar <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { date: 'May 11', title: 'Term 3 Begins', type: 'term' },
                  { date: 'May 25–29', title: 'Mid-Term Exams', type: 'exam' },
                  { date: 'Jun 7', title: 'Founders Day Celebration', type: 'event' },
                  { date: 'Jun 15–26', title: 'IGCSE Mock Exams', type: 'exam' },
                  { date: 'Jun 20', title: 'Parent-Teacher Conference', type: 'event' },
                  { date: 'Jul 18', title: 'Graduation Ceremony', type: 'term' },
                ].map(e => (
                  <div key={e.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="text-center w-12 shrink-0">
                      <div className="text-xs font-bold text-brand-600">{e.date.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-500">{e.date.split(' ').slice(1).join(' ')}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{e.title}</div>
                      <div className={`text-xs mt-0.5 font-medium ${
                        e.type === 'exam' ? 'text-rose-500' : e.type === 'term' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {e.type === 'exam' ? 'Examination' : e.type === 'term' ? 'Term Date' : 'School Event'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Community Says</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-slate-700 leading-relaxed text-sm mb-6 italic">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
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

      {/* Gallery teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Life at Oakridge</h2>
              <p className="text-slate-500">A vibrant campus where learning never stops</p>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
              View gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg',
              'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg',
              'https://images.pexels.com/photos/163487/pexels-photo-163487.jpeg',
              'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? 'md:row-span-2' : ''}`}>
                <img src={src} alt="Campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" style={{ minHeight: i === 0 ? 280 : 130 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <GraduationCap className="w-16 h-16 text-white/40 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Begin Your Oakridge Journey</h2>
          <p className="text-brand-200 text-lg mb-10">
            Applications for the 2026/2027 academic year are open. Limited places available.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8 py-4 rounded-xl transition-all text-base shadow-lg"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-4 rounded-xl border border-brand-500 transition-all text-base"
            >
              Book a School Tour
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
