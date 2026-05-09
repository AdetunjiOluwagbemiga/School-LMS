import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useTenantSettings } from '@/hooks/useTenantSettings'
import type { TenantSettings, TenantBranding, TenantHomepage, TenantPages } from '@/hooks/useTenantSettings'
import { Save, Globe, Palette, LayoutTemplate, Eye, Plus, Trash2, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react'

type Tab = 'branding' | 'homepage' | 'pages'

const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'homepage', label: 'Homepage', icon: LayoutTemplate },
  { id: 'pages', label: 'Page Content', icon: Globe },
]

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
    />
  )
}

function TextareaInput({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
    />
  )
}

function BrandingTab({ branding, onChange }: { branding: TenantBranding; onChange: (b: TenantBranding) => void }) {
  const set = (key: keyof TenantBranding) => (val: string) => onChange({ ...branding, [key]: val })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">School Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="School Name">
            <TextInput value={branding.school_name} onChange={set('school_name')} placeholder="e.g. Oakridge Academy" />
          </Field>
          <Field label="Tagline">
            <TextInput value={branding.tagline} onChange={set('tagline')} placeholder="e.g. Excellence in Education" />
          </Field>
          <Field label="Logo URL" hint="Paste a publicly accessible image URL (PNG/SVG recommended)">
            <TextInput value={branding.logo_url} onChange={set('logo_url')} placeholder="https://..." />
          </Field>
          <Field label="Primary Color" hint="Used for buttons, links, and accents across the site">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                <input
                  type="color"
                  value={branding.primary_color}
                  onChange={e => set('primary_color')(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div className="w-full h-full rounded-lg" style={{ backgroundColor: branding.primary_color }} />
              </div>
              <TextInput value={branding.primary_color} onChange={set('primary_color')} placeholder="#2563eb" />
            </div>
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Phone Number">
            <TextInput value={branding.phone} onChange={set('phone')} placeholder="+234 801 234 5678" />
          </Field>
          <Field label="Email Address">
            <TextInput value={branding.email} onChange={set('email')} type="email" placeholder="info@school.edu" />
          </Field>
          <Field label="Physical Address">
            <TextInput value={branding.address} onChange={set('address')} placeholder="12 Street Name, City" />
          </Field>
          <Field label="Office Hours">
            <TextInput value={branding.office_hours} onChange={set('office_hours')} placeholder="Mon-Fri: 8:00 AM - 4:00 PM" />
          </Field>
        </div>
      </div>
    </div>
  )
}

function HomepageTab({ homepage, onChange }: { homepage: TenantHomepage; onChange: (h: TenantHomepage) => void }) {
  const set = (key: keyof TenantHomepage) => (val: string) => onChange({ ...homepage, [key]: val })

  const updateStat = (i: number, field: 'label' | 'value', val: string) => {
    const stats = homepage.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    onChange({ ...homepage, stats })
  }
  const addStat = () => onChange({ ...homepage, stats: [...homepage.stats, { label: '', value: '' }] })
  const removeStat = (i: number) => onChange({ ...homepage, stats: homepage.stats.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Hero Section</h3>
        <div className="space-y-5">
          <Field label="Hero Headline">
            <TextInput value={homepage.hero_headline} onChange={set('hero_headline')} placeholder="Shaping Tomorrow's Leaders, Today" />
          </Field>
          <Field label="Hero Subtext">
            <TextareaInput value={homepage.hero_subtext} onChange={set('hero_subtext')} placeholder="A brief description of your school..." rows={2} />
          </Field>
          <Field label="Hero Background Image URL" hint="A high-quality landscape photo (1920×1080 minimum)">
            <TextInput value={homepage.hero_image_url} onChange={set('hero_image_url')} placeholder="https://images.pexels.com/..." />
          </Field>
          {homepage.hero_image_url && (
            <div className="rounded-xl overflow-hidden border border-slate-200 h-40">
              <img src={homepage.hero_image_url} alt="Hero preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Principal Spotlight</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Principal Name">
            <TextInput value={homepage.principal_name} onChange={set('principal_name')} placeholder="Dr. Jane Doe" />
          </Field>
          <Field label="Principal Title">
            <TextInput value={homepage.principal_title} onChange={set('principal_title')} placeholder="Principal & CEO" />
          </Field>
          <Field label="Principal Photo URL" hint="Square photo recommended">
            <TextInput value={homepage.principal_photo_url} onChange={set('principal_photo_url')} placeholder="https://..." />
          </Field>
          <div className="flex items-center justify-center">
            {homepage.principal_photo_url ? (
              <img src={homepage.principal_photo_url} alt="Principal" className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No photo</div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <Field label="Principal Quote">
            <TextareaInput value={homepage.principal_quote} onChange={set('principal_quote')} placeholder="A brief welcome message from the principal..." rows={3} />
          </Field>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">Key Stats</h3>
          <button onClick={addStat} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {homepage.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <TextInput value={stat.value} onChange={v => updateStat(i, 'value', v)} placeholder="e.g. 1,200+" />
                <TextInput value={stat.label} onChange={v => updateStat(i, 'label', v)} placeholder="e.g. Students Enrolled" />
              </div>
              <button onClick={() => removeStat(i)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {homepage.stats.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No stats yet. Click "Add Stat" to add one.</p>
        )}
      </div>
    </div>
  )
}

function PagesTab({ pages, onChange }: { pages: TenantPages; onChange: (p: TenantPages) => void }) {
  const set = (key: keyof TenantPages) => (val: string) => onChange({ ...pages, [key]: val })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">About Page</h3>
        <div className="space-y-5">
          <Field label="Mission Statement">
            <TextareaInput value={pages.about_mission} onChange={set('about_mission')} placeholder="To provide..." rows={3} />
          </Field>
          <Field label="Vision Statement">
            <TextareaInput value={pages.about_vision} onChange={set('about_vision')} placeholder="To be..." rows={3} />
          </Field>
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Admissions Page</h3>
        <Field label="Intro Text">
          <TextareaInput value={pages.admissions_intro} onChange={set('admissions_intro')} placeholder="We welcome applications from..." rows={3} />
        </Field>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Contact Page</h3>
        <Field label="Intro Text">
          <TextareaInput value={pages.contact_intro} onChange={set('contact_intro')} placeholder="We'd love to hear from you..." rows={3} />
        </Field>
      </div>
    </div>
  )
}

export function SiteEditorPage() {
  const { tenant } = useAuth()
  const tenantId = tenant?.id ?? 'a0000000-0000-0000-0000-000000000001'
  const { settings: saved, loading } = useTenantSettings(tenantId)

  const [activeTab, setActiveTab] = useState<Tab>('branding')
  const [draft, setDraft] = useState<TenantSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [saveError, setSaveError] = useState('')
  const colorApplyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!loading && !draft) setDraft(saved)
  }, [loading, saved])

  // Apply CSS variable for live color preview
  useEffect(() => {
    if (!draft) return
    if (colorApplyTimer.current) clearTimeout(colorApplyTimer.current)
    colorApplyTimer.current = setTimeout(() => {
      // no-op: color vars are driven by Tailwind config, preview only in editor
    }, 300)
  }, [draft?.branding.primary_color])

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setSaveError('')
    const { error } = await supabase
      .from('tenant_settings')
      .update({ settings: draft as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
    setSaving(false)
    if (error) {
      setSaveError('Failed to save. Please try again.')
    } else {
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    }
  }

  if (loading || !draft) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading settings...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Editor</h1>
          <p className="text-sm text-slate-500 mt-1">Customise your school's public website — branding, content, and more.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview Site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-60 px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Status messages */}
      {savedMsg && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Changes saved successfully. Refresh the public site to see them live.
        </div>
      )}
      {saveError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {saveError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {activeTab === 'branding' && (
          <BrandingTab branding={draft.branding} onChange={b => setDraft(d => d ? { ...d, branding: b } : d)} />
        )}
        {activeTab === 'homepage' && (
          <HomepageTab homepage={draft.homepage} onChange={h => setDraft(d => d ? { ...d, homepage: h } : d)} />
        )}
        {activeTab === 'pages' && (
          <PagesTab pages={draft.pages} onChange={p => setDraft(d => d ? { ...d, pages: p } : d)} />
        )}
      </div>

      {/* Bottom save bar */}
      <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-400">Changes are saved to your tenant and go live on the public website immediately.</p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-60 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
