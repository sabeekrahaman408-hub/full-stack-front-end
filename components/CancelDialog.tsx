'use client'

import { useState } from 'react'
import { api, Appointment, formatDate } from '@/lib/api'
import { toast } from '@/components/Toaster'

const REASONS = ['Change of plans', 'Feeling better', 'Booked by mistake', 'Found another doctor', 'Other']

/** Confirmation dialog for cancelling an appointment (patients and admins). */
export default function CancelDialog({
  appointment,
  onClose,
  onDone,
}: {
  appointment: Appointment
  onClose: () => void
  onDone: () => void
}) {
  const [reason, setReason] = useState(REASONS[0])
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const text = details.trim() ? `${reason} - ${details.trim()}` : reason
      await api(`/appointments/${appointment.id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason: text }) })
      toast('Appointment cancelled')
      onDone()
      onClose()
    } catch (err: any) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={() => !busy && onClose()} role="dialog" aria-modal="true">
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>Cancel this appointment?</h3>
        <p className="muted" style={{ marginTop: -4 }}>
          {appointment.doctor} · {formatDate(appointment.date).long} · {appointment.time}
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <label className="field"><span>Reason</span>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label className="field"><span>Anything to add? (optional)</span>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Tell the clinic more…" maxLength={300} />
        </label>
        <p className="muted">Your time slot will be released for other patients. You can book again at any time.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Keep appointment</button>
          <button type="submit" className="btn btn-danger" disabled={busy}>{busy ? 'Cancelling…' : 'Yes, cancel it'}</button>
        </div>
      </form>
    </div>
  )
}
