import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Award, BookOpen, Globe, Shield, Users, CircleCheck as CheckCircle } from 'lucide-react'
import { useTenantSettings } from '@/hooks/useTenantSettings'

const values = [
  { icon: BookOpen, title: 'Academic Excellence', desc: 'We set high expectations and provide the support every student needs to exceed them.' },
  { icon: Shield, title: 'Integrity & Character', desc: 'Honesty, respect, and responsibility are at the heart of everything we do.' },
  { icon: Globe, title: 'Global Citizenship', desc: 'We cultivate open-minded, culturally aware graduates ready to lead on the world stage.' },
  { icon: Users, title: 'Inclusive Community', desc: 'Every student, regardless of background, is valued and empowered to succeed.' },
  { icon: Award, title: 'Innovation', desc: 'We embrace new ideas and technologies to prepare students for careers that don\'t yet exist.' },
]

const accreditations = [
  'Cambridge Assessment International Education (CAIE)',
  'West African Examinations Council (WAEC)',
  'National Examinations Council (NECO)',
  'British Council – International School Partner',
  'ISO 9001:2015 Quality Management Certified',
  'ADE (Association of Distinguished Educators) Member',
]

const milestones = [
  { year: '1980', event: 'Oakridge Academy founded by Chief Emeka Obi with 45 students.' },
  { year: '1995', event: 'First cohort of Cambridge IGCSE students achieve 100% pass rate.' },
  { year: '2005', event: 'New campus opens on Innovation Drive, tripling capacity to 800 students.' },
  { year: '2012', event: 'Sixth Form (A-Level) programme launched. First students accepted to Oxbridge.' },
  { year: '2019', event: 'Dr. Chidera Adeyemi appointed as Principal. Digital transformation begins.' },
  { year: '2024', event: 'STEM Innovation Lab opened. National Coding Championship won for the first time.' },
  { year: '2026', event: 'EduFlow LMS launched. 1,200 students across Primary, JSS, SS, and Sixth Form.' },
]

export function AboutPage() {
  const { settings } = useTenantSettings()
  const { pages } = settings

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">About Oakridge</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Our Story, Mission &amp; Values</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            For 45 years, Oakridge Academy has been shaping the minds and characters of Nigeria's future leaders.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              {pages.about_mission}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-10">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {pages.about_vision}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src="https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg" alt="Campus" className="w-full h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our History</h2>
            <p className="text-slate-500">45 years of shaping exceptional graduates</p>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-8">
              {milestones.map(m => (
                <div key={m.year} className="flex gap-8 items-start">
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-sm font-bold text-brand-600">{m.year}</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-brand-600 mt-1 shrink-0 relative z-10" />
                  <p className="text-slate-700 text-sm leading-relaxed pb-2">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Accreditations &amp; Certifications</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We meet the highest international standards in education quality and governance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accreditations.map(a => (
              <div key={a} className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam results */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Academic Performance</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A consistent record of excellence in national and international examinations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { exam: 'Cambridge IGCSE 2025', stat: '97%', label: 'A*–C pass rate', detail: 'Top 5% nationally' },
              { exam: 'WAEC / NECO 2025', stat: '99%', label: 'Credits in 5+ subjects', detail: 'Including English & Maths' },
              { exam: 'University Placement 2025', stat: '98%', label: 'Accepted to top universities', detail: 'UK, USA, Canada & local' },
            ].map(r => (
              <div key={r.exam} className="bg-brand-50 rounded-2xl border border-brand-100 p-8 text-center">
                <div className="text-sm font-semibold text-brand-600 mb-4">{r.exam}</div>
                <div className="text-5xl font-extrabold text-slate-900 mb-2">{r.stat}</div>
                <div className="text-slate-700 font-medium mb-1">{r.label}</div>
                <div className="text-xs text-slate-500">{r.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to be part of the Oakridge story?</h2>
        <Link to="/admissions" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors mt-2">
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </WebsiteLayout>
  )
}
