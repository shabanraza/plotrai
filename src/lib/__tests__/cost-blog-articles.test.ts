import { describe, expect, it } from 'vitest'
import {
  COST_BLOG_ARTICLES,
  GROUND_ONLY_PERCENT,
  PMAY_G_SQFT,
  VILLAGE_CEILING,
  costRange,
  labourPerSqft,
  lakh,
  tierBand,
} from '#/data/cost-blog-articles'
import { BLOG_BY_SLUG, BLOG_TOOL_META, type BlogSlug } from '#/data/blog-content'
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

  it('uses the lowest basic city rate as the village ceiling', () => {
    expect(VILLAGE_CEILING.rate).toBe(tierBand('basic').min)
    expect(PMAY_G_SQFT).toBe(269)
    const table = tableOf('house-construction-cost-in-village', '1BHK, 2BHK')
    expect(table.rows[2][2]).toBe(lakh(1100 * tierBand('basic').min))
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
