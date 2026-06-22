import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import {
  reserveQuota,
  refundQuota,
  QUOTA_PER_CALL,
  getUsage,
  reserveUserRender,
  refundUserRender,
} from './neuron-cap'
import {
  getRenderDb,
  getRequestIp,
  logRenderEvent,
  refundAnonymousCredit,
  refundSignedInCredit,
  reserveAnonymousCredit,
  reserveSignedInCredit,
  type RenderCreditAccount,
  type RenderReservation,
} from './render-credits'

/**
 * AI image rendering for Plotr Ai's three visual tools:
 * - /floor-plan-3d (2D plan → isometric 3D render)
 * - /interior-restyle (room photo → re-styled)
 * - /empty-room-stager (empty room → furnished)
 */

export type ImageEditMode =
  | 'floor-plan-3d'
  | 'interior-restyle'
  | 'empty-room-stager'

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
  sessionToken?: string
}

export interface GenerateImageEditOutput {
  base64: string
  usage: ReturnType<typeof getUsage>
  account: RenderCreditAccount
  provider: 'openrouter'
  model: string
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
      return `Use the uploaded 2D architectural floor plan as the reference. Generate one clean isometric 3D cutaway interior concept render. Preserve the room layout, wall positions, openings, and relative room sizes as much as possible. Add realistic residential furniture and finishes in this style: ${styleDesc}. No text, no labels, no dimensions, no watermark.`
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
  .handler(async (ctx): Promise<GenerateImageEditOutput> => {
    const { data } = ctx
    const request =
      'request' in ctx ? (ctx.request as Request | undefined) : undefined
    const db = getRenderDb(env)
    const reservation = await reserveRenderCredit({
      db,
      request,
      sessionToken: data.sessionToken,
    })

    const cfEnv = env as unknown as {
      OPENROUTER_API_KEY?: string
      OPENROUTER_IMAGE_MODEL?: string
      SERVER_URL?: string
    }
    const apiKey = cfEnv.OPENROUTER_API_KEY ?? process.env['OPENROUTER_API_KEY']
    if (!apiKey) {
      await refundRenderCredit(db, reservation)
      throw new Error(
        'Image generation is not configured yet. Add OPENROUTER_API_KEY.',
      )
    }

    const model =
      cfEnv.OPENROUTER_IMAGE_MODEL ??
      process.env['OPENROUTER_IMAGE_MODEL'] ??
      'google/gemini-2.5-flash-image'

    const cost = QUOTA_PER_CALL['openrouter-image']
    const siteReservation = reserveQuota(cost)
    if (!siteReservation.ok) {
      await refundRenderCredit(db, reservation)
      throw new Error(
        'Daily AI render limit reached. Try again tomorrow, or use the manual mode of /vastu-checker.',
      )
    }

    try {
      const prompt = buildPrompt(data.mode, data.style)
      const imageUrl = await generateWithOpenRouter({
        apiKey,
        model,
        prompt,
        imageDataUrl: `data:${data.mimeType};base64,${data.image}`,
        quality: data.quality,
        siteUrl: cfEnv.SERVER_URL ?? 'https://plotrai.in',
      })
      await logRenderEvent(db, {
        userId: reservation.userId,
        ipHash: reservation.ipHash,
        tool: data.mode,
        model,
        status: 'success',
      })
      return {
        base64: stripDataUrl(imageUrl),
        usage: getUsage(),
        account: reservation.account ?? {
          signedIn: false,
          creditsRemaining: 0,
        },
        provider: 'openrouter',
        model,
      }
    } catch (err) {
      refundQuota(cost)
      await refundRenderCredit(db, reservation)
      await logRenderEvent(db, {
        userId: reservation.userId,
        ipHash: reservation.ipHash,
        tool: data.mode,
        model,
        status: 'failed',
      })
      throw err
    }
  })

async function reserveRenderCredit({
  db,
  request,
  sessionToken,
}: {
  db: ReturnType<typeof getRenderDb>
  request: Request | undefined
  sessionToken: string | undefined
}): Promise<RenderReservation> {
  if (db && sessionToken) {
    const signedInReservation = await reserveSignedInCredit(db, sessionToken)
    if (signedInReservation) return signedInReservation
  }

  if (db) {
    return reserveAnonymousCredit(db, getRequestIp(request))
  }

  const userKey = `ip:${getRequestIp(request)}`
  const memoryReservation = reserveUserRender(userKey)
  if (!memoryReservation.ok) {
    throw new Error(
      'Your free render is used for today. Sign up to get 3 more free credits.',
    )
  }
  return { kind: 'memory', memoryKey: userKey }
}

async function refundRenderCredit(
  db: ReturnType<typeof getRenderDb>,
  reservation: RenderReservation,
): Promise<void> {
  if (reservation.kind === 'user' && db && reservation.userId) {
    await refundSignedInCredit(db, reservation.userId)
    return
  }
  if (reservation.kind === 'anonymous' && db && reservation.ipHash) {
    await refundAnonymousCredit(db, reservation.ipHash)
    return
  }
  if (reservation.kind === 'memory') {
    refundUserRender(reservation.memoryKey ?? 'ip:anonymous')
  }
}

async function generateWithOpenRouter({
  apiKey,
  model,
  prompt,
  imageDataUrl,
  quality,
  siteUrl,
}: {
  apiKey: string
  model: string
  prompt: string
  imageDataUrl: string
  quality: GenerateImageEditInput['quality']
  siteUrl: string
}): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-Title': 'Plotr Ai',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${prompt}\n\nNegative prompt: ${NEGATIVE_PROMPT}`,
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      modalities: ['image', 'text'],
      stream: false,
      image_config: {
        aspect_ratio: '1:1',
        image_size: quality === 'high' ? '2K' : '1K',
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OpenRouter image generation failed: ${res.status} ${body}`)
  }

  const json = (await res.json()) as {
    choices?: Array<{
      message?: {
        images?: Array<{
          image_url?: { url?: string }
          imageUrl?: { url?: string }
        }>
      }
    }>
  }
  const firstImage = json.choices?.[0]?.message?.images?.[0]
  const url = firstImage?.image_url?.url ?? firstImage?.imageUrl?.url
  if (!url) {
    throw new Error(
      'OpenRouter returned no image. Check that the selected model supports image output.',
    )
  }
  return url
}

function stripDataUrl(dataUrl: string): string {
  const comma = dataUrl.indexOf(',')
  return comma === -1 ? dataUrl : dataUrl.slice(comma + 1)
}
