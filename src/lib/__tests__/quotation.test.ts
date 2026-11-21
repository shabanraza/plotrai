import { describe, expect, it } from 'vitest'
import { formatRupees, lineAmount, quoteTotals, roomsAreaPerimeter } from '#/lib/quotation'

describe('lineAmount', () => {
  it('multiplies qty by rate and rounds to paise', () => {
    expect(lineAmount({ qty: 10.5, rate: 3.333 })).toBe(35)
    expect(lineAmount({ qty: 3, rate: 0.1 })).toBe(0.3)
  })

  it('treats empty, negative or NaN values as zero', () => {
    expect(lineAmount({ qty: Number.NaN, rate: 100 })).toBe(0)
    expect(lineAmount({ qty: -4, rate: 100 })).toBe(0)
    expect(lineAmount({ qty: 4, rate: 0 })).toBe(0)
  })
})

describe('quoteTotals', () => {
  it('adds lines, applies GST and totals', () => {
    const t = quoteTotals(
      [
        { qty: 25, rate: 40 }, // 1000
        { qty: 9, rate: 250 }, // 2250
        { qty: 400, rate: 12 }, // 4800
      ],
      18,
    )
    expect(t.amounts).toEqual([1000, 2250, 4800])
    expect(t.subtotal).toBe(8050)
    expect(t.gst).toBe(1449)
    expect(t.total).toBe(9499)
  })

  it('skips GST when it is 0 or blank and clamps above 28%', () => {
    expect(quoteTotals([{ qty: 1, rate: 100 }], 0).total).toBe(100)
    expect(quoteTotals([{ qty: 1, rate: 100 }], Number.NaN).gst).toBe(0)
    const high = quoteTotals([{ qty: 1, rate: 100 }], 50)
    expect(high.gstPct).toBe(28)
    expect(high.total).toBe(128)
  })

  it('returns zeros for no lines', () => {
    expect(quoteTotals([], 18)).toEqual({
      amounts: [],
      subtotal: 0,
      gstPct: 18,
      gst: 0,
      total: 0,
    })
  })
})

describe('formatRupees', () => {
  it('uses Indian grouping', () => {
    expect(formatRupees(125000.5)).toBe('1,25,000.50')
  })
})

describe('roomsAreaPerimeter', () => {
  it('sums area and perimeter and skips incomplete rooms', () => {
    expect(
      roomsAreaPerimeter([
        { length: 12, width: 10 },
        { length: 8, width: 5 },
        { length: 0, width: 9 },
      ]),
    ).toEqual({ area: 160, perimeter: 70 })
  })
})
