import { useState } from 'react'
import { Search, Plus, Filter, Mail, Shield, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@oakridge.edu', role: 'student', status: 'active', joined: '2026-01-15', lastLogin: '2h ago' },
  { id: '2', name: 'Bob Smith', email: 'bob@oakridge.edu', role: 'student', status: 'active', joined: '2026-01-20', lastLogin: '1 day ago' },
  { id: '3', name: 'Dr. Carol Davis', email: 'carol@oakridge.edu', role: 'teacher', status: 'active', joined: '2025-09-01', lastLogin: '30m ago' },
  { id: '4', name: 'David Lee', email: 'david@oakridge.edu', role: 'student', status: 'inactive', joined: '2026-02-01', lastLogin: '5 days ago' },
  { id: '5', name: 'Emma Wilson', email: 'emma@oakridge.edu', role: 'parent', status: 'active', joined: '2026-01-10', lastLogin: '3 days ago' },
  { id: '6', name: 'Frank Miller', email: 'frank@oakridge.edu', role: 'registrar', status: 'active', joined: '2025-08-15', lastLogin: '1h ago' },
  { id: '7', name: 'Grace Taylor', email: 'grace@oakridge.edu', role: 'student', status: 'active', joined: '2026-02-12', lastLogin: '5h ago' },
  { id: '8', name: 'Henry Martinez', email: 'henry@oakridge.edu', role: 'school_admin', status: 'active', joined: '2025-07-01', lastLogin: 'Just now' },
]

const ROLE_COLORS: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  teacher: 'bg-emerald-100 text-emerald-700',
  parent: 'bg-purple-100 text-purple-700',
  registrar: 'bg-amber-100 text-amber-700',
  school_admin: 'bg-slate-100 text-slate-700',
  super_admin: 'bg-red-100 text-red-700',
}

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{MOCK_USERS.length} users in Oakridge Academy</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'student', 'teacher', 'parent', 'registrar', 'school_admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                roleFilter === role
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {role === 'all' ? 'All Roles' : role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Last Login</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{user.joined}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{user.lastLogin}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" className="text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-slate-400">
                        <Shield className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-slate-400">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No users found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
