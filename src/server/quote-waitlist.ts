import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { env } from 'cloudflare:workers'
import { parseQuoteWaitlist, type QuoteWaitlistInput } from '#/lib/quote-waitlist'
import { getRenderDb, hashIdentifier } from './render-credits'

/** Same statements as migrations/0002_quote_waitlist.sql, so the form works before it is applied. */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS quote_waitlist (
    id TEXT PRIMARY KEY,
    contact TEXT NOT NULL,
    contact_type TEXT NOT NULL,
    role TEXT NOT NULL,
    projects TEXT,
    would_pay TEXT NOT NULL,
    tool TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contact, tool)
  )`,
  'CREATE INDEX IF NOT EXISTS idx_quote_waitlist_created_at ON quote_waitlist(created_at)',
  'CREATE INDEX IF NOT EXISTS idx_quote_waitlist_ip_hash ON quote_waitlist(ip_hash, created_at)',
]

/** Stops one visitor from flooding the list. */
const SIGNUPS_PER_IP_PER_DAY = 5

export const joinQuoteWaitlist = createServerFn({ method: 'POST' })
  .inputValidator((input: QuoteWaitlistInput) => input)
  .handler(async ({ data }) => {
    // Bots fill hidden fields; pretend it worked and store nothing
    if (data.website) return { ok: true as const }

    const entry = parseQuoteWaitlist(data)
    const db = getRenderDb(env)
    if (!db) throw new Error('Sign-ups are not available right now. Please try again later.')

    for (const sql of SCHEMA) await db.prepare(sql).run()

    const ip =
      getRequestHeader('cf-connecting-ip') ??
      getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() ??
      'anonymous'
    const ipHash = await hashIdentifier(ip)

    const recent = await db
      .prepare(
        "SELECT COUNT(*) AS n FROM quote_waitlist WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')",
      )
      .bind(ipHash)
      .first<{ n: number }>()
    if ((recent?.n ?? 0) >= SIGNUPS_PER_IP_PER_DAY) {
      throw new Error('Too many sign-ups from this connection today. Please try again tomorrow.')
    }

    // Signing up again updates the answers instead of adding a duplicate
    await db
      .prepare(
        `INSERT INTO quote_waitlist (id, contact, contact_type, role, projects, would_pay, tool, ip_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (contact, tool) DO UPDATE SET
           role = excluded.role, projects = excluded.projects, would_pay = excluded.would_pay`,
      )
      .bind(
        crypto.randomUUID(),
        entry.contact,
        entry.contactType,
        entry.role,
        entry.projects,
        entry.wouldPay,
        entry.tool,
        ipHash,
      )
      .run()

    return { ok: true as const }
  })
