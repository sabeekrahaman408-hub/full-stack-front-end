'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck, CheckCircle2, Hourglass, ArrowRight } from 'lucide-react'
import CancelDialog from '@/components/CancelDialog'
import { api, Appointment, formatDate, getUser, homeFor, StoredUser, todayLocal } from '@/lib/api'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [items, setItems] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState<Appointment | null>(null)

  const reload = () => api<Appointment[]>('/appointments').then(setItems).catch((e) => setError(e.message))

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/login')
      return
    }
    if (u.role === 'admin' || u.role === 'doctor') {
      router.push(homeFor(u.role))
      return
    }
    setUser(u)
    api<Appointment[]>('/appointments')
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [router])

  const today = todayLocal()
  const upcoming = items
    .filter((a) => ['pending', 'approved', 'scheduled'].includes(a.status) && a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const next = upcoming[0]
  const pending = items.filter((a) => a.status === 'pending').length
  const completed = items.filter((a) => a.status === 'completed').length
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Dashboard</p>
          <h1>{greeting}, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p>Here&apos;s a quick look at your appointments.</p>
        </div>
      </section>

      <div className="wrap page-body">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="stat-grid">
          <div className="stat-card"><div className="stat-label"><CalendarCheck size={14} style={{ verticalAlign: '-2px' }} /> Upcoming</div><div className="stat-value">{upcoming.length}</div></div>
          <div className="stat-card"><div className="stat-label"><Hourglass size={14} style={{ verticalAlign: '-2px' }} /> Awaiting confirmation</div><div className="stat-value">{pending}</div></div>
          <div className="stat-card"><div className="stat-label"><CheckCircle2 size={14} style={{ verticalAlign: '-2px' }} /> Completed visits</div><div className="stat-value">{completed}</div></div>
          <div className="stat-card"><div className="stat-label">Total bookings</div><div className="stat-value">{items.length}</div></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, marginTop: 28 }}>
          <div className="panel">
            <h3>Next appointment</h3>
            {loading ? <p className="muted">Loading…</p> : next ? (
              <div className="appt" style={{ border: 'none', padding: 0, gridTemplateColumns: 'auto 1fr' }}>
                <div className="appt-date"><strong>{formatDate(next.date).day}</strong><span>{formatDate(next.date).month}</span></div>
                <div>
                  <h3 style={{ margin: 0 }}>{next.doctor}</h3>
                  <div className="muted">{next.specialization} · {next.time}</div>
                  <div className="appt-meta"><span className={`badge badge-${next.status}`}>{next.status}</span></div>
                  <button className="btn btn-danger btn-sm" style={{ marginTop: 12 }} onClick={() => setCancelling(next)}>Cancel appointment</button>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--ink-soft)' }}>You have nothing booked. <Link href="/doctors" className="login-link">Find a doctor →</Link></p>
            )}
          </div>

          <div className="panel">
            <h3>Quick actions</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              <Link href="/doctors" className="btn btn-primary">Book an appointment</Link>
              <Link href="/history" className="btn btn-outline">View all appointments <ArrowRight size={16} /></Link>
              <Link href="/records" className="btn btn-outline">My medical records</Link>
              <Link href="/profile" className="btn btn-ghost">Edit profile &amp; password</Link>
            </div>
          </div>
        </div>
      </div>

      {cancelling && <CancelDialog appointment={cancelling} onClose={() => setCancelling(null)} onDone={reload} />}
    </>
  )
}
