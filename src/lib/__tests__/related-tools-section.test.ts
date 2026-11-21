import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveRelatedTools } from '#/components/tools/related-tools-section'
import { SOLAR_CITIES, solarCityPath } from '#/data/solar-city-content'

const ROUTES = ['material-calculator', 'construction-cost-calculator', 'construction-cost/$city']
const PATHS = [
  '/brick-calculator',
  '/steel-calculator',
  '/plaster-calculator',
  '/tiles-calculator',
  '/paint-calculator',
  '/concrete-calculator',
  '/rcc-slab-calculator',
  '/material-calculator',
  '/home-interior-cost-calculator',
  '/solar-panel-cost-calculator',
]

describe('RelatedToolsSection', () => {
  it('resolves every path used on the pages from the site map', () => {
    expect(resolveRelatedTools(PATHS).map((e) => e.to)).toEqual(PATHS)
    expect(resolveRelatedTools(SOLAR_CITIES.map((c) => solarCityPath(c.slug)))).toHaveLength(
      SOLAR_CITIES.length,
    )
  })

  it('throws for a path that is not in the site map', () => {
    expect(() => resolveRelatedTools(['/not-a-tool'])).toThrow()
  })

  it('is used by each target route', () => {
    for (const r of ROUTES) {
      const src = readFileSync(resolve(process.cwd(), `src/routes/${r}.tsx`), 'utf8')
      expect(src, r).toContain('RelatedToolsSection')
    }
  })
})
