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
import { softwareAppLd, faqPageLd } from '#/lib/seo'

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
      { property: 'og:image', content: 'https://plotrai.in/og/plot-converter.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/plot-converter' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/plot-converter.png' },
    ],
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

type Region = 'pan-india' | 'north' | 'south' | 'east' | 'west'

interface UnitDef {
  label: string
  toSqft: number
  region: Region
  note?: string
}

const UNITS: Record<string, UnitDef> = {
  sqft: { label: 'Square Feet', toSqft: 1, region: 'pan-india' },
  sqm: { label: 'Square Meters', toSqft: 10.7639, region: 'pan-india' },
  sqyd: { label: 'Square Yards (Gaj)', toSqft: 9, region: 'pan-india' },
  acre: { label: 'Acre', toSqft: 43560, region: 'pan-india' },
  hectare: { label: 'Hectare', toSqft: 107639, region: 'pan-india' },
  bigha_uttar: { label: 'Bigha (UP / Bihar)', toSqft: 27000, region: 'north' },
  marla: { label: 'Marla', toSqft: 272.25, region: 'north', note: 'Punjab / Haryana' },
  kanal: { label: 'Kanal', toSqft: 5445, region: 'north', note: 'Punjab / Haryana / J&K' },
  gunta: { label: 'Gunta', toSqft: 1089, region: 'south', note: 'Karnataka / Maharashtra / AP' },
  cent: { label: 'Cent', toSqft: 435.6, region: 'south', note: 'Tamil Nadu / Kerala' },
  ground: { label: 'Ground', toSqft: 2400, region: 'south', note: 'Tamil Nadu' },
  ankanam: { label: 'Ankanam', toSqft: 72, region: 'south', note: 'Andhra / Telangana' },
  bigha_west_bengal: { label: 'Bigha (West Bengal)', toSqft: 14400, region: 'east' },
  katha_bihar: { label: 'Katha (Bihar)', toSqft: 1361.25, region: 'east' },
  bigha_rajasthan: { label: 'Bigha Pucca (Rajasthan)', toSqft: 27225, region: 'west' },
}

type UnitKey = keyof typeof UNITS

const REGION_LABELS: Record<Region | 'all', string> = {
  all: 'All',
  'pan-india': 'Pan-India',
  north: 'North',
  south: 'South',
  east: 'East',
  west: 'West',
}

const REGION_DOTS: Record<Region, string> = {
  'pan-india': 'bg-[var(--accent-teal)]',
  north: 'bg-amber-500',
  south: 'bg-emerald-500',
  east: 'bg-sky-500',
  west: 'bg-rose-500',
}

function PlotConverterPage() {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState<UnitKey>('gunta')
  const [region, setRegion] = useState<Region | 'all'>('all')

  const numValue = parseFloat(value)
  const sqft = useMemo(() => {
    if (Number.isNaN(numValue) || numValue < 0) return 0
    return numValue * UNITS[unit].toSqft
  }, [numValue, unit])

  const filtered = useMemo(() => {
    return (Object.entries(UNITS) as Array<[UnitKey, UnitDef]>)
      .filter(([k]) => k !== unit)
      .filter(([, def]) => region === 'all' || def.region === region)
      .map(([k, def]) => ({ key: k, def, value: sqft / def.toSqft }))
  }, [sqft, unit, region])

  const groupedUnits = useMemo(() => {
    const order: ReadonlyArray<Region> = ['pan-india', 'north', 'south', 'east', 'west']
    return order.map((r) => ({
      region: r,
      items: (Object.entries(UNITS) as Array<[UnitKey, UnitDef]>).filter(
        ([, def]) => def.region === r,
      ),
    }))
  }, [])

  function format(n: number) {
    if (!Number.isFinite(n)) return '—'
    if (n === 0) return '0'
    if (Math.abs(n) >= 1000) return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    if (Math.abs(n) >= 1) return Number(n.toFixed(3)).toString()
    return Number(n.toFixed(6)).toString()
  }

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: 'Plot Area Converter' }]}
      eyebrow={{ icon: Ruler, label: 'Utility · Live' }}
      title="Plot Area Converter"
      tagline="Convert between sq ft, sq m, gaj, acre, hectare, gunta, bigha, marla, kanal, ankanam and more — region-aware to local Indian standards."
      variant="single-column"
      footnote="Bigha and katha sizes vary by region. We use the most-cited local standard for each. For legal documents, cross-check with your local sub-registrar office."
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
            <Tabs value={region} onValueChange={(v) => setRegion(v as Region | 'all')}>
              <TabsList variant="line">
                {(['all', 'pan-india', 'north', 'south', 'east', 'west'] as const).map((r) => (
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">Unit</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ key, def, value: v }) => (
                  <TableRow key={key}>
                    <TableCell className="py-3.5">
                      <p className="font-medium text-[var(--foreground)]">{def.label}</p>
                      {def.note && (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {def.note}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                        <span
                          className={`size-1.5 rounded-full ${REGION_DOTS[def.region]}`}
                          aria-hidden
                        />
                        {REGION_LABELS[def.region]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-base font-semibold tabular-nums tracking-tight text-[var(--accent-teal)]">
                        {format(v)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ToolSection>

        <ToolFaq items={PLOT_CONVERTER_FAQS} />
      </div>
    </ToolPageShell>
  )
}
