import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  LAND_UNIT_PAGES,
  LAND_UNIT_PAGE_BY_SLUG,
  buildUnitPageFaqs,
  convertForPage,
  pageFactor,
} from '#/data/land-unit-pages'

function page(slug: string) {
  const p = LAND_UNIT_PAGE_BY_SLUG.get(slug)
  if (!p) throw new Error(`missing page ${slug}`)
  return p
}

describe('land unit pages', () => {
  it('answers "100 gaj in square feet" as 900', () => {
    expect(convertForPage(page('gaj-to-sq-ft'), 100)).toBe(900)
    expect(convertForPage(page('sq-ft-to-gaj'), 900)).toBe(100)
  })

  it('uses exact acre-fraction definitions', () => {
    expect(pageFactor(page('acre-to-sq-ft'))).toBe(43560)
    expect(pageFactor(page('acre-to-gaj'))).toBe(4840)
    expect(pageFactor(page('cent-to-sq-ft'))).toBeCloseTo(43560 / 100)
    expect(pageFactor(page('gunta-to-sq-ft'))).toBeCloseTo(43560 / 40)
    expect(pageFactor(page('kanal-to-sq-ft'))).toBeCloseTo(43560 / 8)
    expect(pageFactor(page('marla-to-sq-ft'))).toBeCloseTo(43560 / 160)
    expect(pageFactor(page('hectare-to-acre'))).toBeCloseTo(2.471, 3)
  })

  it('has unique slugs, a sitemap entry, and source links for every regional variant', () => {
    const sitemap = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8')
    expect(new Set(LAND_UNIT_PAGES.map((p) => p.slug)).size).toBe(LAND_UNIT_PAGES.length)
    for (const p of LAND_UNIT_PAGES) {
      expect(sitemap).toContain(`https://plotrai.in/convert/${p.slug}`)
      expect(buildUnitPageFaqs(p).length).toBeGreaterThanOrEqual(3)
      if (p.basis === 'convention') expect(p.variants?.length).toBeGreaterThan(0)
      for (const v of p.variants ?? []) expect(v.source.url).toMatch(/^https:\/\//)
    }
  })
})
