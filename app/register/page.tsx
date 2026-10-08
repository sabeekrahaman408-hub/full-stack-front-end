'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { toast } from '@/components/Toaster'

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.trim() !== confirm.trim()) return setError('Passwords do not match')
    if (password.trim().length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: password.trim(), role: 'client' }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }
      toast('Account created! Please sign in.')
      router.push('/login')
    } catch {
      setError('Cannot reach the server. Please make sure the backend is running.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <img src="/img23.jpg" alt="" />
        <div className="auth-aside-overlay">
          <Link href="/" className="brand" style={{ color: '#fff' }}>
            <span className="brand-mark" style={{ background: '#fff', color: 'var(--teal)' }}>+</span>
            Apollo Care
          </Link>
          <div>
            <h2>Your health, organised.</h2>
            <p>Create a free account to book doctors, track visits and keep your medical records together.</p>
          </div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <p className="eyebrow">Get started</p>
          <h1>Create your account</h1>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="field"><span>Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" required />
            </label>
            <label className="field"><span>Email address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label className="field"><span>Password</span>
              <div className="password-wrap">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className="field"><span>Confirm password</span>
              <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" required />
            </label>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 6 }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-foot">Already registered? <Link href="/login" className="login-link">Sign in</Link></p>
        </div>
      </main>
    </div>
  )
}
