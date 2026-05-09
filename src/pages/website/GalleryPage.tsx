import { useEffect, useState } from 'react'
import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { supabase } from '@/lib/supabase'
import { X, ZoomIn } from 'lucide-react'

interface GalleryItem {
  id: string
  album: string
  title: string
  caption: string
  media_url: string
  media_type: string
}

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAlbum, setActiveAlbum] = useState('All')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    supabase
      .from('website_gallery')
      .select('id, album, title, caption, media_url, media_type')
      .eq('tenant_id', DEMO_TENANT)
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setItems(data ?? [])
        setLoading(false)
      })
  }, [])

  const albums = ['All', ...Array.from(new Set(items.map(i => i.album)))]
  const filtered = activeAlbum === 'All' ? items : items.filter(i => i.album === activeAlbum)

  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Media Gallery</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Life at Oakridge</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            A window into our campus, events, and the vibrant community that makes Oakridge extraordinary.
          </p>
        </div>
      </section>

      {/* Album filter */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 flex-wrap">
          {albums.map(a => (
            <button
              key={a}
              onClick={() => setActiveAlbum(a)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeAlbum === a ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-xl animate-pulse" style={{ height: i % 3 === 0 ? 240 : 180 }} />
              ))}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="mb-4 break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setLightbox(item)}
                >
                  <img
                    src={item.media_url}
                    alt={item.caption || item.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs leading-snug">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.media_url}
              alt={lightbox.caption}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {lightbox.caption && (
              <p className="text-center text-slate-300 text-sm mt-4">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </WebsiteLayout>
  )
}
