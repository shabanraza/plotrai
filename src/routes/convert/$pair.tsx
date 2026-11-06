import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeftRight, ArrowRight, ExternalLink, Ruler } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { Field, FieldLabel } from '#/components/ui/field'
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
import {
  LAND_UNIT_PAGES,
  LAND_UNIT_PAGES_LAST_REVIEWED,
  LAND_UNIT_PAGE_BY_SLUG,
  buildUnitPageFaqs,
  convertForPage,
  formatArea,
  pageFactor,
  pageTitle,
  qualifiedUnit,
  variantUnit,
} from '#/data/land-unit-pages'
import { faqPageLd, softwareAppLd } from '#/lib/seo'

export const Route = createFileRoute('/convert/$pair')({
  component: UnitPairPage,
  loader: ({ params }) => {
    const page = LAND_UNIT_PAGE_BY_SLUG.get(params.pair)
    if (!page) throw notFound()
    return { page }
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page
    if (!page) return {}
    const name = pageTitle(page)
    const one = formatArea(pageFactor(page))
    const headline = page.commonValues.includes(100) ? 100 : page.commonValues[1] ?? 1
    const headlineValue = formatArea(convertForPage(page, headline))
    const path = `/convert/${page.slug}`
    const title = `${name} Converter — ${qualifiedUnit(page, headline)} = ${headlineValue} ${page.toShort} · Plotr Ai`
    const varies = page.variants ? ' Size varies by state — see the state-wise table.' : ''
    const description = `${qualifiedUnit(page, 1)} = ${one} ${page.toShort}. ${qualifiedUnit(page, headline)} = ${headlineValue} ${page.toShort}.${varies} Free ${page.fromShort} to ${page.toShort} converter with a ready table of common plot sizes.`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: `${name} Converter` },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `https://plotrai.in${path}` },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      links: [{ rel: 'canonical', href: `https://plotrai.in${path}` }],
      scripts: [
        softwareAppLd({
          name: `${name} Converter`,
          description,
          path,
        }),
        faqPageLd(buildUnitPageFaqs(page)),
      ],
    }
  },
})

function UnitPairPage() {
  const { page } = Route.useLoaderData()
  const [value, setValue] = useState('1')

  const name = pageTitle(page)
  const factor = pageFactor(page)
  const parsed = parseFloat(value)
  const result = Number.isFinite(parsed) && parsed >= 0 ? convertForPage(page, parsed) : 0
  const reverse = LAND_UNIT_PAGES.find((p) => p.from === page.to && p.to === page.from)
  const others = LAND_UNIT_PAGES.filter((p) => p.slug !== page.slug)
  const faqs = buildUnitPageFaqs(page)

  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: 'Plot area converter', href: '/plot-converter' },
        { label: name },
      ]}
      eyebrow={{ icon: Ruler, label: 'Land unit converter' }}
      title={name}
      tagline={page.intro}
      variant="single-column"
      footnote={`Reviewed ${LAND_UNIT_PAGES_LAST_REVIEWED}. ${page.basisNote} For registration and legal documents, use the area stated on your sale deed or land record.`}
    >
      <div className="flex flex-col gap-14">
        <ToolSection number="01" label="Quick answer" rule={false}>
          <div className="rounded-xl bg-[var(--muted)] p-5">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-[var(--brand)] sm:text-3xl">
              {qualifiedUnit(page, 1)} = {formatArea(factor)} {page.toShort}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Multiply {page.fromShort} by {formatArea(factor)} to get {page.toShort}.
              {page.variants &&
                ` ${capitalize(page.fromShort)} size varies by state — check the state table below.`}
            </p>
          </div>
        </ToolSection>

        <ToolSection number="02" label={`Convert ${page.fromShort} to ${page.toShort}`}>
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field>
              <FieldLabel htmlFor="amount">Area in {page.fromShort}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>{page.fromShort}</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <div className="flex flex-col gap-1 sm:items-end">
              <p className="text-sm text-[var(--muted-foreground)]">
                = {page.toShort}
              </p>
              <p className="text-3xl font-semibold leading-none tabular-nums tracking-tight text-[var(--foreground)]">
                {formatArea(result)}
              </p>
            </div>
          </div>
          {reverse && (
            <Link
              to="/convert/$pair"
              params={{ pair: reverse.slug }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              <ArrowLeftRight className="size-3.5" />
              Convert {reverse.fromShort} to {reverse.toShort}
            </Link>
          )}
        </ToolSection>

        <ToolSection
          number="03"
          label={`${page.fromShort} to ${page.toShort} table`}
          description="Common plot sizes, worked out."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{capitalize(page.fromShort)}</TableHead>
                <TableHead className="text-right">{capitalize(page.toShort)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {page.commonValues.map((v) => (
                <TableRow key={v}>
                  <TableCell className="font-medium tabular-nums">
                    {formatArea(v)} {page.fromShort}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatArea(convertForPage(page, v))} {page.toShort}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ToolSection>

        {page.variants && (
          <ToolSection
            number="04"
            label={`${capitalize(variantUnit(page))} size by state`}
            description="Commonly cited values. Confirm the size on your khatauni, jamabandi or sale deed."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Sq ft</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {page.variants.map((v) => (
                  <TableRow key={v.region}>
                    <TableCell className="whitespace-normal">
                      <p className="font-medium">{v.region}</p>
                      {v.note && (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{v.note}</p>
                      )}
                      <a
                        href={v.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-[var(--brand)] hover:underline sm:hidden"
                      >
                        {v.source.label}
                        <ExternalLink className="size-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {v.sqft.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="hidden text-right sm:table-cell">
                      <a
                        href={v.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--brand)] hover:underline"
                      >
                        {v.source.label}
                        <ExternalLink className="size-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ToolSection>
        )}

        <ToolContext title={`How ${page.fromShort} to ${page.toShort} works`}>
          <p>{page.intro}</p>
          <p>{page.basisNote}</p>
        </ToolContext>

        <ToolFaq items={faqs} />

        <ToolSection number="MORE" label="Other land unit conversions">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/convert/$pair"
                params={{ pair: p.slug }}
                className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--brand-light)]"
              >
                {pageTitle(p)}
                <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
              </Link>
            ))}
            <Link
              to="/plot-converter"
              className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--brand-light)]"
            >
              All units converter
              <ArrowRight className="size-3.5 text-[var(--muted-foreground)]" />
            </Link>
          </div>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}

function capitalize(s: string) {
  return s.replace(/^\w/, (c) => c.toUpperCase())
}
