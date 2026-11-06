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
  CONSTRUCTION_ESTIMATE_NOTE,
  STAGES,
  TIER_LABELS,
  CONSTRUCTION_LAST_UPDATED,
  CONSTRUCTION_SOURCE_URLS,
  type FinishTier,
} from '#/data/construction-cost-rates'
import { ToolFaq } from '#/components/tools/tool-faq'
import { NextStepCard } from '#/components/tools/next-step-card'
import { QuoteWaitlist } from '#/components/tools/quote-waitlist'
import { ResultBar } from '#/components/tools/result-bar'
import { ToolSources, type ToolSource } from '#/components/tools/tool-sources'
import { INFRALENS_NEW_CITIES, INFRALENS_UPDATED, infralensUrl } from '#/data/infralens-rates'
import { ToolContext } from '#/components/tools/tool-context'
import { RelatedGuidesSection } from '#/components/blog/related-guides-section'
import {
  CONSTRUCTION_COST_FAQS,
  CONSTRUCTION_COST_CONTEXT,
} from '#/data/tool-seo-content'
import { getArticleLinkItem } from '#/data/blog-content'
import { canonicalLink, softwareAppLd, faqPageLd } from '#/lib/seo'
import { CITY_CONTENT } from '#/data/city-construction-content'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { calculateConstructionCost } from '#/lib/construction-cost'

export const Route = createFileRoute('/construction-cost-calculator')({
  component: ConstructionCostCalculatorPage,
  head: () => ({
    meta: [
      {
        title:
          'Construction Cost Calculator India 2026 — Per Sq Ft, Stage-Wise · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Estimate house construction cost per sq ft in India by city, finish tier, and floors. Stage-wise breakdown across 7 build stages. Mumbai, Bangalore, Delhi, Pune, Chennai, Hyderabad. Updated 2026.',
      },
      {
        property: 'og:title',
        content: 'Construction Cost Calculator India 2026',
      },
      {
        property: 'og:description',
        content:
          'House construction cost per sq ft + stage-wise breakdown for any Indian city.',
      },
      {
        property: 'og:image',
        content: 'https://plotrai.in/og/construction-cost-calculator.png',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:url',
        content: 'https://plotrai.in/construction-cost-calculator',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: 'https://plotrai.in/og/construction-cost-calculator.png',
      },
    ],
    links: [canonicalLink('/construction-cost-calculator')],
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
const TIERS: ReadonlyArray<FinishTier> = [
  'basic',
  'standard',
  'premium',
  'luxury',
]

function ConstructionCostCalculatorPage() {
  const [city, setCity] = useState<string>('Bangalore')
  const [tier, setTier] = useState<FinishTier>('standard')
  const [areaInput, setAreaInput] = useState<string>('1500')
  const [floors, setFloors] = useState<string>('1')

  const result = useMemo(
    () =>
      calculateConstructionCost({
        city,
        tier,
        areaPerFloorSqft: parseFloat(areaInput) || 0,
        floors: parseInt(floors, 10) || 1,
        cityRates: CITY_RATES,
        stages: STAGES,
      }),
    [areaInput, city, floors, tier],
  )

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Construction cost calculator' },
      ]}
      eyebrow={{ icon: Hammer, label: 'Calculator · Live' }}
      title="Construction cost calculator"
      tagline="Estimate house construction cost per sq ft in India, broken down across 7 build stages. Bangalore, Mumbai, Delhi, Pune, Chennai, Hyderabad and more."
      variant="single-column"
    >
      <ResultBar
        label={`Construction cost in ${city}`}
        value={`₹${formatINR(result.totalCost)}`}
        targetId="result"
      />
      <div className="flex flex-col gap-14">
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
                  <InputGroupText className="text-sm">
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
              <div className="flex h-9 items-center rounded-xl bg-[var(--muted)] px-3 text-sm font-semibold tabular-nums text-[var(--foreground)]">
                {formatINR(result.totalAreaSqft)} sq ft
              </div>
            </div>
          </div>
        </ToolSection>

        <ToolSection
          number="02"
          label="Finish tier"
          description="Pick the closest match. Each tier swings the per-sq-ft rate by 25–35%."
        >
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
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            {TIER_LABELS[tier].helper}
          </p>
        </ToolSection>

        <ToolSection
          id="result"
          number="03"
          label="Total estimate"
          description={`At ₹${formatINR(result.baseRatePerSqft)} / sq ft for ${TIER_LABELS[tier].label.toLowerCase()} finish in ${city}.`}
        >
          <div className="mb-6 rounded-xl bg-[var(--muted)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">
              Total estimated construction cost
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[var(--brand)]">
              ₹{formatINR(result.totalCost)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {formatINR(result.totalAreaSqft)} sq ft × ₹
              {formatINR(result.baseRatePerSqft)}
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
              {result.stageRows.map((s) => (
                <TableRow key={s.key}>
                  <TableCell className="py-3.5">
                    <p className="font-medium text-[var(--foreground)]">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {s.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
                    {s.percent}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    ₹{formatINR(s.cost)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-3.5 text-right font-semibold"
                >
                  Total
                </TableCell>
                <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--foreground)]">
                  ₹{formatINR(result.totalCost)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="mt-4">
            <QuoteWaitlist tool="/construction-cost-calculator" />
          </div>
        </ToolSection>

        <NextStepCard from="/construction-cost-calculator" />

        <ToolContext title={CONSTRUCTION_COST_CONTEXT.title}>
          {CONSTRUCTION_COST_CONTEXT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ToolContext>

        <RelatedGuidesSection
          items={([
            'steel-price-house-construction',
            'false-ceiling-cost-per-sq-ft',
            'modular-kitchen-cost-india',
          ] as const).map(getArticleLinkItem)}
          description="These explainers help break the total estimate into material and finishing decisions."
        />

        <ToolSection
          number="CITIES"
          label="Construction cost by city"
          description="City-specific rate page with sample budgets and stage breakdown."
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {CITY_CONTENT.map((c) => (
              <Link
                key={c.slug}
                to="/construction-cost/$city"
                params={{ city: c.slug }}
                className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--brand-light)]"
              >
                {c.city}
                <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
              </Link>
            ))}
          </div>
        </ToolSection>

        <ToolFaq items={CONSTRUCTION_COST_FAQS} />

        <ToolSources
          sources={constructionSources(city)}
          checked={CONSTRUCTION_LAST_UPDATED}
          note={`${CONSTRUCTION_ESTIMATE_NOTE} Excludes land cost, government approvals, soil-bearing-capacity surprises, and contractor margin.`}
        />
      </div>
    </ToolPageShell>
  )
}

/** Base table benchmarks, plus the InfraLens page for cities added by calibrating against it. */
function constructionSources(city: string): ToolSource[] {
  const sources: ToolSource[] = CONSTRUCTION_SOURCE_URLS.map((label) => ({ label }))
  const derived = INFRALENS_NEW_CITIES.find((c) => c.city === city)
  if (derived) {
    sources.push({
      label: `InfraLens construction rates for ${city} (updated ${INFRALENS_UPDATED}), scaled to our table`,
      url: infralensUrl(derived.slug),
    })
  }
  return sources
}

function formatINR(n: number) {
  if (!Number.isFinite(n) || n === 0) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
