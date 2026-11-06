/**
 * Pure maths for the trade quotation generators (painting first). No rates live here:
 * every price comes from the user, because we never invent prices.
 */

export interface QuoteLine {
  id: string
  description: string
  qty: number
  unit: string
  rate: number
}

export interface QuoteTotals {
  /** Amount per line, in the same order as the input */
  amounts: Array<number>
  subtotal: number
  gstPct: number
  gst: number
  total: number
}

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Round to paise so the PDF and the page always agree. */
export function roundRupees(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function lineAmount(line: Pick<QuoteLine, 'qty' | 'rate'>): number {
  return roundRupees(nonNegative(line.qty) * nonNegative(line.rate))
}

/** Subtotal, GST and total. GST is clamped to 0–28%, the highest Indian slab. */
export function quoteTotals(
  lines: ReadonlyArray<Pick<QuoteLine, 'qty' | 'rate'>>,
  gstPct: number,
): QuoteTotals {
  const amounts = lines.map(lineAmount)
  const subtotal = roundRupees(amounts.reduce((sum, a) => sum + a, 0))
  const pct = Math.min(28, nonNegative(gstPct))
  const gst = roundRupees((subtotal * pct) / 100)
  return { amounts, subtotal, gstPct: pct, gst, total: roundRupees(subtotal + gst) }
}

/** Indian digit grouping, e.g. 1,25,000.50 */
export function formatRupees(n: number): string {
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
