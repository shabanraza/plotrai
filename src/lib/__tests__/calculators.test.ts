import { describe, expect, it } from 'vitest'
import { calculateConstructionCost } from '../construction-cost'
import {
  calculateIndexation,
  calculatePropertyCapitalGains,
  financialYearOf,
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

  const base = {
    purchasePrice: 5_000_000,
    salePrice: 12_000_000,
    purchaseDate: '2015-06-15',
    saleDate: '2026-11-21',
    residency: 'resident' as const,
    slabRatePercent: 30,
  }

  it('worked example: resident, bought Jun 2015, sold Nov 2026 - flat 12.5% wins', () => {
    const r = calculatePropertyCapitalGains(base)
    expect(r.isLongTerm).toBe(true)
    expect(r.purchaseCii).toBe(254)
    expect(r.saleCii).toBe(384)
    expect(r.flatGain).toBe(7_000_000)
    expect(r.flatTaxBeforeCess).toBe(875_000)
    expect(r.flatTaxTotal).toBeCloseTo(910_000)
    expect(r.indexedAvailable).toBe(true)
    expect(r.indexedCost).toBeCloseTo(7_559_055.12, 1)
    expect(r.indexedGain).toBeCloseTo(4_440_944.88, 1)
    expect(r.indexedTaxBeforeCess).toBeCloseTo(888_188.98, 1)
    expect(r.indexedTaxTotal).toBeCloseTo(923_716.54, 1)
    expect(r.recommended).toBe('flat')
    expect(r.taxBeforeCess).toBe(875_000)
    expect(r.cess).toBeCloseTo(35_000)
    expect(r.totalTax).toBeCloseTo(910_000)
  })

  it('picks indexed when it is lower', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      purchasePrice: 4_000_000,
      purchaseDate: '2018-07-01',
      salePrice: 7_000_000,
    })
    expect(r.recommended).toBe('indexed')
    expect(r.taxBeforeCess).toBeCloseTo(
      (7_000_000 - (4_000_000 * 384) / 280) * 0.2,
      1,
    )
  })

  it('exactly 24 months is short-term, one day more is long-term', () => {
    const short = calculatePropertyCapitalGains({
      ...base,
      purchaseDate: '2024-11-21',
      saleDate: '2026-11-21',
    })
    expect(short.isLongTerm).toBe(false)
    expect(short.recommended).toBe('short')
    expect(short.taxBeforeCess).toBe(7_000_000 * 0.3)
    expect(short.totalTax).toBeCloseTo(7_000_000 * 0.3 * 1.04)
    const long = calculatePropertyCapitalGains({
      ...base,
      purchaseDate: '2024-11-20',
      saleDate: '2026-11-21',
    })
    expect(long.isLongTerm).toBe(true)
  })

  it('property bought on or after 23 Jul 2024 has no indexed option', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      purchaseDate: '2024-07-23',
    })
    expect(r.indexedAvailable).toBe(false)
    expect(r.recommended).toBe('flat')
  })

  it('NRI gets 12.5% without indexation only', () => {
    const r = calculatePropertyCapitalGains({ ...base, residency: 'nri' })
    expect(r.indexedAvailable).toBe(false)
    expect(r.recommended).toBe('flat')
    expect(r.totalTax).toBeCloseTo(910_000)
  })

  it('sale before 23 Jul 2024 is 20% with indexation only', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      saleDate: '2024-03-01',
      salePrice: 10_000_000,
    })
    expect(r.flatAvailable).toBe(false)
    expect(r.recommended).toBe('indexed')
    expect(r.saleCii).toBe(348)
    expect(r.taxBeforeCess).toBeCloseTo(
      (10_000_000 - (5_000_000 * 348) / 254) * 0.2,
      1,
    )
  })

  it('handles cost of improvement (indexed by its own FY) and transfer expenses', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      improvementCost: 1_000_000,
      improvementDate: '2020-05-10',
      transferExpenses: 200_000,
    })
    expect(r.flatGain).toBe(12_000_000 - 200_000 - 5_000_000 - 1_000_000)
    expect(r.improvementCii).toBe(301)
    expect(r.indexedGain).toBeCloseTo(
      12_000_000 -
        200_000 -
        (5_000_000 * 384) / 254 -
        (1_000_000 * 384) / 301,
      1,
    )
  })

  it('s.85 reinvestment is capped at 50 lakh and reduces taxable gain', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      residency: 'nri',
      reinvestSection: '85',
      reinvestAmount: 8_000_000,
    })
    expect(r.exemptionClaimed).toBe(5_000_000)
    expect(r.taxBeforeCess).toBe((7_000_000 - 5_000_000) * 0.125)
  })

  it('s.82 reinvestment exempts up to the gain, capped at 10 crore of new house cost', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      reinvestSection: '82',
      reinvestAmount: 3_000_000,
    })
    expect(r.exemptionClaimed).toBe(3_000_000)
    const full = calculatePropertyCapitalGains({
      ...base,
      reinvestSection: '82',
      reinvestAmount: 2_000_000_000,
    })
    expect(full.exemptionClaimed).toBe(7_000_000)
    expect(full.taxBeforeCess).toBe(0)
  })

  it('s.86 (plot or other asset) is pro-rata on net sale value', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      residency: 'nri',
      transferExpenses: 200_000,
      assetType: 'other',
      reinvestSection: '86',
      reinvestAmount: 5_900_000,
    })
    // gain 6,800,000; net sale 11,800,000; invested 5,900,000 -> half exempt
    expect(r.flatGain).toBe(6_800_000)
    expect(r.exemptionClaimed).toBeCloseTo(3_400_000)
    expect(r.taxBeforeCess).toBeCloseTo(3_400_000 * 0.125)
  })

  it('s.86 caps the new house cost at 10 crore and full investment exempts all', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      residency: 'nri',
      assetType: 'other',
      reinvestSection: '86',
      reinvestAmount: 2_000_000_000,
    })
    expect(r.taxBeforeCess).toBe(0)
  })

  it('s.82 is ignored for a plot and s.86 is ignored for a house', () => {
    const plot = calculatePropertyCapitalGains({
      ...base,
      residency: 'nri',
      assetType: 'other',
      reinvestSection: '82',
      reinvestAmount: 5_000_000,
    })
    expect(plot.exemptionClaimed).toBe(0)
    const house = calculatePropertyCapitalGains({
      ...base,
      residency: 'nri',
      assetType: 'house',
      reinvestSection: '86',
      reinvestAmount: 5_000_000,
    })
    expect(house.exemptionClaimed).toBe(0)
  })

  it('flags invalid dates', () => {
    expect(calculatePropertyCapitalGains(base).datesValid).toBe(true)
    expect(
      calculatePropertyCapitalGains({ ...base, saleDate: '2015-01-01' })
        .datesValid,
    ).toBe(false)
    expect(
      calculatePropertyCapitalGains({ ...base, saleDate: '' }).datesValid,
    ).toBe(false)
  })

  it('ignores improvement cost incurred before 1 Apr 2001', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      purchaseDate: '1995-01-01',
      improvementCost: 1_000_000,
      improvementDate: '1999-01-01',
    })
    expect(r.improvementIgnored).toBe('before-2001')
    expect(r.improvementApplied).toBe(0)
    expect(r.flatGain).toBe(7_000_000)
  })

  it('ignores improvement dated outside purchase and sale', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      improvementCost: 1_000_000,
      improvementDate: '2010-01-01',
    })
    expect(r.improvementIgnored).toBe('out-of-range')
    expect(r.flatGain).toBe(7_000_000)
    const ok = calculatePropertyCapitalGains({
      ...base,
      improvementCost: 1_000_000,
      improvementDate: '2020-01-01',
    })
    expect(ok.improvementIgnored).toBeNull()
    expect(ok.improvementApplied).toBe(1_000_000)
    expect(ok.flatGain).toBe(6_000_000)
  })

  it('reports when the sale year CII is not yet notified', () => {
    const r = calculatePropertyCapitalGains({ ...base, saleDate: '2027-06-01' })
    expect(r.saleCiiNotified).toBe(false)
    expect(r.saleCiiFy).toBe('2027-28')
    expect(calculatePropertyCapitalGains(base).saleCiiNotified).toBe(true)
  })

  it('uses latest CII for sale dates after the last notified year and 100 before 2001', () => {
    const r = calculatePropertyCapitalGains({
      ...base,
      purchaseDate: '1995-01-01',
      saleDate: '2027-06-01',
    })
    expect(r.purchaseCii).toBe(100)
    expect(r.saleCii).toBe(384)
  })
})

describe('financial year helper', () => {
  it('maps dates to Indian financial years', () => {
    expect(financialYearOf('2026-03-31')).toBe('2025-26')
    expect(financialYearOf('2026-04-01')).toBe('2026-27')
    expect(financialYearOf('2000-03-31')).toBe('1999-00')
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
