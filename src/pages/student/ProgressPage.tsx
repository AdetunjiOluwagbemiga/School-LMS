import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Clock, Award, Zap, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const activityData = [
  { day: 'Mon', minutes: 45, items: 3 },
  { day: 'Tue', minutes: 30, items: 2 },
  { day: 'Wed', minutes: 60, items: 5 },
  { day: 'Thu', minutes: 0, items: 0 },
  { day: 'Fri', minutes: 75, items: 6 },
  { day: 'Sat', minutes: 90, items: 7 },
  { day: 'Sun', minutes: 20, items: 1 },
]

const weeklyPoints = [
  { week: 'W1', points: 320 },
  { week: 'W2', points: 450 },
  { week: 'W3', points: 280 },
  { week: 'W4', points: 620 },
  { week: 'W5', points: 190 },
]

export function ProgressPage() {
  const [animateIn, setAnimateIn] = useState(false)
  useEffect(() => { setTimeout(() => setAnimateIn(true), 100) }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Progress</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track your learning journey over time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: '1,240', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', change: '+120 this week' },
          { label: 'Study Hours', value: '24h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', change: '+3h this week' },
          { label: 'Items Done', value: '47', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+8 this week' },
          { label: 'Badges', value: '3', icon: Award, color: 'text-orange-600', bg: 'bg-orange-50', change: '+1 this month' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Daily Study Minutes (This Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(v) => [`${v} mins`, 'Study Time']}
                />
                <Area type="monotone" dataKey="minutes" stroke="#3B82F6" fill="url(#blueGrad)" strokeWidth={2} dot={{ r: 4, fill: '#3B82F6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* XP trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              Weekly XP Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#E2E8F0' }}
                  formatter={(v) => [`${v} XP`, 'Points']}
                />
                <Bar dataKey="points" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course progress detail */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            { name: 'Introduction to Mathematics', progress: 72, grade: 'B+', color: 'bg-blue-500' },
            { name: 'English Language & Literature', progress: 45, grade: 'B', color: 'bg-emerald-500' },
            { name: 'Computer Science Fundamentals', progress: 20, grade: 'C+', color: 'bg-amber-500' },
          ].map((course) => (
            <div key={course.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{course.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">{course.grade}</span>
                  <span className="text-xs text-slate-400">{course.progress}%</span>
                </div>
              </div>
              <Progress value={course.progress} className="h-2" indicatorClassName={course.color} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
