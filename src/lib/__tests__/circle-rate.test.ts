import { describe, expect, it } from 'vitest'
import { calculateCircleValue } from '../circle-rate'
import { DELHI_CIRCLE_RATES } from '#/data/circle-rates'

const rate = (c: string) => DELHI_CIRCLE_RATES.find((r) => r.category === c)!

describe('Delhi circle rate', () => {
  it('has all eight categories with land rates falling from A to H', () => {
    expect(DELHI_CIRCLE_RATES.map((r) => r.category).join('')).toBe('ABCDEFGH')
    for (let i = 1; i < DELHI_CIRCLE_RATES.length; i++) {
      expect(DELHI_CIRCLE_RATES[i].land).toBeLessThan(DELHI_CIRCLE_RATES[i - 1].land)
      expect(DELHI_CIRCLE_RATES[i].construction).toBeLessThan(DELHI_CIRCLE_RATES[i - 1].construction)
    }
  })

  it('values a category D house as land + construction', () => {
    const r = calculateCircleValue({
      rate: rate('D'),
      landSqm: 100,
      builtUpSqm: 150,
      agreementValue: 10_000_000,
    })
    expect(r.landValue).toBe(12_768_000)
    expect(r.constructionValue).toBe(1_674_000)
    expect(r.circleValue).toBe(14_442_000)
    expect(r.taxableValue).toBe(14_442_000)
    expect(r.circleValueIsHigher).toBe(true)
  })

  it('charges stamp duty on the agreed price when it is higher', () => {
    const r = calculateCircleValue({
      rate: rate('H'),
      landSqm: 100,
      builtUpSqm: 0,
      agreementValue: 5_000_000,
    })
    expect(r.circleValue).toBe(2_328_000)
    expect(r.taxableValue).toBe(5_000_000)
    expect(r.circleValueIsHigher).toBe(false)
  })
})
