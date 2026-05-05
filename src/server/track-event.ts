import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'

/**
 * Track a custom event to Cloudflare Workers Analytics Engine.
 *
 * Free tier: 10M events/month per account. Queryable via SQL at
 * dash.cloudflare.com → Analytics Engine, or via the Analytics Engine API.
 *
 * Schema:
 * - blob1: event name (e.g. "vastu_analyzed", "render_generated")
 * - blob2: page path (e.g. "/material-calculator")
 * - blob3: optional metadata (JSON-encoded for flexibility)
 * - double1: optional numeric value (count, amount, score, etc.)
 * - index1: indexed event name (for fast filtering)
 *
 * Falls back to no-op in dev when AE binding is unavailable.
 */
export interface TrackEventInput {
  name: string
  path?: string
  /** Optional structured metadata. Will be JSON-stringified. */
  meta?: Record<string, string | number | boolean | null>
  /** Optional numeric value (e.g. computed cost, count of items). */
  value?: number
}

export const trackEvent = createServerFn({ method: 'POST' })
  .inputValidator((input: TrackEventInput) => {
    if (!input.name || input.name.length > 96) {
      throw new Error('Invalid event name')
    }
    return input
  })
  .handler(async ({ data }) => {
    type AeBinding = {
      writeDataPoint: (point: {
        blobs?: Array<string | undefined>
        doubles?: Array<number>
        indexes?: Array<string>
      }) => void
    }
    const ae = (env as unknown as { PLOTRAI_EVENTS?: AeBinding }).PLOTRAI_EVENTS
    if (!ae) return { ok: false as const, reason: 'binding-missing' }

    try {
      ae.writeDataPoint({
        blobs: [data.name, data.path, data.meta ? JSON.stringify(data.meta) : undefined],
        doubles: typeof data.value === 'number' ? [data.value] : [],
        indexes: [data.name],
      })
      return { ok: true as const }
    } catch (err) {
      console.warn('[ae] writeDataPoint failed', err)
      return { ok: false as const, reason: 'write-failed' }
    }
  })
