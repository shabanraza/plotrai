import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Hammer, ArrowRight } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { RelatedGuidesSection } from '#/components/blog/related-guides-section'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  CITY_BY_SLUG,
  CITY_CONTENT,
  getCityRates,
  buildCityFaqs,
} from '#/data/city-construction-content'
import {
  TIER_LABELS,
  STAGES,
  CONSTRUCTION_LAST_UPDATED,
  type FinishTier,
} from '#/data/construction-cost-rates'
import { getArticleLinkItem } from '#/data/blog-content'
import { softwareAppLd, faqPageLd } from '#/lib/seo'

export const Route = createFileRoute('/construction-cost/$city')({
  component: CityConstructionPage,
  loader: ({ params }) => {
    const content = CITY_BY_SLUG.get(params.city)
    if (!content) throw notFound()
    return { content }
  },
  head: ({ loaderData }) => {
    const content = loaderData?.content
    if (!content) return {}
    const r = getCityRates(content.city)
    if (!r) return {}
    const faqs = buildCityFaqs(content)

    const title = `${content.city} House Construction Cost 2026 — ₹${r.standard.toLocaleString('en-IN')}/sq ft · Plotr Ai`
    const description = `${content.city} house construction cost 2026: ₹${r.basic}/sq ft basic, ₹${r.standard}/sq ft standard, ₹${r.premium}/sq ft premium, ₹${r.luxury}/sq ft luxury. With 1000/1500/2000 sq ft sample budgets.`

    const ogImage = `https://plotrai.in/og/construction-cost-${content.slug}.png`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: `${content.city} House Construction Cost 2026` },
        { property: 'og:description', content: description },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: `https://plotrai.in/construction-cost/${content.slug}` },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [
        {
          rel: 'canonical',
          href: `https://plotrai.in/construction-cost/${content.slug}`,
        },
      ],
      scripts: [
        softwareAppLd({
          name: `${content.city} House Construction Cost Calculator`,
          description: `Per-sq-ft house construction cost in ${content.city} across basic, standard, premium, and luxury finish tiers.`,
          path: `/construction-cost/${content.slug}`,
          category: 'FinanceApplication',
        }),
        faqPageLd(faqs),
      ],
    }
  },
})

function CityConstructionPage() {
  const { content } = Route.useLoaderData()
  const r = getCityRates(content.city)
  if (!r) return null

  const faqs = buildCityFaqs(content)
  const otherCities = CITY_CONTENT.filter((c) => c.slug !== content.slug).slice(0, 8)
  const tiers: ReadonlyArray<FinishTier> = ['basic', 'standard', 'premium', 'luxury']

  const sampleSqft = [1000, 1500, 2000, 2500] as const

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Construction Cost', href: '/construction-cost-calculator' },
        { label: content.city },
      ]}
      eyebrow={{ icon: Hammer, label: `Construction Cost · ${content.city}` }}
      title={`${content.city} House Construction Cost 2026`}
      tagline={`House construction cost per sq ft in ${content.city}, ${content.state}, across all finish tiers — with sample budgets and stage-wise breakdown.`}
      variant="single-column"
      footnote={`Rates last refreshed ${CONSTRUCTION_LAST_UPDATED}. Excludes land cost, government approvals, and contractor margin (typically 10-15%). For binding quotes, get site-specific estimates from local contractors.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Per sq ft rates" rule={false}>
          <div className="rounded-md border border-[var(--border)] bg-[var(--background)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finish tier</TableHead>
                  <TableHead className="text-right">₹ / sq ft</TableHead>
                  <TableHead className="hidden sm:table-cell">Includes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier}>
                    <TableCell className="font-medium">{TIER_LABELS[tier].label}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      ₹{r[tier].toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-[var(--muted-foreground)]">
                      {TIER_LABELS[tier].helper}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ToolSection>

        <ToolSection number="02" label="Sample budgets" description="Total cost for typical house sizes at standard finish.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sampleSqft.map((sqft) => {
              const cost = r.standard * sqft
              return (
                <div
                  key={sqft}
                  className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3.5"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {sqft.toLocaleString('en-IN')} sq ft
                  </p>
                  <p className="text-lg font-bold tabular-nums text-[var(--foreground)] sm:text-xl">
                    ₹{(cost / 100000).toFixed(1)} L
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Standard finish
                  </p>
                </div>
              )
            })}
          </div>
        </ToolSection>

        <ToolSection number="03" label="Stage-wise breakdown" description={`Where each rupee goes in a typical ${content.city} construction.`}>
          <div className="rounded-md border border-[var(--border)] bg-[var(--background)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">% of total</TableHead>
                  <TableHead className="hidden md:table-cell">Includes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STAGES.map((s) => (
                  <TableRow key={s.key}>
                    <TableCell className="font-medium">{s.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{s.percent}%</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-[var(--muted-foreground)]">
                      {s.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ToolSection>

        <ToolSection number="04" label="Run a custom calculation">
          <div className="flex flex-col gap-4 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[var(--foreground)]">
                Calculate cost for your exact build
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Use the full calculator to enter your sq ft, floors, and finish tier and get a
                stage-wise breakdown for {content.city}.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/construction-cost-calculator">
                Open calculator
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </ToolSection>

        <ToolContext title={`Building a house in ${content.city} — what to know`}>
          {content.extraContext?.map((p: string, i: number) => <p key={i}>{p}</p>)}
          <p>
            Construction costs in {content.city} are benchmarked in rupees per square foot of
            built-up area. The figures above include civil structure, basic electrical and
            plumbing, doors and windows, basic flooring, and labour. They exclude land cost,
            government approvals, modular kitchen, AC, and premium interior fitments — budget an
            additional 15-25% over the construction cost for a complete handover.
          </p>
        </ToolContext>

        <RelatedGuidesSection
          items={([
            'steel-price-house-construction',
            'cement-vs-rmc',
            'modular-kitchen-cost-india',
          ] as const).map(getArticleLinkItem)}
          description={`Continue with the material and finishing guides that shape real ${content.city} build budgets.`}
        />

        <ToolFaq items={faqs} />

        <ToolSection number="MORE" label="Construction cost in other cities">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to="/construction-cost/$city"
                params={{ city: c.slug }}
                className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/40"
              >
                {c.city}
                <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
              </Link>
            ))}
          </div>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}
