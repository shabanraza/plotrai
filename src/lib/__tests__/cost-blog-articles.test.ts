import { describe, expect, it } from 'vitest'
import {
  COST_BLOG_ARTICLES,
  GROUND_ONLY_PERCENT,
  PMAY_EXAMPLE_SQFT,
  VILLAGE_REFERENCE,
  costRange,
  labourPerSqft,
  lakh,
  tierBand,
} from '#/data/cost-blog-articles'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { BLOG_BY_SLUG, BLOG_TOOL_META, getToolLinkItem, type BlogSlug } from '#/data/blog-content'
import { lowestRateCities } from '#/lib/cost-format'
import { CITY_RATES } from '#/data/construction-cost-rates'
import { CONSTRUCTION_COST_FAQS } from '#/data/tool-seo-content'

const tableOf = (slug: string, headingStart: string) => {
  const article = BLOG_BY_SLUG.get(slug as BlogSlug)
  const table = article?.sections.find((sec) => sec.heading.startsWith(headingStart))?.table
  if (!table) throw new Error(`no table ${slug} / ${headingStart}`)
  return table
}

const bySlug = (slug: string) => {
  const a = COST_BLOG_ARTICLES.find((x) => x.slug === slug)
  if (!a) throw new Error(`missing ${slug}`)
  return a
}

