import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  STATE_CONTENT,
  buildStateFaqs,
  getStateEntry,
} from '#/data/state-stamp-duty-content'
import { calculateStampDuty } from '../stamp-duty'

const SITEMAP = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8')

describe('state stamp duty pages', () => {
  it('maps every state page to a rate entry, sitemap URL and FAQs', () => {
    for (const content of STATE_CONTENT) {
      expect(getStateEntry(content.state), content.state).toBeDefined()
      expect(SITEMAP).toContain(`https://plotrai.in/stamp-duty/${content.slug}`)
      expect(buildStateFaqs(content).length).toBeGreaterThanOrEqual(5)
    }
  })

  it('cites an https source for every state added from secondary sources', () => {
    for (const slug of ['uttarakhand', 'jharkhand', 'jammu-kashmir', 'chhattisgarh']) {
      const content = STATE_CONTENT.find((s) => s.slug === slug)
      expect(content?.rateSources?.length, slug).toBeGreaterThan(0)
      for (const s of content?.rateSources ?? []) expect(s.url).toMatch(/^https:\/\//)
    }
  })

  it('applies the Uttarakhand ₹25,000 registration cap', () => {
    const rate = getStateEntry('Uttarakhand')!.default
    const result = calculateStampDuty({
      propertyValue: 5_000_000,
      rate,
      gender: 'male',
      loanLtvPercent: 0,
    })
    expect(result.stampDutyAmount).toBe(250_000)
    expect(result.registrationAmount).toBe(25_000)
  })
})
