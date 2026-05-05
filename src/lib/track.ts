import { trackEvent, type TrackEventInput } from '#/server/track-event'

/**
 * Fire-and-forget client-side event tracker.
 *
 * Sends to Cloudflare Workers Analytics Engine via a server function.
 * Errors are swallowed — tracking should never break the user experience.
 *
 * Usage:
 *   track('vastu_analyzed', { rooms: '6', score: 78 })
 *   track('render_generated', { tool: 'floor-plan-3d', style: 'modern' })
 */
export function track(
  name: TrackEventInput['name'],
  meta?: TrackEventInput['meta'],
  value?: TrackEventInput['value'],
) {
  if (typeof window === 'undefined') return
  const path = window.location.pathname

  void trackEvent({
    data: { name, path, meta, value },
  }).catch(() => {
    // intentional no-op
  })
}
