/**
 * Indian construction material rates — refresh quarterly.
 * Source: average of Houseyog / IndiaMart / contractor quotes (Tier-1 cities, 2026-Q2).
 * Users can override these on the calculator page.
 */
export const MATERIAL_RATES = {
  cement: { value: 400, unit: 'bag', label: 'Cement (50kg bag)' },
  sand: { value: 65, unit: 'cuft', label: 'Sand' },
  aggregate: { value: 55, unit: 'cuft', label: 'Aggregate (20mm)' },
  bricks: { value: 10, unit: 'each', label: 'Bricks (red clay)' },
  steel: { value: 70, unit: 'kg', label: 'Steel (TMT bar)' },
} as const

export const RATES_LAST_UPDATED = '2026-05'
