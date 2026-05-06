import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Receipt } from 'lucide-react'
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
  STAMP_DUTY,
  STAMP_DUTY_LAST_UPDATED,
  type StampDutyRate,
} from '#/data/stamp-duty-rates'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { STAMP_DUTY_FAQS, STAMP_DUTY_CONTEXT } from '#/data/tool-seo-content'
import { softwareAppLd, faqPageLd } from '#/lib/seo'
import { STATE_CONTENT } from '#/data/state-stamp-duty-content'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/stamp-duty-calculator')({
  component: StampDutyCalculatorPage,
  head: () => ({
    meta: [
      {
        title: 'Stamp Duty Calculator India 2026 — Mumbai, Delhi, Bangalore, Pune · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Free stamp duty + registration calculator covering all major Indian states and cities. Mumbai, Delhi, Bangalore, Pune, Chennai, Hyderabad, Noida, Gurgaon. Female-buyer discount included. Updated 2026.',
      },
      { property: 'og:title', content: 'Stamp Duty Calculator India 2026' },
      {
        property: 'og:description',
        content:
          'Calculate stamp duty + registration charges for any Indian state. Female-buyer rates included. Mobile-first, no signup.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/stamp-duty-calculator.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/stamp-duty-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/stamp-duty-calculator.png' },
    ],
    scripts: [
      softwareAppLd({
        name: 'Stamp Duty Calculator India',
        description:
          'Free stamp duty and registration calculator for all major Indian states and cities including female-buyer concession rates.',
        path: '/stamp-duty-calculator',
        category: 'FinanceApplication',
      }),
      faqPageLd(STAMP_DUTY_FAQS),
    ],
  }),
})

type Gender = 'male' | 'female' | 'joint'

function StampDutyCalculatorPage() {
  const [stateName, setStateName] = useState<string>('Maharashtra')
  const [cityName, setCityName] = useState<string>('Mumbai')
  const [gender, setGender] = useState<Gender>('male')
  const [propertyValueLakh, setPropertyValueLakh] = useState<string>('80')
  const [loanLtv, setLoanLtv] = useState<string>('80')

  const stateEntry = useMemo(
    () => STAMP_DUTY.find((s) => s.state === stateName),
    [stateName],
  )

  const cities = stateEntry?.cities ?? []

  const rate: StampDutyRate = useMemo(() => {
    if (!stateEntry) return { male: 0, female: 0, joint: 0, registration: 0 }
    const cityRates = stateEntry.cities?.find((c) => c.city === cityName)?.rates
    return cityRates ?? stateEntry.default
  }, [stateEntry, cityName])

  const propertyValue = (parseFloat(propertyValueLakh) || 0) * 100000
  const ltv = (parseFloat(loanLtv) || 0) / 100

  const stampDutyPct = rate[gender]
  const stampDutyAmt = (propertyValue * stampDutyPct) / 100

  let registrationAmt = (propertyValue * rate.registration) / 100
  if (rate.registrationCap && registrationAmt > rate.registrationCap) {
    registrationAmt = rate.registrationCap
  }

  const totalGovt = stampDutyAmt + registrationAmt
  const downPayment = propertyValue * (1 - ltv)
  const totalCash = totalGovt + downPayment

  function handleStateChange(s: string) {
    setStateName(s)
    const entry = STAMP_DUTY.find((x) => x.state === s)
    setCityName(entry?.cities?.[0]?.city ?? '')
  }

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: 'Stamp Duty Calculator' }]}
      eyebrow={{ icon: Receipt, label: 'Calculator · Live' }}
      title="Stamp Duty Calculator"
      tagline="State-wise stamp duty and registration charges for Indian property purchases. Female-buyer rates included. Updated 2026."
      variant="single-column"
      footnote={`Rates last refreshed ${STAMP_DUTY_LAST_UPDATED}. Stamp duty + registration are paid in cash above and beyond your home loan. For legal-grade calculation, cross-check with your state IGR portal or sub-registrar office.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Where is the property?" rule={false}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
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
            </div>
            {cities.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
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
              </div>
            )}
          </div>
          {rate.note && (
            <p className="mt-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2 text-sm text-[var(--muted-foreground)]">
              {rate.note}
            </p>
          )}
        </ToolSection>

        <ToolSection number="02" label="Buyer details" description="Female buyers get a discount in many states.">
          <div className="flex flex-col gap-2">
            <Label>Buyer gender</Label>
            <ToggleGroup
              type="single"
              value={gender}
              onValueChange={(v) => v && setGender(v as Gender)}
              variant="outline"
            >
              <ToggleGroupItem value="male">Male</ToggleGroupItem>
              <ToggleGroupItem value="female">Female</ToggleGroupItem>
              <ToggleGroupItem value="joint">Joint (M+F)</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </ToolSection>

        <ToolSection number="03" label="Property value" description="Including any agreed-on amenities. Enter in lakhs.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="value">Property value</Label>
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
                  <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    Lakh
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-[var(--muted-foreground)]">
                = ₹{formatINR(propertyValue)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ltv">Home loan LTV (optional)</Label>
              <InputGroup>
                <InputGroupInput
                  id="ltv"
                  type="number"
                  min="0"
                  max="90"
                  step="any"
                  value={loanLtv}
                  onChange={(e) => setLoanLtv(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-[var(--muted-foreground)]">
                Used to compute the cash gap. 80% is typical.
              </p>
            </div>
          </div>
        </ToolSection>

        <ToolSection
          number="04"
          label="Total payable"
          description={`Stamp duty + registration in ${cityName || stateName} for a ${gender} buyer.`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[55%]">Charge</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="py-3.5 font-medium">Stamp duty</TableCell>
                <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
                  {stampDutyPct}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  ₹{formatINR(stampDutyAmt)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-3.5 font-medium">Registration</TableCell>
                <TableCell className="text-right tabular-nums text-[var(--muted-foreground)]">
                  {rate.registration}%
                  {rate.registrationCap ? ` (cap ₹${formatINR(rate.registrationCap)})` : ''}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  ₹{formatINR(registrationAmt)}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="py-3.5 text-right font-semibold">
                  Government fees total
                </TableCell>
                <TableCell className="py-3.5 text-right text-base font-bold tabular-nums text-[var(--accent-teal)]">
                  ₹{formatINR(totalGovt)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="mt-6 grid gap-3 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Down payment ({(100 - parseFloat(loanLtv || '0')).toFixed(0)}%)
              </p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[var(--foreground)]">
                ₹{formatINR(downPayment)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                + Government fees
              </p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[var(--foreground)]">
                ₹{formatINR(totalGovt)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-teal)]">
                Total cash needed
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-[var(--accent-teal)]">
                ₹{formatINR(totalCash)}
              </p>
            </div>
          </div>
        </ToolSection>

        <ToolContext title={STAMP_DUTY_CONTEXT.title}>
          {STAMP_DUTY_CONTEXT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ToolContext>

        <ToolSection number="STATES" label="Stamp duty by state" description="Detailed rate page for each state with city-wise breakdown.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {STATE_CONTENT.map((s) => (
              <Link
                key={s.slug}
                to="/stamp-duty/$state"
                params={{ state: s.slug }}
                className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/40"
              >
                {s.displayName}
                <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
              </Link>
            ))}
          </div>
        </ToolSection>

        <ToolFaq items={STAMP_DUTY_FAQS} />
      </div>
    </ToolPageShell>
  )
}

function formatINR(n: number) {
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
