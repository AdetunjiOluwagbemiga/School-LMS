import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Profile, AppRole, Tenant } from '@/types'

interface AuthState {
  user: User | null
  profile: Profile | null
  roles: AppRole[]
  activeRole: AppRole | null
  tenant: Tenant | null
  tenantId: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setRoles: (roles: AppRole[]) => void
  setTenant: (tenant: Tenant | null) => void
  setActiveRole: (role: AppRole | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  roles: [],
  activeRole: null,
  tenant: null,
  tenantId: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, tenantId: profile?.tenant_id ?? null }),
  setRoles: (roles) => set({
    roles,
    activeRole: roles[0] ?? null,
  }),
  setTenant: (tenant) => set({ tenant }),
  setActiveRole: (activeRole) => set({ activeRole }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({
    user: null,
    profile: null,
    roles: [],
    activeRole: null,
    tenant: null,
    tenantId: null,
    isLoading: false,
  }),
}))
