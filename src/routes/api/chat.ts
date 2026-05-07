import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import {
  chat,
  convertMessagesToModelMessages,
  toServerSentEventsResponse,
  type ModelMessage,
  type StreamChunk,
  type UIMessage,
} from '@tanstack/ai'
import {
  OpenAITextAdapter,
  type OpenAIChatModel,
} from '@tanstack/ai-openai'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'
const CF_AI_MODEL = '@cf/meta/llama-3.1-8b-instruct'

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

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { messages?: Array<UIMessage | ModelMessage> }
        try {
          body = (await request.json()) as {
            messages?: Array<UIMessage | ModelMessage>
          }
        } catch {
          return new Response('Invalid JSON', { status: 400 })
        }

        if (!Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response('messages array required', { status: 400 })
        }
        if (body.messages.length > 30) {
          return new Response('Conversation too long — start a new chat', {
            status: 400,
          })
        }

        const modelMessages = convertMessagesToModelMessages(body.messages)
        for (const m of modelMessages) {
          const text = typeof m.content === 'string' ? m.content : ''
          if (text.length > 4000) {
            return new Response('Message too long', { status: 400 })
          }
        }

        const openrouterKey =
          (env as unknown as { OPENROUTER_API_KEY?: string })
            .OPENROUTER_API_KEY ?? process.env['OPENROUTER_API_KEY']

        type CfAi = {
          run: (
            model: string,
            input: {
              messages: Array<{ role: string; content: string }>
              max_tokens?: number
            },
          ) => Promise<{ response?: string }>
        }
        const ai = (env as unknown as { AI?: CfAi }).AI

        const messagesForProvider = modelMessages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : '',
        }))

        const fallback = (): AsyncIterable<StreamChunk> =>
          ai
            ? cfAiStream(ai, messagesForProvider)
            : syntheticReplyStream(
                "Sorry, the AI service is unavailable right now. Try again in a minute, or use the tools directly — they don't need AI.",
              )

        if (openrouterKey) {
          const adapter = new OpenAITextAdapter(
            {
              apiKey: openrouterKey,
              baseURL: OPENROUTER_BASE_URL,
              defaultHeaders: {
                'HTTP-Referer': 'https://plotrai.in',
                'X-Title': 'Plotr Ai',
              },
            },
            OPENROUTER_MODEL as OpenAIChatModel,
          )
          const primary = chat({
            adapter,
            systemPrompts: [SYSTEM_PROMPT],
            messages: messagesForProvider,
            maxTokens: 512,
            temperature: 0.4,
          })
          return toServerSentEventsResponse(withFallback(primary, fallback))
        }

        return toServerSentEventsResponse(fallback())
      },
    },
  },
})

/**
 * Wrap a primary stream so a failure BEFORE any chunk is emitted swaps in
 * the fallback. Mid-stream failures surface as RUN_ERROR (we can't undo
 * already-sent partial text without confusing the client).
 */
async function* withFallback(
  primary: AsyncIterable<StreamChunk>,
  fallback: () => AsyncIterable<StreamChunk>,
): AsyncIterable<StreamChunk> {
  let emittedAny = false
  try {
    for await (const chunk of primary) {
      emittedAny = true
      yield chunk
    }
  } catch (err) {
    if (emittedAny) {
      console.warn('[chat] primary errored mid-stream:', err)
      yield {
        type: 'RUN_ERROR',
        error: {
          message: err instanceof Error ? err.message : 'stream error',
        },
        timestamp: Date.now(),
      }
      return
    }
    console.warn('[chat] primary failed before first chunk, using fallback:', err)
    for await (const chunk of fallback()) yield chunk
  }
}

async function* cfAiStream(
  ai: {
    run: (
      model: string,
      input: {
        messages: Array<{ role: string; content: string }>
        max_tokens?: number
      },
    ) => Promise<{ response?: string }>
  },
  messages: Array<{ role: string; content: string }>,
): AsyncIterable<StreamChunk> {
  try {
    const out = await ai.run(CF_AI_MODEL, {
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 512,
    })
    yield* syntheticReplyStream(out.response ?? '(empty response)')
  } catch (err) {
    console.warn('[chat] CF AI fallback failed:', err)
    yield* syntheticReplyStream(
      "Sorry, the AI service is unavailable right now. Try again in a minute.",
    )
  }
}

async function* syntheticReplyStream(
  reply: string,
): AsyncIterable<StreamChunk> {
  const runId = crypto.randomUUID()
  const messageId = crypto.randomUUID()
  const now = () => Date.now()
  yield { type: 'RUN_STARTED', runId, timestamp: now() }
  yield {
    type: 'TEXT_MESSAGE_START',
    messageId,
    role: 'assistant',
    timestamp: now(),
  }
  yield {
    type: 'TEXT_MESSAGE_CONTENT',
    messageId,
    delta: reply,
    timestamp: now(),
  }
  yield { type: 'TEXT_MESSAGE_END', messageId, timestamp: now() }
  yield {
    type: 'RUN_FINISHED',
    runId,
    finishReason: 'stop',
    timestamp: now(),
  }
}
