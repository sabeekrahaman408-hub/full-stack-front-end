'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar, CalendarX, CreditCard, FileText, UserCog, Search, X, ChevronLeft, ChevronRight,
  ArrowRight, MessageCircle, Sparkles, AlertTriangle, ChevronDown,
} from 'lucide-react'
import ChatBot from '@/components/ChatBot'

type Cat = 'Booking' | 'Cancellations' | 'Payments' | 'Records' | 'Account'

type Faq = {
  id: number
  cat: Cat
  q: string
  a: string
  steps?: string[]
  link?: { label: string; href: string }
}

const CATS: { id: Cat; label: string; blurb: string; color: string; icon: any }[] = [
  { id: 'Booking', label: 'Booking', blurb: 'Find a doctor and pick a slot', color: '#0f766e', icon: Calendar },
  { id: 'Cancellations', label: 'Cancellations', blurb: 'Cancel, change or get help', color: '#c2410c', icon: CalendarX },
  { id: 'Payments', label: 'Payments', blurb: 'Fees, methods and card safety', color: '#1d4ed8', icon: CreditCard },
  { id: 'Records', label: 'Medical records', blurb: 'Upload files and AI reading', color: '#7c3aed', icon: FileText },
  { id: 'Account', label: 'Account & security', blurb: 'Login, profile and privacy', color: '#b7791f', icon: UserCog },
]
const colorOf = (c: Cat) => CATS.find((x) => x.id === c)!.color
const iconOf = (c: Cat) => CATS.find((x) => x.id === c)!.icon

const FAQS: Faq[] = [
  // ---- Booking
  { id: 1, cat: 'Booking', q: 'How do I book an appointment?',
    a: 'Booking takes about two minutes. You need to be logged in as a patient.',
    steps: ['Sign in (or create a free account).', 'Open the Doctors page, search or filter, and pick a doctor.', 'Choose a date, then a free time slot.', 'Fill in the patient details.', 'Choose how you will pay and press Book.'],
    link: { label: 'Find a doctor', href: '/doctors' } },
  { id: 2, cat: 'Booking', q: 'Which dates and times can I choose?',
    a: 'You can book from today up to 60 days ahead, Monday to Saturday (Sundays are closed). Slots are 30 minutes long, between 9:00 am – 1:00 pm and 4:00 – 7:00 pm. Slots that are already booked, or have already passed today, are greyed out so you can never double-book.' },
  { id: 3, cat: 'Booking', q: 'What details do I need to enter?',
    a: 'The form checks everything as you type:',
    steps: ['Patient name – letters only, no numbers.', 'Age – 1 or 2 digits (1 to 99).', 'Mobile number – exactly 10 digits, starting with 6, 7, 8 or 9.', 'Reason for visit – at least 5 characters.'] },
  { id: 4, cat: 'Booking', q: 'Can I book for a family member?',
    a: 'Yes. The appointment is saved in your account, but the name, age and mobile number you enter on the form are the patient’s, so you can book for a parent, child or friend. Just use the patient’s own details.' },
  { id: 5, cat: 'Booking', q: 'Why does my appointment say “pending”?',
    a: 'Every new booking is a request that the doctor must accept. It shows as pending until then, and changes to approved once the doctor accepts. If the doctor cannot take it, the status becomes rejected and you will see the reason. You can follow the status any time on My Appointments.',
    link: { label: 'My appointments', href: '/history' } },

  // ---- Cancellations
  { id: 6, cat: 'Cancellations', q: 'How do I cancel an appointment?',
    a: 'You can cancel in a few taps:',
    steps: ['Open My Appointments (or your Dashboard).', 'Press Cancel on the appointment.', 'Choose a reason and confirm.'],
    link: { label: 'My appointments', href: '/history' } },
  { id: 7, cat: 'Cancellations', q: 'Until when can I cancel?',
    a: 'Pending and approved appointments can be cancelled any time before their start time. Once the appointment time has passed, or after it is completed or rejected, it can no longer be cancelled. When you cancel, the time slot is released for other patients straight away.' },
  { id: 8, cat: 'Cancellations', q: 'Can I reschedule instead?',
    a: 'Rescheduling is not available yet. The quickest way is to cancel the old appointment and book a new slot with the same doctor – it only takes a minute.' },
  { id: 9, cat: 'Cancellations', q: 'Will I get a refund if I cancel?',
    a: 'Cancelling does not move money automatically. If you paid online and need a refund, please contact the clinic through the Contact page with your appointment details and the team will help.',
    link: { label: 'Contact us', href: '/contact' } },

  // ---- Payments
  { id: 10, cat: 'Payments', q: 'Which payment methods can I use?',
    a: 'You can choose Cash (pay at the clinic – the payment shows as pending until then), UPI, or a debit / credit card. Choose the method on the last step of the booking form.' },
  { id: 11, cat: 'Payments', q: 'How much is the consultation fee?',
    a: 'Each doctor sets their own fee. It is shown in rupees on the doctor’s card on the Doctors page and again on the booking page before you confirm, so there are no surprises.',
    link: { label: 'See doctor fees', href: '/doctors' } },
  { id: 12, cat: 'Payments', q: 'Is my card information stored?',
    a: 'No. We only keep the last 4 digits of a card so you can recognise the payment. The full card number and the CVV are never stored.' },

  // ---- Records
  { id: 13, cat: 'Records', q: 'How do I add my medical records?',
    a: 'Keep all your health information in one place:',
    steps: ['Open the Records page and press Add record.', 'Choose a category (allergy, lab report, prescription, vaccination, surgery, chronic condition or other).', 'Add a title, date and any notes – and attach a file if you have one.', 'Press Add record or Upload.'],
    link: { label: 'Open my records', href: '/records' } },
  { id: 14, cat: 'Records', q: 'What files can I upload?',
    a: 'PDF, JPG, PNG or WEBP files up to 10 MB – for example prescriptions, injection or vaccination records, lab reports and scan reports. Files are checked by their real content, so renamed or unsafe files are refused.' },
  { id: 15, cat: 'Records', q: 'What is the automatic AI reading?',
    a: 'If you tick “Read this file automatically with AI” when uploading, the file is read and explained in simple words: what kind of document it is, a short summary, any medicines or injections with dose and frequency, test results, and points to ask your doctor. It is an explanation to help you understand your file – not a diagnosis – so always confirm with your doctor. The file is sent for reading only when you tick the box or press Read with AI.' },
  { id: 16, cat: 'Records', q: 'Can I edit or delete my records?',
    a: 'You can edit or delete any record you added yourself; deleting a record also deletes its file. Notes written by your doctor after a visit are read-only so they stay accurate.' },

  // ---- Account
  { id: 17, cat: 'Account', q: 'How do I create an account?',
    a: 'Press Sign up, enter your name, email and a password (at least 6 characters), then sign in. It is free.',
    link: { label: 'Create an account', href: '/register' } },
  { id: 18, cat: 'Account', q: 'How do I change my name, phone or password?',
    a: 'Open the Profile page. You can update your name and phone number, and change your password by entering your current one first.',
    link: { label: 'Open profile', href: '/profile' } },
  { id: 19, cat: 'Account', q: 'I am a doctor – how do I get a login?',
    a: 'Doctors cannot sign up on their own. The clinic administrator creates your login. Once you have it, choose the Doctor tab on the Login page to open your Doctor Panel, where you accept requests and write notes and prescriptions.',
    link: { label: 'Go to login', href: '/login' } },
  { id: 20, cat: 'Account', q: 'How is my data kept safe?',
    a: 'Passwords are stored encrypted, never as plain text. After 5 wrong password attempts an account is locked for 15 minutes. Your appointments and medical records can only be opened by you (and the clinic staff who treat you).' },
]

