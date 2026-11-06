import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, CalendarCheck, Search, Sparkles } from 'lucide-react'
import { openSiteSearch } from '#/components/site-search'
import { Field, FieldLabel } from '#/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { BLOG_ARTICLES } from '#/data/blog-content'
import { CITY_CONTENT } from '#/data/city-construction-content'
import {
  HUB_PROGRAMMATIC_LABEL,
  SITE_HUBS,
  SITE_TOOLS,
  entriesForHub,
  hubPath,
  type HubId,
  type SiteEntry,
} from '#/data/site-map'
import { STATE_CONTENT } from '#/data/state-stamp-duty-content'
import { itemListLd } from '#/lib/seo'

const TITLE = 'Property and Home-Building Calculators for India'
const DESCRIPTION =
  'Free calculators for buying, building and owning a home in India: stamp duty by state, construction cost by city, materials, land units and property tax. Sources on every page.'

/**
 * Ordered by Search Console clicks, Aug 1 – Oct 31 2026, with state and city pages counted
 * towards their parent tool: construction cost 315, stamp duty 308, material 278, GHMC 112,
 * capital gains 55, plot converter 12. Re-rank from the weekly GSC review; don't hand-pick.
 */
const MOST_USED_PATHS = [
  '/construction-cost-calculator',
  '/stamp-duty-calculator',
  '/material-calculator',
  '/ghmc-property-tax-calculator',
  '/property-capital-gains-calculator',
  '/plot-converter',
] as const

const MOST_USED = MOST_USED_PATHS.map((path) => {
  const tool = SITE_TOOLS.find((t) => t.to === path)
  if (!tool) throw new Error(`Most-used tool missing from site map: ${path}`)
  return tool
})

const LATEST_GUIDES = [...BLOG_ARTICLES]
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
  .slice(0, 3)

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: `${TITLE} · Plotr Ai` },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:image', content: 'https://plotrai.in/og/landing.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/landing.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://plotrai.in' }],
    scripts: [
      itemListLd(
        'Free property and home-building calculators for India',
        SITE_TOOLS.map((t) => ({ name: t.title, description: t.description, path: t.to })),
      ),
    ],
  }),
})

function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <Hero />
      <GoalsSection />
      <MostUsedSection />
      <RatesSection />
      <GuidesSection />
      <TrustStrip />
    </main>
  )
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1.5">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {kicker}
      </p>
      <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[26px]">
        {title}
      </h2>
    </div>
  )
}

function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 pt-12 pb-12 text-center sm:pt-20 sm:pb-16">
      <h1 className="max-w-3xl text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--foreground)] sm:text-5xl">
        Property and home-building calculators{' '}
        for India
      </h1>
      <p className="text-base text-[var(--foreground)]/80 sm:text-lg">
        Free, with sources on every page.
      </p>
      <button
        type="button"
        onClick={openSiteSearch}
        className="frosted mt-2 flex h-14 w-full max-w-xl items-center gap-3 rounded-xl px-4 text-left text-base text-[var(--muted-foreground)] transition-colors hover:bg-[var(--brand-light)] focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:outline-none"
      >
        <Search className="size-5 shrink-0 text-[var(--muted-foreground)]" />
        <span className="min-w-0 flex-1 truncate">Try “punjab stamp duty” or “100 gaj”</span>
        <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[11px] sm:inline">
          Ctrl K
        </kbd>
      </button>
    </section>
  )
}

const PROGRAMMATIC_NOUN = { state: 'states', city: 'cities', unit: 'conversions' } as const

function hubCountLabel(id: HubId) {
  const tools = entriesForHub(id, 'tool').length
  const toolLabel = `${tools} ${tools === 1 ? 'tool' : 'tools'}`
  const quick = HUB_PROGRAMMATIC_LABEL[id]
  if (!quick || !(quick.kind in PROGRAMMATIC_NOUN)) return toolLabel
  const pages = entriesForHub(id, quick.kind).length
  return `${toolLabel} · ${pages} ${PROGRAMMATIC_NOUN[quick.kind as keyof typeof PROGRAMMATIC_NOUN]}`
}

