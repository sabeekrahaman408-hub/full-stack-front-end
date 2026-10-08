'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Pill, Plus, Pencil, Trash2, Stethoscope, User, Paperclip, Eye, Sparkles, Upload } from 'lucide-react'
import { api, formatBytes, getUser, MedicalRecord, openProtectedFile, todayLocal } from '@/lib/api'
import AiSummary from '@/components/AiSummary'
import { toast } from '@/components/Toaster'

const CATEGORIES = ['Allergy', 'Lab report', 'Prescription', 'Vaccination', 'Surgery', 'Chronic condition', 'Other']

type Form = { title: string; category: string; doctorName: string; recordDate: string; prescription: string; notes: string }
const EMPTY: Form = { title: '', category: 'Other', doctorName: '', recordDate: '', prescription: '', notes: '' }

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'doctor' | 'patient'>('all')

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyze, setAnalyze] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      setRecords(await api<MedicalRecord[]>('/patients/me/records'))
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

  const shown = useMemo(
    () => records.filter((r) => filter === 'all' || (r.source || 'doctor') === filter),
    [records, filter]
  )

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY, recordDate: todayLocal() })
    setFile(null)
    setAnalyze(true)
    setFormError('')
    setOpen(true)
  }

  const openEdit = (r: MedicalRecord) => {
    setEditingId(r.id)
    setFile(null)
    setForm({
      title: r.diagnosis,
      category: r.category || 'Other',
      doctorName: r.doctorName || '',
      recordDate: r.recordDate || '',
      prescription: r.prescription || '',
      notes: r.notes || '',
    })
    setFormError('')
    setOpen(true)
  }

  const pickFile = (f: File | null) => {
    setFormError('')
    if (!f) return setFile(null)
    const okType = /\.(pdf|jpe?g|png|webp)$/i.test(f.name)
    if (!okType) return setFormError('Only PDF, JPG, PNG or WEBP files are allowed')
    if (f.size > 10 * 1024 * 1024) return setFormError('That file is larger than 10 MB')
    setFile(f)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editingId) {
        await api(`/patients/me/records/${editingId}`, { method: 'PUT', body: JSON.stringify({ ...form, recordDate: form.recordDate || null }) })
        toast('Record updated')
      } else if (file) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('title', form.title)
        fd.append('category', form.category)
        fd.append('doctorName', form.doctorName)
        if (form.recordDate) fd.append('recordDate', form.recordDate)
        fd.append('prescription', form.prescription)
        fd.append('notes', form.notes)
        fd.append('analyze', String(analyze))
        const created = await api<MedicalRecord>('/patients/me/records/upload', { method: 'POST', body: fd })
        toast(created.aiStatus === 'done' ? 'File uploaded and read' : 'File uploaded', 'success')
      } else {
        await api('/patients/me/records', { method: 'POST', body: JSON.stringify({ ...form, recordDate: form.recordDate || null }) })
        toast('Record added')
      }
      setOpen(false)
      await load()
    } catch (err: any) {
      setFormError(err.message)
    }
    setSaving(false)
  }

  const viewFile = async (r: MedicalRecord) => {
    try {
      await openProtectedFile(`/patients/me/records/${r.id}/file`)
    } catch (e: any) {
      toast(e.message, 'error')
    }
  }

  const reanalyze = async (r: MedicalRecord) => {
    setBusyId(r.id)
    try {
      const updated = await api<MedicalRecord>(`/patients/me/records/${r.id}/analyze`, { method: 'POST' })
      toast(updated.aiStatus === 'done' ? 'File read successfully' : updated.aiSummary || 'Could not read the file', updated.aiStatus === 'done' ? 'success' : 'error')
      await load()
    } catch (e: any) {
      toast(e.message, 'error')
    }
    setBusyId(null)
  }

  const remove = async (r: MedicalRecord) => {
    if (!window.confirm(`Delete "${r.diagnosis}"? This cannot be undone.`)) return
    try {
      await api(`/patients/me/records/${r.id}`, { method: 'DELETE' })
      toast('Record deleted')
      load()
    } catch (e: any) {
      toast(e.message, 'error')
    }
  }

  const dateOf = (r: MedicalRecord) => {
    const raw = r.recordDate || r.createdAt
    return raw ? new Date(raw).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow">Health records</p>
            <h1>Medical records</h1>
            <p>Notes from your doctors, plus anything you want to keep: allergies, lab reports, old prescriptions.</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add record</button>
        </div>
      </section>

      <div className="wrap page-body">
        <div className="tabs">
          {([['all', 'All'], ['doctor', 'From my doctors'], ['patient', 'Added by me']] as const).map(([id, label]) => (
            <button key={id} className={`chip ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <p className="no-data">Loading…</p>}

        {!loading && !error && shown.length === 0 && (
          <div className="empty">
            <h3>No records here yet</h3>
            <p>Doctor notes appear after a completed visit. You can also add your own records any time.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 14 }}>
              <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add a record</button>
              <Link href="/doctors" className="btn btn-outline">Book an appointment</Link>
            </div>
          </div>
        )}

        <div className="appt-list">
          {shown.map((r) => {
            const mine = r.source === 'patient'
            return (
              <div className="panel" key={r.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0 }}><FileText size={18} style={{ verticalAlign: '-3px' }} /> {r.diagnosis}</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {r.category && <span className="badge">{r.category}</span>}
                    <span className="badge">{mine ? <><User size={12} /> Added by you</> : <><Stethoscope size={12} /> Doctor</>}</span>
                    <span className="badge">{dateOf(r)}</span>
                  </div>
                </div>
                {r.doctorName && <p className="muted" style={{ margin: '6px 0 12px' }}>{mine ? 'Doctor / hospital' : 'Seen by'}: {r.doctorName}</p>}
                {r.prescription && (
                  <div className="alert alert-info"><Pill size={14} style={{ verticalAlign: '-2px' }} /> <strong>{mine ? 'Details' : 'Prescription'}:</strong> {r.prescription}</div>
                )}
                {r.notes && <p style={{ margin: '10px 0 0', color: 'var(--ink-soft)' }}>{r.notes}</p>}

                {r.hasFile && (
                  <div className="file-row">
                    <span className="file-chip"><Paperclip size={14} /> {r.fileName}{r.fileSize ? ` · ${formatBytes(r.fileSize)}` : ''}</span>
                    <button className="btn btn-outline btn-sm" onClick={() => viewFile(r)}><Eye size={14} /> View file</button>
                    {r.aiStatus !== 'done' && (
                      <button className="btn btn-primary btn-sm" disabled={busyId === r.id} onClick={() => reanalyze(r)}>
                        <Sparkles size={14} /> {busyId === r.id ? 'Reading…' : r.aiStatus === 'none' ? 'Read with AI' : 'Try again'}
                      </button>
                    )}
                  </div>
                )}
                {r.hasFile && r.aiStatus === 'done' && r.aiSummary && <AiSummary text={r.aiSummary} />}
                {r.hasFile && (r.aiStatus === 'failed' || r.aiStatus === 'skipped') && r.aiSummary && (
                  <div className="alert alert-info" style={{ marginTop: 12 }}>{r.aiSummary}</div>
                )}
                {r.hasFile && r.aiStatus === 'done' && (
                  <div className="muted" style={{ marginTop: 6 }}>
                    Read by AI to help you understand the file - not a diagnosis. Please confirm with your doctor.
                    <button className="btn btn-ghost btn-sm" disabled={busyId === r.id} onClick={() => reanalyze(r)} style={{ marginLeft: 6 }}>
                      {busyId === r.id ? 'Reading…' : 'Read again'}
                    </button>
                  </div>
                )}
                {mine && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(r)}><Trash2 size={14} /> Delete</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {open && (
        <div className="modal-backdrop" onClick={() => !saving && setOpen(false)} role="dialog" aria-modal="true">
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editingId ? 'Edit record' : 'Add a medical record'}</h3>
            {formError && <div className="alert alert-error">{formError}</div>}
            {!editingId && (
              <div className="field">
                <span>Attach a file (optional)</span>
                <label className={`dropzone ${file ? 'has-file' : ''}`}>
                  <Upload size={22} />
                  {file ? (
                    <strong>{file.name} <small>({formatBytes(file.size)})</small></strong>
                  ) : (
                    <strong>Tap to choose a prescription, injection record, lab report or scan</strong>
                  )}
                  <small>PDF, JPG, PNG or WEBP · up to 10 MB</small>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*" onChange={(e) => pickFile(e.target.files?.[0] || null)} hidden />
                </label>
                {file && (
                  <>
                    <label className="check-row">
                      <input type="checkbox" checked={analyze} onChange={(e) => setAnalyze(e.target.checked)} />
                      <span>Read this file automatically with AI and explain it in simple words. The file is sent securely to Anthropic&apos;s Claude for reading only.</span>
                    </label>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFile(null)}>Remove file</button>
                  </>
                )}
              </div>
            )}
            <label className="field"><span>Title {file ? '(optional)' : '*'}</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required={!file} maxLength={300} placeholder={file ? 'Leave empty to use the file name' : 'e.g. Penicillin allergy, Blood test – March'} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label className="field"><span>Category</span>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="field"><span>Date</span>
                <input type="date" max={todayLocal()} value={form.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} />
              </label>
            </div>
            <label className="field"><span>Doctor / hospital (optional)</span>
              <input value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} placeholder="Who treated you?" />
            </label>
            <label className="field"><span>Details / medicines (optional)</span>
              <textarea value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })} maxLength={2000} />
            </label>
            <label className="field"><span>Notes (optional)</span>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={2000} />
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? (file && analyze ? 'Uploading & reading…' : 'Saving…') : editingId ? 'Save changes' : file ? 'Upload' : 'Add record'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
