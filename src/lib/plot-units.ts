export type LandRegion = 'pan-india' | 'north' | 'south' | 'east' | 'west'

export interface UnitDef {
  label: string
  toSqft: number
  region: LandRegion
  note?: string
}

export const LAND_UNIT_LAST_UPDATED = '2026-06-22'

export const LAND_UNIT_SOURCE_URLS = [
  'https://plotrai.in/plot-converter',
  'Local Indian land-record unit conventions vary by state and district; values are planning standards only.',
] as const

export const LAND_UNITS = {
  sqft: { label: 'Square Feet', toSqft: 1, region: 'pan-india' },
  sqm: { label: 'Square Meters', toSqft: 10.7639, region: 'pan-india' },
  sqyd: { label: 'Square Yards (Gaj)', toSqft: 9, region: 'pan-india' },
  acre: { label: 'Acre', toSqft: 43560, region: 'pan-india' },
  hectare: { label: 'Hectare', toSqft: 107639, region: 'pan-india' },
  bigha_uttar: { label: 'Bigha (UP / Bihar)', toSqft: 27000, region: 'north' },
  marla: {
    label: 'Marla',
    toSqft: 272.25,
    region: 'north',
    note: 'Punjab / Haryana',
  },
  kanal: {
    label: 'Kanal',
    toSqft: 5445,
    region: 'north',
    note: 'Punjab / Haryana / J&K',
  },
  gunta: {
    label: 'Gunta',
    toSqft: 1089,
    region: 'south',
    note: 'Karnataka / Maharashtra / AP',
  },
  cent: {
    label: 'Cent',
    toSqft: 435.6,
    region: 'south',
    note: 'Tamil Nadu / Kerala',
  },
  ground: {
    label: 'Ground',
    toSqft: 2400,
    region: 'south',
    note: 'Tamil Nadu',
  },
  ankanam: {
    label: 'Ankanam',
    toSqft: 72,
    region: 'south',
    note: 'Andhra / Telangana',
  },
  bigha_west_bengal: {
    label: 'Bigha (West Bengal)',
    toSqft: 14400,
    region: 'east',
  },
  katha_bihar: { label: 'Katha (Bihar)', toSqft: 1361.25, region: 'east' },
  bigha_rajasthan: {
    label: 'Bigha Pucca (Rajasthan)',
    toSqft: 27225,
    region: 'west',
  },
} as const satisfies Record<string, UnitDef>

export type UnitKey = keyof typeof LAND_UNITS

export function convertLandArea(
  value: number,
  from: UnitKey,
  to: UnitKey,
): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return (value * LAND_UNITS[from].toSqft) / LAND_UNITS[to].toSqft
}