function GoalsSection() {
  return (
    <section className="py-10 sm:py-14">
      <SectionHeading kicker="Start here" title="What are you doing?" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SITE_HUBS.map((hub) => {
          const Icon = hub.icon
          return (
            <li key={hub.id} className="last:col-span-2 sm:last:col-span-1">
              <Link
                to={hubPath(hub.id)}
                className="frosted group flex h-full flex-col gap-3 rounded-xl p-4 no-underline transition-colors hover:bg-[var(--brand-light)] sm:p-5"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-[var(--background)] text-[var(--foreground)]">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-base font-semibold text-[var(--foreground)]">
                    {hub.title}
                  </span>
                  <span className="text-sm leading-snug text-[var(--foreground)]/75">
                    {hub.description}
                  </span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {hubCountLabel(hub.id)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function MostUsedSection() {
  return (
    <section className="py-10 sm:py-14">
      <SectionHeading kicker="Most used" title="The calculators people use most" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOST_USED.map((tool) => (
          <li key={tool.to}>
            <ToolTile tool={tool} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function ToolTile({ tool }: { tool: SiteEntry }) {
  const Icon = tool.icon
  return (
    <Link
      to={tool.to}
      className="frosted group grid h-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl p-4 no-underline transition-colors hover:bg-[var(--brand-light)]"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-[var(--background)] text-[var(--foreground)]">
        {Icon && <Icon className="size-5" />}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-base font-semibold text-[var(--foreground)]">
          {tool.title}
        </span>
        <span className="text-sm leading-snug text-[var(--foreground)]/75">{tool.description}</span>
      </span>
      <ArrowRight className="size-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function RatesSection() {
  const navigate = useNavigate()
  return (
    <section className="py-10 sm:py-14">
      <SectionHeading kicker="Rates for your area" title="Jump straight to your state or city" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="home-state">Stamp duty in</FieldLabel>
          <Select onValueChange={(slug) => navigate({ to: `/stamp-duty/${slug}` })}>
            <SelectTrigger id="home-state" className="h-12 w-full bg-transparent text-base">
              <SelectValue placeholder="Choose your state" />
            </SelectTrigger>
            <SelectContent>
              {[...STATE_CONTENT]
                .sort((a, b) => a.displayName.localeCompare(b.displayName))
                .map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
                    {s.displayName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="home-city">Construction cost in</FieldLabel>
          <Select onValueChange={(slug) => navigate({ to: `/construction-cost/${slug}` })}>
            <SelectTrigger id="home-city" className="h-12 w-full bg-transparent text-base">
              <SelectValue placeholder="Choose your city" />
            </SelectTrigger>
            <SelectContent>
              {[...CITY_CONTENT]
                .sort((a, b) => a.city.localeCompare(b.city))
                .map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.city}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </section>
  )
}

function GuidesSection() {
  return (
    <section className="py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading kicker="Latest guides" title="New on Plotr Ai" />
        <Link
          to="/blog"
          className="mb-6 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--brand)] no-underline"
        >
          All guides
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <ul className="grid gap-3 md:grid-cols-3">
        {LATEST_GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: guide.slug }}
              className="frosted group flex h-full flex-col gap-2 rounded-xl p-5 no-underline transition-colors hover:bg-[var(--brand-light)]"
            >
              <span className="text-xs text-[var(--muted-foreground)]">
                {formatDate(guide.datePublished)}
              </span>
              <span className="text-base font-semibold leading-snug text-[var(--foreground)]">
                {guide.title}
              </span>
              <span className="line-clamp-3 text-sm leading-relaxed text-[var(--foreground)]/75">
                {guide.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: 'Sources on every page',
    text: 'Rates name the state notification, corporation or survey they come from.',
  },
  {
    icon: CalendarCheck,
    title: 'Dates shown',
    text: 'Each page says when its rates were last checked.',
  },
  {
    icon: Sparkles,
    title: 'Free, no signup',
    text: 'Open a calculator and start. Nothing to install.',
  },
] as const

function TrustStrip() {
  return (
    <section className="py-10 sm:py-12">
      <ul className="grid gap-6 sm:grid-cols-3">
        {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-[var(--foreground)]" />
            <span className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[var(--foreground)]">{title}</span>
              <span className="text-sm leading-relaxed text-[var(--foreground)]/75">{text}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs leading-relaxed text-[var(--muted-foreground)]">
        Estimates for planning. For legal documents and final payments, confirm with your
        sub-registrar, municipal corporation or a qualified professional.
      </p>
    </section>
  )
}
