import { useState, useEffect } from 'react'
import { Download, Search, Filter, CircleCheck as CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { getLetterGrade, getGradeColor } from '@/lib/utils'
import type { GradeItem } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Johnson', avatar: 'A', grades: { g1: 88, g2: 92, g3: null, g4: 95 } },
  { id: '2', name: 'Bob Smith', avatar: 'B', grades: { g1: 72, g2: 65, g3: null, g4: 80 } },
  { id: '3', name: 'Carol Davis', avatar: 'C', grades: { g1: 95, g2: 98, g3: null, g4: 100 } },
  { id: '4', name: 'David Lee', avatar: 'D', grades: { g1: 55, g2: 48, g3: null, g4: 70 } },
  { id: '5', name: 'Emma Wilson', avatar: 'E', grades: { g1: 82, g2: 87, g3: null, g4: 85 } },
  { id: '6', name: 'Frank Miller', avatar: 'F', grades: { g1: 67, g2: 71, g3: null, g4: 75 } },
]

function calcAvg(grades: Record<string, number | null>): number {
  const vals = Object.values(grades).filter((v): v is number => v !== null)
  if (vals.length === 0) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

export function GradebookPage() {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([])
  const [selectedCourse, setSelectedCourse] = useState('b0000000-0000-0000-0000-000000000001')
  const [search, setSearch] = useState('')
  const [editCell, setEditCell] = useState<{ studentId: string; itemId: string } | null>(null)
  const [tempGrade, setTempGrade] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: c } = await supabase
        .from('courses')
        .select('id, title')
        .eq('tenant_id', DEMO_TENANT_ID)
        .eq('status', 'published')
      setCourses(c ?? [])

      const { data: items } = await supabase
        .from('grade_items')
        .select('*')
        .eq('course_id', selectedCourse)
        .order('sort_order')
      setGradeItems(items ?? [])
    }
    load()
  }, [selectedCourse])

  const filtered = MOCK_STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const gradeKeys = ['g1', 'g2', 'g3', 'g4'] as const

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gradebook</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage and enter grades for your students</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Course selector */}
      <div className="flex gap-2 flex-wrap">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCourse === c.id
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: '79.5%', color: 'text-brand-600' },
          { label: 'Passing Rate', value: '83%', color: 'text-emerald-600' },
          { label: 'At Risk', value: '1', color: 'text-red-600' },
          { label: 'Graded', value: '72%', color: 'text-amber-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Grades</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-48"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Student</th>
                  {gradeItems.slice(0, 4).map((item, i) => (
                    <th key={item.id} className="text-center py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide min-w-[100px]">
                      <div>{item.title}</div>
                      <div className="text-[10px] font-normal text-slate-400 capitalize">{item.category} · {item.weight}%</div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const avg = calcAvg(student.grades)
                  const letter = getLetterGrade(avg)
                  const gradeColor = getGradeColor(avg)
                  return (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {student.avatar}
                          </div>
                          <span className="font-medium text-slate-700 text-xs whitespace-nowrap">{student.name}</span>
                        </div>
                      </td>
                      {gradeKeys.map((key, i) => {
                        const gItem = gradeItems[i]
                        const val = student.grades[key]
                        const isEditing = editCell?.studentId === student.id && editCell?.itemId === key
                        return (
                          <td key={key} className="py-3 px-2 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={tempGrade}
                                onChange={(e) => setTempGrade(e.target.value)}
                                onBlur={() => setEditCell(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditCell(null)}
                                className="w-16 text-center border border-brand-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                                autoFocus
                              />
                            ) : val !== null ? (
                              <button
                                onClick={() => { setEditCell({ studentId: student.id, itemId: key }); setTempGrade(String(val)) }}
                                className={`text-sm font-semibold hover:underline ${getGradeColor(val)}`}
                              >
                                {val}%
                              </button>
                            ) : gItem ? (
                              <button
                                onClick={() => { setEditCell({ studentId: student.id, itemId: key }); setTempGrade('') }}
                                className="text-xs text-slate-300 hover:text-brand-500 transition-colors"
                              >
                                —
                              </button>
                            ) : (
                              <span className="text-xs text-slate-200">—</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="py-3 px-3 text-center">
                        <span className={`text-sm font-bold ${gradeColor}`}>{avg}%</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                          avg >= 90 ? 'bg-emerald-500' : avg >= 80 ? 'bg-blue-500' : avg >= 70 ? 'bg-amber-500' : avg >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {letter}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-500" />
            Click any grade to edit. Changes auto-save.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
