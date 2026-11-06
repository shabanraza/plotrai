import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  NumberField,
  QuantityResult,
  UnitToggle,
  parseNumber,
} from '#/components/tools/calc-fields'
import { QuantityToolPage } from '#/components/tools/quantity-tool-page'
import { ToolSection } from '#/components/tools/tool-section'
import { FieldGroup, FieldLegend, FieldSet } from '#/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { STEEL_CONTENT, finishingHead } from '#/data/finishing-calc-content'
import {
  BAR_DIAMETERS,
  STEEL_ELEMENTS,
  barWeightKgPerM,
  barsWeightKg,
  formatQty,
  steelByVolumeKg,
  toMetres,
  type LengthUnit,
  type SteelElementId,
} from '#/lib/finishing-calc'

export const Route = createFileRoute('/steel-calculator')({
  component: SteelCalculatorPage,
  head: () => finishingHead(STEEL_CONTENT),
})

type Mode = 'bars' | 'element'

function SteelCalculatorPage() {
  const [mode, setMode] = useState<Mode>('bars')

  // Bar weight
  const [diameter, setDiameter] = useState('12')
  const [barLength, setBarLength] = useState('12')
  const [count, setCount] = useState('10')

  // Element
  const [element, setElement] = useState<SteelElementId>('slab')
  const [unit, setUnit] = useState<LengthUnit>('ft')
  const [length, setLength] = useState('20')
  const [width, setWidth] = useState('15')
  const [depth, setDepth] = useState('125')
  const [percent, setPercent] = useState('1')

  const meta = STEEL_ELEMENTS.find((e) => e.id === element) ?? STEEL_ELEMENTS[0]
  function handleElement(next: SteelElementId) {
    setElement(next)
    const m = STEEL_ELEMENTS.find((e) => e.id === next)
    if (m) setPercent(String(m.defaultPct))
  }

  const d = parseNumber(diameter)
  const perMetre = barWeightKgPerM(d)
  const perBar = perMetre * parseNumber(barLength)
  const barsTotal = barsWeightKg(d, parseNumber(barLength), parseNumber(count))

  const volumeM3 =
    toMetres(parseNumber(length), unit) *
    toMetres(parseNumber(width), unit) *
    (parseNumber(depth) / 1000)
  const elementKg = steelByVolumeKg(volumeM3, parseNumber(percent))

  const totalKg = mode === 'bars' ? barsTotal : elementKg
  const u = unit === 'ft' ? 'ft' : 'm'

  return (
    <QuantityToolPage
      content={STEEL_CONTENT}
      headline={
        totalKg > 0
          ? { label: 'Steel', value: `${formatQty(totalKg, 1)} kg` }
          : undefined
      }
      inputs={
        <ToolSection label="What do you want to work out?">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList variant="line">
              <TabsTrigger value="bars">Bar weight</TabsTrigger>
              <TabsTrigger value="element">Slab, beam or column</TabsTrigger>
            </TabsList>

            <TabsContent value="bars" className="mt-6 flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Bar diameter</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={diameter}
                  onValueChange={(v) => v && setDiameter(v)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  {BAR_DIAMETERS.map((dia) => (
                    <ToggleGroupItem
                      key={dia}
                      value={String(dia)}
                      className="min-h-10 px-4 tabular-nums"
                    >
                      {dia} mm
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="steel-bar-length"
                  label="Length of each bar"
                  suffix="m"
                  value={barLength}
                  onChange={setBarLength}
                  description="TMT bars are usually sold in 12 m lengths."
                />
                <NumberField
                  id="steel-count"
                  label="Number of bars"
                  value={count}
                  onChange={setCount}
                />
              </FieldGroup>
            </TabsContent>

            <TabsContent value="element" className="mt-6 flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">Element</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={element}
                  onValueChange={(v) => v && handleElement(v as SteelElementId)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  {STEEL_ELEMENTS.map((e) => (
                    <ToggleGroupItem
                      key={e.id}
                      value={e.id}
                      className="min-h-10 px-4"
                    >
                      {e.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <UnitToggle value={unit} onChange={setUnit} />
              <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <NumberField
                  id="steel-length"
                  label="Length"
                  suffix={u}
                  value={length}
                  onChange={setLength}
                />
                <NumberField
                  id="steel-width"
                  label="Width"
                  suffix={u}
                  value={width}
                  onChange={setWidth}
                />
                <NumberField
                  id="steel-depth"
                  label={element === 'column' ? 'Height' : 'Thickness or depth'}
                  suffix="mm"
                  value={depth}
                  onChange={setDepth}
                />
                <NumberField
                  id="steel-percent"
                  label="Steel"
                  suffix="% of concrete"
                  value={percent}
                  onChange={setPercent}
                  description={meta.note}
                />
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </ToolSection>
      }
      result={
        mode === 'bars' ? (
          <QuantityResult
            headline={{
              label: 'Total steel',
              value: `${formatQty(barsTotal, 1)} kg`,
              caption: `${formatQty(parseNumber(count))} bars of ${d} mm × ${formatQty(parseNumber(barLength))} m`,
            }}
            rows={[
              {
                label: 'Weight per metre',
                value: perMetre,
                unit: 'kg',
                note: `${d}² ÷ 162`,
              },
              { label: 'Weight per bar', value: perBar, unit: 'kg' },
              { label: 'Total', value: barsTotal, unit: 'kg' },
            ]}
          />
        ) : (
          <QuantityResult
            headline={{
              label: 'Steel needed',
              value: `${formatQty(elementKg, 1)} kg`,
              caption: `${formatQty(elementKg / 1000, 2)} tonnes for ${formatQty(volumeM3)} m³ of concrete`,
            }}
            rows={[
              { label: 'Concrete volume', value: volumeM3, unit: 'm³' },
              {
                label: 'Steel',
                value: elementKg,
                unit: 'kg',
                note: `${parseNumber(percent)}% of the section`,
              },
            ]}
          />
        )
      }
    />
  )
}
