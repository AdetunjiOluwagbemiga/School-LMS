import { useState } from 'react'
import { FileDown, Printer, Search, ChevronDown, ChevronUp, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getLetterGrade, getGradeColor } from '@/lib/utils'
import { exportToExcel } from '@/lib/importExport'

const ACADEMIC_YEAR = '2025/2026'
const TERM = 'Term 3'

// Subject data with per-student scores
const SUBJECTS = [
  { id: 's1', name: 'Mathematics', teacher: 'Mr. T. Fashola', weight: 1.5 },
  { id: 's2', name: 'English Language', teacher: 'Mrs. G. Nwosu', weight: 1.5 },
  { id: 's3', name: 'Biology', teacher: 'Ms. A. Eze', weight: 1.0 },
  { id: 's4', name: 'Chemistry', teacher: 'Ms. A. Eze', weight: 1.0 },
  { id: 's5', name: 'Physics', teacher: 'Mr. T. Fashola', weight: 1.0 },
  { id: 's6', name: 'Computer Science', teacher: 'Mr. J. Adebayo', weight: 1.0 },
  { id: 's7', name: 'History', teacher: 'Mrs. G. Nwosu', weight: 0.5 },
  { id: 's8', name: 'Physical Education', teacher: 'Coach E. Obi', weight: 0.5 },
]

type SubjectScores = Record<string, number>

const STUDENTS: Array<{
  id: string; name: string; class: string; student_id: string;
  scores: SubjectScores; attendance: number; behavior_score: number; teacher_comment: string
}> = [
  {
    id: '1', name: 'Alice Johnson', class: 'SS2A', student_id: 'OAK2026-001',
    scores: { s1: 88, s2: 92, s3: 85, s4: 79, s5: 83, s6: 95, s7: 88, s8: 90 },
    attendance: 92,
    behavior_score: 95,
    teacher_comment: '',
  },
  {
    id: '2', name: 'Bob Smith', class: 'SS2A', student_id: 'OAK2026-002',
    scores: { s1: 72, s2: 65, s3: 70, s4: 68, s5: 74, s6: 80, s7: 62, s8: 85 },
    attendance: 87,
    behavior_score: 80,
    teacher_comment: '',
  },
  {
    id: '3', name: 'Carol Davis', class: 'SS2A', student_id: 'OAK2026-003',
    scores: { s1: 95, s2: 98, s3: 91, s4: 93, s5: 90, s6: 97, s7: 96, s8: 88 },
    attendance: 99,
    behavior_score: 98,
    teacher_comment: '',
  },
  {
    id: '4', name: 'David Lee', class: 'SS2A', student_id: 'OAK2026-004',
    scores: { s1: 55, s2: 48, s3: 60, s4: 52, s5: 58, s6: 70, s7: 45, s8: 75 },
    attendance: 75,
    behavior_score: 65,
    teacher_comment: '',
  },
  {
    id: '5', name: 'Emma Wilson', class: 'SS2A', student_id: 'OAK2026-005',
    scores: { s1: 82, s2: 87, s3: 78, s4: 81, s5: 76, s6: 85, s7: 83, s8: 92 },
    attendance: 95,
    behavior_score: 90,
    teacher_comment: '',
  },
  {
    id: '6', name: 'Frank Miller', class: 'SS2A', student_id: 'OAK2026-006',
    scores: { s1: 67, s2: 71, s3: 65, s4: 69, s5: 72, s6: 75, s7: 70, s8: 80 },
    attendance: 88,
    behavior_score: 75,
    teacher_comment: '',
  },
]

function calcWeightedAvg(scores: Record<string, number>): number {
  let total = 0
  let totalWeight = 0
  SUBJECTS.forEach(s => {
    if (scores[s.id] != null) {
      total += scores[s.id] * s.weight
      totalWeight += s.weight
    }
  })
  if (totalWeight === 0) return 0
  return Math.round(total / totalWeight)
}

