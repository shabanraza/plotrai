/**
 * Circle (minimum) rates for property registration.
 *
 * Delhi: residential land and construction rates per sq m for colony categories A–H, from the
 * 4th revision of minimum circle rates notified 23 Sept 2014 by the Delhi Revenue Department.
 * Still in force as of Nov 2026 — a 2025 review proposed revisions (and an "A+" category) but
 * nothing has been notified. Figures cross-checked against two independent published tables.
 *
 * Gurgaon, Noida and Ghaziabad are not included: no official notification was reachable and
 * secondary sources conflict (checked 2026-11-02).
 */

export type DelhiCategory = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

export interface CategoryRate {
  category: DelhiCategory
  /** Land rate, ₹ per sq m */
  land: number
  /** Residential construction cost, ₹ per sq m of built-up area */
  construction: number
  /** Example colonies, where a published source lists them */
  examples?: ReadonlyArray<string>
}

export const DELHI_CIRCLE_RATES: ReadonlyArray<CategoryRate> = [
  {
    category: 'A',
    land: 774000,
    construction: 21960,
    examples: ['Golf Links', 'Shanti Niketan', 'Sunder Nagar', 'Vasant Vihar', 'Anand Niketan', 'Maharani Bagh', 'Panchsheel Park', 'New Friends Colony'],
  },
  {
    category: 'B',
    land: 245520,
    construction: 17400,
    examples: ['Anand Lok', 'Defence Colony', 'Nizamuddin East', 'Gulmohar Park', 'Green Park', 'Greater Kailash I', 'Greater Kailash II', 'Hauz Khas', 'Safdarjung Enclave'],
  },
  { category: 'C', land: 159840, construction: 13920 },
  { category: 'D', land: 127680, construction: 11160 },
  { category: 'E', land: 70080, construction: 9360 },
  { category: 'F', land: 56640, construction: 8220 },
  { category: 'G', land: 46200, construction: 6960 },
  { category: 'H', land: 23280, construction: 3480 },
]

export const DELHI_CIRCLE_RATE_NOTIFIED = '23 September 2014'
export const CIRCLE_RATES_CHECKED = '2026-11-02'

export const DELHI_CIRCLE_RATE_SOURCES = [
  {
    label: 'South Delhi Floors — Delhi circle rates (checked Jul 2026)',
    url: 'https://www.southdelhifloors.com/updated-current-circle-rates-delhi-real-estate-properties/',
  },
  {
    label: 'Prateek Properties — Delhi circle rate list (checked Aug 2026)',
    url: 'https://prateekproperties.com/circle-rate-in-delhi',
  },
] as const

export const SQ_M_PER_SQ_YD = 0.83612736
