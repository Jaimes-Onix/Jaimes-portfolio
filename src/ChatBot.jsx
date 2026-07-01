import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/* ============================================================
   Portfolio chat assistant — "Ask about Jaimes"
   Face: simple chatbot logo (.botface) — tangerine badge + chat bubble.
   Backend: POST /api/chat → Groq. Key stays server-side.
   The bot can suggest navigation; we render it as a button under its
   message, and only scroll when the visitor taps it.
   ============================================================ */

const EASE = [0.22, 1, 0.36, 1]

const GREETING =
  "Hey! I'm Jaimes's assistant. Ask me anything about Jaimes — his work, skills, experience — or about this portfolio site itself."

const SUGGESTIONS = [
  'What does Jaimes do?',
  'Take me to his projects',
  'How was this site built?',
  'Is he open to work?',
]

/* The bot can emit a hidden directive like [[goto:about]]. We turn it into a
   button under the message; tapping it scrolls. Map ids → a DOM target
   (element id, or a CSS selector for the footer). */
const SECTION_TARGETS = {
  top: 'top', home: 'top', hero: 'top',
  about: 'about', aboutus: 'about', aboutme: 'about',
  work: 'work', projects: 'work', project: 'work', portfolio: 'work',
  skills: 'skills', skill: 'skills', capabilities: 'skills',
  stack: 'stack', techstack: 'stack', tech: 'stack', technologies: 'stack',
  experience: 'experience', work_history: 'experience',
  education: 'education', certificates: 'education', certs: 'education', school: 'education',
  resume: '.footer', cv: '.footer', download: '.footer', footer: '.footer', contact: '.footer',
}
/* friendly button labels keyed by resolved target */
const TARGET_LABELS = {
  top: 'Top', about: 'About', work: 'Work', skills: 'Skills',
  stack: 'Tech Stack', experience: 'Experience', education: 'Education',
  '.footer': 'Résumé',
}
const GOTO_RE = /\[\[\s*goto\s*:\s*([a-z\s_-]+?)\s*\]\]/i

/* normalise a raw goto key → a resolved DOM target ('about' | '.footer' | null) */
function resolveTarget(key) {
  const norm = String(key).toLowerCase().replace(/[^a-z]/g, '')
  return SECTION_TARGETS[norm] || null
}

/* Smooth-scroll to a resolved target, offset for the fixed topbar. */
function scrollToTarget(target, reduce) {
  if (!target) return
  const el = target[0] === '.' ? document.querySelector(target) : document.getElementById(target)
  if (!el) return
  const topbar = document.getElementById('topbar')
  const offset = (topbar ? topbar.offsetHeight : 0) + 14
  const y = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
}

/* Simple chatbot logo — a tangerine badge with a white chat-bubble icon.
   Sized to `w` px; on-brand with the Onyx / tangerine system. */
function BotFace({ w = 100, className = '' }) {
  return (
    <span className={`botface ${className}`} style={{ '--bf': w }} aria-hidden="true">
      <span className="botface__badge">
        <svg className="botface__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4.5 4h15A1.5 1.5 0 0 1 21 5.5v9A1.5 1.5 0 0 1 19.5 16H10.2l-3.9 3.5A.7.7 0 0 1 5 19V16h-.5A1.5 1.5 0 0 1 3 14.5v-9A1.5 1.5 0 0 1 4.5 4Z"
            fill="#fff"
          />
          <circle cx="8.5" cy="10" r="1.3" fill="currentColor" />
          <circle cx="12" cy="10" r="1.3" fill="currentColor" />
          <circle cx="15.5" cy="10" r="1.3" fill="currentColor" />
        </svg>
      </span>
    </span>
  )
}

