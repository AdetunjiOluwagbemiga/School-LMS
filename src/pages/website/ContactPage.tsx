import { useState } from 'react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { supabase } from '@/lib/supabase'
import { Phone, Mail, MapPin, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, ArrowRight } from 'lucide-react'

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

const contactInfo = [
  { icon: Phone, label: 'Main Office', value: '+234 801 234 5678', href: 'tel:+2348012345678' },
  { icon: Phone, label: 'Admissions', value: '+234 801 234 5679', href: 'tel:+2348012345679' },
  { icon: Mail, label: 'General Enquiries', value: 'info@oakridgeacademy.edu', href: 'mailto:info@oakridgeacademy.edu' },
  { icon: Mail, label: 'Admissions', value: 'admissions@oakridgeacademy.edu', href: 'mailto:admissions@oakridgeacademy.edu' },
  { icon: MapPin, label: 'Address', value: '12 Innovation Drive, Victoria Island, Lagos, Nigeria', href: 'https://maps.google.com' },
  { icon: Clock, label: 'Office Hours', value: 'Mon–Fri: 7:30 AM – 5:00 PM', href: null },
]

export function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', subject: '', message: '', inquiry_type: 'general' })
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
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Contact Us</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            We'd love to hear from you. Whether you're a prospective family, current parent, or alumni — our team is here to help.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact details + map */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>
            <div className="space-y-5 mb-10">
              {contactInfo.map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-0.5">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sm text-slate-900 hover:text-brand-600 transition-colors">
                        {c.value}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-900">{c.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Embedded map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <iframe
                title="Oakridge Academy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.721!2d3.4228!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjUnNDEuMiJOIDPCsDI1JzIyLjEiRQ!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Inquiry form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send Us a Message</h2>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">Thank you for getting in touch. A member of our team will respond within 24 hours during school days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      required
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Your full name"
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
                      placeholder="your@email.com"
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
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Enquiry Type</label>
                    <select
                      value={form.inquiry_type}
                      onChange={e => setForm(f => ({ ...f, inquiry_type: e.target.value }))}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="general">General Enquiry</option>
                      <option value="admissions">Admissions</option>
                      <option value="fees">Fees & Finance</option>
                      <option value="academics">Academic Matters</option>
                      <option value="pastoral">Pastoral / Welfare</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject *</label>
                  <input
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={5}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full h-12 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                  {!sending && <ArrowRight className="w-4 h-4" />}
                </button>
                <p className="text-xs text-slate-400 text-center">
                  We respond to all messages within 24 hours on school days.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
