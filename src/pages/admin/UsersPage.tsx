import { useState, useRef } from 'react'
import { Search, Plus, Mail, Shield, Download, Upload, X, CircleAlert, CircleCheck, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  downloadTemplate, exportToExcel, parseExcelFile,
  validateStudentRows, type StudentImportRow
} from '@/lib/importExport'

const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@oakridge.edu', role: 'student', status: 'active', joined: '2026-01-15', lastLogin: '2h ago' },
  { id: '2', name: 'Bob Smith', email: 'bob@oakridge.edu', role: 'student', status: 'active', joined: '2026-01-20', lastLogin: '1 day ago' },
  { id: '3', name: 'Dr. Carol Davis', email: 'carol@oakridge.edu', role: 'teacher', status: 'active', joined: '2025-09-01', lastLogin: '30m ago' },
  { id: '4', name: 'David Lee', email: 'david@oakridge.edu', role: 'student', status: 'inactive', joined: '2026-02-01', lastLogin: '5 days ago' },
  { id: '5', name: 'Emma Wilson', email: 'emma@oakridge.edu', role: 'parent', status: 'active', joined: '2026-01-10', lastLogin: '3 days ago' },
  { id: '6', name: 'Frank Miller', email: 'frank@oakridge.edu', role: 'registrar', status: 'active', joined: '2025-08-15', lastLogin: '1h ago' },
  { id: '7', name: 'Grace Taylor', email: 'grace@oakridge.edu', role: 'student', status: 'active', joined: '2026-02-12', lastLogin: '5h ago' },
  { id: '8', name: 'Henry Martinez', email: 'henry@oakridge.edu', role: 'school_admin', status: 'active', joined: '2025-07-01', lastLogin: 'Just now' },
]

const ROLE_COLORS: Record<string, string> = {
  student: 'bg-sky-100 text-sky-700',
  teacher: 'bg-emerald-100 text-emerald-700',
  parent: 'bg-amber-100 text-amber-700',
  registrar: 'bg-slate-100 text-slate-700',
  school_admin: 'bg-rose-100 text-rose-700',
  super_admin: 'bg-red-100 text-red-700',
}

type ImportStep = 'idle' | 'reviewing' | 'importing' | 'done'

