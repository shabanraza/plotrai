import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  CITY_RATES,
  CONSTRUCTION_LAST_UPDATED,
  GROUND_ONLY_PERCENT,
  getRateSource,
  type FinishTier,
} from '#/data/construction-cost-rates'
import {
  CITY_CONTENT,
  buildCityFaqs,
  buildCityMeta,
  buildSizeCostRows,
  cityContextParagraphs,
  getRelatedCities,
} from '#/data/city-construction-content'
import { INFRALENS_CITIES, INFRALENS_UPDATED } from '#/data/infralens-rates'

const SITEMAP = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8')
const TIERS: ReadonlyArray<FinishTier> = ['basic', 'standard', 'premium', 'luxury']

describe('construction cost city pages', () => {
  it('has rates, a sitemap URL and FAQs for every city page', () => {
    for (const content of CITY_CONTENT) {
      expect(CITY_RATES[content.city], content.city).toBeDefined()
      expect(SITEMAP).toContain(`https://plotrai.in/construction-cost/${content.slug}`)
      expect(buildCityFaqs(content).length).toBeGreaterThanOrEqual(6)
    }
  })

  it('shows InfraLens rates exactly as published, with no scaling', () => {
    expect(INFRALENS_CITIES.length).toBeGreaterThanOrEqual(28)
    for (const { city, rates } of INFRALENS_CITIES) {
      expect(CITY_RATES[city], city).toEqual(rates)
      expect(rates.basic).toBeLessThan(rates.standard)
      expect(rates.standard).toBeLessThan(rates.premium)
      expect(rates.premium).toBeLessThan(rates.luxury)
    }
  })

  it('uses the 24 Oct 2026 InfraLens figures for the cities checked on 2026-11-21', () => {
    expect(CITY_RATES.Delhi).toEqual({ basic: 1794, standard: 2300, premium: 3105, luxury: 4255 })
    expect(CITY_RATES.Mumbai).toEqual({ basic: 2407, standard: 3086, premium: 4166, luxury: 5709 })
    expect(CITY_RATES.Chennai.standard).toBe(2478)
    expect(CITY_RATES.Kochi.premium).toBe(3480)
    expect(CITY_RATES.Ghaziabad).toEqual(CITY_RATES.Noida)
    expect(getRateSource('Ghaziabad').note).toMatch(/Noida/)
  })

  it('gives every city a dated source, with a link for InfraLens cities', () => {
    for (const city of Object.keys(CITY_RATES)) {
      const source = getRateSource(city)
      expect(source.asOf, city).toMatch(/^\d{4}-(\d{2}-\d{2}|Q\d)$/)
      expect(source.label.length).toBeGreaterThan(5)
    }
    for (const { city } of INFRALENS_CITIES) {
      const source = getRateSource(city)
      expect(source.url).toMatch(/^https:\/\/infralens\.in\/prices\//)
      expect(source.asOf).toBe(INFRALENS_UPDATED)
    }
    expect(getRateSource('Bangalore').url).toBeUndefined()
    expect(getRateSource('Bangalore').asOf).toBe('2026-Q2')
  })

  it('stores an exact last-updated date', () => {
    expect(CONSTRUCTION_LAST_UPDATED).toBe('2026-11-21')
  })

  it('keeps "Other" as the last calculator option', () => {
    expect(Object.keys(CITY_RATES).at(-1)).toBe('Other')
  })

  it('hard-codes no rupee figures in city text and interpolates from the rates table', () => {
    for (const content of CITY_CONTENT) {
      for (const p of content.extraContext ?? []) {
        expect(p, content.slug).not.toMatch(/₹\s?\d/)
      }
      const text = cityContextParagraphs(content).join(' ')
      expect(text).not.toMatch(/\{(basic|standard|premium|luxury)\}/)
    }
    const mumbai = CITY_CONTENT.find((c) => c.slug === 'mumbai')!
    expect(cityContextParagraphs(mumbai).join(' ')).toContain('₹3,086')
  })

  it('drops the unsourced and false claims', () => {
    const all = CITY_CONTENT.flatMap((c) => [
      ...cityContextParagraphs(c),
      ...buildCityFaqs(c).map((f) => f.a),
    ]).join('\n')
    for (const bad of [
      'highest stamp duty',
      '(highest in India)',
      'Pricol',
      'development charges',
      'FAR up to 2.0',
      '65% material',
      /most (cost-efficient|affordable)/i,
      /\b(lowest|fastest|cheapest)\b/i,
    ]) {
      expect(all).not.toMatch(bad instanceof RegExp ? bad : new RegExp(bad.replace(/[()]/g, '\\$&')))
    }
  })

  it('links every city from at least two other city pages', () => {
    const inbound = new Map<string, number>()
    for (const content of CITY_CONTENT) {
      const related = getRelatedCities(content.slug)
      expect(related.length, content.slug).toBeGreaterThanOrEqual(6)
      expect(related.map((c) => c.slug)).not.toContain(content.slug)
      for (const c of related) inbound.set(c.slug, (inbound.get(c.slug) ?? 0) + 1)
    }
    for (const content of CITY_CONTENT) {
      expect(inbound.get(content.slug) ?? 0, content.slug).toBeGreaterThanOrEqual(2)
    }
  })

  it('prefers same-state cities in the related list', () => {
    const slugs = getRelatedCities('coimbatore').map((c) => c.slug)
    expect(slugs).toContain('madurai')
    expect(slugs).toContain('chennai')
  })
})

describe('city page meta', () => {
  it('follows the title and description pattern within length limits', () => {
    for (const content of CITY_CONTENT) {
      const meta = buildCityMeta(content)
      expect(meta.title, content.slug).toMatch(
        new RegExp(`^Construction Cost per Sq Ft in ${content.city} 2026.* · Plotr Ai$`),
      )
      expect(meta.title.length, meta.title).toBeLessThanOrEqual(68)
      expect(meta.description.length, meta.description).toBeLessThan(160)
      expect(meta.description).toContain('updated 21 Nov 2026')
      expect(meta.description).toContain('G+1')
    }
    const delhi = buildCityMeta(CITY_CONTENT.find((c) => c.slug === 'delhi')!)
    expect(delhi.title).toBe('Construction Cost per Sq Ft in Delhi 2026: ₹1,794–₹3,105 · Plotr Ai')
    expect(delhi.description).toContain('₹1,794–₹4,255')
    expect(delhi.h1).toBe('Construction cost per sq ft in Delhi (2026)')
  })
})

describe('size × tier table', () => {
  const rates = CITY_RATES.Delhi

  it('multiplies area by the tier rate for single-floor sizes', () => {
    const rows = buildSizeCostRows(rates)
    const r1200 = rows.find((r) => r.key === '1200')!
    expect(r1200.area).toBe(1200)
    for (const tier of TIERS.slice(0, 3)) expect(r1200.costs[tier]).toBe(1200 * rates[tier])
    expect(rows.slice(0, 4).map((r) => r.area)).toEqual([1000, 1200, 1500, 2000])
  })

  it('prices G+1 as ground floor plus an upper floor without site and foundation', () => {
    const rows = buildSizeCostRows(rates)
    const g1 = rows.find((r) => r.key === 'g1-1200')!
    expect(g1.areaPerFloor).toBe(1200)
    expect(g1.area).toBe(2400)
    const factor = 1 + (100 - GROUND_ONLY_PERCENT) / 100
    expect(g1.costs.standard).toBe(Math.round(1200 * rates.standard * factor))
    expect(g1.costs.standard).toBeLessThan(2 * 1200 * rates.standard)
    expect(rows.some((r) => r.key === 'g1-1500')).toBe(true)
  })
})
