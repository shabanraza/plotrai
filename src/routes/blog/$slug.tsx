import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  BLOG_BY_SLUG,
  type BlogSlug,
  getArticleLinkItem,
  getToolLinkItem,
  getTopicHubLinkItem,
} from '#/data/blog-content'
import {
  blogPostingLd,
  breadcrumbLd,
  canonicalLink,
  faqPageLd,
} from '#/lib/seo'

const CLUSTER_LABELS = {
  'property-buyer': 'Property buyer',
  'house-design': 'House design',
  'materials-cost': 'Materials and cost',
} as const

export const Route = createFileRoute('/blog/$slug')({
  component: BlogArticlePage,
  loader: ({ params }) => {
    const article = BLOG_BY_SLUG.get(params.slug as BlogSlug)
    if (!article) throw notFound()
    return { article }
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article
    if (!article) return {}

    return {
      meta: [
        { title: `${article.title} · Plotr Ai` },
        { name: 'description', content: article.description },
        { property: 'og:title', content: article.title },
        { property: 'og:description', content: article.description },
        { property: 'og:image', content: 'https://plotrai.in/og/landing.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: `https://plotrai.in${article.path}` },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://plotrai.in/og/landing.png' },
      ],
      links: [canonicalLink(article.path)],
      scripts: [
        blogPostingLd({
          headline: article.title,
          description: article.description,
          path: article.path,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
        }),
        faqPageLd(article.faqs),
        breadcrumbLd([
          { name: 'Home', url: 'https://plotrai.in/' },
          { name: 'Blog', url: 'https://plotrai.in/blog' },
          { name: article.title, url: `https://plotrai.in${article.path}` },
        ]),
      ],
    }
  },
})

function BlogArticlePage() {
  const { article } = Route.useLoaderData()
  const topicHub = getTopicHubLinkItem(article.topicHubPath)

  return (
    <main className="bg-background">
      <article className="mx-auto flex w-full max-w-[760px] flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <header className="flex flex-col gap-6">
          <Breadcrumb>
            <BreadcrumbList className="text-xs text-[var(--muted-foreground)]">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-4">
            <Badge
              variant="outline"
              className="w-fit text-xs font-medium"
            >
              {article.hero.eyebrow}
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="w-full text-balance text-[2.2rem] leading-[1.02] font-semibold text-[var(--foreground)] sm:text-[2.85rem]">
                {article.title}
              </h1>
              <p className="text-pretty text-[1.05rem] leading-8 text-[var(--muted-foreground)] sm:text-[1.25rem]">
                {article.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-[var(--border)] py-4 text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">Plotr Ai Editorial</span>
            <span className="text-[var(--border)]">•</span>
            <span>{article.readingTime}</span>
            <span className="text-[var(--border)]">•</span>
            <span>{CLUSTER_LABELS[article.cluster]}</span>
            <span className="text-[var(--border)]">•</span>
            <span>Updated {article.dateModified}</span>
          </div>
        </header>

        <div className="flex flex-col gap-10">
          {article.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-5">
              <h2 className="text-balance text-[1.7rem] leading-[1.12] font-semibold text-[var(--foreground)] sm:text-[2.25rem]">
                {section.heading}
              </h2>

              <div className="flex flex-col gap-5 text-[1.02rem] leading-8 text-[var(--foreground)] sm:text-[1.14rem] sm:leading-9">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-pretty text-[var(--foreground)]/88">
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.bullets && (
                <ul className="flex list-disc flex-col gap-3 pl-5 text-[0.98rem] leading-8 text-[var(--foreground)]/84 sm:text-[1.08rem] sm:leading-9">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}

              {section.table && (
                <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--background)]">
                  <Table className="min-w-[520px]">
                    <TableHeader>
                      <TableRow>
                        {section.table.columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.table.rows.map((row) => (
                        <TableRow key={row.join('-')}>
                          {row.map((cell) => (
                            <TableCell
                              key={cell}
                              className="align-top leading-7 text-[var(--muted-foreground)]"
                            >
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          ))}
        </div>

        <Separator />

        <section className="flex flex-col gap-5">
          <h2 className="text-[1.45rem] leading-[1.15] font-semibold text-[var(--foreground)] sm:text-[1.8rem]">
            Use the matching tool
          </h2>
          <EditorialLinkList items={article.relatedTools.map(getToolLinkItem)} />
        </section>

        <Separator />

        <section className="flex flex-col gap-5">
          <h2 className="text-[1.45rem] leading-[1.15] font-semibold text-[var(--foreground)] sm:text-[1.8rem]">
            Related guides
          </h2>
          <div className="flex flex-col">
            <EditorialLinkItem
              label={topicHub.label}
              description={topicHub.description}
              to={topicHub.to}
              badge={topicHub.badge}
            />
            {article.relatedArticles.map((slug) => {
              const link = getArticleLinkItem(slug)
              return (
                <EditorialLinkItem
                  key={link.to}
                  label={link.label}
                  description={link.description}
                  to={link.to}
                  badge={link.badge}
                />
              )
            })}
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="text-[1.45rem] leading-[1.15] font-semibold text-[var(--foreground)] sm:text-[1.8rem]">
            Common questions
          </h2>
          <dl className="flex flex-col">
            {article.faqs.map((item, index) => (
              <details
                key={item.q}
                className="group border-t border-[var(--border)] py-5 last:border-b"
                open={index === 0}
              >
                <summary className="cursor-pointer list-none text-left">
                  <dt className="pr-8 text-lg leading-8 font-semibold text-[var(--foreground)]">
                    {item.q}
                  </dt>
                </summary>
                <dd className="mt-3 text-[1rem] leading-8 text-[var(--muted-foreground)] sm:text-[1.06rem]">
                  {item.a}
                </dd>
              </details>
            ))}
          </dl>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] leading-[1.2] font-semibold text-[var(--foreground)]">
            Sources
          </h2>
          <div className="flex flex-col">
            {article.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="border-t border-[var(--border)] py-4 text-sm leading-6 text-[var(--muted-foreground)] transition-colors first:border-t-0 hover:text-[var(--foreground)]"
              >
                <span className="font-semibold text-[var(--foreground)]">
                  {source.label}
                </span>
                <span className="mt-1 block break-all text-xs">{source.url}</span>
              </a>
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}

function EditorialLinkList({
  items,
}: {
  items: ReadonlyArray<{ to: string; label: string; description: string; badge?: string }>
}) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <EditorialLinkItem key={item.to} {...item} />
      ))}
    </div>
  )
}

function EditorialLinkItem({
  to,
  label,
  description,
  badge,
}: {
  to: string
  label: string
  description: string
  badge?: string
}) {
  return (
    <a
      href={to}
      className="group flex flex-col gap-3 border-t border-[var(--border)] py-4 first:border-t sm:flex-row sm:items-start sm:justify-between sm:gap-6"
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {badge ? (
            <Badge variant="secondary" className="text-xs font-medium">
              {badge}
            </Badge>
          ) : null}
        </div>
        <h3 className="text-[1.15rem] leading-7 font-semibold text-[var(--foreground)]">
          {label}
        </h3>
        <p className="mt-1 max-w-[56ch] text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-teal)] sm:pt-1">
        Read more
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  )
}
