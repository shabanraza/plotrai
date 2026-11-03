import { describe, expect, it } from 'vitest'
import { calculateJaipurUdTax } from '../jaipur-ud-tax'

const base = {
  dlcRatePerSqyd: 35000,
  earlyPaymentRebatePercent: 0 as const,
  womanOwner: false,
}

describe('Jaipur UD tax', () => {
  it('taxes a 400 sq yd plot at area × DLC ÷ 2000', () => {
    const r = calculateJaipurUdTax({ ...base, type: 'plot', area: 400 })
    expect(r.exempt).toBe(false)
    expect(r.grossTax).toBe(7000)
    expect(r.payable).toBe(7000)
  })

  it('exempts plots below 300 sq yd and flats below 1,500 sq ft', () => {
    expect(calculateJaipurUdTax({ ...base, type: 'plot', area: 299 }).payable).toBe(0)
    expect(calculateJaipurUdTax({ ...base, type: 'plot', area: 300 }).exempt).toBe(false)
    expect(calculateJaipurUdTax({ ...base, type: 'flat', area: 1499 }).payable).toBe(0)
  })

  it('uses built-up area in sq yd for flats', () => {
    const r = calculateJaipurUdTax({ ...base, type: 'flat', area: 1800 })
    expect(r.assessableSqyd).toBe(200)
    expect(r.grossTax).toBe(3500)
  })

  it('adds early-payment and women-owner rebates', () => {
    const r = calculateJaipurUdTax({
      ...base,
      type: 'plot',
      area: 400,
      earlyPaymentRebatePercent: 10,
      womanOwner: true,
    })
    expect(r.rebatePercent).toBe(20)
    expect(r.payable).toBe(5600)
  })
})
