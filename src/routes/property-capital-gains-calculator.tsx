import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Info, TrendingUp } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import { Label } from '#/components/ui/label'
import { FieldGroup, FieldLegend, FieldSet } from '#/components/ui/field'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { CII, CII_LAST_UPDATED, CII_SOURCE_URLS, FY_LIST } from '#/data/cii'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { NextStepCard } from '#/components/tools/next-step-card'
import { ResultBar } from '#/components/tools/result-bar'
import { ToolSources } from '#/components/tools/tool-sources'
import { RelatedGuidesSection } from '#/components/blog/related-guides-section'
import {
  CAPITAL_GAINS_FAQS,
  CAPITAL_GAINS_CONTEXT,
} from '#/data/tool-seo-content'
import { getArticleLinkItem } from '#/data/blog-content'
import { canonicalLink, softwareAppLd, faqPageLd } from '#/lib/seo'
import {
  calculatePropertyCapitalGains,
  S82_CAP,
  S85_CAP,
} from '#/lib/indexation'

export const Route = createFileRoute('/property-capital-gains-calculator')({
  component: CapitalGainsCalculatorPage,
  head: () => ({
    meta: [
      {
        title:
          'Property Capital Gains Calculator FY 2026-27 (CII 384) · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Property capital gains tax calculator for FY 2026-27: 12.5% vs 20% with indexation, NRI rules, cess and Section 82/85 (old 54/54EC) exemptions.',
      },
      {
        property: 'og:title',
        content: 'Property Capital Gains Calculator FY 2026-27 (CII 384)',
      },
      {
        property: 'og:description',
        content:
          'Property capital gains tax calculator for FY 2026-27: 12.5% vs 20% with indexation, NRI rules, cess and Section 82/85 (old 54/54EC) exemptions.',
      },
      {
        property: 'og:image',
        content: 'https://plotrai.in/og/property-capital-gains-calculator.png',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:url',
        content: 'https://plotrai.in/property-capital-gains-calculator',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: 'https://plotrai.in/og/property-capital-gains-calculator.png',
      },
    ],
    links: [canonicalLink('/property-capital-gains-calculator')],
    scripts: [
      softwareAppLd({
        name: 'Property Capital Gains Calculator India',
        description:
          'Property capital gains tax calculator for FY 2026-27 comparing 12.5% without indexation and 20% with indexation, with NRI rules, cess and Section 82/85 exemptions.',
        path: '/property-capital-gains-calculator',
        category: 'FinanceApplication',
      }),
      faqPageLd(CAPITAL_GAINS_FAQS),
    ],
  }),
})

const SLAB_RATES = ['0', '5', '10', '15', '20', '25', '30'] as const

const EXAMPLE = {
  purchaseDate: '2015-06-15',
  saleDate: '2026-11-21',
  purchasePrice: 5_000_000,
  salePrice: 12_000_000,
  residency: 'resident' as const,
  slabRatePercent: 30,
}

