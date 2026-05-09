import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard, BookOpen, Users, BarChart3, Award, MessageSquare,
  Settings, GraduationCap, ClipboardList, Star, BookMarked, Shield,
  Building2, ChevronRight, Bell, FileText, TrendingUp, Brain,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { AppRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

function getNavItems(role: AppRole | null): NavItem[] {
  switch (role) {
    case 'super_admin':
      return [
        { label: 'Dashboard', href: '/app/super/dashboard', icon: LayoutDashboard },
        { label: 'Schools', href: '/app/super/tenants', icon: Building2 },
        { label: 'Analytics', href: '/app/super/analytics', icon: BarChart3 },
      ]
    case 'school_admin':
      return [
        { label: 'Dashboard', href: '/app/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', href: '/app/admin/users', icon: Users },
        { label: 'Enrollments', href: '/app/admin/enrollments', icon: ClipboardList },
        { label: 'Reports', href: '/app/admin/reports', icon: FileText },
        { label: 'Compliance', href: '/app/admin/compliance', icon: Shield },
        { label: 'Branding', href: '/app/admin/branding', icon: Star },
      ]
    case 'teacher':
      return [
        { label: 'Dashboard', href: '/app/teach/dashboard', icon: LayoutDashboard },
        { label: 'My Courses', href: '/app/teach/courses', icon: BookOpen },
        { label: 'Gradebook', href: '/app/teach/gradebook', icon: ClipboardList },
        { label: 'Analytics', href: '/app/teach/analytics', icon: TrendingUp },
        { label: 'Question Banks', href: '/app/teach/questions', icon: Brain },
      ]
    case 'student':
      return [
        { label: 'Dashboard', href: '/app/learn/dashboard', icon: LayoutDashboard },
        { label: 'My Courses', href: '/app/learn/courses', icon: BookOpen },
        { label: 'Progress', href: '/app/learn/progress', icon: BarChart3 },
        { label: 'Badges', href: '/app/learn/badges', icon: Award },
        { label: 'Forums', href: '/app/learn/forums', icon: MessageSquare },
        { label: 'Learning Path', href: '/app/learn/path', icon: Brain },
      ]
    case 'parent':
      return [
        { label: 'Dashboard', href: '/app/parent/dashboard', icon: LayoutDashboard },
        { label: 'My Children', href: '/app/parent/children', icon: GraduationCap },
        { label: 'Reports', href: '/app/parent/reports', icon: BookMarked },
      ]
    default:
      return [
        { label: 'Dashboard', href: '/app/learn/dashboard', icon: LayoutDashboard },
      ]
  }
}

export function Sidebar() {
  const { activeRole, profile, tenant } = useAuth()
  const location = useLocation()
  const navItems = getNavItems(activeRole)

  return (
    <aside className="flex flex-col h-full bg-slate-900 text-white w-64 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              {tenant?.name ?? 'EduFlow'}
            </div>
            <div className="text-xs text-slate-400 capitalize">{activeRole?.replace('_', ' ') ?? 'LMS'}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-brand-400 text-white rounded-full px-1.5 py-0.5">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          to="/app/notifications"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </Link>
        <Link
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>

        {/* User info */}
        <Link
          to="/app/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors group mt-2"
        >
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{profile?.full_name ?? 'User'}</div>
            <div className="text-xs text-slate-400 capitalize">{activeRole?.replace('_', ' ')}</div>
          </div>
        </Link>
      </div>
    </aside>
  )
}
