'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/Toaster'
import { api, getUser } from '@/lib/api'

type Me = { name: string; email: string; phone?: string }

export default function ProfilePage() {
  const router = useRouter()
  const [me, setMe] = useState<Me>({ name: '', email: '', phone: '' })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!getUser()) {
      router.push('/login')
      return
    }
    api<Me>('/patients/me').then((m) => setMe({ ...m, phone: m.phone || '' })).catch((e) => setMsg({ type: 'error', text: e.message }))
  }, [router])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated = await api<Me>('/patients/me', { method: 'PUT', body: JSON.stringify({ name: me.name, phone: me.phone }) })
      // keep the navbar name in sync
      const u = getUser()
      if (u) {
        localStorage.setItem('user', JSON.stringify({ ...u, name: updated.name }))
        window.dispatchEvent(new Event('auth-changed'))
      }
      setMsg(null)
      toast('Profile updated')
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message })
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api('/patients/me/password', { method: 'PUT', body: JSON.stringify(pw) })
      setPw({ currentPassword: '', newPassword: '' })
      setPwMsg(null)
      toast('Password changed')
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message })
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Account</p>
          <h1>Your profile</h1>
          <p>Keep your details up to date so clinics can reach you.</p>
        </div>
      </section>

      <div className="wrap page-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        <form className="panel" onSubmit={saveProfile}>
          <h3>Personal details</h3>
          <label className="field"><span>Full name</span><input value={me.name} onChange={(e) => setMe({ ...me, name: e.target.value })} required /></label>
          <label className="field"><span>Email (cannot be changed)</span><input value={me.email} disabled /></label>
          <label className="field"><span>Phone</span><input value={me.phone || ''} onChange={(e) => setMe({ ...me, phone: e.target.value })} placeholder="+91 98765 43210" /></label>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <button className="btn btn-primary" type="submit">Save changes</button>
        </form>

        <form className="panel" onSubmit={changePassword}>
          <h3>Change password</h3>
          <label className="field"><span>Current password</span><input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required /></label>
          <label className="field"><span>New password (min 6 characters)</span><input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} minLength={6} required /></label>
          {pwMsg && <div className={`alert alert-${pwMsg.type}`}>{pwMsg.text}</div>}
          <button className="btn btn-primary" type="submit">Update password</button>
        </form>
      </div>
    </>
  )
}
