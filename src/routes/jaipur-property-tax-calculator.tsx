import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Building2, ExternalLink, Info } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { Alert, AlertDescription } from '#/components/ui/alert'
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
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '#/components/ui/table'
import type { FaqItem } from '#/lib/seo'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import {
  FLAT_EXEMPT_BELOW_SQFT,
  PLOT_EXEMPT_BELOW_SQYD,
  calculateJaipurUdTax,
  type JaipurPropertyType,
} from '#/lib/jaipur-ud-tax'

const PATH = '/jaipur-property-tax-calculator'
const CHECKED = '2026-11-02'

const SOURCES = [
  { label: 'HomeFirst — JMC Jaipur property tax guide (Aug 2026)', url: 'https://homefirstindia.com/blog/article/jmc-jaipur-property-tax' },
  { label: 'ghar.tv — Jaipur UD tax guide (Nov 2025)', url: 'https://www.ghar.tv/blog/complete-guide-to-jaipur-property-tax-jmc-ud-tax-payment-calculation-rebates/artid4830' },
] as const

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'How is property tax calculated in Jaipur?',
    a: 'Jaipur residential property tax is the urban development (UD) tax: assessable area in sq yd × residential DLC rate per sq yd ÷ 2000. For a plot or independent house the assessable area is the plot area; for a flat it is the built-up area.',
  },
  {
    q: 'Who is exempt from UD tax in Jaipur?',
    a: `Residential plots below ${PLOT_EXEMPT_BELOW_SQYD} sq yd are exempt, and flats below ${FLAT_EXEMPT_BELOW_SQFT.toLocaleString('en-IN')} sq ft of built-up area are exempt.`,
  },
  {
    q: 'What is the UD tax on a 400 sq yd plot in Jaipur?',
    a: 'At a DLC rate of ₹35,000 per sq yd, UD tax on a 400 sq yd plot is 400 × 35,000 ÷ 2000 = ₹7,000 a year, before rebates. Use your locality’s actual DLC rate for an accurate figure.',
  },
  {
    q: 'Where do I find the DLC rate for my area?',
    a: 'DLC (District Level Committee) rates are published on the Rajasthan e-Panjiyan registration portal. Use the residential rate for your locality and colony.',
  },
  {
    q: 'Are there rebates on Jaipur UD tax?',
    a: 'Yes. Paying early in the financial year earns a 10% rebate (April–June) or 5% (July–September), and women owners get an extra 10%. Check the current year’s dates with Jaipur Municipal Corporation.',
  },
]

