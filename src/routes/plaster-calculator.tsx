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
import { PLASTER_CONTENT, finishingHead } from '#/data/finishing-calc-content'
import {
  MORTAR_MIXES,
  PLASTER_THICKNESS,
  calculatePlaster,
  formatQty,
  toSqFt,
  type LengthUnit,
} from '#/lib/finishing-calc'

export const Route = createFileRoute('/plaster-calculator')({
  component: PlasterCalculatorPage,
  head: () => finishingHead(PLASTER_CONTENT),
})

function PlasterCalculatorPage() {
  const [unit, setUnit] = useState<LengthUnit>('ft')
  const [length, setLength] = useState('10')
  const [height, setHeight] = useState('10')
  const [openings, setOpenings] = useState('0')
  const [thickness, setThickness] = useState('12')
  const [mix, setMix] = useState('4')
  const [wastage, setWastage] = useState('5')

  const areaSqFt = Math.max(
    0,
    toSqFt(
      parseNumber(length) * parseNumber(height) - parseNumber(openings),
      unit,
    ),
  )
  const result = useMemo(
    () =>
      calculatePlaster({
        areaSqFt,
        thicknessMm: parseNumber(thickness),
        mix: parseNumber(mix),
        wastagePct: parseNumber(wastage),
      }),
    [areaSqFt, thickness, mix, wastage],
  )

  const u = unit === 'ft' ? 'ft' : 'm'
  const bags = `${formatQty(result.cementBags, 1)} bags`

  return (
    <QuantityToolPage
      content={PLASTER_CONTENT}
      headline={
        result.cementBags > 0
          ? { label: 'Cement needed', value: bags }
          : undefined
      }
      inputs={
        <>
          <ToolSection
            label="Area to plaster"
            description="Add up every wall, or enter the ceiling size."
          >
            <div className="flex flex-col gap-6">
              <UnitToggle value={unit} onChange={setUnit} />
              <FieldGroup className="grid gap-4 sm:grid-cols-3">
                <NumberField
                  id="plaster-length"
                  label="Length"
                  suffix={u}
                  value={length}
                  onChange={setLength}
                />
                <NumberField
                  id="plaster-height"
                  label="Height or width"
                  suffix={u}
                  value={height}
                  onChange={setHeight}
                />
                <NumberField
                  id="plaster-openings"
                  label="Doors and windows"
                  suffix={unit === 'ft' ? 'sq ft' : 'm²'}
                  value={openings}
                  onChange={setOpenings}
                />
              </FieldGroup>
            </div>
          </ToolSection>

          <ToolSection label="Plaster">
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Thickness</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={thickness}
                  onValueChange={(v) => v && setThickness(v)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  {PLASTER_THICKNESS.map((t) => (
                    <ToggleGroupItem
                      key={t.mm}
                      value={String(t.mm)}
                      className="min-h-10 px-4"
                    >
                      {t.label}{' '}
                      <span className="text-[var(--foreground)]/65">
                        · {t.hint}
                      </span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend variant="label">Mix (cement : sand)</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={mix}
                  onValueChange={(v) => v && setMix(v)}
                  variant="outline"
                  className="justify-start"
                >
                  {MORTAR_MIXES.map((m) => (
                    <ToggleGroupItem
                      key={m}
                      value={String(m)}
                      className="min-h-10 px-4 tabular-nums"
                    >
                      1:{m}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="plaster-wastage"
                  label="Wastage"
                  suffix="%"
                  value={wastage}
                  onChange={setWastage}
                  description="5–10%, more on uneven brickwork."
                />
              </FieldGroup>
            </div>
          </ToolSection>
        </>
      }
      result={
        <QuantityResult
          headline={{
            label: 'Cement needed',
            value: bags,
            caption: `and ${formatQty(result.sandCuFt, 1)} cu ft of sand for ${formatQty(areaSqFt)} sq ft`,
          }}
          rows={[
            { label: 'Area', value: areaSqFt, unit: 'sq ft' },
            {
              label: 'Cement',
              value: result.cementBags,
              unit: 'bags',
              note: '50 kg bags',
            },
            { label: 'Sand', value: result.sandCuFt, unit: 'cu ft' },
            {
              label: 'Wet plaster volume',
              value: result.wetVolumeM3,
              unit: 'm³',
            },
          ]}
        />
      }
    />
  )
}
