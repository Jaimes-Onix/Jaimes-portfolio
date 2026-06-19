import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Briefcase, Sparkles, Building2, FileDown } from 'lucide-react'
import { CardCarousel } from './CardCarousel.jsx'

/* Solutions carousel — real dev-workspace photos */
const SOLUTION_IMAGES = [
  { src: '/images/sol-code.jpg', alt: 'Writing code' },
  { src: '/images/sol-build.jpg', alt: 'Building the UI' },
  { src: '/images/sol-data.jpg', alt: 'Backend & data' },
  { src: '/images/sol-flow.jpg', alt: 'Automation flow' },
]

const RESUME = '/resume.pdf'
const RESUME_FILENAME = 'Jaimes-Cabante-Resume.pdf'

/* ---------- Tubelight navbar (adapted: <a>, monochrome, framer-motion lamp) ---------- */
const NAV_ITEMS = [
  { name: 'Home', url: '#top', icon: Home },
  { name: 'Work', url: '#work', icon: Briefcase },
  { name: 'Skills', url: '#skills', icon: Sparkles },
  { name: 'Experience', url: '#experience', icon: Building2 },
  { name: 'Résumé', url: RESUME, icon: FileDown, external: true },
]
function TubelightNav() {
  const [active, setActive] = useState('Home')

  // auto-move the lamp to the section currently in view
  useEffect(() => {
    const map = {}
    NAV_ITEMS.forEach((it) => {
      if (!it.external && it.url.startsWith('#')) map[it.url.slice(1)] = it.name
    })
    const sections = Object.keys(map)
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!('IntersectionObserver' in window) || !sections.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && map[e.target.id]) setActive(map[e.target.id])
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="tnav">
      <div className="tnav__bar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.name
          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => !item.external && setActive(item.name)}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer', download: RESUME_FILENAME }
                : {})}
              className={`tnav__item${isActive ? ' is-active' : ''}`}
            >
              <span className="tnav__label">{item.name}</span>
              <span className="tnav__icon">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="tnav__lamp"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="tnav__lamp-bar">
                    <div className="tnav__lamp-glow tnav__lamp-glow--1" />
                    <div className="tnav__lamp-glow tnav__lamp-glow--2" />
                    <div className="tnav__lamp-glow tnav__lamp-glow--3" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

const BRAND_URL = 'https://tester-website-beige.vercel.app/'
const SKYLINE_URL = 'https://skyline-aerial.vercel.app/'

