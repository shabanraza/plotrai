import { describe, expect, it } from 'vitest'
import { resolveRelatedTools } from '#/components/tools/related-tools-section'
import { CITY_CONTENT } from '#/data/city-construction-content'
import {
  CONSTRUCTION_COST_RELATED_TOOLS,
  MATERIAL_RELATED_TOOLS,
  cityRelatedTools,
  solarPathForCity,
} from '#/data/related-tools'

describe('RelatedToolsSection', () => {
  it('resolves the material and construction cost lists from the site map', () => {
    expect(resolveRelatedTools(MATERIAL_RELATED_TOOLS)).toHaveLength(
      MATERIAL_RELATED_TOOLS.length,
    )
    expect(resolveRelatedTools(CONSTRUCTION_COST_RELATED_TOOLS)).toHaveLength(
      CONSTRUCTION_COST_RELATED_TOOLS.length,
    )
  })

  it('resolves the related tools for every construction cost city', () => {
    for (const c of CITY_CONTENT) {
      expect(
        resolveRelatedTools(cityRelatedTools(c.slug)),
        c.slug,
      ).toHaveLength(3)
    }
  })

  it('falls back to the solar calculator for a city without a solar page', () => {
    expect(solarPathForCity('north-bangalore')).toBe(
      '/solar-panel-cost-calculator',
    )
    expect(solarPathForCity('lucknow')).toBe('/solar-panel-cost/lucknow')
  })

  it('does not repeat the next-step link on the construction cost page', () => {
    expect(CONSTRUCTION_COST_RELATED_TOOLS).not.toContain(
      '/material-calculator',
    )
  })

  it('throws for a path that is not in the site map', () => {
    expect(() => resolveRelatedTools(['/not-a-tool'])).toThrow()
  })
})