describe('cost blog articles', () => {
  it('derives rate bands from the calculator city rates', () => {
    const standard = Object.entries(CITY_RATES)
      .filter(([city]) => city !== 'Other')
      .map(([, r]) => r.standard)
    expect(tierBand('standard')).toEqual({
      min: Math.min(...standard),
      max: Math.max(...standard),
    })
  })

  it('treats site preparation and foundation as ground-floor-only cost', () => {
    expect(GROUND_ONLY_PERCENT).toBe(17)
  })

  it('formats lakh figures', () => {
    expect(lakh(1575000)).toBe('₹15.8L')
    expect(lakh(2400000)).toBe('₹24L')
  })

  it('cites at least one https source per article and never prints NaN', () => {
    for (const article of COST_BLOG_ARTICLES) {
      expect(article.sources.every((s) => s.url.startsWith('https://'))).toBe(true)
      expect(JSON.stringify(article)).not.toMatch(/NaN|undefined/)
    }
  })

  it('derives the 3BHK table from tierBand', () => {
    const table = tableOf('3bhk-house-construction-cost', '3BHK construction cost by size')
    const row = table.rows.find((r) => r[0] === '1,200')!
    expect(row[2]).toBe(costRange(1200, 'standard'))
    const { min, max } = tierBand('standard')
    expect(row[2]).toBe(`${lakh(1200 * min).slice(0, -1)}–${lakh(1200 * max).slice(1)}`)
  })

  it('computes city budgets from CITY_RATES', () => {
    const table = tableOf('3bhk-house-construction-cost', '3BHK cost in Bangalore')
    const row = table.rows.find((r) => r[0] === 'Bangalore')!
    expect(row[3]).toBe(lakh(1400 * CITY_RATES.Bangalore.standard))
  })

  it('takes labour at 25-30% of the tier band', () => {
    const { min, max } = tierBand('standard')
    expect(labourPerSqft('standard')).toEqual({
      low: Math.round(min * 0.25),
      high: Math.round(max * 0.3),
    })
  })

  it('uses the lowest basic city rate as a village reference, not a ceiling', () => {
    expect(VILLAGE_REFERENCE.rate).toBe(tierBand('basic').min)
    expect(PMAY_EXAMPLE_SQFT).toBe(270)
    const table = tableOf('house-construction-cost-in-village', '1BHK, 2BHK')
    expect(table.rows[2][2]).toBe(lakh(1100 * tierBand('basic').min))
    const text = JSON.stringify(bySlug('house-construction-cost-in-village'))
    expect(text).not.toMatch(/ceiling|up to|Up to|25 sq m|12,000/)
    expect(text).toContain('more compact')
  })

  it('names tied lowest-rate cities without depending on key order', () => {
    const tied = lowestRateCities('basic')
    expect(tied.length).toBeGreaterThan(1)
    expect([...tied].sort((a, b) => a.localeCompare(b))).toEqual(tied)
    expect(VILLAGE_REFERENCE.label).toContain(tied[0])
    if (tied.length > 3) expect(VILLAGE_REFERENCE.label).toContain(`${tied.length - 3} other`)
  })

  it('prices G+1 on the 30x40 and 30x50 posts with the upper-floor factor', () => {
    const factor = (100 - GROUND_ONLY_PERCENT) / 100
    const { min, max } = tierBand('standard')
    const table = tableOf('30x40-house-construction-cost', '30x40 house cost')
    const row = table.rows.find((r) => r[0] === 'Standard')!
    expect(row[2]).toBe(
      `${lakh(1000 * min * (1 + factor)).slice(0, -1)}–${lakh(1000 * max * (1 + factor)).slice(1)}`,
    )
  })

  it('keeps meta descriptions within 160 characters and the village title short', () => {
    for (const slug of [
      '3bhk-house-construction-cost',
      'labour-cost-house-construction-per-sq-ft',
      'house-construction-cost-in-village',
    ]) {
      expect(bySlug(slug).description.length).toBeLessThanOrEqual(160)
    }
    expect(bySlug('house-construction-cost-in-village').title).toBe(
      'House construction cost in village (2026)',
    )
  })

  it('cites the GST notification without a dead link', () => {
    const labour = bySlug('labour-cost-house-construction-per-sq-ft')
    expect(JSON.stringify(labour.sources)).not.toContain('mahagst')
    expect(JSON.stringify(labour.sections)).toContain('12/2017-Central Tax (Rate)')
  })

  it('badges city pages as City and keeps them out of the lead tool slot', () => {
    expect(getToolLinkItem('/construction-cost/kochi').badge).toBe('City')
    expect(getToolLinkItem('/brick-calculator').badge).toBe('Tool')
    for (const a of COST_BLOG_ARTICLES) {
      expect(a.relatedTools[0].startsWith('/construction-cost/')).toBe(false)
    }
    expect(bySlug('3bhk-house-construction-cost').relatedTools.length).toBeLessThanOrEqual(10)
  })

  it('keeps tool-seo-content free of article imports', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/data/tool-seo-content.ts'), 'utf8')
    expect(src).not.toContain('cost-blog-articles')
    expect(src).toContain('#/lib/cost-format')
    expect(JSON.stringify(CONSTRUCTION_COST_FAQS)).not.toMatch(/In 2026 rates|1000 sq ft house costs/)
  })

  it('derives the 3BHK stage share of structure and foundation from STAGES', () => {
    const text = JSON.stringify(bySlug('3bhk-house-construction-cost').sections)
    expect(text).toContain('together take 35% of the budget')
  })

  it('keeps the construction cost FAQ in line with the calculator bands', () => {
    const text = JSON.stringify(CONSTRUCTION_COST_FAQS)
    expect(text).toContain(costRange(1000, 'standard'))
    expect(text).not.toContain('1300–1500')
  })

  it('links the new posts to each other and to known pages', () => {
    for (const slug of [
      '3bhk-house-construction-cost',
      'labour-cost-house-construction-per-sq-ft',
      'house-construction-cost-in-village',
    ]) {
      const a = bySlug(slug)
      for (const t of a.relatedTools) expect(BLOG_TOOL_META).toHaveProperty([t])
      for (const r of a.relatedArticles) expect(BLOG_BY_SLUG.has(r)).toBe(true)
    }
    expect(bySlug('2bhk-house-construction-cost').relatedArticles).toContain('3bhk-house-construction-cost')
    expect(bySlug('3bhk-house-construction-cost').relatedArticles).toContain('house-construction-cost-in-village')
    expect(bySlug('3bhk-house-construction-cost').relatedArticles).toContain('30x40-house-construction-cost')
  })
})
