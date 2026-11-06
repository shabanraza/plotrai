/**
 * Rooftop solar cost and PM Surya Ghar subsidy.
 *
 * Subsidy (central financial assistance, residential), from pmsuryaghar.gov.in (checked 6 Nov 2026):
 * - ₹30,000 per kW up to 2 kW
 * - ₹18,000 per kW for additional capacity up to 3 kW
 * - capped at ₹78,000 for systems larger than 3 kW
 * - special category states get 10% more per kW
 *
 * Suggested size by monthly use (same portal): 0–150 units → 1–2 kW, 150–300 → 2–3 kW,
 * above 300 → above 3 kW.
 */

export const CFA_FIRST_2KW_PER_KW = 30000
export const CFA_THIRD_KW_PER_KW = 18000
export const CFA_CAP = 78000
export const SPECIAL_STATE_UPLIFT = 0.1

/** BSES Delhi rooftop solar FAQ: 1 kWp generates 3–4 units a day on average. */
export const DEFAULT_UNITS_PER_KW_PER_DAY = 4
/** Indicative installed price per kW before subsidy (installer range ₹55,000–65,000, 2026). */
export const DEFAULT_COST_PER_KW = 60000
export const DAYS_PER_MONTH = 30

export const SYSTEM_SIZES_KW = [1, 2, 3, 4, 5, 6, 8, 10] as const

export type StateCategory = 'general' | 'special'

/** States and UTs that get the 10% higher subsidy. */
export const SPECIAL_CATEGORY_STATES =
  'North Eastern states including Sikkim, Himachal Pradesh, Uttarakhand, Jammu and Kashmir, Ladakh, Andaman and Nicobar Islands and Lakshadweep'

function positive(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Central subsidy in rupees for a residential system of `kw`. */
export function centralSubsidy(kw: number, category: StateCategory): number {
  const size = positive(kw)
  const base =
    Math.min(size, 2) * CFA_FIRST_2KW_PER_KW +
    Math.min(Math.max(size - 2, 0), 1) * CFA_THIRD_KW_PER_KW
  const uplift = category === 'special' ? 1 + SPECIAL_STATE_UPLIFT : 1
  return Math.round(base * uplift)
}

/** Size that would generate the monthly use, in kW, rounded up to the next 0.5 kW. */
export function sizeForUnits(
  monthlyUnits: number,
  unitsPerKwPerDay = DEFAULT_UNITS_PER_KW_PER_DAY,
): number {
  const perKwMonth = positive(unitsPerKwPerDay) * DAYS_PER_MONTH
  if (!perKwMonth || !positive(monthlyUnits)) return 0
  return Math.ceil((monthlyUnits / perKwMonth) * 2 - 1e-9) / 2
}

/** The portal's suggested band for a monthly use. */
export function portalSizeBand(monthlyUnits: number): string {
  if (monthlyUnits <= 150) return '1–2 kW'
  if (monthlyUnits <= 300) return '2–3 kW'
  return 'above 3 kW'
}

/** A state top-up paid per kW up to a rupee cap, e.g. UPNEDA ₹15,000/kW up to ₹30,000. */
export interface StateSubsidyRule {
  perKw: number
  cap: number
}

export function stateSubsidyFor(kw: number, rule: StateSubsidyRule): number {
  return Math.min(positive(kw) * rule.perKw, rule.cap)
}

export interface SolarInput {
  kw: number
  category: StateCategory
  costPerKw: number
  /** Extra state or discom subsidy in rupees, 0 if none */
  stateSubsidy: number
  monthlyUnits: number
  tariff: number
  unitsPerKwPerDay: number
}

export interface SolarResult {
  grossCost: number
  centralSubsidy: number
  stateSubsidy: number
  netCost: number
  monthlyGeneration: number
  /** Units of your own use the system covers each month */
  unitsOffset: number
  monthlySavings: number
  yearlySavings: number
  /** Years to recover the net cost from savings; null when there are no savings */
  paybackYears: number | null
}

export function calculateSolar(input: SolarInput): SolarResult {
  const kw = positive(input.kw)
  const grossCost = kw * positive(input.costPerKw)
  const central = Math.min(centralSubsidy(kw, input.category), grossCost)
  const state = Math.min(positive(input.stateSubsidy), grossCost - central)
  const netCost = grossCost - central - state
  const monthlyGeneration =
    kw * positive(input.unitsPerKwPerDay) * DAYS_PER_MONTH
  // Only units that replace your own use are valued at your tariff; surplus exported under
  // net metering is settled at a lower rate that differs by state, so it is left out.
  const unitsOffset = Math.min(monthlyGeneration, positive(input.monthlyUnits))
  const monthlySavings = unitsOffset * positive(input.tariff)
  const yearlySavings = monthlySavings * 12
  return {
    grossCost,
    centralSubsidy: central,
    stateSubsidy: state,
    netCost,
    monthlyGeneration,
    unitsOffset,
    monthlySavings,
    yearlySavings,
    paybackYears: yearlySavings > 0 ? netCost / yearlySavings : null,
  }
}

/** ₹ with Indian digit grouping. */
export function formatRupees(n: number): string {
  const v = Number.isFinite(n) ? Math.round(n) : 0
  return `₹${v.toLocaleString('en-IN')}`
}
