import { useEffect, useRef } from 'react'

const RESUME = '/resume.pdf'

const BRAND_URL = 'https://tester-website-beige.vercel.app/'
const SKYLINE_URL = 'https://skyline-aerial.vercel.app/'

const FLAGSHIP = {
  num: '01',
  title: 'Skyline Aerial',
  desc: 'AI-powered consumer drone — a product site plus a matching pitch deck, both built on one shared design system.',
  tags: ['Design System', 'Claude Code', 'Vercel'],
  href: SKYLINE_URL,
  img: 'work-01-skyline',
  alt: 'Skyline Aerial site hero — “See your world from above.”',
}

const WORK = [
  {
    num: '02',
    title: 'Brand landing + contact form',
    desc: 'Marketing landing with a working contact form — submissions to Supabase, email delivery via Resend.',
    tags: ['React', 'Supabase', 'Resend'],
    href: BRAND_URL,
    img: 'work-02-brand',
    alt: 'Tester.io brand landing page hero',
  },
  {
    num: '03',
    title: 'Product page, in motion',
    desc: 'Product page with a video hero and 3D scroll motion that reveals the build as you move down.',
    tags: ['3D', 'Motion', 'React'],
    href: BRAND_URL,
    img: 'work-03-product',
    alt: 'Tester Smart Watch Pro product page',
    liveLabel: null,
  },
  {
    num: '04',
    title: 'Admin dashboard',
    desc: 'Internal dashboard reading and writing against the live backend, with authenticated access.',
    tags: ['Dashboard', 'Supabase', 'Auth'],
    href: null,
    img: 'work-04-dashboard',
    alt: 'Admin dashboard overview with submissions and metrics',
    liveLabel: 'Authenticated — private',
  },
  {
    num: '05',
    title: 'Morning Briefing',
    desc: 'An n8n automation that generates and sends a daily briefing email — set once, runs itself.',
    tags: ['n8n', 'Automation', 'AIGC'],
    href: null,
    img: 'work-05-briefing',
    alt: 'Morning Briefing automated email',
    liveLabel: 'Runs on a schedule',
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

export default function App() {
  const heroImg = useRef(null)
  const progressBar = useRef(null)

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
      <div className="progress" ref={progressBar} aria-hidden="true" />

      {/* ===== NAV ===== */}
      <header className="nav">
        <nav className="nav__inner">
          <a href="#top" className="nav__brand">
            JEC
          </a>
          <div className="nav__right">
            <div className="nav__links">
              <a href="#work">Work</a>
              <a href="#skills">Skills</a>
              <a href="#experience">Experience</a>
            </div>
            <a
              className="btn btn--nav"
              href={RESUME}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Résumé
            </a>
          </div>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section id="top" className="hero">
        <div
          className="hero__bg"
          aria-hidden="true"
          style={{
            '--hero-bg':
              "url('https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1800&q=80&auto=format&fit=crop')",
          }}
        />
        <div className="hero__inner">
          <div className="hero__copy">
            <div className="status">
              <span className="status__dot" />
              Available
            </div>
            <h1 className="hero__name">
              Jaimes Edward
              <br />
              Cabante
            </h1>
            <p className="hero__role">Full-Stack AI Developer</p>
            <p className="hero__tagline">
              I design and ship AI-powered websites — from first prototype to
              live URL.
            </p>
            <div className="chips">
              <span className="chip">5 builds shipped</span>
              <span className="chip">Cebu, PH</span>
              <span className="chip">Claude Code–first</span>
            </div>
            <a
              className="btn btn--ink btn--hero"
              href={RESUME}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Résumé
              <span style={{ fontSize: 16, lineHeight: 1 }}>↓</span>
            </a>
          </div>

          <div className="hero__media">
            <div className="hero__portrait">
              <img
                ref={heroImg}
                src="/assets/profile.jpg"
                alt="Jaimes Edward Cabante"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="section section--tinted">
        <div className="section__inner about reveal">
          <div>
            <p className="eyebrow">About</p>
          </div>
          <div className="about__body">
            <p className="about__lead">
              I'm Jaimes Edward Cabante, a full-stack AI developer who builds,
              deploys, and automates with Claude Code at the center of the work.
            </p>
            <p className="about__p">
              I take products end to end — React front ends, Spring Boot and
              REST APIs, and Supabase and Firebase for database management —
              with LLM integration, automation, and AI-generated media woven in.
            </p>
            <p className="about__p">
              I like owning the whole arc: the first prototype, the design
              system, the late call to cut a feature, the moment it goes live. I
              care about work that actually saves people real time — automation
              that quietly removes manual effort. Next, I'm looking for a team
              building real AI products that wants someone who can design,
              build, and deploy it.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WORK ===== */}
      <section id="work" className="section">
        <div className="section__inner reveal">
          <div className="work__head">
            <h2 className="h2">Selected work</h2>
            <p className="eyebrow">Five builds · 2025–2026</p>
          </div>

          {/* Reel — autoplay loop of the live builds; poster shown if reduced-motion */}
          <div className="reel">
            <video
              className="reel__video"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/work-01-skyline.jpg"
            >
              <source src="/videos/reel.webm" type="video/webm" />
              <source src="/videos/reel.mp4" type="video/mp4" />
            </video>
            <img
              className="reel__poster"
              src="/images/work-01-skyline.jpg"
              alt="Reel of selected projects"
            />
          </div>

          {/* 01 flagship */}
          <article className="card work__flagship">
            <div>
              <div className="card__num">{FLAGSHIP.num}</div>
              <h3 className="card__title">{FLAGSHIP.title}</h3>
              <p className="work__flagship-desc">{FLAGSHIP.desc}</p>
              <div className="tags">
                {FLAGSHIP.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="card__foot">
                <ViewLive href={FLAGSHIP.href} />
              </div>
            </div>
            <div className="card__media work__flagship-media">
              <Shot name={FLAGSHIP.img} alt={FLAGSHIP.alt} />
            </div>
          </article>

          {/* 02–05 grid */}
          <div className="work__grid">
            {WORK.map((p) => (
              <article className="card" key={p.num}>
                <div className="card__media">
                  <Shot name={p.img} alt={p.alt} />
                </div>
                <div className="card__num">{p.num}</div>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__desc">{p.desc}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="card__foot">
                  <ViewLive href={p.href} label={p.liveLabel} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section id="skills" className="section section--tinted">
        <div className="section__inner reveal">
          <h2 className="h2" style={{ marginBottom: 'clamp(36px,5vw,56px)' }}>
            Skills
          </h2>
          <div>
            {SKILLS.map((g) => (
              <div className="row" key={g.cat}>
                <div className="row__label">{g.cat}</div>
                <div className="row__value">{g.items}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience" className="section">
        <div className="section__inner reveal">
          <h2 className="h2" style={{ marginBottom: 'clamp(36px,5vw,56px)' }}>
            Experience
          </h2>
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
      </section>

      {/* ===== EDUCATION ===== */}
      <section id="education" className="section">
        <div className="section__inner edu reveal">
          <h2 className="h2">Education</h2>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 className="edu__title">
              BS in Information Technology (BSIT)
            </h3>
            <p className="edu__sub">
              Cebu Institute of Technology – University
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div
          className="footer__bg"
          aria-hidden="true"
          style={{
            '--footer-bg':
              "url('https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1800&q=80&auto=format&fit=crop')",
          }}
        />
        <div className="footer__inner">
          <div className="footer__cols">
            <div>
              <div className="footer__name">Jaimes Edward Cabante</div>
              <a
                className="btn btn--light btn--footer"
                href={RESUME}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Résumé <span style={{ fontSize: 15, lineHeight: 1 }}>↓</span>
              </a>
            </div>

            <nav className="footer__nav">
              <span className="footer__nav-label">Navigate</span>
              <a href="#top">Back to top</a>
              <a href="#work">Work</a>
              <a href="#skills">Skills</a>
              <a href="#experience">Experience</a>
              <a href="#education">Education</a>
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
