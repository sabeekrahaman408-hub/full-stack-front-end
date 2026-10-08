'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { clearSession, getUser, StoredUser } from '@/lib/api'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => setUser(getUser())
    sync()
    window.addEventListener('auth-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('auth-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    setUser(getUser())
  }, [pathname])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]
  if (user?.role === 'admin') links.push({ href: '/admin', label: 'Admin' })
  else if (user?.role === 'doctor') links.push({ href: '/doctor', label: 'Doctor Panel' })
  else if (user) links.push({ href: '/history', label: 'My Appointments' }, { href: '/records', label: 'Records' })

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const logout = () => {
    clearSession()
    router.push('/login')
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">+</span>
          <span>
            Apollo Care
            <small>Online Appointments</small>
          </span>
        </Link>

        <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/dashboard'} className="user-chip">
                <span className="avatar">{user.name?.charAt(0) || '?'}</span>
                <span className="hide-sm">{user.name?.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={logout} aria-label="Log out">
                <LogOut size={16} /> <span className="hide-sm">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm hide-sm">Log in</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
