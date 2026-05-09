import { useEffect, useState } from 'react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { supabase } from '@/lib/supabase'
import { Mail } from 'lucide-react'

interface StaffMember {
  id: string
  full_name: string
  title: string
  department: string
  bio: string
  photo_url: string
  email: string
}

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

const departments = ['All', 'Leadership', 'Sciences & Maths', 'Technology', 'Humanities', 'Sports', 'Student Welfare']

export function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDept, setActiveDept] = useState('All')

  useEffect(() => {
    supabase
      .from('website_staff')
      .select('id, full_name, title, department, bio, photo_url, email')
      .eq('tenant_id', DEMO_TENANT)
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setStaff(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = activeDept === 'All' ? staff : staff.filter(s => s.department === activeDept)

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Our Team</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Meet Our Staff</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Exceptional educators, coaches, and support staff who are passionate about every student's success.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 flex-wrap">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setActiveDept(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeDept === d
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="h-56 bg-slate-200" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    {s.photo_url ? (
                      <img
                        src={s.photo_url}
                        alt={s.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-300 text-4xl font-bold">
                        {s.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-0.5">{s.full_name}</h3>
                    <div className="text-sm text-brand-600 font-medium mb-1">{s.title}</div>
                    <div className="text-xs text-slate-400 mb-3">{s.department}</div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{s.bio}</p>
                    {s.email && (
                      <a
                        href={`mailto:${s.email}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {s.email}
                      </a>
                    )}
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
