import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Calculator, ExternalLink, ArrowRight } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Badge } from '#/components/ui/badge'
import {
  STATE_BY_SLUG,
  STATE_CONTENT,
  getStateEntry,
  buildStateFaqs,
} from '#/data/state-stamp-duty-content'
import { STAMP_DUTY_LAST_UPDATED } from '#/data/stamp-duty-rates'
import { softwareAppLd, faqPageLd } from '#/lib/seo'

export const Route = createFileRoute('/stamp-duty/$state')({
  component: StateStampDutyPage,
  loader: ({ params }) => {
    const content = STATE_BY_SLUG.get(params.state)
    if (!content) throw notFound()
    return { content }
  },
  head: ({ loaderData }) => {
    const content = loaderData?.content
    if (!content) return {}
    const entry = getStateEntry(content.state)
    if (!entry) return {}
    const faqs = buildStateFaqs(content)
    const r = entry.default

    const title = `${content.displayName} Stamp Duty Calculator 2026 — ${r.male}% Male / ${r.female}% Female · Plotr Ai`
    const description = `${content.displayName} stamp duty rates 2026: ${r.male}% for male buyers, ${r.female}% for female buyers, ${r.registration}% registration. Free calculator with city-wise breakdown for ${content.displayName}.`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: `${content.displayName} Stamp Duty Calculator 2026` },
        { property: 'og:description', content: description },
      ],
      links: [
        {
          rel: 'canonical',
          href: `https://plotrai.in/stamp-duty/${content.slug}`,
        },
      ],
      scripts: [
        softwareAppLd({
          name: `${content.displayName} Stamp Duty Calculator`,
          description: `Free stamp duty + registration calculator for ${content.displayName} with male, female, and joint buyer rates.`,
          path: `/stamp-duty/${content.slug}`,
          category: 'FinanceApplication',
        }),
        faqPageLd(faqs),
      ],
    }
  },
})

function StateStampDutyPage() {
  const { content } = Route.useLoaderData()
  const entry = getStateEntry(content.state)
  if (!entry) return null

  const r = entry.default
  const faqs = buildStateFaqs(content)
  const womenSavings = r.male - r.female

  // Other states for cross-linking — show 6 alphabetically nearest
  const otherStates = STATE_CONTENT.filter((s) => s.slug !== content.slug).slice(0, 8)

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Stamp Duty', href: '/stamp-duty-calculator' },
        { label: content.displayName },
      ]}
      eyebrow={{ icon: Calculator, label: `Stamp Duty · ${content.displayName}` }}
      title={`${content.displayName} Stamp Duty Calculator 2026`}
      tagline={`Stamp duty + registration rates for ${content.displayName}, with male, female, and joint buyer breakdowns. Updated ${STAMP_DUTY_LAST_UPDATED}.`}
      variant="single-column"
      footnote={`Rates last refreshed ${STAMP_DUTY_LAST_UPDATED} from ${content.igrPortal?.label ?? 'state IGR portal'}. Always cross-check with the local sub-registrar office before legal documents.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Rates at a glance" rule={false}>
          <div className="rounded-md border border-[var(--border)] bg-[var(--background)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer category</TableHead>
                  <TableHead className="text-right">Stamp duty</TableHead>
                  <TableHead className="text-right">Registration</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Male / individual</TableCell>
                  <TableCell className="text-right tabular-nums">{r.male}%</TableCell>
                  <TableCell className="text-right tabular-nums">{r.registration}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {(r.male + r.registration).toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Female{' '}
                    {womenSavings > 0 && (
                      <Badge variant="secondary" className="ml-2 font-mono text-[10px]">
                        −{womenSavings.toFixed(2)}%
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.female}%</TableCell>
                  <TableCell className="text-right tabular-nums">{r.registration}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-[var(--accent-teal)]">
                    {(r.female + r.registration).toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Joint (male + female)</TableCell>
                  <TableCell className="text-right tabular-nums">{r.joint}%</TableCell>
                  <TableCell className="text-right tabular-nums">{r.registration}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {(r.joint + r.registration).toFixed(2)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          {r.note && (
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              <span className="font-medium text-[var(--foreground)]">Note: </span>
              {r.note}
            </p>
          )}
        </ToolSection>

        {entry.cities && entry.cities.length > 0 && (
          <ToolSection number="02" label="City-wise breakdown">
            <div className="rounded-md border border-[var(--border)] bg-[var(--background)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Male</TableHead>
                    <TableHead className="text-right">Female</TableHead>
                    <TableHead className="text-right">Registration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.cities.map((c) => (
                    <TableRow key={c.city}>
                      <TableCell className="font-medium">{c.city}</TableCell>
                      <TableCell className="text-right tabular-nums">{c.rates.male}%</TableCell>
                      <TableCell className="text-right tabular-nums">{c.rates.female}%</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {c.rates.registration}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ToolSection>
        )}

        <ToolSection number="03" label="Run a custom calculation">
          <div className="flex flex-col gap-4 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[var(--foreground)]">
                Calculate stamp duty for your exact property value
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Use the full calculator to enter your agreement value and get exact rupee figures
                for {content.displayName}.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/stamp-duty-calculator">
                Open calculator
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </ToolSection>

        <ToolContext title={`How stamp duty works in ${content.displayName}`}>
          {content.extraContext?.map((p: string, i: number) => <p key={i}>{p}</p>)}
          <p>
            Stamp duty in {content.displayName} is calculated on the higher of (a) the agreement
            value declared in the sale deed, or (b) the state ready-reckoner / circle rate for that
            locality. Whichever is higher becomes the taxable base.{' '}
            {content.igrPortal && (
              <>
                For the official rate sheet and online e-stamp generation, visit the{' '}
                <a
                  href={content.igrPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent-teal)] hover:underline"
                >
                  {content.igrPortal.label}
                  <ExternalLink className="size-3" />
                </a>{' '}
                portal.
              </>
            )}
          </p>
        </ToolContext>

        <ToolFaq items={faqs} />

        <ToolSection number="MORE" label="Stamp duty in other states">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {otherStates.map((s) => (
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
      </div>
    </ToolPageShell>
  )
}
