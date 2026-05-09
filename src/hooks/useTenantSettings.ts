import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface TenantBranding {
  school_name: string
  tagline: string
  logo_url: string
  primary_color: string
  phone: string
  email: string
  address: string
  office_hours: string
}

export interface TenantHomepage {
  hero_headline: string
  hero_subtext: string
  hero_image_url: string
  principal_name: string
  principal_title: string
  principal_photo_url: string
  principal_quote: string
  stats: Array<{ label: string; value: string }>
}

export interface TenantPages {
  about_mission: string
  about_vision: string
  admissions_intro: string
  contact_intro: string
}

export interface TenantSettings {
  branding: TenantBranding
  homepage: TenantHomepage
  pages: TenantPages
}

const DEFAULT_SETTINGS: TenantSettings = {
  branding: {
    school_name: 'Oakridge Academy',
    tagline: 'Excellence in Education',
    logo_url: '',
    primary_color: '#2563eb',
    phone: '+234 801 234 5678',
    email: 'info@oakridgeacademy.edu',
    address: '12 Innovation Drive, Victoria Island, Lagos',
    office_hours: 'Mon-Fri: 7:30 AM - 5:00 PM',
  },
  homepage: {
    hero_headline: "Shaping Tomorrow's Leaders, Today",
    hero_subtext: 'A world-class British-curriculum school in the heart of Lagos, combining academic rigour with character development since 2008.',
    hero_image_url: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    principal_name: 'Dr. Adaeze Okonkwo',
    principal_title: 'Principal & CEO',
    principal_photo_url: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg',
    principal_quote: 'At Oakridge, we believe every child has limitless potential. Our role is to unlock it through outstanding teaching, a rich curriculum, and a culture of excellence.',
    stats: [
      { label: 'Students Enrolled', value: '1,200+' },
      { label: 'Qualified Teachers', value: '85' },
      { label: 'IGCSE Pass Rate', value: '97%' },
      { label: 'Years of Excellence', value: '17' },
    ],
  },
  pages: {
    about_mission: 'To provide an outstanding British-standard education that develops the intellectual, moral, and social capabilities of every learner, preparing them for success in a global society.',
    about_vision: "To be Africa's most innovative and inclusive school, recognised for producing confident, compassionate, and globally-competitive graduates.",
    admissions_intro: 'We welcome applications from talented students across all backgrounds. Our admissions process is designed to identify potential and match learners to the programme that best suits their abilities.',
    contact_intro: "We'd love to hear from you. Whether you're a prospective family, current parent, or alumni — our team is here to help.",
  },
}

const DEMO_TENANT = 'a0000000-0000-0000-0000-000000000001'

function deepMerge(defaults: TenantSettings, overrides: Partial<TenantSettings>): TenantSettings {
  return {
    branding: { ...defaults.branding, ...(overrides.branding ?? {}) },
    homepage: {
      ...defaults.homepage,
      ...(overrides.homepage ?? {}),
      stats: (overrides.homepage?.stats ?? defaults.homepage.stats),
    },
    pages: { ...defaults.pages, ...(overrides.pages ?? {}) },
  }
}

export function useTenantSettings(tenantId: string = DEMO_TENANT) {
  const [settings, setSettings] = useState<TenantSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tenant_settings')
      .select('settings')
      .eq('tenant_id', tenantId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.settings) {
          setSettings(deepMerge(DEFAULT_SETTINGS, data.settings as Partial<TenantSettings>))
        }
        setLoading(false)
      })
  }, [tenantId])

  return { settings, loading, defaults: DEFAULT_SETTINGS }
}
