import type { CategoryRate } from '#/data/circle-rates'

export interface CircleValueInput {
  rate: CategoryRate
  /** Plot (land) area in sq m */
  landSqm: number
  /** Built-up area in sq m; 0 for a vacant plot */
  builtUpSqm: number
  /** Agreed sale price, ₹ */
  agreementValue: number
}

export interface CircleValueResult {
  landValue: number
  constructionValue: number
  circleValue: number
  /** Stamp duty is charged on the higher of agreement value and circle value. */
  taxableValue: number
  circleValueIsHigher: boolean
}

/**
 * Minimum (circle) value of an independent residential plot or house in Delhi:
 * land area × land rate + built-up area × construction rate.
 */
export function calculateCircleValue(input: CircleValueInput): CircleValueResult {
  const landValue = positive(input.landSqm) * input.rate.land
  const constructionValue = positive(input.builtUpSqm) * input.rate.construction
  const circleValue = landValue + constructionValue
  const agreementValue = positive(input.agreementValue)

  return {
    landValue,
    constructionValue,
    circleValue,
    taxableValue: Math.max(circleValue, agreementValue),
    circleValueIsHigher: circleValue > agreementValue,
  }
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}
