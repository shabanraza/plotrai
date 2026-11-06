import { formatRupees, quoteTotals, type QuoteLine } from '#/lib/quotation'

export interface QuotationPdfInput {
  title: string
  business: { name: string; phone: string; gstin: string }
  client: { name: string; address: string }
  quoteNo: string
  date: string
  lines: ReadonlyArray<QuoteLine>
  gstPct: number
  terms: ReadonlyArray<string>
}

/**
 * Builds the quotation PDF in the browser and saves it. jsPDF is loaded only on click so it
 * never weighs on the page. Its built-in fonts have no ₹ glyph, so amounts use "Rs.".
 */
export async function downloadQuotationPdf(input: QuotationPdfInput): Promise<void> {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const left = 15
  const right = 195
  let y = 18

  doc.setFont('helvetica', 'bold').setFontSize(16)
  doc.text(input.business.name || 'Painting contractor', left, y)
  doc.setFontSize(12).text(input.title, right, y, { align: 'right' })
  doc.setFont('helvetica', 'normal').setFontSize(10)
  y += 6
  if (input.business.phone) doc.text(`Phone: ${input.business.phone}`, left, y)
  doc.text(`Quote no: ${input.quoteNo || '-'}`, right, y, { align: 'right' })
  y += 5
  if (input.business.gstin) doc.text(`GSTIN: ${input.business.gstin}`, left, y)
  doc.text(`Date: ${formatDate(input.date)}`, right, y, { align: 'right' })

  y += 10
  doc.setFont('helvetica', 'bold').text('To', left, y)
  doc.setFont('helvetica', 'normal')
  y += 5
  doc.text(input.client.name || '-', left, y)
  if (input.client.address) {
    const addr = doc.splitTextToSize(input.client.address, 110) as Array<string>
    y += 5
    doc.text(addr, left, y)
    y += (addr.length - 1) * 5
  }

  const totals = quoteTotals(input.lines, input.gstPct)
  const foot: Array<Array<string>> = [['', '', '', 'Subtotal', formatRupees(totals.subtotal)]]
  if (totals.gstPct > 0) {
    foot.push(['', '', '', `GST ${totals.gstPct}%`, formatRupees(totals.gst)])
  }
  foot.push(['', '', '', 'Total (Rs.)', formatRupees(totals.total)])

  autoTable(doc, {
    startY: y + 8,
    head: [['Description', 'Qty', 'Unit', 'Rate (Rs.)', 'Amount (Rs.)']],
    body: input.lines.map((line, i) => [
      line.description,
      fmtQty(line.qty),
      line.unit,
      formatRupees(line.rate || 0),
      formatRupees(totals.amounts[i]),
    ]),
    foot,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 2 },
    headStyles: { fontStyle: 'bold', lineWidth: { bottom: 0.3 }, lineColor: 20 },
    footStyles: { fontStyle: 'bold' },
    columnStyles: {
      1: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
    margin: { left, right: 210 - right },
  })

  // lastAutoTable is added to the doc by the plugin
  let ty = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  if (input.terms.length > 0) {
    doc.setFont('helvetica', 'bold').text('Terms', left, ty)
    doc.setFont('helvetica', 'normal')
    for (const term of input.terms) {
      const wrapped = doc.splitTextToSize(`- ${term}`, right - left) as Array<string>
      ty += 5
      if (ty > 280) {
        doc.addPage()
        ty = 18
      }
      doc.text(wrapped, left, ty)
      ty += (wrapped.length - 1) * 5
    }
  }

  doc.setFontSize(8).setTextColor(130)
  doc.text('Made with plotrai.in/painting-quotation-format', left, 290)

  const slug = (input.quoteNo || 'quotation').replace(/[^a-z0-9-]+/gi, '-')
  doc.save(`painting-quotation-${slug}.pdf`)
}

function fmtQty(n: number): string {
  return Number.isFinite(n) && n > 0 ? String(Math.round(n * 100) / 100) : ''
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : iso
}
