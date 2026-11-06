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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '#/components/ui/field'
import { Switch } from '#/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { PAINT_CONTENT, finishingHead } from '#/data/finishing-calc-content'
import {
  DEFAULT_PAINT_COVERAGE_SQFT,
  DEFAULT_PUTTY_COVERAGE_SQFT,
  calculatePaint,
  formatQty,
  roomPaintAreaSqFt,
  type LengthUnit,
} from '#/lib/finishing-calc'

export const Route = createFileRoute('/paint-calculator')({
  component: PaintCalculatorPage,
  head: () => finishingHead(PAINT_CONTENT),
})

function PaintCalculatorPage() {
  const [unit, setUnit] = useState<LengthUnit>('ft')
  const [length, setLength] = useState('12')
  const [width, setWidth] = useState('10')
  const [height, setHeight] = useState('10')
  const [openings, setOpenings] = useState('40')
  const [ceiling, setCeiling] = useState(false)
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState(String(DEFAULT_PAINT_COVERAGE_SQFT))
  const [putty, setPutty] = useState(true)
  const [puttyCoverage, setPuttyCoverage] = useState(
    String(DEFAULT_PUTTY_COVERAGE_SQFT),
  )

  const areaSqFt = roomPaintAreaSqFt({
    length: parseNumber(length),
    width: parseNumber(width),
    height: parseNumber(height),
    unit,
    includeCeiling: ceiling,
    openings: parseNumber(openings),
  })
  const result = useMemo(
    () =>
      calculatePaint({
        areaSqFt,
        coats: parseNumber(coats),
        coverageSqFtPerLitre: parseNumber(coverage),
        includePutty: putty,
        puttyCoverageSqFtPerKg: parseNumber(puttyCoverage),
      }),
    [areaSqFt, coats, coverage, putty, puttyCoverage],
  )

  const u = unit === 'ft' ? 'ft' : 'm'
  const litres = `${formatQty(result.litres, 1)} litres`

  return (
    <QuantityToolPage
      content={PAINT_CONTENT}
      headline={
        result.litres > 0 ? { label: 'Paint needed', value: litres } : undefined
      }
      inputs={
        <>
          <ToolSection label="Room size">
            <div className="flex flex-col gap-6">
              <UnitToggle value={unit} onChange={setUnit} />
              <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <NumberField
                  id="paint-length"
                  label="Length"
                  suffix={u}
                  value={length}
                  onChange={setLength}
                />
                <NumberField
                  id="paint-width"
                  label="Width"
                  suffix={u}
                  value={width}
                  onChange={setWidth}
                />
                <NumberField
                  id="paint-height"
                  label="Ceiling height"
                  suffix={u}
                  value={height}
                  onChange={setHeight}
                />
                <NumberField
                  id="paint-openings"
                  label="Doors and windows"
                  suffix={unit === 'ft' ? 'sq ft' : 'm²'}
                  value={openings}
                  onChange={setOpenings}
                  description="A door is about 21 sq ft."
                />
              </FieldGroup>
              <Field orientation="horizontal">
                <Switch
                  id="paint-ceiling"
                  checked={ceiling}
                  onCheckedChange={setCeiling}
                />
                <FieldLabel htmlFor="paint-ceiling" className="font-normal">
                  Paint the ceiling too
                </FieldLabel>
              </Field>
            </div>
          </ToolSection>

          <ToolSection label="Paint and putty">
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Coats of paint</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={coats}
                  onValueChange={(v) => v && setCoats(v)}
                  variant="outline"
                  className="justify-start"
                >
                  {['1', '2', '3'].map((c) => (
                    <ToggleGroupItem
                      key={c}
                      value={c}
                      className="min-h-10 px-5 tabular-nums"
                    >
                      {c}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="paint-coverage"
                  label="Paint coverage per coat"
                  suffix="sq ft / litre"
                  value={coverage}
                  onChange={setCoverage}
                  description="90 is from a leading emulsion's data sheet. Use the figure on your tin."
                />
                {putty && (
                  <NumberField
                    id="paint-putty-coverage"
                    label="Putty coverage"
                    suffix="sq ft / kg"
                    value={puttyCoverage}
                    onChange={setPuttyCoverage}
                    description="About 20 sq ft per kg for two coats."
                  />
                )}
              </FieldGroup>
              <Field orientation="horizontal">
                <Switch
                  id="paint-putty"
                  checked={putty}
                  onCheckedChange={setPutty}
                />
                <FieldLabel htmlFor="paint-putty" className="font-normal">
                  Include wall putty
                </FieldLabel>
              </Field>
            </div>
          </ToolSection>
        </>
      }
      result={
        <QuantityResult
          headline={{
            label: 'Paint needed',
            value: litres,
            caption: `${parseNumber(coats)} coats over ${formatQty(areaSqFt)} sq ft`,
          }}
          rows={[
            { label: 'Paintable area', value: areaSqFt, unit: 'sq ft' },
            { label: 'Paint', value: result.litres, unit: 'litres' },
            ...(putty
              ? [{ label: 'Wall putty', value: result.puttyKg, unit: 'kg' }]
              : []),
          ]}
        />
      }
    />
  )
}
