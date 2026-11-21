import { SOLAR_CITY_BY_SLUG, solarCityPath } from '#/data/solar-city-content'

/** "More calculators" links on each page. Tested against the site map in related-tools-section.test.ts. */
export const MATERIAL_RELATED_TOOLS = [
  '/brick-calculator',
  '/steel-calculator',
  '/plaster-calculator',
  '/tiles-calculator',
  '/paint-calculator',
  '/concrete-calculator',
  '/rcc-slab-calculator',
] as const

/** The next-step card on this page already links the material calculator, so it is left out here. */
export const CONSTRUCTION_COST_RELATED_TOOLS = [
  '/brick-calculator',
  '/steel-calculator',
  '/tiles-calculator',
  '/paint-calculator',
  '/home-interior-cost-calculator',
  '/solar-panel-cost-calculator',
] as const

/** The city's solar page, or the solar calculator for a city without one (north-bangalore). */
export function solarPathForCity(slug: string): string {
  return SOLAR_CITY_BY_SLUG.has(slug)
    ? solarCityPath(slug)
    : '/solar-panel-cost-calculator'
}

export function cityRelatedTools(slug: string): ReadonlyArray<string> {
  return [
    '/material-calculator',
    '/home-interior-cost-calculator',
    solarPathForCity(slug),
  ]
}
