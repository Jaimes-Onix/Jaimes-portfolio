import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useScroll,
  useMotionValue,
  useSpring,
  animate,
} from 'framer-motion'

const RESUME = '/resume.pdf'
const RESUME_FILENAME = 'Jaimes-Cabante-Resume.pdf'
const EASE = [0.22, 1, 0.36, 1]

/* ---------- Data ---------- */
const NAV = [
  { name: 'Work', href: '#work' },
  { name: 'About', href: '#about' },
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
    desc: 'AI-powered consumer drone — a product site plus a matching pitch deck, both built on one shared design system.',
    tags: ['Design System', 'Claude Code', 'Vercel'],
    highlights: [
      'Product site + matching pitch deck on one shared design system',
      'Cinematic gallery of real flight shots',
      'Built end to end with Claude Code, deployed to Vercel',
    ],
    href: SKYLINE_URL,
    img: 'w-skyline',
    alt: 'Skyline Aerial — “Straight from the field” gallery',
  },
  {
    num: '02',
    title: 'Tester Smart Watch Pro',
    category: 'Product Page · Motion',
    year: '2025',
    tagline: 'Video-led product page',
    desc: 'Flagship product page led by a video hero — the Pro-series smartwatch, with spec callouts and pricing.',
    tags: ['React', 'Video/Motion', 'Frontend'],
    highlights: [
      'Full-bleed video hero',
      'Spec callouts, badges, and pricing',
      'Shipped to a live route',
    ],
    href: 'https://tester-website-beige.vercel.app/product.html',
    img: 'w-product',
    alt: 'Tester Smart Watch Pro product page',
  },
  {
    num: '03',
    title: 'Tester Tech',
    category: 'Smart-Gadgets Showcase',
    year: '2025',
    tagline: 'AI-generated imagery',
    desc: 'A smart-gadgets brand page — watches, glasses, and audio — with AI-generated product imagery.',
    tags: ['Frontend', 'AIGC', 'React'],
    highlights: [
      'Product line: watches, glasses, audio',
      'AI-generated product shots (Nano Banana / kie.ai)',
      'Responsive showcase grid',
    ],
    href: 'https://tester-website-beige.vercel.app/TesterTech.html',
    img: 'w-testertech',
    alt: 'Tester Tech smart-gadgets showcase',
  },
  {
    num: '04',
    title: 'PawPrint Tees',
    category: 'Brand Landing · E-commerce',
    year: '2025',
    tagline: 'Photo → portrait tee',
    desc: 'Apparel brand landing — upload a pet photo and get a hand-drawn portrait tee, delivered in 48 hours.',
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

/* whileInView reveal — fades up once, respects reduced motion */
function Reveal({ children, delay = 0, y = 26, className, style }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Magnetic CTA — pointer-following spring; plain link under reduced motion */
function Magnetic({ className, href, children }) {
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

function ResumeLink({ className = 'btn btn--ghost', children }) {
  return (
    <a className={className} href={RESUME} target="_blank" rel="noopener noreferrer" download={RESUME_FILENAME}>
      {children || <>Download Résumé <span aria-hidden="true">↓</span></>}
    </a>
  )
}

/* ---------- Top bar ---------- */
function TopBar({ active }) {
  return (
    <header className="topbar" id="topbar">
      <div className="wrap topbar__inner">
        <a className="brand" href="#top" aria-label="Jaimes Cabante — top">
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
          <ResumeLink className="btn btn--ink">Résumé <span aria-hidden="true">↓</span></ResumeLink>
        </div>
      </div>
    </header>
  )
}

/* ---------- Hero (Framer Motion staggered entrance) ---------- */
const heroContainer = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }
const lineV = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.78, ease: EASE } } }
const fadeV = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }

