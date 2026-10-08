// Single place that talks to the Spring Boot backend.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export type StoredUser = { id: number; name: string; email: string; role: 'admin' | 'doctor' | 'patient' | string; doctorId?: number | null }

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth-changed'))
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** fetch wrapper: adds the JWT, parses JSON, throws ApiError(message) with the backend's message. */
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) }
  // JSON bodies get a JSON header; FormData (file uploads) must let the browser set its own multipart boundary
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Cannot reach the server. Please make sure the backend is running.', 0)
  }

  if (res.status === 401 && token) {
    // token expired or invalid -> force a clean login
    clearSession()
  }
  if (res.status === 204) return undefined as T

  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) throw new ApiError(data?.message || `Request failed (${res.status})`, res.status)
  return data as T
}

export type Doctor = {
  id: number
  name: string
  specialization: string
  experience?: number
  fees?: number
  location?: string
  image?: string
  rating?: number
  status?: string
  qualification?: string
  about?: string
  languages?: string
  availableDays?: string
}

export type Appointment = {
  id: number
  doctor: string
  specialization?: string
  date: string
  time: string
  patientName: string
  age?: number
  contact?: string
  problem?: string
  email: string
  consultationFee?: number
  paymentMethod?: string
  paymentStatus?: string
  status: string
  type?: string
  cancelReason?: string
  adminNote?: string
  createdAt?: string
}

export function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-IN', { month: 'short' }),
    long: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
  }
}

/** Today's date as yyyy-MM-dd in the user's LOCAL time zone (toISOString() would give the UTC date). */
export function todayLocal(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Where each role lands after login. */
export function homeFor(role?: string): string {
  if (role === 'admin') return '/admin'
  if (role === 'doctor') return '/doctor'
  return '/dashboard'
}

export type MedicalRecord = {
  id: number
  patientId: number
  patientName: string
  appointmentId?: number
  doctorName?: string
  diagnosis: string
  prescription?: string
  notes?: string
  source?: 'doctor' | 'patient' | string
  category?: string | null
  recordDate?: string | null
  hasFile?: boolean
  fileName?: string | null
  fileType?: string | null
  fileSize?: number | null
  aiStatus?: 'none' | 'done' | 'failed' | 'skipped' | string | null
  aiSummary?: string | null
  aiAnalyzedAt?: string | null
  createdAt?: string
}

/** Opens an authenticated file (the browser cannot send the login token with a plain link). */
export async function openProtectedFile(path: string) {
  const win = window.open('', '_blank') // open first so pop-up blockers allow it
  try {
    const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.message || 'Could not open the file')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    if (win) win.location.href = url
    else window.location.href = url
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    win?.close()
    throw e
  }
}

export function formatBytes(n?: number | null) {
  if (!n) return ''
  return n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`
}
