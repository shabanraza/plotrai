/**
 * In-memory daily Neuron-usage cap for Cloudflare Workers AI calls.
 *
 * Free tier on Workers AI gives 10,000 Neurons / day to start, then bills
 * at $0.011 / 1k Neurons (~$11 per million). To guarantee zero spend
 * for a free product, we cap daily usage at 10,000 Neurons across all
 * tools. When the cap is reached, server functions throw a friendly
 * "limit reached" error and the user can retry tomorrow (or use an
 * alternate path — e.g. CF AI fallback for chat).
 *
 * IMPORTANT: this is per-Worker-isolate. Multiple isolates can each have
 * their own counter, so the practical cap is N × 10k Neurons across the
 * day where N is the number of warm isolates. For a small-traffic free
 * tool this is acceptable. Upgrade to KV-backed tracking if needed.
 */

const usage = new Map<string, number>()
export const DAILY_NEURON_CAP = 10_000

function todayKey(): string {
  // YYYY-MM-DD in UTC. Cloudflare bills on UTC days.
  return new Date().toISOString().slice(0, 10)
}

export function getUsage(): { date: string; used: number; remaining: number; cap: number } {
  const date = todayKey()
  const used = usage.get(date) ?? 0
  return { date, used, remaining: Math.max(0, DAILY_NEURON_CAP - used), cap: DAILY_NEURON_CAP }
}

/**
 * Reserve a chunk of Neurons before making an AI call. Returns true on success.
 * If reservation fails, the caller must abort and surface the error to the UI.
 */
export function reserveNeurons(neurons: number): {
  ok: boolean
  used: number
  remaining: number
} {
  const key = todayKey()
  const used = usage.get(key) ?? 0
  if (used + neurons > DAILY_NEURON_CAP) {
    return { ok: false, used, remaining: Math.max(0, DAILY_NEURON_CAP - used) }
  }
  usage.set(key, used + neurons)
  return { ok: true, used: used + neurons, remaining: DAILY_NEURON_CAP - (used + neurons) }
}

/** Refund a reservation when the AI call fails. */
export function refundNeurons(neurons: number): void {
  const key = todayKey()
  const used = usage.get(key) ?? 0
  usage.set(key, Math.max(0, used - neurons))
}

/**
 * Estimated Neurons per call by model. Cloudflare doesn't return exact
 * usage in the response, so these are conservative estimates from the
 * pricing table. Refresh if Cloudflare publishes per-call telemetry.
 */
export const NEURONS_PER_CALL = {
  /** Stable Diffusion 1.5 img2img — ~1.5k per 512×512 generation at 20 steps. */
  'sd-1.5-img2img': 1500,
  /** Llama 3.1 8B instruct — ~50-100 per typical chat reply. */
  'llama-3.1-8b': 100,
} as const
