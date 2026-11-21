import {
  FT_PER_M,
  calculateBrickwork,
  calculatePlaster,
  type WallThickness,
} from '#/lib/finishing-calc'
import { calculateMaterials } from '#/lib/material-calc'

export interface CivilWorkInput {
  wall: { lengthFt: number; heightFt: number; thickness: WallThickness; openingsSqFt: number }
  /** Plaster area in sq ft (both faces of the wall, if both are plastered) */
  plaster: { areaSqFt: number; thicknessMm: number }
  slab: { lengthFt: number; widthFt: number; thicknessMm: number }
}

export interface CivilWorkQuantities {
  bricks: number
  cementBags: number
  sandCuFt: number
  aggregateCuFt: number
  steelKg: number
  wallAreaSqFt: number
  plasterAreaSqFt: number
  slabAreaSqFt: number
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0)

/**
 * Combined material for a civil work quotation: brickwork (1:6, 5% wastage) and plaster (1:4,
 * 10% wastage) from finishing-calc, and an M20 RCC slab from material-calc.
 */
export function civilWorkQuantities(input: CivilWorkInput): CivilWorkQuantities {
  const brick = calculateBrickwork({
    length: input.wall.lengthFt,
    height: input.wall.heightFt,
    unit: 'ft',
    thickness: input.wall.thickness,
    brick: 'standard',
    openings: input.wall.openingsSqFt,
    mix: 6,
    wastagePct: 5,
  })
  const plaster = calculatePlaster({
    areaSqFt: input.plaster.areaSqFt,
    thicknessMm: input.plaster.thicknessMm,
    mix: 4,
    wastagePct: 10,
  })
  const slab = calculateMaterials('rcc_slab', {
    length: pos(input.slab.lengthFt) / FT_PER_M,
    width: pos(input.slab.widthFt) / FT_PER_M,
    thickness: pos(input.slab.thicknessMm) / 1000,
  })
  return {
    bricks: brick.bricks,
    cementBags: brick.cementBags + plaster.cementBags + slab.cement,
    sandCuFt: brick.sandCuFt + plaster.sandCuFt + slab.sand,
    aggregateCuFt: slab.aggregate,
    steelKg: slab.steel,
    wallAreaSqFt: Math.max(
      0,
      pos(input.wall.lengthFt) * pos(input.wall.heightFt) - pos(input.wall.openingsSqFt),
    ),
    plasterAreaSqFt: pos(input.plaster.areaSqFt),
    slabAreaSqFt: pos(input.slab.lengthFt) * pos(input.slab.widthFt),
  }
}
