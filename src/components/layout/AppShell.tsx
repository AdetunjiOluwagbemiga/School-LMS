import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-page)]">
      {/* Sidebar */}
      <div className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden shrink-0',
        sidebarOpen ? 'w-64' : 'w-0'
      )}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
