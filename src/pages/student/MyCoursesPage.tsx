import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, Filter, BookOpen, Clock, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { getDifficultyColor } from '@/lib/utils'
import type { Course } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const DELIVERY_MODE_LABELS = {
  self_paced: 'Self-Paced',
  instructor_led: 'Instructor-Led',
  blended: 'Blended',
}

export function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('tenant_id', DEMO_TENANT_ID)
        .eq('status', 'published')
        .order('sort_order')
      setCourses(data ?? [])
      setIsLoading(false)
    }
    load()
  }, [])

  const mockProgress: Record<string, number> = {
    'b0000000-0000-0000-0000-000000000001': 72,
    'b0000000-0000-0000-0000-000000000002': 45,
    'b0000000-0000-0000-0000-000000000003': 20,
    'b0000000-0000-0000-0000-000000000004': 0,
    'b0000000-0000-0000-0000-000000000005': 0,
  }

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchFilter = filter === 'all' ||
      (filter === 'in_progress' && (mockProgress[c.id] ?? 0) > 0 && (mockProgress[c.id] ?? 0) < 100) ||
      (filter === 'not_started' && (mockProgress[c.id] ?? 0) === 0)
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 text-sm mt-0.5">You're enrolled in {courses.length} courses</p>
        </div>
        <Link to="/app/learn/courses">
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Browse Catalog
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'not_started', label: 'Not Started' },
          ].map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => {
            const progress = mockProgress[course.id] ?? 0
            return (
              <Card key={course.id} className="group hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.thumbnail_url ?? ''}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(course.difficulty ?? '')}`}>
                      {course.difficulty}
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-black/40 text-white border-0">
                      {DELIVERY_MODE_LABELS[course.delivery_mode]}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 flex-1">{course.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{course.estimated_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Filter className="w-3 h-3" />{course.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />248
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Progress</span>
                      <span className="text-xs font-medium text-slate-700">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  <Link to={`/app/learn/courses/${course.id}` as any}>
                    <Button variant={progress > 0 ? 'default' : 'outline'} size="sm" className="w-full gap-1">
                      {progress > 0 ? 'Continue' : 'Start Course'}
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
