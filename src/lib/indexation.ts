import { CII, FY_LIST } from '#/data/cii'

export interface IndexationInput {
  purchasePrice: number
  salePrice: number
  purchaseCii: number
  saleCii: number
}

export interface IndexationResult {
  indexedCost: number
  indexedGain: number
  flatGain: number
  taxAt20Percent: number
}

export function calculateIndexation(input: IndexationInput): IndexationResult {
  const purchasePrice = positive(input.purchasePrice)
  const salePrice = positive(input.salePrice)
  const purchaseCii = positive(input.purchaseCii) || 100
  const saleCii = positive(input.saleCii) || purchaseCii
  const indexedCost = purchasePrice * (saleCii / purchaseCii)
  const indexedGain = Math.max(salePrice - indexedCost, 0)
  const flatGain = Math.max(salePrice - purchasePrice, 0)

  return {
    indexedCost,
    indexedGain,
    flatGain,
    taxAt20Percent: indexedGain * 0.2,
  }
}

/** Sales on or after this date: 12.5% without indexation (grandfathering for older purchases). */
export const GRANDFATHER_DATE = '2024-07-23'
export const LTCG_FLAT_RATE = 0.125
export const LTCG_INDEXED_RATE = 0.2
export const CESS_RATE = 0.04
/** s.85 (old 54EC): maximum investment in bonds. */
export const S85_CAP = 5_000_000
/** s.82 (old 54): new house cost above this is ignored. */
export const S82_CAP = 100_000_000

export interface PropertyCapitalGainsInput {
  /** ISO date, YYYY-MM-DD */
  purchaseDate: string
  /** ISO date, YYYY-MM-DD */
  saleDate: string
  purchasePrice: number
  salePrice: number
  improvementCost?: number
  /** ISO date; defaults to the purchase date when omitted */
  improvementDate?: string
  transferExpenses?: number
  residency: 'resident' | 'nri'
  slabRatePercent: number
  reinvestSection?: '82' | '85'
  reinvestAmount?: number
}

export interface PropertyCapitalGainsResult {
  purchaseCii: number
  saleCii: number
  improvementCii: number
  isLongTerm: boolean
  flatAvailable: boolean
  indexedAvailable: boolean
  flatGain: number
  indexedCost: number
  indexedImprovement: number
  indexedGain: number
  /** Gain left after any s.82 / s.85 exemption, per option */
  flatTaxableGain: number
  indexedTaxableGain: number
  exemptionClaimed: number
  flatTaxBeforeCess: number
  flatTaxTotal: number
  indexedTaxBeforeCess: number
  indexedTaxTotal: number
  stcg: number
  stcgRate: number
  recommended: 'flat' | 'indexed' | 'short'
  taxBeforeCess: number
  cess: number
  totalTax: number
}

export function financialYearOf(isoDate: string): string {
  const d = parseIsoDate(isoDate)
  if (!d) return ''
  const year =
    d.getUTCMonth() >= 3 ? d.getUTCFullYear() : d.getUTCFullYear() - 1
  return `${year}-${String((year + 1) % 100).padStart(2, '0')}`
}

/** CII for the FY a date falls in; 100 before 2001-02, latest known after the table ends. */
export function ciiForDate(isoDate: string): number {
  const fy = financialYearOf(isoDate)
  if (!fy) return 100
  const known = CII[fy]
  if (known) return known
  const start = Number.parseInt(fy.slice(0, 4), 10)
  const firstStart = Number.parseInt(FY_LIST[0] ?? '2001', 10)
  if (start < firstStart) return CII[FY_LIST[0] ?? ''] ?? 100
  return CII[FY_LIST[FY_LIST.length - 1] ?? ''] ?? 100
}

/** Long-term means held MORE than 24 months; exactly 24 months is short-term. */
export function isLongTermHolding(purchaseDate: string, saleDate: string) {
  const p = parseIsoDate(purchaseDate)
  const s = parseIsoDate(saleDate)
  if (!p || !s) return false
  const day = p.getUTCDate()
  const threshold = new Date(
    Date.UTC(p.getUTCFullYear(), p.getUTCMonth() + 24, 1),
  )
  const lastDay = new Date(
    Date.UTC(threshold.getUTCFullYear(), threshold.getUTCMonth() + 1, 0),
  ).getUTCDate()
  threshold.setUTCDate(Math.min(day, lastDay))
  return s.getTime() > threshold.getTime()
}

