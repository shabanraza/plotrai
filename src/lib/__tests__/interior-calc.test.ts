import { describe, expect, it } from 'vitest'
import {
  BHK_DEFAULTS,
  formatLakh,
  interiorLines,
  interiorTotal,
  pick,
  type Finish,
  type InteriorInput,
} from '#/lib/interior-calc'

function threeBhk(finish: Finish): InteriorInput {
  return {
    finish,
    carpetSqFt: 1300,
    kitchen: 'medium',
    living: 'medium',
    wardrobes: 3,
    ceiling: 'living',
    painting: true,
    bathrooms: 0,
  }
}

describe('interior cost', () => {
  it('picks the low end, midpoint and high end of a range', () => {
    expect(pick([60000, 150000], 'essential')).toBe(60000)
    expect(pick([60000, 150000], 'mid')).toBe(105000)
    expect(pick([60000, 150000], 'premium')).toBe(150000)
  })

  it('prices the FAQ example: a mid-range 3BHK of 1,300 sq ft', () => {
    const lines = interiorLines(threeBhk('mid'))
    const by = Object.fromEntries(lines.map((l) => [l.id, l.amount]))
    expect(by.kitchen).toBe(275000)
    expect(by.wardrobes).toBe(315000)
    expect(by.living).toBe(150000)
    expect(by.ceiling).toBe(105000)
    expect(by.painting).toBeCloseTo(1300 * 2.4 * 26.5, 6)
    expect(interiorTotal(threeBhk('mid'))).toBeCloseTo(927680, 0)
  })

  it('keeps essential below mid-range below premium', () => {
    const e = interiorTotal(threeBhk('essential'))
    const m = interiorTotal(threeBhk('mid'))
    const p = interiorTotal(threeBhk('premium'))
    expect(e).toBeLessThan(m)
    expect(m).toBeLessThan(p)
  })

  it('leaves out items set to none or zero', () => {
    const lines = interiorLines({
      ...threeBhk('mid'),
      kitchen: 'none',
      wardrobes: 0,
      ceiling: 'none',
      painting: false,
    })
    expect(lines.map((l) => l.id)).toEqual(['living'])
  })

  it('prices a whole-home false ceiling by area and bathrooms per room', () => {
    const by = Object.fromEntries(
      interiorLines({
        ...threeBhk('premium'),
        ceiling: 'whole',
        bathrooms: 2,
      }).map((l) => [l.id, l.amount]),
    )
    expect(by.ceiling).toBe(1300 * 120)
    expect(by.bathrooms).toBe(300000)
  })

  it('matches the 1BHK and 2BHK FAQ figures', () => {
    const base = threeBhk('mid')
    expect(
      interiorTotal({
        ...base,
        carpetSqFt: 500,
        kitchen: 'small',
        living: 'small',
        wardrobes: 1,
      }),
    ).toBeCloseTo(466800, 0)
    expect(
      interiorTotal({ ...base, carpetSqFt: 850, wardrobes: 2 }),
    ).toBeCloseTo(794060, 0)
  })

  it('has a default for every BHK and formats lakh', () => {
    expect(BHK_DEFAULTS[2].carpetSqFt).toBe(850)
    expect(formatLakh(927680)).toBe('₹9.3 lakh')
    expect(formatLakh(55000)).toBe('₹55,000')
  })
})
