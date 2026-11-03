/**
 * Jaipur urban development (UD) tax — the city's residential property tax.
 *
 * UD tax = (assessable area in sq yd × DLC rate per sq yd) ÷ 2000
 * - Plot / independent house: assessable area is the plot area.
 * - Flat: assessable area is the built-up area.
 * Exempt: residential plots below 300 sq yd; flats below 1,500 sq ft built-up.
 * Rebates (percent of tax): early payment (10% Apr–Jun, 5% Jul–Sep) and 10% for women owners.
 *
 * Sources (checked 2026-11-02): HomeFirst JMC guide (Aug 2026), ghar.tv Jaipur guide (Nov 2025).
 */

export type JaipurPropertyType = 'plot' | 'flat'

export const UD_TAX_DIVISOR = 2000
export const PLOT_EXEMPT_BELOW_SQYD = 300
export const FLAT_EXEMPT_BELOW_SQFT = 1500
export const SQFT_PER_SQYD = 9

export interface JaipurUdTaxInput {
  type: JaipurPropertyType
  /** Plot area in sq yd for plots; built-up area in sq ft for flats */
  area: number
  /** Residential DLC rate, ₹ per sq yd */
  dlcRatePerSqyd: number
  earlyPaymentRebatePercent: 0 | 5 | 10
  womanOwner: boolean
}

export interface JaipurUdTaxResult {
  assessableSqyd: number
  exempt: boolean
  grossTax: number
  rebatePercent: number
  rebateAmount: number
  payable: number
}

export function calculateJaipurUdTax(input: JaipurUdTaxInput): JaipurUdTaxResult {
  const area = positive(input.area)
  const assessableSqyd = input.type === 'plot' ? area : area / SQFT_PER_SQYD
  const exempt =
    input.type === 'plot'
      ? area < PLOT_EXEMPT_BELOW_SQYD
      : area < FLAT_EXEMPT_BELOW_SQFT

  const grossTax = exempt
    ? 0
    : (assessableSqyd * positive(input.dlcRatePerSqyd)) / UD_TAX_DIVISOR
  const rebatePercent = input.earlyPaymentRebatePercent + (input.womanOwner ? 10 : 0)
  const rebateAmount = grossTax * (rebatePercent / 100)

  return {
    assessableSqyd,
    exempt,
    grossTax,
    rebatePercent,
    rebateAmount,
    payable: grossTax - rebateAmount,
  }
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}
