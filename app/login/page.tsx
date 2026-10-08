'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { User, Shield, Stethoscope, Eye, EyeOff } from 'lucide-react'
import { API_URL, homeFor } from '@/lib/api'

type Tab = 'client' | 'doctor' | 'admin'

const TABS: { id: Tab; label: string; icon: any; hint: string }[] = [
  { id: 'client', label: 'Patient', icon: User, hint: 'Book and manage your appointments' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, hint: 'Accept requests and write prescriptions' },
  { id: 'admin', label: 'Admin', icon: Shield, hint: 'Manage doctors, patients and payments' },
]

export default function Login() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), role: tab }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message || 'Invalid email or password')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'user',
        JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role, doctorId: data.doctorId })
      )
      window.dispatchEvent(new Event('auth-changed'))
      router.push(homeFor(data.role))
    } catch {
      setError('Cannot reach the server. Please make sure the backend is running.')
      setLoading(false)
    }
  }

  const current = TABS.find((t) => t.id === tab)!

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <img src="/img25.jpg" alt="" />
        <div className="auth-aside-overlay">
          <Link href="/" className="brand" style={{ color: '#fff' }}>
            <span className="brand-mark" style={{ background: '#fff', color: 'var(--teal)' }}>+</span>
            Apollo Care
          </Link>
          <div>
            <h2>Care that fits your day.</h2>
            <p>Trusted doctors, clear fees and every appointment in one secure place.</p>
          </div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in</h1>

          <div className="role-tabs" role="tablist">
            {TABS.map((t) => {
              const Icon = t.icon
              return (
                <button key={t.id} type="button" role="tab" aria-selected={tab === t.id}
                  className={tab === t.id ? 'active' : ''} onClick={() => { setTab(t.id); setError('') }}>
                  <Icon size={16} /> {t.label}
                </button>
              )
            })}
          </div>
          <p className="muted" style={{ margin: '0 0 18px' }}>{current.hint}</p>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Email address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-wrap">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 6 }}>
              {loading ? 'Signing in…' : `Sign in as ${current.label}`}
            </button>
          </form>

          <p className="auth-foot">
            {tab === 'client' ? (
              <>New to Apollo Care? <Link href="/register" className="login-link">Create an account</Link></>
            ) : tab === 'doctor' ? (
              <>Doctor accounts are created by the clinic admin.</>
            ) : (
              <>Administrator accounts are set up on the server and cannot be self-registered.</>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}
