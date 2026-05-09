import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Users, BookOpen, Shield, TrendingUp, ChevronRight, Activity, Star, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/utils'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const enrollmentTrend = [
  { month: 'Jan', students: 124 },
  { month: 'Feb', students: 156 },
  { month: 'Mar', students: 189 },
  { month: 'Apr', students: 231 },
  { month: 'May', students: 248 },
]

const recentAudit = [
  { action: 'user.created', actor: 'Admin Sarah', detail: 'New student enrolled: Alice Johnson', time: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { action: 'grade.override', actor: 'Teacher Mike', detail: 'Grade updated for Bob Smith in Mathematics', time: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { action: 'course.published', actor: 'Teacher Jane', detail: 'Course "Biology" set to published', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { action: 'user.login', actor: 'System', detail: '12 students logged in today', time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
]

export function SchoolDashboard() {
  const [courseCount, setCourseCount] = useState(0)

  useEffect(() => {
    supabase.from('courses').select('id', { count: 'exact' })
      .eq('tenant_id', DEMO_TENANT_ID)
      .eq('status', 'published')
      .then(({ count }) => setCourseCount(count ?? 0))
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Oakridge Academy · School Administration</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/app/admin/users">
            <Button variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              Manage Users
            </Button>
          </Link>
          <Link to="/app/admin/users">
            <Button className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '248', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50', change: '+17 this month' },
          { label: 'Active Courses', value: String(courseCount), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', change: `${courseCount} published` },
          { label: 'Avg Completion', value: '67%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', change: '+3% vs last month' },
          { label: 'Compliance Score', value: '94%', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50', change: 'GDPR + NDPA ready' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enrollment trend */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-500" />
                  Student Enrollment Trend
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#E2E8F0' }}
                  />
                  <Bar dataKey="students" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Compliance status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Compliance & Data Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'GDPR Data Processing Agreement', status: 'active', checked: true },
                { label: 'NDPA Compliance (Nigeria)', status: 'active', checked: true },
                { label: 'Student Data Encryption', status: 'active', checked: true },
                { label: 'Parental Consent Records', status: 'active', checked: true },
                { label: 'Data Export Capability', status: 'active', checked: true },
                { label: 'Right to Erasure Process', status: 'pending', checked: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${item.checked ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <Badge variant={item.status === 'active' ? 'success' : 'warning'} className="text-[10px]">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {[
                { label: 'Add New User', icon: Users, href: '/app/admin/users' },
                { label: 'Manage Enrollments', icon: BookOpen, href: '/app/admin/users' },
                { label: 'Compliance Report', icon: Shield, href: '/app/admin/users' },
                { label: 'School Branding', icon: Star, href: '/app/admin/users' },
              ].map((a) => (
                <Link key={a.label} to={a.href as '/app/admin/users'}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs">
                    <a.icon className="w-3.5 h-3.5" />
                    {a.label}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Audit log */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  Recent Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {recentAudit.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-700">{log.detail}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {log.actor} · {formatRelativeTime(log.time)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
