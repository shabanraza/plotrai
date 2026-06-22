import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
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
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { CII, CII_LAST_UPDATED, FY_LIST } from '#/data/cii'
import { CAPITAL_GAINS_FAQS } from '#/data/tool-seo-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import { calculateIndexation } from '#/lib/indexation'

export const Route = createFileRoute('/indexation-calculator')({
  component: IndexationCalculatorPage,
  head: () => ({
    meta: [
      { title: 'Indexation Calculator India — CII Indexed Cost · Plotr Ai' },
      {
        name: 'description',
        content:
          'Calculate indexed cost of acquisition using India Cost Inflation Index (CII). Compare purchase FY, sale FY, indexed cost, indexed gain, and 20% LTCG estimate.',
      },
      { property: 'og:title', content: 'Indexation Calculator India' },
      {
        property: 'og:description',
        content: 'Calculate indexed cost and indexed capital gain using CII.',
      },
      {
        property: 'og:url',
        content: 'https://plotrai.in/indexation-calculator',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/indexation-calculator')],
    scripts: [
      softwareAppLd({
        name: 'Indexation Calculator India',
        description:
          'Calculate indexed cost of acquisition using India Cost Inflation Index (CII).',
        path: '/indexation-calculator',
        category: 'FinanceApplication',
      }),
      faqPageLd(CAPITAL_GAINS_FAQS.slice(1, 4)),
    ],
  }),
})

function IndexationCalculatorPage() {
  const [purchaseFy, setPurchaseFy] = useState('2018-19')
  const [saleFy, setSaleFy] = useState('2025-26')
  const [purchasePriceLakh, setPurchasePriceLakh] = useState('40')
  const [salePriceLakh, setSalePriceLakh] = useState('100')

  const result = useMemo(() => {
    const purchasePrice = parseNumber(purchasePriceLakh) * 100000
    const salePrice = parseNumber(salePriceLakh) * 100000
    const purchaseCii = CII[purchaseFy] ?? 100
    const saleCii = CII[saleFy] ?? purchaseCii
    const indexed = calculateIndexation({
      purchasePrice,
      salePrice,
      purchaseCii,
      saleCii,
    })

    return { purchasePrice, salePrice, purchaseCii, saleCii, ...indexed }
  }, [purchaseFy, purchasePriceLakh, saleFy, salePriceLakh])

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Indexation Calculator' },
      ]}
      eyebrow={{ icon: TrendingUp, label: 'CII · Property tax planning' }}
      title="Indexation Calculator"
      tagline="Calculate indexed cost of acquisition using India's Cost Inflation Index. Useful for property LTCG comparisons where the old 20% indexed regime is still available."
      variant="single-column"
      footnote={`CII values last checked ${CII_LAST_UPDATED}. This page estimates indexed cost only; use the full property capital gains calculator for old-vs-new regime comparison and Section 54/54EC exemptions.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Indexation inputs" rule={false}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="purchase-fy">
                Purchase financial year
              </FieldLabel>
              <Select value={purchaseFy} onValueChange={setPurchaseFy}>
                <SelectTrigger id="purchase-fy" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>Purchase FY</SelectLabel>
                    {FY_LIST.map((fy) => (
                      <SelectItem key={fy} value={fy}>
                        FY {fy} · CII {CII[fy]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Year in which the property was acquired.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="sale-fy">Sale financial year</FieldLabel>
              <Select value={saleFy} onValueChange={setSaleFy}>
                <SelectTrigger id="sale-fy" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>Sale FY</SelectLabel>
                    {FY_LIST.map((fy) => (
                      <SelectItem key={fy} value={fy}>
                        FY {fy} · CII {CII[fy]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Year in which the property is sold.
              </FieldDescription>
            </Field>
            <MoneyField
              id="purchase-price"
              label="Original purchase price"
              value={purchasePriceLakh}
              onChange={setPurchasePriceLakh}
            />
            <MoneyField
              id="sale-price"
              label="Sale price"
              value={salePriceLakh}
              onChange={setSalePriceLakh}
            />
          </FieldGroup>
        </ToolSection>

        <ToolSection number="02" label="Indexed result">
          <div className="mb-6 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Indexed cost of acquisition
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[var(--accent-teal)]">
              ₹{formatINR(result.indexedCost)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              ₹{formatINR(result.purchasePrice)} × {result.saleCii} /{' '}
              {result.purchaseCii}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ResultRow label="Sale value" value={result.salePrice} />
              <ResultRow label="Indexed cost" value={result.indexedCost} />
              <ResultRow
                label="Indexed capital gain"
                value={result.indexedGain}
              />
              <ResultRow
                label="Tax at 20% indexed regime"
                value={result.taxAt20Percent}
                strong
              />
            </TableBody>
          </Table>
        </ToolSection>

        <ToolSection number="03" label="Need the full property tax comparison?">
          <div className="flex flex-col gap-4 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
              For property sold after July 2024, many older properties need old
              indexed-regime vs new 12.5% no-indexation comparison. The full
              calculator runs both.
            </p>
            <Button asChild>
              <Link to="/property-capital-gains-calculator">
                Open capital gains calculator
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </ToolSection>

        <ToolContext title="What indexation means">
          <p>
            Indexation adjusts the purchase cost using Cost Inflation Index
            values notified by the Income Tax Department. Higher indexed cost
            reduces the taxable long-term capital gain.
          </p>
          <p>
            For eligible land or building acquired before 23 July 2024, resident
            individuals and HUFs may compare 20% tax with indexation against
            12.5% without indexation.
          </p>
        </ToolContext>

        <ToolFaq items={CAPITAL_GAINS_FAQS.slice(1, 4)} />
      </div>
    </ToolPageShell>
  )
}

function MoneyField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
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
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
            Lakh
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Enter amount in lakh.</FieldDescription>
    </Field>
  )
}

function ResultRow({
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
      <TableCell className={strong ? 'font-semibold' : ''}>{label}</TableCell>
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
  if (!Number.isFinite(n) || n === 0) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
