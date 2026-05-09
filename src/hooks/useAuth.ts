import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { AppRole } from '@/types'

export function useAuthInit() {
  const { setUser, setProfile, setRoles, setTenant, setLoading, reset } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserData(session.user.id)
      } else {
        reset()
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_OUT' || !session) {
          reset()
        } else if (session?.user) {
          await loadUserData(session.user.id)
        }
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId: string) {
    setLoading(true)
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (profile) {
        setProfile(profile)

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)

        const roleList = (roles?.map((r) => r.role) ?? []) as AppRole[]
        setRoles(roleList)

        if (profile.tenant_id) {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', profile.tenant_id)
            .maybeSingle()
          setTenant(tenant)
        }
      }
    } finally {
      setLoading(false)
    }
  }
}

export function useAuth() {
  return useAuthStore()
}
