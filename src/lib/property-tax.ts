export type PropertyTaxAuthority = 'BBMP' | 'GHMC' | 'MCD'

export interface PropertyTaxInput {
  authority: PropertyTaxAuthority
  areaSqft: number
  monthlyRatePerSqft: number
  depreciationPercent: number
  taxRatePercent: number
  cessPercent: number
  rebatePercent: number
}

export interface PropertyTaxResult {
  grossAnnualValue: number
  taxableAnnualValue: number
  baseTax: number
  cessAmount: number
  rebateAmount: number
  payable: number
}

export function calculatePropertyTax(
  input: PropertyTaxInput,
): PropertyTaxResult {
  const areaSqft = positive(input.areaSqft)
  const monthlyRatePerSqft = positive(input.monthlyRatePerSqft)
  const months = input.authority === 'BBMP' ? 10 : 12
  const grossAnnualValue = areaSqft * monthlyRatePerSqft * months
  const taxableAnnualValue =
    grossAnnualValue * (1 - clampPercent(input.depreciationPercent) / 100)
  const baseTax =
    taxableAnnualValue * (clampPercent(input.taxRatePercent) / 100)
  const cessAmount = baseTax * (clampPercent(input.cessPercent) / 100)
  const beforeRebate = baseTax + cessAmount
  const rebateAmount = beforeRebate * (clampPercent(input.rebatePercent) / 100)
  const payable = Math.max(beforeRebate - rebateAmount, 0)

  return {
    grossAnnualValue,
    taxableAnnualValue,
    baseTax,
    cessAmount,
    rebateAmount,
    payable,
  }
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(value, 0), 100)
}
