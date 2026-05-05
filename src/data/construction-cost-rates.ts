/**
 * City × finish-tier base rates for residential construction in India (₹/sq ft built-up).
 * Sourced from Houseyog 2026 averages, contractor quotes, and tier-1 vs tier-2 city benchmarks.
 * Rates exclude land cost. Refresh quarterly.
 */

export type FinishTier = 'basic' | 'standard' | 'premium' | 'luxury'

export interface CityRates {
  basic: number
  standard: number
  premium: number
  luxury: number
}

export const CITY_RATES: Record<string, CityRates> = {
  Mumbai: { basic: 1900, standard: 2400, premium: 3000, luxury: 4200 },
  Delhi: { basic: 1700, standard: 2200, premium: 2800, luxury: 3800 },
  Bangalore: { basic: 1700, standard: 2150, premium: 2750, luxury: 3700 },
  Pune: { basic: 1700, standard: 2150, premium: 2700, luxury: 3600 },
  Chennai: { basic: 1650, standard: 2100, premium: 2700, luxury: 3650 },
  Hyderabad: { basic: 1600, standard: 2050, premium: 2650, luxury: 3550 },
  Kolkata: { basic: 1550, standard: 2000, premium: 2550, luxury: 3450 },
  Ahmedabad: { basic: 1500, standard: 1950, premium: 2500, luxury: 3400 },
  Gurgaon: { basic: 1750, standard: 2250, premium: 2850, luxury: 3850 },
  Noida: { basic: 1700, standard: 2200, premium: 2800, luxury: 3800 },
  Jaipur: { basic: 1450, standard: 1850, premium: 2400, luxury: 3300 },
  Lucknow: { basic: 1400, standard: 1800, premium: 2350, luxury: 3250 },
  Indore: { basic: 1400, standard: 1800, premium: 2300, luxury: 3200 },
  Coimbatore: { basic: 1400, standard: 1800, premium: 2300, luxury: 3200 },
  Kochi: { basic: 1500, standard: 1950, premium: 2500, luxury: 3400 },
  Chandigarh: { basic: 1600, standard: 2050, premium: 2600, luxury: 3500 },
  Bhopal: { basic: 1350, standard: 1750, premium: 2250, luxury: 3150 },
  Patna: { basic: 1350, standard: 1750, premium: 2250, luxury: 3150 },
  Other: { basic: 1450, standard: 1850, premium: 2400, luxury: 3300 },
}

/** Stage-wise % distribution of total cost (sums to 100). */
export interface StageBreakdown {
  key: string
  label: string
  percent: number
  description: string
}

export const STAGES: ReadonlyArray<StageBreakdown> = [
  {
    key: 'site',
    label: 'Site preparation',
    percent: 4,
    description: 'Excavation, levelling, surveying, soil testing.',
  },
  {
    key: 'foundation',
    label: 'Foundation',
    percent: 13,
    description: 'PCC, footings, plinth beams, anti-termite treatment.',
  },
  {
    key: 'structure',
    label: 'Structure (RCC)',
    percent: 22,
    description: 'Columns, beams, slabs, staircase, lintels.',
  },
  {
    key: 'masonry',
    label: 'Masonry + plaster',
    percent: 16,
    description: 'Brickwork, internal/external plaster, cement bands.',
  },
  {
    key: 'mep',
    label: 'Electrical + plumbing',
    percent: 14,
    description: 'Conduits, wiring, fixtures, water tanks, sanitaryware rough-in.',
  },
  {
    key: 'finishing',
    label: 'Flooring + finishing',
    percent: 19,
    description: 'Tiles/marble, doors, windows, kitchen counter, false ceiling.',
  },
  {
    key: 'paint',
    label: 'Paint + handover',
    percent: 12,
    description: 'Primer, paint, final cleanup, light fittings, polishing.',
  },
]

export const CONSTRUCTION_LAST_UPDATED = '2026-Q2'

export const TIER_LABELS: Record<FinishTier, { label: string; helper: string }> = {
  basic: { label: 'Basic', helper: 'Vitrified tiles, standard sanitaryware, basic doors.' },
  standard: { label: 'Standard', helper: 'Mid-range tiles, branded fittings, modular kitchen.' },
  premium: { label: 'Premium', helper: 'Marble flooring, designer fittings, false ceilings.' },
  luxury: { label: 'Luxury', helper: 'Italian marble, imported fixtures, smart-home wiring.' },
}
