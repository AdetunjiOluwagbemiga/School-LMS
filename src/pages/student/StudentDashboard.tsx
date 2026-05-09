import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen, Award, TrendingUp, Clock, Flame, Target,
  ChevronRight, Play, CheckCircle2, Star, Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { formatDate, getDifficultyColor } from '@/lib/utils'
import type { Course, Enrollment } from '@/types'

interface EnrollmentWithCourse extends Enrollment {
  course: Course
}

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

export function StudentDashboard() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [badgeCount, setBadgeCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('tenant_id', DEMO_TENANT_ID)
        .eq('status', 'published')
        .limit(5)

      if (courses) {
        const mockEnrollments: EnrollmentWithCourse[] = courses.slice(0, 3).map((c, i) => ({
          id: `mock-${i}`,
          course_id: c.id,
          user_id: profile?.id ?? '',
          tenant_id: DEMO_TENANT_ID,
          status: 'active' as const,
          progress_pct: [72, 45, 20][i] ?? 0,
          started_at: new Date().toISOString(),
          completed_at: null,
          created_at: new Date().toISOString(),
          course: c,
        }))
        setEnrollments(mockEnrollments)
      }
      setTotalPoints(1240)
      setBadgeCount(4)
    }
    load()
  }, [profile?.id])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const streakDays = [true, true, true, false, true, true, false]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {greeting()}, {profile?.full_name?.split(' ')[0] ?? 'Learner'}! 👋
            </h1>
            <p className="text-brand-200 text-sm">
              You have 3 active courses. Keep up the great work!
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="font-semibold">5-day streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">{totalPoints} XP</span>
              </div>
            </div>
          </div>

          {/* Streak calendar */}
          <div className="hidden md:block">
            <p className="text-brand-200 text-xs mb-2 text-right">This week</p>
            <div className="flex gap-1.5">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    streakDays[i] ? 'bg-orange-400 text-white' : 'bg-white/20 text-white/50'
                  }`}>
                    {streakDays[i] ? <Flame className="w-4 h-4" /> : day}
                  </div>
                  <span className="text-white/50 text-[10px]">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Courses Enrolled', value: enrollments.length, icon: BookOpen, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Total XP Points', value: totalPoints.toLocaleString(), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Badges Earned', value: badgeCount, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Hours Learned', value: '24h', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
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
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Continue Learning</h2>
            <Link to="/app/learn/courses" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-0 flex overflow-hidden">
                <div className="w-28 h-24 shrink-0 overflow-hidden">
                  <img
                    src={enrollment.course.thumbnail_url ?? ''}
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{enrollment.course.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getDifficultyColor(enrollment.course.difficulty ?? '')}`}>
                      {enrollment.course.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={enrollment.progress_pct} className="flex-1 h-1.5" />
                    <span className="text-xs text-slate-500 shrink-0">{enrollment.progress_pct}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{enrollment.course.category}</span>
                    <Link to={`/app/learn/courses/${enrollment.course_id}` as any}>
                      <Button size="sm" className="h-7 text-xs gap-1">
                        <Play className="w-3 h-3" /> Resume
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* XP Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-500" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Level 5 — Explorer</span>
                <span className="text-xs text-slate-400">1240 / 1500 XP</span>
              </div>
              <Progress value={82.7} className="h-2.5" indicatorClassName="bg-gradient-to-r from-brand-400 to-brand-600" />
              <p className="text-xs text-slate-400 mt-2">260 XP to reach Level 6</p>

              <div className="mt-4 space-y-2">
                {[
                  { label: 'Complete a lesson', xp: '+10 XP', done: true },
                  { label: 'Pass a quiz', xp: '+25 XP', done: true },
                  { label: 'Post in forum', xp: '+5 XP', done: false },
                ].map((task) => (
                  <div key={task.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${task.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={task.done ? 'text-slate-400 line-through' : 'text-slate-600'}>
                        {task.label}
                      </span>
                    </div>
                    <span className="text-brand-600 font-medium">{task.xp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Recent Badges
                </CardTitle>
                <Link to="/app/learn/badges" className="text-xs text-brand-600 hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'First Steps', emoji: '🚀', rarity: 'common', earned: true },
                  { name: 'Quiz Master', emoji: '🎯', rarity: 'uncommon', earned: true },
                  { name: 'Streak Keeper', emoji: '🔥', rarity: 'uncommon', earned: true },
                  { name: 'Course Hero', emoji: '🏆', rarity: 'rare', earned: false },
                  { name: 'Top Scholar', emoji: '⭐', rarity: 'epic', earned: false },
                  { name: 'Legend', emoji: '👑', rarity: 'legendary', earned: false },
                ].map((badge) => (
                  <div
                    key={badge.name}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      badge.earned
                        ? 'border-amber-200 bg-amber-50 hover:shadow-sm'
                        : 'border-slate-100 bg-slate-50 opacity-40'
                    }`}
                    title={badge.name}
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-[9px] text-center text-slate-500 leading-tight">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {[
                { title: 'Algebra Quiz 1', course: 'Mathematics', date: '2026-05-12', type: 'quiz' },
                { title: 'Essay Draft', course: 'English', date: '2026-05-15', type: 'assignment' },
                { title: 'CS Final Exam', course: 'Computer Science', date: '2026-05-20', type: 'exam' },
              ].map((deadline) => (
                <div key={deadline.title} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600">
                      {new Date(deadline.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{deadline.title}</p>
                    <p className="text-xs text-slate-400">{deadline.course} · {formatDate(deadline.date)}</p>
                  </div>
                  <Badge variant={deadline.type === 'exam' ? 'danger' : 'warning'} className="shrink-0 text-[10px]">
                    {deadline.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
