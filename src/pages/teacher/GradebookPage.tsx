import { useState, useEffect, useRef } from 'react'
import { Download, Search, Upload, FileSpreadsheet, CircleCheck, CircleAlert, FileDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { getLetterGrade, getGradeColor } from '@/lib/utils'
import { downloadTemplate, exportToExcel, parseExcelFile, validateScoreRows } from '@/lib/importExport'
import type { GradeItem } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const MOCK_STUDENTS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@oakridge.edu', grades: { g1: 88, g2: 92, g3: null, g4: 95 } },
  { id: '2', name: 'Bob Smith', email: 'bob@oakridge.edu', grades: { g1: 72, g2: 65, g3: null, g4: 80 } },
  { id: '3', name: 'Carol Davis', email: 'carol@oakridge.edu', grades: { g1: 95, g2: 98, g3: null, g4: 100 } },
  { id: '4', name: 'David Lee', email: 'david@oakridge.edu', grades: { g1: 55, g2: 48, g3: null, g4: 70 } },
  { id: '5', name: 'Emma Wilson', email: 'emma@oakridge.edu', grades: { g1: 82, g2: 87, g3: null, g4: 85 } },
  { id: '6', name: 'Frank Miller', email: 'frank@oakridge.edu', grades: { g1: 67, g2: 71, g3: null, g4: 75 } },
]

type GradeKey = 'g1' | 'g2' | 'g3' | 'g4'
const GRADE_KEYS: GradeKey[] = ['g1', 'g2', 'g3', 'g4']

