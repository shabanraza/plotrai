import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ExternalLink, Info, MapPinned } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'
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
  CIRCLE_RATES_CHECKED,
  DELHI_CIRCLE_RATES,
  DELHI_CIRCLE_RATE_NOTIFIED,
  DELHI_CIRCLE_RATE_SOURCES,
  SQ_M_PER_SQ_YD,
  type DelhiCategory,
} from '#/data/circle-rates'
import { getStateEntry } from '#/data/state-stamp-duty-content'
import type { FaqItem } from '#/lib/seo'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import { calculateCircleValue } from '#/lib/circle-rate'
import { calculateStampDuty, type StampDutyGender } from '#/lib/stamp-duty'

const PATH = '/delhi-circle-rate'

const rateOf = (c: DelhiCategory) =>
  DELHI_CIRCLE_RATES.find((r) => r.category === c)!

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'What is the circle rate in Delhi in 2026?',
    a: `Delhi still uses the circle rates notified on ${DELHI_CIRCLE_RATE_NOTIFIED}. Residential land ranges from ₹${rateOf('A').land.toLocaleString('en-IN')} per sq m in category A colonies to ₹${rateOf('H').land.toLocaleString('en-IN')} per sq m in category H. A revision was reviewed in 2025 but has not been notified.`,
  },
  {
    q: 'How is circle rate value calculated for a house in Delhi?',
    a: 'For an independent plot or house, the minimum value is the plot area multiplied by the category land rate, plus the built-up area multiplied by the category construction rate. Stamp duty is charged on this value or the agreed price, whichever is higher.',
  },
  {
    q: 'How do I find my colony category in Delhi?',
    a: 'Delhi colonies are grouped into categories A (most expensive) to H (least expensive). The full colony list is published by the Delhi Revenue Department. Category A includes colonies such as Golf Links and Vasant Vihar; category B includes Defence Colony, Greater Kailash and Hauz Khas.',
  },
  {
    q: 'Can I register a property below the circle rate in Delhi?',
    a: 'No. The sub-registrar will not register a sale below the circle value. If the agreed price is lower, stamp duty is still charged on the circle value.',
  },
  {
    q: 'Does this apply to flats?',
    a: 'Flats in Delhi are valued with separate per-sq-m rates that depend on the flat size and builder or DDA category, not this land + construction method. Use this calculator for independent plots, houses and builder floors with a land share, and check flat rates with the sub-registrar.',
  },
]

