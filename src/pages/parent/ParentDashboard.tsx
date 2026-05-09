import { TrendingUp, BookOpen, Clock, Award, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

const progressData = [
  { week: 'W1', score: 68, hours: 5 },
  { week: 'W2', score: 72, hours: 6.5 },
  { week: 'W3', score: 65, hours: 4 },
  { week: 'W4', score: 78, hours: 7 },
  { week: 'W5', score: 82, hours: 8 },
]

const CHILD = {
  name: 'Alex Johnson',
  grade: 'Grade 10',
  courses: [
    { name: 'Mathematics', progress: 72, grade: 'B+', teacher: 'Dr. Carol Davis' },
    { name: 'English Literature', progress: 58, grade: 'B', teacher: 'Mr. James Wilson' },
    { name: 'Computer Science', progress: 35, grade: 'C+', teacher: 'Ms. Sarah Lee' },
  ],
  attendance: 91,
  streak: 5,
  totalXP: 1240,
  badges: 3,
  recentAlerts: [
    { type: 'warning', message: 'Quiz score below average in Mathematics (65%)', time: '2 days ago' },
    { type: 'success', message: 'Completed Chapter 3 of Computer Science', time: '1 day ago' },
    { type: 'info', message: 'Parent-teacher conference scheduled for May 15', time: '3 days ago' },
  ],
  upcomingDeadlines: [
    { title: 'Math Mid-term Exam', date: '2026-05-12', course: 'Mathematics' },
    { title: 'English Essay Due', date: '2026-05-15', course: 'English' },
  ],
}

export function ParentDashboard() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {profile?.full_name?.split(' ')[0] ?? 'Parent'}
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Monitoring {CHILD.name}'s academic progress at Oakridge Academy</p>
      </div>

      {/* Child overview */}
      <Card className="bg-gradient-to-br from-brand-50 to-blue-50 border-brand-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-4 border-white shadow-sm">
              <AvatarFallback className="text-lg font-bold bg-brand-500 text-white">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">{CHILD.name}</h2>
              <p className="text-slate-500 text-sm">{CHILD.grade} · Oakridge Academy</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 font-medium">
                  {CHILD.attendance}% Attendance
                </span>
                <span className="text-xs bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 font-medium">
                  🔥 {CHILD.streak}-day streak
                </span>
                <span className="text-xs bg-white px-2.5 py-1 rounded-full border border-slate-200 text-amber-600 font-medium">
                  ⚡ {CHILD.totalXP} XP
                </span>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-600">{CHILD.courses.length}</p>
                <p className="text-xs text-slate-400">Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{CHILD.badges}</p>
                <p className="text-xs text-slate-400">Badges</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Average', value: '78.5%', icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Courses Active', value: '3', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Study Hours/Week', value: '8h', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Badges Earned', value: '3', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
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
        {/* Progress chart */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-500" />
                Academic Progress (Last 5 Weeks)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#E2E8F0' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2563EB" fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB' }} name="Avg Score %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Course breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CHILD.courses.map((course) => (
                <div key={course.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{course.name}</p>
                      <p className="text-xs text-slate-400">Teacher: {course.teacher}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center text-white ${
                        course.grade.startsWith('A') ? 'bg-emerald-500' : course.grade.startsWith('B') ? 'bg-blue-500' : 'bg-amber-500'
                      }`}>
                        {course.grade.charAt(0)}
                      </span>
                      <span className="text-sm text-slate-500">{course.progress}%</span>
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {CHILD.recentAlerts.map((alert, i) => (
                <div key={i} className="flex gap-2.5">
                  {alert.type === 'warning' ? (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs text-slate-700">{alert.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {CHILD.upcomingDeadlines.map((deadline, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600 leading-none">
                      {new Date(deadline.date).getDate()}
                    </span>
                    <span className="text-[9px] text-red-400">
                      {new Date(deadline.date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700">{deadline.title}</p>
                    <p className="text-[10px] text-slate-400">{deadline.course}</p>
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
