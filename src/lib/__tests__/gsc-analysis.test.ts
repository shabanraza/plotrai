import { describe, expect, it } from 'vitest'
import {
  buildReport,
  expectedCtr,
  lowCtr,
  newPageCandidates,
  pageChanges,
  pageTotals,
  strikingDistance,
  toPath,
  type GscRow,
} from '../../../scripts/gsc/analysis.ts'

const SITE = 'https://plotrai.in'

function row(query: string, path: string, impressions: number, clicks: number, position: number): GscRow {
  return { query, page: `${SITE}${path}`, impressions, clicks, ctr: clicks / impressions, position }
}

const CURRENT: GscRow[] = [
  row('construction cost calculator', '/construction-cost-calculator', 2000, 300, 2.1),
  row('stamp duty in punjab', '/stamp-duty/punjab', 7200, 65, 9.9),
  row('ghmc property tax', '/ghmc-property-tax-calculator', 800, 8, 3.2),
  row('pune property tax calculator', '/', 120, 0, 34),
  row('rare query', '/plot-converter', 10, 0, 12),
]

const PREVIOUS: GscRow[] = [
  row('construction cost calculator', '/construction-cost-calculator', 1800, 250, 2.4),
  row('ghmc property tax', '/ghmc-property-tax-calculator', 700, 20, 3.5),
]

describe('gsc analysis', () => {
  it('maps positions to an expected CTR, clamped to 1–10', () => {
    expect(expectedCtr(1)).toBe(0.28)
    expect(expectedCtr(0.4)).toBe(0.28)
    expect(expectedCtr(25)).toBe(expectedCtr(10))
  })

  it('strips the origin from page URLs', () => {
    expect(toPath(`${SITE}/stamp-duty/punjab`)).toBe('/stamp-duty/punjab')
  })

  it('finds striking-distance queries with enough impressions', () => {
    expect(strikingDistance(CURRENT).map((r) => r.query)).toEqual(['stamp duty in punjab'])
  })

  it('flags top-5 queries with CTR under half the expected rate', () => {
    expect(lowCtr(CURRENT).map((r) => r.query)).toEqual(['ghmc property tax'])
  })

  it('lists queries beyond page 2 as new page candidates', () => {
    expect(newPageCandidates(CURRENT).map((r) => r.query)).toEqual(['pune property tax calculator'])
  })

  it('totals pages with an impression-weighted position', () => {
    const [top] = pageTotals([
      row('a', '/x', 100, 10, 2),
      row('b', '/x', 300, 5, 6),
    ])
    expect(top).toMatchObject({ clicks: 15, impressions: 400, position: 5 })
  })

  it('splits page click changes into gains and drops', () => {
    const { gains, drops } = pageChanges(CURRENT, PREVIOUS)
    expect(gains[0]).toMatchObject({ page: `${SITE}/stamp-duty/punjab`, delta: 65 })
    expect(drops[0]).toMatchObject({ page: `${SITE}/ghmc-property-tax-calculator`, delta: -12 })
  })

  it('builds a report with every section', () => {
    const report = buildReport({
      site: 'sc-domain:plotrai.in',
      current: { start: '2026-10-07', end: '2026-11-03', rows: CURRENT },
      previous: { start: '2026-09-09', end: '2026-10-06', rows: PREVIOUS },
    })
    for (const heading of [
      '## Totals',
      '## Top pages',
      '## Biggest gains',
      '## Biggest drops',
      '## Striking distance',
      '## Low CTR',
      '## New page candidates',
    ]) {
      expect(report).toContain(heading)
    }
    expect(report).toContain('`/stamp-duty/punjab`')
  })
})
