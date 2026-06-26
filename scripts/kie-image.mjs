#!/usr/bin/env node
/**
 * Generate an image via kie.ai (nano-banana) and save it locally.
 *
 * Usage:
 *   node scripts/kie-image.mjs --prompt "..." --output public/images/x.png --aspect 4:3
 *
 * Reads KIE_API_KEY (and optional KIE_BASE_URL, KIE_MODEL) from process.env or .env.local.
 */
import fs from 'node:fs'
import path from 'node:path'

/* ---- tiny .env.local loader (no deps) ---- */
function loadEnvLocal() {
  for (const f of ['.env.local', '.env']) {
    try {
      const txt = fs.readFileSync(f, 'utf8')
      for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
        }
      }
    } catch {}
  }
}
loadEnvLocal()

/* ---- args ---- */
const args = {}
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i]
  if (a.startsWith('--')) args[a.slice(2)] = process.argv[++i]
}
const prompt = args.prompt
const output = args.output
const aspect = args.aspect || '1:1'
if (!prompt || !output) {
  console.error('Usage: node scripts/kie-image.mjs --prompt "..." --output path.png [--aspect 4:3]')
  process.exit(1)
}

const KEY = process.env.KIE_API_KEY
if (!KEY) { console.error('KIE_API_KEY not found in env or .env.local'); process.exit(1) }
const BASE = (process.env.KIE_BASE_URL || 'https://api.kie.ai').replace(/\/$/, '')
const MODEL = process.env.KIE_MODEL || 'google/nano-banana'
const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  console.log(`→ createTask (${MODEL}, ${aspect})`)
  const create = await fetch(`${BASE}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      input: { prompt, aspect_ratio: aspect, output_format: 'png' },
    }),
  }).then((r) => r.json())
  if (create.code !== 200 || !create.data?.taskId) {
    console.error('createTask failed:', JSON.stringify(create)); process.exit(1)
  }
  const taskId = create.data.taskId
  console.log('  taskId:', taskId)

  let url
  for (let i = 0; i < 60; i++) {
    await sleep(3000)
    const info = await fetch(`${BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, { headers }).then((r) => r.json())
    const d = info.data || {}
    const state = String(d.state ?? d.status ?? '').toLowerCase()
    process.stdout.write(`  poll ${i + 1}: ${state || JSON.stringify(info).slice(0, 80)}\n`)
    if (state === 'success' || d.successFlag === 1) {
      let rj = d.resultJson
      if (typeof rj === 'string') { try { rj = JSON.parse(rj) } catch {} }
      url = (rj?.resultUrls || rj?.result_urls || d.resultUrls || [])[0]
      break
    }
    if (state === 'fail' || state === 'failed' || d.successFlag === 0 && state) {
      console.error('task failed:', JSON.stringify(d)); process.exit(1)
    }
  }
  if (!url) { console.error('No result URL (timed out or unexpected shape).'); process.exit(1) }

  console.log('→ downloading', url)
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, buf)
  console.log('✓ saved', output, `(${(buf.length / 1024).toFixed(0)} kB)`)
}
main().catch((e) => { console.error(e); process.exit(1) })
