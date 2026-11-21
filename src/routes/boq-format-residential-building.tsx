import { createFileRoute } from '@tanstack/react-router'
import { FileSpreadsheet, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { ToolSection } from '#/components/tools/tool-section'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { Button } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { finishingHead } from '#/data/finishing-calc-content'
import { BOQ_CONTENT as CONTENT } from '#/data/quote-content/boq'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'
import { boqMaterials, quoteCsv } from '#/lib/boq'
import { formatQty } from '#/lib/finishing-calc'
import { ELEMENT_META, type ElementType } from '#/lib/material-calc'
import { track } from '#/lib/track'

export const Route = createFileRoute('/boq-format-residential-building')({
  component: BoqPage,
  head: () => finishingHead(CONTENT),
})

interface Element {
  id: string
  type: ElementType
  length: string
  width: string
  thickness: string
}

let nextId = 0
const ELEMENT_TYPES = Object.keys(ELEMENT_META) as Array<ElementType>
const ELEMENT_LABELS: Record<ElementType, string> = {
  brickwork: 'Brickwork (wall)',
  rcc_slab: 'RCC slab',
  rcc_column: 'RCC column',
  pcc: 'PCC (foundation or base)',
  plaster: 'Plaster',
}

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'cement', description: 'Cement, 50 kg bags', unit: 'bag', auto: 'cement' },
  { id: 'sand', description: 'Sand', unit: 'cu ft', auto: 'sand' },
  { id: 'agg', description: 'Aggregate 20 mm', unit: 'cu ft', auto: 'aggregate' },
  { id: 'bricks', description: 'Bricks, 230 mm common', unit: 'nos', auto: 'bricks' },
  { id: 'steel', description: 'TMT steel bars', unit: 'kg', auto: 'steel' },
]

function BoqPage() {
  const [elements, setElements] = useState<Array<Element>>([
    { id: 'e0', type: 'rcc_slab', length: '6', width: '4', thickness: '125' },
    { id: 'e1', type: 'brickwork', length: '20', width: '3', thickness: '230' },
    { id: 'e2', type: 'plaster', length: '20', width: '3', thickness: '12' },
  ])
  const update = (id: string, patch: Partial<Element>) =>
    setElements((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  const m = boqMaterials(
    elements.map((e) => ({
      type: e.type,
      length: parseNumber(e.length),
      width: parseNumber(e.width),
      thicknessMm: parseNumber(e.thickness),
    })),
  )

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="Bill of quantities"
      tool="boq"
      docKind="BOQ"
      lineItemsLabel="Bill of quantities"
      defaultLines={LINES}
      autoQty={{
        cement: Math.ceil(m.cement),
        sand: Math.ceil(m.sand),
        aggregate: Math.ceil(m.aggregate),
        bricks: Math.ceil(m.bricks),
        steel: Math.ceil(m.steel),
      }}
      defaultTerms={{
        advance: '0',
        validity: '15',
        exclusions: 'Quantities are estimates from thumb rules. Labour, shuttering and transport are not included unless listed above.',
      }}
      extraActions={({ lines, gstPct }) => (
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            const blob = new Blob([`﻿${quoteCsv(lines, gstPct)}`], { type: 'text/csv;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'boq-residential-building.csv'
            a.click()
            URL.revokeObjectURL(url)
            track('quote_csv_download', { tool: 'boq' })
          }}
        >
          <FileSpreadsheet data-icon="inline-start" />
          Download Excel (CSV)
        </Button>
      )}
      builder={
        <ToolSection label="Elements" description="Sizes in metres; thickness in millimetres.">
          <div className="flex flex-col gap-8">
            {elements.map((e) => {
              const meta = ELEMENT_META[e.type]
              return (
                <div key={e.id} className="flex items-end gap-2">
                  <FieldGroup className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">
                    <Field className="col-span-2 lg:col-span-1">
                      <FieldLabel htmlFor={`${e.id}-t`}>Element</FieldLabel>
                      <Select
                        value={e.type}
                        onValueChange={(v) =>
                          update(e.id, {
                            type: v as ElementType,
                            thickness: String(ELEMENT_META[v as ElementType].inputs[2].defaultMm ?? ''),
                          })
                        }
                      >
                        <SelectTrigger id={`${e.id}-t`} className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ELEMENT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {ELEMENT_LABELS[t]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <NumberField id={`${e.id}-l`} label={stripUnit(meta.inputs[0].label)} suffix="m" value={e.length} onChange={(v) => update(e.id, { length: v })} />
                    <NumberField id={`${e.id}-w`} label={stripUnit(meta.inputs[1].label)} suffix="m" value={e.width} onChange={(v) => update(e.id, { width: v })} />
                    <NumberField id={`${e.id}-th`} label={stripUnit(meta.inputs[2].label)} suffix="mm" value={e.thickness} onChange={(v) => update(e.id, { thickness: v })} />
                  </FieldGroup>
                  {elements.length > 1 && (
                    <Button variant="ghost" size="icon" aria-label="Remove element" onClick={() => setElements((es) => es.filter((x) => x.id !== e.id))}>
                      <Trash2 />
                    </Button>
                  )}
                </div>
              )
            })}
            <div>
              <Button
                variant="outline"
                onClick={() => setElements((es) => [...es, { id: `e-${++nextId}`, type: 'pcc', length: '', width: '', thickness: '100' }])}
              >
                <Plus data-icon="inline-start" />
                Add element
              </Button>
            </div>
            <BuilderSummary>
              Cement <b><span>{formatQty(m.cement, 1)} bags</span></b>
              {' · '}sand <span>{formatQty(m.sand, 0)} cu ft</span>
              {' · '}aggregate <span>{formatQty(m.aggregate, 0)} cu ft</span>
              {' · '}bricks <span>{formatQty(m.bricks, 0)}</span>
              {' · '}steel <span>{formatQty(m.steel, 0)} kg</span>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
    />
  )
}

/** "Wall length (m)" → "Wall length"; the unit is shown as a suffix */
function stripUnit(label: string): string {
  return label.replace(/\s*\((m|mm)\)$/, '')
}
