import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import {
  TOPIC_HUBS,
  getArticlesByCluster,
} from '#/data/blog-content'
import { canonicalLink } from '#/lib/seo'

const CLUSTER_LABELS = {
  'property-buyer': 'Property buyer',
  'house-design': 'House design',
  'materials-cost': 'Materials and cost',
} as const

export const Route = createFileRoute('/blog/')({
  component: BlogIndexPage,
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

function BlogIndexPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto flex w-full max-w-[1040px] flex-col gap-12 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
        <header className="flex w-full flex-col gap-6">
          <Breadcrumb>
            <BreadcrumbList className="text-xs text-[var(--muted-foreground)]">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex max-w-[780px] flex-col gap-4">
            <h1 className="w-full text-balance text-[2.35rem] leading-[1.02] font-semibold text-[var(--foreground)] sm:text-[3.35rem]">
              Practical guides for Indian homeowners
            </h1>
            <p className="text-pretty text-[1.05rem] leading-8 text-[var(--muted-foreground)] sm:text-[1.25rem]">
              Property due diligence, house-planning decisions, and construction-cost
              research for Indian buyers and home builders.
            </p>
          </div>
        </header>

        <section className="grid border-t border-[var(--border)] pt-8 lg:grid-cols-3">
          {TOPIC_HUBS.map((hub) => (
            <a
              key={hub.path}
              href={hub.path}
              className="group grid gap-4 border-b border-[var(--border)] py-6 transition-colors first:pt-0 lg:grid-rows-[auto_1fr_auto] lg:border-b-0 lg:border-r lg:px-6 lg:py-0 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
            >
              <h2 className="text-[1.35rem] leading-[1.15] font-semibold text-[var(--foreground)]">
                {hub.title}
              </h2>
              <p className="text-sm leading-7 text-[var(--muted-foreground)] sm:text-[15px]">
                {hub.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-teal)]">
                Explore
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </section>

        {(
          [
            'property-buyer',
            'house-design',
            'materials-cost',
          ] as const
        ).map((cluster) => {
          const articles = getArticlesByCluster(cluster)
          return (
            <section key={cluster} className="flex flex-col gap-6 border-t border-[var(--border)] pt-8">
              <div className="flex w-full max-w-[780px] flex-col gap-2">
                <h2 className="text-[1.75rem] leading-[1.08] font-semibold text-[var(--foreground)] sm:text-[2.15rem]">
                  {CLUSTER_LABELS[cluster]} guides
                </h2>
              </div>

              <div className="grid lg:grid-cols-3">
                {articles.map((article, index) => (
                  <a
                    key={article.slug}
                    href={article.path}
                    className="group grid gap-4 border-b border-[var(--border)] py-6 transition-colors first:pt-0 lg:grid-rows-[auto_1fr_auto] lg:border-r lg:px-6 lg:py-0 first:lg:pl-0 [&:nth-child(3n)]:lg:border-r-0 [&:nth-child(3n)]:lg:pr-0"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-balance text-[1.3rem] leading-[1.18] font-semibold text-[var(--foreground)] sm:text-[1.55rem]">
                        {article.title}
                      </h3>
                      <p className="mt-2 max-w-[60ch] text-pretty text-[15px] leading-7 text-[var(--muted-foreground)] sm:text-base">
                        {article.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                      <span className="text-xs font-medium text-[var(--muted-foreground)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-[var(--accent-teal)]">
                        Read guide
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </section>
    </main>
  )
}
