import { createServerFn } from '@tanstack/react-start'
import Anthropic from '@anthropic-ai/sdk'

export interface FloorPlanAnalysis {
  rooms: Array<{
    type: string
    zone: string
    isMainEntrance: boolean
  }>
  plot?: {
    length?: number
    width?: number
    facing?: string
  }
}
console.log(process.env)
export const analyzeFloorPlan = createServerFn({ method: 'POST' })
  .inputValidator((input: { image: string; mimeType: string }) => input)
  .handler(async ({ data }) => {
    const { image, mimeType } = data

    const apiKey = process.env['ANTHROPIC_API_KEY']
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY is not set. Add it to your .env file to use floor plan analysis.',
      )
    }

    const client = new Anthropic({ apiKey })

    const prompt = `Analyze this floor plan image. Extract the following information as JSON:

1. rooms: Array of rooms visible in the plan. For each room:
   - type: one of [master_bedroom, bedroom, kids_bedroom, guest_bedroom, kitchen, dining, living, drawing, puja, study, store, toilet, bathroom, parking, servant_quarter, balcony, staircase, entrance]
   - zone: the Vastu zone based on the room's position in the plan (N, NE, E, SE, S, SW, W, NW, CENTER). Determine this by the room's position relative to the center of the plan. Assume North is at the top of the image unless the plan indicates otherwise.
   - isMainEntrance: true only for the main entrance door

2. plot (if dimensions are visible):
   - length: number (in feet)
   - width: number (in feet)
   - facing: the direction the main entrance faces (N, NE, E, SE, S, SW, W, NW)

Return ONLY valid JSON, no markdown fences or explanation.`

    const mediaType = mimeType as
      | 'image/png'
      | 'image/jpeg'
      | 'image/webp'
      | 'image/gif'

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    let jsonText = textBlock.text.trim()
    // Strip markdown code fences if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText
        .replace(/^```(?:json)?\n?/, '')
        .replace(/\n?```$/, '')
    }

    const analysis: FloorPlanAnalysis = JSON.parse(jsonText)
    return analysis
  })