/* turn bare URLs in a reply into clickable links (opens in a new tab) */
function linkify(text) {
  return String(text)
    .split(/(https?:\/\/[^\s]+)/g)
    .map((seg, i) => {
      if (!/^https?:\/\//.test(seg)) return seg
      const href = seg.replace(/[.,;:!?'")\]]+$/, '') // drop trailing punctuation
      const trail = seg.slice(href.length)
      return (
        <span key={i}>
          <a className="cb-link" href={href} target="_blank" rel="noopener noreferrer">{href}</a>
          {trail}
        </span>
      )
    })
}

function Message({ role, content, goto, onGoto }) {
  const isUser = role === 'user'
  return (
    <div className={`cb-msg ${isUser ? 'cb-msg--user' : 'cb-msg--bot'}`}>
      {!isUser && (
        <span className="cb-msg__avatar">
          <BotFace w={28} />
        </span>
      )}
      <div className="cb-msg__col">
        <div className="cb-msg__bubble">{linkify(content)}</div>
        {!isUser && goto && (
          <button type="button" className="cb-goto" onClick={() => onGoto(goto)}>
            Go to {TARGET_LABELS[goto] || 'section'}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function ChatBot() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // {role, content}
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [peek, setPeek] = useState(false) // periodic "Ask about me" nudge

  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const launcherRef = useRef(null)

  // Periodically pop the "Ask about me" label while the launcher is closed,
  // as a gentle attention nudge (skipped under reduced-motion).
  useEffect(() => {
    if (open || reduce) return
    let hideT
    const peekOnce = () => {
      setPeek(true)
      hideT = setTimeout(() => setPeek(false), 2800)
    }
    const firstT = setTimeout(peekOnce, 4000) // first nudge shortly after load
    const id = setInterval(peekOnce, 10000) // then every 10s
    return () => {
      clearTimeout(firstT)
      clearTimeout(hideT)
      clearInterval(id)
      setPeek(false)
    }
  }, [open, reduce])

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, loading, reduce])

  // Focus the input on open; restore focus to the launcher on close. Escape closes.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      const onKey = (e) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => {
        clearTimeout(t)
        window.removeEventListener('keydown', onKey)
      }
    }
    launcherRef.current?.focus()
  }, [open])

  const send = useCallback(
    async (text) => {
      const trimmed = (text ?? '').trim()
      if (!trimmed || loading) return

      const nextMessages = [...messages, { role: 'user', content: trimmed }]
      setMessages(nextMessages)
      setInput('')
      setLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: nextMessages }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Request failed')

        // pull out any [[goto:section]] directive → render it as a button
        const raw = data.reply || ''
        const match = raw.match(GOTO_RE)
        const text =
          raw.replace(GOTO_RE, '').replace(/\n{3,}/g, '\n\n').trim() ||
          'Sure — use the button below. 👇'
        const goto = match ? resolveTarget(match[1]) : null
        setMessages((m) => [...m, { role: 'assistant', content: text, goto }])
      } catch (err) {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              (err && err.message) ||
              "Sorry — I couldn't reach the assistant just now. Please try again in a moment.",
          },
        ])
      } finally {
        setLoading(false)
        inputRef.current?.focus()
      }
    },
    [messages, loading],
  )

  // tapping a "Go to …" button scrolls there (and closes the panel on mobile)
  const handleGoto = useCallback(
    (target) => {
      const narrow = window.matchMedia('(max-width: 640px)').matches
      if (narrow) setOpen(false)
      setTimeout(() => scrollToTarget(target, reduce), narrow ? 320 : 40)
    },
    [reduce],
  )

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            className={`cb-launcher${peek ? ' is-peeking' : ''}`}
            onClick={() => setOpen(true)}
            aria-label="Open chat — ask about Jaimes"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={reduce ? {} : { opacity: 1, scale: 1 }}
            exit={reduce ? {} : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: EASE }}
            whileHover={reduce ? {} : { scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            title="Ask about Jaimes"
          >
            <span className="cb-launcher__label">Ask about me</span>
            <BotFace w={58} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-panel"
            role="dialog"
            aria-label="Chat with Jaimes's assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <header className="cb-head">
              <span className="cb-head__face">
                <BotFace w={36} />
              </span>
              <span className="cb-head__meta">
                <span className="cb-head__title">Ask about Jaimes</span>
                <span className="cb-head__sub">AI assistant · usually instant</span>
              </span>
              <button
                type="button"
                className="cb-head__close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </header>

            <div className="cb-scroll" ref={scrollRef}>
              <Message role="assistant" content={GREETING} />
              {messages.map((m, i) => (
                <Message key={i} role={m.role} content={m.content} goto={m.goto} onGoto={handleGoto} />
              ))}

              {messages.length === 0 && (
                <div className="cb-chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" className="cb-chip" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="cb-msg cb-msg--bot">
                  <span className="cb-msg__avatar">
                    <BotFace w={28} />
                  </span>
                  <div className="cb-msg__bubble cb-msg__bubble--typing" aria-label="Thinking">
                    <span className="cb-dot" />
                    <span className="cb-dot" />
                    <span className="cb-dot" />
                  </div>
                </div>
              )}
            </div>

            <form className="cb-input" onSubmit={onSubmit}>
              <textarea
                ref={inputRef}
                rows={1}
                className="cb-input__field"
                placeholder="Ask me anything about Jaimes…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={loading}
                aria-label="Type your question"
              />
              <button
                type="submit"
                className="cb-input__send"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
                </svg>
              </button>
            </form>

            <p className="cb-foot">Ask about Jaimes &amp; this portfolio · powered by AI</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
