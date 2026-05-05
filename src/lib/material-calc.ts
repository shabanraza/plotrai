/**
 * Construction material estimation formulas.
 * All coefficients are per cubic metre of finished element (or per m² for plaster).
 *
 * Mix conventions:
 * - Brickwork: 1:6 cement-sand mortar with 230×110×75mm bricks + 10mm joints
 * - RCC slab/column: M20 (1:1.5:3) with 1.54 dry-volume factor
 * - PCC: 1:2:4
 * - Plaster: 1:4 cement-sand at 12mm baseline thickness
 *
 * Sources cross-checked with civil-engineering thumb rules used by Indian site engineers.
 */

export type ElementType =
  | 'brickwork'
  | 'rcc_slab'
  | 'rcc_column'
  | 'pcc'
  | 'plaster'

export interface Materials {
  cement: number // bags (50 kg)
  sand: number // cuft
  aggregate: number // cuft
  bricks: number // count
  steel: number // kg
}

interface Coefficients extends Materials {}

const ZERO: Materials = { cement: 0, sand: 0, aggregate: 0, bricks: 0, steel: 0 }

const COEFFICIENTS: Record<ElementType, Coefficients> = {
  brickwork: { cement: 1.4, sand: 9, aggregate: 0, bricks: 500, steel: 0 },
  rcc_slab: { cement: 8, sand: 14.8, aggregate: 29.7, bricks: 0, steel: 80 },
  rcc_column: { cement: 8, sand: 14.8, aggregate: 29.7, bricks: 0, steel: 130 },
  pcc: { cement: 6.3, sand: 14, aggregate: 28, bricks: 0, steel: 0 },
  plaster: { cement: 0.092, sand: 0.42, aggregate: 0, bricks: 0, steel: 0 }, // per m² at 12mm
}

export interface Dimensions {
  length: number // metres
  width: number // metres (or height, depending on element)
  thickness: number // metres for solids; millimetres for plaster
}

export function calculateMaterials(
  element: ElementType,
  d: Dimensions,
): Materials {
  const c = COEFFICIENTS[element]
  if (d.length <= 0 || d.width <= 0 || d.thickness <= 0) return ZERO

  let multiplier: number

  if (element === 'plaster') {
    // length × width = area (m²); thickness in mm. Coefficient is at 12mm baseline.
    const area = d.length * d.width
    const thicknessFactor = d.thickness / 12
    multiplier = area * thicknessFactor
  } else {
    // Volumes in m³
    multiplier = d.length * d.width * d.thickness
  }

  return {
    cement: c.cement * multiplier,
    sand: c.sand * multiplier,
    aggregate: c.aggregate * multiplier,
    bricks: c.bricks * multiplier,
    steel: c.steel * multiplier,
  }
}

export const ELEMENT_META: Record<
  ElementType,
  {
    label: string
    helper: string
    inputs: Array<{ key: keyof Dimensions; label: string; defaultMm?: number }>
  }
> = {
  brickwork: {
    label: 'Brickwork (wall)',
    helper: '1:6 cement-sand mortar · 230×110×75mm bricks',
    inputs: [
      { key: 'length', label: 'Wall length (m)' },
      { key: 'width', label: 'Wall height (m)' },
      { key: 'thickness', label: 'Wall thickness (mm)', defaultMm: 230 },
    ],
  },
  rcc_slab: {
    label: 'RCC Slab',
    helper: 'M20 mix (1:1.5:3) · steel @ ~80 kg/m³',
    inputs: [
      { key: 'length', label: 'Slab length (m)' },
      { key: 'width', label: 'Slab width (m)' },
      { key: 'thickness', label: 'Slab thickness (mm)', defaultMm: 150 },
    ],
  },
  rcc_column: {
    label: 'RCC Column',
    helper: 'M20 mix · steel @ ~130 kg/m³ (typical column %)',
    inputs: [
      { key: 'length', label: 'Column side A (m)' },
      { key: 'width', label: 'Column side B (m)' },
      { key: 'thickness', label: 'Column height (mm)', defaultMm: 3000 },
    ],
  },
  pcc: {
    label: 'PCC (foundation / base)',
    helper: 'Plain cement concrete · 1:2:4 mix',
    inputs: [
      { key: 'length', label: 'Length (m)' },
      { key: 'width', label: 'Width (m)' },
      { key: 'thickness', label: 'Thickness (mm)', defaultMm: 100 },
    ],
  },
  plaster: {
    label: 'Plaster',
    helper: '1:4 cement-sand at the chosen thickness',
    inputs: [
      { key: 'length', label: 'Wall length (m)' },
      { key: 'width', label: 'Wall height (m)' },
      { key: 'thickness', label: 'Plaster thickness (mm)', defaultMm: 12 },
    ],
  },
}
