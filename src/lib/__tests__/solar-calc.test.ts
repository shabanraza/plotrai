import { describe, expect, it } from 'vitest'
import {
  calculateSolar,
  centralSubsidy,
  portalSizeBand,
  sizeForUnits,
} from '#/lib/solar-calc'

describe('PM Surya Ghar subsidy', () => {
  it('matches the portal slabs: ₹30,000, ₹60,000, ₹78,000 and the cap', () => {
    expect(centralSubsidy(1, 'general')).toBe(30000)
    expect(centralSubsidy(2, 'general')).toBe(60000)
    expect(centralSubsidy(2.5, 'general')).toBe(69000)
    expect(centralSubsidy(3, 'general')).toBe(78000)
    expect(centralSubsidy(5, 'general')).toBe(78000)
    expect(centralSubsidy(10, 'general')).toBe(78000)
    expect(centralSubsidy(0, 'general')).toBe(0)
  })

  it('adds 10% in special category states', () => {
    expect(centralSubsidy(1, 'special')).toBe(33000)
    expect(centralSubsidy(3, 'special')).toBe(85800)
    expect(centralSubsidy(6, 'special')).toBe(85800)
  })
})

describe('sizing', () => {
  it('rounds up to the next half kW at 4 units per kW per day', () => {
    expect(sizeForUnits(120)).toBe(1)
    expect(sizeForUnits(300)).toBe(2.5)
    expect(sizeForUnits(360)).toBe(3)
    expect(sizeForUnits(0)).toBe(0)
  })

  it('returns the portal band', () => {
    expect(portalSizeBand(100)).toBe('1–2 kW')
    expect(portalSizeBand(300)).toBe('2–3 kW')
    expect(portalSizeBand(301)).toBe('above 3 kW')
  })
})

describe('calculateSolar', () => {
  it('works out the FAQ example: 3 kW at ₹60,000 per kW', () => {
    const r = calculateSolar({
      kw: 3,
      category: 'general',
      costPerKw: 60000,
      stateSubsidy: 0,
      monthlyUnits: 400,
      tariff: 7,
      unitsPerKwPerDay: 4,
    })
    expect(r.grossCost).toBe(180000)
    expect(r.netCost).toBe(102000)
    expect(r.monthlyGeneration).toBe(360)
    expect(r.monthlySavings).toBe(2520)
    expect(r.paybackYears).toBeCloseTo(3.37, 2)
  })

  it('values only the units you would have used', () => {
    const r = calculateSolar({
      kw: 5,
      category: 'general',
      costPerKw: 60000,
      stateSubsidy: 10000,
      monthlyUnits: 200,
      tariff: 8,
      unitsPerKwPerDay: 4,
    })
    expect(r.unitsOffset).toBe(200)
    expect(r.monthlySavings).toBe(1600)
    expect(r.netCost).toBe(300000 - 78000 - 10000)
  })

  it('never gives a subsidy above the system cost', () => {
    const r = calculateSolar({
      kw: 1,
      category: 'general',
      costPerKw: 20000,
      stateSubsidy: 50000,
      monthlyUnits: 0,
      tariff: 7,
      unitsPerKwPerDay: 4,
    })
    expect(r.netCost).toBe(0)
    expect(r.paybackYears).toBeNull()
  })
})
