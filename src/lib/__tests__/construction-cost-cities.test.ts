import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  CITY_RATES,
  INFRALENS_CALIBRATION_FACTOR,
  INFRALENS_DERIVED_CITIES,
} from '#/data/construction-cost-rates'
import { CITY_CONTENT, buildCityFaqs } from '#/data/city-construction-content'
import { INFRALENS_NEW_CITIES } from '#/data/infralens-rates'

const SITEMAP = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8')

describe('construction cost city pages', () => {
  it('has rates, a sitemap URL and FAQs for every city page', () => {
    for (const content of CITY_CONTENT) {
      expect(CITY_RATES[content.city], content.city).toBeDefined()
      expect(SITEMAP).toContain(`https://plotrai.in/construction-cost/${content.slug}`)
      expect(buildCityFaqs(content).length).toBeGreaterThanOrEqual(6)
    }
  })

  it('keeps calibration factors in a plausible band', () => {
    for (const factor of Object.values(INFRALENS_CALIBRATION_FACTOR)) {
      expect(factor).toBeGreaterThan(0.7)
      expect(factor).toBeLessThan(1)
    }
  })

  it('derives each new city by scaling InfraLens rates and rounding to ₹50', () => {
    expect(INFRALENS_DERIVED_CITIES).toHaveLength(14)
    for (const { city, rates } of INFRALENS_NEW_CITIES) {
      const ours = CITY_RATES[city]
      expect(ours.standard % 50).toBe(0)
      expect(Math.abs(ours.standard - rates.standard * INFRALENS_CALIBRATION_FACTOR.standard)).toBeLessThanOrEqual(25)
      expect(ours.basic).toBeLessThan(ours.standard)
      expect(ours.standard).toBeLessThan(ours.premium)
      expect(ours.premium).toBeLessThan(ours.luxury)
    }
  })

  it('keeps "Other" as the last calculator option', () => {
    expect(Object.keys(CITY_RATES).at(-1)).toBe('Other')
  })
})
