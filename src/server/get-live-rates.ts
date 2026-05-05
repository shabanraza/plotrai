import { createServerFn } from '@tanstack/react-start'
import { MATERIAL_RATES, RATES_LAST_UPDATED } from '#/data/material-rates'

/**
 * Live material rates fetcher.
 *
 * Strategy:
 * 1. On first call (or after cache TTL), scrape Houseyog's monthly cement-price article
 *    (https://www.houseyog.com/blog/cement-price-today-india-cost-per-sq-ft/).
 *    Cement is the most volatile material — sand/aggregate/brick/steel change less,
 *    so we keep them at hardcoded baselines unless we find values in the same source.
 * 2. Cache the result in-memory for 24 hours.
 * 3. On any error (page layout change, network blip, content not found), fall back
 *    to the static JSON in src/data/material-rates.ts. The user can always override
 *    rates per-project on the calculator page.
 *
 * Why not government API: India has no real-time public price API for construction
 * materials. data.gov.in's WPI data is monthly index numbers, not actual ₹/bag prices.
 * This Houseyog scrape is the most reliable freely-available source updated monthly.
 */

export interface LiveRates {
  cement: number
  sand: number
  aggregate: number
  bricks: number
  steel: number
  source: string
  sourceUrl?: string
  fetchedAt: string
  isLive: boolean
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000

let cache: { data: LiveRates; expiresAt: number } | null = null

const FALLBACK: LiveRates = {
  cement: MATERIAL_RATES.cement.value,
  sand: MATERIAL_RATES.sand.value,
  aggregate: MATERIAL_RATES.aggregate.value,
  bricks: MATERIAL_RATES.bricks.value,
  steel: MATERIAL_RATES.steel.value,
  source: `PlotRAI baseline (${RATES_LAST_UPDATED})`,
  fetchedAt: new Date().toISOString(),
  isLive: false,
}

const HOUSEYOG_CEMENT_URL =
  'https://www.houseyog.com/blog/cement-price-today-india-cost-per-sq-ft/'
const HOUSEYOG_STEEL_URL =
  'https://www.houseyog.com/blog/steel-price-today-india-tmt-bar-rate/'

export const getLiveRates = createServerFn({ method: 'GET' }).handler(async (): Promise<LiveRates> => {
  if (cache && cache.expiresAt > Date.now()) return cache.data

  try {
    const live = await scrapeRates()
    cache = { data: live, expiresAt: Date.now() + CACHE_TTL_MS }
    return live
  } catch (err) {
    console.warn('[live-rates] scrape failed, using fallback:', err instanceof Error ? err.message : err)
    return FALLBACK
  }
})

async function scrapeRates(): Promise<LiveRates> {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml',
  }

  const [cementHtml, steelHtml] = await Promise.allSettled([
    fetch(HOUSEYOG_CEMENT_URL, { headers, signal: AbortSignal.timeout(8000) }).then((r) =>
      r.ok ? r.text() : Promise.reject(new Error(`cement fetch ${r.status}`)),
    ),
    fetch(HOUSEYOG_STEEL_URL, { headers, signal: AbortSignal.timeout(8000) }).then((r) =>
      r.ok ? r.text() : Promise.reject(new Error(`steel fetch ${r.status}`)),
    ),
  ])

  const cement =
    cementHtml.status === 'fulfilled'
      ? extractMedianPrice(cementHtml.value, [300, 500])
      : null
  const steel =
    steelHtml.status === 'fulfilled'
      ? extractMedianPrice(steelHtml.value, [55, 100])
      : null

  if (cement === null && steel === null) {
    throw new Error('No prices extracted from any source')
  }

  return {
    cement: cement ?? FALLBACK.cement,
    sand: FALLBACK.sand,
    aggregate: FALLBACK.aggregate,
    bricks: FALLBACK.bricks,
    steel: steel ?? FALLBACK.steel,
    source: 'Houseyog · houseyog.com',
    sourceUrl: HOUSEYOG_CEMENT_URL,
    fetchedAt: new Date().toISOString(),
    isLive: true,
  }
}

/**
 * Extracts a sensible price from messy HTML by finding all "₹NNN" or "Rs. NNN" patterns
 * within the plausible range and returning the median. Range guards against false matches
 * (e.g. ad copy, social-share counts).
 */
function extractMedianPrice(html: string, [min, max]: [number, number]): number | null {
  const matches = [...html.matchAll(/(?:₹|Rs\.?|INR)\s*(\d{2,4})/gi)]
  const prices = matches
    .map((m) => parseInt(m[1]!, 10))
    .filter((p) => Number.isFinite(p) && p >= min && p <= max)

  if (prices.length === 0) return null

  prices.sort((a, b) => a - b)
  const mid = Math.floor(prices.length / 2)
  const median = prices.length % 2 === 0 ? (prices[mid - 1]! + prices[mid]!) / 2 : prices[mid]!
  return Math.round(median)
}
