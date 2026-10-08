'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CalendarCheck, ShieldCheck, Stethoscope, Clock, Star } from 'lucide-react'
import DoctorCard from '@/components/DoctorCard'
import DoctorSkeleton from '@/components/DoctorSkeleton'
import { api, Doctor } from '@/lib/api'

type PublicStats = { doctors: number; patients: number; appointments: number; averageRating: number }

const testimonials = [
  { name: 'Sarah J.', text: 'Booking took under two minutes and the doctor was thoroughly prepared. I could see my fee before paying.', tag: 'Cardiology consultation' },
  { name: 'Michael C.', text: 'Got a slot the same day. Tracking my appointment status from one page is exactly what I needed.', tag: 'General check-up' },
  { name: 'Emily R.', text: 'Clear, calm, and professional from search to follow-up. The best online booking experience I have used.', tag: 'Dermatology' },
]

export default function Home() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [featured, setFeatured] = useState<Doctor[]>([])
  const [specs, setSpecs] = useState<string[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    api<PublicStats>('/public/stats').then(setStats).catch(() => {})
    api<Doctor[]>('/doctors').then((d) => setFeatured([...d].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4))).catch(() => {})
    api<{ specializations: string[] }>('/doctors/filters').then((f) => setSpecs(f.specializations)).catch(() => {})
  }, [])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/doctors${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Trusted doctors · Transparent fees</p>
            <h1>Healthcare that feels <em>effortless</em>.</h1>
            <p className="lead">
              Browse verified specialists, pick a time that suits you and track every appointment — all in one calm, secure place.
            </p>
            <div className="hero-cta">
              <Link href="/doctors" className="btn btn-primary">Find a doctor</Link>
              <Link href="/about" className="btn btn-outline">About us</Link>
            </div>
            <div className="hero-trust">
              <div><strong>{stats ? stats.doctors : '—'}</strong>Specialist doctors</div>
              <div><strong>{stats ? stats.appointments : '—'}</strong>Appointments booked</div>
              <div><strong>{stats && stats.averageRating ? stats.averageRating.toFixed(1) : '—'}</strong>Average rating</div>
            </div>
          </div>

          <div className="collage" aria-hidden="true">
            <figure className="tall"><img src="/img1.jpg" alt="" /><figcaption>Cardiology</figcaption></figure>
            <figure><img src="/img24.jpg" alt="" /><figcaption>Psychiatry</figcaption></figure>
            <figure><img src="/img13.jpg" alt="" /><figcaption>Pediatrics</figcaption></figure>
            <figure className="wide"><img src="/img3.jpg" alt="" style={{ objectPosition: 'center 25%' }} /><figcaption>Neurology</figcaption></figure>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div className="wrap searchbar">
        <form className="searchbar-inner" onSubmit={search} style={{ gridTemplateColumns: '1fr auto' }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by doctor name or specialization…" aria-label="Search doctors" />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </div>

      {/* SPECIALTIES */}
      {specs.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <p className="eyebrow">Specialties</p>
            <h2 className="section-title">Every kind of care, one place</h2>
            <div className="chips">
              {specs.map((s) => (
                <Link key={s} href={`/doctors?specialization=${encodeURIComponent(s)}`} className="chip">{s}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED DOCTORS */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Top rated</p>
              <h2 className="section-title">Meet our doctors</h2>
            </div>
            <Link href="/doctors" className="btn btn-outline btn-sm">View all doctors</Link>
          </div>
          <p className="section-sub">Experienced specialists, ranked by real patient ratings.</p>
          {featured.length === 0 ? <DoctorSkeleton count={4} /> : (
            <div className="doctor-gallery">
              {featured.map((d) => <DoctorCard key={d.id} doctor={d} />)}
            </div>
          )}
        </div>
      </section>

      {/* WHY */}
      <section className="section tint">
        <div className="wrap">
          <p className="eyebrow">Why Apollo Care</p>
          <h2 className="section-title">Designed around the patient</h2>
          <p className="section-sub">Everything you need, nothing you don&apos;t.</p>
          <div className="feature-grid">
            <div className="feature"><div className="icon"><Clock size={22} /></div><h3>Book in minutes</h3><p>Pick a doctor, date and slot. Taken slots are blocked automatically so you never double-book.</p></div>
            <div className="feature"><div className="icon"><ShieldCheck size={22} /></div><h3>Secure by default</h3><p>Encrypted passwords, token-based sessions and your records visible only to you.</p></div>
            <div className="feature"><div className="icon"><CalendarCheck size={22} /></div><h3>Track everything</h3><p>See pending, confirmed and completed visits at a glance — and cancel with one click.</p></div>
            <div className="feature"><div className="icon"><Stethoscope size={22} /></div><h3>Verified specialists</h3><p>Qualifications, experience, languages and fees shown up front before you commit.</p></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Patient stories</p>
          <h2 className="section-title">Care people recommend</h2>
          <div className="quote-grid" style={{ marginTop: 28 }}>
            {testimonials.map((t) => (
              <div className="quote" key={t.name}>
                <div style={{ color: 'var(--gold)', marginBottom: 10, display: 'flex', gap: 2 }}>
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p>“{t.text}”</p>
                <cite>{t.name} · {t.tag}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h2>Ready to see a doctor?</h2>
              <p>Create a free account and book your first appointment today.</p>
            </div>
            <Link href="/register" className="btn btn-light">Get started</Link>
          </div>
        </div>
      </section>
    </>
  )
}
