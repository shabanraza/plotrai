import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { ToolSection } from '#/components/tools/tool-section'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { FieldGroup, FieldLegend, FieldSet } from '#/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { finishingHead } from '#/data/finishing-calc-content'
import { CIVIL_WORK_QUOTATION_CONTENT as CONTENT } from '#/data/quote-content/civil-work'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'
import { civilWorkQuantities } from '#/lib/civil-quote'
import { formatQty, type WallThickness } from '#/lib/finishing-calc'

export const Route = createFileRoute('/civil-work-quotation-format')({
  component: CivilWorkQuotationPage,
  head: () => finishingHead(CONTENT),
})

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'bricks', description: 'Bricks, 230 mm common (material)', unit: 'nos', auto: 'bricks' },
  { id: 'cement', description: 'Cement, 50 kg bags (material)', unit: 'bag', auto: 'cement' },
  { id: 'sand', description: 'Sand (material)', unit: 'cu ft', auto: 'sand' },
  { id: 'agg', description: 'Aggregate 20 mm (material)', unit: 'cu ft', auto: 'aggregate' },
  { id: 'steel', description: 'TMT steel bars (material)', unit: 'kg', auto: 'steel' },
  { id: 'l-brick', description: 'Labour: brickwork', unit: 'sq ft', auto: 'wallArea' },
  { id: 'l-plaster', description: 'Labour: plaster', unit: 'sq ft', auto: 'plasterArea' },
  { id: 'l-slab', description: 'Labour: RCC slab with shuttering', unit: 'sq ft', auto: 'slabArea' },
]

function CivilWorkQuotationPage() {
  const [wallL, setWallL] = useState('20')
  const [wallH, setWallH] = useState('10')
  const [thickness, setThickness] = useState<WallThickness>('full')
  const [openings, setOpenings] = useState('21')
  const [plasterArea, setPlasterArea] = useState('358')
  const [plasterMm, setPlasterMm] = useState('12')
  const [slabL, setSlabL] = useState('20')
  const [slabW, setSlabW] = useState('15')
  const [slabMm, setSlabMm] = useState('125')

  const q = civilWorkQuantities({
    wall: { lengthFt: parseNumber(wallL), heightFt: parseNumber(wallH), thickness, openingsSqFt: parseNumber(openings) },
    plaster: { areaSqFt: parseNumber(plasterArea), thicknessMm: parseNumber(plasterMm) },
    slab: { lengthFt: parseNumber(slabL), widthFt: parseNumber(slabW), thicknessMm: parseNumber(slabMm) },
  })

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="Civil work quotation"
      tool="civil"
      defaultLines={LINES}
      autoQty={{
        bricks: q.bricks,
        cement: Math.ceil(q.cementBags),
        sand: Math.ceil(q.sandCuFt),
        aggregate: Math.ceil(q.aggregateCuFt),
        steel: Math.ceil(q.steelKg),
        wallArea: Math.round(q.wallAreaSqFt),
        plasterArea: Math.round(q.plasterAreaSqFt),
        slabArea: Math.round(q.slabAreaSqFt),
      }}
      defaultTerms={{
        advance: '30',
        validity: '7',
        exclusions:
          'Shuttering hire, curing water, electricity, and debris removal are not included unless listed above. Material prices are as on the quote date.',
      }}
      builder={
        <>
          <ToolSection label="Brick wall" description="Sizes in feet. Leave at 0 to skip.">
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Wall thickness</FieldLegend>
                <ToggleGroup type="single" value={thickness} onValueChange={(v) => v && setThickness(v as WallThickness)} variant="outline" className="justify-start">
                  <ToggleGroupItem value="full" className="min-h-10 px-4">9 inch</ToggleGroupItem>
                  <ToggleGroupItem value="half" className="min-h-10 px-4">4.5 inch</ToggleGroupItem>
                </ToggleGroup>
              </FieldSet>
              <FieldGroup className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <NumberField id="cw-wl" label="Length" suffix="ft" value={wallL} onChange={setWallL} />
                <NumberField id="cw-wh" label="Height" suffix="ft" value={wallH} onChange={setWallH} />
                <NumberField id="cw-wo" label="Doors, windows" suffix="sq ft" value={openings} onChange={setOpenings} />
              </FieldGroup>
            </div>
          </ToolSection>
          <ToolSection label="Plaster" description="Count both faces if both are plastered.">
            <FieldGroup className="grid grid-cols-2 gap-4">
              <NumberField id="cw-pa" label="Plaster area" suffix="sq ft" value={plasterArea} onChange={setPlasterArea} />
              <NumberField id="cw-pt" label="Thickness" suffix="mm" value={plasterMm} onChange={setPlasterMm} />
            </FieldGroup>
          </ToolSection>
          <ToolSection label="RCC slab" description="M20 with about 80 kg of steel per m³.">
            <div className="flex flex-col gap-6">
              <FieldGroup className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <NumberField id="cw-sl" label="Length" suffix="ft" value={slabL} onChange={setSlabL} />
                <NumberField id="cw-sw" label="Width" suffix="ft" value={slabW} onChange={setSlabW} />
                <NumberField id="cw-st" label="Thickness" suffix="mm" value={slabMm} onChange={setSlabMm} />
              </FieldGroup>
              <BuilderSummary>
                Cement <b><span>{formatQty(q.cementBags, 1)} bags</span></b>
                {' · '}bricks <span>{q.bricks}</span>
                {' · '}sand <span>{formatQty(q.sandCuFt, 0)} cu ft</span>
                {' · '}aggregate <span>{formatQty(q.aggregateCuFt, 0)} cu ft</span>
                {' · '}steel <span>{formatQty(q.steelKg, 0)} kg</span>
              </BuilderSummary>
            </div>
          </ToolSection>
        </>
      }
    />
  )
}
