/**
 * Formulas for the tiles, paint, brick, plaster and steel calculators.
 * Pure functions so every number on those pages can be unit-tested.
 *
 * Shared conventions:
 * - 50 kg cement bag = 0.0347 m³ (bulk density 1,440 kg/m³)
 * - Dry volume of mortar = wet volume × 1.33 (bulking of sand and voids), the same factor
 *   used by `material-calc.ts`
 * - Steel density 7,850 kg/m³, so bar weight per metre = d² / 162 (d in mm)
 */

export const SQFT_PER_SQM = 10.7639
export const CUFT_PER_CUM = 35.3147
export const FT_PER_M = 3.28084
export const CEMENT_BAG_M3 = 0.0347
export const DRY_VOLUME_FACTOR = 1.33
export const STEEL_DENSITY = 7850

export type LengthUnit = 'ft' | 'm'

/** Converts a length to metres. */
export function toMetres(value: number, unit: LengthUnit): number {
  return unit === 'm' ? value : value / FT_PER_M
}

/** Converts an area in the unit's square to square feet. */
export function toSqFt(area: number, unit: LengthUnit): number {
  return unit === 'ft' ? area : area * SQFT_PER_SQM
}

function positive(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0
}

/* Tiles */

export const TILE_SIZES = [
  { id: '600x600', label: '600 × 600 mm (2 × 2 ft)', w: 600, h: 600 },
  { id: '600x1200', label: '600 × 1200 mm (2 × 4 ft)', w: 600, h: 1200 },
  { id: '800x800', label: '800 × 800 mm', w: 800, h: 800 },
  { id: '800x1600', label: '800 × 1600 mm', w: 800, h: 1600 },
  { id: '300x300', label: '300 × 300 mm (1 × 1 ft)', w: 300, h: 300 },
  { id: '300x450', label: '300 × 450 mm (wall)', w: 300, h: 450 },
  { id: '300x600', label: '300 × 600 mm (wall)', w: 300, h: 600 },
] as const

export interface TilesInput {
  areaSqFt: number
  tileWidthMm: number
  tileHeightMm: number
  wastagePct: number
  /** Printed on the box; leave 0 when unknown */
  tilesPerBox?: number
}

export interface TilesResult {
  tiles: number
  boxes: number | null
  tileAreaSqFt: number
  areaWithWastageSqFt: number
}

export function calculateTiles(input: TilesInput): TilesResult {
  const tileAreaSqFt =
    ((positive(input.tileWidthMm) * positive(input.tileHeightMm)) / 1e6) *
    SQFT_PER_SQM
  const areaWithWastageSqFt =
    positive(input.areaSqFt) * (1 + positive(input.wastagePct) / 100)
  if (tileAreaSqFt === 0 || areaWithWastageSqFt === 0) {
    return { tiles: 0, boxes: null, tileAreaSqFt, areaWithWastageSqFt }
  }
  const tiles = Math.ceil(areaWithWastageSqFt / tileAreaSqFt - 1e-9)
  const perBox = positive(input.tilesPerBox ?? 0)
  return {
    tiles,
    boxes: perBox > 0 ? Math.ceil(tiles / perBox) : null,
    tileAreaSqFt,
    areaWithWastageSqFt,
  }
}

/* Paint */

/** Asian Paints Apcolite Premium Emulsion TDS: 8.4 m²/litre per coat at 50 µm typical. */
export const DEFAULT_PAINT_COVERAGE_SQFT = 90
/** Birla White WallCare Putty: 1.86–2.04 m²/kg (about 20–22 sq ft); we use the lower end. */
export const DEFAULT_PUTTY_COVERAGE_SQFT = 20

export interface RoomInput {
  length: number
  width: number
  height: number
  unit: LengthUnit
  includeCeiling: boolean
  /** Doors and windows to leave out, in the unit's square */
  openings: number
}

/** Paintable area of a room's four walls (and ceiling) in sq ft. */
export function roomPaintAreaSqFt(room: RoomInput): number {
  const l = positive(room.length)
  const w = positive(room.width)
  const h = positive(room.height)
  const walls = 2 * (l + w) * h
  const ceiling = room.includeCeiling ? l * w : 0
  const area = Math.max(0, walls + ceiling - positive(room.openings))
  return toSqFt(area, room.unit)
}

export interface PaintInput {
  areaSqFt: number
  coats: number
  coverageSqFtPerLitre: number
  includePutty: boolean
  puttyCoverageSqFtPerKg: number
}

export interface PaintResult {
  litres: number
  puttyKg: number
}

export function calculatePaint(input: PaintInput): PaintResult {
  const area = positive(input.areaSqFt)
  const coverage = positive(input.coverageSqFtPerLitre)
  const puttyCoverage = positive(input.puttyCoverageSqFtPerKg)
  return {
    litres: coverage ? (area * positive(input.coats)) / coverage : 0,
    puttyKg: input.includePutty && puttyCoverage ? area / puttyCoverage : 0,
  }
}

/* Mortar shared by brickwork and plaster */

export const MORTAR_MIXES = [3, 4, 5, 6] as const
export type MortarMix = (typeof MORTAR_MIXES)[number]

export interface MortarResult {
  cementBags: number
  sandCuFt: number
}