function todayIso() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function CapitalGainsCalculatorPage() {
  const [residency, setResidency] = useState<'resident' | 'nri'>('resident')
  const [purchaseDate, setPurchaseDate] = useState('2015-06-15')
  const [purchaseLakh, setPurchaseLakh] = useState('50')
  const [improvementLakh, setImprovementLakh] = useState('')
  const [improvementDate, setImprovementDate] = useState('')
  const [saleDate, setSaleDate] = useState(todayIso)
  const [saleLakh, setSaleLakh] = useState('120')
  const [expensesLakh, setExpensesLakh] = useState('')
  const [slabRate, setSlabRate] = useState('30')
  const [reinvestSection, setReinvestSection] = useState<'82' | '85'>('82')
  const [reinvestLakh, setReinvestLakh] = useState('')

  const purchasePrice = lakh(purchaseLakh)
  const salePrice = lakh(saleLakh)
  const improvementCost = lakh(improvementLakh)
  const transferExpenses = lakh(expensesLakh)
  const reinvestAmount = lakh(reinvestLakh)

  const result = useMemo(
    () =>
      calculatePropertyCapitalGains({
        purchaseDate,
        saleDate,
        purchasePrice,
        salePrice,
        improvementCost,
        improvementDate: improvementDate || purchaseDate,
        transferExpenses,
        residency,
        slabRatePercent: parseFloat(slabRate) || 0,
        reinvestSection,
        reinvestAmount,
      }),
    [
      purchaseDate,
      saleDate,
      purchasePrice,
      salePrice,
      improvementCost,
      improvementDate,
      transferExpenses,
      residency,
      slabRate,
      reinvestSection,
      reinvestAmount,
    ],
  )

  const example = useMemo(() => calculatePropertyCapitalGains(EXAMPLE), [])
  const datesValid = Boolean(purchaseDate && saleDate) && saleDate >= purchaseDate

  const optionLabel =
    result.recommended === 'flat'
      ? '12.5% without indexation'
      : result.recommended === 'indexed'
        ? '20% with indexation'
        : `Slab rate ${result.stcgRate * 100}%`

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Capital gains calculator' },
      ]}
      eyebrow={{ icon: TrendingUp, label: 'Calculator · FY 2026-27' }}
      title="Property capital gains calculator"
      tagline="Works out long-term and short-term capital gains tax on property for FY 2026-27, compares 12.5% without indexation with 20% with indexation, and adds 4% cess."
      variant="single-column"
    >
      <ResultBar
        label="Capital gains tax payable"
        value={`₹${formatINR(result.totalTax)}`}
        targetId="result"
      />
      <div className="flex flex-col gap-14">
        <ToolSection label="Who is selling">
          <FieldSet>
            <FieldLegend variant="label">Tax residency</FieldLegend>
            <ToggleGroup
              type="single"
              value={residency}
              onValueChange={(v) => v && setResidency(v as 'resident' | 'nri')}
              variant="outline"
              className="flex w-full flex-wrap justify-start"
            >
              <ToggleGroupItem value="resident" className="min-h-10 px-4">
                Resident
              </ToggleGroupItem>
              <ToggleGroupItem value="nri" className="min-h-10 px-4">
                NRI
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldSet>
          {residency === 'nri' && (
            <Alert className="mt-4 border-0 bg-[var(--muted)]">
              <Info />
              <AlertDescription>
                NRIs pay 12.5% without indexation on property sold on or after
                23 July 2024. The buyer deducts TDS from the payment, so the
                tax is often collected at the time of sale.
              </AlertDescription>
            </Alert>
          )}
        </ToolSection>

        <ToolSection label="Purchase details">
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="purchase-date"
                label="Purchase date"
                value={purchaseDate}
                onChange={setPurchaseDate}
                hint={
                  purchaseDate
                    ? `CII ${result.purchaseCii} for the financial year`
                    : undefined
                }
              />
              <LakhField
                id="purchase-price"
                label="Purchase price"
                value={purchaseLakh}
                onChange={setPurchaseLakh}
                rupees={purchasePrice}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <LakhField
                id="improvement-cost"
                label="Cost of improvement (optional)"
                value={improvementLakh}
                onChange={setImprovementLakh}
                rupees={improvementCost}
                placeholder="0"
              />
              <DateField
                id="improvement-date"
                label="Improvement date"
                value={improvementDate}
                onChange={setImprovementDate}
                hint={
                  improvementCost > 0
                    ? `CII ${result.improvementCii} for the financial year`
                    : 'Leave blank to use the purchase date'
                }
              />
            </div>
          </FieldGroup>
        </ToolSection>

        <ToolSection label="Sale details">
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="sale-date"
                label="Sale date"
                value={saleDate}
                onChange={setSaleDate}
                hint={
                  saleDate
                    ? `CII ${result.saleCii} for the financial year`
                    : undefined
                }
              />
              <LakhField
                id="sale-price"
                label="Sale price"
                value={saleLakh}
                onChange={setSaleLakh}
                rupees={salePrice}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <LakhField
                id="transfer-expenses"
                label="Transfer expenses (optional)"
                value={expensesLakh}
                onChange={setExpensesLakh}
                rupees={transferExpenses}
                placeholder="0"
                hint="Brokerage, legal and stamp costs of the sale"
              />
            </div>
          </FieldGroup>
          {!datesValid && (
            <Alert variant="destructive" className="mt-4 border-0 bg-[var(--muted)]">
              <Info />
              <AlertDescription>
                Enter both dates, with the sale date on or after the purchase
                date.
              </AlertDescription>
            </Alert>
          )}
        </ToolSection>

        {!result.isLongTerm ? (
          <ToolSection
            label="Your income tax slab"
            description="Held for 24 months or less, so the gain is short-term and added to your income at your slab rate."
          >
            <FieldSet>
              <FieldLegend variant="label">Slab rate</FieldLegend>
              <ToggleGroup
                type="single"
                value={slabRate}
                onValueChange={(v) => v && setSlabRate(v)}
                variant="outline"
                className="flex w-full flex-wrap justify-start"
              >
                {SLAB_RATES.map((r) => (
                  <ToggleGroupItem key={r} value={r} className="min-h-10 px-4">
                    {r === '0' ? 'Nil' : `${r}%`}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <p className="text-sm text-[var(--foreground)]/75">
                New regime slabs for FY 2026-27: nil up to ₹4 lakh, then 5, 10,
                15, 20 and 25%, and 30% above ₹24 lakh. Pick the rate on the
                top slice of your income.
              </p>
            </FieldSet>
          </ToolSection>
        ) : (
          <ToolSection
            label="Reinvestment (optional)"
            description="Enter what you will put into a new house or bonds to cut the taxable gain."
          >
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Reinvested under</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={reinvestSection}
                  onValueChange={(v) =>
                    v && setReinvestSection(v as '82' | '85')
                  }
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  <ToggleGroupItem value="82" className="min-h-10 px-4">
                    Section 82 (old 54) house
                  </ToggleGroupItem>
                  <ToggleGroupItem value="85" className="min-h-10 px-4">
                    Section 85 (old 54EC) bonds
                  </ToggleGroupItem>
                </ToggleGroup>
              </FieldSet>
              <div className="grid gap-4 sm:grid-cols-2">
                <LakhField
                  id="reinvest-amount"
                  label={
                    reinvestSection === '82'
                      ? 'Cost of the new house'
                      : 'Amount invested in bonds'
                  }
                  value={reinvestLakh}
                  onChange={setReinvestLakh}
                  rupees={reinvestAmount}
                  placeholder="0"
                  hint={
                    reinvestSection === '82'
                      ? 'New house cost above ₹10 crore is ignored'
                      : 'Capped at ₹50 lakh'
                  }
                />
              </div>
            </FieldGroup>
          </ToolSection>
        )}

        <ToolSection
          id="result"
          label="Tax breakdown"
          description={
            result.isLongTerm
              ? 'Held for more than 24 months, so the gain is long-term.'
              : 'Held for 24 months or less, so the gain is short-term and taxed at your slab rate.'
          }
        >
          <div className="flex flex-col gap-6">
            <BreakdownTable
              longTerm={result.isLongTerm}
              result={result}
              salePrice={salePrice}
              transferExpenses={transferExpenses}
              purchasePrice={purchasePrice}
              improvementCost={improvementCost}
            />

            {result.isLongTerm &&
              residency === 'resident' &&
              !result.indexedAvailable && (
                <Alert className="border-0 bg-[var(--muted)]">
                  <Info />
                  <AlertDescription>
                    Property bought on or after 23 July 2024 gets only 12.5%
                    without indexation.
                  </AlertDescription>
                </Alert>
              )}
            {result.isLongTerm && !result.flatAvailable && (
              <Alert className="border-0 bg-[var(--muted)]">
                <Info />
                <AlertDescription>
                  Sales before 23 July 2024 were taxed at 20% with indexation
                  only.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-xl bg-[var(--muted)] p-5">
              <p className="text-sm text-[var(--foreground)]/75">
                {result.isLongTerm ? 'Lower tax option' : 'Tax basis'}
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                {optionLabel}
              </p>
              <p className="mt-3 text-sm text-[var(--foreground)]/75">
                Tax ₹{formatINR(result.taxBeforeCess)} plus 4% cess ₹
                {formatINR(result.cess)}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-[var(--brand)]">
                Tax payable: ₹{formatINR(result.totalTax)}
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]/75">
                Plus surcharge if your income is above ₹50 lakh.
              </p>
            </div>
          </div>
        </ToolSection>

        <ToolSection
          label="Reduce or eliminate the tax"
          description="Under the Income-tax Act 2025, long-term gains can be exempted by reinvesting."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <ExemptionPanel
              section="Section 82 (old 54)"
              detail="Reinvest the gain from a residential house in another house. Buy one year before or two years after the sale, or build within three years. A new house cost above ₹10 crore is ignored. If the gain is ₹2 crore or less, you can choose one time to buy two houses."
            />
            <ExemptionPanel
              section="Section 85 (old 54EC)"
              detail="Gain from land or a building only. Invest within 6 months in REC, PFC, IRFC, HUDCO or IREDA bonds, up to ₹50 lakh, with a 5-year lock-in. NHAI no longer issues these bonds. The amount invested is exempted from the gain rupee for rupee, it does not reduce the tax rupee for rupee."
            />
            <ExemptionPanel
              section="Section 86 (old 54F)"
              detail="Sell a long-term asset other than a house and invest the net sale value in a house. The exemption is pro-rata to the net sale value invested, and the new house cost is capped at ₹10 crore."
            />
          </div>
        </ToolSection>

        <ToolSection
          label="Worked example"
          description="A resident who bought on 15 June 2015 and sold on 21 November 2026."
        >
          <div className="flex max-w-[68ch] flex-col gap-3 rounded-xl bg-[var(--muted)] p-5 text-base leading-relaxed text-[var(--foreground)]/80">
            <p>
              Bought for ₹50,00,000 (CII {example.purchaseCii} for FY 2015-16)
              and sold for ₹1,20,00,000 (CII {example.saleCii} for FY
              2026-27). Held for more than 24 months, so the gain is long-term.
            </p>
            <p>
              Without indexation: gain ₹{formatINR(example.flatGain)} at 12.5%
              is ₹{formatINR(example.flatTaxBeforeCess)}, or ₹
              {formatINR(example.flatTaxTotal)} with cess.
            </p>
            <p>
              With indexation: indexed cost ₹{formatINR(example.indexedCost)},
              gain ₹{formatINR(example.indexedGain)} at 20% is ₹
              {formatINR(example.indexedTaxBeforeCess)}, or ₹
              {formatINR(example.indexedTaxTotal)} with cess.
            </p>
            <p className="font-semibold text-[var(--foreground)]">
              The 12.5% option is lower here, so the tax is ₹
              {formatINR(example.totalTax)}.
            </p>
          </div>
        </ToolSection>

        <ToolSection
          label="Cost Inflation Index, 2001-02 to 2026-27"
          description="Indexed cost is your cost multiplied by the CII of the sale year divided by the CII of the purchase year."
        >
          <div className="max-w-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead>Financial year</TableHead>
                  <TableHead className="text-right">CII</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FY_LIST.map((fy) => (
                  <TableRow key={fy} className="border-0">
                    <TableCell>FY {fy}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {CII[fy]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ToolSection>

        <NextStepCard from="/property-capital-gains-calculator" />

        <ToolContext title={CAPITAL_GAINS_CONTEXT.title}>
          {CAPITAL_GAINS_CONTEXT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ToolContext>

        <RelatedGuidesSection
          items={([
            'property-document-checklist',
            'circle-rate-vs-market-rate',
            'stamp-duty-registration-charges-india',
          ] as const).map(getArticleLinkItem)}
          description="Use these guides to connect sale-tax planning to the full property transaction picture."
        />

        <ToolFaq items={CAPITAL_GAINS_FAQS} />

        <ToolSources
          sources={CII_SOURCE_URLS.map((url, i) => ({
            label:
              i === 0
                ? 'Income Tax Department - Cost Inflation Index table'
                : 'CBDT Notification No. 85/2026 - CII for FY 2026-27',
            url,
          }))}
          checked={CII_LAST_UPDATED}
          note={`Income-tax Act 2025 in force from 1 April 2026. Reinvestment caps used here: section 82 new house cost ₹${formatINR(S82_CAP)} and section 85 bonds ₹${formatINR(S85_CAP)}. Surcharge is not modelled. This is a planning tool; confirm the final figure with a CA before filing.`}
        />
      </div>
    </ToolPageShell>
  )
}

type CgResult = ReturnType<typeof calculatePropertyCapitalGains>

interface BreakdownTableProps {
  longTerm: boolean
  result: CgResult
  salePrice: number
  transferExpenses: number
  purchasePrice: number
  improvementCost: number
}

function BreakdownTable({
  longTerm,
  result,
  salePrice,
  transferExpenses,
  purchasePrice,
  improvementCost,
}: BreakdownTableProps) {
  const inr = (n: number) => `₹${formatINR(n)}`
  const dash = '—'
  const flatOn = result.flatAvailable
  const idxOn = result.indexedAvailable

  if (!longTerm) {
    const rows: Array<[string, string, boolean?]> = [
      ['Sale price', inr(salePrice)],
      ['Transfer expenses', `− ${inr(transferExpenses)}`],
      ['Cost of acquisition', `− ${inr(purchasePrice)}`],
      ['Cost of improvement', `− ${inr(improvementCost)}`],
      ['Short-term gain', inr(result.flatGain)],
      [`Tax at ${result.stcgRate * 100}% slab rate`, inr(result.stcg)],
      ['Cess at 4%', inr(result.cess)],
      ['Total tax', inr(result.totalTax), true],
    ]
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([k, v, total]) => (
            <TableRow key={k} className={total ? 'border-t font-semibold' : 'border-0'}>
              <TableCell className="whitespace-normal">{k}</TableCell>
              <TableCell className="text-right tabular-nums">{v}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const flatCess = result.flatTaxTotal - result.flatTaxBeforeCess
  const idxCess = result.indexedTaxTotal - result.indexedTaxBeforeCess
  const exemption = (gain: number, taxable: number) => `− ${inr(gain - taxable)}`
  const rows: Array<[string, string, string, boolean?]> = [
    [
      'Sale price less expenses',
      flatOn ? inr(salePrice - transferExpenses) : dash,
      idxOn ? inr(salePrice - transferExpenses) : dash,
    ],
    [
      'Cost of acquisition',
      flatOn ? `− ${inr(purchasePrice)}` : dash,
      idxOn ? `− ${inr(result.indexedCost)}` : dash,
    ],
    [
      'Cost of improvement',
      flatOn ? `− ${inr(improvementCost)}` : dash,
      idxOn ? `− ${inr(result.indexedImprovement)}` : dash,
    ],
    [
      'Long-term gain',
      flatOn ? inr(result.flatGain) : dash,
      idxOn ? inr(result.indexedGain) : dash,
    ],
    [
      'Reinvestment exemption',
      flatOn ? exemption(result.flatGain, result.flatTaxableGain) : dash,
      idxOn ? exemption(result.indexedGain, result.indexedTaxableGain) : dash,
    ],
    [
      'Taxable gain',
      flatOn ? inr(result.flatTaxableGain) : dash,
      idxOn ? inr(result.indexedTaxableGain) : dash,
    ],
    [
      'Tax before cess',
      flatOn ? inr(result.flatTaxBeforeCess) : dash,
      idxOn ? inr(result.indexedTaxBeforeCess) : dash,
    ],
    [
      'Cess at 4%',
      flatOn ? inr(flatCess) : dash,
      idxOn ? inr(idxCess) : dash,
    ],
    [
      'Total tax',
      flatOn ? inr(result.flatTaxTotal) : dash,
      idxOn ? inr(result.indexedTaxTotal) : dash,
      true,
    ],
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b">
          <TableHead className="whitespace-normal">Item</TableHead>
          <TableHead className="whitespace-normal text-right">
            12.5% without indexation
          </TableHead>
          <TableHead className="whitespace-normal text-right">
            20% with indexation
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([k, a, b, total]) => (
          <TableRow key={k} className={total ? 'border-t font-semibold' : 'border-0'}>
            <TableCell className="whitespace-normal">{k}</TableCell>
            <TableCell className="text-right tabular-nums">{a}</TableCell>
            <TableCell className="text-right tabular-nums">{b}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface DateFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}

function DateField({ id, label, value, onChange, hint }: DateFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && (
        <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>
      )}
    </div>
  )
}

interface LakhFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  rupees: number
  placeholder?: string
  hint?: string
}

function LakhField({
  id,
  label,
  value,
  onChange,
  rupees,
  placeholder,
  hint,
}: LakhFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>₹</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-sm">lakh</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <p className="text-xs text-[var(--muted-foreground)]">
        = ₹{formatINR(rupees)}
        {hint ? ` · ${hint}` : ''}
      </p>
    </div>
  )
}

function ExemptionPanel({
  section,
  detail,
}: {
  section: string
  detail: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[var(--muted)] p-4">
      <p className="font-semibold text-[var(--foreground)]">{section}</p>
      <p className="text-sm leading-relaxed text-[var(--foreground)]/75">
        {detail}
      </p>
    </div>
  )
}

function lakh(value: string) {
  const n = parseFloat(value)
  return Number.isFinite(n) && n > 0 ? n * 100000 : 0
}

function formatINR(n: number) {
  if (!Number.isFinite(n) || n === 0) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
