#!/usr/bin/env node
/// <reference types="node" />
/**
 * Weekly Search Console report.
 *
 * Pulls the last 28 days of query + page data (and the 28 days before, for comparison) with the
 * Search Console API, and writes reports/gsc/<end-date>.md: totals, top pages, biggest movers,
 * striking-distance queries, low-CTR snippets and new page candidates.
 *
 * Credentials (never commit or print the key):
 *   GSC_SERVICE_ACCOUNT_JSON  the service-account key JSON itself (cloud routine secret), or
 *   GSC_KEY_FILE              a path to the key file (local runs)
 *   GSC_SITE_URL              optional; e.g. "sc-domain:plotrai.in". Defaults to whichever
 *                             plotrai.in property the service account can see.
 *
 * The service account's client_email must be added as a user on the Search Console property,
 * and the Search Console API enabled in its Google Cloud project.
 *
 * Run: node scripts/gsc-weekly-report.ts [--out reports/gsc] [--stdout]
 */
import { createSign } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildReport, type GscRow } from './gsc/analysis.ts'

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const API = 'https://www.googleapis.com/webmasters/v3'
/** Search Console data lags ~2–3 days; end the window where it is complete. */
const DATA_LAG_DAYS = 3
const PERIOD_DAYS = 28
const ROW_LIMIT = 25000

interface ServiceAccount {
  client_email: string
  private_key: string
}

async function loadServiceAccount(): Promise<ServiceAccount> {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON
    ? process.env.GSC_SERVICE_ACCOUNT_JSON
    : process.env.GSC_KEY_FILE
      ? await readFile(process.env.GSC_KEY_FILE, 'utf8')
      : null
  if (!raw) {
    throw new Error('Set GSC_SERVICE_ACCOUNT_JSON (key JSON) or GSC_KEY_FILE (path to the key).')
  }
  let parsed: Partial<ServiceAccount>
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Don't echo the value: it is a secret
    throw new Error('The service-account key is not valid JSON.')
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('The service-account key is missing client_email or private_key.')
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key }
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url')
}

async function accessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({ iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )
  const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(account.private_key)
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${base64url(signature)}`,
    }),
  })
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`)
  return ((await res.json()) as { access_token: string }).access_token
}

async function api<T>(token: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Search Console API ${path}: ${res.status} ${await res.text()}`)
  return (await res.json()) as T
}

async function resolveSite(token: string): Promise<string> {
  if (process.env.GSC_SITE_URL) return process.env.GSC_SITE_URL
  const { siteEntry = [] } = await api<{ siteEntry?: Array<{ siteUrl: string }> }>(token, '/sites')
  const sites = siteEntry.map((s) => s.siteUrl).filter((url) => url.includes('plotrai.in'))
  // Prefer the domain property: it covers http/https and www
  const site = sites.find((url) => url.startsWith('sc-domain:')) ?? sites[0]
  if (!site) {
    throw new Error(
      'The service account cannot see a plotrai.in property. Add its client_email as a user in Search Console.',
    )
  }
  return site
}

async function fetchRows(token: string, site: string, start: string, end: string): Promise<GscRow[]> {
  const rows: GscRow[] = []
  for (let startRow = 0; ; startRow += ROW_LIMIT) {
    const res = await api<{
      rows?: Array<{ keys: [string, string]; clicks: number; impressions: number; ctr: number; position: number }>
    }>(token, `/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      startDate: start,
      endDate: end,
      dimensions: ['query', 'page'],
      rowLimit: ROW_LIMIT,
      startRow,
    })
    const batch = res.rows ?? []
    for (const r of batch) {
      rows.push({
        query: r.keys[0],
        page: r.keys[1],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })
    }
    if (batch.length < ROW_LIMIT) return rows
  }
}

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

async function main() {
  const args = process.argv.slice(2)
  const outIndex = args.indexOf('--out')
  const outDir = outIndex >= 0 ? args[outIndex + 1] : join('reports', 'gsc')

  const account = await loadServiceAccount()
  const token = await accessToken(account)
  const site = await resolveSite(token)

  const end = isoDaysAgo(DATA_LAG_DAYS)
  const start = isoDaysAgo(DATA_LAG_DAYS + PERIOD_DAYS - 1)
  const prevEnd = isoDaysAgo(DATA_LAG_DAYS + PERIOD_DAYS)
  const prevStart = isoDaysAgo(DATA_LAG_DAYS + 2 * PERIOD_DAYS - 1)

  const [current, previous] = await Promise.all([
    fetchRows(token, site, start, end),
    fetchRows(token, site, prevStart, prevEnd),
  ])

  const report = buildReport({
    site,
    current: { start, end, rows: current },
    previous: { start: prevStart, end: prevEnd, rows: previous },
  })

  if (args.includes('--stdout')) {
    process.stdout.write(report)
    return
  }
  await mkdir(outDir, { recursive: true })
  const file = join(outDir, `${end}.md`)
  await writeFile(file, report)
  console.log(`Wrote ${file} (${current.length} rows this period, ${previous.length} before).`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
