import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { PropertyTaxContent } from '#/data/property-tax-content'
import { calculatePropertyTax } from '#/lib/property-tax'

interface PropertyTaxPageProps {
  content: PropertyTaxContent
}

export function PropertyTaxPage({ content }: PropertyTaxPageProps) {
  const [area, setArea] = useState(String(content.defaultArea))
  const [rate, setRate] = useState(String(content.defaultRate))
  const [taxRate, setTaxRate] = useState(String(content.taxRate))
  const [depreciation, setDepreciation] = useState(
    String(content.depreciationPercent),
  )
  const [cess, setCess] = useState(String(content.cessPercent))
  const [rebate, setRebate] = useState(String(content.rebatePercent))

  const result = useMemo(() => {
    return calculatePropertyTax({
      authority: content.authority as 'BBMP' | 'GHMC' | 'MCD',
      areaSqft: parseNumber(area),
      monthlyRatePerSqft: parseNumber(rate),
      taxRatePercent: parseNumber(taxRate),
      depreciationPercent: parseNumber(depreciation),
      cessPercent: parseNumber(cess),
      rebatePercent: parseNumber(rebate),
    })
  }, [area, cess, depreciation, rate, rebate, taxRate])

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: content.title }]}
      eyebrow={{ icon: Building2, label: `${content.authority} · Estimate` }}
      title={content.title}
      tagline={content.description}
      variant="single-column"
      footnote={`Source checked ${content.lastUpdated}. ${content.estimateNote} Use this for planning, then verify payable dues on the official municipal portal.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Property inputs" rule={false}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              id={`${content.slug}-area`}
              label="Built-up / plinth area"
              suffix="sq ft"
              value={area}
              onChange={setArea}
              description={`Typical residential input for ${content.city}.`}
            />
            <NumberField
              id={`${content.slug}-rate`}
              label={content.rateLabel}
              prefix="₹"
              value={rate}
              onChange={setRate}
              description="Adjust this from your official category or ward."
            />
            <NumberField
              id={`${content.slug}-tax-rate`}
              label="Tax slab"
              suffix="%"
              value={taxRate}
              onChange={setTaxRate}
              description="Use the slab applicable to your usage/category."
            />
            <NumberField
              id={`${content.slug}-depreciation`}
              label="Age depreciation"
              suffix="%"
              value={depreciation}
              onChange={setDepreciation}
              description="Older buildings may receive depreciation."
            />
            <NumberField
              id={`${content.slug}-cess`}
              label="Cess / library charge"
              suffix="%"
              value={cess}
              onChange={setCess}
              description="Set to 0 if not applicable."
            />
            <NumberField
              id={`${content.slug}-rebate`}
              label="Rebate"
              suffix="%"
              value={rebate}
              onChange={setRebate}
              description="Early-payment or category rebate."
            />
          </FieldGroup>
        </ToolSection>

        <ToolSection number="02" label="Estimated annual tax">
          <div className="mb-6 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Estimated payable for {content.authority}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[var(--accent-teal)]">
              ₹{formatINR(result.payable)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Planning estimate for {content.city}; official portal may vary.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ResultRow
                label="Gross annual value"
                value={result.grossAnnualValue}
              />
              <ResultRow
                label="Taxable annual value"
                value={result.taxableAnnualValue}
              />
              <ResultRow label="Base tax" value={result.baseTax} />
              <ResultRow label="Cess / charge" value={result.cessAmount} />
              <ResultRow label="Rebate" value={-result.rebateAmount} />
              <ResultRow
                label="Estimated payable"
                value={result.payable}
                strong
              />
            </TableBody>
          </Table>
        </ToolSection>

        {content.guideLinks && content.guideLinks.length > 0 && (
          <ToolSection
            number="03"
            label="Related search guide"
            description="Use the guide page for identifiers, due-date intent, receipts, and official portal checks."
          >
            <div className="grid gap-3">
              {content.guideLinks.map((guide) => (
                <Link
                  key={guide.href}
                  to={guide.href}
                  className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/40"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">Guide</Badge>
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {guide.label}
                    </span>
                  </div>
                  <span className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {guide.description}
                  </span>
                </Link>
              ))}
            </div>
          </ToolSection>
        )}

        <ToolContext title={`How ${content.authority} property tax works`}>
          {content.context.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            Official source:{' '}
            {content.sourceUrls.map((source, index) => (
              <span key={source.url}>
                {index > 0 && ' · '}
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </span>
            ))}
          </p>
        </ToolContext>

        <ToolFaq items={content.faqs} />
      </div>
    </ToolPageShell>
  )
}

function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  description,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  prefix?: string
  suffix?: string
  description: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        {prefix && (
          <InputGroupAddon>
            <InputGroupText>{prefix}</InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupInput
          id={id}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && (
          <InputGroupAddon align="inline-end">
            <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
              {suffix}
            </InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      <FieldDescription>{description}</FieldDescription>
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
        className={`text-right tabular-nums ${strong ? 'font-bold text-[var(--accent-teal)]' : 'text-[var(--foreground)]'}`}
      >
        {value < 0 ? '-' : ''}₹{formatINR(Math.abs(value))}
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
