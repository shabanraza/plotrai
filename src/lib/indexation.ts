import { CII } from '#/data/cii'

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

export interface PropertyCapitalGainsInput {
  purchaseFy: string
  saleFy: string
  purchasePrice: number
  salePrice: number
  slabRatePercent: number
}

export interface PropertyCapitalGainsResult extends IndexationResult {
  purchaseCii: number
  saleCii: number
  holdingYears: number
  isLongTerm: boolean
  oldRegimeAvailable: boolean
  ltcgIndexed: number | null
  ltcgFlat: number
  stcg: number
  stcgRate: number
  recommended: 'flat' | 'indexed' | 'short'
  recommendedTax: number
}

export function calculatePropertyCapitalGains(
  input: PropertyCapitalGainsInput,
): PropertyCapitalGainsResult {
  const purchaseCii = CII[input.purchaseFy] ?? 100
  const saleCii = CII[input.saleFy] ?? purchaseCii
  const purchaseYearStart = parseFinancialYearStart(input.purchaseFy)
  const saleYearStart = parseFinancialYearStart(input.saleFy)
  const holdingYears = Math.max(saleYearStart - purchaseYearStart, 0)
  const isLongTerm = holdingYears >= 2
  const oldRegimeAvailable = purchaseYearStart < 2024
  const indexation = calculateIndexation({
    purchasePrice: input.purchasePrice,
    salePrice: input.salePrice,
    purchaseCii,
    saleCii,
  })
  const ltcgIndexed = oldRegimeAvailable ? indexation.taxAt20Percent : null
  const ltcgFlat = indexation.flatGain * 0.125
  const stcgRate = percent(input.slabRatePercent)
  const stcg = indexation.flatGain * stcgRate

  let recommended: PropertyCapitalGainsResult['recommended'] = 'flat'
  let recommendedTax = ltcgFlat
  if (!isLongTerm) {
    recommended = 'short'
    recommendedTax = stcg
  } else if (ltcgIndexed !== null && ltcgIndexed < ltcgFlat) {
    recommended = 'indexed'
    recommendedTax = ltcgIndexed
  }

  return {
    ...indexation,
    purchaseCii,
    saleCii,
    holdingYears,
    isLongTerm,
    oldRegimeAvailable,
    ltcgIndexed,
    ltcgFlat,
    stcg,
    stcgRate,
    recommended,
    recommendedTax,
  }
}

function parseFinancialYearStart(fy: string) {
  const parsed = Number.parseInt(fy.split('-')[0] ?? '', 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}

function percent(value: number) {
  return Number.isFinite(value) ? value / 100 : 0
}
