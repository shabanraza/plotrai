/**
 * Pure analysis of Search Console rows for the weekly report. No network or file access here, so
 * it can be unit-tested with fixture data (src/lib/__tests__/gsc-analysis.test.ts).
 */

export interface GscRow {
  query: string
  /** Absolute URL, as Search Console returns it */
  page: string
  clicks: number
  impressions: number
  /** 0–1 */
  ctr: number
  position: number
}

export interface PageTotals {
  page: string
  clicks: number
  impressions: number
  /** Impression-weighted average position */
  position: number
}

export interface PageChange {
  page: string
  clicks: number
  previousClicks: number
  delta: number
}

/**
 * Rough organic CTR by position (position 1–10). Used only to flag snippets that get far fewer
 * clicks than their rank should earn, so the exact values matter less than the shape.
 */
const EXPECTED_CTR = [0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018]

export function expectedCtr(position: number): number {
  const index = Math.min(EXPECTED_CTR.length, Math.max(1, Math.round(position))) - 1
  return EXPECTED_CTR[index]
}

/** "https://plotrai.in/stamp-duty/punjab" → "/stamp-duty/punjab" */
export function toPath(page: string): string {
  try {
    return new URL(page).pathname
  } catch {
    return page
  }
}

/**
 * Queries ranking on page 1's lower half or page 2 (positions 4–20) with real impressions: the
 * cheapest wins, usually from better content depth, headings and internal links.
 */
export function strikingDistance(rows: ReadonlyArray<GscRow>, minImpressions = 50, limit = 15) {
  return rows
    .filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= minImpressions)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit)
}

/**
 * Queries already in the top 5 whose CTR is under half what that position usually earns: the
 * title or meta description is the likely problem.
 */
export function lowCtr(rows: ReadonlyArray<GscRow>, minImpressions = 100, limit = 10) {
  return rows
    .filter(
      (r) =>
        r.position <= 5 &&
        r.impressions >= minImpressions &&
        r.ctr < expectedCtr(r.position) * 0.5,
    )
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit)
}

/**
 * Queries with demand where we rank beyond page 2: candidates for a new dedicated page, or a
 * section on an existing one.
 */
export function newPageCandidates(rows: ReadonlyArray<GscRow>, minImpressions = 30, limit = 15) {
  return rows
    .filter((r) => r.position > 20 && r.impressions >= minImpressions)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit)
}

export function pageTotals(rows: ReadonlyArray<GscRow>): PageTotals[] {
  const byPage = new Map<string, { clicks: number; impressions: number; weighted: number }>()
  for (const r of rows) {
    const t = byPage.get(r.page) ?? { clicks: 0, impressions: 0, weighted: 0 }
    t.clicks += r.clicks
    t.impressions += r.impressions
    t.weighted += r.position * r.impressions
    byPage.set(r.page, t)
  }
  return [...byPage]
    .map(([page, t]) => ({
      page,
      clicks: t.clicks,
      impressions: t.impressions,
      position: t.impressions ? t.weighted / t.impressions : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
}

/** Pages whose clicks moved most between two periods, biggest gains then biggest drops. */
export function pageChanges(
  current: ReadonlyArray<GscRow>,
  previous: ReadonlyArray<GscRow>,
  limit = 8,
): { gains: PageChange[]; drops: PageChange[] } {
  const now = new Map(pageTotals(current).map((p) => [p.page, p.clicks]))
  const before = new Map(pageTotals(previous).map((p) => [p.page, p.clicks]))
  const changes = [...new Set([...now.keys(), ...before.keys()])].map((page) => {
    const clicks = now.get(page) ?? 0
    const previousClicks = before.get(page) ?? 0
    return { page, clicks, previousClicks, delta: clicks - previousClicks }
  })
  return {
    gains: changes.filter((c) => c.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, limit),
    drops: changes.filter((c) => c.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, limit),
  }
}

function sum(rows: ReadonlyArray<GscRow>, key: 'clicks' | 'impressions') {
  return rows.reduce((total, r) => total + r[key], 0)
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

function signed(n: number) {
  return n > 0 ? `+${n}` : String(n)
}

function queryTable(rows: ReadonlyArray<GscRow>) {
  if (!rows.length) return '_None this week._\n'
  return [
    '| Query | Page | Impr. | Clicks | CTR | Pos. |',
    '|---|---|---:|---:|---:|---:|',
    ...rows.map(
      (r) =>
        `| ${r.query.replace(/\|/g, '/')} | \`${toPath(r.page)}\` | ${r.impressions} | ${r.clicks} | ${pct(r.ctr)} | ${r.position.toFixed(1)} |`,
    ),
  ].join('\n') + '\n'
}

function changeTable(rows: ReadonlyArray<PageChange>) {
  if (!rows.length) return '_None._\n'
  return [
    '| Page | Clicks | Before | Change |',
    '|---|---:|---:|---:|',
    ...rows.map(
      (c) => `| \`${toPath(c.page)}\` | ${c.clicks} | ${c.previousClicks} | ${signed(c.delta)} |`,
    ),
  ].join('\n') + '\n'
}

export interface ReportInput {
  site: string
  /** Inclusive ISO dates */
  current: { start: string; end: string; rows: ReadonlyArray<GscRow> }
  previous: { start: string; end: string; rows: ReadonlyArray<GscRow> }
}

/** The weekly Markdown report. Sentence case, no rates or advice: just what Search Console says. */
export function buildReport({ site, current, previous }: ReportInput): string {
  const clicks = sum(current.rows, 'clicks')
  const impressions = sum(current.rows, 'impressions')
  const prevClicks = sum(previous.rows, 'clicks')
  const prevImpressions = sum(previous.rows, 'impressions')
  const { gains, drops } = pageChanges(current.rows, previous.rows)
  const topPages = pageTotals(current.rows).slice(0, 10)

  return `# Search Console weekly report — ${current.end}

Property: \`${site}\`. Period: ${current.start} to ${current.end}, compared with ${previous.start} to ${previous.end}.
Rows are query + page pairs, so totals can be slightly below the Search Console dashboard (anonymised queries are left out).

## Totals

| | This period | Previous | Change |
|---|---:|---:|---:|
| Clicks | ${clicks} | ${prevClicks} | ${signed(clicks - prevClicks)} |
| Impressions | ${impressions} | ${prevImpressions} | ${signed(impressions - prevImpressions)} |
| CTR | ${pct(impressions ? clicks / impressions : 0)} | ${pct(prevImpressions ? prevClicks / prevImpressions : 0)} | |

## Top pages

| Page | Clicks | Impr. | Avg pos. |
|---|---:|---:|---:|
${topPages.map((p) => `| \`${toPath(p.page)}\` | ${p.clicks} | ${p.impressions} | ${p.position.toFixed(1)} |`).join('\n')}

## Biggest gains

${changeTable(gains)}
## Biggest drops

${changeTable(drops)}
## Striking distance (position 4–20)

Improve content depth, headings and internal links on these pages.

${queryTable(strikingDistance(current.rows))}
## Low CTR for the position (top 5)

Rewrite the title and meta description.

${queryTable(lowCtr(current.rows))}
## New page candidates (position > 20)

Demand we barely rank for: consider a dedicated page or a new section.

${queryTable(newPageCandidates(current.rows))}`
}