export default function FAQPage() {
  const [cat, setCat] = useState<Cat | 'All'>('All')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatSeed, setChatSeed] = useState<string | undefined>(undefined)
  const [chatKey, setChatKey] = useState(0)
  const [nudge, setNudge] = useState(false)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) =>
      (cat === 'All' || f.cat === cat) &&
      (!q || `${f.q} ${f.a} ${(f.steps || []).join(' ')}`.toLowerCase().includes(q))
    )
  }, [cat, query])

  const current = FAQS.find((f) => f.id === openId) || null
  const idx = current ? list.findIndex((f) => f.id === current.id) : -1
  const related = current ? FAQS.filter((f) => f.cat === current.cat && f.id !== current.id).slice(0, 3) : []

  const step = useCallback((d: number) => {
    if (idx < 0 || list.length === 0) return
    setOpenId(list[(idx + d + list.length) % list.length].id)
  }, [idx, list])

  // popup: Esc to close, arrows to move, page behind does not scroll
  useEffect(() => {
    if (openId === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [openId, step])

  // friendly pop-up message that slides in once per visit
  useEffect(() => {
    try {
      if (sessionStorage.getItem('faqNudgeSeen')) return
    } catch { /* ignore */ }
    const show = setTimeout(() => setNudge(true), 3500)
    const hide = setTimeout(() => setNudge(false), 16000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  const dismissNudge = () => {
    setNudge(false)
    try { sessionStorage.setItem('faqNudgeSeen', '1') } catch { /* ignore */ }
  }

  const openChat = (seed?: string) => {
    setOpenId(null)
    setChatSeed(seed)
    setChatKey((k) => k + 1)
    setChatOpen(true)
    dismissNudge()
  }

  const Icon = current ? iconOf(current.cat) : null

  return (
    <>
      <section className="page-head faq-hero">
        <div className="wrap">
          <p className="eyebrow">Help centre</p>
          <h1>How can we help?</h1>
          <p>Quick answers about booking, cancelling, payments and your medical records. Tap any question to read the answer.</p>

          <div className="faq-search">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, e.g. cancel, refund, upload…"
              aria-label="Search the help centre"
            />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
          </div>

          <div className="faq-emergency">
            <AlertTriangle size={16} /> Medical emergency? Don&apos;t wait – call <strong>112</strong> or go to the nearest hospital.
          </div>
        </div>
      </section>

      <div className="wrap page-body">
        {/* categories */}
        <div className="faq-cats">
          <button className={`faq-cat ${cat === 'All' ? 'active' : ''}`} style={{ ['--c' as any]: '#0f1f2e' }} onClick={() => setCat('All')}>
            <span className="faq-cat-icon"><Sparkles size={20} /></span>
            <strong>All questions</strong>
            <small>{FAQS.length} answers</small>
          </button>
          {CATS.map((c) => {
            const I = c.icon
            return (
              <button key={c.id} className={`faq-cat ${cat === c.id ? 'active' : ''}`} style={{ ['--c' as any]: c.color }} onClick={() => setCat(c.id)}>
                <span className="faq-cat-icon"><I size={20} /></span>
                <strong>{c.label}</strong>
                <small>{FAQS.filter((f) => f.cat === c.id).length} questions</small>
              </button>
            )
          })}
        </div>

        <p className="result-count">
          {list.length} {list.length === 1 ? 'question' : 'questions'}{query ? ` matching “${query}”` : ''}
        </p>

        {/* questions */}
        {list.length > 0 ? (
          <div className="faq-grid2">
            {list.map((f) => {
              const I = iconOf(f.cat)
              return (
                <button key={f.id} className="faq-q" style={{ ['--c' as any]: colorOf(f.cat) }} onClick={() => setOpenId(f.id)}>
                  <span className="faq-q-icon"><I size={18} /></span>
                  <span className="faq-q-text">
                    <small>{CATS.find((c) => c.id === f.cat)!.label}</small>
                    <strong>{f.q}</strong>
                  </span>
                  <ChevronRight size={18} className="faq-q-go" />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="empty">
            <h3>No answers found for “{query}”</h3>
            <p>Try different words, or ask our assistant – it can answer almost anything about Apollo Care.</p>
            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => openChat(query)}>
              <MessageCircle size={16} /> Ask the assistant
            </button>
          </div>
        )}

        {/* still need help */}
        <div className="cta-band faq-help">
          <div>
            <h2>Didn&apos;t find your answer?</h2>
            <p>Ask our assistant anything – it answers in seconds. Or send a message to the clinic team.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-light" onClick={() => openChat()}><MessageCircle size={16} /> Ask the assistant</button>
            <Link href="/contact" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>Contact us</Link>
          </div>
        </div>
      </div>

      {/* ---------------- answer popup ---------------- */}
      {current && Icon && (
        <div className="faq-modal-backdrop" onClick={() => setOpenId(null)}>
          <div className="faq-modal" role="dialog" aria-modal="true" aria-labelledby="faq-title" onClick={(e) => e.stopPropagation()} style={{ ['--c' as any]: colorOf(current.cat) }}>
            <div className="faq-modal-top">
              <span className="faq-modal-badge"><Icon size={16} /> {CATS.find((c) => c.id === current.cat)!.label}</span>
              <button className="faq-x" onClick={() => setOpenId(null)} aria-label="Close" autoFocus><X size={18} /></button>
            </div>

            <div className="faq-modal-body" key={current.id}>
              <h2 id="faq-title">{current.q}</h2>
              <p className="faq-answer-text">{current.a}</p>

              {current.steps && (
                <ol className="faq-steps">
                  {current.steps.map((s, i) => <li key={i}><span>{i + 1}</span><div>{s}</div></li>)}
                </ol>
              )}

              {current.link && (
                <Link href={current.link.href} className="btn btn-primary btn-sm" style={{ marginTop: 6 }}>
                  {current.link.label} <ArrowRight size={15} />
                </Link>
              )}

              {related.length > 0 && (
                <div className="faq-related">
                  <small>Related questions</small>
                  {related.map((r) => (
                    <button key={r.id} onClick={() => setOpenId(r.id)}><ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} /> {r.q}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="faq-modal-foot">
              <button className="btn btn-ghost btn-sm" onClick={() => step(-1)} disabled={list.length < 2} aria-label="Previous question"><ChevronLeft size={16} /> Prev</button>
              <button className="btn btn-outline btn-sm" onClick={() => openChat(current.q)}><MessageCircle size={15} /> Ask more</button>
              <button className="btn btn-ghost btn-sm" onClick={() => step(1)} disabled={list.length < 2} aria-label="Next question">Next <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- floating chat ---------------- */}
      {!chatOpen && (
        <>
          {nudge && (
            <div className="chat-nudge" role="status">
              <button onClick={dismissNudge} aria-label="Dismiss"><X size={14} /></button>
              <div onClick={() => openChat()} style={{ cursor: 'pointer' }}>
                <strong>Hi 👋 Need a hand?</strong>
                <span>Ask me anything about booking, payments or your records.</span>
              </div>
            </div>
          )}
          <button className="chat-fab" onClick={() => openChat()} aria-label="Open chat assistant">
            <MessageCircle size={22} />
            <span>Ask us</span>
          </button>
        </>
      )}

      {chatOpen && (
        <div className="chat-popup" role="dialog" aria-label="Chat assistant">
          <ChatBot key={chatKey} seed={chatSeed} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </>
  )
}
