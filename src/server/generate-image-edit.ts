import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import {
  reserveNeurons,
  refundNeurons,
  NEURONS_PER_CALL,
  getUsage,
} from './neuron-cap'

/**
 * AI image rendering for Plotr Ai's three visual tools:
 * - /floor-plan-3d (2D plan → isometric 3D render)
 * - /interior-restyle (room photo → re-styled)
 * - /empty-room-stager (empty room → furnished)
 *
 * Migrated from OpenAI gpt-image-1 (paid, ~$0.07-$0.19 / image) to
 * Cloudflare Workers AI @cf/runwayml/stable-diffusion-v1-5-img2img
 * (~1.5k Neurons / image, free up to 10k Neurons / day).
 *
 * Trade-off accepted: SD 1.5 quality is lower than gpt-image-1, especially
 * for floor-plan-3d which is a difficult img2img transformation. We capture
 * this in copy ("AI-generated visualization") and keep the existing
 * "regenerate" + "user-overrideable rates" patterns to compensate.
 */

export type ImageEditMode = 'floor-plan-3d' | 'interior-restyle' | 'empty-room-stager'

export type ImageEditStyle =
  | 'modern'
  | 'indian-traditional'
  | 'scandinavian'
  | 'minimal'
  | 'luxury'

export interface GenerateImageEditInput {
  image: string
  mimeType: string
  mode: ImageEditMode
  style: ImageEditStyle
  /** SD 1.5 supports steps 1-20. Higher = slower + better. */
  quality: 'medium' | 'high'
}

export interface GenerateImageEditOutput {
  base64: string
  /** Echoed back so the UI can show "X Neurons used today / 10,000 cap". */
  usage: ReturnType<typeof getUsage>
}

const STYLE_DESCRIPTIONS: Record<ImageEditStyle, string> = {
  modern:
    'modern interior, light wood floors, white walls, large windows, contemporary furniture, soft daylight',
  'indian-traditional':
    'Indian traditional interior, warm earth tones, carved wood furniture, brass accents, jute or kilim rugs, soft golden lighting',
  scandinavian:
    'Scandinavian interior, white walls, light oak floors, minimalist furniture, cozy textiles, bright natural light',
  minimal:
    'minimal interior, neutral palette, uncluttered surfaces, simple geometric furniture, even diffused lighting',
  luxury:
    'luxury interior, marble floors, rich materials, statement chandeliers, designer furniture, dramatic warm lighting',
}

function buildPrompt(mode: ImageEditMode, style: ImageEditStyle): string {
  const styleDesc = STYLE_DESCRIPTIONS[style]
  switch (mode) {
    case 'floor-plan-3d':
      return `isometric 3D cutaway architectural render of this floor plan, photorealistic, ${styleDesc}, no text, no labels`
    case 'interior-restyle':
      return `re-render this room in ${styleDesc}, keep the same layout and walls, photorealistic interior photography`
    case 'empty-room-stager':
      return `furnish this empty room photorealistically, ${styleDesc}, professional interior photography`
  }
}

const NEGATIVE_PROMPT =
  'text, watermark, label, dimension lines, low quality, blurry, distorted, deformed, ugly, out of frame'

export const generateImageEdit = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateImageEditInput) => input)
  .handler(async ({ data }): Promise<GenerateImageEditOutput> => {
    type CfAi = {
      run: (
        model: string,
        input: {
          prompt: string
          negative_prompt?: string
          image?: Array<number>
          num_steps?: number
          strength?: number
          guidance?: number
          height?: number
          width?: number
        },
      ) => Promise<ReadableStream<Uint8Array>>
    }
    const ai = (env as unknown as { AI?: CfAi }).AI
    if (!ai) {
      throw new Error('Workers AI is not bound — check wrangler.jsonc has `ai: { binding: "AI" }`.')
    }

    // Daily Neuron cap — free-tier safety net
    const cost = NEURONS_PER_CALL['sd-1.5-img2img']
    const reservation = reserveNeurons(cost)
    if (!reservation.ok) {
      throw new Error(
        `Daily AI render limit reached (${reservation.used.toLocaleString()} of 10,000 Neurons used). ` +
          `Resets at midnight UTC. Tip: try again tomorrow or use the manual mode of /vastu-checker.`,
      )
    }

    try {
      const imageBytes = Uint8Array.from(atob(data.image), (c) => c.charCodeAt(0))
      const prompt = buildPrompt(data.mode, data.style)

      const stream = await ai.run('@cf/runwayml/stable-diffusion-v1-5-img2img', {
        prompt,
        negative_prompt: NEGATIVE_PROMPT,
        image: Array.from(imageBytes),
        num_steps: data.quality === 'high' ? 20 : 12,
        strength: data.mode === 'floor-plan-3d' ? 0.85 : 0.75,
        guidance: 8,
      })

      const out = await streamToBase64(stream)
      return { base64: out, usage: getUsage() }
    } catch (err) {
      refundNeurons(cost)
      throw err
    }
  })

async function streamToBase64(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader()
  const chunks: Array<Uint8Array> = []
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
      total += value.length
    }
  }
  const merged = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) {
    merged.set(c, offset)
    offset += c.length
  }
  // Workers runtime supports Buffer via nodejs_compat
  return Buffer.from(merged).toString('base64')
}
