'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, IndianRupee, Stethoscope } from 'lucide-react'
import { toast } from '@/components/Toaster'
import CancelDialog from '@/components/CancelDialog'
import { api, Appointment, formatDate, getUser } from '@/lib/api'

const FILTERS = ['all', 'pending', 'approved', 'completed', 'cancelled'] as const

export default function HistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [search, setSearch] = useState('')
  const [cancelling, setCancelling] = useState<Appointment | null>(null)

  const load = useCallback(async () => {
    try {
      setItems(await api<Appointment[]>('/appointments'))
      setError('')
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!getUser()) {
      router.push('/login')
      return
    }
    load()
  }, [router, load])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length }
    items.forEach((a) => { c[a.status] = (c[a.status] || 0) + 1 })
    return c
  }, [items])

  const shown = items.filter((a) =>
    (filter === 'all' || a.status === filter) &&
    (!search || `${a.doctor} ${a.patientName} ${a.specialization || ''}`.toLowerCase().includes(search.toLowerCase()))
  )

  const remove = async (a: Appointment) => {
    if (!window.confirm('Remove this appointment from your history?')) return
    try {
      await api(`/appointments/${a.id}`, { method: 'DELETE' })
      toast('Removed from history')
      load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">My appointments</p>
          <h1>Appointment history</h1>
          <p>Every booking in one place. Pending requests are confirmed by our team.</p>
        </div>
      </section>

      <div className="wrap page-body">
        <div className="tabs">
          {FILTERS.map((f) => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
              {f} {counts[f] ? `(${counts[f]})` : ''}
            </button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by doctor or patient…" style={{ maxWidth: 380, marginBottom: 20 }} />

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <p className="no-data">Loading…</p>}

        {!loading && shown.length === 0 && !error && (
          <div className="empty">
            <h3>No appointments here yet</h3>
            <p>Find a doctor and book your first visit.</p>
            <Link href="/doctors" className="btn btn-primary" style={{ marginTop: 14 }}>Find a doctor</Link>
          </div>
        )}

        <div className="appt-list">
          {shown.map((a) => {
            const d = formatDate(a.date)
            const active = ['pending', 'approved', 'scheduled'].includes(a.status)
            return (
              <div className="appt" key={a.id}>
                <div className="appt-date"><strong>{d.day}</strong><span>{d.month}</span></div>
                <div>
                  <h3>{a.doctor}</h3>
                  <div className="muted">{a.specialization || 'Consultation'} · for {a.patientName}{a.age ? ` (${a.age})` : ''}</div>
                  <div className="appt-meta">
                    <span className={`badge badge-${a.status}`}>{a.status}</span>
                    <span className="badge"><Clock size={12} /> {a.time}</span>
                    <span className="badge"><IndianRupee size={12} /> {a.consultationFee ?? 0} · {a.paymentMethod || 'N/A'}</span>
                    <span className={`badge badge-${(a.paymentStatus || 'pending').toLowerCase()}`}>Payment {a.paymentStatus || 'Pending'}</span>
                  </div>
                  {a.problem && <div className="muted" style={{ marginTop: 8 }}><Stethoscope size={13} style={{ verticalAlign: '-2px' }} /> {a.problem}</div>}
                  {a.adminNote && <div className="alert alert-info" style={{ marginTop: 10 }}>Note from clinic: {a.adminNote}</div>}
                  {a.cancelReason && <div className="muted" style={{ marginTop: 8 }}>Cancel reason: {a.cancelReason}</div>}
                </div>
                <div className="appt-actions">
                  {active && <button className="btn btn-danger btn-sm" onClick={() => setCancelling(a)}>Cancel</button>}
                  {!active && <button className="btn btn-ghost btn-sm" onClick={() => remove(a)}>Remove</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {cancelling && <CancelDialog appointment={cancelling} onClose={() => setCancelling(null)} onDone={load} />}
    </>
  )
}
