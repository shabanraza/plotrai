import { describe, expect, it } from 'vitest'
import { civilWorkQuantities } from '#/lib/civil-quote'
import {
  FT_PER_M,
  calculateBrickwork,
  calculatePlaster,
} from '#/lib/finishing-calc'
import { calculateMaterials } from '#/lib/material-calc'

const input = {
  wall: { lengthFt: 20, heightFt: 10, thickness: 'full' as const, openingsSqFt: 21 },
  plaster: { areaSqFt: 358, thicknessMm: 12 },
  slab: { lengthFt: 20, widthFt: 15, thicknessMm: 125 },
}

describe('civilWorkQuantities', () => {
  it('adds cement and sand from brickwork, plaster and the slab', () => {
    const q = civilWorkQuantities(input)
    const b = calculateBrickwork({ length: 20, height: 10, unit: 'ft', thickness: 'full', brick: 'standard', openings: 21, mix: 6, wastagePct: 5 })
    const p = calculatePlaster({ areaSqFt: 358, thicknessMm: 12, mix: 4, wastagePct: 10 })
    const s = calculateMaterials('rcc_slab', { length: 20 / FT_PER_M, width: 15 / FT_PER_M, thickness: 0.125 })
    expect(q.bricks).toBe(b.bricks)
    expect(q.cementBags).toBeCloseTo(b.cementBags + p.cementBags + s.cement, 6)
    expect(q.sandCuFt).toBeCloseTo(b.sandCuFt + p.sandCuFt + s.sand, 6)
    expect(q.aggregateCuFt).toBeCloseTo(s.aggregate, 6)
    expect(q.steelKg).toBeCloseTo(s.steel, 6)
    expect(q.wallAreaSqFt).toBe(179)
    expect(q.slabAreaSqFt).toBe(300)
  })

  it('gives zero for an empty job', () => {
    const q = civilWorkQuantities({
      wall: { lengthFt: 0, heightFt: 0, thickness: 'half', openingsSqFt: 0 },
      plaster: { areaSqFt: 0, thicknessMm: 12 },
      slab: { lengthFt: 0, widthFt: 0, thicknessMm: 0 },
    })
    expect(q.cementBags).toBe(0)
    expect(q.bricks).toBe(0)
  })
})
