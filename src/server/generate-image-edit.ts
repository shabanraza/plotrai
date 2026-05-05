import { createServerFn } from '@tanstack/react-start'
import OpenAI, { toFile } from 'openai'

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
  quality: 'medium' | 'high'
}

export interface GenerateImageEditOutput {
  base64: string
}

const STYLE_DESCRIPTIONS: Record<ImageEditStyle, string> = {
  modern:
    'modern interior with light wood floors, white walls, large windows, contemporary furniture, soft daylight',
  'indian-traditional':
    'Indian traditional interior with warm earth tones, carved wood furniture, brass accents, jute or kilim rugs, soft golden lighting',
  scandinavian:
    'Scandinavian interior with white walls, light oak floors, minimalist furniture, cozy textiles, bright natural light',
  minimal:
    'minimal interior with neutral palette, uncluttered surfaces, simple geometric furniture, even diffused lighting',
  luxury:
    'luxury interior with marble floors, rich materials, statement chandeliers, designer furniture, dramatic warm lighting',
}

function buildPrompt(mode: ImageEditMode, style: ImageEditStyle): string {
  const styleDesc = STYLE_DESCRIPTIONS[style]

  switch (mode) {
    case 'floor-plan-3d':
      return `Convert this 2D top-down floor plan into a photorealistic isometric 3D cutaway architectural render. Preserve every room's position, size, walls, doors, and windows exactly as in the input — do not add or remove rooms. Furnish each room appropriately for its label (bedroom, kitchen, living, etc.). Style: ${styleDesc}. Camera: high isometric angle showing all rooms simultaneously. No text, no labels, no dimension lines, no compass.`
    case 'interior-restyle':
      return `Re-render this interior photo in a new style while keeping the room layout, walls, windows, and major architectural features identical. Replace the furniture, decor, materials, and lighting to match: ${styleDesc}. Photorealistic, magazine-quality interior photography. No text, no watermarks.`
    case 'empty-room-stager':
      return `Furnish this empty room photorealistically. Keep all walls, windows, doors, and architectural features exactly as in the input. Add appropriate furniture, decor, lighting, and accessories matching: ${styleDesc}. The result should look like a professional interior photograph. No text, no watermarks.`
  }
}

export const generateImageEdit = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateImageEditInput) => input)
  .handler(async ({ data }): Promise<GenerateImageEditOutput> => {
    const apiKey = process.env['OPENAI_API_KEY']
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not set. Add it to your .env file to use AI image generation.',
      )
    }

    const client = new OpenAI({ apiKey })
    const prompt = buildPrompt(data.mode, data.style)

    const buffer = Buffer.from(data.image, 'base64')
    const ext = data.mimeType.split('/')[1] ?? 'png'
    const imageFile = await toFile(buffer, `input.${ext}`, { type: data.mimeType })

    const response = (await client.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt,
      size: '1024x1024',
      quality: data.quality === 'high' ? 'high' : 'medium',
      input_fidelity: 'high',
      stream: false,
    } as Parameters<typeof client.images.edit>[0])) as { data?: Array<{ b64_json?: string }> }

    const b64 = response.data?.[0]?.b64_json
    if (!b64) {
      throw new Error('OpenAI returned no image data.')
    }

    return { base64: b64 }
  })
