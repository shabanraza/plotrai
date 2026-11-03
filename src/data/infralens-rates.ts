import type { CityRates } from './construction-cost-rates'

/**
 * InfraLens published construction rates (₹/sq ft, 1,000 sq ft build), read 2026-11-02 from
 * https://infralens.in/prices/{slug} — all pages state "updated 24 October 2026".
 *
 * Used two ways:
 * - CALIBRATION: cities already in CITY_RATES, to measure how InfraLens compares with our table.
 * - NEW_CITIES: cities we add by scaling InfraLens with that calibration, so new cities sit on
 *   the same scale as the existing ones (InfraLens runs ~15–20% above our table).
 */
export const INFRALENS_UPDATED = '2026-10-24'

export function infralensUrl(slug: string) {
  return `https://infralens.in/prices/${slug}`
}

/** Existing CITY_RATES city → InfraLens rates. */
export const INFRALENS_CALIBRATION: Record<string, CityRates> = {
  Indore: { basic: 1696, standard: 2174, premium: 2935, luxury: 4022 },
  Ahmedabad: { basic: 1795, standard: 2301, premium: 3106, luxury: 4257 },
  Lucknow: { basic: 1716, standard: 2200, premium: 2970, luxury: 4070 },
  Patna: { basic: 1557, standard: 1996, premium: 2695, luxury: 3693 },
  Bhopal: { basic: 1656, standard: 2123, premium: 2866, luxury: 3928 },
  Jaipur: { basic: 1755, standard: 2250, premium: 3038, luxury: 4163 },
  Coimbatore: { basic: 1774, standard: 2274, premium: 3070, luxury: 4207 },
  Pune: { basic: 2011, standard: 2578, premium: 3480, luxury: 4769 },
  Chandigarh: { basic: 1854, standard: 2377, premium: 3209, luxury: 4397 },
}

export interface InfralensCity {
  city: string
  /** InfraLens URL slug */
  slug: string
  rates: CityRates
}

export const INFRALENS_NEW_CITIES: ReadonlyArray<InfralensCity> = [
  { city: 'Nagpur', slug: 'nagpur', rates: { basic: 1734, standard: 2223, premium: 3001, luxury: 4113 } },
  { city: 'Surat', slug: 'surat', rates: { basic: 1795, standard: 2301, premium: 3106, luxury: 4257 } },
  { city: 'Vadodara', slug: 'vadodara', rates: { basic: 1755, standard: 2250, premium: 3038, luxury: 4163 } },
  { city: 'Nashik', slug: 'nashik', rates: { basic: 1696, standard: 2174, premium: 2935, luxury: 4022 } },
  { city: 'Visakhapatnam', slug: 'vizag', rates: { basic: 1755, standard: 2250, premium: 3038, luxury: 4163 } },
  { city: 'Mysore', slug: 'mysore', rates: { basic: 1774, standard: 2274, premium: 3070, luxury: 4207 } },
  { city: 'Ranchi', slug: 'ranchi', rates: { basic: 1617, standard: 2073, premium: 2799, luxury: 3835 } },
  { city: 'Dehradun', slug: 'dehradun', rates: { basic: 1795, standard: 2301, premium: 3106, luxury: 4257 } },
  { city: 'Raipur', slug: 'raipur', rates: { basic: 1617, standard: 2073, premium: 2799, luxury: 3835 } },
  { city: 'Bhubaneswar', slug: 'bhubaneswar', rates: { basic: 1656, standard: 2123, premium: 2866, luxury: 3928 } },
  { city: 'Ludhiana', slug: 'ludhiana', rates: { basic: 1716, standard: 2200, premium: 2970, luxury: 4070 } },
  { city: 'Agra', slug: 'agra', rates: { basic: 1656, standard: 2123, premium: 2866, luxury: 3928 } },
  { city: 'Varanasi', slug: 'varanasi', rates: { basic: 1617, standard: 2073, premium: 2799, luxury: 3835 } },
  { city: 'Madurai', slug: 'madurai', rates: { basic: 1656, standard: 2123, premium: 2866, luxury: 3928 } },
]