/** Cement and sand for a wet mortar volume at 1 : mix (cement : sand). */
export function mortarMaterials(wetM3: number, mix: number): MortarResult {
  const dry = positive(wetM3) * DRY_VOLUME_FACTOR
  const parts = 1 + positive(mix)
  return {
    cementBags: dry / parts / CEMENT_BAG_M3,
    sandCuFt: ((dry * positive(mix)) / parts) * CUFT_PER_CUM,
  }
}

/* Bricks */

export const BRICK_SIZES = [
  {
    id: 'standard',
    label: '230 × 110 × 75 mm (common)',
    l: 230,
    w: 110,
    h: 75,
  },
  {
    id: 'modular',
    label: '190 × 90 × 90 mm (IS modular)',
    l: 190,
    w: 90,
    h: 90,
  },
] as const
export type BrickSizeId = (typeof BRICK_SIZES)[number]['id']

export type WallThickness = 'half' | 'full'

export interface BrickworkInput {
  length: number
  height: number
  unit: LengthUnit
  thickness: WallThickness
  brick: BrickSizeId
  /** Doors and windows, in the unit's square */
  openings: number
  mix: number
  wastagePct: number
  jointMm?: number
}

export interface BrickworkResult extends MortarResult {
  bricks: number
  wallVolumeM3: number
  thicknessMm: number
}

export function calculateBrickwork(input: BrickworkInput): BrickworkResult {
  const brick = BRICK_SIZES.find((b) => b.id === input.brick) ?? BRICK_SIZES[0]
  const joint = (input.jointMm ?? 10) / 1000
  const thicknessMm = input.thickness === 'half' ? brick.w : brick.l
  const lengthM = toMetres(positive(input.length), input.unit)
  const heightM = toMetres(positive(input.height), input.unit)
  const openingsM2 =
    input.unit === 'm'
      ? positive(input.openings)
      : positive(input.openings) / SQFT_PER_SQM
  const wallAreaM2 = Math.max(0, lengthM * heightM - openingsM2)
  const wallVolumeM3 = wallAreaM2 * (thicknessMm / 1000)

  if (wallVolumeM3 === 0) {
    return {
      bricks: 0,
      cementBags: 0,
      sandCuFt: 0,
      wallVolumeM3: 0,
      thicknessMm,
    }
  }

  const l = brick.l / 1000
  const w = brick.w / 1000
  const h = brick.h / 1000
  const bricksNet = wallVolumeM3 / ((l + joint) * (w + joint) * (h + joint))
  const mortarWet = Math.max(0, wallVolumeM3 - bricksNet * l * w * h)

  return {
    bricks: Math.ceil(
      bricksNet * (1 + positive(input.wastagePct) / 100) - 1e-9,
    ),
    ...mortarMaterials(mortarWet, input.mix),
    wallVolumeM3,
    thicknessMm,
  }
}

/* Plaster */

/** Common plaster thickness by surface on Indian sites. */
export const PLASTER_THICKNESS = [
  { mm: 6, label: '6 mm', hint: 'Ceiling' },
  { mm: 12, label: '12 mm', hint: 'Inside walls' },
  { mm: 15, label: '15 mm', hint: 'Rough brick, inside' },
  { mm: 20, label: '20 mm', hint: 'Outside walls' },
] as const

export interface PlasterInput {
  areaSqFt: number
  thicknessMm: number
  mix: number
  wastagePct: number
}

export interface PlasterResult extends MortarResult {
  wetVolumeM3: number
}

export function calculatePlaster(input: PlasterInput): PlasterResult {
  const areaM2 = positive(input.areaSqFt) / SQFT_PER_SQM
  const wet =
    areaM2 *
    (positive(input.thicknessMm) / 1000) *
    (1 + positive(input.wastagePct) / 100)
  return { wetVolumeM3: wet, ...mortarMaterials(wet, input.mix) }
}

/* Steel */

export const BAR_DIAMETERS = [6, 8, 10, 12, 16, 20, 25, 32] as const

/** Weight of one metre of bar in kg: d² / 162 (from 7,850 kg/m³). */
export function barWeightKgPerM(diameterMm: number): number {
  return positive(diameterMm) ** 2 / 162
}

export function barsWeightKg(
  diameterMm: number,
  lengthM: number,
  count: number,
): number {
  return barWeightKgPerM(diameterMm) * positive(lengthM) * positive(count)
}

export const STEEL_ELEMENTS = [
  {
    id: 'slab',
    label: 'Slab',
    defaultPct: 1,
    note: 'IS 456 minimum is 0.12% of the gross section for HYSD bars.',
  },
  {
    id: 'beam',
    label: 'Beam',
    defaultPct: 1.5,
    note: 'IS 456 caps tension steel in a beam at 4% of the section.',
  },
  {
    id: 'column',
    label: 'Column',
    defaultPct: 2,
    note: 'IS 456 allows 0.8% to 6% in a column (4% is the practical upper limit).',
  },
  {
    id: 'footing',
    label: 'Footing',
    defaultPct: 0.8,
    note: 'IS 456 minimum is 0.12% of the gross section for HYSD bars.',
  },
] as const
export type SteelElementId = (typeof STEEL_ELEMENTS)[number]['id']

/** Steel for a concrete volume at a given percentage of the section. */
export function steelByVolumeKg(volumeM3: number, percent: number): number {
  return positive(volumeM3) * (positive(percent) / 100) * STEEL_DENSITY
}

/** Quantity formatter shared by the calculator pages. */
export function formatQty(n: number, digits = 2): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n >= 100) return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  return n.toLocaleString('en-IN', { maximumFractionDigits: digits })
}
