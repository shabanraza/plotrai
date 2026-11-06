/**
 * Home interior cost, item by item. There are no official rates for interiors, so every range
 * below is a vendor price guide figure (see `src/data/interior-calc-content.ts` for the links):
 *
 * - Modular kitchen and living room by size, bathroom per room: NoBroker, June 2026
 * - Wardrobe per piece, false ceiling, painting: DesignCafe, September 2026
 *
 * The finish level picks a point in each range: essential = low end, mid-range = midpoint,
 * premium = high end.
 */

export type Finish = 'essential' | 'mid' | 'premium'
export type RoomSize = 'small' | 'medium' | 'large'
export type CeilingScope = 'none' | 'living' | 'whole'
export type Range = readonly [number, number]

export const FINISHES: ReadonlyArray<{ id: Finish; label: string }> = [
  { id: 'essential', label: 'Essential' },
  { id: 'mid', label: 'Mid-range' },
  { id: 'premium', label: 'Premium' },
]

const FINISH_POINT: Record<Finish, number> = {
  essential: 0,
  mid: 0.5,
  premium: 1,
}

/** NoBroker: small 50–80 sq ft, medium 80–120 sq ft, large 120+ sq ft. */
export const KITCHEN: Record<RoomSize, Range> = {
  small: [100000, 200000],
  medium: [200000, 350000],
  large: [350000, 500000],
}
/** NoBroker: seating, TV unit and lighting; small 100–150, medium 150–250, large 250+ sq ft. */
export const LIVING: Record<RoomSize, Range> = {
  small: [50000, 100000],
  medium: [100000, 200000],
  large: [200000, 300000],
}
/** DesignCafe: ₹60,000–1.5 lakh per wardrobe. */
export const WARDROBE: Range = [60000, 150000]
/** DesignCafe: POP false ceiling ₹60–120 per sq ft; living and dining about ₹60,000–1.5 lakh. */
export const CEILING_PER_SQFT: Range = [60, 120]
export const CEILING_LIVING: Range = [60000, 150000]
/** DesignCafe: ₹18–25 per sq ft standard emulsion, ₹28–35 premium washable (wall area). */
export const PAINT_PER_SQFT: Range = [18, 35]
/**
 * Wall area per sq ft of floor. DesignCafe prices painting a 1,300 sq ft 3BHK at
 * ₹55,000–1.1 lakh, which at ₹18–35 per sq ft is about 3,100 sq ft of wall: 2.4 × the floor.
 */
export const WALL_AREA_FACTOR = 2.4
/** NoBroker: standard bathroom ₹30,000–80,000 up to premium ₹80,000–1.5 lakh. */
export const BATHROOM: Range = [30000, 150000]

export const BHK_OPTIONS = [1, 2, 3, 4] as const
export type Bhk = (typeof BHK_OPTIONS)[number]

/** Typical carpet area and room sizes used as starting values for each BHK. */
export const BHK_DEFAULTS: Record<
  Bhk,
  { carpetSqFt: number; kitchen: RoomSize; living: RoomSize }
> = {
  1: { carpetSqFt: 500, kitchen: 'small', living: 'small' },
  2: { carpetSqFt: 850, kitchen: 'medium', living: 'medium' },
  3: { carpetSqFt: 1300, kitchen: 'medium', living: 'medium' },
  4: { carpetSqFt: 1800, kitchen: 'large', living: 'large' },
}

function positive(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function pick(range: Range, finish: Finish): number {
  const [low, high] = range
  return low + (high - low) * FINISH_POINT[finish]
}

export interface InteriorInput {
  finish: Finish
  carpetSqFt: number
  kitchen: RoomSize | 'none'
  living: RoomSize | 'none'
  wardrobes: number
  ceiling: CeilingScope
  painting: boolean
  bathrooms: number
}

export interface InteriorLine {
  id: string
  label: string
  detail: string
  amount: number
}

export function interiorLines(input: InteriorInput): InteriorLine[] {
  const f = input.finish
  const area = positive(input.carpetSqFt)
  const lines: InteriorLine[] = []

  if (input.kitchen !== 'none') {
    lines.push({
      id: 'kitchen',
      label: 'Modular kitchen',
      detail: `${input.kitchen} kitchen, cabinets, counter and hardware`,
      amount: pick(KITCHEN[input.kitchen], f),
    })
  }
  const wardrobes = Math.floor(positive(input.wardrobes))
  if (wardrobes > 0) {
    lines.push({
      id: 'wardrobes',
      label: 'Wardrobes',
      detail: `${wardrobes} × ₹${Math.round(pick(WARDROBE, f)).toLocaleString('en-IN')}`,
      amount: wardrobes * pick(WARDROBE, f),
    })
  }
  if (input.living !== 'none') {
    lines.push({
      id: 'living',
      label: 'Living room',
      detail: `${input.living} living room: TV unit, seating and lighting`,
      amount: pick(LIVING[input.living], f),
    })
  }
  if (input.ceiling === 'living') {
    lines.push({
      id: 'ceiling',
      label: 'False ceiling',
      detail: 'Living and dining',
      amount: pick(CEILING_LIVING, f),
    })
  } else if (input.ceiling === 'whole' && area > 0) {
    lines.push({
      id: 'ceiling',
      label: 'False ceiling',
      detail: `${area.toLocaleString('en-IN')} sq ft × ₹${Math.round(pick(CEILING_PER_SQFT, f))}`,
      amount: area * pick(CEILING_PER_SQFT, f),
    })
  }
  if (input.painting && area > 0) {
    const wall = area * WALL_AREA_FACTOR
    lines.push({
      id: 'painting',
      label: 'Painting',
      detail: `About ${Math.round(wall).toLocaleString('en-IN')} sq ft of wall × ₹${pick(PAINT_PER_SQFT, f)}`,
      amount: wall * pick(PAINT_PER_SQFT, f),
    })
  }
  const baths = Math.floor(positive(input.bathrooms))
  if (baths > 0) {
    lines.push({
      id: 'bathrooms',
      label: 'Bathroom upgrade',
      detail: `${baths} × ₹${Math.round(pick(BATHROOM, f)).toLocaleString('en-IN')}`,
      amount: baths * pick(BATHROOM, f),
    })
  }
  return lines
}

export function interiorTotal(input: InteriorInput): number {
  return interiorLines(input).reduce((sum, l) => sum + l.amount, 0)
}

/** ₹12.4 lakh style figure for headlines; rupees below one lakh. */
export function formatLakh(n: number): string {
  const v = Number.isFinite(n) ? n : 0
  if (v < 100000) return `₹${Math.round(v).toLocaleString('en-IN')}`
  const lakh = v / 100000
  return `₹${lakh.toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh`
}