function calcAvg(grades: Record<string, number | null>): number {
  const vals = Object.values(grades).filter((v): v is number => v !== null)
  if (vals.length === 0) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

function getPosition(studentId: string, students: typeof MOCK_STUDENTS): number {
  const avgs = students.map(s => ({ id: s.id, avg: calcAvg(s.grades) }))
  avgs.sort((a, b) => b.avg - a.avg)
  return avgs.findIndex(a => a.id === studentId) + 1
}

type ImportStep = 'idle' | 'reviewing' | 'importing' | 'done'

export function GradebookPage() {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([])
  const [selectedCourse, setSelectedCourse] = useState('b0000000-0000-0000-0000-000000000001')
  const [search, setSearch] = useState('')
  const [editCell, setEditCell] = useState<{ studentId: string; itemId: string } | null>(null)
  const [tempGrade, setTempGrade] = useState('')
  const [students, setStudents] = useState(MOCK_STUDENTS.map(s => ({ ...s, grades: { ...s.grades } })))

  // Import state
  const [importItem, setImportItem] = useState<GradeItem | null>(null)
  const [importStep, setImportStep] = useState<ImportStep>('idle')
  const [importValid, setImportValid] = useState<{ student_name: string; student_email: string; score: number }[]>([])
  const [importErrors, setImportErrors] = useState<{ row: number; field: string; message: string }[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [importCounts, setImportCounts] = useState({ updated: 0, notFound: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data: c } = await supabase.from('courses').select('id, title').eq('tenant_id', DEMO_TENANT_ID).eq('status', 'published')
      setCourses(c ?? [])
      const { data: items } = await supabase.from('grade_items').select('*').eq('course_id', selectedCourse).order('sort_order')
      setGradeItems(items ?? [])
    }
    load()
  }, [selectedCourse])

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  // Stats
  const avgs = students.map(s => calcAvg(s.grades))
  const classAvg = avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : 0
  const passing = avgs.filter(a => a >= 50).length
  const atRisk = avgs.filter(a => a < 50).length

  const handleExportGradebook = () => {
    exportToExcel(
      students.map((s, idx) => ({
        student_name: s.name,
        email: s.email,
        g1: s.grades.g1 ?? '',
        g2: s.grades.g2 ?? '',
        g3: s.grades.g3 ?? '',
        g4: s.grades.g4 ?? '',
        average: calcAvg(s.grades),
        grade: getLetterGrade(calcAvg(s.grades)),
        position: getPosition(s.id, students),
      })),
      ['Student Name', 'Email',
        gradeItems[0]?.title ?? 'Assessment 1',
        gradeItems[1]?.title ?? 'Assessment 2',
        gradeItems[2]?.title ?? 'Assessment 3',
        gradeItems[3]?.title ?? 'Assessment 4',
        'Average', 'Grade', 'Position'],
      ['student_name', 'email', 'g1', 'g2', 'g3', 'g4', 'average', 'grade', 'position'],
      'oakridge_gradebook.xlsx',
      'Gradebook'
    )
  }

  const handleDownloadScoreTemplate = (item: GradeItem) => {
    downloadTemplate(
      ['student_name', 'student_email', 'score'],
      `template_${item.title.replace(/\s+/g, '_')}.xlsx`
    )
  }

  const handleScoreFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, item: GradeItem) => {
    const file = e.target.files?.[0]
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (!file) return

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) { alert('Only .xlsx, .xls, or .csv files are allowed.'); return }
    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5MB.'); return }

    try {
      const rows = await parseExcelFile(file)
      const result = validateScoreRows(rows, item.max_points)
      setImportItem(item)
      setImportValid(result.valid)
      setImportErrors(result.errors)
      setImportStep('reviewing')
      setImportProgress(0)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleConfirmScoreImport = async () => {
    if (!importItem) return
    const gradeKey = GRADE_KEYS[gradeItems.findIndex(g => g.id === importItem.id)] ?? 'g1'
    setImportStep('importing')

    let updated = 0
    let notFound = 0

    for (let i = 0; i < importValid.length; i++) {
      const row = importValid[i]
      const student = students.find(s => s.email.toLowerCase() === row.student_email.toLowerCase())

      if (student) {
        setStudents(prev => prev.map(s =>
          s.id === student.id
            ? { ...s, grades: { ...s.grades, [gradeKey]: Math.round((row.score / importItem.max_points) * 100) } }
            : s
        ))
        updated++
      } else {
        notFound++
      }

      setImportProgress(Math.round(((i + 1) / importValid.length) * 100))
      await new Promise(r => setTimeout(r, 30))
    }

    setImportCounts({ updated, notFound })
    setImportStep('done')
  }

  const closeImportModal = () => {
    setImportStep('idle')
    setImportItem(null)
    setImportValid([])
    setImportErrors([])
    setImportProgress(0)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gradebook</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage and enter grades for your students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportGradebook}>
            <FileDown className="w-4 h-4" />
            Export Gradebook
          </Button>
        </div>
      </div>

      {/* Course selector */}
      <div className="flex gap-2 flex-wrap">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCourse === c.id ? 'bg-brand-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: `${classAvg}%`, color: 'text-brand-600' },
          { label: 'Passing Rate', value: `${Math.round((passing / students.length) * 100)}%`, color: 'text-emerald-600' },
          { label: 'At Risk (< 50%)', value: String(atRisk), color: 'text-red-600' },
          { label: 'Students', value: String(students.length), color: 'text-amber-600' },
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle>Student Grades</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-44">Student</th>
                  {GRADE_KEYS.map((key, i) => {
                    const item = gradeItems[i]
                    return (
                      <th key={key} className="text-center py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide min-w-[110px]">
                        {item ? (
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              {item.title}
                              <div className="flex gap-0.5">
                                <button
                                  title="Download score template"
                                  onClick={() => handleDownloadScoreTemplate(item)}
                                  className="text-slate-300 hover:text-brand-500 transition-colors"
                                >
                                  <FileSpreadsheet className="w-3 h-3" />
                                </button>
                                <label title="Upload scores" className="cursor-pointer text-slate-300 hover:text-emerald-500 transition-colors">
                                  <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    className="hidden"
                                    onChange={(e) => handleScoreFileSelect(e, item)}
                                  />
                                  <Upload className="w-3 h-3" />
                                </label>
                              </div>
                            </div>
                            <div className="text-[10px] font-normal text-slate-400 capitalize">{item.category} · {item.max_points}pts</div>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </th>
                    )
                  })}
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Grade</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const avg = calcAvg(student.grades)
                  const letter = getLetterGrade(avg)
                  const gradeColor = getGradeColor(avg)
                  const pos = getPosition(student.id, students)
                  return (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-700 text-xs whitespace-nowrap">{student.name}</div>
                            <div className="text-[10px] text-slate-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      {GRADE_KEYS.map((key, i) => {
                        const gItem = gradeItems[i]
                        const val = student.grades[key]
                        const isEditing = editCell?.studentId === student.id && editCell?.itemId === key
                        return (
                          <td key={key} className="py-3 px-2 text-center">
                            {isEditing ? (
                              <input
                                type="number" min="0" max="100"
                                value={tempGrade}
                                onChange={(e) => setTempGrade(e.target.value)}
                                onBlur={() => {
                                  const v = parseInt(tempGrade)
                                  if (!isNaN(v) && v >= 0 && v <= 100) {
                                    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, grades: { ...s.grades, [key]: v } } : s))
                                  }
                                  setEditCell(null)
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
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
                          avg >= 90 ? 'bg-emerald-500' : avg >= 80 ? 'bg-sky-500' : avg >= 70 ? 'bg-amber-500' : avg >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {letter}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-xs font-bold ${pos === 1 ? 'text-amber-500' : pos === 2 ? 'text-slate-500' : pos === 3 ? 'text-amber-700' : 'text-slate-400'}`}>
                          {pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `#${pos}`}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            <CircleCheck className="w-3 h-3 inline mr-1 text-emerald-500" />
            Click any grade to edit inline. Use the <FileSpreadsheet className="w-3 h-3 inline" /> / <Upload className="w-3 h-3 inline" /> icons on each column to download a score template or upload scores from Excel.
          </p>
        </CardContent>
      </Card>

      {/* Score Import Dialog */}
      <Dialog open={importStep !== 'idle'} onOpenChange={open => !open && closeImportModal()}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Scores — {importItem?.title}</DialogTitle>
            <DialogDescription>
              Max points: {importItem?.max_points}. Scores will be converted to percentages automatically.
            </DialogDescription>
          </DialogHeader>

          {importStep === 'reviewing' && (
            <div className="space-y-5 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{importValid.length}</div>
                  <div className="text-xs text-emerald-600 mt-0.5">Valid rows</div>
                </div>
                <div className={`border rounded-xl p-4 text-center ${importErrors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-2xl font-bold ${importErrors.length > 0 ? 'text-red-700' : 'text-slate-400'}`}>{importErrors.length}</div>
                  <div className={`text-xs mt-0.5 ${importErrors.length > 0 ? 'text-red-600' : 'text-slate-400'}`}>Errors</div>
                </div>
              </div>

              {importErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                  {importErrors.map((err, i) => (
                    <div key={i} className="px-4 py-2 text-xs text-red-800 border-b border-red-100 last:border-0">
                      <span className="font-semibold">Row {err.row}</span>: {err.message}
                    </div>
                  ))}
                </div>
              )}

              {importValid.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold text-slate-500">Student</th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-500">Email</th>
                        <th className="text-right px-3 py-2 font-semibold text-slate-500">Score</th>
                        <th className="text-right px-3 py-2 font-semibold text-slate-500">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importValid.slice(0, 6).map((row, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-2">{row.student_name}</td>
                          <td className="px-3 py-2 text-slate-500">{row.student_email}</td>
                          <td className="px-3 py-2 text-right font-semibold">{row.score}</td>
                          <td className="px-3 py-2 text-right text-brand-600 font-semibold">
                            {Math.round((row.score / (importItem?.max_points ?? 100)) * 100)}%
                          </td>
                        </tr>
                      ))}
                      {importValid.length > 6 && (
                        <tr className="border-t border-slate-100">
                          <td colSpan={4} className="px-3 py-2 text-slate-400 text-center">+{importValid.length - 6} more...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeImportModal}>Cancel</Button>
                <Button onClick={handleConfirmScoreImport} disabled={importValid.length === 0}>
                  Apply {importValid.length} Scores
                </Button>
              </div>
            </div>
          )}

          {importStep === 'importing' && (
            <div className="py-8 text-center space-y-4">
              <div className="text-sm font-medium text-slate-700">Applying scores...</div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all duration-100" style={{ width: `${importProgress}%` }} />
              </div>
              <div className="text-xs text-slate-500">{Math.round((importProgress / 100) * importValid.length)} / {importValid.length}</div>
            </div>
          )}

          {importStep === 'done' && (
            <div className="py-8 text-center space-y-4">
              <CircleCheck className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Scores Applied!</h3>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-700">{importCounts.updated}</div>
                  <div className="text-xs text-emerald-600">Students updated</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-amber-700">{importCounts.notFound}</div>
                  <div className="text-xs text-amber-600">Not matched</div>
                </div>
              </div>
              <Button onClick={closeImportModal}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
