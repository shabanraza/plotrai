import { TilesIllustration } from '#/components/illustrations'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  NumberField,
  QuantityResult,
  UnitToggle,
  parseNumber,
} from '#/components/tools/calc-fields'
import { QuantityToolPage } from '#/components/tools/quantity-tool-page'
import { ToolSection } from '#/components/tools/tool-section'
import { FieldGroup, FieldLegend, FieldSet } from '#/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { TILES_CONTENT, finishingHead } from '#/data/finishing-calc-content'
import {
  TILE_SIZES,
  calculateTiles,
  toSqFt,
  type LengthUnit,
} from '#/lib/finishing-calc'

export const Route = createFileRoute('/tiles-calculator')({
  component: TilesCalculatorPage,
  head: () => finishingHead(TILES_CONTENT),
})

function TilesCalculatorPage() {
  const [unit, setUnit] = useState<LengthUnit>('ft')
  const [length, setLength] = useState('12')
  const [width, setWidth] = useState('10')
  const [size, setSize] = useState<string>('600x600')
  const [wastage, setWastage] = useState('10')
  const [perBox, setPerBox] = useState('')

  const tile = TILE_SIZES.find((t) => t.id === size) ?? TILE_SIZES[0]
  const areaSqFt = toSqFt(parseNumber(length) * parseNumber(width), unit)
  const result = useMemo(
    () =>
      calculateTiles({
        areaSqFt,
        tileWidthMm: tile.w,
        tileHeightMm: tile.h,
        wastagePct: parseNumber(wastage),
        tilesPerBox: parseNumber(perBox),
      }),
    [areaSqFt, tile, wastage, perBox],
  )

  const u = unit === 'ft' ? 'ft' : 'm'

  return (
    <QuantityToolPage
      illustration={<TilesIllustration />}
      content={TILES_CONTENT}
      headline={
        result.tiles > 0
          ? { label: 'Tiles needed', value: `${result.tiles} tiles` }
          : undefined
      }
      inputs={
        <>
          <ToolSection
            label="Floor or wall size"
            description="For an L-shaped room, add up the rectangles."
          >
            <div className="flex flex-col gap-6">
              <UnitToggle value={unit} onChange={setUnit} />
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="tiles-length"
                  label="Length"
                  suffix={u}
                  value={length}
                  onChange={setLength}
                />
                <NumberField
                  id="tiles-width"
                  label="Width or height"
                  suffix={u}
                  value={width}
                  onChange={setWidth}
                />
              </FieldGroup>
            </div>
          </ToolSection>

          <ToolSection label="Tile">
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Tile size</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={size}
                  onValueChange={(v) => v && setSize(v)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  {TILE_SIZES.map((t) => (
                    <ToggleGroupItem
                      key={t.id}
                      value={t.id}
                      className="min-h-10 px-4"
                    >
                      {t.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="tiles-wastage"
                  label="Wastage"
                  suffix="%"
                  value={wastage}
                  onChange={setWastage}
                  description="5–8% for a straight lay, 10–15% for diagonal or many cuts."
                />
                <NumberField
                  id="tiles-per-box"
                  label="Tiles per box (optional)"
                  value={perBox}
                  onChange={setPerBox}
                  placeholder="From the box"
                  description="Printed on the box or the dealer's price list."
                />
              </FieldGroup>
            </div>
          </ToolSection>
        </>
      }
      result={
        <QuantityResult
          headline={{
            label: 'Tiles needed',
            value: `${result.tiles} tiles`,
            caption:
              result.boxes !== null
                ? `${result.boxes} boxes of ${parseNumber(perBox)}`
                : 'Enter tiles per box to see the number of boxes.',
          }}
          rows={[
            { label: 'Area', value: areaSqFt, unit: 'sq ft' },
            {
              label: 'Area with wastage',
              value: result.areaWithWastageSqFt,
              unit: 'sq ft',
            },
            {
              label: 'One tile covers',
              value: result.tileAreaSqFt,
              unit: 'sq ft',
              note: tile.label,
            },
            ...(result.boxes !== null
              ? [{ label: 'Boxes', value: result.boxes, unit: 'boxes' }]
              : []),
          ]}
        />
      }
    />
  )
}
