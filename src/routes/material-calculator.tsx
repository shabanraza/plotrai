import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Calculator, RefreshCw } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import { Label } from '#/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '#/components/ui/table'
import {
  ELEMENT_META,
  calculateMaterials,
  type ElementType,
  type Dimensions,
} from '#/lib/material-calc'
import { MATERIAL_RATES, RATES_LAST_UPDATED } from '#/data/material-rates'
import { getLiveRates, type LiveRates } from '#/server/get-live-rates'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'

export const Route = createFileRoute('/material-calculator')({
  component: MaterialCalculatorPage,
  head: () => ({
    meta: [
      {
        title: 'Construction Material Calculator India — Cement, Brick, Steel, Sand · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Free calculator for cement bags, sand cuft, bricks, and steel required for any construction in India. Brickwork, RCC slab, column, plaster, PCC. Fresh 2026 market rates, no signup.',
      },
      { property: 'og:title', content: 'Construction Material Calculator India' },
      {
        property: 'og:description',
        content:
          'Calculate cement, sand, bricks, and steel for any construction. Fresh Indian rates 2026.',
      },
    ],
  }),
})

const ELEMENTS: ReadonlyArray<ElementType> = [
  'brickwork',
  'rcc_slab',
  'rcc_column',
  'pcc',
  'plaster',
]

type RateKey = keyof typeof MATERIAL_RATES

function MaterialCalculatorPage() {
  const [element, setElement] = useState<ElementType>('brickwork')
  const meta = ELEMENT_META[element]

  const [dims, setDims] = useState<Dimensions>(() => initialDims(element))
  const [rates, setRates] = useState<Record<RateKey, number>>(() => ({
    cement: MATERIAL_RATES.cement.value,
    sand: MATERIAL_RATES.sand.value,
    aggregate: MATERIAL_RATES.aggregate.value,
    bricks: MATERIAL_RATES.bricks.value,
    steel: MATERIAL_RATES.steel.value,
  }))
  const [liveMeta, setLiveMeta] = useState<LiveRates | null>(null)
  const [isFetchingRates, setIsFetchingRates] = useState(false)

  async function refreshRates() {
    setIsFetchingRates(true)
    try {
      const live = await getLiveRates()
      setLiveMeta(live)
      setRates({
        cement: live.cement,
        sand: live.sand,
        aggregate: live.aggregate,
        bricks: live.bricks,
        steel: live.steel,
      })
    } catch {
      // server fn already falls back; no UI change needed
    } finally {
      setIsFetchingRates(false)
    }
  }

  useEffect(() => {
    void refreshRates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleElementChange(next: ElementType) {
    setElement(next)
    setDims(initialDims(next))
  }

  // Convert thickness from mm → m for non-plaster (plaster keeps mm)
  const normalisedDims = useMemo<Dimensions>(() => {
    if (element === 'plaster') return dims
    return { ...dims, thickness: dims.thickness / 1000 }
  }, [dims, element])

  const materials = useMemo(
    () => calculateMaterials(element, normalisedDims),
    [element, normalisedDims],
  )

  const rows = (
    [
      { key: 'cement', qty: materials.cement, unit: MATERIAL_RATES.cement.unit },
      { key: 'sand', qty: materials.sand, unit: MATERIAL_RATES.sand.unit },
      { key: 'aggregate', qty: materials.aggregate, unit: MATERIAL_RATES.aggregate.unit },
      { key: 'bricks', qty: materials.bricks, unit: MATERIAL_RATES.bricks.unit },
      { key: 'steel', qty: materials.steel, unit: MATERIAL_RATES.steel.unit },
    ] as const
  ).filter((r) => r.qty > 0)

  const totalCost = rows.reduce((sum, r) => sum + r.qty * rates[r.key], 0)

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Material Calculator' },
      ]}
      eyebrow={{ icon: Calculator, label: 'Calculator · Live' }}
      title="Construction Material Calculator"
      tagline="Calculate cement, bricks, steel, sand, and aggregate needed for any construction element. Fresh Indian market rates — editable per project."
      variant="single-column"
      footnote={`Quantities are estimated using standard Indian site-engineer thumb rules (M20 mix for RCC, 1:6 for brickwork mortar, 1:4 for plaster). Add 5–10% wastage when ordering. Default rates last updated ${RATES_LAST_UPDATED}.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="What are you building?" rule={false}>
          <ToggleGroup
            type="single"
            value={element}
            onValueChange={(v) => v && handleElementChange(v as ElementType)}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            {ELEMENTS.map((el) => (
              <ToggleGroupItem key={el} value={el}>
                {ELEMENT_META[el].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">{meta.helper}</p>
        </ToolSection>

        <ToolSection number="02" label="Dimensions" description="Enter the size of the element you're calculating.">
          <div className="grid gap-4 sm:grid-cols-3">
            {meta.inputs.map((input) => (
              <div key={input.key} className="flex flex-col gap-2">
                <Label htmlFor={input.key}>{input.label}</Label>
                <Input
                  id={input.key}
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={dims[input.key] || ''}
                  onChange={(e) =>
                    setDims((d) => ({ ...d, [input.key]: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          number="03"
          label="Market rates"
          description={
            liveMeta
              ? `Source: ${liveMeta.source}. Override any field with your local quote.`
              : `Defaults from Plotr Ai baseline (${RATES_LAST_UPDATED}). Override with your local quotes.`
          }
          action={
            <div className="flex items-center gap-2">
              {liveMeta?.isLive && (
                <Badge variant="secondary" className="gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <span className="size-1.5 rounded-full bg-[var(--accent-teal)]" aria-hidden />
                  Live
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={refreshRates} disabled={isFetchingRates}>
                {isFetchingRates ? <Spinner /> : <RefreshCw />}
                Refresh
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {(Object.keys(MATERIAL_RATES) as Array<RateKey>).map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <Label htmlFor={`rate-${key}`}>{MATERIAL_RATES[key].label}</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>₹</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`rate-${key}`}
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={rates[key] || ''}
                    onChange={(e) =>
                      setRates((r) => ({ ...r, [key]: parseFloat(e.target.value) || 0 }))
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
                      /{MATERIAL_RATES[key].unit}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          number="04"
          label="Results"
          description={
            rows.length === 0
              ? 'Enter dimensions to see required materials.'
              : `Estimated total: ₹${formatINR(totalCost)}`
          }
        >
          {rows.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Material</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Cost (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const cost = r.qty * rates[r.key]
                  return (
                    <TableRow key={r.key}>
                      <TableCell className="py-3.5 font-medium">
                        {MATERIAL_RATES[r.key].label}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatQty(r.qty)} {r.unit}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
                        ₹{rates[r.key]} / {r.unit}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-[var(--accent-teal)] font-semibold">
                        ₹{formatINR(cost)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="py-3.5 text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--accent-teal)]">
                    ₹{formatINR(totalCost)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}

function initialDims(element: ElementType): Dimensions {
  const meta = ELEMENT_META[element]
  return {
    length: 10,
    width: element === 'rcc_column' ? 0.3 : 3,
    thickness: meta.inputs.find((i) => i.key === 'thickness')?.defaultMm ?? 12,
  }
}

function formatINR(n: number) {
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

function formatQty(n: number) {
  if (!Number.isFinite(n)) return '0'
  if (n >= 100) return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}
