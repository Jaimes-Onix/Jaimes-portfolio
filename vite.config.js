import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Dev-only middleware so POST /api/chat works under `npm run dev`.
 * In production the same logic runs as the Vercel function in /api/chat.js.
 * Both import the shared handler in /api/_handler.js, so there's one code path.
 */
function devChatApi() {
  return {
    name: 'dev-chat-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed.' }))
          return
        }
        try {
          const raw = await readBody(req)
          const body = raw ? JSON.parse(raw) : {}
          // Imported lazily so edits to the handler hot-reload between requests.
          const { generateReply } = await import('./api/_handler.js')
          const reply = await generateReply(body.messages)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ reply }))
        } catch (err) {
          const status = err && err.status ? err.status : 500
          const message = (err && err.clientMessage) || 'Something went wrong. Please try again.'
          if (status >= 500) console.error('[dev /api/chat]', status, err && err.detail ? err.detail : err)
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 1e6) reject(new Error('Body too large')) // 1MB guard
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export default defineConfig(({ mode }) => {
  // Load .env files into process.env so the shared handler (Node side) can read
  // GROQ_API_KEY in dev. The '' prefix loads ALL vars, not just VITE_-prefixed
  // ones — and because we only read them server-side, the key is never bundled.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['GROQ_API_KEY', 'GROQ_MODEL', 'GROQ_BASE_URL']) {
    if (env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), tailwindcss(), devChatApi()],
    server: { port: 3000 },
  }
})