function getAutoComment(avg: number, name: string): string {
  const first = name.split(' ')[0]
  if (avg >= 90) return `${first} has delivered an outstanding performance this term, consistently excelling across all subjects. A model student who sets a high standard for the class.`
  if (avg >= 80) return `${first} has performed very well this term and demonstrates strong academic ability. With continued focus, even greater achievements are within reach.`
  if (avg >= 70) return `${first} has shown good progress this term. A solid performance overall, with room to improve in specific subjects through additional practice.`
  if (avg >= 60) return `${first} is making satisfactory progress. We encourage ${first} to engage more actively in class and seek support in areas of difficulty.`
  if (avg >= 50) return `${first} has passed this term but needs to significantly improve their commitment and preparation to reach their potential.`
  return `${first} is struggling to meet the required academic standard. We strongly recommend additional tutoring and close parental involvement to support ${first}'s progress.`
}

function getRemark(avg: number): { label: string; color: string } {
  if (avg >= 90) return { label: 'Distinction', color: 'text-emerald-600' }
  if (avg >= 80) return { label: 'Credit', color: 'text-sky-600' }
  if (avg >= 70) return { label: 'Merit', color: 'text-brand-600' }
  if (avg >= 60) return { label: 'Pass', color: 'text-amber-600' }
  if (avg >= 50) return { label: 'Marginal Pass', color: 'text-orange-600' }
  return { label: 'Fail', color: 'text-red-600' }
}

function getTrend(avg: number): 'up' | 'down' | 'same' {
  // Simulated: students with avg >= 75 improved, < 60 dropped, rest same
  if (avg >= 75) return 'up'
  if (avg < 60) return 'down'
  return 'same'
}

type StudentRow = typeof STUDENTS[0]

