import { useState, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  BookOpen, Clock, Award, ChevronRight, Play, FileText,
  CheckCircle2, Lock, Video, Layers, Star, Users, ChevronDown
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { getDifficultyColor } from '@/lib/utils'
import type { Course, Module, ContentItem } from '@/types'

interface ModuleWithContent extends Module {
  content_items: ContentItem[]
}

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const contentTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4 text-blue-500" />
    case 'quiz': return <Star className="w-4 h-4 text-amber-500" />
    case 'pdf': return <FileText className="w-4 h-4 text-red-500" />
    default: return <BookOpen className="w-4 h-4 text-emerald-500" />
  }
}

export function CourseDetailPage() {
  const { courseId } = useParams({ from: '/app/learn/courses/$courseId' })
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<ModuleWithContent[]>([])
  const [openModule, setOpenModule] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const { data: c } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle()
      setCourse(c)

      const { data: mods } = await supabase
        .from('modules')
        .select('*, content_items(*)')
        .eq('course_id', courseId)
        .order('sort_order')
      setModules(mods ?? [])
      if (mods && mods.length > 0) setOpenModule(mods[0].id)
      setIsLoading(false)
    }
    load()
  }, [courseId])

  const mockProgress: Record<string, 'completed' | 'in_progress' | 'not_started'> = {
    'd0000000-0000-0000-0000-000000000001': 'completed',
    'd0000000-0000-0000-0000-000000000002': 'in_progress',
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-8 bg-slate-100 rounded w-1/2" />
      </div>
    )
  }

  if (!course) return <div className="text-center py-12 text-slate-400">Course not found</div>

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Course hero */}
      <div className="relative h-56 rounded-2xl overflow-hidden">
        <img
          src={course.thumbnail_url ?? ''}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2.5 py-1 rounded-full ${getDifficultyColor(course.difficulty ?? '')}`}>
              {course.difficulty}
            </span>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
              {course.category}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white">{course.title}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Modules list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Course Content</h2>
          {modules.map((mod) => (
            <Card key={mod.id} className="overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{mod.title}</p>
                    <p className="text-xs text-slate-400">{mod.content_items?.length ?? 0} items</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openModule === mod.id ? 'rotate-180' : ''}`} />
              </button>

              {openModule === mod.id && mod.content_items && (
                <div className="border-t border-slate-100">
                  {mod.content_items.map((item) => {
                    const status = mockProgress[item.id] ?? 'not_started'
                    return (
                      <Link
                        key={item.id}
                        to={`/app/learn/courses/${courseId}/lesson/${item.id}` as any}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : status === 'in_progress' ? (
                            <Play className="w-5 h-5 text-brand-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {contentTypeIcon(item.content_type)}
                          <span className={`text-sm truncate ${status === 'completed' ? 'text-slate-400' : 'text-slate-700'}`}>
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.duration_mins && (
                            <span className="text-xs text-slate-400">{item.duration_mins}m</span>
                          )}
                          {item.points_value > 0 && (
                            <span className="text-xs text-amber-600 font-medium">+{item.points_value} XP</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">Course Progress</span>
                  <span className="text-sm font-bold text-brand-600">72%</span>
                </div>
                <Progress value={72} className="h-2.5" />
              </div>

              <Link to={`/app/learn/courses/${courseId}/lesson/d0000000-0000-0000-0000-000000000002` as any}>
                <Button className="w-full gap-2">
                  <Play className="w-4 h-4" />
                  Continue Learning
                </Button>
              </Link>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {[
                  { icon: Clock, label: `${course.estimated_hours}h total`, color: 'text-slate-400' },
                  { icon: Users, label: '248 enrolled', color: 'text-slate-400' },
                  { icon: Award, label: `Pass with ${course.passing_grade}%`, color: 'text-slate-400' },
                  { icon: BookOpen, label: `${modules.length} modules`, color: 'text-slate-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">About this course</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
