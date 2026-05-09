import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, TriangleAlert as AlertTriangle, Users, Target, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const engagementTrend = [
  { date: 'Apr 15', active: 38, completions: 12 },
  { date: 'Apr 22', active: 52, completions: 18 },
  { date: 'Apr 29', active: 44, completions: 15 },
  { date: 'May 6', active: 61, completions: 24 },
  { date: 'May 9', active: 55, completions: 20 },
]

const courseCompletion = [
  { name: 'Mathematics', pct: 72, students: 82 },
  { name: 'English', pct: 58, students: 94 },
  { name: 'Computer Science', pct: 41, students: 72 },
]

const gradeDistribution = [
  { name: 'A (90-100)', value: 18, color: '#10B981' },
  { name: 'B (80-89)', value: 32, color: '#3B82F6' },
  { name: 'C (70-79)', value: 28, color: '#F59E0B' },
  { name: 'D (60-69)', value: 14, color: '#F97316' },
  { name: 'F (<60)', value: 8, color: '#EF4444' },
]

const AT_RISK = [
  { name: 'James Wilson', course: 'Math', risk: 0.85, lastLogin: '5 days', progress: 12, trend: 'down' },
  { name: 'Sarah Lee', course: 'CS', risk: 0.70, lastLogin: '3 days', progress: 28, trend: 'down' },
  { name: 'Mike Brown', course: 'English', risk: 0.68, lastLogin: '2 days', progress: 34, trend: 'stable' },
  { name: 'Lucy Turner', course: 'Math', risk: 0.62, lastLogin: '4 days', progress: 41, trend: 'up' },
]

export function AnalyticsPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Course Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Engagement, completion rates, and predictive insights</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Engagement', value: '71%', change: '+5% vs last week', icon: Eye, color: 'text-brand-600', bg: 'bg-brand-50', positive: true },
          { label: 'Completion Rate', value: '57%', change: '+3% vs last week', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', positive: true },
          { label: 'Active Students', value: '189', change: '-4 vs last week', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', positive: false },
          { label: 'At-Risk Students', value: '4', change: '+1 vs last week', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', positive: false },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                  <p className={`text-xs mt-1 ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Engagement trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Engagement Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#E2E8F0' }}
                />
                <Line type="monotone" dataKey="active" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} name="Active Students" />
                <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} name="Completions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} students`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {gradeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 flex-1">{item.name}</span>
                  <span className="text-xs font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course completion funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Course Completion Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courseCompletion.map((course) => (
            <div key={course.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{course.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{course.students} students</span>
                  <span className="text-sm font-bold text-slate-900">{course.pct}%</span>
                </div>
              </div>
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
                  style={{ width: `${course.pct}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* At-risk students heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Predictive At-Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-400 mb-4">
            Students identified as at-risk based on login frequency, content progress, and quiz performance.
          </p>
          <div className="space-y-3">
            {AT_RISK.map((student) => (
              <div
                key={student.name}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-colors cursor-pointer ${
                  selected === student.name ? 'border-red-200 bg-red-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setSelected(selected === student.name ? null : student.name)}
              >
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="text-sm bg-red-100 text-red-700">
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.course} · Last seen {student.lastLogin} ago · {student.progress}% progress</p>
                </div>

                {/* Risk meter */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${student.risk * 100}%`,
                        backgroundColor: student.risk > 0.75 ? '#EF4444' : student.risk > 0.60 ? '#F97316' : '#F59E0B',
                      }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-10 text-right ${
                    student.risk > 0.75 ? 'text-red-600' : 'text-orange-500'
                  }`}>
                    {Math.round(student.risk * 100)}%
                  </span>
                  <Badge
                    variant={student.risk > 0.75 ? 'danger' : 'warning'}
                    className="text-[10px]"
                  >
                    {student.risk > 0.75 ? 'High Risk' : 'Medium'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