export function ReportCardPage() {
  const [students, setStudents] = useState(STUDENTS)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState('')

  // Calculate rankings
  const ranked = [...students].sort((a, b) => calcWeightedAvg(b.scores) - calcWeightedAvg(a.scores))
  const getRank = (id: string) => ranked.findIndex(s => s.id === id) + 1

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.student_id.includes(search))

  const classAvg = Math.round(students.reduce((sum, s) => sum + calcWeightedAvg(s.scores), 0) / students.length)
  const highestAvg = Math.max(...students.map(s => calcWeightedAvg(s.scores)))
  const lowestAvg = Math.min(...students.map(s => calcWeightedAvg(s.scores)))

  const saveComment = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, teacher_comment: commentDraft } : s))
    setEditingComment(null)
  }

  const handleExportAll = () => {
    exportToExcel(
      students.map(s => {
        const avg = calcWeightedAvg(s.scores)
        const remark = getRemark(avg)
        return {
          student_id: s.student_id,
          name: s.name,
          class: s.class,
          ...Object.fromEntries(SUBJECTS.map(sub => [sub.name, s.scores[sub.id] ?? ''])),
          weighted_avg: avg,
          grade: getLetterGrade(avg),
          remark: remark.label,
          position: getRank(s.id),
          attendance: `${s.attendance}%`,
          comment: s.teacher_comment || getAutoComment(avg, s.name),
        }
      }),
      ['Student ID', 'Name', 'Class', ...SUBJECTS.map(s => s.name), 'Weighted Avg', 'Grade', 'Remark', 'Position', 'Attendance %', 'Comment'],
      ['student_id', 'name', 'class', ...SUBJECTS.map(s => s.name), 'weighted_avg', 'grade', 'remark', 'position', 'attendance', 'comment'] as any,
      `report_cards_${TERM.replace(' ', '_')}_${ACADEMIC_YEAR.replace('/', '-')}.xlsx`,
      'Report Cards'
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report Cards</h1>
          <p className="text-slate-500 text-sm mt-0.5">{TERM} · {ACADEMIC_YEAR} · SS2A</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print All
          </Button>
          <Button className="gap-2" onClick={handleExportAll}>
            <FileDown className="w-4 h-4" /> Export Excel
          </Button>
        </div>
      </div>

      {/* Class summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: `${classAvg}%`, color: 'text-brand-600' },
          { label: 'Highest Score', value: `${highestAvg}%`, color: 'text-emerald-600' },
          { label: 'Lowest Score', value: `${lowestAvg}%`, color: 'text-red-600' },
          { label: 'Students', value: String(students.length), color: 'text-amber-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search by name or student ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Student report cards */}
      <div className="space-y-4">
        {filtered.map(student => {
          const avg = calcWeightedAvg(student.scores)
          const letter = getLetterGrade(avg)
          const remark = getRemark(avg)
          const rank = getRank(student.id)
          const trend = getTrend(avg)
          const autoComment = getAutoComment(avg, student.name)
          const comment = student.teacher_comment || autoComment
          const isExpanded = expandedId === student.id
          const isEditingThis = editingComment === student.id

          return (
            <Card key={student.id} className="overflow-hidden">
              {/* Header row */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : student.id)}
              >
                {/* Rank */}
                <div className="text-center w-10 shrink-0">
                  <div className={`text-xl font-extrabold ${rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-700' : 'text-slate-300'}`}>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </div>
                  <div className="text-[10px] text-slate-400">of {students.length}</div>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-extrabold flex items-center justify-center shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.student_id} · {student.class}</div>
                  </div>
                </div>

                {/* Average */}
                <div className="text-center shrink-0">
                  <div className={`text-2xl font-extrabold ${getGradeColor(avg)}`}>{avg}%</div>
                  <div className={`text-xs font-medium ${remark.color}`}>{remark.label}</div>
                </div>

                {/* Letter grade */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                  avg >= 90 ? 'bg-emerald-500' : avg >= 80 ? 'bg-sky-500' : avg >= 70 ? 'bg-amber-500' : avg >= 60 ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  {letter}
                </div>

                {/* Trend */}
                <div className="hidden md:flex items-center gap-1 shrink-0">
                  {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                  {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  {trend === 'same' && <Minus className="w-4 h-4 text-slate-400" />}
                  <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                    {trend === 'up' ? 'Improved' : trend === 'down' ? 'Declined' : 'Stable'}
                  </span>
                </div>

                {/* Expand icon */}
                <div className="shrink-0 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-6">
                  {/* Subject breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Subject Scores</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {SUBJECTS.map(sub => {
                        const score = student.scores[sub.id]
                        const classSubAvg = Math.round(students.reduce((sum, s) => sum + (s.scores[sub.id] ?? 0), 0) / students.length)
                        const diff = score - classSubAvg
                        return (
                          <div key={sub.id} className="bg-white rounded-xl border border-slate-200 p-3">
                            <div className="text-xs font-semibold text-slate-500 mb-1 truncate">{sub.name}</div>
                            <div className={`text-xl font-extrabold ${getGradeColor(score)}`}>{score}%</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] text-slate-400">{getLetterGrade(score)}</span>
                              <span className={`text-[10px] font-medium ${diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {diff >= 0 ? '+' : ''}{diff} vs class
                              </span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                              <div className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Attendance + Behaviour */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="text-xs font-semibold text-slate-500 mb-2">Attendance</div>
                      <div className={`text-2xl font-extrabold ${student.attendance >= 90 ? 'text-emerald-600' : student.attendance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                        {student.attendance}%
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-emerald-500' : student.attendance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${student.attendance}%` }} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="text-xs font-semibold text-slate-500 mb-2">Conduct</div>
                      <div className={`text-2xl font-extrabold ${getGradeColor(student.behavior_score)}`}>{student.behavior_score}%</div>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${student.behavior_score >= 80 ? 'bg-emerald-500' : student.behavior_score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${student.behavior_score}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Teacher comment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-700">Class Teacher's Comment</h4>
                      {!isEditingThis && (
                        <button
                          onClick={() => { setEditingComment(student.id); setCommentDraft(student.teacher_comment || autoComment) }}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {isEditingThis ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={commentDraft}
                          onChange={e => setCommentDraft(e.target.value)}
                          className="w-full text-sm text-slate-700 border border-brand-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => saveComment(student.id)}>Save Comment</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 italic leading-relaxed">
                        "{comment}"
                      </div>
                    )}
                    {!student.teacher_comment && !isEditingThis && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                        <Star className="w-3 h-3" /> Auto-generated comment. Click Edit to customise.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
