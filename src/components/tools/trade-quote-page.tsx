import { Download, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { NextStepCard } from '#/components/tools/next-step-card'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolSources } from '#/components/tools/tool-sources'
import { Button } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Textarea } from '#/components/ui/textarea'
import type { FinishingToolContent } from '#/data/finishing-calc-content'
import { formatRupees, quoteTotals, type QuoteLine } from '#/lib/quotation'
import { track } from '#/lib/track'

/** A starting line. `auto` ties its quantity to the page's builder until the user types over it. */
export interface TradeLineDef {
  id: string
  description: string
  unit: string
  auto?: string
  /** Ties the description to `autoDescriptions` until the user edits it */
  descKey?: string
  qty?: string
}

interface Line extends TradeLineDef {
  qty: string
  rate: string
}

export interface ExtraField {
  id: string
  label: string
  multiline?: boolean
  defaultValue?: string
}

export interface TradeQuoteLines {
  lines: ReadonlyArray<QuoteLine>
  gstPct: number
}

interface TradeQuotePageProps {
  content: FinishingToolContent
  checked: string
  /** Title printed on the PDF, e.g. "Painting quotation" */
  docTitle: string
  /** Analytics tool id, e.g. "painting" */
  tool: string
  defaultLines: ReadonlyArray<TradeLineDef>
  /** Quantities from the builder, keyed by each line's `auto` */
  autoQty?: Record<string, number>
  /** Descriptions from the builder, keyed by each line's `descKey` */
  autoDescriptions?: Record<string, string>
  /** Builder sections (rooms, points, walls…) rendered above the line items */
  builder?: React.ReactNode
  lineItemsLabel?: string
  /** "Quotation" or "Work order"; used in labels and the file name */
  docKind?: string
  partyLabels?: { from: string; to: string }
  /** Extra free-text blocks printed under the parties, e.g. scope of work */
  extraFields?: ReadonlyArray<ExtraField>
  defaultTerms?: { advance: string; validity: string; exclusions: string }
  /** Buttons shown next to Download PDF, e.g. CSV export */
  extraActions?: (current: TradeQuoteLines) => React.ReactNode
  /** Content between the download panel and the sample section, e.g. waitlist */
  afterDownload?: React.ReactNode
}

let nextId = 0
const uid = () => `x${++nextId}`

const DEFAULT_TERMS = {
  advance: '50',
  validity: '15',
  exclusions:
    'Anything not listed above is not included and is charged separately.',
}

