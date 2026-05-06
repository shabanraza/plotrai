/**
 * In-memory daily compute-quota cap for AI image calls.
 *
 * To keep the platform free we apply a daily ceiling on AI generations.
 * When the cap is reached, server functions throw a friendly "limit
 * reached" error and the user can retry tomorrow.
 *
 * NOTE: counter is per-Worker-isolate. Multiple isolates each have their
 * own counter, so the practical cap is N × the value below where N is the
 * number of warm isolates. Acceptable for a small-traffic free tool.
 */

const usage = new Map<string, number>()
export const DAILY_QUOTA_CAP = 10_000

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getUsage(): { date: string; used: number; remaining: number; cap: number } {
  const date = todayKey()
  const used = usage.get(date) ?? 0
  return { date, used, remaining: Math.max(0, DAILY_QUOTA_CAP - used), cap: DAILY_QUOTA_CAP }
}

/**
 * Reserve a chunk of quota before making an AI call. Returns true on success.
 * If reservation fails, the caller must abort and surface the error to the UI.
 */
export function reserveQuota(units: number): {
  ok: boolean
  used: number
  remaining: number
} {
  const key = todayKey()
  const used = usage.get(key) ?? 0
  if (used + units > DAILY_QUOTA_CAP) {
    return { ok: false, used, remaining: Math.max(0, DAILY_QUOTA_CAP - used) }
  }
  usage.set(key, used + units)
  return { ok: true, used: used + units, remaining: DAILY_QUOTA_CAP - (used + units) }
}

/** Refund a reservation when the AI call fails. */
export function refundQuota(units: number): void {
  const key = todayKey()
  const used = usage.get(key) ?? 0
  usage.set(key, Math.max(0, used - units))
}

/**
 * Estimated quota cost per call by model.
 */
export const QUOTA_PER_CALL = {
  'sd-1.5-img2img': 1500,
  'llama-3.1-8b': 100,
} as const
