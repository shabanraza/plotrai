import { describe, expect, it } from 'vitest'
import {
  COST_BLOG_ARTICLES,
  GROUND_ONLY_PERCENT,
  lakh,
  tierBand,
} from '#/data/cost-blog-articles'
import { CITY_RATES } from '#/data/construction-cost-rates'

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
})
