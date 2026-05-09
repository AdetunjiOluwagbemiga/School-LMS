import { useState, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, BookOpen, Video, CheckCircle2, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import type { ContentItem } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

export function LessonPage() {
  const { courseId, itemId } = useParams({ from: '/app/learn/courses/$courseId/lesson/$itemId' })
  const [item, setItem] = useState<ContentItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', itemId)
        .maybeSingle()
      setItem(data)
      setIsLoading(false)
    }
    load()
  }, [itemId])

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleComplete = async () => {
    setCompleted(true)
    // In a real app, upsert content_progress here
  }

  if (isLoading) {
    return <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
  }

  if (!item) return <div className="text-center py-12 text-slate-400">Lesson not found</div>

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/app/learn/courses" className="hover:text-brand-600 transition-colors">Courses</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/app/learn/courses/${courseId}` as any} className="hover:text-brand-600 transition-colors">Course</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">{item.title}</span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <Progress value={35} className="flex-1 h-1.5" />
        <span className="text-xs text-slate-400 shrink-0">2 / 6 items</span>
      </div>

      {/* Content area */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                {item.content_type === 'video' ? (
                  <Video className="w-5 h-5 text-brand-500" />
                ) : (
                  <BookOpen className="w-5 h-5 text-brand-500" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{item.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  {item.duration_mins && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{item.duration_mins} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{Math.floor(timeSpent / 60)}m {timeSpent % 60}s spent
                  </span>
                  {item.points_value > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Zap className="w-3 h-3" />+{item.points_value} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
            {completed && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {item.content_type === 'video' ? (
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-white/30 transition-colors">
                  <Video className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-white/70 text-sm">Video player would load here</p>
                <p className="text-white/40 text-xs mt-1">Supports HLS, DASH, MP4</p>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.body ?? '<p>No content available.</p>' }}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <Link to={`/app/learn/courses/${courseId}` as any}>
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            {!completed ? (
              <Button onClick={handleComplete} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Mark as Complete
              </Button>
            ) : (
              <Link to={`/app/learn/courses/${courseId}` as any}>
                <Button className="gap-2">
                  Next Lesson
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
