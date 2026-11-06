import {
  calculateMaterials,
  type ElementType,
  type Materials,
} from '#/lib/material-calc'
import { quoteTotals, type QuoteLine } from '#/lib/quotation'

export interface BoqElement {
  type: ElementType
  /** Metres */
  length: number
  /** Metres */
  width: number
  /** Millimetres, as in the material calculator */
  thicknessMm: number
}

/** Total material for a list of elements, using the material calculator's coefficients. */
export function boqMaterials(elements: ReadonlyArray<BoqElement>): Materials {
  const total: Materials = { cement: 0, sand: 0, aggregate: 0, bricks: 0, steel: 0 }
  for (const e of elements) {
    // Plaster takes its thickness in mm; solids in metres
    const thickness = e.type === 'plaster' ? e.thicknessMm : e.thicknessMm / 1000
    const m = calculateMaterials(e.type, { length: e.length, width: e.width, thickness })
    total.cement += m.cement
    total.sand += m.sand
    total.aggregate += m.aggregate
    total.bricks += m.bricks
    total.steel += m.steel
  }
  return total
}

function csvCell(value: string | number): string {
  const s = String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** A BOQ or quotation as CSV that opens in Excel or Google Sheets. */
export function quoteCsv(lines: ReadonlyArray<QuoteLine>, gstPct: number): string {
  const t = quoteTotals(lines, gstPct)
  const rows: Array<Array<string | number>> = [
    ['Item', 'Description', 'Qty', 'Unit', 'Rate (Rs)', 'Amount (Rs)'],
    ...lines.map((l, i) => [i + 1, l.description, l.qty || '', l.unit, l.rate || '', t.amounts[i].toFixed(2)]),
    ['', '', '', '', 'Subtotal', t.subtotal.toFixed(2)],
  ]
  if (t.gstPct > 0) rows.push(['', '', '', '', `GST ${t.gstPct}%`, t.gst.toFixed(2)])
  rows.push(['', '', '', '', 'Total', t.total.toFixed(2)])
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n')
}
