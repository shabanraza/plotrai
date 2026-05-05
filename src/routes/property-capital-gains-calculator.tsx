import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { TrendingUp, CheckCircle } from 'lucide-react'
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
import { CII, FY_LIST } from '#/data/cii'

export const Route = createFileRoute('/property-capital-gains-calculator')({
  component: CapitalGainsCalculatorPage,
  head: () => ({
    meta: [
      {
        title: 'Property Capital Gains Calculator India 2026 — LTCG / Indexation · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Free LTCG / capital gains calculator for property in India. Computes both post-Jul-2024 regimes (12.5% without indexation vs 20% with indexation) and recommends the lower tax. Section 54 / 54F / 54EC reference.',
      },
      {
        property: 'og:title',
        content: 'Property Capital Gains Calculator (post-Jul-2024 dual regime)',
      },
      {
        property: 'og:description',
        content:
          'Long-term capital gains tax on Indian property — both regimes computed in plain English.',
      },
    ],
  }),
})

const SLAB_RATE_DEFAULT = 30 // %

function CapitalGainsCalculatorPage() {
  const [purchaseFy, setPurchaseFy] = useState<string>('2018-19')
  const [purchasePriceLakh, setPurchasePriceLakh] = useState<string>('40')
  const [saleFy, setSaleFy] = useState<string>('2025-26')
  const [salePriceLakh, setSalePriceLakh] = useState<string>('100')
  const [slabRate, setSlabRate] = useState<string>(String(SLAB_RATE_DEFAULT))

  const purchasePrice = (parseFloat(purchasePriceLakh) || 0) * 100000
  const salePrice = (parseFloat(salePriceLakh) || 0) * 100000

  const result = useMemo(() => {
    const purchaseCII = CII[purchaseFy] ?? 100
    const saleCII = CII[saleFy] ?? purchaseCII
    const purchaseYearStart = parseInt(purchaseFy.split('-')[0]!, 10)
    const saleYearStart = parseInt(saleFy.split('-')[0]!, 10)
    const holdingYears = saleYearStart - purchaseYearStart
    const isLongTerm = holdingYears >= 2

    // Old regime eligibility — properties acquired before FY 2024-25 mid-year (Jul 2024)
    // Simplified: if purchase FY is ≤ 2023-24 the old regime is fully available.
    const oldRegimeAvailable = purchaseYearStart < 2024

    const indexedCost = purchasePrice * (saleCII / purchaseCII)
    const indexedGain = Math.max(salePrice - indexedCost, 0)
    const flatGain = Math.max(salePrice - purchasePrice, 0)

    // Long-term taxes
    const ltcgIndexed = oldRegimeAvailable ? indexedGain * 0.2 : null
    const ltcgFlat = flatGain * 0.125

    // Short-term tax (slab rate)
    const stcgRate = (parseFloat(slabRate) || 0) / 100
    const stcg = flatGain * stcgRate

    let recommended: 'flat' | 'indexed' | 'short' = 'flat'
    let recommendedTax = ltcgFlat
    if (!isLongTerm) {
      recommended = 'short'
      recommendedTax = stcg
    } else if (oldRegimeAvailable && ltcgIndexed !== null && ltcgIndexed < ltcgFlat) {
      recommended = 'indexed'
      recommendedTax = ltcgIndexed
    }

    return {
      purchaseCII,
      saleCII,
      holdingYears,
      isLongTerm,
      oldRegimeAvailable,
      indexedCost,
      indexedGain,
      flatGain,
      ltcgIndexed,
      ltcgFlat,
      stcg,
      stcgRate,
      recommended,
      recommendedTax,
    }
  }, [purchaseFy, saleFy, purchasePrice, salePrice, slabRate])

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Capital Gains Calculator' },
      ]}
      eyebrow={{ icon: TrendingUp, label: 'Calculator · Live' }}
      title="Property Capital Gains Calculator"
      tagline="Computes both post-Jul-2024 regimes — 12.5% without indexation vs 20% with indexation — and tells you which one wins. Plus Section 54 / 54F / 54EC shortcuts."
      variant="single-column"
      footnote="The dual regime applies only to properties acquired before 2024-07-23. For properties acquired on/after that date, the new 12.5% no-indexation rate is mandatory. CII for 2025-26 is estimated and will be notified by CBDT. For final filing, consult a CA — this is a planning tool."
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Purchase details" rule={false}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="purchase-fy">Purchase financial year</Label>
              <Select value={purchaseFy} onValueChange={setPurchaseFy}>
                <SelectTrigger id="purchase-fy" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>FY</SelectLabel>
                    {FY_LIST.map((fy) => (
                      <SelectItem key={fy} value={fy}>
                        FY {fy} (CII {CII[fy]})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="purchase-price">Purchase price</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="purchase-price"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={purchasePriceLakh}
                  onChange={(e) => setPurchasePriceLakh(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    Lakh
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-[var(--muted-foreground)]">
                = ₹{formatINR(purchasePrice)}
              </p>
            </div>
          </div>
        </ToolSection>

        <ToolSection number="02" label="Sale details">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sale-fy">Sale financial year</Label>
              <Select value={saleFy} onValueChange={setSaleFy}>
                <SelectTrigger id="sale-fy" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>FY</SelectLabel>
                    {FY_LIST.map((fy) => (
                      <SelectItem key={fy} value={fy}>
                        FY {fy} (CII {CII[fy]})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sale-price">Sale price</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>₹</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="sale-price"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={salePriceLakh}
                  onChange={(e) => setSalePriceLakh(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    Lakh
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-[var(--muted-foreground)]">
                = ₹{formatINR(salePrice)}
              </p>
            </div>
          </div>
        </ToolSection>

        {!result.isLongTerm && (
          <ToolSection number="03" label="Slab rate (short-term)" description="Held under 2 years — gain is added to income and taxed at your slab rate.">
            <div className="flex flex-col gap-2 sm:max-w-xs">
              <Label htmlFor="slab">Your income tax slab</Label>
              <Select value={slabRate} onValueChange={setSlabRate}>
                <SelectTrigger id="slab" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="5">5% slab</SelectItem>
                    <SelectItem value="10">10% slab</SelectItem>
                    <SelectItem value="20">20% slab</SelectItem>
                    <SelectItem value="30">30% slab (highest)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </ToolSection>
        )}

        <ToolSection
          number={result.isLongTerm ? '03' : '04'}
          label="Tax breakdown"
          description={
            result.isLongTerm
              ? `Held for ~${result.holdingYears} years (long-term). ${result.oldRegimeAvailable ? 'Both regimes available — pick the lower tax.' : 'Acquired after Jul 2024 — only the new 12.5% regime applies.'}`
              : `Held for ~${result.holdingYears} year${result.holdingYears === 1 ? '' : 's'} (short-term). Taxed at slab rate.`
          }
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {result.isLongTerm ? (
              <>
                <RegimeBlock
                  label="New regime · 12.5% no indexation"
                  highlight={result.recommended === 'flat'}
                  rows={[
                    { k: 'Sale price', v: `₹${formatINR(salePrice)}` },
                    { k: 'Purchase price', v: `₹${formatINR(purchasePrice)}` },
                    { k: 'Gain', v: `₹${formatINR(result.flatGain)}` },
                    { k: 'Tax (12.5%)', v: `₹${formatINR(result.ltcgFlat)}`, em: true },
                  ]}
                />
                <RegimeBlock
                  label="Old regime · 20% with indexation"
                  highlight={result.recommended === 'indexed'}
                  disabled={!result.oldRegimeAvailable}
                  disabledNote="Property acquired after Jul 2024 — old regime not available."
                  rows={[
                    { k: 'Sale price', v: `₹${formatINR(salePrice)}` },
                    {
                      k: `Indexed cost (CII ${result.saleCII}/${result.purchaseCII})`,
                      v: `₹${formatINR(result.indexedCost)}`,
                    },
                    { k: 'Indexed gain', v: `₹${formatINR(result.indexedGain)}` },
                    {
                      k: 'Tax (20%)',
                      v: result.ltcgIndexed === null ? '—' : `₹${formatINR(result.ltcgIndexed)}`,
                      em: true,
                    },
                  ]}
                />
              </>
            ) : (
              <RegimeBlock
                label={`Short-term · ${result.stcgRate * 100}% slab rate`}
                highlight
                rows={[
                  { k: 'Sale price', v: `₹${formatINR(salePrice)}` },
                  { k: 'Purchase price', v: `₹${formatINR(purchasePrice)}` },
                  { k: 'Gain', v: `₹${formatINR(result.flatGain)}` },
                  { k: 'Tax', v: `₹${formatINR(result.stcg)}`, em: true },
                ]}
              />
            )}
          </div>

          <div className="mt-6 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 shrink-0 text-[var(--accent-teal)]" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-teal)]">
                  Recommended
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                  {result.recommended === 'flat' && 'New regime — 12.5% on flat gain'}
                  {result.recommended === 'indexed' && 'Old regime — 20% on indexed gain'}
                  {result.recommended === 'short' && `Slab rate — ${result.stcgRate * 100}% on flat gain`}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-[var(--accent-teal)]">
                  Tax payable: ₹{formatINR(result.recommendedTax)}
                </p>
              </div>
            </div>
          </div>
        </ToolSection>

        <ToolSection
          number={result.isLongTerm ? '04' : '05'}
          label="Reduce or eliminate the tax"
          description="Long-term gains can be partially or fully exempted under these sections."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <ExemptionCard
              section="Section 54"
              detail="Reinvest LTCG in another residential property within 1 year before / 2–3 years after sale. Full exemption (cap ₹10 cr)."
            />
            <ExemptionCard
              section="Section 54F"
              detail="Sell any other long-term capital asset, invest entire net consideration in residential property. Pro-rata exemption."
            />
            <ExemptionCard
              section="Section 54EC"
              detail="Invest LTCG in NHAI/REC capital-gain bonds within 6 months. Max ₹50 lakh, 5-year lockin. Reduces tax dollar-for-dollar."
            />
          </div>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}

interface RegimeBlockProps {
  label: string
  highlight?: boolean
  disabled?: boolean
  disabledNote?: string
  rows: ReadonlyArray<{ k: string; v: string; em?: boolean }>
}

function RegimeBlock({ label, highlight, disabled, disabledNote, rows }: RegimeBlockProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-md border p-5 ${
        disabled
          ? 'border-[var(--border)] bg-[var(--muted)]/40 opacity-60'
          : highlight
            ? 'border-[var(--accent-teal)] bg-[var(--accent-teal-light)]/40'
            : 'border-[var(--border)] bg-[var(--background)]'
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </p>
      {disabled && disabledNote && (
        <p className="text-xs text-[var(--muted-foreground)]">{disabledNote}</p>
      )}
      <ul className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <li
            key={r.k}
            className={`flex items-baseline justify-between gap-3 ${r.em ? 'mt-2 border-t border-[var(--border)] pt-2 font-semibold' : ''}`}
          >
            <span className="text-sm text-[var(--muted-foreground)]">{r.k}</span>
            <span
              className={`tabular-nums ${r.em ? 'text-base text-[var(--accent-teal)]' : 'text-sm text-[var(--foreground)]'}`}
            >
              {r.v}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ExemptionCard({ section, detail }: { section: string; detail: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-[var(--border)] p-4">
      <p className="font-semibold text-[var(--foreground)]">{section}</p>
      <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{detail}</p>
    </div>
  )
}

function formatINR(n: number) {
  if (!Number.isFinite(n) || n === 0) return '0'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
