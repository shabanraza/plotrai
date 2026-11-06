import { describe, expect, it } from 'vitest'
import { boqMaterials, quoteCsv } from '#/lib/boq'
import { calculateMaterials } from '#/lib/material-calc'

describe('boqMaterials', () => {
  it('sums elements with plaster thickness in mm and solids in metres', () => {
    const total = boqMaterials([
      { type: 'rcc_slab', length: 6, width: 4, thicknessMm: 125 },
      { type: 'plaster', length: 10, width: 3, thicknessMm: 12 },
    ])
    const slab = calculateMaterials('rcc_slab', { length: 6, width: 4, thickness: 0.125 })
    const plaster = calculateMaterials('plaster', { length: 10, width: 3, thickness: 12 })
    expect(total.cement).toBeCloseTo(slab.cement + plaster.cement, 6)
    expect(total.steel).toBeCloseTo(slab.steel, 6)
    expect(total.bricks).toBe(0)
  })
})

describe('quoteCsv', () => {
  it('writes rows, escapes commas and quotes, and adds totals with GST', () => {
    const csv = quoteCsv(
      [
        { id: 'a', description: 'Cement, 50 kg "OPC"', qty: 10, unit: 'bag', rate: 400 },
        { id: 'b', description: 'Sand', qty: 0, unit: 'cu ft', rate: 0 },
      ],
      18,
    )
    const rows = csv.split('\r\n')
    expect(rows[0]).toBe('Item,Description,Qty,Unit,Rate (Rs),Amount (Rs)')
    expect(rows[1]).toBe('1,"Cement, 50 kg ""OPC""",10,bag,400,4000.00')
    expect(rows[2]).toBe('2,Sand,,cu ft,,0.00')
    expect(rows.at(-2)).toBe(',,,,GST 18%,720.00')
    expect(rows.at(-1)).toBe(',,,,Total,4720.00')
  })
})
