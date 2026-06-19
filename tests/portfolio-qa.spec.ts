import { test, expect, request } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Portfolio QA sweep.
 * Adapted to this capstone: the site intentionally has NO social links and NO
 * mailto/tel (capstone rule), so steps 6–7 are inverted into compliance checks
 * (assert zero contact links) plus the required Arca footer attribution.
 */

type Result = { name: string; pass: boolean; detail: string }
const results: Result[] = []
const rec = (name: string, pass: boolean, detail = '') => results.push({ name, pass, detail })

test('portfolio QA sweep', async ({ page, baseURL }) => {
  // skip the session intro so the page is interactive immediately
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('introSeen', '1')
      sessionStorage.setItem('skylineIntroSeen', '1')
    } catch {}
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)

  // 1 — title + meta description
  try {
    const title = await page.title()
    expect(title).toMatch(/Jaimes|Cabante|Portfolio/i)
    const desc = await page.locator('meta[name="description"]').getAttribute('content')
    expect((desc || '').length).toBeGreaterThan(20)
    rec('Title & meta description set', true, title)
  } catch (e) {
    rec('Title & meta description set', false, String(e))
  }

  // 2 — profile photo loads
  try {
    const img = page.locator('.about-photo img').first()
    await img.scrollIntoViewIfNeeded()
    await expect
      .poll(async () => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), {
        timeout: 15000,
        message: 'profile image did not finish loading',
      })
      .toBeTruthy()
    rec('Profile photo loads', true)
  } catch (e) {
    rec('Profile photo loads', false, String(e))
  }

  // 3 — Download Résumé → /resume.pdf returns 200
  try {
    const href = await page.locator('a[href*="resume.pdf"]').first().getAttribute('href')
    expect(href).toContain('resume.pdf')
    const ctx = await request.newContext()
    const res = await ctx.get(new URL(href!, baseURL).toString())
    expect(res.status()).toBe(200)
    await ctx.dispose()
    rec('Résumé link → /resume.pdf (200)', true, href!)
  } catch (e) {
    rec('Résumé link → /resume.pdf (200)', false, String(e))
  }

  // 4 — every "View live" link returns 200 (no 404s)
  try {
    const hrefs: string[] = await page
      .locator('#work a[target="_blank"]')
      .evaluateAll((els) => [...new Set(els.map((a) => (a as HTMLAnchorElement).href).filter((h) => /^https?:/.test(h)))])
    const ctx = await request.newContext()
    const bad: string[] = []
    for (const h of hrefs) {
      let s = 0
      try { s = (await ctx.get(h, { timeout: 20000 })).status() } catch { try { s = (await ctx.head(h)).status() } catch { s = 0 } }
      if (s === 0 || s >= 400) bad.push(`${h} → ${s}`)
    }
    await ctx.dispose()
    expect(bad, bad.join('; ')).toHaveLength(0)
    rec('Work "View live" links return 200', true, `${hrefs.length} links OK`)
  } catch (e) {
    rec('Work "View live" links return 200', false, String(e))
  }

  // 5 (capstone) — NO contact / social links anywhere
  try {
    const n = await page
      .locator('a[href^="mailto:"], a[href^="tel:"], a[href*="linkedin"], a[href*="instagram"], a[href*="twitter"], a[href*="x.com"], a[href*="facebook"], a[href*="tiktok"], a[href*="github.com"], a[href*="bsky"]')
      .count()
    expect(n).toBe(0)
    rec('Capstone: no contact/social/mailto links', true)
  } catch (e) {
    rec('Capstone: no contact/social/mailto links', false, String(e))
  }

  // 6 (capstone) — Arca footer attribution, last block, → arca.ph
  try {
    const arca = page.locator('.footer__arca')
    await expect(arca).toHaveAttribute('href', /arca\.ph/)
    await expect(arca).toContainText(/Made for Arca\.ph/i)
    const logoOk = await arca.locator('img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)
    expect(logoOk).toBeTruthy()
    rec('Capstone: Arca footer → arca.ph', true)
  } catch (e) {
    rec('Capstone: Arca footer → arca.ph', false, String(e))
  }

  // 7 — screenshots: desktop / tablet / mobile
  const shots: Record<string, string> = {}
  const dir = path.join('tests', 'screenshots')
  fs.mkdirSync(dir, { recursive: true })
  for (const [name, w, h] of [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 375, 667]] as const) {
    await page.setViewportSize({ width: w, height: h })
    await page.waitForTimeout(450)
    const p = path.join(dir, `${name}.png`)
    await page.screenshot({ path: p, fullPage: true })
    shots[name] = p
  }
  rec('Screenshots (desktop/tablet/mobile)', true, Object.values(shots).join(', '))

  // 8 — no horizontal scroll on mobile
  try {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(300)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `overflow ${overflow}px`).toBeLessThanOrEqual(1)
    rec('No horizontal scroll on mobile (375px)', true)
  } catch (e) {
    rec('No horizontal scroll on mobile (375px)', false, String(e))
  }

  // write markdown report
  const lines = [
    '# Portfolio QA Report',
    '',
    `**Target:** ${baseURL}`,
    '',
    '| Check | Result | Detail |',
    '|---|---|---|',
    ...results.map((r) => `| ${r.name} | ${r.pass ? '✅ PASS' : '❌ FAIL'} | ${r.detail.replace(/\n/g, ' ').slice(0, 180)} |`),
    '',
    '## Screenshots',
    ...Object.entries(shots).map(([k, v]) => `- **${k}** — \`${v}\``),
    '',
  ]
  fs.writeFileSync(path.join('tests', 'qa-report.md'), lines.join('\n'))

  const failed = results.filter((r) => !r.pass)
  expect(failed, failed.map((f) => `${f.name}: ${f.detail}`).join('\n')).toHaveLength(0)
})