export function calculatePropertyCapitalGains(
  input: PropertyCapitalGainsInput,
): PropertyCapitalGainsResult {
  const purchasePrice = positive(input.purchasePrice)
  const salePrice = positive(input.salePrice)
  const improvement = positive(input.improvementCost ?? 0)
  const expenses = positive(input.transferExpenses ?? 0)
  const improvementDate = input.improvementDate || input.purchaseDate

  const purchaseCii = ciiForDate(input.purchaseDate)
  const saleCii = ciiForDate(input.saleDate)
  const improvementCii = ciiForDate(improvementDate)

  const isLongTerm = isLongTermHolding(input.purchaseDate, input.saleDate)
  const saleOnOrAfter = input.saleDate >= GRANDFATHER_DATE
  const grandfathered =
    input.residency === 'resident' &&
    input.purchaseDate < GRANDFATHER_DATE &&
    saleOnOrAfter
  const flatAvailable = saleOnOrAfter
  const indexedAvailable = !saleOnOrAfter || grandfathered

  const net = salePrice - expenses
  const flatGain = Math.max(net - purchasePrice - improvement, 0)
  const indexedCost = purchasePrice * (saleCii / purchaseCii)
  const indexedImprovement = improvement * (saleCii / improvementCii)
  const indexedGain = Math.max(net - indexedCost - indexedImprovement, 0)

  const reinvest = positive(input.reinvestAmount ?? 0)
  const eligibleReinvest = !isLongTerm
    ? 0
    : input.reinvestSection === '85'
      ? Math.min(reinvest, S85_CAP)
      : input.reinvestSection === '82'
        ? Math.min(reinvest, S82_CAP)
        : 0

  const flatTaxableGain = Math.max(flatGain - eligibleReinvest, 0)
  const indexedTaxableGain = Math.max(indexedGain - eligibleReinvest, 0)
  const flatTaxBeforeCess = flatTaxableGain * LTCG_FLAT_RATE
  const indexedTaxBeforeCess = indexedTaxableGain * LTCG_INDEXED_RATE

  const stcgRate = percent(input.slabRatePercent)
  const stcg = flatGain * stcgRate

  let recommended: PropertyCapitalGainsResult['recommended']
  let taxBeforeCess: number
  let exemptionClaimed: number
  if (!isLongTerm) {
    recommended = 'short'
    taxBeforeCess = stcg
    exemptionClaimed = 0
  } else if (
    indexedAvailable &&
    (!flatAvailable || indexedTaxBeforeCess < flatTaxBeforeCess)
  ) {
    recommended = 'indexed'
    taxBeforeCess = indexedTaxBeforeCess
    exemptionClaimed = Math.min(indexedGain, eligibleReinvest)
  } else {
    recommended = 'flat'
    taxBeforeCess = flatTaxBeforeCess
    exemptionClaimed = Math.min(flatGain, eligibleReinvest)
  }
  const cess = taxBeforeCess * CESS_RATE

  return {
    purchaseCii,
    saleCii,
    improvementCii,
    isLongTerm,
    flatAvailable,
    indexedAvailable,
    flatGain,
    indexedCost,
    indexedImprovement,
    indexedGain,
    flatTaxableGain,
    indexedTaxableGain,
    exemptionClaimed,
    flatTaxBeforeCess,
    flatTaxTotal: flatTaxBeforeCess * (1 + CESS_RATE),
    indexedTaxBeforeCess,
    indexedTaxTotal: indexedTaxBeforeCess * (1 + CESS_RATE),
    stcg,
    stcgRate,
    recommended,
    taxBeforeCess,
    cess,
    totalTax: taxBeforeCess + cess,
  }
}

function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '')
  if (!m) return null
  const d = new Date(Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!))
  return Number.isNaN(d.getTime()) ? null : d
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}

function percent(value: number) {
  return Number.isFinite(value) ? value / 100 : 0
}