function Hero() {
  const reduce = useReducedMotion()
  const container = reduce ? {} : { variants: heroContainer, initial: 'hidden', animate: 'show' }
  const line = reduce ? {} : { variants: lineV }
  const fade = reduce ? {} : { variants: fadeV }
  return (
    <section id="top" className="hero">
      <div className="wrap">
        <motion.div {...container}>
          <motion.p {...fade} className="hero__kicker">
            <span className="hero__avail"><span className="dot" /> Available for work</span>
            <span className="sep" /> Automation &amp; Website Developer
            <span className="sep" /> Cebu, Philippines
            <span className="sep" /> Portfolio 2026
          </motion.p>
          <h1 className="hero__title">
            <span className="line"><motion.span {...line} style={{ display: 'block' }}>I build</motion.span></span>
            <span className="line"><motion.span {...line} style={{ display: 'block' }}>websites &amp;</motion.span></span>
            <span className="line"><motion.span {...line} style={{ display: 'block' }}><span className="accent">automation</span></motion.span></span>
            <span className="line"><motion.span {...line} style={{ display: 'block' }}>that ship.</motion.span></span>
          </h1>
          <motion.div {...fade} className="hero__foot">
            <p className="hero__sub">
              From the first prototype to the live URL — I build fast, modern websites and
              automate the repetitive work behind them, with Claude Code at the center.
            </p>
            <div className="hero__cta">
              <Magnetic className="btn btn--primary" href="#work">View my work <span aria-hidden="true">→</span></Magnetic>
              <ResumeLink />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ===== Hero variant 2 — Bento grid (Apple-style modular cards) ===== */
const bentoC = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }
const bentoItem = { hidden: { opacity: 0, y: 18, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } } }
function HeroBento() {
  const reduce = useReducedMotion()
  const c = reduce ? {} : { variants: bentoC, initial: 'hidden', animate: 'show' }
  const it = reduce ? {} : { variants: bentoItem }
  const hov = reduce ? {} : { whileHover: { y: -4 } }
  return (
    <section id="top" className="hero hero--bento">
      <div className="wrap">
        <motion.div className="herob" {...c}>
          <motion.div className="bcard bh-head" {...it} {...hov}>
            <span className="eyebrow">Automation &amp; Website Developer</span>
            <h1 className="herob__title">Websites that ship.<br />Automations that <span className="accent">save hours.</span></h1>
            <div className="hero__cta">
              <Magnetic className="btn btn--primary" href="#work">View my work <span aria-hidden="true">→</span></Magnetic>
              <ResumeLink />
            </div>
          </motion.div>
          <motion.div className="bcard bh-photo" {...it} {...hov}>
            <picture><source srcSet="/assets/profile.webp" type="image/webp" /><img src="/assets/profile.jpg" alt="Jaimes Edward Cabante" /></picture>
          </motion.div>
          <motion.div className="bcard bh-status" {...it} {...hov}>
            <span className="bcard__k">Status</span>
            <span className="bcard__big"><span className="dot" /> Available</span>
            <span className="bcard__sub">Cebu, Philippines</span>
          </motion.div>
          <motion.div className="bcard bh-stat" {...it} {...hov}>
            <span className="bcard__k">Shipped</span>
            <span className="bcard__num">5</span>
            <span className="bcard__sub">live builds</span>
          </motion.div>
          <motion.div className="bcard bh-tech" {...it} {...hov}>
            <span className="bcard__k">Stack</span>
            <span className="bcard__tech">React · n8n · Claude Code · Supabase · Vercel</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ===== Hero variant 3 — Glassmorphism (light) ===== */
function HeroGlass() {
  const reduce = useReducedMotion()
  return (
    <section id="top" className="hero hero--glass">
      <div className="herog__bg" aria-hidden="true">
        <span className="blob blob--1" /><span className="blob blob--2" /><span className="blob blob--3" />
      </div>
      <div className="wrap herog__inner">
        <motion.div
          className="herog__panel"
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={reduce ? false : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="eyebrow">Automation &amp; Website Developer · Cebu, PH</span>
          <h1 className="herog__title">Design. Build. <span className="accent">Automate.</span></h1>
          <p className="herog__sub">
            Modern websites and the automations behind them — built end to end with Claude Code,
            shipped to a live URL.
          </p>
          <div className="hero__cta">
            <Magnetic className="btn btn--primary" href="#work">View my work <span aria-hidden="true">→</span></Magnetic>
            <ResumeLink />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ===== Hero variant 4 — Editorial / Magazine ===== */
function HeroEditorial() {
  const reduce = useReducedMotion()
  const fade = (d = 0) => (reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay: d } })
  return (
    <section id="top" className="hero hero--edit">
      <div className="wrap heroe">
        <div className="heroe__main">
          <motion.span className="eyebrow" {...fade(0)}>Portfolio — Issue 2026</motion.span>
          <motion.h1 className="heroe__title" {...fade(0.06)}>Full-stack websites,<br /><span className="accent">end-to-end automation.</span></motion.h1>
          <motion.p className="heroe__deck" {...fade(0.12)}>
            I build modern, fast websites and wire up the automations that run behind them — from
            the first prototype to the live URL, with Claude Code at the center of the work.
          </motion.p>
          <motion.div className="hero__cta" {...fade(0.18)}>
            <Magnetic className="btn btn--primary" href="#work">View my work <span aria-hidden="true">→</span></Magnetic>
            <ResumeLink />
          </motion.div>
        </div>
        <motion.figure
          className="heroe__fig"
          initial={reduce ? false : { opacity: 0, scale: 1.08 }}
          animate={reduce ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <picture><source srcSet="/assets/profile.webp" type="image/webp" /><img src="/assets/profile.jpg" alt="Jaimes Edward Cabante" /></picture>
          <figcaption>Jaimes Edward Cabante — Cebu, PH</figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

/* ===== Hero variant 5 — Kinetic (rotating word) ===== */
const ROT = ['websites', 'automations', 'dashboards', 'workflows']
function HeroKinetic() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % ROT.length), 2200)
    return () => clearInterval(id)
  }, [reduce])
  return (
    <section id="top" className="hero hero--kinetic">
      <div className="wrap herok">
        <motion.span
          className="eyebrow herok__eye"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Automation &amp; Website Developer · Cebu, PH
        </motion.span>
        <h1 className="herok__title">
          I build{' '}
          <span className="herok__rot">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={ROT[i]}
                className="accent"
                initial={reduce ? false : { y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {ROT[i]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />that ship.
        </h1>
        <p className="herok__sub">
          Modern sites and the automations behind them — from the first prototype to the live URL.
        </p>
        <div className="hero__cta herok__cta">
          <Magnetic className="btn btn--primary" href="#work">View my work <span aria-hidden="true">→</span></Magnetic>
          <ResumeLink />
        </div>
      </div>
    </section>
  )
}

/* ===== Hero switcher — cycle the 5 styles ===== */
const HERO_VARIANTS = [
  { name: 'Swiss', C: Hero },
  { name: 'Bento', C: HeroBento },
  { name: 'Glass', C: HeroGlass },
  { name: 'Editorial', C: HeroEditorial },
  { name: 'Kinetic', C: HeroKinetic },
]
function HeroSwitcher() {
  const [i, setI] = useState(0)
  const Current = HERO_VARIANTS[i].C
  const go = (d) => setI((v) => (v + d + HERO_VARIANTS.length) % HERO_VARIANTS.length)
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <Current />
        </motion.div>
      </AnimatePresence>
      <div className="heroswitch" role="group" aria-label="Hero style switcher">
        <button className="heroswitch__btn" onClick={() => go(-1)} aria-label="Previous hero style">←</button>
        <span className="heroswitch__label">
          Hero · {HERO_VARIANTS[i].name}
          <span className="heroswitch__count">{i + 1}/{HERO_VARIANTS.length}</span>
        </span>
        <button className="heroswitch__btn" onClick={() => go(1)} aria-label="Next hero style">→</button>
      </div>
    </>
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
  return (
    <section id="work" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="h2 sec-head__title">Four builds,<br />shipped live.</h2>
            </div>
            <p className="lead">Each one taken end to end — designed, built, and deployed to a live URL.</p>
          </div>
        </Reveal>

        <div className="pgrid">
          {PROJECTS.map((p, i) => (
            <motion.button
              type="button"
              className="pcard"
              key={p.num}
              onClick={() => onSelect(p)}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.08 }}
              whileHover={reduce ? undefined : { y: -6 }}
              whileTap={reduce ? undefined : { scale: 0.99 }}
            >
              <div className="pcard__media">
                <Shot name={p.img} alt={p.alt} />
                <span className="pcard__tagline">{p.tagline}</span>
              </div>
              <div className="pcard__body">
                <div className="pcard__meta">
                  <span className="pcard__num">{p.num}</span>
                  <span>{p.category}</span>
                </div>
                <h3 className="pcard__title">{p.title}</h3>
                <p className="pcard__desc">{p.desc}</p>
                <span className="pcard__cta">View details <span aria-hidden="true">↗</span></span>
              </div>
            </motion.button>
          ))}
        </div>

        <Reveal>
          <div className="reel">
            <video autoPlay muted loop playsInline poster="/images/w-skyline.jpg">
              <source src="/videos/reel.webm" type="video/webm" />
              <source src="/videos/reel.mp4" type="video/mp4" />
            </video>
            <img className="reel__poster" src="/images/w-skyline.jpg" alt="Reel of selected projects" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- About ---------- */
function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">About</span>
              <h2 className="h2 sec-head__title">I own the<br />whole arc.</h2>
            </div>
          </div>
        </Reveal>

        <div className="about">
          <Reveal className="about__photo">
            <picture>
              <source srcSet="/assets/profile.webp" type="image/webp" />
              <img src="/assets/profile.jpg" alt="Jaimes Edward Cabante" width="820" height="1024" />
            </picture>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="about__body">
              <p className="about__big">
                I&apos;m Jaimes Edward Cabante — I build modern websites and automate the busywork
                behind them, with <b>Claude Code</b> at the center of the work.
              </p>
              <p style={{ color: 'var(--muted)' }}>
                I take sites end to end — React front ends, Spring Boot and REST APIs, and
                Supabase and Firebase for data — then wire in automation with n8n, LLMs, and RAG,
                plus AI-generated media, so the work runs itself.
              </p>
              <p style={{ color: 'var(--muted)' }}>
                I like owning the whole arc: the first prototype, the design system, the late call
                to cut a feature, the moment it goes live. Next, I&apos;m looking for a team that wants
                someone who can build the website and automate everything around it.
              </p>
              <div className="about__cta"><ResumeLink className="btn btn--ghost" /></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Skills ---------- */
function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Skills</span>
              <h2 className="h2 sec-head__title">Websites, backend &amp; automation.</h2>
            </div>
            <p className="lead">Fast, modern front ends, a solid backend, and the automation that ties it together.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="skillgrid">
            {SKILLS.map((s) => (
              <div className="skillcol" key={s.cat}>
                <span className="skillcol__no">{s.num}</span>
                <h3 className="skillcol__cat">{s.cat}</h3>
                <ul className="skillcol__items">
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...TECH, ...TECH, ...TECH].map((t, i) => (
              <span className="marquee__item" key={i}>{t.svg}{t.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Experience + Education ---------- */
function Credentials() {
  return (
    <section id="experience" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Experience &amp; Education</span>
              <h2 className="h2 sec-head__title">The path so far.</h2>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="cred">
            <div>
              <h3 className="cred__h">Experience</h3>
              {EXPERIENCE.map((e, i) => (
                <div className="exp" key={i}>
                  <div className="exp__dates">{e.dates}</div>
                  <h4 className="exp__role">{e.role}</h4>
                  <div className="exp__company">{e.company}</div>
                  <p className="exp__desc">{e.desc}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="cred__h">Education</h3>
              <div className="edu">
                <h4 className="edu__title">BS in Information Technology (BSIT)</h4>
                <p className="edu__sub">Cebu Institute of Technology – University · 2020–2025</p>
              </div>
              <p className="eyebrow eyebrow--muted certlabel">Certificates</p>
              <div className="certs">
                {CERTS.map((c) => (
                  <a className="cert" key={c.title} href={`/images/${c.img}.jpg`} target="_blank" rel="noopener noreferrer">
                    <div className="cert__media">
                      <img src={`/images/${c.img}.jpg`} alt={c.title} loading="lazy" />
                    </div>
                    <div>
                      <span className="cert__title">{c.title}</span>
                      <span className="cert__issuer">{c.issuer}</span>
                    </div>
                    <span className="cert__go" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
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

/* ---------- App ---------- */
export default function App() {
  const [selected, setSelected] = useState(null)
  const [active, setActive] = useState('work')
  const { scrollYProgress } = useScroll()

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
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <TopBar active={active} />
      <main>
        <HeroSwitcher />
        <Stats />
        <Work onSelect={setSelected} />
        <About />
        <Skills />
        <Credentials />
      </main>

      <AnimatePresence>
        {selected && <Modal key="modal" project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="wrap">
          <Reveal>
            <div className="footer__cta">
              <span className="eyebrow">Open to work</span>
              <h2>Let&apos;s build<br />something <span className="accent">real.</span></h2>
              <p>
                I build modern websites and automate the busywork behind them — from the first
                prototype to the live URL. Here&apos;s the full record.
              </p>
              <Magnetic className="btn btn--primary" href={RESUME}>Download Résumé <span aria-hidden="true">↓</span></Magnetic>
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
              <a href={RESUME} target="_blank" rel="noopener noreferrer" download={RESUME_FILENAME}>Résumé</a>
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