interface ImportState {
  step: ImportStep
  valid: StudentImportRow[]
  errors: { row: number; field: string; message: string }[]
  progress: number
  importedCount: number
  skippedCount: number
}

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [users, setUsers] = useState(MOCK_USERS)
  const [showImport, setShowImport] = useState(false)
  const [importState, setImportState] = useState<ImportState>({
    step: 'idle', valid: [], errors: [], progress: 0, importedCount: 0, skippedCount: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const handleDownloadTemplate = () => {
    downloadTemplate(
      ['full_name', 'email', 'role', 'date_of_birth', 'phone'],
      'oakridge_user_import_template.xlsx'
    )
  }

  const handleExport = () => {
    exportToExcel(
      users.map(u => ({ ...u, status: u.status, joined: u.joined })),
      ['Name', 'Email', 'Role', 'Status', 'Joined', 'Last Login'],
      ['name', 'email', 'role', 'status', 'joined', 'lastLogin'],
      'oakridge_users_export.xlsx',
      'Users'
    )
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!fileInputRef.current) return
    fileInputRef.current.value = ''
    if (!file) return

    // File type check
    const allowed = ['.xlsx', '.xls', '.csv']
    if (!allowed.some(ext => file.name.toLowerCase().endsWith(ext))) {
      alert('Only .xlsx, .xls, or .csv files are allowed.')
      return
    }
    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB.')
      return
    }

    try {
      const rows = await parseExcelFile(file)
      if (rows.length === 0) { alert('The file is empty.'); return }
      const result = validateStudentRows(rows)
      setImportState({ step: 'reviewing', valid: result.valid, errors: result.errors, progress: 0, importedCount: 0, skippedCount: 0 })
      setShowImport(true)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleConfirmImport = async () => {
    const { valid } = importState
    setImportState(s => ({ ...s, step: 'importing', progress: 0 }))

    let imported = 0
    let skipped = 0

    for (let i = 0; i < valid.length; i++) {
      const row = valid[i]
      // Upsert logic: check if email already exists
      const exists = users.find(u => u.email === row.email)
      if (exists) {
        skipped++
      } else {
        setUsers(prev => [...prev, {
          id: `import-${Date.now()}-${i}`,
          name: row.full_name,
          email: row.email,
          role: row.role,
          status: 'active',
          joined: new Date().toISOString().split('T')[0],
          lastLogin: 'Never',
        }])
        imported++
      }
      setImportState(s => ({ ...s, progress: Math.round(((i + 1) / valid.length) * 100) }))
      await new Promise(r => setTimeout(r, 30))
    }

    setImportState(s => ({ ...s, step: 'done', importedCount: imported, skippedCount: skipped }))
  }

  const closeImport = () => {
    setShowImport(false)
    setImportState({ step: 'idle', valid: [], errors: [], progress: 0, importedCount: 0, skippedCount: 0 })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} users in Oakridge Academy</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleDownloadTemplate}>
            <FileSpreadsheet className="w-4 h-4" />
            Download Template
          </Button>
          <label className="cursor-pointer">
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileSelect} />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Bulk Import
            </div>
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'student', 'teacher', 'parent', 'registrar', 'school_admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                roleFilter === role
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {role === 'all' ? 'All Roles' : role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Last Login</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{user.joined}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{user.lastLogin}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" className="text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-slate-400">
                        <Shield className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No users found</div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={open => !open && closeImport()}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk User Import</DialogTitle>
            <DialogDescription>
              Review the parsed data before confirming the import.
            </DialogDescription>
          </DialogHeader>

          {importState.step === 'reviewing' && (
            <div className="space-y-5 mt-2">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{importState.valid.length}</div>
                  <div className="text-xs text-emerald-600 mt-0.5">Valid rows ready to import</div>
                </div>
                <div className={`border rounded-xl p-4 text-center ${importState.errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`text-2xl font-bold ${importState.errors.length > 0 ? 'text-red-700' : 'text-slate-400'}`}>{importState.errors.length}</div>
                  <div className={`text-xs mt-0.5 ${importState.errors.length > 0 ? 'text-red-600' : 'text-slate-400'}`}>Validation errors</div>
                </div>
              </div>

              {/* Errors */}
              {importState.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                    <CircleAlert className="w-4 h-4" /> Validation Errors (these rows will be skipped)
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                    {importState.errors.map((err, i) => (
                      <div key={i} className="px-4 py-2.5 text-xs text-red-800 border-b border-red-100 last:border-0">
                        <span className="font-semibold">Row {err.row}</span> · <span className="text-red-500">{err.field}</span>: {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview table */}
              {importState.valid.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Preview (first 5 valid rows)</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold text-slate-500">Name</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-500">Email</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-500">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importState.valid.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-3 py-2 text-slate-900">{row.full_name}</td>
                            <td className="px-3 py-2 text-slate-600">{row.email}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${ROLE_COLORS[row.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                {row.role.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {importState.valid.length > 5 && (
                          <tr className="border-t border-slate-100">
                            <td colSpan={3} className="px-3 py-2 text-slate-400 text-center">
                              +{importState.valid.length - 5} more rows...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Existing users (matched by email) will be skipped (upsert logic).
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={closeImport}>Cancel</Button>
                <Button onClick={handleConfirmImport} disabled={importState.valid.length === 0}>
                  Import {importState.valid.length} Users
                </Button>
              </div>
            </div>
          )}

          {importState.step === 'importing' && (
            <div className="py-8 text-center space-y-5">
              <div className="text-sm font-medium text-slate-700">Processing import...</div>
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-brand-500 rounded-full transition-all duration-150"
                  style={{ width: `${importState.progress}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                {Math.round((importState.progress / 100) * importState.valid.length)} / {importState.valid.length} rows
              </div>
            </div>
          )}

          {importState.step === 'done' && (
            <div className="py-8 text-center space-y-4">
              <CircleCheck className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Import Complete!</h3>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-700">{importState.importedCount}</div>
                  <div className="text-xs text-emerald-600">Users imported</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-amber-700">{importState.skippedCount}</div>
                  <div className="text-xs text-amber-600">Duplicates skipped</div>
                </div>
              </div>
              <Button onClick={closeImport} className="mt-4">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