export const Route = createFileRoute('/jaipur-property-tax-calculator')({
  component: JaipurPropertyTaxPage,
  head: () => ({
    meta: [
      { title: 'Jaipur Property Tax Calculator (UD Tax) 2026 · Plotr Ai' },
      {
        name: 'description',
        content:
          'Calculate Jaipur UD tax (property tax) for plots, houses and flats: area × DLC rate ÷ 2000, exemptions below 300 sq yd, early-payment and women-owner rebates.',
      },
      { property: 'og:title', content: 'Jaipur Property Tax Calculator (UD Tax)' },
      {
        property: 'og:description',
        content: 'UD tax for Jaipur plots, houses and flats with exemptions and rebates.',
      },
      { property: 'og:url', content: `https://plotrai.in${PATH}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink(PATH)],
    scripts: [
      softwareAppLd({
        name: 'Jaipur property tax calculator',
        description: 'Jaipur UD tax calculator for plots, houses and flats with exemptions and rebates.',
        path: PATH,
        category: 'FinanceApplication',
      }),
      faqPageLd(FAQS),
    ],
  }),
})

function JaipurPropertyTaxPage() {
  const [type, setType] = useState<JaipurPropertyType>('plot')
  const [plotArea, setPlotArea] = useState('400')
  const [flatArea, setFlatArea] = useState('1800')
  const [dlcRate, setDlcRate] = useState('35000')
  const [early, setEarly] = useState<'0' | '5' | '10'>('0')
  const [womanOwner, setWomanOwner] = useState(false)

  const result = calculateJaipurUdTax({
    type,
    area: parseNumber(type === 'plot' ? plotArea : flatArea),
    dlcRatePerSqyd: parseNumber(dlcRate),
    earlyPaymentRebatePercent: Number(early) as 0 | 5 | 10,
    womanOwner,
  })

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: 'Jaipur property tax calculator' }]}
      eyebrow={{ icon: Building2, label: 'JMC · UD tax' }}
      title="Jaipur property tax calculator"
      tagline="Estimate Jaipur's urban development (UD) tax for a plot, house or flat from its area and DLC rate, with the exemption limits and rebates applied."
      variant="single-column"
      footnote={`Formula and exemptions checked ${CHECKED} against published guides; no official rate schedule was available online. Confirm your assessment and dues on the Jaipur Municipal Corporation portal before paying.`}
    >
      <div className="flex flex-col gap-14">
        <ToolSection number="01" label="Property" rule={false}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel>Property type</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={type}
                onValueChange={(v) => v && setType(v as JaipurPropertyType)}
              >
                <ToggleGroupItem value="plot">Plot / house</ToggleGroupItem>
                <ToggleGroupItem value="flat">Flat</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            {type === 'plot' ? (
              <NumberField
                id="plot"
                label="Plot area"
                unit="sq yd"
                value={plotArea}
                onChange={setPlotArea}
                description={`Exempt below ${PLOT_EXEMPT_BELOW_SQYD} sq yd.`}
              />
            ) : (
              <NumberField
                id="flat"
                label="Built-up area"
                unit="sq ft"
                value={flatArea}
                onChange={setFlatArea}
                description={`Exempt below ${FLAT_EXEMPT_BELOW_SQFT.toLocaleString('en-IN')} sq ft.`}
              />
            )}
            <Field>
              <FieldLabel htmlFor="dlc">Residential DLC rate</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="dlc"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={dlcRate}
                  onChange={(e) => setDlcRate(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>/ sq yd</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                ₹35,000 is an example. Find your colony’s rate on{' '}
                <a
                  href="https://epanjiyan.rajasthan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand)] hover:underline"
                >
                  e-Panjiyan
                </a>
                .
              </FieldDescription>
            </Field>
          </FieldGroup>
        </ToolSection>

        <ToolSection number="02" label="Rebates">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Early payment</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={early}
                onValueChange={(v) => v && setEarly(v as '0' | '5' | '10')}
              >
                <ToggleGroupItem value="10">Apr–Jun 10%</ToggleGroupItem>
                <ToggleGroupItem value="5">Jul–Sep 5%</ToggleGroupItem>
                <ToggleGroupItem value="0">None</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field orientation="horizontal" className="items-center justify-between rounded-xl bg-[var(--muted)] px-4 py-3">
              <Label htmlFor="woman">Woman owner (extra 10%)</Label>
              <Switch id="woman" checked={womanOwner} onCheckedChange={setWomanOwner} />
            </Field>
          </FieldGroup>
        </ToolSection>

        <ToolSection number="03" label="Annual UD tax">
          {result.exempt ? (
            <Alert>
              <Info />
              <AlertDescription>
                This property is below the exemption limit, so no UD tax is payable.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-6 rounded-xl bg-[var(--muted)] p-5">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Payable this year
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-[var(--brand)]">
                  ₹{formatINR(result.payable)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {formatINR(result.assessableSqyd)} sq yd × ₹{formatINR(parseNumber(dlcRate))} ÷ 2000
                </p>
              </div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-3.5 font-medium">UD tax before rebate</TableCell>
                    <TableCell className="text-right tabular-nums">₹{formatINR(result.grossTax)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-3.5 font-medium">Rebate ({result.rebatePercent}%)</TableCell>
                    <TableCell className="text-right tabular-nums">−₹{formatINR(result.rebateAmount)}</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="py-3.5 font-semibold">Payable</TableCell>
                    <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--foreground)]">
                      ₹{formatINR(result.payable)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}
        </ToolSection>

        <ToolContext title="How UD tax works in Jaipur">
          <p>
            Jaipur Municipal Corporation collects property tax on residential property as urban
            development (UD) tax. It is based on the area and the District Level Committee (DLC)
            rate for the locality, not on the market price or rent.
          </p>
          <p>
            Pay online on the{' '}
            <a
              href="https://jaipurmc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--brand)] hover:underline"
            >
              Jaipur Municipal Corporation portal
              <ExternalLink className="size-3" />
            </a>
            . The formula and exemptions on this page were checked against:{' '}
            {SOURCES.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ', '}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand)] hover:underline"
                >
                  {s.label}
                </a>
              </span>
            ))}
          </p>
        </ToolContext>

        <ToolSection number="MORE" label="Related">
          <div className="grid gap-2 sm:grid-cols-2">
            <RelatedLink to="/stamp-duty/rajasthan" label="Rajasthan stamp duty rates" />
            <RelatedLink to="/construction-cost/jaipur" label="Jaipur construction cost" />
            <RelatedLink to="/convert/gaj-to-sq-ft" label="Gaj to sq ft converter" />
            <RelatedLink to="/home-buying-cost-calculator" label="Home buying cost calculator" />
          </div>
        </ToolSection>

        <ToolFaq items={FAQS} />
      </div>
    </ToolPageShell>
  )
}

function NumberField({
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

function RelatedLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--brand-light)]"
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
