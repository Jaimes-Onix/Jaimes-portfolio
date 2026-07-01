import { useEffect, useRef, useState, memo } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useScroll,
  useMotionValue,
  useSpring,
  useAnimationControls,
  animate,
} from 'framer-motion'
import STACK_SVG from './stack-icons.json'
import ChatBot from './ChatBot.jsx'

const RESUME = '/resume.pdf'
const RESUME_FILENAME = 'Jaimes-Cabante-Resume.pdf'
const EASE = [0.22, 1, 0.36, 1]

/* ---------- Data ---------- */
const NAV = [
  { name: 'About', href: '#about' },
  { name: 'Work', href: '#work' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
]

const SKYLINE_URL = 'https://skyline-aerial.vercel.app/'

const PROJECTS = [
  {
    num: '01',
    title: 'Skyline Aerial',
    category: 'Product Site · Design System',
    year: '2026',
    tagline: 'Straight from the field',
    desc: 'AI-powered consumer drone: a product site plus a matching pitch deck, both built on one shared design system.',
    tags: ['Design System', 'Claude Code', 'Vercel'],
    highlights: [
      'Product site + matching pitch deck on one shared design system',
      'Cinematic gallery of real flight shots',
      'Built end to end with Claude Code, deployed to Vercel',
    ],
    href: SKYLINE_URL,
    img: 'w-skyline',
    alt: 'Skyline Aerial product site hero',
  },
  {
    num: '02',
    title: 'Smart Watch Pro',
    category: 'Product Page · Motion',
    year: '2025',
    tagline: 'Video-led product page',
    desc: 'Flagship product page led by a video hero for the Pro-series smartwatch, with spec callouts and pricing.',
    tags: ['React', 'Video/Motion', 'Frontend'],
    highlights: [
      'Full-bleed video hero',
      'Spec callouts, badges, and pricing',
      'Shipped to a live route',
    ],
    href: 'https://tester-website-beige.vercel.app/product.html',
    img: 'w-product',
    alt: 'Smart Watch Pro product page',
  },
  {
    num: '03',
    title: 'Tech',
    category: 'Smart-Gadgets Showcase',
    year: '2025',
    tagline: 'AI-generated imagery',
    desc: 'A smart-gadgets brand page for watches, glasses, and audio, with AI-generated product imagery.',
    tags: ['Frontend', 'AIGC', 'React'],
    highlights: [
      'Product line: watches, glasses, audio',
      'AI-generated product shots (Nano Banana / kie.ai)',
      'Responsive showcase grid',
    ],
    href: 'https://tester-website-beige.vercel.app/TesterTech.html',
    img: 'w-testertech',
    alt: 'Tech smart-gadgets showcase',
  },
  {
    num: '04',
    title: 'PawPrint Tees',
    category: 'Brand Landing · E-commerce',
    year: '2025',
    tagline: 'Photo → portrait tee',
    desc: 'Apparel brand landing: upload a pet photo and get a hand-drawn portrait tee, delivered in 48 hours.',
    tags: ['React', 'Brand', 'Frontend'],
    highlights: [
      'Photo → hand-drawn portrait flow',
      'Conversion-focused landing with social proof',
      'Bold, warm brand system',
    ],
    href: 'https://pawprint-tees.vercel.app/',
    img: 'w-pawprints',
    alt: 'PawPrint Tees apparel landing page',
  },
]

const SKILLS = [
  { num: '01', cat: 'Frontend', items: ['React + Vite', 'UI build', 'Design systems', 'Tailwind CSS', 'Framer Motion'] },
  { num: '02', cat: 'Backend & Data', items: ['Spring Boot', 'REST APIs', 'Supabase', 'Firebase'] },
  { num: '03', cat: 'Automation & AI', items: ['n8n workflows', 'LLM integration', 'RAG', 'Claude Code', 'Prompt engineering'] },
]

const EXPERIENCE = [
  {
    company: 'Lifewood Data Technology',
    dates: 'May 2025 – Jun 2026',
    role: 'AI Executive & Project Coordinator',
    desc: 'Built and deployed full-stack AI websites end to end with Claude Code and Vercel. Cut manual work through LLM automation, RAG and n8n, and produced AI-generated media.',
  },
  {
    company: 'Lifewood Data Technology',
    dates: 'Jan 2025 – Mar 2025',
    role: 'IT Intern',
    desc: 'Built web and game apps applying the SDLC — debugging, testing, and version control on live projects.',
  },
]

const CERTS = [
  { title: 'Agents & AI at the Frontier!', issuer: 'AI Cebu Community · 2026', img: 'cert-aicebu' },
  { title: 'University Tech Talk', issuer: 'Flexisource IT · 2024', img: 'cert-flexisource' },
]

const STATS = [
  { to: 5, suffix: '', label: 'Builds shipped' },
  { to: 1, suffix: '+', label: 'Years experience' },
  { to: 12, suffix: '+', label: 'Technologies' },
  { to: 100, suffix: '%', label: 'Shipped to live' },
]

/* Monochrome inline tech icons (currentColor) */
const ic = { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': true }
const TECH = [
  { label: 'React', svg: (
    <svg {...ic} fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
  ) },
  { label: 'TypeScript', svg: (
    <svg {...ic} fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="currentColor">TS</text>
    </svg>
  ) },
  { label: 'Tailwind', svg: (
    <svg {...ic} fill="currentColor">
      <path d="M12 6c-2.7 0-4.3 1.3-5 4 .9-1.3 2-1.8 3.3-1.5.74.18 1.27.72 1.86 1.31C13.1 10.8 14.2 12 16.5 12c2.7 0 4.3-1.3 5-4-.9 1.3-2 1.8-3.3 1.5-.74-.18-1.27-.72-1.86-1.31C15.4 7.2 14.3 6 12 6Zm-5 6c-2.7 0-4.3 1.3-5 4 .9-1.3 2-1.8 3.3-1.5.74.18 1.27.72 1.86 1.31C8.1 16.8 9.2 18 11.5 18c2.7 0 4.3-1.3 5-4-.9 1.3-2 1.8-3.3 1.5-.74-.18-1.27-.72-1.86-1.31C10.4 13.2 9.3 12 7 12Z" />
    </svg>
  ) },
  { label: 'Supabase', svg: (
    <svg {...ic} fill="currentColor">
      <path d="M13.2 2.3c.5.6.2 1.5-.5 1.5H5.4c-1 0-1.5 1.1-.9 1.9l8.6 10.6c.6.7 1.8.3 1.8-.7V9.7c0-.5.4-.9.9-.9h6.8c1 0 1.5-1.1.9-1.9L13.2 2.3Z" opacity="0.55" />
      <path d="M10.8 21.7c-.5-.6-.2-1.5.5-1.5h7.3c1 0 1.5-1.1.9-1.9L10.9 7.7c-.6-.7-1.8-.3-1.8.7v5.9c0 .5-.4.9-.9.9H1.4c-1 0-1.5 1.1-.9 1.9l10.3 4.6Z" />
    </svg>
  ) },
  { label: 'Spring Boot', svg: (
    <svg {...ic} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M6 15c2 2.5 7 3 10-1 1.6-2.1 1.3-4.7-.3-6.4" />
      <path d="M15.5 7.6 16 5m0 0 2.4.4M16 5l.4 2.4" fill="none" />
    </svg>
  ) },
  { label: 'Claude Code', svg: (
    <svg {...ic} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  ) },
  { label: 'Vercel', svg: (
    <svg {...ic} fill="currentColor"><path d="M12 3 22 20H2L12 3Z" /></svg>
  ) },
  { label: 'Framer Motion', svg: (
    <svg {...ic} fill="currentColor"><path d="M5 3h14v7h-7zM5 10h7l7 7H5zM5 17h7v4z" /></svg>
  ) },
]

/* WebP with JPG fallback */
function Shot({ name, alt }) {
  return (
    <picture>
      <source srcSet={`/images/${name}.webp`} type="image/webp" />
      <img src={`/images/${name}.jpg`} alt={alt} loading="lazy" />
    </picture>
  )
}

/* Cinematic reveal — re-plays every time it enters the viewport (scrolling up or down) */
const CINE_EASE = [0.16, 1, 0.3, 1]
function Reveal({ children, delay = 0, y = 40, className, style }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <div className={className} style={style}>{children}</div>
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, scale: 0.97, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.0, ease: CINE_EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Magnetic CTA — pointer-following spring; plain link under reduced motion */
function Magnetic({ className, href, children, onOpen }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16 })
  const sy = useSpring(y, { stiffness: 220, damping: 16 })

  const linkProps = {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
    download: RESUME_FILENAME,
    onClick: onOpen ? (e) => { e.preventDefault(); onOpen() } : undefined,
  }
  if (reduce) {
    return <a className={className} {...linkProps}>{children}</a>
  }
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => { x.set(0); y.set(0) }
  return (
    <motion.a
      ref={ref}
      className={className}
      {...linkProps}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  )
}

function ResumeLink({ className = 'btn btn--ghost', children, onOpen }) {
  return (
    <a
      className={className}
      href={RESUME}
      target="_blank"
      rel="noopener noreferrer"
      download={RESUME_FILENAME}
      onClick={onOpen ? (e) => { e.preventDefault(); onOpen() } : undefined}
    >
      {children || <>Download Résumé <span aria-hidden="true">↓</span></>}
    </a>
  )
}

/* ---------- Top bar ---------- */
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)
function TopBar({ active, theme, onToggleTheme }) {
  return (
    <header className="topbar" id="topbar">
      <div className="wrap">
        <div className="topbar__inner">
          <a className="brand" href="#top" aria-label="Jaimes Cabante, back to top">
            <span className="brand__dot" />
            Jaimes Cabante
          </a>
          <nav className="navlinks" aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.name} href={item.href} className={active === item.href.slice(1) ? 'is-active' : ''}>
                {item.name}
              </a>
            ))}
          </nav>
          <div className="topbar__right">
            <button
              type="button"
              className="themebtn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title="Toggle light / dark mode"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              <span className="themebtn__label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ---------- Hero — Portfolio text-mask over portrait (cinematic) ---------- */
