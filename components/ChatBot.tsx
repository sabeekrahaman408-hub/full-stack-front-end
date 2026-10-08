'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, RotateCcw, User, AlertTriangle, X } from 'lucide-react'
import { api } from '@/lib/api'

type Msg = { role: 'user' | 'assistant'; content: string; mode?: string; error?: boolean }

const WELCOME: Msg = {
  role: 'assistant',
  content: "Hi! I'm the Apollo Care assistant. Ask me anything about booking, cancelling, payments, medical records or finding the right doctor.",
}

const SUGGESTIONS = [
  'How do I book an appointment?',
  'How can I cancel my appointment?',
  'Which doctor should I see for a skin problem?',
  'How do I upload my medical reports?',
  'What payment methods can I use?',
]

export default function ChatBot({ seed, onClose }: { seed?: string; onClose?: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const seeded = useRef(false)

  // keep the newest message in view - scroll only the chat box, never the whole page
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || loading) return
    const history = messages
      .filter((m) => m !== WELCOME && !m.error)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((cur) => [...cur, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    try {
      const res = await api<{ reply: string; mode: string }>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: question, history }),
      })
      setMessages((cur) => [...cur, { role: 'assistant', content: res.reply, mode: res.mode }])
    } catch (e: any) {
      setMessages((cur) => [...cur, { role: 'assistant', content: e.message || 'Sorry, something went wrong. Please try again.', error: true }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  // when opened from an FAQ popup, ask that question straight away (once)
  useEffect(() => {
    if (seed && !seeded.current) {
      seeded.current = true
      send(seed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = () => {
    setMessages([WELCOME])
    setInput('')
  }

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const onlyWelcome = messages.length === 1

  return (
    <div className="chat-card">
      <div className="chat-head">
        <div className="chat-avatar"><Bot size={22} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong>Ask Apollo Care</strong>
          <small><span className="chat-dot" /> Online · ask me anything</small>
        </div>
        <button className="btn btn-ghost btn-sm chat-reset" onClick={reset} title="Start a new chat" aria-label="Start a new chat">
          <RotateCcw size={15} /> <span>New chat</span>
        </button>
        {onClose && (
          <button className="btn btn-ghost btn-sm chat-reset" onClick={onClose} aria-label="Close chat" style={{ padding: '8px 10px' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="chat-list" ref={listRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`chat-row ${m.role}`}>
            <div className="chat-icon">{m.role === 'user' ? <User size={15} /> : <Bot size={15} />}</div>
            <div className={`chat-bubble ${m.role} ${m.mode === 'emergency' ? 'emergency' : ''} ${m.error ? 'error' : ''}`}>
              {m.mode === 'emergency' && <div className="chat-alert"><AlertTriangle size={14} /> Urgent</div>}
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-row assistant">
            <div className="chat-icon"><Bot size={15} /></div>
            <div className="chat-bubble assistant typing" aria-label="Assistant is typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {onlyWelcome && !loading && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input) }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 500))}
          onKeyDown={onKey}
          placeholder="Type your question…"
          rows={1}
          maxLength={500}
          aria-label="Your question"
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()} aria-label="Send">
          <Send size={16} /> <span className="chat-send-text">Send</span>
        </button>
      </form>
      <p className="chat-note">
        Automated assistant - not a doctor, and it can't see your account. In an emergency call 112 right away.
      </p>
    </div>
  )
}