export function TradeQuotePage({
  content,
  checked,
  docTitle,
  tool,
  defaultLines,
  autoQty = {},
  autoDescriptions = {},
  builder,
  lineItemsLabel = 'Line items',
  docKind = 'quotation',
  partyLabels = { from: 'Your details', to: 'Client and quote' },
  extraFields = [],
  defaultTerms = DEFAULT_TERMS,
  extraActions,
  afterDownload,
}: TradeQuotePageProps) {
  const [business, setBusiness] = useState({ name: '', phone: '', gstin: '' })
  const [client, setClient] = useState({ name: '', address: '' })
  const [quoteNo, setQuoteNo] = useState('Q-001')
  const [date, setDate] = useState('')
  const [lines, setLines] = useState<Array<Line>>(() =>
    defaultLines.map((l) => ({ ...l, qty: l.qty ?? '', rate: '' })),
  )
  const [extras, setExtras] = useState<Record<string, string>>(() =>
    Object.fromEntries(extraFields.map((f) => [f.id, f.defaultValue ?? ''])),
  )
  const [gstPct, setGstPct] = useState('')
  const [advance, setAdvance] = useState(defaultTerms.advance)
  const [validity, setValidity] = useState(defaultTerms.validity)
  const [exclusions, setExclusions] = useState(defaultTerms.exclusions)
  const [busy, setBusy] = useState(false)

  // Set after mount so the server and browser render the same HTML
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10))
  }, [])

  const resolved = lines.map((l) => {
    let out = l
    if (l.descKey && autoDescriptions[l.descKey]) {
      out = { ...out, description: autoDescriptions[l.descKey] }
    }
    if (l.auto) {
      const q = autoQty[l.auto] ?? 0
      out = { ...out, qty: q > 0 ? String(Math.round(q * 100) / 100) : '' }
    }
    return out
  })
  const quoteLines: Array<QuoteLine> = resolved
    .filter((l) => l.description.trim())
    .map((l) => ({
      id: l.id,
      description: l.description,
      unit: l.unit,
      qty: parseNumber(l.qty),
      rate: parseNumber(l.rate),
    }))
  const totals = useMemo(
    () =>
      quoteTotals(
        resolved.map((l) => ({ qty: parseNumber(l.qty), rate: parseNumber(l.rate) })),
        parseNumber(gstPct),
      ),
    [resolved, gstPct],
  )

  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((ls) =>
      ls.map((l) => {
        if (l.id !== id) return l
        // Typing a quantity takes the line off auto-fill
        if ('qty' in patch) return { ...l, ...patch, auto: undefined }
        if ('description' in patch) return { ...l, ...patch, descKey: undefined }
        return { ...l, ...patch }
      }),
    )

  const terms = [
    parseNumber(advance) > 0
      ? `${parseNumber(advance)}% advance before work starts, balance as per the stages agreed.`
      : '',
    parseNumber(validity) > 0
      ? `This ${docKind} is valid for ${parseNumber(validity)} days from the date above.`
      : '',
    exclusions.trim(),
  ].filter(Boolean)

  async function onDownload() {
    setBusy(true)
    try {
      const { downloadQuotationPdf } = await import('#/lib/quotation-pdf')
      await downloadQuotationPdf({
        title: docTitle,
        path: content.path,
        fileStem: content.path.replace(/^\//, ''),
        business,
        client,
        quoteNo,
        date,
        lines: quoteLines,
        gstPct: parseNumber(gstPct),
        sections: extraFields
          .filter((f) => extras[f.id]?.trim())
          .map((f) => ({ heading: f.label, text: extras[f.id] })),
        terms,
      })
      track('quote_pdf_download', { tool })
    } catch {
      toast.error('Could not build the PDF. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const noLabel = docKind === 'quotation' ? 'Quote number' : `${capitalise(docKind)} number`

  return (
    <ToolPageShell
      title={content.title}
      tagline={content.tagline}
      variant="single-column"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: content.title }]}
      footnote={`Nothing you type leaves your browser. Sources checked ${checked}.`}
    >
      <div className="flex flex-col gap-12">
        <ToolSection label={partyLabels.from}>
          <FieldGroup className="grid gap-4 sm:grid-cols-3">
            <TextField id="tq-biz" label="Business or contractor name" value={business.name} onChange={(v) => setBusiness({ ...business, name: v })} />
            <TextField id="tq-phone" label="Phone" type="tel" value={business.phone} onChange={(v) => setBusiness({ ...business, phone: v })} />
            <TextField id="tq-gstin" label="GSTIN (optional)" value={business.gstin} onChange={(v) => setBusiness({ ...business, gstin: v.toUpperCase() })} />
          </FieldGroup>
        </ToolSection>

        <ToolSection label={partyLabels.to}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <TextField id="tq-client" label="Client name" value={client.name} onChange={(v) => setClient({ ...client, name: v })} />
            <Field>
              <FieldLabel htmlFor="tq-address">Site address</FieldLabel>
              <Textarea id="tq-address" rows={2} value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
            </Field>
            <TextField id="tq-no" label={noLabel} value={quoteNo} onChange={setQuoteNo} />
            <TextField id="tq-date" label="Date" type="date" value={date} onChange={setDate} />
            {extraFields.map((f) => (
              <Field key={f.id} className="sm:col-span-2">
                <FieldLabel htmlFor={`tq-${f.id}`}>{f.label}</FieldLabel>
                {f.multiline ? (
                  <Textarea id={`tq-${f.id}`} rows={3} value={extras[f.id]} onChange={(e) => setExtras({ ...extras, [f.id]: e.target.value })} />
                ) : (
                  <Input id={`tq-${f.id}`} value={extras[f.id]} onChange={(e) => setExtras({ ...extras, [f.id]: e.target.value })} />
                )}
              </Field>
            ))}
          </FieldGroup>
        </ToolSection>

        {builder}

        <ToolSection
          label={lineItemsLabel}
          description="Enter your own rates. Quantities worked out above stay in sync until you type over them."
        >
          <div className="flex flex-col gap-4">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24 text-right">Qty</TableHead>
                  <TableHead className="w-24">Unit</TableHead>
                  <TableHead className="w-28 text-right">Rate (₹)</TableHead>
                  <TableHead className="w-32 text-right">Amount (₹)</TableHead>
                  <TableHead className="w-10"><span className="sr-only">Remove</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resolved.map((line, i) => (
                  <TableRow key={line.id} className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0">
                      <Input aria-label="Description" value={line.description} onChange={(e) => updateLine(line.id, { description: e.target.value })} />
                    </TableCell>
                    <TableCell>
                      <Input aria-label="Quantity" type="number" min="0" step="any" inputMode="decimal" className="text-right tabular-nums" value={line.qty} onChange={(e) => updateLine(line.id, { qty: e.target.value })} />
                    </TableCell>
                    <TableCell>
                      <Input aria-label="Unit" value={line.unit} onChange={(e) => updateLine(line.id, { unit: e.target.value })} />
                    </TableCell>
                    <TableCell>
                      <Input aria-label="Rate" type="number" min="0" step="any" inputMode="decimal" placeholder="0" className="text-right tabular-nums" value={line.rate} onChange={(e) => updateLine(line.id, { rate: e.target.value })} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupees(totals.amounts[i] ?? 0)}</TableCell>
                    <TableCell className="pr-0">
                      <Button variant="ghost" size="icon" aria-label={`Remove ${line.description || 'line'}`} onClick={() => setLines((ls) => ls.filter((l) => l.id !== line.id))}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-transparent">
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="pl-0 text-right">Subtotal</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupees(totals.subtotal)}</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell colSpan={4} className="pl-0 text-right font-normal">
                    <span className="inline-flex items-center gap-2">
                      GST
                      <Input aria-label="GST percent" type="number" min="0" max="28" step="any" inputMode="decimal" placeholder="0" className="h-8 w-20 text-right tabular-nums" value={gstPct} onChange={(e) => setGstPct(e.target.value)} />
                      %
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-normal tabular-nums">{formatRupees(totals.gst)}</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell colSpan={4} className="pl-0 text-right">Total</TableCell>
                  <TableCell className="text-right text-base text-[var(--brand)] tabular-nums">₹{formatRupees(totals.total)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
            <div>
              <Button variant="outline" onClick={() => setLines((ls) => [...ls, { id: uid(), description: '', qty: '', unit: 'nos', rate: '' }])}>
                <Plus data-icon="inline-start" />
                Add line
              </Button>
            </div>
          </div>
        </ToolSection>

        <ToolSection label="Terms">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <NumberField id="tq-advance" label="Advance" suffix="%" value={advance} onChange={setAdvance} />
            <NumberField id="tq-validity" label={`${capitalise(docKind)} valid for`} suffix="days" value={validity} onChange={setValidity} />
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="tq-excl">Not included and other terms</FieldLabel>
              <Textarea id="tq-excl" rows={3} value={exclusions} onChange={(e) => setExclusions(e.target.value)} />
            </Field>
          </FieldGroup>
        </ToolSection>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3 rounded-xl bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[var(--foreground)]/75">{capitalise(docKind)} total</span>
              <span className="text-2xl font-semibold text-[var(--brand)] tabular-nums">₹{formatRupees(totals.total)}</span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {extraActions?.({ lines: quoteLines, gstPct: parseNumber(gstPct) })}
              <Button size="lg" onClick={onDownload} disabled={busy}>
                {busy ? <Spinner data-icon="inline-start" /> : <Download data-icon="inline-start" />}
                Download PDF
              </Button>
            </div>
          </div>
          <p className="text-sm text-[var(--foreground)]/75">Free, no sign-up. The PDF is made in your browser.</p>
        </div>

        {afterDownload}

        <NextStepCard from={content.path} />

        <ToolSection label={content.context.title}>
          <div className="flex max-w-[68ch] flex-col gap-4 text-base leading-7 text-[var(--foreground)]/80">
            {content.context.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </ToolSection>

        <ToolFaq items={content.faqs} />
        <ToolSources sources={content.sources} checked={checked} note={content.note} />
      </div>
    </ToolPageShell>
  )
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

/** Soft grey summary line under a builder, with the key figure in blue. */
export function BuilderSummary({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--foreground)]/80 [&_b]:font-semibold [&_b]:text-[var(--brand)] [&_span]:tabular-nums">
      {children}
    </p>
  )
}
