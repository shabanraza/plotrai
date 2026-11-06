import { createFileRoute } from '@tanstack/react-router'
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { Switch } from '#/components/ui/switch'
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
import { finishingHead } from '#/data/finishing-calc-content'
import {
  PAINTING_QUOTATION_CHECKED,
  PAINTING_QUOTATION_CONTENT as CONTENT,
} from '#/data/painting-quotation-content'
import {
  DEFAULT_PAINT_COVERAGE_SQFT,
  DEFAULT_PUTTY_COVERAGE_SQFT,
  calculatePaint,
  formatQty,
  roomPaintAreaSqFt,
} from '#/lib/finishing-calc'
import { formatRupees, quoteTotals } from '#/lib/quotation'
import { track } from '#/lib/track'

export const Route = createFileRoute('/painting-quotation-format')({
  component: PaintingQuotationPage,
  head: () => finishingHead(CONTENT),
})

interface Room {
  id: string
  name: string
  length: string
  width: string
  height: string
  openings: string
  ceiling: boolean
}

/** Lines tied to the room builder keep their quantity in sync until the user edits it. */
type AutoQty = 'putty' | 'paint' | 'labour'

interface Line {
  id: string
  description: string
  qty: string
  unit: string
  rate: string
  auto?: AutoQty
}

let nextId = 0
const uid = () => `r${++nextId}`

const newRoom = (name: string): Room => ({
  id: uid(),
  name,
  length: '12',
  width: '10',
  height: '10',
  openings: '40',
  ceiling: false,
})

const DEFAULT_LINES: Array<Line> = [
  { id: 'l-putty', description: 'Wall putty, 2 coats (material)', qty: '', unit: 'kg', rate: '', auto: 'putty' },
  { id: 'l-primer', description: 'Primer, 1 coat (material)', qty: '', unit: 'litre', rate: '' },
  { id: 'l-paint', description: 'Interior emulsion paint (material)', qty: '', unit: 'litre', rate: '', auto: 'paint' },
  { id: 'l-labour', description: 'Labour: putty, primer and paint', qty: '', unit: 'sq ft', rate: '', auto: 'labour' },
]

const DEFAULT_EXCLUSIONS =
  'Furniture shifting, wall repairs and waterproofing are not included. Any extra work is charged separately.'

