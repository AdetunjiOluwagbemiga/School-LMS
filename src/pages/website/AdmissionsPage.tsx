import { useState } from 'react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CircleCheck as CheckCircle, Download, CircleAlert as AlertCircle } from 'lucide-react'

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

const fees = [
  { level: 'Kindergarten (KG1–KG3)', termly: '₦650,000', annual: '₦1,950,000', note: 'Includes uniforms & stationery' },
  { level: 'Primary (Year 1–6)', termly: '₦750,000', annual: '₦2,250,000', note: '' },
  { level: 'Junior Secondary (JSS1–3)', termly: '₦850,000', annual: '₦2,550,000', note: '' },
  { level: 'Senior Secondary / IGCSE', termly: '₦1,100,000', annual: '₦3,300,000', note: 'Cambridge exam fees separate' },
  { level: 'Sixth Form (A-Level)', termly: '₦1,350,000', annual: '₦4,050,000', note: 'Cambridge exam fees separate' },
]

const scholarships = [
  { name: 'Academic Excellence Scholarship', value: '50% fee waiver', criteria: 'Top 2% in entry examination across all applicants.' },
  { name: 'Merit Scholarship', value: '25% fee waiver', criteria: 'Top 5–10% in entry examination.' },
  { name: 'Sports Scholarship', value: '30% fee waiver', criteria: 'National/state-level recognition in a recognised sport.' },
  { name: 'Bursary (Need-Based)', value: 'Up to 50%', criteria: 'Demonstrated financial need. Full documentation required.' },
]

const steps = [
  { num: '01', title: 'Submit Application', desc: 'Complete the online form below. No application fee required.' },
  { num: '02', title: 'Entrance Assessment', desc: 'Candidates are invited for written assessments in English and Mathematics.' },
  { num: '03', title: 'Interview', desc: 'Shortlisted candidates and their parents attend a brief interview with the Admissions team.' },
  { num: '04', title: 'Offer Letter', desc: 'Successful candidates receive a conditional offer with fee acceptance details.' },
  { num: '05', title: 'Enrolment', desc: 'Complete enrolment by paying the acceptance deposit and submitting required documents.' },
]

export function AdmissionsPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', subject: 'Admissions Enquiry', message: '', inquiry_type: 'admissions' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    const { error: err } = await supabase.from('website_inquiries').insert({ ...form, tenant_id: DEMO_TENANT })
    setSending(false)
    if (err) { setError('Something went wrong. Please try again.'); return }
    setSent(true)
  }

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Admissions</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Join Oakridge Academy</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Applications for the 2026/2027 academic year are open. We welcome students from all backgrounds who share our commitment to excellence.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Admissions Process</h2>
            <p className="text-slate-500">Five straightforward steps to joining our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center relative">
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-slate-200 -translate-x-1/2 z-0" />}
                <div className="w-16 h-16 rounded-full bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-brand-100">
                  {s.num}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section id="fees" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fee Schedule 2026/2027</h2>
            <p className="text-slate-500">All fees are in Nigerian Naira and payable per term</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Level</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Per Term</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Per Year</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => (
                  <tr key={f.level} className={i % 2 === 0 ? '' : 'bg-slate-50/50'}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{f.level}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{f.termly}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-600">{f.annual}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-6 text-xs text-slate-500">
            <span>* Fees reviewed annually each March</span>
            <span>* Bus transport and lunch are billed separately</span>
          </div>

          <div className="mt-6 flex gap-4">
            <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors">
              <Download className="w-4 h-4" /> Download Full Fee Schedule (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section id="scholarships" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Scholarships &amp; Bursaries</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We believe that financial circumstances should never prevent a talented student from joining Oakridge.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map(s => (
              <div key={s.name} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                  <span className="text-sm font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full shrink-0">{s.value}</span>
                </div>
                <p className="text-sm text-slate-600">{s.criteria}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500 text-center">
            Scholarship applications close <strong>31 July 2026</strong>. Results communicated within 4 weeks.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Apply Now</h2>
            <p className="text-slate-500">Complete the form and our admissions team will contact you within 48 hours.</p>
          </div>

          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Application Received!</h3>
              <p className="text-slate-600">Thank you for your interest in Oakridge Academy. A member of our admissions team will be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent/Guardian Full Name *</label>
                  <input
                    required
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Mrs. Adaeze Okonkwo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="+234 801 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Year of Entry</label>
                  <select
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    onChange={e => setForm(f => ({ ...f, subject: `Admissions – ${e.target.value}` }))}
                  >
                    <option>2026/2027 – Term 1</option>
                    <option>2026/2027 – Term 2</option>
                    <option>2027/2028 – Term 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Child's Current Year Group &amp; Name</label>
                <input
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Year 6 – Chukwuemeka Okonkwo"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full h-12 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {sending ? 'Sending...' : 'Submit Application'}
                {!sending && <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-xs text-slate-400 text-center">
                By submitting, you agree to our Privacy Policy. We will never share your data with third parties.
              </p>
            </form>
          )}
        </div>
      </section>
    </WebsiteLayout>
  )
}