const CINE = [0.16, 1, 0.3, 1]

/* Typewriter that loops through roles */
const HERO_ROLES = ['Automation', 'Front-End Developer', 'Back-End Developer']
function Typewriter({ start = true }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [text, setText] = useState(reduce ? HERO_ROLES[0] : '')
  const [del, setDel] = useState(false)
  useEffect(() => {
    if (reduce || !start) return
    const full = HERO_ROLES[i]
    let delay = del ? 45 : 95
    if (!del && text === full) delay = 1500
    else if (del && text === '') delay = 350
    const t = setTimeout(() => {
      if (!del && text === full) { setDel(true); return }
      if (del && text === '') { setDel(false); setI((v) => (v + 1) % HERO_ROLES.length); return }
      setText(full.slice(0, del ? text.length - 1 : text.length + 1))
    }, delay)
    return () => clearTimeout(t)
  }, [text, del, i, reduce, start])
  return (
    <span className="typewriter">
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  )
}

/* OpenAI / ChatGPT logomark (white) */
const OPENAI_SVG = '<svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-3.99 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.26 22a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07Zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.78.78 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5ZM3.6 18.06a4.47 4.47 0 0 1-.54-3.01l.14.08 4.78 2.76a.78.78 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.14-1.64ZM2.34 7.9a4.48 4.48 0 0 1 2.34-1.97V11.6a.78.78 0 0 0 .39.68l5.84 3.37-2.02 1.17a.07.07 0 0 1-.07 0l-4.83-2.8A4.5 4.5 0 0 1 2.34 7.9Zm16.6 3.86-5.84-3.38L15.12 7.2a.07.07 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.12v-5.67a.78.78 0 0 0-.39-.68Zm2.01-3.02-.14-.09-4.78-2.76a.78.78 0 0 0-.78 0L9.4 9.26V6.93a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66ZM8.3 12.86 6.28 11.7a.07.07 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08L8.7 5.46a.78.78 0 0 0-.39.68l-.01 6.72Zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5v-3Z"/></svg>'

