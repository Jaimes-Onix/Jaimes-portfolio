# Portfolio — Design Direction (Lesson 2, LOCKED)

> Source: your published Claude Design system **"Skyline Aerial — Design System"** (default).
> Direction: **Monochrome & cinematic.** Emphasis from value, weight & scale — not hue.

---

## Concept
A calm, cinematic, monochrome single-page portfolio. White surfaces, near-black ink,
hairline borders, generous space. The work does the talking; the chrome stays quiet.
**One cinematic hero moment** (per motion decision), everything else clean and fast.

## Section order (baseline — Work-first)
`Hero → Work → About → Skills → Resume → Footer`
> Confirm or override if your Lesson 2 guide specifies a different order.

---

## Color tokens (monochrome)
**Ink & surfaces**
| Token | Hex | Use |
|---|---|---|
| `--page` | `#FFFFFF` | page background |
| `--tinted` | `#F7F7F9` | alt section bg |
| `--soft` | `#F1F1F3` | subtle fills |
| `--ink-surface` | `#161618` | dark cards / inverted blocks |
| `--ink-deep` | `#0A0A0B` | deepest dark (stat block, footer) |

**Grey ramp:** 700 `#3F3F46` · 600 `#52525B` · 500 `#A1A1AA` · 200 `#D4D4D8` · 100 `#F4F4F5`

**Text:** Strong `#161618` · Body `#2E2E33` · Muted `#5B5B63` · Faint `#9A9AA3`

**Status (functional only):** Success `#2F8F63` · Warning `#B9842F` · Danger `#C0494C`
**Hairline:** `#E6E6EA`

> No brand hue. Color = ink + greys. Status colors used only for functional signals (e.g. "Available" dot).

## Typography
- **Display:** Sora 700–800, tight tracking (`-0.02em` to `-0.03em`)
- **Body:** Inter 400–600
- **Scale:** Display 64 · H1 48 · H2 36 · Lead 19 · Body 16 · Eyebrow 13 (uppercase, tracked `0.14em`)

## Spacing, radius, elevation
- **Radius:** sm 8 · md 12 · lg 16 · xl 22. **Cards = 16px. Buttons = full pill.**
- **Shadows:** soft, low-opacity, neutral (no hue). Layers: xs / sm / md / lg.
- Spacing scale consistent (4/8 base); generous section padding.

## Components (from system)
- **Buttons:** primary = ink-deep **full pill** (e.g. "View work"); secondary = white pill + hairline border; tertiary = bold text link with arrow.
- **Badges/tags:** grey-100 pill, small, Inter 500. Status badge variant with leading dot.
- **Cards:** white, 16px radius, hairline border, soft shadow. Dark variant on `--ink-surface`.
- **Stat block:** `--ink-deep` panel, large Sora numbers, muted labels (e.g. "2,400+ / 48h / 4.9★" pattern → adapt to my stats).

---

## Motion (decision: "showcase a hero effect")
- **One cinematic hero moment** only — monochrome, restrained (e.g. subtle animated grain/grid, slow parallax, or a quiet 3D/canvas element in greyscale). No color, no flashing.
- Everything else: smooth scroll-reveals (opacity + transform only), refined hover/focus/active states. Respect `prefers-reduced-motion`.

## Capstone guardrails (NON-NEGOTIABLE)
- ❌ No contact details anywhere (no email/phone/address/social).
- ✅ Footer on every page = **Arca logo + "Made for Arca.ph"**, together, last block. (Logo file arrives with Scaffold lesson.)
- Resume download (`/public/resume.pdf`) is already contact-free — safe.

## Assets
- Profile: `Day 5 Arca/Profile.jpg` (grey-bg headshot — crop watermark)
- Resume PDF (contact-free): `Day 5 Arca/Cabante_Jaimes Edward (Resume).pdf` → `/public/resume.pdf`
- Work media: see GATHER.md "Showcase media on hand"
