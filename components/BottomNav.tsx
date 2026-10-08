'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Stethoscope, Info, CalendarDays, User } from 'lucide-react'
import { getUser, StoredUser } from '@/lib/api'

/** Thumb-friendly tab bar, only visible on phones (CSS hides it on larger screens). */
export default function BottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    const sync = () => setUser(getUser())
    sync()
    window.addEventListener('auth-changed', sync)
    return () => window.removeEventListener('auth-changed', sync)
  }, [])

  const tabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/about', label: 'About', icon: Info },
    { href: user ? (user.role === 'admin' ? '/admin' : user.role === 'doctor' ? '/doctor' : '/history') : '/login', label: user ? (user.role === 'admin' ? 'Admin' : user.role === 'doctor' ? 'Panel' : 'Visits') : 'Log in', icon: CalendarDays },
    { href: user ? (user.role === 'admin' || user.role === 'doctor' ? '/profile' : '/profile') : '/register', label: user ? 'Account' : 'Sign up', icon: User },
  ]

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <nav className="bottom-nav" aria-label="Quick navigation">
      {tabs.map((t) => {
        const Icon = t.icon
        return (
          <Link key={t.label} href={t.href} className={active(t.href) ? 'active' : ''}>
            <Icon size={20} />
            <span>{t.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
