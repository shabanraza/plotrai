import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { QuantityToolPage } from '#/components/tools/quantity-tool-page'
import { ToolSection } from '#/components/tools/tool-section'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '#/components/ui/field'
import { Switch } from '#/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '#/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { finishingHead } from '#/data/finishing-calc-content'
import { INTERIOR_CONTENT } from '#/data/interior-calc-content'
import {
  BHK_DEFAULTS,
  BHK_OPTIONS,
  FINISHES,
  formatLakh,
  interiorLines,
  interiorTotal,
  type Bhk,
  type CeilingScope,
  type Finish,
  type InteriorInput,
  type RoomSize,
} from '#/lib/interior-calc'

export const Route = createFileRoute('/home-interior-cost-calculator')({
  component: HomeInteriorCostPage,
  head: () => finishingHead(INTERIOR_CONTENT),
})

const SIZES: ReadonlyArray<{ id: RoomSize | 'none'; label: string }> = [
  { id: 'none', label: 'Skip' },
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
]

const CEILINGS: ReadonlyArray<{ id: CeilingScope; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'living', label: 'Living and dining' },
  { id: 'whole', label: 'Whole home' },
]

const FINISH_HINT: Record<Finish, string> = {
  essential:
    'Low end of each published range: laminate finishes, standard hardware.',
  mid: 'Middle of each range: what most quotes for a family flat land at.',
  premium:
    'High end of each range: acrylic or lacquered finishes, soft-close hardware.',
}

function Pills<T extends string>({
  legend,
  value,
  onChange,
  options,
  description,
}: {
  legend: string
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<{ id: T; label: string }>
  description?: string
}) {
  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
        variant="outline"
        className="flex w-full flex-wrap justify-start"
      >
        {options.map((o) => (
          <ToggleGroupItem key={o.id} value={o.id} className="min-h-10 px-4">
            {o.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
    </FieldSet>
  )
}

function HomeInteriorCostPage() {
  const [bhk, setBhk] = useState<Bhk>(2)
  const [carpet, setCarpet] = useState(String(BHK_DEFAULTS[2].carpetSqFt))
  const [finish, setFinish] = useState<Finish>('mid')
  const [kitchen, setKitchen] = useState<RoomSize | 'none'>('medium')
  const [living, setLiving] = useState<RoomSize | 'none'>('medium')
  const [wardrobes, setWardrobes] = useState('2')
  const [ceiling, setCeiling] = useState<CeilingScope>('living')
  const [painting, setPainting] = useState(true)
  const [bathrooms, setBathrooms] = useState('0')

  function chooseBhk(next: Bhk) {
    const d = BHK_DEFAULTS[next]
    setBhk(next)
    setCarpet(String(d.carpetSqFt))
    setKitchen(d.kitchen)
    setLiving(d.living)
    setWardrobes(String(next))
  }

  const input: InteriorInput = useMemo(
    () => ({
      finish,
      carpetSqFt: parseNumber(carpet),
      kitchen,
      living,
      wardrobes: parseNumber(wardrobes),
      ceiling,
      painting,
      bathrooms: parseNumber(bathrooms),
    }),
    [finish, carpet, kitchen, living, wardrobes, ceiling, painting, bathrooms],
  )
  const lines = interiorLines(input)
  const total = interiorTotal(input)
  const area = parseNumber(carpet)
  const perSqFt = area > 0 ? Math.round(total / area) : 0

  return (
    <QuantityToolPage
      content={INTERIOR_CONTENT}
      headline={
        total > 0
          ? { label: 'Interior estimate', value: formatLakh(total) }
          : undefined
      }
      inputs={
        <>
          <ToolSection
            label="Your home"
            description="Use the carpet area from your sale agreement or floor plan."
          >
            <div className="flex flex-col gap-6">
              <Pills
                legend="Flat size"
                value={String(bhk)}
                onChange={(v) => chooseBhk(Number(v) as Bhk)}
                options={BHK_OPTIONS.map((b) => ({
                  id: String(b),
                  label: `${b} BHK`,
                }))}
              />
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="interior-carpet"
                  label="Carpet area"
                  suffix="sq ft"
                  value={carpet}
                  onChange={setCarpet}
                />
              </FieldGroup>
              <Pills
                legend="Finish"
                value={finish}
                onChange={setFinish}
                options={FINISHES}
                description={FINISH_HINT[finish]}
              />
            </div>
          </ToolSection>

          <ToolSection label="What to include">
            <div className="flex flex-col gap-6">
              <Pills
                legend="Modular kitchen"
                value={kitchen}
                onChange={setKitchen}
                options={SIZES}
                description="Small 50–80 sq ft, medium 80–120 sq ft, large above 120 sq ft."
              />
              <Pills
                legend="Living room (TV unit, seating, lighting)"
                value={living}
                onChange={setLiving}
                options={SIZES}
                description="Small 100–150 sq ft, medium 150–250 sq ft, large above 250 sq ft."
              />
              <Pills
                legend="False ceiling"
                value={ceiling}
                onChange={setCeiling}
                options={CEILINGS}
              />
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="interior-wardrobes"
                  label="Wardrobes"
                  value={wardrobes}
                  onChange={setWardrobes}
                  description="Usually one per bedroom."
                />
                <NumberField
                  id="interior-bathrooms"
                  label="Bathrooms to upgrade"
                  value={bathrooms}
                  onChange={setBathrooms}
                  description="Leave at 0 for a new flat."
                />
              </FieldGroup>
              <Field orientation="horizontal">
                <Switch
                  id="interior-painting"
                  checked={painting}
                  onCheckedChange={setPainting}
                />
                <FieldLabel htmlFor="interior-painting" className="font-normal">
                  Repaint the walls
                </FieldLabel>
              </Field>
            </div>
          </ToolSection>
        </>
      }
      result={
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 rounded-xl bg-[var(--brand-light)] p-5 sm:p-6">
            <p className="text-sm font-medium text-[var(--foreground)]/75">
              Interior estimate for your {bhk} BHK
            </p>
            <p className="text-3xl font-semibold tracking-tight text-[var(--brand)] tabular-nums sm:text-4xl">
              {formatLakh(total)}
            </p>
            {perSqFt > 0 && (
              <p className="text-sm text-[var(--foreground)]/75">
                About ₹{perSqFt.toLocaleString('en-IN')} per sq ft of carpet
                area
              </p>
            )}
          </div>
          {lines.length > 0 && (
            <Table>
              <TableBody>
                {lines.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="py-3 whitespace-normal">
                      <span className="font-medium">{l.label}</span>
                      <span className="block text-sm text-[var(--muted-foreground)] first-letter:uppercase">
                        {l.detail}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right font-semibold tabular-nums">
                      ₹{Math.round(l.amount).toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-transparent">
                <TableRow>
                  <TableCell className="py-3 font-semibold">Total</TableCell>
                  <TableCell className="py-3 text-right font-semibold tabular-nums">
                    ₹{Math.round(total).toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
          <p className="text-sm text-[var(--foreground)]/75">
            Same choices at other finishes:{' '}
            {FINISHES.filter((f) => f.id !== finish)
              .map(
                (f) =>
                  `${f.label} ${formatLakh(interiorTotal({ ...input, finish: f.id }))}`,
              )
              .join(' · ')}
          </p>
        </div>
      }
    />
  )
}
