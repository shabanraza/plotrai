/**
 * Early list for the client-quote tool (fake-door test for a contractor estimating product).
 * Pure validation shared by the form and the server function, so it can be unit-tested.
 */

export const QUOTE_ROLES = [
  { value: 'contractor', label: 'Contractor or builder' },
  { value: 'engineer', label: 'Engineer or architect' },
  { value: 'homeowner', label: 'Building my own home' },
  { value: 'other', label: 'Other' },
] as const

export const QUOTE_PROJECTS = ['1', '2-5', '6-20', '20+'] as const

export const QUOTE_WOULD_PAY = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
] as const

export type QuoteRole = (typeof QUOTE_ROLES)[number]['value']
export type QuoteProjects = (typeof QUOTE_PROJECTS)[number]
export type QuoteWouldPay = (typeof QUOTE_WOULD_PAY)[number]['value']

/** Price shown in the willingness-to-pay question */
export const QUOTE_TEST_PRICE = '₹499 a month'

export interface QuoteWaitlistInput {
  contact: string
  role: string
  projects?: string
  wouldPay: string
  tool: string
  consent: boolean
  /** Honeypot: real visitors never see or fill this */
  website?: string
}

export interface QuoteWaitlistEntry {
  contact: string
  contactType: 'email' | 'phone'
  role: QuoteRole
  projects: QuoteProjects | null
  wouldPay: QuoteWouldPay
  tool: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Email (lower-cased) or an Indian mobile number normalised to +91XXXXXXXXXX.
 * Returns null when it is neither.
 */
export function normaliseContact(raw: string): { contact: string; contactType: 'email' | 'phone' } | null {
  const value = raw.trim()
  if (value.includes('@')) {
    const email = value.toLowerCase()
    return EMAIL.test(email) && email.length <= 254 ? { contact: email, contactType: 'email' } : null
  }
  const digits = value.replace(/[\s\-()]/g, '').replace(/^(\+91|0091|91(?=\d{10}$)|0)/, '')
  return /^[6-9]\d{9}$/.test(digits) ? { contact: `+91${digits}`, contactType: 'phone' } : null
}

/** Throws a message fit to show the visitor. */
export function parseQuoteWaitlist(input: QuoteWaitlistInput): QuoteWaitlistEntry {
  const contact = normaliseContact(input.contact ?? '')
  if (!contact) throw new Error('Enter a valid email or a 10-digit mobile number.')

  const role = QUOTE_ROLES.find((r) => r.value === input.role)?.value
  if (!role) throw new Error('Choose what describes you best.')

  const wouldPay = QUOTE_WOULD_PAY.find((w) => w.value === input.wouldPay)?.value
  if (!wouldPay) throw new Error('Tell us whether you would pay for it.')

  if (!input.consent) throw new Error('Tick the box so we can message you when it is ready.')

  const projects =
    role === 'homeowner' ? null : (QUOTE_PROJECTS.find((p) => p === input.projects) ?? null)
  if (role !== 'homeowner' && !projects) throw new Error('Choose how many projects you run a year.')

  const tool = (input.tool ?? '').slice(0, 80)
  if (!tool.startsWith('/')) throw new Error('Something went wrong. Please reload and try again.')

  return { ...contact, role, projects, wouldPay, tool }
}
