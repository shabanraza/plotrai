import { describe, expect, it } from 'vitest'
import { calculateConstructionCost } from '../construction-cost'
import {
  calculateIndexation,
  calculatePropertyCapitalGains,
} from '../indexation'
import { calculateMaterials } from '../material-calc'
import { convertLandArea } from '../plot-units'
import { calculatePropertyTax } from '../property-tax'
import { calculateStampDuty } from '../stamp-duty'
import { CITY_RATES, STAGES } from '#/data/construction-cost-rates'

describe('property tax calculators', () => {
  it('calculates BBMP residential tax using 10-month UAV, depreciation, 20% tax, 24% cess, and 5% rebate', () => {
    const result = calculatePropertyTax({
      authority: 'BBMP',
      areaSqft: 1200,
      monthlyRatePerSqft: 3,
      depreciationPercent: 10,
      taxRatePercent: 20,
      cessPercent: 24,
      rebatePercent: 5,
    })

    expect(result.grossAnnualValue).toBe(36000)
    expect(result.taxableAnnualValue).toBe(32400)
    expect(result.baseTax).toBe(6480)
    expect(result.cessAmount).toBe(1555.2)
    expect(result.rebateAmount).toBeCloseTo(401.76)
    expect(result.payable).toBeCloseTo(7633.44)
  })

  it('calculates GHMC residential planning estimate with 12-month rental value, depreciation, and library cess', () => {
    const result = calculatePropertyTax({
      authority: 'GHMC',
      areaSqft: 1000,
      monthlyRatePerSqft: 4,
      depreciationPercent: 10,
      taxRatePercent: 17,
      cessPercent: 8,
      rebatePercent: 0,
    })

    expect(result.grossAnnualValue).toBe(48000)
    expect(result.taxableAnnualValue).toBe(43200)
    expect(result.baseTax).toBeCloseTo(7344)
    expect(result.cessAmount).toBeCloseTo(587.52)
    expect(result.payable).toBeCloseTo(7931.52)
  })

  it('calculates MCD planning estimate from annual value inputs and clamps negative results to zero', () => {
    const result = calculatePropertyTax({
      authority: 'MCD',
      areaSqft: 1000,
      monthlyRatePerSqft: 10,
      depreciationPercent: 0,
      taxRatePercent: 12,
      cessPercent: 0,
      rebatePercent: 10,
    })

    expect(result.grossAnnualValue).toBe(120000)
    expect(result.baseTax).toBe(14400)
    expect(result.rebateAmount).toBe(1440)
    expect(result.payable).toBe(12960)

    expect(
      calculatePropertyTax({
        authority: 'MCD',
        areaSqft: -100,
        monthlyRatePerSqft: 10,
        depreciationPercent: 0,
        taxRatePercent: 12,
        cessPercent: 0,
        rebatePercent: 0,
      }).payable,
    ).toBe(0)
  })
})

describe('stamp duty calculator', () => {
  it('applies city overrides, buyer rate, registration cap, and cash requirement', () => {
    const result = calculateStampDuty({
      propertyValue: 8_000_000,
      rate: {
        male: 7,
        female: 5,
        joint: 6,
        registration: 1,
        registrationCap: 50_000,
      },
      gender: 'female',
      loanLtvPercent: 80,
    })

    expect(result.stampDutyAmount).toBe(400000)
    expect(result.registrationAmount).toBe(50000)
    expect(result.totalGovernmentCharges).toBe(450000)
    expect(result.downPayment).toBeCloseTo(1600000)
    expect(result.totalCashRequired).toBeCloseTo(2050000)
  })
})

describe('construction cost calculator', () => {
  it('calculates total cost and stage rows that sum to the total', () => {
    const result = calculateConstructionCost({
      city: 'Bangalore',
      tier: 'standard',
      areaPerFloorSqft: 1500,
      floors: 2,
      cityRates: CITY_RATES,
      stages: STAGES,
    })

    expect(result.totalAreaSqft).toBe(3000)
    expect(result.baseRatePerSqft).toBe(2150)
    expect(result.totalCost).toBe(6450000)
    expect(result.stageRows.reduce((sum, row) => sum + row.cost, 0)).toBe(
      result.totalCost,
    )
  })
})

describe('material calculator', () => {
  it('calculates PCC, RCC slab, plaster, and zero-input quantities', () => {
    const pcc = calculateMaterials('pcc', {
      length: 10,
      width: 5,
      thickness: 0.1,
    })
    expect(pcc.cement).toBeCloseTo(31.5)
    expect(pcc.sand).toBeCloseTo(70)
    expect(pcc.aggregate).toBeCloseTo(140)

    const slab = calculateMaterials('rcc_slab', {
      length: 4,
      width: 5,
      thickness: 0.15,
    })
    expect(slab.steel).toBeCloseTo(240)

    const plaster = calculateMaterials('plaster', {
      length: 10,
      width: 3,
      thickness: 12,
    })
    expect(plaster.cement).toBeCloseTo(2.76)
    expect(plaster.sand).toBeCloseTo(12.6)

    expect(
      calculateMaterials('pcc', { length: 0, width: 5, thickness: 0.1 }).cement,
    ).toBe(0)
  })
})

describe('indexation and capital gains calculators', () => {
  it('calculates indexed cost and 20% indexed tax', () => {
    const result = calculateIndexation({
      purchasePrice: 4_000_000,
      salePrice: 10_000_000,
      purchaseCii: 280,
      saleCii: 376,
    })

    expect(result.indexedCost).toBeCloseTo(5371428.57)
    expect(result.indexedGain).toBeCloseTo(4628571.43)
    expect(result.taxAt20Percent).toBeCloseTo(925714.29)
  })

  it('recommends the lower eligible long-term property tax regime', () => {
    const result = calculatePropertyCapitalGains({
      purchaseFy: '2018-19',
      saleFy: '2025-26',
      purchasePrice: 4_000_000,
      salePrice: 7_000_000,
      slabRatePercent: 30,
    })

    expect(result.isLongTerm).toBe(true)
    expect(result.oldRegimeAvailable).toBe(true)
    expect(result.recommended).toBe('indexed')
    expect(result.recommendedTax).toBeCloseTo(325714.29)
  })
})

describe('land area converter', () => {
  it('converts acre, gaj, kanal, and regional bigha through square feet', () => {
    expect(convertLandArea(1, 'acre', 'sqft')).toBe(43560)
    expect(convertLandArea(1, 'acre', 'sqyd')).toBe(4840)
    expect(convertLandArea(1, 'kanal', 'marla')).toBe(20)
    expect(convertLandArea(1, 'bigha_uttar', 'sqyd')).toBe(3000)
  })
})
