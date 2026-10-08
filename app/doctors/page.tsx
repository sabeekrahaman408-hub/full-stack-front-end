'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DoctorCard from '@/components/DoctorCard'
import DoctorSkeleton from '@/components/DoctorSkeleton'
import { api, Doctor } from '@/lib/api'

function DoctorsInner() {
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [spec, setSpec] = useState(params.get('specialization') || '')
  const [loc, setLoc] = useState(params.get('location') || '')
  const [options, setOptions] = useState<{ specializations: string[]; locations: string[] }>({ specializations: [], locations: [] })
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api<typeof options>('/doctors/filters').then(setOptions).catch(() => {})
  }, [])

  // debounce typing so we do not call the API on every keystroke
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(async () => {
      const qs = new URLSearchParams()
      if (q.trim()) qs.set('q', q.trim())
      if (spec) qs.set('specialization', spec)
      if (loc) qs.set('location', loc)
      try {
        setDoctors(await api<Doctor[]>(`/doctors${qs.toString() ? `?${qs}` : ''}`))
        setError('')
      } catch (e: any) {
        setError(e.message)
      }
      setLoading(false)
    }, 250)
    return () => clearTimeout(t)
  }, [q, spec, loc])

  const reset = () => { setQ(''); setSpec(''); setLoc('') }

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Our specialists</p>
          <h1>Find your doctor</h1>
          <p>Search by name or specialty, filter by city, and book a slot that works for you.</p>
        </div>
      </section>

      <div className="wrap page-body">
        <div className="filters">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctor or specialization…" aria-label="Search" />
          <select value={spec} onChange={(e) => setSpec(e.target.value)} aria-label="Specialization">
            <option value="">All specialties</option>
            {options.specializations.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={loc} onChange={(e) => setLoc(e.target.value)} aria-label="Location">
            <option value="">All cities</option>
            {options.locations.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {!error && !loading && <p className="result-count">{doctors.length} doctor{doctors.length === 1 ? '' : 's'} found</p>}

        {loading && doctors.length === 0 ? (
          <DoctorSkeleton count={8} />
        ) : !loading && !error && doctors.length === 0 ? (
          <div className="empty"><h3>No doctors match your search</h3><p>Try a different name, specialty or city.</p></div>
        ) : (
          <div className="doctor-gallery">
            {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        )}
      </div>
    </>
  )
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsInner />
    </Suspense>
  )
}
