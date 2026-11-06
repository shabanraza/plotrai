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
import { BRICK_CONTENT, finishingHead } from '#/data/finishing-calc-content'
import {
  BRICK_SIZES,
  MORTAR_MIXES,
  calculateBrickwork,
  formatQty,
  type BrickSizeId,
  type LengthUnit,
  type WallThickness,
} from '#/lib/finishing-calc'

export const Route = createFileRoute('/brick-calculator')({
  component: BrickCalculatorPage,
  head: () => finishingHead(BRICK_CONTENT),
})

function BrickCalculatorPage() {
  const [unit, setUnit] = useState<LengthUnit>('ft')
  const [length, setLength] = useState('10')
  const [height, setHeight] = useState('10')
  const [openings, setOpenings] = useState('0')
  const [thickness, setThickness] = useState<WallThickness>('full')
  const [brick, setBrick] = useState<BrickSizeId>('standard')
  const [mix, setMix] = useState('6')
  const [wastage, setWastage] = useState('5')

  function handleThickness(next: WallThickness) {
    setThickness(next)
    // Thin partition walls use a richer mortar
    setMix(next === 'half' ? '4' : '6')
  }

  const result = useMemo(
    () =>
      calculateBrickwork({
        length: parseNumber(length),
        height: parseNumber(height),
        unit,
        thickness,
        brick,
        openings: parseNumber(openings),
        mix: parseNumber(mix),
        wastagePct: parseNumber(wastage),
      }),
    [length, height, unit, thickness, brick, openings, mix, wastage],
  )

  const u = unit === 'ft' ? 'ft' : 'm'

  return (
    <QuantityToolPage
      content={BRICK_CONTENT}
      headline={
        result.bricks > 0
          ? {
              label: 'Bricks needed',
              value: `${formatQty(result.bricks)} bricks`,
            }
          : undefined
      }
      inputs={
        <>
          <ToolSection label="Wall size">
            <div className="flex flex-col gap-6">
              <UnitToggle value={unit} onChange={setUnit} />
              <FieldGroup className="grid gap-4 sm:grid-cols-3">
                <NumberField
                  id="brick-length"
                  label="Wall length"
                  suffix={u}
                  value={length}
                  onChange={setLength}
                />
                <NumberField
                  id="brick-height"
                  label="Wall height"
                  suffix={u}
                  value={height}
                  onChange={setHeight}
                />
                <NumberField
                  id="brick-openings"
                  label="Doors and windows"
                  suffix={unit === 'ft' ? 'sq ft' : 'm²'}
                  value={openings}
                  onChange={setOpenings}
                />
              </FieldGroup>
            </div>
          </ToolSection>

          <ToolSection label="Bricks and mortar">
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Wall thickness</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={thickness}
                  onValueChange={(v) =>
                    v && handleThickness(v as WallThickness)
                  }
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  <ToggleGroupItem value="full" className="min-h-10 px-4">
                    9 inch (one brick)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="half" className="min-h-10 px-4">
                    4.5 inch (half brick)
                  </ToggleGroupItem>
                </ToggleGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend variant="label">Brick size</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={brick}
                  onValueChange={(v) => v && setBrick(v as BrickSizeId)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  {BRICK_SIZES.map((b) => (
                    <ToggleGroupItem
                      key={b.id}
                      value={b.id}
                      className="min-h-10 px-4"
                    >
                      {b.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend variant="label">
                  Mortar mix (cement : sand)
                </FieldLegend>
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
                  id="brick-wastage"
                  label="Brick wastage"
                  suffix="%"
                  value={wastage}
                  onChange={setWastage}
                  description="About 5% for breakage and cutting."
                />
              </FieldGroup>
            </div>
          </ToolSection>
        </>
      }
      result={
        <QuantityResult
          headline={{
            label: 'Bricks needed',
            value: `${formatQty(result.bricks)} bricks`,
            caption: `${result.thicknessMm} mm wall, ${formatQty(result.wallVolumeM3)} m³ of brickwork`,
          }}
          rows={[
            {
              label: 'Bricks',
              value: result.bricks,
              unit: 'nos',
              note: `Includes ${parseNumber(wastage)}% wastage`,
            },
            {
              label: 'Cement',
              value: result.cementBags,
              unit: 'bags',
              note: '50 kg bags',
            },
            { label: 'Sand', value: result.sandCuFt, unit: 'cu ft' },
          ]}
        />
      }
    />
  )
}
