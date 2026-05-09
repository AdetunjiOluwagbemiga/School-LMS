import * as XLSX from 'xlsx'

export interface ImportResult<T> {
  valid: T[]
  errors: { row: number; field: string; message: string }[]
}

export function downloadTemplate(headers: string[], filename: string) {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([headers])
  // Column widths
  ws['!cols'] = headers.map(() => ({ wch: 20 }))
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  XLSX.writeFile(wb, filename)
}

export function exportToExcel<T extends object>(
  data: T[],
  headers: string[],
  keys: (keyof T)[],
  filename: string,
  sheetName = 'Data'
) {
  const rows = [headers, ...data.map(row => keys.map(k => row[k] ?? ''))]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = headers.map(() => ({ wch: 20 }))
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, filename)
}

export async function parseExcelFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' }) as Record<string, string>[]
        resolve(json)
      } catch {
        reject(new Error('Failed to parse file. Ensure it is a valid .xlsx or .csv file.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export interface StudentImportRow {
  full_name: string
  email: string
  role: string
  date_of_birth?: string
  phone?: string
}

export function validateStudentRows(rows: Record<string, string>[]): ImportResult<StudentImportRow> {
  const valid: StudentImportRow[] = []
  const errors: { row: number; field: string; message: string }[] = []
  const VALID_ROLES = ['student', 'teacher', 'parent', 'registrar', 'school_admin']

  rows.forEach((row, idx) => {
    const rowNum = idx + 2 // 1-indexed + header row
    const name = (row['full_name'] || row['Full Name'] || row['name'] || '').trim()
    const email = (row['email'] || row['Email'] || '').trim().toLowerCase()
    const role = (row['role'] || row['Role'] || 'student').trim().toLowerCase()

    if (!name) errors.push({ row: rowNum, field: 'full_name', message: 'Full name is required' })
    if (!email) errors.push({ row: rowNum, field: 'email', message: 'Email is required' })
    else if (!validateEmail(email)) errors.push({ row: rowNum, field: 'email', message: `"${email}" is not a valid email` })
    if (!VALID_ROLES.includes(role)) errors.push({ row: rowNum, field: 'role', message: `"${role}" is not a valid role (use: ${VALID_ROLES.join(', ')})` })

    if (name && email && validateEmail(email) && VALID_ROLES.includes(role)) {
      valid.push({
        full_name: name,
        email,
        role,
        date_of_birth: row['date_of_birth'] || row['Date of Birth'] || undefined,
        phone: row['phone'] || row['Phone'] || undefined,
      })
    }
  })

  return { valid, errors }
}

export interface ScoreImportRow {
  student_name: string
  student_email: string
  score: number
}

export function validateScoreRows(rows: Record<string, string>[], maxPoints: number): ImportResult<ScoreImportRow> {
  const valid: ScoreImportRow[] = []
  const errors: { row: number; field: string; message: string }[] = []

  rows.forEach((row, idx) => {
    const rowNum = idx + 2
    const name = (row['student_name'] || row['Student Name'] || row['name'] || '').trim()
    const email = (row['student_email'] || row['Email'] || row['email'] || '').trim().toLowerCase()
    const scoreRaw = row['score'] || row['Score'] || row['points'] || ''
    const score = parseFloat(scoreRaw)

    if (!name) errors.push({ row: rowNum, field: 'student_name', message: 'Student name is required' })
    if (!email || !validateEmail(email)) errors.push({ row: rowNum, field: 'student_email', message: `Invalid email: "${email}"` })
    if (isNaN(score)) errors.push({ row: rowNum, field: 'score', message: `Score "${scoreRaw}" is not a valid number` })
    else if (score < 0 || score > maxPoints) errors.push({ row: rowNum, field: 'score', message: `Score ${score} is out of range (0–${maxPoints})` })

    if (name && email && validateEmail(email) && !isNaN(score) && score >= 0 && score <= maxPoints) {
      valid.push({ student_name: name, student_email: email, score })
    }
  })

  return { valid, errors }
}
