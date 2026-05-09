import { useEffect, useState } from 'react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { supabase } from '@/lib/supabase'
import { Calendar, ExternalLink } from 'lucide-react'

interface CalEvent {
  id: string
  title: string
  description: string
  category: string
  start_date: string
  end_date: string | null
  location: string
}

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

const categoryConfig: Record<string, { color: string; dot: string }> = {
  term: { color: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-500' },
  exam: { color: 'bg-rose-50 border-rose-200 text-rose-800', dot: 'bg-rose-500' },
  event: { color: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500' },
  holiday: { color: 'bg-sky-50 border-sky-200 text-sky-800', dot: 'bg-sky-500' },
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatEventDate(start: string, end: string | null): string {
  const s = new Date(start)
  if (!end || end === start) return s.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const e = new Date(end)
  return `${s.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} – ${e.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

export function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase
      .from('website_events')
      .select('id, title, description, category, start_date, end_date, location')
      .eq('tenant_id', DEMO_TENANT)
      .eq('is_published', true)
      .order('start_date')
      .then(({ data }) => {
        setEvents(data ?? [])
        setLoading(false)
      })
  }, [])

  const categories = ['all', 'term', 'exam', 'event', 'holiday']
  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter)

  // Group by month
  const byMonth: Record<string, CalEvent[]> = {}
  filtered.forEach(ev => {
    const month = months[new Date(ev.start_date).getMonth()]
    if (!byMonth[month]) byMonth[month] = []
    byMonth[month].push(ev)
  })

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Oakridge+Academy+Events`

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">School Calendar</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Academic Calendar 2026</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Key term dates, examination periods, school events, and public holidays for the current academic year.
          </p>
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Sync to Google Calendar
          </a>
        </div>
      </section>

      {/* Legend + filter */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2 mr-auto">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === c ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'All Events' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            {Object.entries(categoryConfig).map(([cat, cfg]) => (
              <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-600 capitalize">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(byMonth).map(([month, evts]) => (
                <div key={month}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-brand-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{month} 2026</h2>
                  </div>
                  <div className="space-y-3">
                    {evts.map(ev => {
                      const cfg = categoryConfig[ev.category] ?? { color: 'bg-slate-50 border-slate-200 text-slate-800', dot: 'bg-slate-400' }
                      return (
                        <div key={ev.id} className={`rounded-xl border p-4 flex gap-4 items-start ${cfg.color}`}>
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <h3 className="font-semibold text-sm">{ev.title}</h3>
                              <span className="text-xs opacity-70 shrink-0">{formatEventDate(ev.start_date, ev.end_date)}</span>
                            </div>
                            {ev.description && <p className="text-xs opacity-80 mt-1 leading-relaxed">{ev.description}</p>}
                            {ev.location && ev.location !== 'N/A' && (
                              <div className="text-xs opacity-60 mt-1">📍 {ev.location}</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </WebsiteLayout>
  )
}
