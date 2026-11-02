import type { StampDutyRate } from '#/data/stamp-duty-rates'
import { calculateStampDuty, type StampDutyGender } from '#/lib/stamp-duty'

export type PropertyStage = 'ready' | 'under-construction' | 'affordable'

/** GST on residential property: none on ready-to-move, 5% under-construction, 1% affordable (≤ ₹45 lakh). */
export const GST_PERCENT: Record<PropertyStage, number> = {
  ready: 0,
  'under-construction': 5,
  affordable: 1,
}

export interface HomeBuyingCostInput {
  propertyValue: number
  rate: StampDutyRate
  gender: StampDutyGender
  stage: PropertyStage
  brokeragePercent: number
  legalAndOtherFees: number
  loanLtvPercent: number
  interestRatePercent: number
  tenureYears: number
  processingFeePercent: number
}

export interface HomeBuyingCostResult {
  stampDutyPercent: number
  stampDutyAmount: number
  registrationAmount: number
  gstPercent: number
  gstAmount: number
  brokerageAmount: number
  legalAndOtherFees: number
  processingFee: number
  oneTimeCharges: number
  /** RBI cap on loan-to-value for this property value, in %. */
  maxLtvPercent: number
  ltvCapped: boolean
  loanAmount: number
  downPayment: number
  upfrontCash: number
  emi: number
  totalInterest: number
  totalCostOfOwnership: number
}

/**
 * RBI loan-to-value ceilings for housing loans:
 * 90% up to ₹30 lakh, 80% for ₹30–75 lakh, 75% above ₹75 lakh.
 */
export function maxLtvPercent(propertyValue: number) {
  if (propertyValue <= 3_000_000) return 90
  if (propertyValue <= 7_500_000) return 80
  return 75
}

/** Standard reducing-balance EMI. */
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureYears: number,
) {
  const p = positive(principal)
  const n = Math.round(positive(tenureYears) * 12)
  if (p === 0 || n === 0) return 0
  const r = positive(annualRatePercent) / 12 / 100
  if (r === 0) return p / n
  const factor = Math.pow(1 + r, n)
  return (p * r * factor) / (factor - 1)
}

export function calculateHomeBuyingCost(
  input: HomeBuyingCostInput,
): HomeBuyingCostResult {
  const propertyValue = positive(input.propertyValue)
  const stamp = calculateStampDuty({
    propertyValue,
    rate: input.rate,
    gender: input.gender,
    loanLtvPercent: 0,
  })

  const gstPercent = GST_PERCENT[input.stage]
  const gstAmount = propertyValue * (gstPercent / 100)
  const brokerageAmount = propertyValue * (positive(input.brokeragePercent) / 100)
  const legalAndOtherFees = positive(input.legalAndOtherFees)

  const ltvCap = maxLtvPercent(propertyValue)
  const requestedLtv = positive(input.loanLtvPercent)
  const ltv = Math.min(requestedLtv, ltvCap)
  const loanAmount = propertyValue * (ltv / 100)
  const downPayment = propertyValue - loanAmount
  const processingFee = loanAmount * (positive(input.processingFeePercent) / 100)

  const emi = calculateEmi(loanAmount, input.interestRatePercent, input.tenureYears)
  const months = Math.round(positive(input.tenureYears) * 12)
  const totalInterest = loanAmount > 0 ? Math.max(emi * months - loanAmount, 0) : 0

  const oneTimeCharges =
    stamp.stampDutyAmount +
    stamp.registrationAmount +
    gstAmount +
    brokerageAmount +
    legalAndOtherFees +
    processingFee

  return {
    stampDutyPercent: stamp.stampDutyPercent,
    stampDutyAmount: stamp.stampDutyAmount,
    registrationAmount: stamp.registrationAmount,
    gstPercent,
    gstAmount,
    brokerageAmount,
    legalAndOtherFees,
    processingFee,
    oneTimeCharges,
    maxLtvPercent: ltvCap,
    ltvCapped: requestedLtv > ltvCap,
    loanAmount,
    downPayment,
    upfrontCash: downPayment + oneTimeCharges,
    emi,
    totalInterest,
    totalCostOfOwnership: propertyValue + oneTimeCharges + totalInterest,
  }
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}
