/**
 * POST /api/chat  — Vercel serverless function.
 *
 * Body:  { messages: [{ role: "user" | "assistant", content: string }, ...] }
 * Reply: { reply: string }  on success
 *        { error: string }  on failure (with an appropriate HTTP status)
 *
 * The Groq key stays server-side (GROQ_API_KEY). Never exposed to the browser.
 */

import { generateReply } from './_handler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const reply = await generateReply(body.messages);
    return res.status(200).json({ reply });
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    const message = (err && err.clientMessage) || 'Something went wrong. Please try again.';
    if (status >= 500) {
      // Server-side log only; never returned to the client.
      console.error('[api/chat]', status, err && err.detail ? err.detail : err);
    }
    return res.status(status).json({ error: message });
  }
}
