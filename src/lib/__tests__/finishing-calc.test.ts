import { describe, expect, it } from 'vitest'
import {
  barWeightKgPerM,
  barsWeightKg,
  calculateBrickwork,
  calculatePaint,
  calculatePlaster,
  calculateTiles,
  mortarMaterials,
  roomPaintAreaSqFt,
  steelByVolumeKg,
} from '#/lib/finishing-calc'

describe('calculateTiles', () => {
  it('rounds tiles up after wastage and works out boxes', () => {
    // 2 × 2 ft tile ≈ 3.875 sq ft; 100 sq ft + 10% = 110 → 28.4 → 29 tiles
    const r = calculateTiles({
      areaSqFt: 100,
      tileWidthMm: 600,
      tileHeightMm: 600,
      wastagePct: 10,
      tilesPerBox: 4,
    })
    expect(r.tiles).toBe(29)
    expect(r.boxes).toBe(8)
  })

  it('skips boxes when tiles per box is unknown, and returns zero for no area', () => {
    expect(
      calculateTiles({
        areaSqFt: 50,
        tileWidthMm: 300,
        tileHeightMm: 300,
        wastagePct: 0,
      }).boxes,
    ).toBeNull()
    expect(
      calculateTiles({
        areaSqFt: 0,
        tileWidthMm: 600,
        tileHeightMm: 600,
        wastagePct: 10,
      }).tiles,
    ).toBe(0)
  })
})

describe('paint', () => {
  it('measures four walls plus ceiling, minus openings', () => {
    // 12 × 10 × 10 ft: walls 440, ceiling 120, openings 40 → 520
    expect(
      roomPaintAreaSqFt({
        length: 12,
        width: 10,
        height: 10,
        unit: 'ft',
        includeCeiling: true,
        openings: 40,
      }),
    ).toBe(520)
  })

  it('converts metric rooms to sq ft', () => {
    const area = roomPaintAreaSqFt({
      length: 4,
      width: 3,
      height: 3,
      unit: 'm',
      includeCeiling: false,
      openings: 0,
    })
    expect(area).toBeCloseTo(42 * 10.7639, 3)
  })

  it('scales litres with coats and adds putty only when asked', () => {
    expect(
      calculatePaint({
        areaSqFt: 900,
        coats: 2,
        coverageSqFtPerLitre: 90,
        includePutty: false,
        puttyCoverageSqFtPerKg: 20,
      }),
    ).toEqual({ litres: 20, puttyKg: 0 })
    expect(
      calculatePaint({
        areaSqFt: 900,
        coats: 2,
        coverageSqFtPerLitre: 90,
        includePutty: true,
        puttyCoverageSqFtPerKg: 20,
      }).puttyKg,
    ).toBe(45)
  })
})

describe('mortar and brickwork', () => {
  it('splits dry mortar volume by the mix', () => {
    const r = mortarMaterials(1, 6)
    expect(r.cementBags).toBeCloseTo(1.33 / 7 / 0.0347, 6)
    expect(r.sandCuFt).toBeCloseTo(((1.33 * 6) / 7) * 35.3147, 6)
  })

  it('counts about 409 common bricks per m³ of 9 inch wall', () => {
    // 1 m long × 4.3478 m high × 0.23 m thick = 1 m³
    const r = calculateBrickwork({
      length: 1,
      height: 1 / 0.23,
      unit: 'm',
      thickness: 'full',
      brick: 'standard',
      openings: 0,
      mix: 6,
      wastagePct: 0,
    })
    expect(r.wallVolumeM3).toBeCloseTo(1, 6)
    expect(r.bricks).toBe(409)
    expect(r.cementBags).toBeGreaterThan(1.1)
    expect(r.cementBags).toBeLessThan(1.4)
  })

  it('counts 500 modular bricks per m³ and uses brick width for half-brick walls', () => {
    const full = calculateBrickwork({
      length: 1,
      height: 1 / 0.19,
      unit: 'm',
      thickness: 'full',
      brick: 'modular',
      openings: 0,
      mix: 6,
      wastagePct: 0,
    })
    expect(full.bricks).toBe(500)
    const half = calculateBrickwork({
      length: 10,
      height: 10,
      unit: 'ft',
      thickness: 'half',
      brick: 'standard',
      openings: 0,
      mix: 4,
      wastagePct: 5,
    })
    expect(half.thicknessMm).toBe(110)
  })

  it('deducts openings and never goes negative', () => {
    const r = calculateBrickwork({
      length: 2,
      height: 2,
      unit: 'm',
      thickness: 'full',
      brick: 'standard',
      openings: 10,
      mix: 6,
      wastagePct: 5,
    })
    expect(r).toMatchObject({ bricks: 0, cementBags: 0, sandCuFt: 0 })
  })
})

