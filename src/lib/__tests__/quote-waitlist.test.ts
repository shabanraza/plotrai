import { describe, expect, it } from 'vitest'
import { normaliseContact, parseQuoteWaitlist } from '#/lib/quote-waitlist'

const VALID = {
  contact: 'Ravi@Example.com',
  role: 'contractor',
  projects: '2-5',
  wouldPay: 'yes',
  tool: '/construction-cost-calculator',
  consent: true,
}

describe('normaliseContact', () => {
  it('lower-cases emails', () => {
    expect(normaliseContact(' Ravi@Example.COM ')).toEqual({
      contact: 'ravi@example.com',
      contactType: 'email',
    })
  })

  it('normalises Indian mobile numbers to +91', () => {
    for (const raw of ['98765 43210', '+91 98765-43210', '09876543210', '919876543210']) {
      expect(normaliseContact(raw)).toEqual({ contact: '+919876543210', contactType: 'phone' })
    }
  })

  it('rejects landlines, short numbers and broken emails', () => {
    for (const raw of ['12345 67890', '98765', 'ravi@', 'ravi@example', '']) {
      expect(normaliseContact(raw)).toBeNull()
    }
  })
})

describe('parseQuoteWaitlist', () => {
  it('accepts a complete contractor entry', () => {
    expect(parseQuoteWaitlist(VALID)).toMatchObject({
      contact: 'ravi@example.com',
      role: 'contractor',
      projects: '2-5',
      wouldPay: 'yes',
    })
  })

  it('drops the project count for homeowners', () => {
    expect(parseQuoteWaitlist({ ...VALID, role: 'homeowner', projects: '20+' }).projects).toBeNull()
  })

  it('requires consent, a known role, an answer and a project count', () => {
    expect(() => parseQuoteWaitlist({ ...VALID, consent: false })).toThrow(/tick the box/i)
    expect(() => parseQuoteWaitlist({ ...VALID, role: 'admin' })).toThrow(/describes you/i)
    expect(() => parseQuoteWaitlist({ ...VALID, wouldPay: '' })).toThrow(/would pay/i)
    expect(() => parseQuoteWaitlist({ ...VALID, projects: undefined })).toThrow(/projects/i)
  })

  it('only accepts on-site tool paths', () => {
    expect(() => parseQuoteWaitlist({ ...VALID, tool: 'https://evil.example' })).toThrow()
  })
})