/* icon resolver for the hero chips — svg key, image path, or text monogram */
const floatIcon = (name) => {
  if (name === 'chatgpt') return OPENAI_SVG
  if (name === 'higgsfield') return '<img src="/images/higgsfield.webp" alt="" />'
  if (name === 'ghl') return '<img src="/images/gohighlevel.svg" alt="" />'
  return STACK_SVG[name]
}

/* Draggable, floating tech chip — springs back ~3s after release */
const FLOAT_TECH = [
  // left strip (clear of the typewriter at top and your name at the bottom)
  ['chatgpt', '22%', '7%', '0.5s'],
  ['typescript', '33%', '6%', '0s'],
  ['supabase', '45%', '4%', '0.7s'],
  ['n8n', '57%', '8%', '1.4s'],
  ['github', '69%', '5%', '2.0s'],
  ['ghl', '80%', '7%', '1.1s'],
  // right strip (clear of the arrow at top and the tag at the bottom)
  ['higgsfield', '16%', '85%', '0.9s'],
  ['react', '26%', '90%', '0.3s'],
  ['firebase', '36%', '83%', '0.6s'],
  ['tailwindcss', '47%', '92%', '1.0s'],
  ['claude', '58%', '86%', '1.7s'],
  ['framer', '70%', '83%', '1.2s'],
  ['vercel', '80%', '92%', '2.3s'],
]
function FloatChip({ icon, top, left, delay, inDelay, start = true }) {
  const reduce = useReducedMotion()
  const controls = useAnimationControls()
  const timer = useRef()
  useEffect(() => {
    if (reduce) controls.set({ opacity: 1, scale: 1 })
    else if (start) controls.start({ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 16, delay: inDelay } })
    return () => clearTimeout(timer.current)
  }, [start])
  return (
    <span className="floatpos" style={{ top, left }}>
      <span className="floatbob" style={{ animationDelay: delay }}>
        <motion.div
          className="floatchip"
          initial={{ opacity: 0, scale: 0 }}
          drag={!reduce}
          dragMomentum={false}
          whileDrag={{ scale: 1.12 }}
          animate={controls}
          onDragStart={() => clearTimeout(timer.current)}
          onDragEnd={() => {
            timer.current = setTimeout(() => {
              controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 130, damping: 14 } })
            }, 3000)
          }}
        >
          <span className="floatchip__ic" dangerouslySetInnerHTML={{ __html: icon }} />
        </motion.div>
      </span>
    </span>
  )
}

function Hero({ theme, start = true }) {
  const light = theme === 'light'
  const reduce = useReducedMotion()
  // entrance waits 3s AFTER the intro preloader splits open, then plays
  const [play, setPlay] = useState(false)
  useEffect(() => {
    if (!start) { setPlay(false); return }
    const t = setTimeout(() => setPlay(true), 1000)
    return () => clearTimeout(t)
  }, [start])
  const fade = (d = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
          transition: { duration: 0.8, ease: CINE, delay: d },
        }
  const letter = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: '45%', filter: 'blur(14px)' },
          animate: play
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: '45%', filter: 'blur(14px)' },
          transition: { duration: 0.9, ease: CINE, delay: 0.4 + i * 0.07 },
        }
  return (
    <section id="top" className="hero hero--mask">
      <div className="hmask">
        <motion.figure
          className={light ? 'hmask__photo hmask__photo--cut' : 'hmask__photo'}
          initial={reduce ? false : { opacity: 0, scale: 1.16 }}
          animate={reduce ? false : play ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.16 }}
          transition={{ duration: 1.9, ease: CINE }}
        >
          <img src={light ? '/images/hero-cutout.png' : '/images/hero-portrait.png'} alt="Jaimes Edward Cabante" />
        </motion.figure>

        <h1 className="hmask__word" aria-label="Portfolio">
          <motion.span aria-hidden="true" {...letter(0)}>P</motion.span><motion.span aria-hidden="true" {...letter(1)}>O</motion.span><motion.span aria-hidden="true" {...letter(2)}>R</motion.span>
          <motion.span aria-hidden="true" className="is-out" {...letter(3)}>T</motion.span><motion.span aria-hidden="true" className="is-out" {...letter(4)}>F</motion.span>
          <motion.span aria-hidden="true" {...letter(5)}>O</motion.span><motion.span aria-hidden="true" {...letter(6)}>L</motion.span><motion.span aria-hidden="true" {...letter(7)}>I</motion.span><motion.span aria-hidden="true" {...letter(8)}>O</motion.span>
        </h1>

        <motion.span className="hmask__corner hmask__role" {...fade(1.0)} aria-label="Automation, Front End Developer, Back End Developer">
          <Typewriter start={play} />
        </motion.span>
        <motion.a
          className="hmask__corner hmask__arrow"
          href="#work"
          aria-label="View my work"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? false : play ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: CINE, delay: 1.15 }}
        >⟶</motion.a>
        <motion.span className="hmask__corner hmask__name" {...fade(1.1)}>Jaimes Edward Cabante</motion.span>
        <motion.span className="hmask__corner hmask__tag" {...fade(1.2)}>Portfolio 2026</motion.span>

        {FLOAT_TECH.map(([name, top, left, delay], i) => (
          <FloatChip key={name} icon={floatIcon(name)} top={top} left={left} delay={delay} inDelay={1.4 + i * 0.08} start={play} />
        ))}
      </div>
    </section>
  )
}

/* ---------- Stat figures (count-up on view) ---------- */
function Stat({ to, suffix, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce || !inView) { setVal(to); return }
    const controls = animate(0, to, { duration: 1.1, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, to])
  return (
    <div className="fig" ref={ref}>
      <span className="fig__n">{val}<span className="suffix">{suffix}</span></span>
      <span className="fig__l">{label}</span>
    </div>
  )
}

