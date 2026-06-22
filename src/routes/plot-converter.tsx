import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Ruler } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { ToolFaq } from '#/components/tools/tool-faq'
import { PLOT_CONVERTER_FAQS } from '#/data/tool-seo-content'
import { canonicalLink, softwareAppLd, faqPageLd } from '#/lib/seo'
import {
  LAND_UNIT_LAST_UPDATED,
  LAND_UNITS,
  convertLandArea,
  type LandRegion,
  type UnitDef,
  type UnitKey,
} from '#/lib/plot-units'

export const Route = createFileRoute('/plot-converter')({
  component: PlotConverterPage,
  head: () => ({
    meta: [
      {
        title: 'Plot Area Converter — Sq Ft, Gaj, Bigha, Cent, Acre · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Free Indian land unit converter — square feet, square meters, gaj, bigha (UP/Bihar/MP/WB/Punjab), cent, ground, marla, kanal, gunta, acre, hectare. Region-wise local standards.',
      },
      { property: 'og:title', content: 'Plot Area Converter India · Plotr Ai' },
      {
        property: 'og:description',
        content:
          'Convert between Indian land units — gaj, bigha, cent, acre — with region-wise standards.',
      },
      {
        property: 'og:image',
        content: 'https://plotrai.in/og/plot-converter.png',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/plot-converter' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: 'https://plotrai.in/og/plot-converter.png',
      },
    ],
    links: [canonicalLink('/plot-converter')],
    scripts: [
      softwareAppLd({
        name: 'Plot Area Converter',
        description:
          'Free Indian land unit converter for square feet, gaj, bigha, cent, ground, marla, kanal, gunta, acre, hectare.',
        path: '/plot-converter',
      }),
      faqPageLd(PLOT_CONVERTER_FAQS),
    ],
  }),
})

const REGION_LABELS: Record<LandRegion | 'all', string> = {
  all: 'All',
  'pan-india': 'Pan-India',
  north: 'North',
  south: 'South',
  east: 'East',
  west: 'West',
}

const REGION_DOTS: Record<LandRegion, string> = {
  'pan-india': 'bg-[var(--accent-teal)]',
  north: 'bg-amber-500',
  south: 'bg-emerald-500',
  east: 'bg-sky-500',
  west: 'bg-rose-500',
}

function PlotConverterPage() {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState<UnitKey>('gunta')
  const [region, setRegion] = useState<LandRegion | 'all'>('all')

  const numValue = parseFloat(value)
  const sqft = useMemo(() => {
    if (Number.isNaN(numValue) || numValue < 0) return 0
    return convertLandArea(numValue, unit, 'sqft')
  }, [numValue, unit])

  const filtered = useMemo(() => {
    return (Object.entries(LAND_UNITS) as Array<[UnitKey, UnitDef]>)
      .filter(([k]) => k !== unit)
      .filter(([, def]) => region === 'all' || def.region === region)
      .map(([k, def]) => ({
        key: k,
        def,
        value: convertLandArea(numValue, unit, k),
      }))
  }, [sqft, unit, region])

  const groupedUnits = useMemo(() => {
    const order: ReadonlyArray<LandRegion> = [
      'pan-india',
      'north',
      'south',
      'east',
      'west',
    ]
    return order.map((r) => ({
      region: r,
      items: (Object.entries(LAND_UNITS) as Array<[UnitKey, UnitDef]>).filter(
        ([, def]) => def.region === r,
      ),
    }))
  }, [])

  function format(n: number) {
    if (!Number.isFinite(n)) return '—'
    if (n === 0) return '0'
    if (Math.abs(n) >= 1000)
      return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    if (Math.abs(n) >= 1) return Number(n.toFixed(3)).toString()
    return Number(n.toFixed(6)).toString()
  }

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Plot Area Converter' },
      ]}
      eyebrow={{ icon: Ruler, label: 'Utility · Live' }}
      title="Plot Area Converter"
      tagline="Convert between sq ft, sq m, gaj, acre, hectare, gunta, bigha, marla, kanal, ankanam and more — region-aware to local Indian standards."
      variant="single-column"
      footnote={`Land-unit standards last reviewed ${LAND_UNIT_LAST_UPDATED}. Bigha and katha sizes vary by region. We use common local planning standards; for legal documents, cross-check with your local sub-registrar office.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Enter value" rule={false}>
          <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="value">Amount</Label>
              <Input
                id="value"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-base"
                placeholder="1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as UnitKey)}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {groupedUnits.map(({ region: r, items }) => (
                    <SelectGroup key={r}>
                      <SelectLabel className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        {REGION_LABELS[r]}
                      </SelectLabel>
                      {items.map(([k, def]) => (
                        <SelectItem key={k} value={k}>
                          {def.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 sm:items-end">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                = sq ft
              </p>
              <p className="text-3xl font-semibold tabular-nums leading-none tracking-tight text-[var(--foreground)]">
                {format(sqft)}
              </p>
            </div>
          </div>
        </ToolSection>

        <ToolSection
          number="02"
          label="Conversions"
          description={`Showing ${filtered.length} ${region === 'all' ? 'units' : REGION_LABELS[region] + ' units'}.`}
          action={
            <Tabs
              value={region}
              onValueChange={(v) => setRegion(v as LandRegion | 'all')}
            >
              <TabsList
                variant="line"
                className="max-w-[calc(100vw-2rem)] overflow-x-auto justify-start sm:max-w-none"
              >
                {(
                  [
                    'all',
                    'pan-india',
                    'north',
                    'south',
                    'east',
                    'west',
                  ] as const
                ).map((r) => (
                  <TabsTrigger key={r} value={r}>
                    {REGION_LABELS[r]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          }
        >
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
              No units in this region.
            </p>
          ) : (
            <div className="w-full overflow-hidden">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[43%] whitespace-normal">
                      Unit
                    </TableHead>
                    <TableHead className="w-[27%] whitespace-normal">
                      Region
                    </TableHead>
                    <TableHead className="w-[30%] whitespace-normal text-right">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(({ key, def, value: v }) => (
                    <TableRow key={key}>
                      <TableCell className="whitespace-normal py-3.5">
                        <p className="font-medium text-[var(--foreground)]">
                          {def.label}
                        </p>
                        {def.note && (
                          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                            {def.note}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <span className="inline-flex max-w-full items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)] sm:tracking-[0.16em]">
                          <span
                            className={`size-1.5 rounded-full ${REGION_DOTS[def.region]}`}
                            aria-hidden
                          />
                          {REGION_LABELS[def.region]}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal text-right">
                        <span className="text-sm font-semibold tabular-nums tracking-tight text-[var(--accent-teal)] sm:text-base">
                          {format(v)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ToolSection>

        <ToolFaq items={PLOT_CONVERTER_FAQS} />
      </div>
    </ToolPageShell>
  )
}
