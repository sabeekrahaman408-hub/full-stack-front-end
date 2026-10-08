'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck, CheckCircle2, Hourglass, Users, Check, X, FileText, UserX, Phone, RefreshCw } from 'lucide-react'
import { api, Appointment, Doctor, formatDate, getUser, todayLocal } from '@/lib/api'
import { toast } from '@/components/Toaster'

type Overview = {
  doctor: Doctor
  pending: number
  today: number
  completed: number
  totalAppointments: number
  totalPatients: number
}

type Tab = 'pending' | 'upcoming' | 'completed' | 'all'

export default function DoctorPanel() {
  const router = useRouter()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [items, setItems] = useState<Appointment[]>([])
  const [tab, setTab] = useState<Tab>('pending')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)

  // consultation modal
  const [consult, setConsult] = useState<Appointment | null>(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [o, a] = await Promise.all([
        api<Overview>('/doctor/overview'),
        api<Appointment[]>('/doctor/appointments'),
      ])
      setOverview(o)
      setItems(a)
      setError('')
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'doctor') {
      router.push('/login')
      return
    }
    load()
    const t = setInterval(load, 60000) // pick up new requests automatically
    return () => clearInterval(t)
  }, [router, load])

  const today = todayLocal()
  const isOpen = (a: Appointment) => a.status === 'approved' || a.status === 'scheduled'

  const shown = useMemo(() => {
    let list = items
    if (tab === 'pending') list = items.filter((a) => a.status === 'pending')
    if (tab === 'upcoming') list = items.filter(isOpen)
    if (tab === 'completed') list = items.filter((a) => a.status === 'completed')
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((a) => `${a.patientName} ${a.email} ${a.contact || ''} ${a.problem || ''}`.toLowerCase().includes(q))
    return list
  }, [items, tab, search])

  const counts = {
    pending: items.filter((a) => a.status === 'pending').length,
    upcoming: items.filter(isOpen).length,
    completed: items.filter((a) => a.status === 'completed').length,
    all: items.length,
  }

  const setStatus = async (a: Appointment, status: string, note?: string) => {
    setBusyId(a.id)
    try {
      await api(`/doctor/appointments/${a.id}`, { method: 'PATCH', body: JSON.stringify({ status, note }) })
      toast(
        status === 'approved' ? `Accepted ${a.patientName}'s appointment`
          : status === 'rejected' ? 'Request rejected'
          : status === 'no-show' ? 'Marked as no-show'
          : 'Appointment updated'
      )
      await load()
    } catch (e: any) {
      toast(e.message, 'error')
    }
    setBusyId(null)
  }

  const reject = (a: Appointment) => {
    const note = window.prompt(`Reason for rejecting ${a.patientName}'s request (the patient will see this):`)
    if (note === null) return
    setStatus(a, 'rejected', note)
  }

  const openConsult = (a: Appointment) => {
    setConsult(a)
    setDiagnosis('')
    setPrescription('')
    setNotes('')
  }

  const saveConsult = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consult) return
    setSaving(true)
    try {
      await api(`/doctor/appointments/${consult.id}/consultation`, {
        method: 'POST',
        body: JSON.stringify({ diagnosis, prescription, notes, markCompleted: true }),
      })
      toast('Consultation saved and appointment completed')
      setConsult(null)
      await load()
    } catch (err: any) {
      toast(err.message, 'error')
    }
    setSaving(false)
  }

  const doctor = overview?.doctor

  return (
    <>
      <section className="page-head">
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
          {doctor?.image && <img src={doctor.image} alt={doctor.name} className="panel-avatar" />}
          <div style={{ flex: 1, minWidth: 220 }}>
            <p className="eyebrow">Doctor panel</p>
            <h1 style={{ marginBottom: 4 }}>{doctor ? doctor.name : 'Welcome'}</h1>
            <p>{doctor ? `${doctor.specialization}${doctor.location ? ' · ' + doctor.location : ''}` : 'Loading your profile…'}</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => { setLoading(true); load() }}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </section>

      <div className="wrap page-body">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="stat-grid">
          <div className="stat-card"><div className="stat-label"><Hourglass size={14} style={{ verticalAlign: '-2px' }} /> Awaiting your decision</div><div className="stat-value">{overview?.pending ?? '—'}</div></div>
          <div className="stat-card"><div className="stat-label"><CalendarCheck size={14} style={{ verticalAlign: '-2px' }} /> Today&apos;s visits</div><div className="stat-value">{overview?.today ?? '—'}</div></div>
          <div className="stat-card"><div className="stat-label"><CheckCircle2 size={14} style={{ verticalAlign: '-2px' }} /> Completed</div><div className="stat-value">{overview?.completed ?? '—'}</div></div>
          <div className="stat-card"><div className="stat-label"><Users size={14} style={{ verticalAlign: '-2px' }} /> Patients seen</div><div className="stat-value">{overview?.totalPatients ?? '—'}</div></div>
        </div>

        <div className="tabs" style={{ marginTop: 30 }}>
          {([['pending', 'Requests'], ['upcoming', 'Upcoming'], ['completed', 'Completed'], ['all', 'All']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} className={`chip ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              {label} ({counts[id]})
            </button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient name, email, phone or problem…" style={{ maxWidth: 420, marginBottom: 18 }} />

        {loading && items.length === 0 && <p className="no-data">Loading appointments…</p>}
        {!loading && shown.length === 0 && !error && (
          <div className="empty">
            <h3>{tab === 'pending' ? 'No pending requests' : 'Nothing to show here'}</h3>
            <p>{tab === 'pending' ? 'New booking requests from patients will appear here.' : 'Try another tab or clear the search.'}</p>
          </div>
        )}

        <div className="appt-list">
          {shown.map((a) => {
            const d = formatDate(a.date)
            const busy = busyId === a.id
            const isToday = a.date === today
            return (
              <div className="appt" key={a.id}>
                <div className="appt-date"><strong>{d.day}</strong><span>{d.month}</span></div>
                <div>
                  <h3>{a.patientName}{a.age ? <span className="muted"> · {a.age} yrs</span> : null}</h3>
                  <div className="muted">
                    {a.time}{isToday ? ' · Today' : ''} · <Phone size={12} style={{ verticalAlign: '-1px' }} /> {a.contact || '—'} · {a.email}
                  </div>
                  {a.problem && <div style={{ marginTop: 8, fontSize: '0.92rem' }}><strong>Reason:</strong> {a.problem}</div>}
                  <div className="appt-meta">
                    <span className={`badge badge-${a.status}`}>{a.status}</span>
                    <span className={`badge badge-${(a.paymentStatus || 'pending').toLowerCase()}`}>Payment {a.paymentStatus || 'Pending'}</span>
                    <span className="badge">₹{a.consultationFee ?? 0} · {a.paymentMethod || 'N/A'}</span>
                  </div>
                  {a.adminNote && <div className="muted" style={{ marginTop: 8 }}>Note: {a.adminNote}</div>}
                  {a.status === 'cancelled' && <div className="alert alert-error" style={{ marginTop: 10 }}>Cancelled by patient{a.cancelReason ? `: ${a.cancelReason}` : ''}</div>}
                </div>
                <div className="appt-actions">
                  {a.status === 'pending' && (
                    <>
                      <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => setStatus(a, 'approved')}><Check size={15} /> Accept</button>
                      <button className="btn btn-danger btn-sm" disabled={busy} onClick={() => reject(a)}><X size={15} /> Reject</button>
                    </>
                  )}
                  {isOpen(a) && (
                    <>
                      <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => openConsult(a)}><FileText size={15} /> Consult &amp; complete</button>
                      <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setStatus(a, 'no-show')}><UserX size={15} /> No-show</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {consult && (
        <div className="modal-backdrop" onClick={() => !saving && setConsult(null)} role="dialog" aria-modal="true">
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={saveConsult}>
            <h3>Consultation – {consult.patientName}</h3>
            <p className="muted" style={{ marginTop: -6 }}>{formatDate(consult.date).long} · {consult.time}</p>
            <label className="field"><span>Diagnosis *</span>
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required placeholder="e.g. Seasonal allergic rhinitis" />
            </label>
            <label className="field"><span>Prescription</span>
              <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Medicines, dosage, duration…" />
            </label>
            <label className="field"><span>Notes / follow-up advice</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Diet, tests, next visit…" />
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setConsult(null)} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save & complete'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
