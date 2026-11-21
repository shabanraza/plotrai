import { createFileRoute } from '@tanstack/react-router'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { ToolSection } from '#/components/tools/tool-section'
import {
  BuilderSummary,
  TextField,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { Button } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Switch } from '#/components/ui/switch'
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

let nextId = 0
const newRoom = (name: string): Room => ({
  id: `room-${++nextId}`,
  name,
  length: '12',
  width: '10',
  height: '10',
  openings: '40',
  ceiling: false,
})

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'putty', description: 'Wall putty, 2 coats (material)', unit: 'kg', auto: 'putty' },
  { id: 'primer', description: 'Primer, 1 coat (material)', unit: 'litre' },
  { id: 'paint', description: 'Interior emulsion paint (material)', unit: 'litre', auto: 'paint' },
  { id: 'labour', description: 'Labour: putty, primer and paint', unit: 'sq ft', auto: 'labour' },
]

function PaintingQuotationPage() {
  const [rooms, setRooms] = useState<Array<Room>>(() => [{ ...newRoom('Bedroom'), id: 'room-0' }])
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState(String(DEFAULT_PAINT_COVERAGE_SQFT))

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
  const updateRoom = (id: string, patch: Partial<Room>) =>
    setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={PAINTING_QUOTATION_CHECKED}
      docTitle="Painting quotation"
      tool="painting"
      defaultLines={LINES}
      autoQty={{
        putty: Math.ceil(paint.puttyKg),
        paint: Math.ceil(paint.litres),
        labour: Math.round(areaSqFt),
      }}
      defaultTerms={{
        advance: '50',
        validity: '15',
        exclusions:
          'Furniture shifting, wall repairs and waterproofing are not included. Any extra work is charged separately.',
      }}
      builder={
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
            <BuilderSummary>
              Paintable area <b><span>{formatQty(areaSqFt, 0)} sq ft</span></b>
              {' · '}paint <span>{formatQty(paint.litres, 1)} litres</span>
              {' · '}putty <span>{formatQty(paint.puttyKg, 1)} kg</span>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
    />
  )
}