describe('calculatePlaster', () => {
  it('matches the material calculator at 12 mm 1:4 with no wastage', () => {
    // material-calc uses 0.092 bags per m² at 12 mm, 1:4
    const r = calculatePlaster({
      areaSqFt: 10.7639,
      thicknessMm: 12,
      mix: 4,
      wastagePct: 0,
    })
    expect(r.cementBags).toBeCloseTo(0.092, 3)
  })
})

describe('steel', () => {
  it('uses d²/162 for bar weight', () => {
    expect(barWeightKgPerM(12)).toBeCloseTo(0.889, 3)
    expect(barsWeightKg(10, 12, 10)).toBeCloseTo((100 / 162) * 120, 6)
  })

  it('works out steel from concrete volume and percentage', () => {
    expect(steelByVolumeKg(1, 1)).toBeCloseTo(78.5, 6)
    expect(steelByVolumeKg(0, 2)).toBe(0)
  })
})

describe('figures quoted in the FAQs', () => {
  it('10 × 10 ft wall: about 920 bricks at 9 inch, about 440 at 4.5 inch (5% wastage)', () => {
    const base = {
      length: 10,
      height: 10,
      unit: 'ft' as const,
      brick: 'standard' as const,
      openings: 0,
      wastagePct: 5,
    }
    const full = calculateBrickwork({
      ...base,
      thickness: 'full',
      mix: 6,
    }).bricks
    const half = calculateBrickwork({
      ...base,
      thickness: 'half',
      mix: 4,
    }).bricks
    expect(Math.abs(full - 920)).toBeLessThanOrEqual(10)
    expect(Math.abs(half - 440)).toBeLessThanOrEqual(10)
  })

  it('100 sq ft of 12 mm 1:4 plaster with 5% wastage: about 0.9 bags and 4.4 cu ft', () => {
    const r = calculatePlaster({
      areaSqFt: 100,
      thicknessMm: 12,
      mix: 4,
      wastagePct: 5,
    })
    expect(r.cementBags).toBeCloseTo(0.9, 1)
    expect(r.sandCuFt).toBeCloseTo(4.4, 1)
  })

  it('12 × 10 ft room: about 9 litres for walls, 11.6 with ceiling, two coats', () => {
    const room = {
      length: 12,
      width: 10,
      height: 10,
      unit: 'ft' as const,
      openings: 40,
    }
    const paint = (includeCeiling: boolean) =>
      calculatePaint({
        areaSqFt: roomPaintAreaSqFt({ ...room, includeCeiling }),
        coats: 2,
        coverageSqFtPerLitre: 90,
        includePutty: false,
        puttyCoverageSqFtPerKg: 20,
      }).litres
    expect(paint(false)).toBeCloseTo(8.9, 1)
    expect(paint(true)).toBeCloseTo(11.6, 1)
  })

  it('1,000 sq ft slab at 125 mm and 1%: roughly 900 kg', () => {
    expect(steelByVolumeKg((1000 / 10.7639) * 0.125, 1)).toBeCloseTo(911.6, 0)
  })
})
