import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'

/**
 * AI architect chat — answers questions about Vastu, NBC norms, Indian
 * construction standards, material calculations, etc.
 *
 * Routing strategy:
 * 1. PRIMARY: OpenRouter free model (meta-llama/llama-3.3-70b-instruct:free)
 *    — zero cost, generous quality.
 * 2. FALLBACK: Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct)
 *    — runs on the edge, charges Neurons. We intentionally only use this
 *    when OpenRouter fails so the cost stays effectively zero.
 *
 * Both paths share an OpenAI-style messages array. We never pass user
 * input as a prompt — only as `role: "user"` messages — so the system
 * prompt stays authoritative.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatInput {
  messages: ReadonlyArray<ChatMessage>
}

export interface ChatOutput {
  reply: string
  source: 'openrouter' | 'cloudflare-ai' | 'fallback-error'
}

const SYSTEM_PROMPT = `You are Plotr Ai's architect assistant for Indian homeowners.

LANGUAGE RULES (mirror the user's script — this is critical):
- If the user writes in Hinglish (Roman Hindi like "vastu ke liye kya zaroori hai"), reply in Hinglish too.
- If the user writes in Devanagari (हिंदी), reply in Devanagari.
- If the user writes in English, reply in English.
- DEFAULT for ambiguous greetings ("hi", "hello", "hey") = Hinglish — that matches our urban Indian audience's typing pattern.
- ALWAYS keep these technical terms in English regardless of script: Vastu, NBC, BIS, stamp duty, cement, M20, M25, FAR, FSI, OC, CC, RERA, kWh, sq ft, sq m, lakh, crore (cr), brick, plaster, RCC, slab, beam, column, registration, capital gains, TDS, GST. Don't transliterate these.

Topics you handle:
- Vastu Shastra (zone meanings, room placement, remedies)
- Indian construction norms (NBC, BIS standards, state Schedule of Rates)
- Material requirements (cement, steel, sand, brick calculations)
- Stamp duty, registration charges, capital gains tax for property sales
- Floor plan design and 3D rendering trade-offs

Style:
- Concise: 2-4 sentences default.
- When you state a fact, cite the rule, section, or formula (e.g. "NBC Part 3 Section 8.2", "M20 = 1:1.5:3").
- If asked something outside Indian home design, politely redirect.
- You don't have access to the user's specific tool data — speak generally unless they paste numbers.

Hinglish examples for tone:
- "Vastu ke hisaab se main entrance North ya East mein best hota hai. South-West entrance avoid karein — wo zone master bedroom ke liye hai."
- "Mumbai mein 1.2 cr ke flat pe stamp duty 6% hai = ₹7.2 lakh, plus 1% registration = ₹1.2 lakh. Total ₹8.4 lakh approx."
- "1 cubic meter M20 concrete ke liye chahiye: 8 bags cement (50kg each), 0.42 cum sand, 0.83 cum aggregate."`

const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'
const CF_AI_MODEL = '@cf/meta/llama-3.1-8b-instruct'

export const chat = createServerFn({ method: 'POST' })
  .inputValidator((input: ChatInput) => {
    if (!Array.isArray(input.messages) || input.messages.length === 0) {
      throw new Error('messages array required')
    }
    if (input.messages.length > 30) {
      throw new Error('Conversation too long — start a new chat')
    }
    for (const m of input.messages) {
      if (typeof m.content !== 'string' || m.content.length > 4000) {
        throw new Error('Invalid message')
      }
    }
    return input
  })
  .handler(async ({ data }): Promise<ChatOutput> => {
    const messagesWithSystem: ReadonlyArray<ChatMessage> = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...data.messages,
    ]

    // 1. Try OpenRouter free model.
    // Cloudflare Workers exposes secrets on `env`, NOT `process.env` — so we
    // read from the cloudflare:workers binding first and fall back to
    // process.env for non-Workers dev contexts.
    const openrouterKey =
      (env as unknown as { OPENROUTER_API_KEY?: string }).OPENROUTER_API_KEY ??
      process.env['OPENROUTER_API_KEY']
    if (openrouterKey) {
      try {
        const reply = await callOpenRouter(messagesWithSystem, openrouterKey)
        return { reply, source: 'openrouter' }
      } catch (err) {
        console.warn('[chat] OpenRouter failed, falling back to CF AI:', err)
      }
    }

    // 2. Fallback: Cloudflare Workers AI
    type CfAi = {
      run: (model: string, input: { messages: ReadonlyArray<ChatMessage>; max_tokens?: number }) => Promise<{ response?: string }>
    }
    const ai = (env as unknown as { AI?: CfAi }).AI
    if (ai) {
      try {
        const out = await ai.run(CF_AI_MODEL, {
          messages: messagesWithSystem,
          max_tokens: 512,
        })
        return { reply: out.response ?? '(empty response)', source: 'cloudflare-ai' }
      } catch (err) {
        console.warn('[chat] Cloudflare AI fallback failed:', err)
      }
    }

    return {
      reply:
        "Sorry, the AI service is unavailable right now. Try again in a minute, or use the tools directly — they don't need AI.",
      source: 'fallback-error',
    }
  })

async function callOpenRouter(
  messages: ReadonlyArray<ChatMessage>,
  apiKey: string,
): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://plotrai.shaban-razaa.workers.dev',
      'X-Title': 'Plotr Ai',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.4,
    }),
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 200)}`)
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const reply = json.choices?.[0]?.message?.content
  if (!reply) throw new Error('OpenRouter returned no content')
  return reply
}
