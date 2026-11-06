import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  SOLAR_CITIES,
  SOLAR_CITY_BY_SLUG,
  buildSolarCityContent,
  solarCityExample,
} from '#/data/solar-city-content'

function city(slug: string) {
  const c = SOLAR_CITY_BY_SLUG.get(slug)
  if (!c) throw new Error(`missing ${slug}`)
  return c
}

describe('solar city pages', () => {
  it('lists every city in the sitemap with distinct titles', () => {
    const sitemap = readFileSync(
      resolve(process.cwd(), 'public/sitemap.xml'),
      'utf8',
    )
    for (const c of SOLAR_CITIES) {
      expect(sitemap).toContain(`https://plotrai.in/solar-panel-cost/${c.slug}`)
    }
    const titles = SOLAR_CITIES.map((c) => buildSolarCityContent(c).title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('applies the UPNEDA top-up in UP cities', () => {
    const ex = solarCityExample(city('lucknow'))
    expect(ex.stateSubsidy).toBe(30000)
    expect(ex.netCost).toBe(180000 - 78000 - 30000)
  })

  it('applies the Delhi portal subsidy and nothing elsewhere', () => {
    expect(solarCityExample(city('delhi')).stateSubsidy).toBe(6000)
    expect(solarCityExample(city('mumbai')).stateSubsidy).toBe(0)
    expect(solarCityExample(city('ahmedabad')).stateSubsidy).toBe(0)
  })

  it('cites a source for every state summary', () => {
    for (const c of SOLAR_CITIES) {
      const content = buildSolarCityContent(c)
      for (const s of content.sources) expect(s.url).toMatch(/^https:\/\//)
      expect(content.faqs.length).toBeGreaterThanOrEqual(4)
    }
  })
})
