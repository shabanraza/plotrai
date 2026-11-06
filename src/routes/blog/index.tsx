import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { BLOG_ARTICLES, type BlogArticle } from '#/data/blog-content'
import { CLUSTER_HUB, SITE_HUBS, SITE_HUB_BY_ID, hubPath, type HubId } from '#/data/site-map'
import { canonicalLink } from '#/lib/seo'

export const Route = createFileRoute('/blog/')({
  component: GuidesIndexPage,
  head: () => ({
    meta: [
      { title: 'Plotr Ai Blog — Practical Guides for Indian Homeowners' },
      {
        name: 'description',
        content:
          'Browse Plotr Ai guides on property buying, house design, floor plans, materials, and construction cost for Indian homeowners.',
      },
      {
        property: 'og:title',
        content: 'Plotr Ai Blog — Practical Guides for Indian Homeowners',
      },
      {
        property: 'og:description',
        content:
          'Checklists, explainers, and planning guides for Indian property buyers and home builders.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/landing.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/blog' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/landing.png' },
    ],
    links: [canonicalLink('/blog')],
  }),
})

/** Newest first; ties keep the data file's order. */
const GUIDES = [...BLOG_ARTICLES].sort((a, b) => b.datePublished.localeCompare(a.datePublished))

/** Only hubs that actually have guides get a filter. */
const TOPICS = SITE_HUBS.filter((hub) => GUIDES.some((a) => CLUSTER_HUB[a.cluster] === hub.id))

function topicOf(article: BlogArticle) {
  return SITE_HUB_BY_ID.get(CLUSTER_HUB[article.cluster])?.title ?? ''
}

function GuidesIndexPage() {
  const [topic, setTopic] = useState<'all' | HubId>('all')
  const visible =
    topic === 'all' ? GUIDES : GUIDES.filter((a) => CLUSTER_HUB[a.cluster] === topic)
  // The featured layout only makes sense for the unfiltered list
  const [featured, ...rest] = visible
  const showFeatured = topic === 'all' && featured
  const beside = showFeatured ? rest.slice(0, 3) : []
  const grid = showFeatured ? rest.slice(3) : visible

  return (
    <main className="mx-auto w-full max-w-[1120px] px-4 pt-8 pb-16 sm:px-6 sm:pt-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Guides</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex max-w-[62ch] flex-col gap-4">
        <h1 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-[2.5rem]">
          Guides
        </h1>
        <p className="text-base leading-7 text-[var(--foreground)]/80 sm:text-lg sm:leading-8">
          Plain answers on buying, building and designing a home in India, with sources and
          the matching calculator for each one.
        </p>
      </header>

      <ToggleGroup
        type="single"
        value={topic}
        onValueChange={(v) => v && setTopic(v as 'all' | HubId)}
        variant="outline"
        aria-label="Filter guides by topic"
        className="mt-8 flex w-full flex-wrap justify-start"
      >
        <ToggleGroupItem value="all" className="min-h-10 px-4">
          All
        </ToggleGroupItem>
        {TOPICS.map((hub) => (
          <ToggleGroupItem key={hub.id} value={hub.id} className="min-h-10 px-4">
            {hub.title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {showFeatured && (
        <section
          aria-label="Latest guides"
          className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12"
        >
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group flex min-h-[240px] flex-col justify-end gap-3 rounded-2xl bg-[var(--muted)] p-6 no-underline transition-colors hover:bg-[var(--accent-teal-light)] sm:p-8"
          >
            <GuideMeta article={featured} accent />
            <h2 className="text-balance text-[1.5rem] leading-snug font-semibold text-[var(--foreground)] sm:text-[1.75rem]">
              {featured.title}
            </h2>
            <p className="max-w-[56ch] text-base leading-relaxed text-[var(--foreground)]/80">
              {featured.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-teal)]">
              Read the guide
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <div className="flex flex-col gap-7">
            {beside.map((article) => (
              <GuideTile key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      <section aria-label={showFeatured ? 'More guides' : 'Guides'} className="mt-14">
        {showFeatured && (
          <h2 className="mb-6 text-lg font-semibold text-[var(--foreground)]">More guides</h2>
        )}
        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((article) => (
            <GuideTile key={article.slug} article={article} showDescription />
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Looking for a calculator?
        </h2>
        <div className="flex flex-wrap gap-2">
          {SITE_HUBS.map((hub) => (
            <Link
              key={hub.id}
              to={hubPath(hub.id)}
              className="inline-flex min-h-10 items-center rounded-full bg-[var(--muted)] px-4 text-sm font-medium text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--accent-teal-light)] hover:text-[var(--accent-teal)]"
            >
              {hub.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function GuideMeta({ article, accent = false }: { article: BlogArticle; accent?: boolean }) {
  return (
    <p
      className={
        accent
          ? 'text-sm font-medium text-[var(--accent-teal)]'
          : 'text-sm text-[var(--foreground)]/65'
      }
    >
      {topicOf(article)} · {article.readingTime}
    </p>
  )
}

function GuideTile({
  article,
  showDescription = false,
}: {
  article: BlogArticle
  showDescription?: boolean
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col gap-1.5 no-underline"
    >
      <GuideMeta article={article} />
      <h3 className="text-balance text-[1.0625rem] leading-snug font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-teal)] sm:text-lg">
        {article.title}
      </h3>
      {showDescription && (
        <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-[var(--foreground)]/75">
          {article.description}
        </p>
      )}
    </Link>
  )
}
