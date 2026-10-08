'use client'

import { useEffect, useState } from 'react'

type Toast = { id: number; type: 'success' | 'error' | 'info'; text: string }

/** Call toast('Saved!') from anywhere – replaces blocking alert() popups. */
export function toast(text: string, type: Toast['type'] = 'success') {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('app-toast', { detail: { text, type } }))
}

export default function Toaster() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(() => {
    const onToast = (e: Event) => {
      const { text, type } = (e as CustomEvent).detail
      const id = Date.now() + Math.random()
      setItems((cur) => [...cur, { id, type, text }])
      setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 4000)
    }
    window.addEventListener('app-toast', onToast)
    return () => window.removeEventListener('app-toast', onToast)
  }, [])

  return (
    <div className="toaster" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>
      ))}
    </div>
  )
}