function PaintingQuotationPage() {
  const [business, setBusiness] = useState({ name: '', phone: '', gstin: '' })
  const [client, setClient] = useState({ name: '', address: '' })
  const [quoteNo, setQuoteNo] = useState('Q-001')
  const [date, setDate] = useState('')
  const [rooms, setRooms] = useState<Array<Room>>(() => [
    { ...newRoom('Bedroom'), id: 'room-1' },
  ])
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState(String(DEFAULT_PAINT_COVERAGE_SQFT))
  const [lines, setLines] = useState<Array<Line>>(DEFAULT_LINES)
  const [gstPct, setGstPct] = useState('')
  const [advance, setAdvance] = useState('50')
  const [validity, setValidity] = useState('15')
  const [exclusions, setExclusions] = useState(DEFAULT_EXCLUSIONS)
  const [busy, setBusy] = useState(false)

  // Set after mount so the server and browser render the same HTML
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10))
  }, [])

  const areaSqFt = rooms.reduce(
    (sum, r) =>
      sum +
      roomPaintAreaSqFt({
        length: parseNumber(r.length),
        width: parseNumber(r.width),
        height: parseNumber(r.height),
        unit: 'ft',
        includeCeiling: r.ceiling,
        openings: parseNumber(r.openings),
      }),
    0,
  )
  const paint = calculatePaint({
    areaSqFt,
    coats: parseNumber(coats),
    coverageSqFtPerLitre: parseNumber(coverage),
    includePutty: true,
    puttyCoverageSqFtPerKg: DEFAULT_PUTTY_COVERAGE_SQFT,
  })
  const autoQty: Record<AutoQty, string> = {
    putty: areaSqFt > 0 ? String(Math.ceil(paint.puttyKg)) : '',
    paint: areaSqFt > 0 ? String(Math.ceil(paint.litres)) : '',
    labour: areaSqFt > 0 ? String(Math.round(areaSqFt)) : '',
  }
  const resolved = lines.map((l) => (l.auto ? { ...l, qty: autoQty[l.auto] } : l))

  const totals = useMemo(
    () =>
      quoteTotals(
        resolved.map((l) => ({ qty: parseNumber(l.qty), rate: parseNumber(l.rate) })),
        parseNumber(gstPct),
      ),
    [resolved, gstPct],
  )

  const updateRoom = (id: string, patch: Partial<Room>) =>
    setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((ls) =>
      ls.map((l) => {
        if (l.id !== id) return l
        // Typing a quantity takes the line off auto-fill
        if ('qty' in patch) return { ...l, ...patch, auto: undefined }
        return { ...l, ...patch }
      }),
    )

  const terms = [
    parseNumber(advance) > 0
      ? `${parseNumber(advance)}% advance before work starts, balance on completion.`
      : '',
    parseNumber(validity) > 0
      ? `This quotation is valid for ${parseNumber(validity)} days from the date above.`
      : '',
    exclusions.trim(),
  ].filter(Boolean)

  async function onDownload() {
    setBusy(true)
    try {
      const { downloadQuotationPdf } = await import('#/lib/quotation-pdf')
      await downloadQuotationPdf({
        title: 'Painting quotation',
        business,
        client,
        quoteNo,
        date,
        lines: resolved
          .filter((l) => l.description.trim())
          .map((l) => ({
            id: l.id,
            description: l.description,
            unit: l.unit,
            qty: parseNumber(l.qty),
            rate: parseNumber(l.rate),
          })),
        gstPct: parseNumber(gstPct),
        terms,
      })
      track('quote_pdf_download', { tool: 'painting' })
    } catch {
      toast.error('Could not build the PDF. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ToolPageShell
      title={CONTENT.title}
      tagline={CONTENT.tagline}
      variant="single-column"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: CONTENT.title }]}
      footnote={`Nothing you type leaves your browser. Coverage figures checked ${PAINTING_QUOTATION_CHECKED}.`}
    >
      <div className="flex flex-col gap-12">
        <ToolSection label="Your details">
          <FieldGroup className="grid gap-4 sm:grid-cols-3">
            <TextField id="pq-biz" label="Business or painter name" value={business.name} onChange={(v) => setBusiness({ ...business, name: v })} />
            <TextField id="pq-phone" label="Phone" type="tel" value={business.phone} onChange={(v) => setBusiness({ ...business, phone: v })} />
            <TextField id="pq-gstin" label="GSTIN (optional)" value={business.gstin} onChange={(v) => setBusiness({ ...business, gstin: v.toUpperCase() })} />
          </FieldGroup>
        </ToolSection>

        <ToolSection label="Client and quote">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <TextField id="pq-client" label="Client name" value={client.name} onChange={(v) => setClient({ ...client, name: v })} />
            <Field>
              <FieldLabel htmlFor="pq-address">Site address</FieldLabel>
              <Textarea id="pq-address" rows={2} value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
            </Field>
            <TextField id="pq-no" label="Quote number" value={quoteNo} onChange={setQuoteNo} />
            <TextField id="pq-date" label="Date" type="date" value={date} onChange={setDate} />
          </FieldGroup>
        </ToolSection>

        <ToolSection
          label="Rooms to paint"
          description="Sizes in feet. They fill in the putty, paint and labour quantities below."
        >
          <div className="flex flex-col gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="flex flex-col gap-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <TextField id={`${room.id}-name`} label="Room" value={room.name} onChange={(v) => updateRoom(room.id, { name: v })} />
                  </div>
                  {rooms.length > 1 && (
                    <Button variant="ghost" size="icon" aria-label={`Remove ${room.name || 'room'}`} onClick={() => setRooms((rs) => rs.filter((r) => r.id !== room.id))}>
                      <Trash2 />
                    </Button>
                  )}
                </div>
                <FieldGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <NumberField id={`${room.id}-l`} label="Length" suffix="ft" value={room.length} onChange={(v) => updateRoom(room.id, { length: v })} />
                  <NumberField id={`${room.id}-w`} label="Width" suffix="ft" value={room.width} onChange={(v) => updateRoom(room.id, { width: v })} />
                  <NumberField id={`${room.id}-h`} label="Height" suffix="ft" value={room.height} onChange={(v) => updateRoom(room.id, { height: v })} />
                  <NumberField id={`${room.id}-o`} label="Doors, windows" suffix="sq ft" value={room.openings} onChange={(v) => updateRoom(room.id, { openings: v })} />
                </FieldGroup>
                <Field orientation="horizontal">
                  <Switch id={`${room.id}-c`} checked={room.ceiling} onCheckedChange={(c) => updateRoom(room.id, { ceiling: c })} />
                  <FieldLabel htmlFor={`${room.id}-c`} className="font-normal">Paint the ceiling too</FieldLabel>
                </Field>
              </div>
            ))}
            <div>
              <Button variant="outline" onClick={() => setRooms((rs) => [...rs, newRoom(`Room ${rs.length + 1}`)])}>
                <Plus data-icon="inline-start" />
                Add room
              </Button>
            </div>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <NumberField id="pq-coats" label="Coats of paint" value={coats} onChange={setCoats} />
              <NumberField id="pq-coverage" label="Paint coverage per coat" suffix="sq ft / litre" value={coverage} onChange={setCoverage} description="90 is from the Apcolite data sheet. Use the figure on your tin." />
            </FieldGroup>
            <p className="rounded-xl bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--foreground)]/80">
              Paintable area <span className="font-semibold text-[var(--brand)] tabular-nums">{formatQty(areaSqFt, 0)} sq ft</span>
              {' · '}paint <span className="tabular-nums">{formatQty(paint.litres, 1)} litres</span>
              {' · '}putty <span className="tabular-nums">{formatQty(paint.puttyKg, 1)} kg</span>
            </p>
          </div>
        </ToolSection>

        <ToolSection
          label="Line items"
          description="Enter your own rates. Quantities from the rooms stay in sync until you type over them."
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
                  <TableCell className="text-right tabular-nums font-normal">{formatRupees(totals.gst)}</TableCell>
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
            <NumberField id="pq-advance" label="Advance" suffix="%" value={advance} onChange={setAdvance} />
            <NumberField id="pq-validity" label="Quote valid for" suffix="days" value={validity} onChange={setValidity} />
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="pq-excl">Not included</FieldLabel>
              <Textarea id="pq-excl" rows={3} value={exclusions} onChange={(e) => setExclusions(e.target.value)} />
            </Field>
          </FieldGroup>
        </ToolSection>

        <div className="flex flex-col gap-3 rounded-xl bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[var(--foreground)]/75">Quotation total</span>
            <span className="text-2xl font-semibold text-[var(--brand)] tabular-nums">₹{formatRupees(totals.total)}</span>
          </div>
          <Button size="lg" onClick={onDownload} disabled={busy}>
            {busy ? <Spinner data-icon="inline-start" /> : <Download data-icon="inline-start" />}
            Download PDF
          </Button>
        </div>
        <p className="-mt-9 text-sm text-[var(--foreground)]/75">Free, no sign-up. The PDF is made in your browser.</p>

        <NextStepCard from={CONTENT.path} />

        <ToolSection label={CONTENT.context.title}>
          <div className="flex max-w-[68ch] flex-col gap-4 text-base leading-7 text-[var(--foreground)]/80">
            {CONTENT.context.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </ToolSection>

        <ToolFaq items={CONTENT.faqs} />
        <ToolSources sources={CONTENT.sources} checked={PAINTING_QUOTATION_CHECKED} note={CONTENT.note} />
      </div>
    </ToolPageShell>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  description,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  description?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
