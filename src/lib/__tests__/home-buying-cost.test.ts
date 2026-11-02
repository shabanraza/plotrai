import { describe, expect, it } from 'vitest'
import {
  calculateEmi,
  calculateHomeBuyingCost,
  maxLtvPercent,
} from '../home-buying-cost'
import type { StampDutyRate } from '#/data/stamp-duty-rates'

const RATE: StampDutyRate = { male: 6, female: 5, joint: 5.5, registration: 1 }

const BASE = {
  propertyValue: 10_000_000,
  rate: RATE,
  gender: 'male' as const,
  stage: 'ready' as const,
  brokeragePercent: 1,
  legalAndOtherFees: 25_000,
  loanLtvPercent: 75,
  interestRatePercent: 8.5,
  tenureYears: 20,
  processingFeePercent: 0.5,
}

describe('home buying cost calculator', () => {
  it('computes EMI with the reducing-balance formula', () => {
    // ₹50 lakh at 8.5% for 20 years ≈ ₹43,391/month
    expect(calculateEmi(5_000_000, 8.5, 20)).toBeCloseTo(43391.16, 0)
    expect(calculateEmi(1_200_000, 0, 1)).toBe(100_000)
    expect(calculateEmi(0, 8.5, 20)).toBe(0)
  })

  it('applies RBI loan-to-value slabs', () => {
    expect(maxLtvPercent(3_000_000)).toBe(90)
    expect(maxLtvPercent(5_000_000)).toBe(80)
    expect(maxLtvPercent(7_500_001)).toBe(75)
  })

  it('totals one-time charges for a ₹1 crore ready flat', () => {
    const r = calculateHomeBuyingCost(BASE)
    expect(r.stampDutyAmount).toBe(600_000)
    expect(r.registrationAmount).toBe(100_000)
    expect(r.gstAmount).toBe(0)
    expect(r.brokerageAmount).toBe(100_000)
    expect(r.loanAmount).toBe(7_500_000)
    expect(r.processingFee).toBe(37_500)
    expect(r.oneTimeCharges).toBe(862_500)
    expect(r.downPayment).toBe(2_500_000)
    expect(r.upfrontCash).toBe(3_362_500)
    expect(r.ltvCapped).toBe(false)
  })

  it('caps the loan at the RBI LTV limit and adds GST for under-construction', () => {
    const r = calculateHomeBuyingCost({
      ...BASE,
      stage: 'under-construction',
      loanLtvPercent: 90,
    })
    expect(r.gstAmount).toBe(500_000)
    expect(r.ltvCapped).toBe(true)
    expect(r.loanAmount).toBe(7_500_000)
  })

  it('uses 1% GST for affordable housing and no interest without a loan', () => {
    const r = calculateHomeBuyingCost({
      ...BASE,
      propertyValue: 4_000_000,
      stage: 'affordable',
      loanLtvPercent: 0,
    })
    expect(r.gstAmount).toBe(40_000)
    expect(r.emi).toBe(0)
    expect(r.totalInterest).toBe(0)
    expect(r.totalCostOfOwnership).toBe(4_000_000 + r.oneTimeCharges)
  })
})
