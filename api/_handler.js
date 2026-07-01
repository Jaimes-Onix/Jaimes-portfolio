/**
 * Shared chat handler — talks to the Groq API.
 *
 * Used by BOTH:
 *   - api/chat.js          → the Vercel serverless function (production)
 *   - vite.config.js       → a dev middleware so it works under `npm run dev`
 *
 * The API key lives only in server-side env (GROQ_API_KEY) and is never sent to
 * the browser. Groq's API is OpenAI-compatible.
 *
 * Configurable via env:
 *   GROQ_API_KEY   (required) — your Groq key (gsk_...)
 *   GROQ_MODEL     (optional) — defaults to "llama-3.3-70b-versatile"
 *   GROQ_BASE_URL  (optional) — defaults to "https://api.groq.com/openai/v1"
 */

import { SYSTEM_PROMPT } from './_knowledge.js';

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';

const MAX_MESSAGES = 16; // most recent turns to keep (excludes system prompt)
const MAX_CHARS = 4000; // per-message clamp to bound cost / abuse

class HttpError extends Error {
  constructor(status, clientMessage, detail) {
    super(clientMessage);
    this.status = status;
    this.clientMessage = clientMessage;
    this.detail = detail;
  }
}

/** Keep only well-formed user/assistant turns, clamp size, keep the most recent. */
function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) {
    throw new HttpError(400, 'Request must include a "messages" array.');
  }
  const cleaned = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_MESSAGES);

  if (cleaned.length === 0) {
    throw new HttpError(400, 'No valid message to answer.');
  }
  return cleaned;
}

/**
 * Generate a reply from Grok.
 * @param {Array<{role:string, content:string}>} messages - conversation so far
 * @returns {Promise<string>} the assistant reply text
 */
export async function generateReply(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new HttpError(
      503,
      'The assistant is not configured yet. Please add GROQ_API_KEY to the environment.',
      'Missing GROQ_API_KEY',
    );
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const baseUrl = (process.env.GROQ_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const safeMessages = sanitizeMessages(messages);

  let response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages],
        temperature: 0.5,
        max_tokens: 200,
        stream: false,
      }),
    });
  } catch (err) {
    throw new HttpError(502, 'Could not reach the assistant. Please try again.', String(err));
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    // Surface a hint for the common misconfiguration cases without leaking the body.
    let clientMessage = 'The assistant had trouble responding. Please try again.';
    if (response.status === 401 || response.status === 403) {
      clientMessage = 'The assistant is misconfigured (auth). Check the GROQ_API_KEY.';
    } else if (response.status === 404) {
      clientMessage = 'The configured model was not found. Check GROQ_MODEL.';
    } else if (response.status === 429) {
      clientMessage = 'The assistant is busy right now. Please try again in a moment.';
    }
    throw new HttpError(response.status === 429 ? 429 : 502, clientMessage, detail);
  }

  const data = await response.json().catch(() => null);
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new HttpError(502, 'The assistant returned an empty response. Please try again.', JSON.stringify(data));
  }
  return reply;
}

export { HttpError };
