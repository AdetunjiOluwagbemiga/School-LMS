import { useEffect, useState } from 'react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Calendar, Tag } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  image_url: string
  author_name: string
  published_at: string
}

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

const categoryColors: Record<string, string> = {
  achievement: 'bg-amber-100 text-amber-700',
  academics: 'bg-brand-100 text-brand-700',
  campus: 'bg-emerald-100 text-emerald-700',
  sports: 'bg-rose-100 text-rose-700',
  admissions: 'bg-sky-100 text-sky-700',
  news: 'bg-slate-100 text-slate-600',
}

export function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    supabase
      .from('website_news')
      .select('id, title, slug, excerpt, category, image_url, author_name, published_at')
      .eq('tenant_id', DEMO_TENANT)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setNews(data ?? [])
        setLoading(false)
      })
  }, [])

  const categories = ['all', ...Array.from(new Set(news.map(n => n.category)))]
  const filtered = activeCategory === 'all' ? news : news.filter(n => n.category === activeCategory)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">School News</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">News &amp; Stories</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Celebrating achievements, sharing stories, and keeping our community informed.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                activeCategory === c ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse ${i === 0 ? 'md:col-span-3' : ''}`}>
                  <div className={`bg-slate-200 ${i === 0 ? 'h-72' : 'h-44'}`} />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No articles in this category yet.</div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="mb-8 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2">
                  {featured.image_url && (
                    <img src={featured.image_url} alt={featured.title} className="w-full h-64 lg:h-auto object-cover" />
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[featured.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {featured.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(featured.published_at)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">{featured.title}</h2>
                    <p className="text-slate-600 leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {featured.author_name}
                    </div>
                  </div>
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(n => (
                    <div key={n.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {n.image_url && (
                        <img src={n.image_url} alt={n.title} className="w-full h-44 object-cover" />
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${categoryColors[n.category] ?? 'bg-slate-100 text-slate-600'}`}>
                            {n.category}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(n.published_at)}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 leading-snug">{n.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{n.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </WebsiteLayout>
  )
}