function Stats() {
  return (
    <section className="wrap" style={{ marginTop: 'clamp(6px, 1vw, 14px)' }}>
      <Reveal>
        <div className="figs">
          {STATS.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- Work (bento, asymmetric) ---------- */
function Work({ onSelect }) {
  const reduce = useReducedMotion()
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const update = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const nudge = (dir) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.wcard')
    const amount = card ? card.offsetWidth + 22 : el.clientWidth * 0.85
    el.scrollBy({ left: dir * amount, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="work" className="section">
      <div className="wrap">
        <Reveal>
          <div className="work-head">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="h2 sec-head__title">Websites I&apos;ve built.</h2>
            </div>
            <div className="work-nav" role="group" aria-label="Carousel controls">
              <button type="button" className="work-arrow" onClick={() => nudge(-1)} disabled={!canPrev} aria-label="Previous projects">←</button>
              <button type="button" className="work-arrow" onClick={() => nudge(1)} disabled={!canNext} aria-label="Next projects">→</button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="wcarousel" ref={trackRef} onScroll={update}>
        {PROJECTS.map((p, i) => (
          <motion.button
            type="button"
            className="wcard"
            key={p.num}
            onClick={() => onSelect(p)}
            initial={reduce ? false : { opacity: 0, y: 34, filter: 'blur(10px)' }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.8, ease: CINE_EASE, delay: i * 0.1 }}
          >
            <div className="wcard__media">
              <Shot name={p.img} alt={p.alt} />
            </div>
            <span className="wcard__cat">{p.category}</span>
            <h3 className="wcard__title">{p.title}</h3>
            <p className="wcard__desc">{p.desc}</p>
            <span className="wcard__cta">View Project <span className="arrow" aria-hidden="true">→</span></span>
          </motion.button>
        ))}
      </div>

    </section>
  )
}

/* ---------- About ---------- */
function AboutIcon({ name }) {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'bolt') return <svg {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
  if (name === 'code') return <svg {...p}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
  if (name === 'rocket') return <svg {...p}><path d="M5 14c-2 1-2 5-2 5s4 0 5-2M12 15l-3-3a14 14 0 0 1 7-9c2 0 3 1 3 3a14 14 0 0 1-9 7M9 12l-3 .5M12 15l-.5 3" /></svg>
  if (name === 'server') return <svg {...p}><rect x="3" y="4" width="18" height="7" rx="1.6" /><rect x="3" y="13" width="18" height="7" rx="1.6" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>
  if (name === 'spark') return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>
  if (name === 'layout') return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></svg>
  return <svg {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
}

function About({ onResume }) {
  return (
    <section id="about" className="section about2">
      <div className="wrap">
        <div className="about2__grid">
          {/* LEFT — text */}
          <Reveal className="about2__left">
            <span className="eyebrow">About me</span>
            <h2 className="about2__title">
              I build websites and <span className="accent">automate manual business processes.</span>
            </h2>
            <p className="about2__lede">
              I&apos;m Jaimes Edward Cabante, an <span className="about2__hl">Automation &amp; Website
              Developer</span>. I build fast, modern websites and automate the busywork behind them,
              so the work runs itself.
            </p>

            <hr className="about2__rule" />

            <div className="about2__point">
              <span className="about2__ic"><AboutIcon name="bolt" /></span>
              <div>
                <h3>Productive Solutions</h3>
                <p>I focus on building solutions that save time, reduce manual work, and drive results.</p>
              </div>
            </div>
            <div className="about2__point">
              <span className="about2__ic"><AboutIcon name="code" /></span>
              <div>
                <h3>Clean Code. Smart Automation.</h3>
                <p>I write clean, maintainable code and connect tools that work seamlessly in the background.</p>
              </div>
            </div>

            <div className="about2__card">
              <span className="about2__avatar"><AboutIcon name="live" /><i className="about2__online" /></span>
              <div>
                <h3>Always learning. Always building.</h3>
                <p>Exploring new technologies to build better solutions and create impact.</p>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — image + stats + CTAs */}
          <Reveal className="about2__right" delay={0.08}>
            <div className="about2__photo">
              <img src="/images/about-workspace.png" alt="Jaimes at a dual-monitor desk building websites and wiring up automation flows" loading="lazy" />
              <span className="about2__badge" aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <defs><path id="aboutBadgePath" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
                  <text><textPath href="#aboutBadgePath" startOffset="0">AUTOMATE · BUILD · REPEAT · AUTOMATE · BUILD · REPEAT · </textPath></text>
                </svg>
                <span className="about2__badge-ic"><AboutIcon name="code" /></span>
              </span>
            </div>

            <div className="about2__cta">
              <ResumeLink className="btn btn--primary" onOpen={onResume} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Skills (capabilities, not tools) ---------- */
const SKILLS2 = [
  { icon: 'layout', title: 'Web development', desc: 'Responsive, accessible sites in React, built on reusable design systems with tasteful motion.' },
  { icon: 'server', title: 'Backend & APIs', desc: 'REST APIs, authentication, and databases with Spring Boot, Supabase, and Firebase.' },
  { icon: 'bolt', title: 'Automation', desc: 'n8n workflows and LLM and RAG pipelines that quietly remove manual busywork.' },
  { icon: 'spark', title: 'AI-generated media', desc: 'Images, video, and voice produced with AIGC tools and wired into real products.' },
  { icon: 'rocket', title: 'Ship to production', desc: 'From the first prototype to a live URL on Vercel, owned end to end.' },
  { icon: 'code', title: 'Clean, maintainable code', desc: 'Readable components, sensible structure, and version control on every project.' },
]

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Skills</span>
              <h2 className="h2 sec-head__title">What I can do for you.</h2>
            </div>
            <p className="lead">The capabilities I bring, from the first pixel to the automation that keeps it running.</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="capgrid">
            {SKILLS2.map((s) => (
              <div className="capcard" key={s.title}>
                <span className="capcard__ic"><AboutIcon name={s.icon} /></span>
                <h3 className="capcard__title">{s.title}</h3>
                <p className="capcard__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Tech stack (icon grid) — official logos via tech-stack-icons ---------- */
/* white-only logos: invert them in light mode so they don't vanish on the white card */
const MONO_LOGOS = new Set(['github', 'vercel', 'elevenlabsai'])
/* extra brand logos not in stack-icons.json */
const HTML5_SVG = '<svg viewBox="0 0 24 24"><path d="M4 2l1.6 18.4L12 22l6.4-1.6L20 2z" fill="#E44D26"/><path d="M12 3.5v16.9l5.1-1.3L18.5 3.5z" fill="#F16529"/><text x="12" y="15.6" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="9" fill="#fff">5</text></svg>'
const CSS3_SVG = '<svg viewBox="0 0 24 24"><path d="M4 2l1.6 18.4L12 22l6.4-1.6L20 2z" fill="#1572B6"/><path d="M12 3.5v16.9l5.1-1.3L18.5 3.5z" fill="#33A9DC"/><text x="12" y="15.6" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="9" fill="#fff">3</text></svg>'
const PYTHON_SVG = '<svg viewBox="0 0 24 24"><path fill="#3776AB" d="M11.9 0c-1 0-2 .1-2.8.3C6.7.7 6.3 1.6 6.3 3.2v2.1h5.7v.7H4.2c-1.6 0-3 1-3.5 2.8-.5 2-.5 3.3 0 5.4.4 1.6 1.4 2.8 3 2.8h2V12.5c0-1.8 1.6-3.4 3.4-3.4h5.7c1.5 0 2.8-1.3 2.8-2.9V3.2c0-1.5-1.3-2.7-2.8-3C13.9.1 12.9 0 11.9 0zM8.8 1.8c.6 0 1 .5 1 1.1s-.4 1-1 1-1-.4-1-1 .4-1.1 1-1.1z"/><path fill="#FFD43B" d="M18.6 6v2.3c0 1.9-1.6 3.5-3.4 3.5H9.5c-1.5 0-2.8 1.3-2.8 2.9v5.4c0 1.5 1.3 2.4 2.8 2.9 1.8.5 3.5.6 5.7 0 1.4-.4 2.8-1.2 2.8-2.9v-2.1h-5.7v-.7h8.5c1.6 0 2.2-1.1 2.8-2.8.6-1.8.5-3.5 0-5.4-.4-1.6-1.2-2.8-2.8-2.8h-2.2zM15.2 19.8c.6 0 1 .4 1 1s-.4 1.1-1 1.1-1-.5-1-1.1.4-1 1-1z"/></svg>'
const JAVA_SVG = '<svg viewBox="0 0 24 24"><path fill="#0074BD" d="M8.9 18.2s-.9.6.7.7c1.9.2 2.9.2 5-.2 0 0 .6.4 1.4.7-4.8 2-10.8-.1-7.1-1.2zM8.3 15.6s-1 .8.6.9c2.1.2 3.7.2 6.5-.3 0 0 .4.4 1 .6-5.8 1.7-12.3.1-8.1-1.2z"/><path fill="#EA2D2E" d="M13.1 11.1c1.2 1.3-.3 2.5-.3 2.5s2.9-1.5 1.6-3.4c-1.2-1.8-2.2-2.6 2.9-5.6 0 0-8.1 2-4.2 6.5z"/><path fill="#0074BD" d="M18.5 19.9s.7.6-.8 1c-2.7.8-11.4 1.1-13.8 0-.9-.4.8-.9 1.3-1 .6-.1.9-.1.9-.1-1-.7-6.3 1.4-2.7 2 9.7 1.6 17.7-.7 15.1-1.9zM9.4 12.9s-4.4 1-1.6 1.4c1.2.2 3.6.1 5.8-.1 1.8-.1 3.6-.5 3.6-.5s-.6.3-1.1.6c-4.5 1.2-13.1.6-10.6-.6 2.1-1 3.9-.8 3.9-.8zM16.9 17.1c4.5-2.4 2.4-4.6 1-4.3-.4.1-.5.2-.5.2s.1-.2.4-.3c2.7-1 4.9 2.8-1 4.6 0 0 .1-.1.1-.2z"/><path fill="#EA2D2E" d="M14.4 0s2.5 2.5-2.4 6.3c-3.9 3.1-.9 4.9 0 6.9-2.3-2.1-4-3.9-2.9-5.6C10.8 5.1 15.4 3.9 14.4 0z"/><path fill="#0074BD" d="M9.9 23.9c4.3.3 10.9-.2 11.1-2.2 0 0-.3.8-3.6 1.4-3.7.7-8.3.6-11 .2 0 0 .6.5 3.5.6z"/></svg>'
const STACK_ICONS = { ...STACK_SVG, html5: HTML5_SVG, css3: CSS3_SVG, python: PYTHON_SVG, java: JAVA_SVG }
const STACK = [
  { cat: 'Frontend', items: [['React', 'react'], ['HTML5', 'html5'], ['CSS3', 'css3'], ['Tailwind', 'tailwindcss'], ['Framer Motion', 'framer']] },
  { cat: 'Backend & Data', items: [['Spring Boot', 'spring'], ['Supabase', 'supabase'], ['Firebase', 'firebase']] },
  { cat: 'Automation & AI', items: [['n8n', 'n8n'], ['Make', '/images/make.png'], ['GoHighLevel', '/images/gohighlevel.svg'], ['Claude Code', 'claude']] },
  { cat: 'Languages', items: [['TypeScript', 'typescript'], ['JavaScript', 'js'], ['Java', 'java'], ['Python', 'python']] },
  { cat: 'Deployment & Hosting', items: [['Vercel', 'vercel'], ['GoDaddy', '/images/GoDaddy-Logo.png'], ['Git / GitHub', 'github']] },
  {
    cat: 'AIGC (AI Generated Content)',
    wide: true,
    items: [
      ['ElevenLabs', 'elevenlabsai'],
      ['DaVinci Resolve', '/images/davinci.png'],
      ['Higgsfield', '/images/higgsfield.webp'],
      ['CapCut', '/images/capcut.webp'],
      ['Google Flow', null, 'GF'],
    ],
  },
]
function TechStack() {
  return (
    <section id="stack" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Tech stack</span>
              <h2 className="h2 sec-head__title">Technologies I work with.</h2>
            </div>
            <p className="lead">My toolkit across front end, backend and data, automation and AI, and AI-generated content.</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="stackgrid">
            {STACK.map((g) => (
              <div className="stackcard" key={g.cat}>
                <div className="stackcard__h">{g.cat}</div>
                <div className="stackitems">
                  {g.items.map(([label, name, mono]) => (
                    <div className="stackitem" key={label}>
                      {name && name.startsWith('/') ? (
                        <span className="stackitem__ic stackitem__imgwrap"><img src={name} alt="" /></span>
                      ) : name ? (
                        <span className={MONO_LOGOS.has(name) ? 'stackitem__ic stackitem__ic--invert' : 'stackitem__ic'} dangerouslySetInnerHTML={{ __html: STACK_ICONS[name] }} />
                      ) : (
                        <span className="stackitem__ic stackitem__mono">{mono}</span>
                      )}
                      <span className="stackitem__label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div className="stacknote">
            <span className="stacknote__ic" aria-hidden="true">&lt;/&gt;</span>
            <div>
              <strong>Always learning, always building.</strong>
              <span>Exploring new tools to ship better, faster.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Experience + Education ---------- */
/* ---------- Experience (timeline) ---------- */
function Experience() {
  return (
    <section id="experience" className="section exp--center">
      <div className="wrap">
        <Reveal>
          <div className="sec-head sec-head--center">
            <span className="eyebrow">Experience</span>
            <h2 className="h2 sec-head__title">Where I&apos;ve worked.</h2>
          </div>
        </Reveal>
        <Reveal>
          <ol className="timeline timeline--center">
            {EXPERIENCE.map((e, i) => (
              <li className="tl" key={i}>
                <span className="tl__dot" aria-hidden="true" />
                <div className="tl__card">
                  <span className="tl__dates">{e.dates}</span>
                  <h3 className="tl__role">{e.role}</h3>
                  <div className="tl__company">{e.company}</div>
                  <p className="tl__desc">{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Education + certificates (card grid + lightbox) ---------- */
function Education() {
  const reduce = useReducedMotion()
  const [cert, setCert] = useState(null)
  useEffect(() => {
    if (!cert) return
    const onKey = (e) => e.key === 'Escape' && setCert(null)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cert])
  return (
    <section id="education" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Education</span>
              <h2 className="h2 sec-head__title">Where I learned.</h2>
            </div>
            <p className="lead">The degree behind the work, plus a few things I&apos;ve picked up since.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="degree">
            <img className="degree__logo" src="/images/citu-logo.png" alt="Cebu Institute of Technology – University logo" />
            <div className="degree__text">
              <span className="degree__k">Degree</span>
              <h3 className="degree__title">BS in Information Technology (BSIT)</h3>
              <p className="degree__sub">Cebu Institute of Technology – University · 2020–2024</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="eyebrow eyebrow--muted certlabel">Certificates</p>
          <div className="certgrid">
            {CERTS.map((c) => (
              <button className="cert" key={c.title} type="button" onClick={() => setCert(c)}>
                <div className="cert__media">
                  <img src={`/images/${c.img}.jpg`} alt={c.title} loading="lazy" />
                </div>
                <div>
                  <span className="cert__title">{c.title}</span>
                  <span className="cert__issuer">{c.issuer}</span>
                </div>
                <span className="cert__go" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {cert && (
          <motion.div
            className="lightbox"
            onClick={() => setCert(null)}
            role="dialog"
            aria-modal="true"
            aria-label={cert.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="lightbox__close" onClick={() => setCert(null)} aria-label="Close">✕</button>
            <motion.img
              className="lightbox__img"
              src={`/images/${cert.img}.jpg`}
              alt={cert.title}
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.26, ease: EASE }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ---------- Project modal (AnimatePresence) ---------- */
function Modal({ project, onClose }) {
  const reduce = useReducedMotion()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="modal__panel"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal__media"><Shot name={project.img} alt={project.alt} /></div>
        <div className="modal__body">
          <span className="eyebrow eyebrow--muted">{project.category}</span>
          <h3 className="modal__title">{project.title}</h3>
          <p className="modal__desc">{project.desc}</p>
          <span className="modal__sub">Highlights</span>
          <ul className="modal__list">
            {project.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
          <span className="modal__sub">Tech stack</span>
          <div className="tags">
            {project.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
          {project.href && (
            <div className="modal__actions">
              <a className="btn btn--primary" href={project.href} target="_blank" rel="noopener noreferrer">
                View live <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Résumé modal (full preview + side download) ---------- */
function ResumeModal({ onClose }) {
  const reduce = useReducedMotion()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="rmodal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Résumé preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="rmodal__panel"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        <button className="rmodal__close" onClick={onClose} aria-label="Close résumé">✕</button>

        <div className="rmodal__doc">
          <iframe
            className="rmodal__frame"
            src={`${RESUME}#view=FitH&toolbar=0&navpanes=0`}
            title="Jaimes Edward Cabante — Résumé"
          />
        </div>

        <aside className="rmodal__side">
          <span className="eyebrow eyebrow--muted">Résumé</span>
          <h3 className="rmodal__title">Jaimes Edward Cabante</h3>
          <p className="rmodal__sub">Automation &amp; Website Developer · Cebu, PH</p>
          <div className="rmodal__actions">
            <a className="btn btn--primary" href={RESUME} download={RESUME_FILENAME}>
              Download PDF <span aria-hidden="true">↓</span>
            </a>
            <a className="btn btn--ghost" href={RESUME} target="_blank" rel="noopener noreferrer">
              Open in new tab <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="rmodal__hint">
            Preview not showing? <a href={RESUME} target="_blank" rel="noopener noreferrer">Open the PDF ↗</a>
          </p>
        </aside>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Intro preloader (hourglass) ---------- */
const LOADER_SVG = `
<svg aria-label="Loading" role="img" height="56px" width="56px" viewBox="0 0 56 56" class="loader">
  <clipPath id="sand-mound-top">
    <path d="M 14.613 13.087 C 15.814 12.059 19.3 8.039 20.3 6.539 C 21.5 4.789 21.5 2.039 21.5 2.039 L 3 2.039 C 3 2.039 3 4.789 4.2 6.539 C 5.2 8.039 8.686 12.059 9.887 13.087 C 11 14.039 12.25 14.039 12.25 14.039 C 12.25 14.039 13.5 14.039 14.613 13.087 Z" class="loader__sand-mound-top"></path>
  </clipPath>
  <clipPath id="sand-mound-bottom">
    <path d="M 14.613 20.452 C 15.814 21.48 19.3 25.5 20.3 27 C 21.5 28.75 21.5 31.5 21.5 31.5 L 3 31.5 C 3 31.5 3 28.75 4.2 27 C 5.2 25.5 8.686 21.48 9.887 20.452 C 11 19.5 12.25 19.5 12.25 19.5 C 12.25 19.5 13.5 19.5 14.613 20.452 Z" class="loader__sand-mound-bottom"></path>
  </clipPath>
  <g transform="translate(2,2)">
    <g transform="rotate(-90,26,26)" stroke-linecap="round" stroke-dashoffset="153.94" stroke-dasharray="153.94 153.94" stroke="hsl(0,0%,100%)" fill="none">
      <circle transform="rotate(0,26,26)" r="24.5" cy="26" cx="26" stroke-width="2.5" class="loader__motion-thick"></circle>
      <circle transform="rotate(90,26,26)" r="24.5" cy="26" cx="26" stroke-width="1.75" class="loader__motion-medium"></circle>
      <circle transform="rotate(180,26,26)" r="24.5" cy="26" cx="26" stroke-width="1" class="loader__motion-thin"></circle>
    </g>
    <g transform="translate(13.75,9.25)" class="loader__model">
      <path d="M 1.5 2 L 23 2 C 23 2 22.5 8.5 19 12 C 16 15.5 13.5 13.5 13.5 16.75 C 13.5 20 16 18 19 21.5 C 22.5 25 23 31.5 23 31.5 L 1.5 31.5 C 1.5 31.5 2 25 5.5 21.5 C 8.5 18 11 20 11 16.75 C 11 13.5 8.5 15.5 5.5 12 C 2 8.5 1.5 2 1.5 2 Z" fill="hsl(var(--hue),90%,85%)"></path>
      <g stroke-linecap="round" stroke="hsl(35,90%,90%)">
        <line y2="20.75" x2="12" y1="15.75" x1="12" stroke-dasharray="0.25 33.75" stroke-width="1" class="loader__sand-grain-left"></line>
        <line y2="21.75" x2="12.5" y1="16.75" x1="12.5" stroke-dasharray="0.25 33.75" stroke-width="1" class="loader__sand-grain-right"></line>
        <line y2="31.5" x2="12.25" y1="18" x1="12.25" stroke-dasharray="0.5 107.5" stroke-width="1" class="loader__sand-drop"></line>
        <line y2="31.5" x2="12.25" y1="14.75" x1="12.25" stroke-dasharray="54 54" stroke-width="1.5" class="loader__sand-fill"></line>
        <line y2="31.5" x2="12" y1="16" x1="12" stroke-dasharray="1 107" stroke-width="1" stroke="hsl(35,90%,83%)" class="loader__sand-line-left"></line>
        <line y2="31.5" x2="12.5" y1="16" x1="12.5" stroke-dasharray="12 96" stroke-width="1" stroke="hsl(35,90%,83%)" class="loader__sand-line-right"></line>
        <g stroke-width="0" fill="hsl(35,90%,90%)">
          <path d="M 12.25 15 L 15.392 13.486 C 21.737 11.168 22.5 2 22.5 2 L 2 2.013 C 2 2.013 2.753 11.046 9.009 13.438 L 12.25 15 Z" clip-path="url(#sand-mound-top)"></path>
          <path d="M 12.25 18.5 L 15.392 20.014 C 21.737 22.332 22.5 31.5 22.5 31.5 L 2 31.487 C 2 31.487 2.753 22.454 9.009 20.062 Z" clip-path="url(#sand-mound-bottom)"></path>
        </g>
      </g>
      <g stroke-width="2" stroke-linecap="round" opacity="0.7" fill="none">
        <path d="M 19.437 3.421 C 19.437 3.421 19.671 6.454 17.914 8.846 C 16.157 11.238 14.5 11.5 14.5 11.5" stroke="hsl(0,0%,100%)" class="loader__glare-top"></path>
        <path transform="rotate(180,12.25,16.75)" d="M 19.437 3.421 C 19.437 3.421 19.671 6.454 17.914 8.846 C 16.157 11.238 14.5 11.5 14.5 11.5" stroke="hsla(0,0%,100%,0)" class="loader__glare-bottom"></path>
      </g>
      <rect height="2" width="24.5" fill="hsl(var(--hue),90%,50%)"></rect>
      <rect height="1" width="19.5" y="0.5" x="2.5" ry="0.5" rx="0.5" fill="hsl(var(--hue),90%,57.5%)"></rect>
      <rect height="2" width="24.5" y="31.5" fill="hsl(var(--hue),90%,50%)"></rect>
      <rect height="1" width="19.5" y="32" x="2.5" ry="0.5" rx="0.5" fill="hsl(var(--hue),90%,57.5%)"></rect>
    </g>
  </g>
</svg>`

/* memoized so the 60fps % counter can't re-inject the SVG and reset its CSS animation */
const HourglassLoader = memo(function HourglassLoader() {
  return <span className="preloader__loader" dangerouslySetInnerHTML={{ __html: LOADER_SVG }} />
})

function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState('load') // load → crack → open

  // count 0 → 100 over ~2.8s, then begin the crack
  useEffect(() => {
    const DUR = 2800
    let raf
    let startT = null
    const tick = (t) => {
      if (startT === null) startT = t
      const p = Math.min(1, (t - startT) / DUR)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setPhase('crack')
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // hold the crack flash briefly, then split the panes open
  useEffect(() => {
    if (phase !== 'crack') return
    const t = setTimeout(() => setPhase('open'), 480)
    return () => clearTimeout(t)
  }, [phase])

  const paneEase = [0.76, 0, 0.24, 1]
  const open = phase === 'open'
  const cracking = phase === 'crack' || phase === 'open'

  return (
    <div className="preloader">
      {/* the two dark halves that split apart to reveal the site (glowing inner edges so the split is visible over the dark page) */}
      <motion.div
        className={`preloader__pane preloader__pane--l${cracking ? ' is-edge' : ''}`}
        initial={{ x: 0 }}
        animate={{ x: open ? '-101%' : 0 }}
        transition={{ duration: 1.1, ease: paneEase }}
      />
      <motion.div
        className={`preloader__pane preloader__pane--r${cracking ? ' is-edge' : ''}`}
        initial={{ x: 0 }}
        animate={{ x: open ? '101%' : 0 }}
        transition={{ duration: 1.1, ease: paneEase }}
        onAnimationComplete={() => open && onDone && onDone()}
      />

      {/* the bright crack down the center */}
      <motion.span
        className="preloader__crack"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{
          scaleY: cracking ? 1 : 0,
          opacity: open ? 0 : cracking ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />

      {/* centered content — animates in, then fades as the crack forms */}
      <motion.div
        className="preloader__content"
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
        animate={
          cracking
            ? { opacity: 0, scale: 1.06, filter: 'blur(8px)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.6, ease: CINE_EASE }}
      >
        <HourglassLoader />
        <h1 className="preloader__name">Jaimes Edward Cabante</h1>
        <p className="preloader__role">Automation &amp; Website Developer</p>
        <div className="preloader__bar"><span style={{ width: `${pct}%` }} /></div>
        <span className="preloader__pct">{pct}%</span>
      </motion.div>
    </div>
  )
}

/* ---------- App ---------- */
export default function App() {
  const [selected, setSelected] = useState(null)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [active, setActive] = useState('work')
  const [theme, setTheme] = useState(
    () => (typeof document !== 'undefined' && document.documentElement.dataset.theme) || 'dark',
  )
  const toggleTheme = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try { localStorage.setItem('theme', next) } catch {}
      return next
    })
  const { scrollYProgress } = useScroll()

  // Intro preloader — first open of the session only (not on refresh), skipped for reduced motion
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
      return !sessionStorage.getItem('introSeen')
    } catch { return false }
  })
  useEffect(() => {
    if (!intro) return
    try { sessionStorage.setItem('introSeen', '1') } catch {}
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    const fallback = setTimeout(() => setIntro(false), 6500) // safety if onDone never fires
    return () => { clearTimeout(fallback); document.body.style.overflow = '' }
  }, [intro])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  useEffect(() => {
    const topbar = document.getElementById('topbar')
    const onScroll = () => {
      const y = window.scrollY || 0
      if (topbar) topbar.classList.toggle('is-stuck', y > 12)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const ids = ['work', 'about', 'skills', 'experience']
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    let spy
    if ('IntersectionObserver' in window && sections.length) {
      spy = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
        { threshold: 0, rootMargin: '-45% 0px -50% 0px' },
      )
      sections.forEach((s) => spy.observe(s))
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (spy) spy.disconnect()
    }
  }, [])

  return (
    <>
      <AnimatePresence>{intro && <Preloader key="preloader" onDone={() => setIntro(false)} />}</AnimatePresence>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <TopBar active={active} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero theme={theme} start={!intro} />
        <About onResume={() => setResumeOpen(true)} />
        <Work onSelect={setSelected} />
        <Skills />
        <TechStack />
        <Experience />
        <Education />
      </main>

      <AnimatePresence>
        {selected && <Modal key="modal" project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {resumeOpen && <ResumeModal key="resume" onClose={() => setResumeOpen(false)} />}
      </AnimatePresence>

      {/* Chat assistant — fixed overlay; kept before the footer so the Arca
          attribution stays the final element in the document. */}
      <ChatBot />

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="wrap">
          <Reveal>
            <div className="footer__cta">
              <span className="eyebrow">Open to work</span>
              <h2>Let&apos;s build<br />something <span className="accent">real.</span></h2>
              <p>
                I build modern websites and automate the busywork behind them, from the first
                prototype to the live URL. Here&apos;s the full record.
              </p>
              <Magnetic className="btn btn--primary" href={RESUME} onOpen={() => setResumeOpen(true)}>Download Résumé <span aria-hidden="true">↓</span></Magnetic>
            </div>
          </Reveal>

          <div className="footer__cols">
            <div className="footer__brand">
              <div className="footer__name">Jaimes Edward Cabante</div>
              <p className="footer__tagline">
                Automation &amp; Website Developer based in Cebu, PH. I build modern websites
                and automate the work behind them.
              </p>
            </div>
            <nav className="footer__nav" aria-label="Menu">
              <span className="footer__nav-label">Menu</span>
              <a href="#top">Home</a>
              <a href="#work">Work</a>
              <a href="#about">About</a>
            </nav>
            <nav className="footer__nav" aria-label="More">
              <span className="footer__nav-label">More</span>
              <a href="#skills">Skills</a>
              <a href="#experience">Experience</a>
              <a href={RESUME} onClick={(e) => { e.preventDefault(); setResumeOpen(true) }} target="_blank" rel="noopener noreferrer" download={RESUME_FILENAME}>Résumé</a>
            </nav>
          </div>

          <div className="footer__legal">
            <span>© 2026 Jaimes Edward Cabante</span>
            <span>Automation &amp; Website Developer · Cebu, PH</span>
          </div>

          {/* Arca attribution — REQUIRED, final element on the page, links to arca.ph */}
          <a className="footer__arca" href="https://arca.ph" target="_blank" rel="noopener noreferrer" aria-label="Made for Arca.ph">
            <img src="/images/arca-logo.png" alt="Arca" />
            <span>Made for Arca.ph</span>
          </a>
        </div>
      </footer>
    </>
  )
}
