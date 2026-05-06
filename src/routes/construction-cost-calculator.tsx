import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Hammer } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
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
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  CITY_RATES,
  STAGES,
  TIER_LABELS,
  CONSTRUCTION_LAST_UPDATED,
  type FinishTier,
} from '#/data/construction-cost-rates'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { CONSTRUCTION_COST_FAQS, CONSTRUCTION_COST_CONTEXT } from '#/data/tool-seo-content'
import { softwareAppLd, faqPageLd } from '#/lib/seo'
import { CITY_CONTENT } from '#/data/city-construction-content'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/construction-cost-calculator')({
  component: ConstructionCostCalculatorPage,
  head: () => ({
    meta: [
      {
        title: 'Construction Cost Calculator India 2026 — Per Sq Ft, Stage-Wise · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Estimate house construction cost per sq ft in India by city, finish tier, and floors. Stage-wise breakdown across 7 build stages. Mumbai, Bangalore, Delhi, Pune, Chennai, Hyderabad. Updated 2026.',
      },
      { property: 'og:title', content: 'Construction Cost Calculator India 2026' },
      {
        property: 'og:description',
        content:
          'House construction cost per sq ft + stage-wise breakdown for any Indian city.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/construction-cost-calculator.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/construction-cost-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/construction-cost-calculator.png' },
    ],
    scripts: [
      softwareAppLd({
        name: 'Construction Cost Calculator India',
        description:
          'Estimate house construction cost per sq ft in India by city, finish tier, and floors with stage-wise breakdown.',
        path: '/construction-cost-calculator',
        category: 'FinanceApplication',
      }),
      faqPageLd(CONSTRUCTION_COST_FAQS),
    ],
  }),
})

const CITIES = Object.keys(CITY_RATES)
const TIERS: ReadonlyArray<FinishTier> = ['basic', 'standard', 'premium', 'luxury']

function ConstructionCostCalculatorPage() {
  const [city, setCity] = useState<string>('Bangalore')
  const [tier, setTier] = useState<FinishTier>('standard')
  const [areaInput, setAreaInput] = useState<string>('1500')
  const [floors, setFloors] = useState<string>('1')

  const area = parseFloat(areaInput) || 0
  const floorMultiplier = Math.max(parseInt(floors, 10) || 1, 1)
  const totalArea = area * floorMultiplier

  const baseRate = CITY_RATES[city]?.[tier] ?? 0
  const totalCost = totalArea * baseRate

  const stageRows = useMemo(
    () =>
      STAGES.map((s) => ({
        ...s,
        cost: (totalCost * s.percent) / 100,
      })),
    [totalCost],
  )

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Construction Cost Calculator' },
      ]}
      eyebrow={{ icon: Hammer, label: 'Calculator · Live' }}
      title="Construction Cost Calculator"
      tagline="Estimate house construction cost per sq ft in India, broken down across 7 build stages. Bangalore, Mumbai, Delhi, Pune, Chennai, Hyderabad and more."
      variant="single-column"
      footnote={`City × tier base rates last refreshed ${CONSTRUCTION_LAST_UPDATED}. Excludes land cost, government approvals, soil-bearing-capacity surprises, and contractor margin (typically 10–15%). Use as a planning baseline, not a fixed quote.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Project basics" rule={false}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>City</SelectLabel>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="area">Built-up area / floor</Label>
              <InputGroup>
                <InputGroupInput
                  id="area"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    sq ft
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="floors">Number of floors</Label>
              <Select value={floors} onValueChange={setFloors}>
                <SelectTrigger id="floors" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">G (Ground only)</SelectItem>
                    <SelectItem value="2">G+1</SelectItem>
                    <SelectItem value="3">G+2</SelectItem>
                    <SelectItem value="4">G+3</SelectItem>
                    <SelectItem value="5">G+4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Total built-up</Label>
              <div className="flex h-9 items-center rounded-md border border-[var(--border)] bg-[var(--muted)]/40 px-3 text-sm font-semibold tabular-nums text-[var(--foreground)]">
                {formatINR(totalArea)} sq ft
              </div>
            </div>
          </div>
        </ToolSection>

        <ToolSection number="02" label="Finish tier" description="Pick the closest match. Each tier swings the per-sq-ft rate by 25–35%.">
          <ToggleGroup
            type="single"
            value={tier}
            onValueChange={(v) => v && setTier(v as FinishTier)}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            {TIERS.map((t) => (
              <ToggleGroupItem key={t} value={t} className="capitalize">
                {TIER_LABELS[t].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">{TIER_LABELS[tier].helper}</p>
        </ToolSection>

        <ToolSection
          number="03"
          label="Total estimate"
          description={`At ₹${formatINR(baseRate)} / sq ft for ${TIER_LABELS[tier].label.toLowerCase()} finish in ${city}.`}
        >
          <div className="mb-6 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Total estimated construction cost
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[var(--accent-teal)]">
              ₹{formatINR(totalCost)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {formatINR(totalArea)} sq ft × ₹{formatINR(baseRate)}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[42%]">Stage</TableHead>
                <TableHead className="text-right">Share</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stageRows.map((s) => (
                <TableRow key={s.key}>
                  <TableCell className="py-3.5">
                    <p className="font-medium text-[var(--foreground)]">{s.label}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {s.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
                    {s.percent}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-[var(--accent-teal)]">
                    ₹{formatINR(s.cost)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="py-3.5 text-right font-semibold">
                  Total
                </TableCell>
                <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--accent-teal)]">
                  ₹{formatINR(totalCost)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ToolSection>

        <ToolContext title={CONSTRUCTION_COST_CONTEXT.title}>
          {CONSTRUCTION_COST_CONTEXT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ToolContext>

        <ToolSection number="CITIES" label="Construction cost by city" description="City-specific rate page with sample budgets and stage breakdown.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {CITY_CONTENT.map((c) => (
              <Link
                key={c.slug}
                to="/construction-cost/$city"
                params={{ city: c.slug }}
                className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/40"
              >
                {c.city}
                <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
              </Link>
            ))}
          </div>
        </ToolSection>

        <ToolFaq items={CONSTRUCTION_COST_FAQS} />
      </div>
    </ToolPageShell>
  )
}

function formatINR(n: number) {
  if (!Number.isFinite(n) || n === 0) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
