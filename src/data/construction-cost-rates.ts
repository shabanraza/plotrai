/**
 * City × finish-tier rates for residential construction in India (₹/sq ft built-up).
 * Rates exclude land cost.
 *
 * Provenance, per city (see CITY_RATE_SOURCES):
 * - Cities in INFRALENS_CITIES use InfraLens published rates exactly as published
 *   (infralens-rates.ts, updated 24 Oct 2026). No scaling is applied.
 * - The remaining cities (BENCHMARK_CITY_RATES) keep our earlier table, which came from
 *   "Houseyog 2026 averages, contractor quotes, and tier-1 vs tier-2 city benchmarks", reviewed
 *   2026-Q2. It has no public source page and has not been re-checked against a dated source.
 */

import {
  INFRALENS_BY_CITY,
  INFRALENS_CITIES,
  INFRALENS_UPDATED,
  infralensUrl,
} from './infralens-rates'

export type FinishTier = 'basic' | 'standard' | 'premium' | 'luxury'

export interface CityRates {
  basic: number
  standard: number
  premium: number
  luxury: number
}

/** Cities InfraLens does not cover. Source: our own benchmark table, reviewed 2026-Q2, which runs lower than InfraLens. */
const BENCHMARK_CITY_RATES: Record<string, CityRates> = {
  Bangalore: { basic: 1700, standard: 2150, premium: 2750, luxury: 3700 },
  'North Bangalore': {
    basic: 1650,
    standard: 2050,
    premium: 2650,
    luxury: 3550,
  },
  Hyderabad: { basic: 1600, standard: 2050, premium: 2650, luxury: 3550 },
  Kolkata: { basic: 1550, standard: 2000, premium: 2550, luxury: 3450 },
  Gurgaon: { basic: 1750, standard: 2250, premium: 2850, luxury: 3850 },
  Kanpur: { basic: 1350, standard: 1750, premium: 2250, luxury: 3150 },
}

/** Names of the cities whose rates are InfraLens figures. */
export const INFRALENS_CITY_NAMES: ReadonlyArray<string> = INFRALENS_CITIES.map((c) => c.city)

export const CITY_RATES: Record<string, CityRates> = {
  ...BENCHMARK_CITY_RATES,
  ...Object.fromEntries(INFRALENS_CITIES.map(({ city, rates }) => [city, rates])),
  Other: { basic: 1450, standard: 1850, premium: 2400, luxury: 3300 },
}

export interface RateSource {
  label: string
  /** Omitted when the source has no public page */
  url?: string
  /** ISO date the source figures were published, or a quarter when only that is known */
  asOf: string
  /** True when the rates were published by a third party and are shown as published */
  published: boolean
  note?: string
}

const BENCHMARK_SOURCE: RateSource = {
  label:
    'Plotr Ai benchmark table (Houseyog 2026 averages and contractor quotes); no public source page',
  asOf: '2026-Q2',
  published: false,
}

/** True when a city's rates come from our own 2026-Q2 benchmark table, not InfraLens. */
export function isBenchmarkCity(city: string) {
  return !INFRALENS_BY_CITY.has(city)
}

export const BENCHMARK_RATE_NOTE =
  "This city's rates come from our own 2026-Q2 benchmark table, which runs lower than the InfraLens figures used for most other cities. Treat it as a lower bound."

/** Where a city's displayed rates come from, with the date of that source. */
export function getRateSource(city: string): RateSource {
  const infralens = INFRALENS_BY_CITY.get(city)
  if (!infralens) return BENCHMARK_SOURCE
  return {
    label: `InfraLens construction rates for ${infralens.city}`,
    url: infralensUrl(infralens.slug),
    asOf: INFRALENS_UPDATED,
    published: true,
    note: infralens.note,
  }
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
    description:
      'Conduits, wiring, fixtures, water tanks, sanitaryware rough-in.',
  },
  {
    key: 'finishing',
    label: 'Flooring + finishing',
    percent: 19,
    description:
      'Tiles/marble, doors, windows, kitchen counter, false ceiling.',
  },
  {
    key: 'paint',
    label: 'Paint + handover',
    percent: 12,
    description: 'Primer, paint, final cleanup, light fittings, polishing.',
  },
]

/** Share of a single-storey build that is not repeated for each extra floor (site + foundation). */
export const GROUND_ONLY_PERCENT = STAGES.filter((s) =>
  ['site', 'foundation'].includes(s.key),
).reduce((sum, s) => sum + s.percent, 0)

/** Date this table was last checked against its sources (ISO). Per-city source dates are in getRateSource. */
export const CONSTRUCTION_LAST_UPDATED = '2026-11-21'

export const CONSTRUCTION_ESTIMATE_NOTE =
  'Construction rates are planning benchmarks. Final quotes vary by soil, structure, specification, contractor margin, approval scope, and local material prices.'

export const TIER_LABELS: Record<
  FinishTier,
  { label: string; helper: string }
> = {
  basic: {
    label: 'Basic',
    helper: 'Vitrified tiles, standard sanitaryware, basic doors.',
  },
  standard: {
    label: 'Standard',
    helper: 'Mid-range tiles and branded fittings. Modular kitchen not included.',
  },
  premium: {
    label: 'Premium',
    helper: 'Marble flooring, designer fittings, false ceilings.',
  },
  luxury: {
    label: 'Luxury',
    helper: 'Italian marble, imported fixtures, smart-home wiring.',
  },
}
