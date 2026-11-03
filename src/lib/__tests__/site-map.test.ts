import { describe, expect, it } from 'vitest'
import { TOPIC_HUB_DESTINATION } from '#/data/blog-content'
import { CITY_CONTENT } from '#/data/city-construction-content'
import { HUB_CONTENT } from '#/data/hub-content'
import { LAND_UNIT_PAGES } from '#/data/land-unit-pages'
import {
  SITE_ENTRIES,
  SITE_HUBS,
  SITE_PROGRAMMATIC,
  breadcrumbForPath,
  entriesForHub,
  hubPath,
  searchFilter,
} from '#/data/site-map'
import { STATE_CONTENT } from '#/data/state-stamp-duty-content'

describe('site map', () => {
  it('lists every page once', () => {
    const paths = SITE_ENTRIES.map((e) => e.to)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('gives every hub at least one tool', () => {
    for (const hub of SITE_HUBS) {
      expect(entriesForHub(hub.id, 'tool').length, hub.id).toBeGreaterThan(0)
    }
  })

  it('derives one programmatic entry per state, city and unit pair', () => {
    expect(SITE_PROGRAMMATIC).toHaveLength(
      STATE_CONTENT.length + CITY_CONTENT.length + LAND_UNIT_PAGES.length,
    )
  })

  it('uses absolute paths', () => {
    for (const entry of SITE_ENTRIES) expect(entry.to).toMatch(/^\/[a-z0-9]/)
  })
})

describe('searchFilter', () => {
  const match = (title: string, q: string, kw?: string[]) => searchFilter(title, q, kw) > 0

  it('matches every word anywhere in title or keywords', () => {
    expect(match('Punjab stamp duty', 'punjab stamp')).toBe(true)
    expect(match('Punjab stamp duty', 'stamp punjab')).toBe(true)
    expect(match('Stamp Duty Calculator', 'registry', ['registry'])).toBe(true)
    expect(match('Punjab stamp duty', 'kerala stamp')).toBe(false)
  })

  it('ignores the number typed before a unit', () => {
    expect(match('Gaj to sq ft', '100 gaj')).toBe(true)
    expect(match('Concrete Calculator', '100 gaj')).toBe(false)
  })
})

describe('breadcrumbForPath', () => {
  it('nests tools under their hub', () => {
    expect(breadcrumbForPath('/stamp-duty-calculator')).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Buying a home', href: '/buy' },
      { label: 'Stamp duty calculator' },
    ])
  })

  it('nests state, city and unit pages under their parent tool', () => {
    const state = STATE_CONTENT[0]
    const trail = breadcrumbForPath(`/stamp-duty/${state.slug}/`, state.displayName)
    expect(trail?.map((c) => c.href)).toEqual(['/', '/buy', '/stamp-duty-calculator', undefined])
    expect(trail?.at(-1)?.label).toBe(state.displayName)
    expect(breadcrumbForPath(`/construction-cost/${CITY_CONTENT[0].slug}`)?.[2].href).toBe(
      '/construction-cost-calculator',
    )
    expect(breadcrumbForPath(`/convert/${LAND_UNIT_PAGES[0].slug}`)?.[2].href).toBe(
      '/plot-converter',
    )
  })

  it('returns null outside the site map', () => {
    expect(breadcrumbForPath('/privacy-policy')).toBeNull()
  })
})

describe('hub content', () => {
  it('has copy and FAQs for every hub', () => {
    for (const hub of SITE_HUBS) {
      const content = HUB_CONTENT[hub.id]
      expect(content.h1.length, hub.id).toBeGreaterThan(0)
      expect(content.metaDescription.length, hub.id).toBeLessThanOrEqual(160)
      expect(content.faqs.length, hub.id).toBeGreaterThan(0)
    }
  })

  it('sends every old topic hub to a real hub', () => {
    const hubPaths = new Set(SITE_HUBS.map((h) => hubPath(h.id)))
    for (const dest of Object.values(TOPIC_HUB_DESTINATION)) expect(hubPaths.has(dest.to)).toBe(true)
  })
})

describe('site map coverage', () => {
  it('lists every tool page in the sitemap', async () => {
    const { readFileSync } = await import('node:fs')
    const sitemap = readFileSync('public/sitemap.xml', 'utf8')
    for (const entry of SITE_ENTRIES) {
      // Some entries split the closing tag across lines, so match up to "<" only
      expect(sitemap, entry.to).toContain(`<loc>https://plotrai.in${entry.to}<`)
    }
  })
})
