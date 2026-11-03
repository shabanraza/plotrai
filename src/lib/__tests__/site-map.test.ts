import { describe, expect, it } from 'vitest'
import { CITY_CONTENT } from '#/data/city-construction-content'
import { LAND_UNIT_PAGES } from '#/data/land-unit-pages'
import {
  SITE_ENTRIES,
  SITE_HUBS,
  SITE_PROGRAMMATIC,
  entriesForHub,
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
