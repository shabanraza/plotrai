import { CITY_RATES, type FinishTier } from '#/data/construction-cost-rates'

/**
 * Small helpers that turn CITY_RATES into the rupee figures quoted in prose (FAQs, guides).
 * Kept free of article content so calculator pages can import them without bundling the posts.
 */

export const CITY_NAMES = Object.keys(CITY_RATES).filter((c) => c !== 'Other')

/** Lowest and highest ₹/sq ft across tracked cities for a finish tier. */
export function tierBand(tier: FinishTier) {
  const rates = CITY_NAMES.map((c) => CITY_RATES[c][tier])
  return { min: Math.min(...rates), max: Math.max(...rates) }
}

/** Cities that share the lowest rate for a tier, sorted by name so key order never matters. */
export function lowestRateCities(tier: FinishTier) {
  const { min } = tierBand(tier)
  return CITY_NAMES.filter((c) => CITY_RATES[c][tier] === min).sort((a, b) => a.localeCompare(b))
}

export function lakh(rupees: number) {
  return `₹${(rupees / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })}L`
}

export function rupees(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

/** Compact range, e.g. "₹17.5–24L". */
export function costRange(sqft: number, tier: FinishTier, factor = 1) {
  const { min, max } = tierBand(tier)
  return `${lakh(sqft * min * factor).slice(0, -1)}–${lakh(sqft * max * factor).slice(1)}`
}

export function rateRange(tier: FinishTier) {
  const { min, max } = tierBand(tier)
  return `${rupees(min)}–${rupees(max)}/sq ft`
}
