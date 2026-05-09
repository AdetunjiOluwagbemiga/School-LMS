import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, Users, ClipboardList, TrendingUp, TriangleAlert as AlertTriangle, ChevronRight, ChartBar as BarChart3, CircleCheck as CheckCircle2, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const engagementData = [
  { day: 'Mon', students: 42 },
  { day: 'Tue', students: 55 },
  { day: 'Wed', students: 38 },
  { day: 'Thu', students: 61 },
  { day: 'Fri', students: 48 },
  { day: 'Sat', students: 22 },
  { day: 'Sun', students: 15 },
]

export function TeacherDashboard() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('tenant_id', DEMO_TENANT_ID)
        .eq('status', 'published')
        .limit(3)
      setCourses(data ?? [])
    }
    load()
  }, [])

  const atRiskStudents = [
    { name: 'James Wilson', course: 'Mathematics', risk: 0.82, last: '4 days ago', avatar: 'J' },
    { name: 'Sarah Lee', course: 'Computer Science', risk: 0.67, last: '2 days ago', avatar: 'S' },
    { name: 'Mike Brown', course: 'English', risk: 0.71, last: '3 days ago', avatar: 'M' },
  ]

  const pendingGrades = [
    { title: 'Essay Draft', course: 'English', count: 14, due: '2 days' },
    { title: 'Final Project', course: 'CS', count: 8, due: '5 days' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {profile?.full_name?.split(' ')[0] ?? 'Teacher'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Here's what's happening in your classes today</p>
        </div>
        <Link to="/app/teach/courses">
          <Button className="gap-2">
            <BookOpen className="w-4 h-4" />
            Manage Courses
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Courses', value: '3', icon: BookOpen, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Total Students', value: '248', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Grades', value: '22', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'At-Risk Students', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
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
        {/* Engagement chart */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-500" />
                  Daily Active Students
                </CardTitle>
                <Link to="/app/teach/analytics" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                  Full Analytics <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#E2E8F0' }}
                  />
                  <Bar dataKey="students" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* My courses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">My Courses</h2>
              <Link to="/app/teach/courses" className="text-sm text-brand-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={course.thumbnail_url ?? ''} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{course.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />82 students
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />67% avg progress
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to="/app/teach/gradebook">
                        <Button variant="outline" size="sm">Grades</Button>
                      </Link>
                      <Link to="/app/teach/courses">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* At-risk students */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                At-Risk Students
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {atRiskStudents.map((student) => (
                <div key={student.name} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs bg-red-100 text-red-700">{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.course} · {student.last}</p>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className={`text-xs font-bold ${student.risk > 0.75 ? 'text-red-600' : 'text-amber-600'}`}>
                      {Math.round(student.risk * 100)}%
                    </div>
                    <div className="text-[9px] text-slate-400">risk</div>
                  </div>
                </div>
              ))}
              <Link to="/app/teach/analytics">
                <Button variant="outline" size="sm" className="w-full mt-2 text-xs">View All At-Risk</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending grades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                Pending Grading
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {pendingGrades.map((item) => (
                <div key={item.title} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.course} · Due in {item.due}</p>
                  </div>
                  <Badge variant="warning" className="text-[10px]">{item.count}</Badge>
                </div>
              ))}
              <Link to="/app/teach/gradebook">
                <Button size="sm" className="w-full text-xs mt-1">Go to Gradebook</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              {[
                { label: 'Create New Course', icon: BookOpen, href: '/app/teach/courses' },
                { label: 'Create Assessment', icon: ClipboardList, href: '/app/teach/questions' },
                { label: 'View Analytics', icon: BarChart3, href: '/app/teach/analytics' },
              ].map((action) => (
                <Link key={action.label} to={action.href as '/app/teach/courses'}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs">
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
