import type { CityRates } from './construction-cost-rates'

/**
 * InfraLens published construction rates (₹/sq ft, 1,000 sq ft build) from
 * https://infralens.in/prices/{slug}. Every page states "updated 24 October 2026".
 * - The 9 cities that were already on this site and the 14 added on 2026-11-02 were read on
 *   2026-11-02.
 * - Mumbai, Delhi, Chennai, Kochi and Noida were added on 2026-11-21 from the same pages. Basic,
 *   premium and luxury were re-checked on the page that day; the page limits free reads, so the
 *   standard figures come from the research notes for this change.
 *
 * These figures are shown as published. They are not scaled to any other table.
 */
export const INFRALENS_UPDATED = '2026-10-24'

export function infralensUrl(slug: string) {
  return `https://infralens.in/prices/${slug}`
}

export interface InfralensCity {
  city: string
  /** InfraLens URL slug */
  slug: string
  rates: CityRates
  /** Set when the InfraLens page used is not for the city itself */
  note?: string
}

export const INFRALENS_CITIES: ReadonlyArray<InfralensCity> = [
  { city: 'Mumbai', slug: 'mumbai', rates: { basic: 2407, standard: 3086, premium: 4166, luxury: 5709 } },
  { city: 'Delhi', slug: 'delhi', rates: { basic: 1794, standard: 2300, premium: 3105, luxury: 4255 } },
  { city: 'Chennai', slug: 'chennai', rates: { basic: 1933, standard: 2478, premium: 3345, luxury: 4584 } },
  { city: 'Noida', slug: 'noida', rates: { basic: 1794, standard: 2300, premium: 3105, luxury: 4255 } },
  {
    city: 'Ghaziabad',
    slug: 'noida',
    rates: { basic: 1794, standard: 2300, premium: 3105, luxury: 4255 },
    note: 'InfraLens has no Ghaziabad page, so the Noida page (NCR-UP) is used.',
  },
  { city: 'Ahmedabad', slug: 'ahmedabad', rates: { basic: 1795, standard: 2301, premium: 3106, luxury: 4257 } },
  { city: 'Lucknow', slug: 'lucknow', rates: { basic: 1716, standard: 2200, premium: 2970, luxury: 4070 } },
  { city: 'Indore', slug: 'indore', rates: { basic: 1696, standard: 2174, premium: 2935, luxury: 4022 } },
  { city: 'Patna', slug: 'patna', rates: { basic: 1557, standard: 1996, premium: 2695, luxury: 3693 } },
  { city: 'Bhopal', slug: 'bhopal', rates: { basic: 1656, standard: 2123, premium: 2866, luxury: 3928 } },
  { city: 'Jaipur', slug: 'jaipur', rates: { basic: 1755, standard: 2250, premium: 3038, luxury: 4163 } },
  { city: 'Coimbatore', slug: 'coimbatore', rates: { basic: 1774, standard: 2274, premium: 3070, luxury: 4207 } },
  { city: 'Pune', slug: 'pune', rates: { basic: 2011, standard: 2578, premium: 3480, luxury: 4769 } },
  { city: 'Chandigarh', slug: 'chandigarh', rates: { basic: 1854, standard: 2377, premium: 3209, luxury: 4397 } },
  { city: 'Kochi', slug: 'kochi', rates: { basic: 2011, standard: 2578, premium: 3480, luxury: 4769 } },
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

export const INFRALENS_BY_CITY: ReadonlyMap<string, InfralensCity> = new Map(
  INFRALENS_CITIES.map((c) => [c.city, c]),
)