export const Route = createFileRoute('/delhi-circle-rate')({
  component: DelhiCircleRatePage,
  head: () => ({
    meta: [
      { title: 'Delhi Circle Rate 2026 — Category A to H Rates & Calculator · Plotr Ai' },
      {
        name: 'description',
        content: `Delhi circle rates 2026 for categories A to H: land from ₹23,280 to ₹7,74,000 per sq m, plus construction rates. Calculate the minimum property value and stamp duty in Delhi.`,
      },
      { property: 'og:title', content: 'Delhi circle rate 2026' },
      {
        property: 'og:description',
        content: 'Category-wise Delhi circle rates and a calculator for minimum property value and stamp duty.',
      },
      { property: 'og:url', content: `https://plotrai.in${PATH}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink(PATH)],
    scripts: [
      softwareAppLd({
        name: 'Delhi Circle Rate Calculator',
        description: 'Delhi circle rates for categories A to H with a minimum property value and stamp duty calculator.',
        path: PATH,
        category: 'FinanceApplication',
      }),
      faqPageLd(FAQS),
    ],
  }),
})

type Unit = 'sqm' | 'sqyd'

function DelhiCircleRatePage() {
  const [category, setCategory] = useState<DelhiCategory>('D')
  const [unit, setUnit] = useState<Unit>('sqyd')
  const [landArea, setLandArea] = useState('200')
  const [builtUp, setBuiltUp] = useState('300')
  const [agreementLakh, setAgreementLakh] = useState('250')
  const [gender, setGender] = useState<StampDutyGender>('male')

  const toSqm = (v: string) => parseNumber(v) * (unit === 'sqyd' ? SQ_M_PER_SQ_YD : 1)
  const delhiRate = getStateEntry('Delhi (NCT)')!.default

  const result = calculateCircleValue({
    rate: rateOf(category),
    landSqm: toSqm(landArea),
    builtUpSqm: toSqm(builtUp),
    agreementValue: parseNumber(agreementLakh) * 100000,
  })

  const duty = calculateStampDuty({
    propertyValue: result.taxableValue,
    rate: delhiRate,
    gender,
    loanLtvPercent: 0,
  })

  const unitLabel = unit === 'sqyd' ? 'sq yd' : 'sq m'

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: 'Delhi circle rate' }]}
      eyebrow={{ icon: MapPinned, label: 'Circle rate · Delhi' }}
      title="Delhi circle rate 2026"
      tagline="Minimum land and construction rates for Delhi colony categories A to H, with a calculator for the minimum property value and the stamp duty you'll pay on it."
      variant="single-column"
      footnote={`Rates notified ${DELHI_CIRCLE_RATE_NOTIFIED} (4th revision), still in force when checked on ${CIRCLE_RATES_CHECKED}. Covers residential plots, houses and builder floors with a land share; flats, commercial and industrial property use different rates. Confirm your colony's category and the final value with the sub-registrar.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Circle rates by category" rule={false}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Land ₹/sq m</TableHead>
                <TableHead className="text-right">Building ₹/sq m</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DELHI_CIRCLE_RATES.map((r) => (
                <TableRow key={r.category}>
                  <TableCell className="font-medium">{r.category}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {r.land.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
                    {r.construction.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            In gaj (sq yd), land ranges from ₹
            {Math.round(rateOf('H').land * SQ_M_PER_SQ_YD).toLocaleString('en-IN')} in category H to ₹
            {Math.round(rateOf('A').land * SQ_M_PER_SQ_YD).toLocaleString('en-IN')} in category A.
          </p>
        </ToolSection>

        <ToolSection
          number="02"
          label="Calculate minimum value"
          description="For an independent plot, house or builder floor with its land share."
        >
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="category">Colony category</FieldLabel>
              <Select value={category} onValueChange={(v) => setCategory(v as DelhiCategory)}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Delhi categories</SelectLabel>
                    {DELHI_CIRCLE_RATES.map((r) => (
                      <SelectItem key={r.category} value={r.category}>
                        Category {r.category} · ₹{r.land.toLocaleString('en-IN')}/sq m
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Area unit</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={unit}
                onValueChange={(v) => v && setUnit(v as Unit)}
              >
                <ToggleGroupItem value="sqyd">Sq yd (gaj)</ToggleGroupItem>
                <ToggleGroupItem value="sqm">Sq m</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <AreaField id="land" label="Plot area (land share)" unit={unitLabel} value={landArea} onChange={setLandArea} />
            <AreaField
              id="built"
              label="Built-up area"
              unit={unitLabel}
              value={builtUp}
              onChange={setBuiltUp}
              description="Set 0 for a vacant plot."
            />
            <Field>
              <FieldLabel htmlFor="agreement">Agreed sale price</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="agreement"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={agreementLakh}
                  onChange={(e) => setAgreementLakh(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="text-sm">
                    lakh
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Buyer</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={gender}
                onValueChange={(v) => v && setGender(v as StampDutyGender)}
              >
                <ToggleGroupItem value="male">Male</ToggleGroupItem>
                <ToggleGroupItem value="female">Female</ToggleGroupItem>
                <ToggleGroupItem value="joint">Joint</ToggleGroupItem>
              </ToggleGroup>
            </Field>
          </FieldGroup>
        </ToolSection>

        <ToolSection number="03" label="Result" description={`Category ${category} · ${gender} buyer`}>
          <div className="mb-6 grid gap-3 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-5 sm:grid-cols-3">
            <Stat label="Circle value" value={result.circleValue} />
            <Stat label="Stamp duty charged on" value={result.taxableValue} />
            <Stat label="Stamp duty + registration" value={duty.totalGovernmentCharges} highlight />
          </div>

          {result.circleValueIsHigher && (
            <Alert className="mb-6">
              <Info />
              <AlertDescription>
                The circle value is higher than your agreed price, so stamp duty is charged on the
                circle value of ₹{formatINR(result.circleValue)}.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableBody>
              <ValueRow label="Land value" value={result.landValue} />
              <ValueRow label="Construction value" value={result.constructionValue} />
              <ValueRow label={`Stamp duty (${duty.stampDutyPercent}%)`} value={duty.stampDutyAmount} />
              <ValueRow label={`Registration (${delhiRate.registration}%)`} value={duty.registrationAmount} />
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="py-3.5 font-semibold">Total government charges</TableCell>
                <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--accent-teal)]">
                  ₹{formatINR(duty.totalGovernmentCharges)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ToolSection>

        <ToolSection number="04" label="Find your colony category">
          <div className="flex flex-col gap-4">
            {DELHI_CIRCLE_RATES.filter((r) => r.examples).map((r) => (
              <div key={r.category} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[var(--foreground)]">Category {r.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.examples!.map((colony) => (
                    <Badge key={colony} variant="secondary">
                      {colony}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-sm text-[var(--muted-foreground)]">
              The full colony-wise list is published by the{' '}
              <a
                href="https://revenue.delhi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--accent-teal)] hover:underline"
              >
                Delhi Revenue Department
                <ExternalLink className="size-3" />
              </a>
            </p>
          </div>
        </ToolSection>

        <ToolContext title="How circle rates work in Delhi">
          <p>
            A circle rate is the minimum value the government accepts for a property. Delhi groups
            colonies into eight categories, A to H, based on infrastructure and market value. Each
            category has a land rate and a construction rate per square metre.
          </p>
          <p>
            Stamp duty and registration are charged on the higher of the agreed price and the circle
            value. In Delhi stamp duty is {delhiRate.male}% for men, {delhiRate.female}% for women and{' '}
            {delhiRate.joint}% for joint owners, plus {delhiRate.registration}% registration.
          </p>
          <p>
            Rates on this page were cross-checked against:{' '}
            {DELHI_CIRCLE_RATE_SOURCES.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ', '}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent-teal)] hover:underline"
                >
                  {s.label}
                  <ExternalLink className="size-3" />
                </a>
              </span>
            ))}
          </p>
        </ToolContext>

        <ToolSection number="MORE" label="Related">
          <div className="grid gap-2 sm:grid-cols-2">
            <RelatedLink to="/stamp-duty/delhi" label="Delhi stamp duty rates" />
            <RelatedLink to="/blog/circle-rate-vs-market-rate" label="Circle rate vs market rate" />
            <RelatedLink to="/home-buying-cost-calculator" label="Home buying cost calculator" />
            <RelatedLink to="/convert/gaj-to-sq-ft" label="Gaj to sq ft converter" />
          </div>
        </ToolSection>

        <ToolFaq items={FAQS} />
      </div>
    </ToolPageShell>
  )
}

function AreaField({
  id,
  label,
  unit,
  value,
  onChange,
  description,
}: {
  id: string
  label: string
  unit: string
  value: string
  onChange: (value: string) => void
  description?: string
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
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{unit}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <p
        className={`text-sm ${highlight ? 'text-[var(--accent-teal)]' : 'text-[var(--muted-foreground)]'}`}
      >
        {label}
      </p>
      <p
        className={`mt-1 tabular-nums ${highlight ? 'text-2xl font-bold text-[var(--accent-teal)]' : 'text-lg font-semibold text-[var(--foreground)]'}`}
      >
        ₹{formatINR(value)}
      </p>
    </div>
  )
}

function ValueRow({ label, value }: { label: string; value: number }) {
  return (
    <TableRow>
      <TableCell className="py-3.5 font-medium">{label}</TableCell>
      <TableCell className="text-right tabular-nums">₹{formatINR(value)}</TableCell>
    </TableRow>
  )
}

function RelatedLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/40"
    >
      {label}
      <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
    </Link>
  )
}

function parseNumber(value: string) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatINR(n: number) {
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