const PROJECTS = [
  {
    num: '01',
    title: 'Skyline Aerial',
    category: 'Product Site · Design System',
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

/* WebP with JPG fallback. */
function Shot({ name, alt }) {
  return (
    <picture>
      <source srcSet={`/images/${name}.webp`} type="image/webp" />
      <img src={`/images/${name}.jpg`} alt={alt} loading="lazy" />
    </picture>
  )
}

/* Monochrome inline tech icons (currentColor) */
const ic = { viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': true }
const TECH = [
  {
    label: 'React',
    svg: (
      <svg {...ic} fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    label: 'TypeScript',
    svg: (
      <svg {...ic} fill="none">
        <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="1.3" />
        <text x="12" y="16" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="currentColor">TS</text>
      </svg>
    ),
  },
  {
    label: 'Tailwind',
    svg: (
      <svg {...ic} fill="currentColor">
        <path d="M12 6c-2.7 0-4.3 1.3-5 4 .9-1.3 2-1.8 3.3-1.5.74.18 1.27.72 1.86 1.31C13.1 10.8 14.2 12 16.5 12c2.7 0 4.3-1.3 5-4-.9 1.3-2 1.8-3.3 1.5-.74-.18-1.27-.72-1.86-1.31C15.4 7.2 14.3 6 12 6Zm-5 6c-2.7 0-4.3 1.3-5 4 .9-1.3 2-1.8 3.3-1.5.74.18 1.27.72 1.86 1.31C8.1 16.8 9.2 18 11.5 18c2.7 0 4.3-1.3 5-4-.9 1.3-2 1.8-3.3 1.5-.74-.18-1.27-.72-1.86-1.31C10.4 13.2 9.3 12 7 12Z" />
      </svg>
    ),
  },
  {
    label: 'Supabase',
    svg: (
      <svg {...ic} fill="currentColor">
        <path d="M13.2 2.3c.5.6.2 1.5-.5 1.5H5.4c-1 0-1.5 1.1-.9 1.9l8.6 10.6c.6.7 1.8.3 1.8-.7V9.7c0-.5.4-.9.9-.9h6.8c1 0 1.5-1.1.9-1.9L13.2 2.3Z" opacity="0.55" />
        <path d="M10.8 21.7c-.5-.6-.2-1.5.5-1.5h7.3c1 0 1.5-1.1.9-1.9L10.9 7.7c-.6-.7-1.8-.3-1.8.7v5.9c0 .5-.4.9-.9.9H1.4c-1 0-1.5 1.1-.9 1.9l10.3 4.6Z" />
      </svg>
    ),
  },
  {
    label: 'Spring Boot',
    svg: (
      <svg {...ic} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M6 15c2 2.5 7 3 10-1 1.6-2.1 1.3-4.7-.3-6.4" />
        <path d="M15.5 7.6 16 5m0 0 2.4.4M16 5l.4 2.4" fill="none" />
      </svg>
    ),
  },
  {
    label: 'Claude',
    svg: (
      <svg {...ic} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
      </svg>
    ),
  },
]

const SKILLS = [
  { cat: 'Frontend', items: 'React · UI build · Vite · Tailwind' },
  {
    cat: 'Backend & Data',
    items: 'Spring Boot · REST APIs · Supabase & Firebase for database management',
  },
  {
    cat: 'AI & Automation',
    items: 'Claude Code · LLM integration · RAG · n8n · prompt engineering',
  },
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

/* "View live ↗" link, or a muted label when the tile has no public URL. */
function ViewLive({ href, label }) {
  if (href) {
    return (
      <a
        className="card__live"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        View live <span aria-hidden="true">↗</span>
      </a>
    )
  }
  return (
    <span className="card__live card__live--muted">{label || 'Private build'}</span>
  )
}

/* ---------- Hero building blocks (no face; background slot) ---------- */
function HeroBadge() {
  return (
    <span className="hero__badge">
      <span className="status__dot" /> Available for Work
    </span>
  )
}
function HeroCtas() {
  return (
    <div className="hero__cta">
      <a className="btn-primary" href="#work">
        View My Work <span aria-hidden="true">→</span>
      </a>
      <a
        className="btn-ghost"
        href={RESUME}
        target="_blank"
        rel="noopener noreferrer"
        download={RESUME_FILENAME}
      >
        Download Résumé <span aria-hidden="true">↓</span>
      </a>
    </div>
  )
}
function HeroMarquee() {
  return (
    <div className="hero__marquee marquee" aria-hidden="true">
      <div className="marquee__track">
        {[...TECH, ...TECH, ...TECH].map((t, i) => (
          <span className="marquee__item" key={i}>
            {t.svg}
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}
function HeroStats() {
  return (
    <div className="hero__stats">
      {[
        ['5', 'Builds shipped'],
        ['1+', 'Years experience'],
        ['12+', 'Technologies'],
        ['100%', 'Shipped to live'],
      ].map(([n, l]) => (
        <div className="stat" key={l}>
          <span className="stat__n">{n}</span>
          <span className="stat__l">{l}</span>
        </div>
      ))}
    </div>
  )
}
/* background slot — replace the placeholder with your image via
   .herov__bg { background-image: url('/images/hero-bg.jpg') } */
function HeroBg({ full }) {
  return <div className={`herov__bg${full ? ' herov__bg--full' : ''}`} aria-hidden="true" />
}

/* 1 — Centered statement */
function HeroCentered() {
  return (
    <section id="top" className="hero hero--centered">
      <HeroBg />
      <div className="hero__c">
        <HeroBadge />
        <p className="hero__role-sm">Full-Stack AI Developer · Cebu, PH</p>
        <h1 className="hero__big hero__big--center">
          I design &amp; ship
          <br />
          AI-powered websites.
        </h1>
        <HeroCtas />
      </div>
      <HeroMarquee />
    </section>
  )
}

/* 2 — Split: text + visual panel (background goes in the panel) */
function HeroSplit() {
  return (
    <section id="top" className="hero hero--split">
      <HeroBg />
      <div className="hero__split-inner">
        <div className="hero__split-l">
          <HeroBadge />
          <h1 className="hero__big">
            Building <span className="grad">AI products</span> that ship.
          </h1>
          <p className="hero__lead">
            Full-stack AI developer — React front ends, REST APIs, and
            automation, deployed live with Claude Code at the center.
          </p>
          <HeroCtas />
          <HeroStats />
        </div>
        <div className="hero__split-r">
          <div className="hero__visual">
            <span>Background / visual</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 3 — Full-bleed background + overlaid name */
function HeroFullbleed() {
  return (
    <section id="top" className="hero hero--bleed">
      <HeroBg full />
      <div className="hero__bleed">
        <HeroBadge />
        <h1 className="hero__giant2">Jaimes Cabante</h1>
        <p className="hero__role-sm">Full-Stack AI Developer · Cebu, PH</p>
        <HeroCtas />
      </div>
      <HeroMarquee />
    </section>
  )
}

/* 4 — Terminal / code window */
function HeroTerminal() {
  return (
    <section id="top" className="hero hero--terminal">
      <HeroBg />
      <div className="hero__term-inner">
        <div className="hero__term-l">
          <HeroBadge />
          <h1 className="hero__big">
            Building <span className="grad">AI products</span>
            <br />
            that actually ship.
          </h1>
          <HeroCtas />
        </div>
        <div className="hero__term-r">
          <div className="codewin" aria-hidden="true">
            <div className="codewin__bar">
              <span /><span /><span />
            </div>
            <pre className="codewin__code">
{`const developer = () => {
  const me = {
    role: "Full-Stack AI Dev",
    stack: ["React", "Spring Boot",
            "Supabase", "Claude"],
    focus: "LLM + automation",
    ships: true,
  };
  return build(me);
};`}
            </pre>
          </div>
        </div>
      </div>
      <HeroMarquee />
    </section>
  )
}

/* line of animated letters; offset continues the stagger across lines */
function NameLine({ word, offset = 0 }) {
  return (
    <span className="ln">
      {[...word].map((ch, i) => (
        <span className="ltr" style={{ '--i': i + offset }} key={i}>
          {ch}
        </span>
      ))}
    </span>
  )
}

/* 5 — Big-type name wall (letter animation) */
function HeroNamewall({ play = true }) {
  return (
    <section id="top" className="hero hero--wall">
      <HeroBg />
      <div className="hero__wall-top">
        <HeroBadge />
        <a
          className="btn btn--nav"
          href={RESUME}
          target="_blank"
          rel="noopener noreferrer"
          download={RESUME_FILENAME}
        >
          Download Résumé
        </a>
      </div>
      <h1 className={`hero__wall-name${play ? ' is-ready' : ''}`} aria-label="Jaimes Cabante">
        <NameLine word="JAIMES" />
        <NameLine word="CABANTE" offset={6} />
      </h1>
      <p className="hero__role-sm hero__wall-role">
        Full-Stack AI Developer · Cebu, PH
      </p>
      <HeroMarquee />
    </section>
  )
}

const HERO_DESIGNS = [
  { name: 'Centered', C: HeroCentered },
  { name: 'Split', C: HeroSplit },
  { name: 'Full-bleed', C: HeroFullbleed },
  { name: 'Terminal', C: HeroTerminal },
  { name: 'Name wall', C: HeroNamewall },
]

function HeroSwitcher() {
  const [i, setI] = useState(0)
  const Current = HERO_DESIGNS[i].C
  return (
    <>
      <button
        className="hero-switch"
        onClick={() => setI((i + 1) % HERO_DESIGNS.length)}
        aria-label="Change hero design"
      >
        <span className="hero-switch__dot" />
        Hero design — {HERO_DESIGNS[i].name}
        <span className="hero-switch__count">{i + 1}/{HERO_DESIGNS.length}</span>
        <span aria-hidden="true">↻</span>
      </button>
      <Current />
    </>
  )
}

/* ---------- Loading intro (first open) ---------- */
function Intro({ onDone }) {
  const [pct, setPct] = useState(0)
  const [exit, setExit] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduce ? 350 : 1500
    let raf, start
    const tick = (t) => {
      if (start == null) start = t
      const p = Math.min(100, Math.round(((t - start) / dur) * 100))
      setPct(p)
      if (p < 100) raf = requestAnimationFrame(tick)
      else {
        setTimeout(() => setExit(true), 220)
        setTimeout(onDone, 220 + 650)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className={`intro${exit ? ' intro--exit' : ''}`} aria-hidden="true">
      <div className="intro__inner">
        <span className="intro__mark">JEC</span>
        <div className="intro__bar"><i style={{ width: `${pct}%` }} /></div>
        <span className="intro__pct">{String(pct).padStart(3, '0')}</span>
      </div>
    </div>
  )
}

/* ---------- Isometric cube animation (Uiverse, monochromed) ---------- */
function CubeAnim() {
  return (
    <div className="cube-container" aria-hidden="true">
      {[0, 1, 2].map((c) => (
        <div className="cube" key={c}>
          {[-1, 0, 1].map((x) => (
            <div key={x} style={{ '--x': x, '--y': 0 }}>
              <span style={{ '--i': 3 }} />
              <span style={{ '--i': 2 }} />
              <span style={{ '--i': 1 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ---------- Experience + Education: 3 switchable designs + certificates ---------- */
const CRED_NAMES = ['Timeline', 'Split', 'Cards']
const CERTS = [
  { title: 'Agents & AI at the Frontier!', issuer: 'AI Cebu Community · 2026', img: 'cert-aicebu' },
  { title: 'University Tech Talk', issuer: 'Flexisource IT · 2024', img: 'cert-flexisource' },
]
function CertCards() {
  return (
    <div className="certs">
      {CERTS.map((c) => (
        <a className="cert" key={c.title} href={`/images/${c.img}.jpg`} target="_blank" rel="noopener noreferrer">
          <div className="cert__media">
            <img src={`/images/${c.img}.jpg`} alt={c.title} loading="lazy" />
          </div>
          <div className="cert__meta">
            <span className="cert__title">{c.title}</span>
            <span className="cert__issuer">{c.issuer}</span>
          </div>
        </a>
      ))}
    </div>
  )
}
function EduBlock() {
  return (
    <div className="cred-edu">
      <h3 className="edu__title">BS in Information Technology (BSIT)</h3>
      <p className="edu__sub">Cebu Institute of Technology – University · 2020–2025</p>
    </div>
  )
}
function CredentialsSection() {
  const [d, setD] = useState(0)
  return (
    <section id="experience" className="section">
      <div className="section__inner reveal">
        <div className="about-switch-row">
          <p className="eyebrow">Experience &amp; Education</p>
          <button className="about-switch" onClick={() => setD((d + 1) % 3)} aria-label="Change layout">
            <span className="hero-switch__dot" /> Design — {CRED_NAMES[d]}
            <span className="hero-switch__count">{d + 1}/3</span>
            <span aria-hidden="true">↻</span>
          </button>
        </div>

        {d === 0 && (
          <>
            <h2 className="h2 cred-h">Experience</h2>
            <div className="cred-timeline">
              {EXPERIENCE.map((e, i) => (
                <div className="cred-tl-item" key={i}>
                  <span className="cred-tl-dot" />
                  <div>
                    <div className="exp__company">{e.company} · {e.dates}</div>
                    <h3 className="exp__role">{e.role}</h3>
                    <p className="exp__desc">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h2 cred-h">Education</h2>
            <EduBlock />
            <p className="eyebrow cred-certlabel">Certificates</p>
            <CertCards />
          </>
        )}

        {d === 1 && (
          <div className="cred-split">
            <div>
              <h2 className="h2 cred-h cred-h--top0">Experience</h2>
              {EXPERIENCE.map((e, i) => (
                <div className="exp" key={i}>
                  <div>
                    <div className="exp__company">{e.company}</div>
                    <div className="exp__dates">{e.dates}</div>
                  </div>
                  <div className="exp__main">
                    <h3 className="exp__role">{e.role}</h3>
                    <p className="exp__desc">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="h2 cred-h cred-h--top0">Education</h2>
              <EduBlock />
              <p className="eyebrow cred-certlabel">Certificates</p>
              <CertCards />
            </div>
          </div>
        )}

        {d === 2 && (
          <>
            <h2 className="h2 cred-h cred-h--top0">Experience</h2>
            <div className="cred-cards">
              {EXPERIENCE.map((e, i) => (
                <div className="cred-card" key={i}>
                  <div className="exp__company">{e.company} · {e.dates}</div>
                  <h3 className="exp__role">{e.role}</h3>
                  <p className="exp__desc">{e.desc}</p>
                </div>
              ))}
            </div>
            <h2 className="h2 cred-h">Education &amp; Certificates</h2>
            <div className="cred-card cred-card--edu"><EduBlock /></div>
            <CertCards />
          </>
        )}
      </div>
    </section>
  )
}

/* ---------- About: 3 switchable designs (all with the headshot) ---------- */
const ABOUT_NAMES = ['Split', 'Framed', 'Editorial']
const ABOUT_LEAD =
  "I'm Jaimes Edward Cabante, a full-stack AI developer who builds, deploys, and automates with Claude Code at the center of the work."
const ABOUT_P1 =
  'I take products end to end — React front ends, Spring Boot and REST APIs, and Supabase and Firebase for database management — with LLM integration, automation, and AI-generated media woven in.'
const ABOUT_P2 =
  "I like owning the whole arc: the first prototype, the design system, the late call to cut a feature, the moment it goes live. Next, I'm looking for a team building real AI products that wants someone who can design, build, and deploy it."

function AboutPhoto({ className }) {
  return (
    <div className={`about-photo ${className}`}>
      <picture>
        <source srcSet="/assets/profile.webp" type="image/webp" />
        <img src="/assets/profile.jpg" alt="Jaimes Edward Cabante" width="820" height="1024" />
      </picture>
    </div>
  )
}

function AboutSection() {
  const [d, setD] = useState(0)
  return (
    <section id="about" className="section section--tinted">
      <div className="section__inner reveal">
        <div className="about-switch-row">
          <p className="eyebrow">About</p>
          <button className="about-switch" onClick={() => setD((d + 1) % 3)} aria-label="Change about design">
            <span className="hero-switch__dot" /> Design — {ABOUT_NAMES[d]}
            <span className="hero-switch__count">{d + 1}/3</span>
            <span aria-hidden="true">↻</span>
          </button>
        </div>

        {d === 0 && (
          <div className="about-d1">
            <AboutPhoto className="about-photo--card" />
            <div className="about-body">
              <p className="about__lead">{ABOUT_LEAD}</p>
              <p className="about__p">{ABOUT_P1}</p>
              <p className="about__p">{ABOUT_P2}</p>
            </div>
          </div>
        )}

        {d === 1 && (
          <div className="about-d2">
            <div className="about-body">
              <p className="about__lead">{ABOUT_LEAD}</p>
              <p className="about__p">{ABOUT_P1}</p>
              <p className="about__p">{ABOUT_P2}</p>
            </div>
            <AboutPhoto className="about-photo--glow" />
          </div>
        )}

        {d === 2 && (
          <div className="about-d3">
            <AboutPhoto className="about-photo--medallion" />
            <p className="about-d3__lead">{ABOUT_LEAD}</p>
            <div className="about-d3__cols">
              <p className="about__p">{ABOUT_P1}</p>
              <p className="about__p">{ABOUT_P2}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function App() {
  const heroImg = useRef(null)
  const progressBar = useRef(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(
    typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('introSeen'),
  )
  const finishIntro = () => {
    try { sessionStorage.setItem('introSeen', '1') } catch (e) { /* ignore */ }
    setLoading(false)
  }

  // lock body scroll while the project modal OR intro is open
  useEffect(() => {
    document.body.style.overflow = selected || loading ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, loading])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Hero parallax + scroll progress bar
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0
      if (heroImg.current && !reduce) {
        const shift = Math.max(-40, Math.min(40, y * 0.06 - 30))
        heroImg.current.style.transform = `translateY(${shift}px)`
      }
      if (progressBar.current) {
        const h = document.documentElement.scrollHeight - window.innerHeight
        progressBar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Calm scroll-reveal
    const revealEls = Array.from(document.querySelectorAll('.reveal'))
    let io
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      revealEls.forEach((el) => io.observe(el))
    } else {
      revealEls.forEach((el) => el.classList.add('is-in'))
    }

    // Scrollspy — highlight current section in nav
    const navLinks = Array.from(
      document.querySelectorAll('.nav__links a[href^="#"]'),
    )
    const sections = ['work', 'skills', 'experience']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    let spy
    if ('IntersectionObserver' in window && sections.length) {
      const setActive = (id) => {
        navLinks.forEach((a) =>
          a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`),
        )
      }
      spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(e.target.id)
          })
        },
        { threshold: 0, rootMargin: '-45% 0px -50% 0px' },
      )
      sections.forEach((s) => spy.observe(s))
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (io) io.disconnect()
      if (spy) spy.disconnect()
    }
  }, [])

  return (
    <>
      {loading && <Intro onDone={finishIntro} />}
      <div className="progress" ref={progressBar} aria-hidden="true" />

      {/* ===== NAV (tubelight) ===== */}
      <TubelightNav />

      {/* ===== HERO (Name wall, letter animation) ===== */}
      <HeroNamewall play={!loading} />

      {/* ===== STATS BAND ===== */}
      <section className="statsband">
        <div className="section__inner statsband__inner reveal">
          <div className="statsband__lead">
            <h2 className="h2">
              Work that ships,
              <br />
              results that hold.
            </h2>
            <p className="statsband__p">
              From first prototype to live URL — built end to end, deployed, and
              running in production.
            </p>
          </div>
          <div className="statsband__nums">
            {[
              ['5', 'Builds shipped'],
              ['1+', 'Years experience'],
              ['12+', 'Technologies'],
              ['100%', 'Shipped to live'],
            ].map(([n, l]) => (
              <div className="bignum" key={l}>
                <span className="bignum__n">{n}</span>
                <span className="bignum__l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT (3 switchable designs, with photo) ===== */}
      <AboutSection />

      {/* ===== WORK ===== */}
      <section id="work" className="section">
        <div className="section__inner reveal">
          <div className="work__head">
            <h2 className="h2">Selected work</h2>
            <p className="eyebrow">Four builds · 2025–2026</p>
          </div>

          {/* Reel — autoplay loop of the live builds; poster shown if reduced-motion */}
          <div className="reel">
            <video
              className="reel__video"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/w-skyline.jpg"
            >
              <source src="/videos/reel.webm" type="video/webm" />
              <source src="/videos/reel.mp4" type="video/mp4" />
            </video>
            <img
              className="reel__poster"
              src="/images/w-skyline.jpg"
              alt="Reel of selected projects"
            />
          </div>

          {/* clickable alternating grid — opens a detail modal */}
          <div className="pgrid">
            {PROJECTS.map((p, i) => (
              <article
                className="pcard reveal"
                key={p.num}
                style={{ transitionDelay: `${(i % 2) * 0.08 + Math.floor(i / 2) * 0.12}s` }}
                onClick={() => setSelected(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(p)}
              >
                <div className="pcard__media">
                  <Shot name={p.img} alt={p.alt} />
                  <span className="pcard__hint">View details</span>
                  {p.href && (
                    <a
                      className="pcard__live"
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${p.title} live`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
                <div className="pcard__body">
                  <div className="pcard__head">
                    <span className="pcard__num type-eyebrow">{p.num}</span>
                    <span className="pcard__cat type-eyebrow">{p.category}</span>
                  </div>
                  <h3 className="pcard__title">{p.title}</h3>
                  <p className="pcard__desc">{p.desc}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES (01/02/03) ===== */}
      <section id="skills" className="section">
        <div className="section__inner reveal">
          <h2 className="h2">Solutions that elevate your product</h2>
          <p className="section__lead">
            From front end to automation, I deliver end to end — strong UI, a
            solid backend, and the AI glue that ties it together.
          </p>
          <div style={{ marginTop: 'clamp(28px,4vw,48px)' }}>
            <CardCarousel images={SOLUTION_IMAGES} autoplayDelay={2200} />
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE + EDUCATION (3 switchable designs) ===== */}
      <CredentialsSection />

      {/* ===== PROJECT DETAIL MODAL ===== */}
      {selected && (
        <div className="pmodal" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <div className="pmodal__panel" onClick={(e) => e.stopPropagation()}>
            <button className="pmodal__close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            <div className="pmodal__media">
              <Shot name={selected.img} alt={selected.alt} />
            </div>
            <div className="pmodal__body">
              <span className="type-eyebrow">{selected.category}</span>
              <h3 className="pmodal__title">{selected.title}</h3>
              <div className="pmodal__rule" />
              <p className="pmodal__desc">{selected.desc}</p>

              <span className="type-eyebrow">Highlights</span>
              <ul className="pmodal__list">
                {selected.highlights.map((h) => (
                  <li key={h}><span className="dot" />{h}</li>
                ))}
              </ul>

              <span className="type-eyebrow">Tech stack</span>
              <div className="tags">
                {selected.tags.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>

              <div className="pmodal__actions">
                {selected.href ? (
                  <a className="btn btn--ink btn--footer" href={selected.href} target="_blank" rel="noopener noreferrer">
                    View live <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="pmodal__note">{selected.liveLabel}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== RECOGNITION ===== */}
      <section className="recog">
        <div className="section__inner recog__inner reveal">
          <div className="recog__head">
            <span className="type-eyebrow">2026</span>
            <h2 className="recog__title">
              Built &amp; shipped in a week — end to end.
            </h2>
          </div>
          <div className="recog__meta">
            <span className="recog__badge">ARCA — Week 1 Capstone</span>
            <p className="recog__p">
              Designed in a published design system, handed to Claude Code,
              and deployed to a live URL — the whole arc, one build.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__cols">
            <div className="footer__brand">
              <div className="footer__name">Jaimes Edward Cabante</div>
              <p className="footer__tagline">
                Full-Stack AI Developer based in Cebu, PH. I design, build, and
                ship AI-powered web products end to end.
              </p>
              <a
                className="btn btn--light btn--footer"
                href={RESUME}
                target="_blank"
                rel="noopener noreferrer"
                download={RESUME_FILENAME}
              >
                Download Résumé <span style={{ fontSize: 15, lineHeight: 1 }}>↓</span>
              </a>
            </div>

            <nav className="footer__nav">
              <span className="footer__nav-label">Menu</span>
              <a href="#top">Home</a>
              <a href="#work">Work</a>
              <a href="#about">About</a>
            </nav>

            <nav className="footer__nav">
              <span className="footer__nav-label">Navigation</span>
              <a href="#skills">Services</a>
              <a href="#experience">Experience</a>
              <a href="#education">Education</a>
              <a href={RESUME} target="_blank" rel="noopener noreferrer" download={RESUME_FILENAME}>Résumé</a>
            </nav>
          </div>

          <div className="footer__legal">
            <span>© 2026 Jaimes Edward Cabante</span>
            <span>Full-Stack AI Developer · Cebu, PH</span>
          </div>

          {/* Arca attribution — REQUIRED, final element on the page, links to arca.ph */}
          <a
            className="footer__arca"
            href="https://arca.ph"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Made for Arca.ph"
          >
            <img
              className="footer__arca-logo"
              src="/images/arca-logo.png"
              alt="Arca"
            />
            <span className="footer__arca-text">Made for Arca.ph</span>
          </a>
        </div>
      </footer>
    </>
  )
}
