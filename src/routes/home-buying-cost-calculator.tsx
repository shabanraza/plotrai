import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowRight, Info, KeyRound } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ResultBar } from '#/components/tools/result-bar'
import { ToolSources } from '#/components/tools/tool-sources'
import { ToolContext } from '#/components/tools/tool-context'
import { HomeLoanCta } from '#/components/tools/home-loan-cta'
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
  STAMP_DUTY,
  STAMP_DUTY_LAST_UPDATED,
  type StampDutyRate,
} from '#/data/stamp-duty-rates'
import { STATE_CONTENT, stampDutySources } from '#/data/state-stamp-duty-content'
import { HOME_BUYING_COST_FAQS } from '#/data/tool-seo-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import {
  calculateHomeBuyingCost,
  type PropertyStage,
} from '#/lib/home-buying-cost'
import type { StampDutyGender } from '#/lib/stamp-duty'

const PATH = '/home-buying-cost-calculator'

export const Route = createFileRoute('/home-buying-cost-calculator')({
  component: HomeBuyingCostCalculatorPage,
  head: () => ({
    meta: [
      {
        title:
          'Home Buying Cost Calculator India 2026 — Stamp Duty, GST, EMI · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Total cost of buying a house in India: stamp duty, registration, GST, brokerage, loan processing fee, down payment and home loan EMI in one calculator. State-wise 2026 rates, RBI LTV limits applied.',
      },
      {
        property: 'og:title',
        content: 'Home Buying Cost Calculator India 2026',
      },
      {
        property: 'og:description',
        content:
          'Stamp duty, GST, down payment and EMI — the full cash you need to buy a home in India.',
      },
      { property: 'og:url', content: `https://plotrai.in${PATH}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink(PATH)],
    scripts: [
      softwareAppLd({
        name: 'Home Buying Cost Calculator India',
        description:
          'Calculate the total cost of buying a house in India including stamp duty, registration, GST, brokerage, down payment and home loan EMI.',
        path: PATH,
        category: 'FinanceApplication',
      }),
      faqPageLd(HOME_BUYING_COST_FAQS),
    ],
  }),
})

function HomeBuyingCostCalculatorPage() {
  const [stateName, setStateName] = useState('Maharashtra')
  const [cityName, setCityName] = useState('Mumbai')
  const [propertyValueLakh, setPropertyValueLakh] = useState('80')
  const [stage, setStage] = useState<PropertyStage>('ready')
  const [gender, setGender] = useState<StampDutyGender>('male')
  const [brokeragePercent, setBrokeragePercent] = useState('1')
  const [legalFees, setLegalFees] = useState('25000')
  const [ltv, setLtv] = useState('75')
  const [interestRate, setInterestRate] = useState('8.5')
  const [tenure, setTenure] = useState('20')
  const [processingFee, setProcessingFee] = useState('0.5')

  const stateEntry = STAMP_DUTY.find((s) => s.state === stateName)
  const cities = stateEntry?.cities ?? []
  const rate: StampDutyRate = useMemo(() => {
    if (!stateEntry) return { male: 0, female: 0, joint: 0, registration: 0 }
    return (
      stateEntry.cities?.find((c) => c.city === cityName)?.rates ??
      stateEntry.default
    )
  }, [stateEntry, cityName])

  const propertyValue = parseNumber(propertyValueLakh) * 100000
  const result = useMemo(
    () =>
      calculateHomeBuyingCost({
        propertyValue,
        rate,
        gender,
        stage,
        brokeragePercent: parseNumber(brokeragePercent),
        legalAndOtherFees: parseNumber(legalFees),
        loanLtvPercent: parseNumber(ltv),
        interestRatePercent: parseNumber(interestRate),
        tenureYears: parseNumber(tenure),
        processingFeePercent: parseNumber(processingFee),
      }),
    [
      brokeragePercent,
      gender,
      interestRate,
      legalFees,
      ltv,
      processingFee,
      propertyValue,
      rate,
      stage,
      tenure,
    ],
  )

  const stateSlug = STATE_CONTENT.find((s) => s.state === stateName)?.slug

  function handleStateChange(s: string) {
    setStateName(s)
    const entry = STAMP_DUTY.find((x) => x.state === s)
    setCityName(entry?.cities?.[0]?.city ?? '')
  }

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Home buying cost calculator' },
      ]}
      eyebrow={{ icon: KeyRound, label: 'Calculator · Buyer budget' }}
      title="Home buying cost calculator"
      tagline="The full cash you need to buy a home in India — stamp duty, registration, GST, brokerage and loan fees on top of the price, plus your down payment and monthly EMI."
      variant="single-column"
    >
      <ResultBar
        label="Cash needed upfront"
        value={`₹${formatINR(result.upfrontCash)}`}
        targetId="result"
      />
      <div className="flex flex-col gap-14">
        <ToolSection number="01" label="The property" rule={false}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="state">State</FieldLabel>
              <Select value={stateName} onValueChange={handleStateChange}>
                <SelectTrigger id="state" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>States &amp; UTs</SelectLabel>
                    {STAMP_DUTY.map((s) => (
                      <SelectItem key={s.state} value={s.state}>
                        {s.state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {cities.length > 0 && (
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Select value={cityName} onValueChange={setCityName}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{stateName}</SelectLabel>
                      {cities.map((c) => (
                        <SelectItem key={c.city} value={c.city}>
                          {c.city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="value">Property price</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="value"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={propertyValueLakh}
                  onChange={(e) => setPropertyValueLakh(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="text-sm">
                    lakh
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>= ₹{formatINR(propertyValue)}</FieldDescription>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel>Property status</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={stage}
                onValueChange={(v) => v && setStage(v as PropertyStage)}
              >
                <ToggleGroupItem value="ready">Ready</ToggleGroupItem>
                <ToggleGroupItem value="under-construction">
                  Under construction
                </ToggleGroupItem>
                <ToggleGroupItem value="affordable">Affordable</ToggleGroupItem>
              </ToggleGroup>
              <FieldDescription>
                GST: 0% on ready or resale, 5% under construction, 1% on
                affordable housing (up to ₹45 lakh).
              </FieldDescription>
            </Field>
          </FieldGroup>
        </ToolSection>

        <ToolSection
          number="02"
          label="Buyer and extra charges"
          description="Female buyers get a stamp duty concession in many states."
        >
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel>Registered in the name of</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={gender}
                onValueChange={(v) => v && setGender(v as StampDutyGender)}
              >
                <ToggleGroupItem value="male">Male</ToggleGroupItem>
                <ToggleGroupItem value="female">Female</ToggleGroupItem>
                <ToggleGroupItem value="joint">Joint (M+F)</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <PercentField
              id="brokerage"
              label="Brokerage"
              value={brokeragePercent}
              onChange={setBrokeragePercent}
              description="Usually 1% on resale. Set 0 if buying from the builder."
            />
            <Field>
              <FieldLabel htmlFor="legal">Legal &amp; documentation</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="legal"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={legalFees}
                  onChange={(e) => setLegalFees(e.target.value)}
                />
              </InputGroup>
              <FieldDescription>
                Lawyer, title search, agreement drafting.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </ToolSection>

        <ToolSection number="03" label="Home loan">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <PercentField
              id="ltv"
              label="Loan amount (% of price)"
              value={ltv}
              onChange={setLtv}
              description={`RBI limit for this price: ${result.maxLtvPercent}%. Set 0 for no loan.`}
            />
            <PercentField
              id="rate"
              label="Interest rate (per year)"
              value={interestRate}
              onChange={setInterestRate}
              description="Most banks quote 8.4–9.5% in 2026."
            />
            <Field>
              <FieldLabel htmlFor="tenure">Tenure</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="tenure"
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  inputMode="numeric"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>years</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <PercentField
              id="processing"
              label="Processing fee"
              value={processingFee}
              onChange={setProcessingFee}
              description="Typically 0.25–1% of the loan."
            />
          </FieldGroup>
          {result.ltvCapped && (
            <Alert className="mt-4">
              <Info />
              <AlertDescription>
                Banks can lend at most {result.maxLtvPercent}% of a ₹
                {formatINR(propertyValue)} property under RBI rules, so the
                loan is capped at ₹{formatINR(result.loanAmount)}.
              </AlertDescription>
            </Alert>
          )}
        </ToolSection>

        <ToolSection
          id="result"
          number="04"
          label="What it really costs"
          description={`${cityName || stateName} · ${STAGE_LABEL[stage]} · ${GENDER_LABEL[gender]} buyer`}
        >
          <div className="mb-6 grid gap-3 rounded-xl bg-[var(--accent-teal-light)] p-5 sm:grid-cols-3">
            <Stat
              label="Cash needed upfront"
              value={result.upfrontCash}
              highlight
            />
            <Stat label="Monthly EMI" value={result.emi} />
            <Stat
              label="Total cost incl. interest"
              value={result.totalCostOfOwnership}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[55%]">One-time charge</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ChargeRow
                label="Stamp duty"
                rate={`${result.stampDutyPercent}%`}
                value={result.stampDutyAmount}
              />
              <ChargeRow
                label="Registration"
                rate={`${rate.registration}%`}
                value={result.registrationAmount}
              />
              <ChargeRow
                label="GST"
                rate={`${result.gstPercent}%`}
                value={result.gstAmount}
              />
              <ChargeRow
                label="Brokerage"
                rate={`${parseNumber(brokeragePercent)}%`}
                value={result.brokerageAmount}
              />
              <ChargeRow
                label="Legal & documentation"
                rate="—"
                value={result.legalAndOtherFees}
              />
              <ChargeRow
                label="Loan processing fee"
                rate={`${parseNumber(processingFee)}%`}
                value={result.processingFee}
              />
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="py-3.5 text-right font-semibold">
                  Charges over the price
                </TableCell>
                <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--accent-teal)]">
                  ₹{formatINR(result.oneTimeCharges)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[55%]">Loan summary</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SummaryRow label="Loan amount" value={result.loanAmount} />
              <SummaryRow label="Down payment" value={result.downPayment} />
              <SummaryRow
                label={`Interest (${parseNumber(tenure)} yrs)`}
                value={result.totalInterest}
              />
              <SummaryRow
                label="Upfront cash"
                value={result.upfrontCash}
                strong
              />
            </TableBody>
          </Table>

          <div className="mt-6">
            <HomeLoanCta
              source="home-buying-cost-calculator"
              loanAmount={result.loanAmount}
            />
          </div>
        </ToolSection>

        {stateSlug && (
          <ToolSection number="05" label={`Stamp duty in ${stateName}`}>
            <div className="flex flex-col gap-4 rounded-xl bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
                See male, female and joint rates and the city-wise breakdown
                for {stateName}.
              </p>
              <Link
                to="/stamp-duty/$state"
                params={{ state: stateSlug }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-teal)] hover:underline"
              >
                {stateName} stamp duty rates
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </ToolSection>
        )}

        <ToolContext title="What goes into the cost of buying a home">
          <p>
            The price on the agreement is only part of the bill. Stamp duty and
            registration are state charges paid before the sale deed is
            registered, and banks do not finance them. Under-construction
            property also carries GST, paid to the builder in instalments.
          </p>
          <p>
            Your home loan covers at most 75–90% of the price depending on the
            property value, so the down payment plus every one-time charge has
            to come from savings. That upfront cash, not the EMI, is usually
            what decides how much home you can buy.
          </p>
        </ToolContext>

        <ToolFaq items={HOME_BUYING_COST_FAQS} />

        <ToolSources
          sources={[
            ...stampDutySources(stateName),
            { label: 'Reserve Bank of India loan-to-value limits for housing loans' },
          ]}
          checked={STAMP_DUTY_LAST_UPDATED}
          note="Stamp duty is charged on the higher of the agreement value and the circle rate. Interest rate, brokerage and legal fees are editable defaults; use the figures from your bank sanction letter and broker for a final budget."
        />
      </div>
    </ToolPageShell>
  )
}

const STAGE_LABEL: Record<PropertyStage, string> = {
  ready: 'Ready / resale',
  'under-construction': 'Under construction',
  affordable: 'Affordable housing',
}

const GENDER_LABEL: Record<StampDutyGender, string> = {
  male: 'male',
  female: 'female',
  joint: 'joint',
}

function PercentField({
  id,
  label,
  value,
  onChange,
  description,
}: {
  id: string
  label: string
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
          <InputGroupText>%</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
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

function ChargeRow({
  label,
  rate,
  value,
}: {
  label: string
  rate: string
  value: number
}) {
  return (
    <TableRow>
      <TableCell className="py-3.5 font-medium">{label}</TableCell>
      <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
        {rate}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        ₹{formatINR(value)}
      </TableCell>
    </TableRow>
  )
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string
  value: number
  strong?: boolean
}) {
  return (
    <TableRow>
      <TableCell className={strong ? 'font-semibold' : 'font-medium'}>
        {label}
      </TableCell>
      <TableCell
        className={`text-right tabular-nums ${strong ? 'font-bold text-[var(--accent-teal)]' : ''}`}
      >
        ₹{formatINR(value)}
      </TableCell>
    </TableRow>
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
