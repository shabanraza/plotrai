import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Hammer, ArrowRight } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { RelatedToolsSection } from '#/components/tools/related-tools-section'
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
  buildCityFaqs,
  buildCityMeta,
  buildSizeCostRows,
  cityContextParagraphs,
  formatShortDate,
  getCityRates,
  getRelatedCities,
} from '#/data/city-construction-content'
import {
  TIER_LABELS,
  STAGES,
  CONSTRUCTION_LAST_UPDATED,
  GROUND_ONLY_PERCENT,
  getRateSource,
  type FinishTier,
} from '#/data/construction-cost-rates'
import { cityRelatedTools } from '#/data/related-tools'
import { getArticleLinkItem } from '#/data/blog-content'
import { softwareAppLd, faqPageLd, webPageLd } from '#/lib/seo'

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
    const { title, ogTitle, description } = buildCityMeta(content)
    const path = `/construction-cost/${content.slug}`
    const ogImage = `https://plotrai.in/og/construction-cost-${content.slug}.png`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: description },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: `https://plotrai.in${path}` },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: ogTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: `https://plotrai.in${path}` }],
      scripts: [
        webPageLd({
          name: ogTitle,
          description,
          path,
          dateModified: CONSTRUCTION_LAST_UPDATED,
        }),
        softwareAppLd({
          name: `${content.city} House Construction Cost Calculator`,
          description: `Per-sq-ft house construction cost in ${content.city} across basic, standard, premium, and luxury finish tiers.`,
          path,
          category: 'FinanceApplication',
        }),
        faqPageLd(faqs),
      ],
    }
  },
})

const lakhs = (n: number) => `₹${(n / 100000).toFixed(1)} L`

function CityConstructionPage() {
  const { content } = Route.useLoaderData()
  const r = getCityRates(content.city)
  if (!r) return null

  const faqs = buildCityFaqs(content)
  const meta = buildCityMeta(content)
  const source = getRateSource(content.city)
  const otherCities = getRelatedCities(content.slug)
  const tiers: ReadonlyArray<FinishTier> = ['basic', 'standard', 'premium', 'luxury']
  const sizeTiers: ReadonlyArray<FinishTier> = ['basic', 'standard', 'premium']
  const sizeRows = buildSizeCostRows(r)
  const updated = formatShortDate(CONSTRUCTION_LAST_UPDATED)

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Construction cost', href: '/construction-cost-calculator' },
        { label: content.city },
      ]}
      eyebrow={{ icon: Hammer, label: `Construction cost · ${content.city}` }}
      title={meta.h1}
      tagline={`${content.city} house construction cost 2026: per sq ft rates for ${content.city}, ${content.state}, across all finish tiers, with budgets by house size and a stage-wise breakdown.`}
      variant="single-column"
      footnote={
        <>
          Source:{' '}
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand)] hover:underline"
            >
              {source.label}
            </a>
          ) : (
            source.label
          )}{' '}
          (rates as of{' '}
          {source.published ? formatShortDate(source.asOf) : `${source.asOf}, not re-checked`}).{' '}
          {source.note ? `${source.note} ` : ''}Last updated {updated}. Excludes land cost,
          government approvals, and contractor margin. For binding quotes, get site-specific
          estimates from local contractors.
        </>
      }
    >
      <div className="flex flex-col gap-14">
        <ToolSection label="Per sq ft rates">
          <div className="overflow-x-auto">
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

        <ToolSection
          label="Cost by house size"
          description={`Total construction cost in ${content.city}. Single-floor rows use the built-up area shown. G+1 rows use the area per floor, so total built-up area is twice that.`}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>House size</TableHead>
                  {sizeTiers.map((tier) => (
                    <TableHead key={tier} className="text-right">
                      {TIER_LABELS[tier].label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeRows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    {sizeTiers.map((tier) => (
                      <TableCell key={tier} className="text-right tabular-nums">
                        {lakhs(row.costs[tier])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="max-w-[68ch] text-sm leading-relaxed text-[var(--foreground)]/75">
            Single-floor totals are area × the per sq ft rate above. For G+1, the ground floor is
            priced at the full rate and the upper floor at {100 - GROUND_ONLY_PERCENT}% of it,
            because site preparation and foundation ({GROUND_ONLY_PERCENT}% of a single-storey
            build) are paid once. This is a planning estimate: the foundation must still be built
            for the final number of floors from day one.
          </p>
        </ToolSection>

        <ToolSection
          label="Stage-wise breakdown"
          description={`Where each rupee goes in a typical ${content.city} construction.`}
        >
          <div className="overflow-x-auto">
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

        <ToolSection label="Run a custom calculation">
          <div className="flex flex-col gap-4 rounded-xl bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
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

        <RelatedToolsSection paths={cityRelatedTools(content.slug)} />

        <ToolContext title={`Building a house in ${content.city} — what to know`}>
          {cityContextParagraphs(content).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>
            Construction costs in {content.city} are benchmarked in rupees per square foot of
            built-up area. The figures above include civil structure, basic electrical and
            plumbing, doors and windows, basic flooring, and labour. They exclude land cost,
            government approvals, modular kitchen, AC, and premium interior fitments, so budget
            extra for a complete handover.
          </p>
          <p>
            {source.published && source.url ? (
              <>
                {content.city} rates are the{' '}
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  InfraLens published rates
                </a>{' '}
                (updated {formatShortDate(source.asOf)}), shown as published.{' '}
                {source.note ?? ''}
              </>
            ) : (
              <>
                {content.city} rates come from our own benchmark table ({source.label}),
                reviewed {source.asOf}. We have no dated public source for this city, so treat
                it as a starting point and compare it with local quotes.
              </>
            )}
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

        <ToolSection label="Construction cost in other cities">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to="/construction-cost/$city"
                params={{ city: c.slug }}
                className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--brand-light)]"
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
