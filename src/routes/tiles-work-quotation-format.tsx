import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { ToolSection } from '#/components/tools/tool-section'
import { useAreaRooms } from '#/components/tools/trade-quote-builders'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { finishingHead } from '#/data/finishing-calc-content'
import {
  TILES_QUOTATION_CONTENT as CONTENT,
  TRADE_QUOTE_CHECKED,
} from '#/data/trade-quote-content'
import { TILE_SIZES, calculateTiles, formatQty } from '#/lib/finishing-calc'

export const Route = createFileRoute('/tiles-work-quotation-format')({
  component: TilesQuotationPage,
  head: () => finishingHead(CONTENT),
})

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'tiles', description: 'Floor tiles (material)', unit: 'nos', auto: 'tiles' },
  { id: 'boxes', description: 'Tile boxes, if priced per box (material)', unit: 'box', auto: 'boxes' },
  { id: 'adhesive', description: 'Tile adhesive or cement mortar (material)', unit: 'bag' },
  { id: 'grout', description: 'Tile grout (material)', unit: 'kg' },
  { id: 'labour', description: 'Labour: tile laying', unit: 'sq ft', auto: 'area' },
  { id: 'skirting', description: 'Skirting with labour', unit: 'running ft', auto: 'skirting' },
]

function TilesQuotationPage() {
  const rooms = useAreaRooms('Hall')
  const [size, setSize] = useState<string>(TILE_SIZES[0].id)
  const [wastage, setWastage] = useState('10')
  const [perBox, setPerBox] = useState('')
  const tile = TILE_SIZES.find((t) => t.id === size) ?? TILE_SIZES[0]
  const result = calculateTiles({
    areaSqFt: rooms.areaSqFt,
    tileWidthMm: tile.w,
    tileHeightMm: tile.h,
    wastagePct: parseNumber(wastage),
    tilesPerBox: parseNumber(perBox),
  })

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="Tiles work quotation"
      tool="tiles"
      defaultLines={LINES}
      autoQty={{
        tiles: result.tiles,
        boxes: result.boxes ?? 0,
        area: Math.round(rooms.areaSqFt),
        skirting: Math.round(rooms.perimeterFt),
      }}
      defaultTerms={{
        advance: '50',
        validity: '15',
        exclusions:
          'Breaking and removing old tiles, debris removal and waterproofing are not included. Any extra work is charged separately.',
      }}
      builder={
        <ToolSection
          label="Rooms to tile"
          description="Floor sizes in feet. They fill in the tiles, laying area and skirting below."
        >
          <div className="flex flex-col gap-8">
            {rooms.node}
            <FieldGroup className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="tiles-size">Tile size</FieldLabel>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger id="tiles-size" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TILE_SIZES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <NumberField id="tiles-wastage" label="Wastage" suffix="%" value={wastage} onChange={setWastage} />
              <NumberField id="tiles-box" label="Tiles per box" value={perBox} onChange={setPerBox} placeholder="From the box" />
            </FieldGroup>
            <BuilderSummary>
              Floor area <b><span>{formatQty(rooms.areaSqFt, 0)} sq ft</span></b>
              {' · '}tiles <span>{result.tiles}</span>
              {result.boxes !== null && <> {' · '}boxes <span>{result.boxes}</span></>}
              {' · '}skirting <span>{formatQty(rooms.perimeterFt, 0)} running ft</span>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
    />
  )
}
