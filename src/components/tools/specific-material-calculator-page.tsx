import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { calculateMaterials, type Dimensions, type ElementType } from '#/lib/material-calc'
import { MATERIAL_CALC_FAQS } from '#/data/tool-seo-content'

export interface SpecificMaterialConfig {
  mode: ElementType
  path: string
  title: string
  description: string
  defaultLength: number
  defaultWidth: number
  defaultThicknessMm: number
  showGrade?: boolean
  context: ReadonlyArray<string>
}

const GRADE_MULTIPLIERS = {
  M10: 0.78,
  M15: 0.9,
  M20: 1,
  M25: 1.08,
} as const

export function SpecificMaterialCalculatorPage({ config }: { config: SpecificMaterialConfig }) {
  const [length, setLength] = useState(String(config.defaultLength))
  const [width, setWidth] = useState(String(config.defaultWidth))
  const [thickness, setThickness] = useState(String(config.defaultThicknessMm))
  const [grade, setGrade] = useState<keyof typeof GRADE_MULTIPLIERS>('M20')

  const result = useMemo(() => {
    const dims: Dimensions = {
      length: parseNumber(length),
      width: parseNumber(width),
      thickness: config.mode === 'plaster' ? parseNumber(thickness) : parseNumber(thickness) / 1000,
    }
    const base = calculateMaterials(config.mode, dims)
    const multiplier = config.showGrade ? GRADE_MULTIPLIERS[grade] : 1
    return {
      cement: base.cement * multiplier,
      sand: base.sand * multiplier,
      aggregate: base.aggregate * multiplier,
      bricks: base.bricks,
      steel: base.steel,
    }
  }, [config.mode, config.showGrade, grade, length, thickness, width])

  const rows = [
    { label: 'Cement', value: result.cement, unit: 'bags' },
    { label: 'Sand', value: result.sand, unit: 'cu ft' },
    { label: 'Aggregate', value: result.aggregate, unit: 'cu ft' },
    { label: 'Bricks', value: result.bricks, unit: 'nos' },
    { label: 'Steel', value: result.steel, unit: 'kg' },
  ].filter((row) => row.value > 0)

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: config.title },
      ]}
      eyebrow={{ icon: Calculator, label: 'Material estimate' }}
      title={config.title}
      tagline={config.description}
      variant="single-column"
      footnote="Quantities use Indian site-engineer thumb rules. Add 5-10% wastage before ordering and confirm structural steel with your engineer."
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Dimensions" rule={false}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumberField
              id={`${config.path}-length`}
              label="Length"
              suffix="m"
              value={length}
              onChange={setLength}
              description="Longest side or wall length."
            />
            <NumberField
              id={`${config.path}-width`}
              label="Width / height"
              suffix="m"
              value={width}
              onChange={setWidth}
              description="Second side, width, or wall height."
            />
            <NumberField
              id={`${config.path}-thickness`}
              label="Thickness"
              suffix="mm"
              value={thickness}
              onChange={setThickness}
              description="Typical slab 125-150mm, PCC 100mm."
            />
            {config.showGrade && (
              <Field>
                <FieldLabel htmlFor={`${config.path}-grade`}>Concrete grade</FieldLabel>
                <Select value={grade} onValueChange={(value) => setGrade(value as keyof typeof GRADE_MULTIPLIERS)}>
                  <SelectTrigger id={`${config.path}-grade`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Grade</SelectLabel>
                      {Object.keys(GRADE_MULTIPLIERS).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>M20 is the common residential RCC baseline.</FieldDescription>
              </Field>
            )}
          </FieldGroup>
        </ToolSection>

        <ToolSection number="02" label="Material quantity">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-[var(--accent-teal)]">
                    {formatQty(row.value)} {row.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ToolSection>

        <ToolContext title={`How this ${config.title.toLowerCase()} works`}>
          {config.context.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ToolContext>

        <ToolFaq items={MATERIAL_CALC_FAQS.slice(0, 4)} />
      </div>
    </ToolPageShell>
  )
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  description,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  suffix: string
  description: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
            {suffix}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}

function parseNumber(value: string) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatQty(n: number) {
  if (!Number.isFinite(n) || n === 0) return '0'
  if (n >= 100) return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}
