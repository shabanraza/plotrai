import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import {
  ArticleContents,
  ArticleContentsMobile,
  headingId,
} from '#/components/blog/article-contents'
import { ReadingProgress } from '#/components/blog/reading-progress'
import { CalloutLink } from '#/components/tools/next-step-card'
import { sourceKind } from '#/components/tools/tool-sources'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Badge } from '#/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
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
  type BlogArticle,
  type BlogSlug,
  getArticleLinkItem,
  getToolLinkItem,
  getTopicHubLinkItem,
} from '#/data/blog-content'
import { breadcrumbForPath } from '#/data/site-map'
import { track } from '#/lib/track'
import {
  blogPostingLd,
  breadcrumbLd,
  canonicalLink,
  faqPageLd,
  SITE_URL,
} from '#/lib/seo'

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
        breadcrumbLd(
          articleCrumbs(article).map((crumb) => ({
            name: crumb.label,
            url: `${SITE_URL}${crumb.href ?? article.path}`,
          })),
        ),
      ],
    }
  },
})

/** Home › hub › article, falling back to the blog index if the article isn't in the site map. */
function articleCrumbs(article: BlogArticle) {
  return (
    breadcrumbForPath(article.path, article.title) ?? [
      { label: 'Home', href: '/' },
      { label: 'Guides', href: '/blog' },
      { label: article.title },
    ]
  )
}

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function BlogArticlePage() {
  const { article } = Route.useLoaderData()
  const crumbs = articleCrumbs(article)
  const contents = useMemo(
    () =>
      article.sections.map((section) => ({
        id: headingId(section.heading),
        label: section.heading,
      })),
    [article],
  )
  const [firstTool, ...otherTools] = article.relatedTools
  const [readNext, ...otherArticles] = article.relatedArticles
  const tool = firstTool ? getToolLinkItem(firstTool) : null
  const next = readNext ? getArticleLinkItem(readNext) : null
  const hub = getTopicHubLinkItem(article.topicHubPath)
  const moreLinks = [
    ...otherTools.map(getToolLinkItem),
    ...otherArticles.map(getArticleLinkItem),
    { ...hub, badge: 'Topic' },
  ]

  return (
    <main className="bg-background">
      <ReadingProgress targetId="article-body" />

      <div className="mx-auto grid w-full max-w-[1120px] gap-12 px-4 pt-6 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
        <article className="flex min-w-0 max-w-[68ch] flex-col gap-10">
          <header className="flex flex-col gap-5">
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                {crumbs.map((crumb, i) => (
                  <Fragment key={crumb.label}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="line-clamp-1">{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-balance text-[2rem] leading-[1.15] font-semibold text-[var(--foreground)] sm:text-[2.5rem] sm:leading-[1.1]">
              {article.title}
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-[var(--foreground)]/80">
              {article.description}
            </p>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--foreground)]/70">
              <span className="font-medium text-[var(--foreground)]">Plotr Ai editorial</span>
              <span aria-hidden>·</span>
              <span>Updated {formatDate(article.dateModified)}</span>
              <span aria-hidden>·</span>
              <span>{article.readingTime}</span>
            </p>
          </header>

          <aside
            aria-label="At a glance"
            className="flex flex-col gap-1 rounded-xl border border-[var(--border)] p-5 sm:p-6"
          >
            <span className="text-sm font-medium text-[var(--accent-teal)]">At a glance</span>
            <span className="text-[1.625rem] leading-tight font-semibold tabular-nums text-[var(--foreground)] sm:text-[1.875rem]">
              {article.hero.stat}
            </span>
            <span className="text-base leading-relaxed text-[var(--foreground)]/80">
              {article.hero.supporting}
            </span>
          </aside>

          <ArticleContentsMobile items={contents} />

          <div id="article-body" className="flex flex-col gap-12">
            {article.sections.map((section, index) => (
              <Fragment key={section.heading}>
                <section
                  id={contents[index].id}
                  className="flex scroll-mt-24 flex-col gap-5"
                >
                  <h2 className="text-balance text-[1.375rem] leading-snug font-semibold text-[var(--foreground)] sm:text-[1.625rem]">
                    {section.heading}
                  </h2>

                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-pretty text-lg leading-[1.75] text-[var(--foreground)]/90"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="flex list-disc flex-col gap-2 pl-6 text-lg leading-[1.75] text-[var(--foreground)]/90 marker:text-[var(--accent-teal)]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {section.table && (
                    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                      <Table className="min-w-[520px] text-base">
                        <TableHeader>
                          <TableRow>
                            {section.table.columns.map((column) => (
                              <TableHead key={column} className="font-semibold">
                                {column}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.table.rows.map((row) => (
                            <TableRow key={row.join('-')}>
                              {row.map((cell, i) => (
                                <TableCell
                                  key={`${i}-${cell}`}
                                  className="align-top leading-relaxed whitespace-normal tabular-nums text-[var(--foreground)]/85"
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

                {index === 0 && tool && (
                  <CalloutLink
                    to={tool.to}
                    kicker="Try the calculator"
                    title={tool.label}
                    description={tool.description}
                    onClick={() =>
                      track('article_tool_click', { from: article.path, to: tool.to })
                    }
                  />
                )}
              </Fragment>
            ))}
          </div>

          {next && (
            <CalloutLink
              to={next.to}
              kicker="Read next"
              title={next.label}
              description={next.description}
              onClick={() => track('read_next_click', { from: article.path, to: next.to })}
            />
          )}

          <ArticleBlock title="Common questions">
            <Accordion
              type="single"
              collapsible
              defaultValue={article.faqs[0]?.q}
              className="border-y border-[var(--border)]"
            >
              {article.faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="min-h-11 py-4 text-base leading-snug font-semibold hover:no-underline sm:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-[var(--foreground)]/80 sm:text-lg sm:leading-[1.7]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ArticleBlock>

          {moreLinks.length > 0 && (
            <ArticleBlock title="More on this topic">
              <ul className="flex flex-col border-y border-[var(--border)]">
                {moreLinks.map((link) => (
                  <li key={link.to} className="border-b border-[var(--border)] last:border-b-0">
                    <Link
                      to={link.to}
                      className="group flex min-h-11 items-start justify-between gap-4 py-4 no-underline"
                    >
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-teal)]">
                            {link.label}
                          </span>
                          {link.badge && <Badge variant="secondary">{link.badge}</Badge>}
                        </span>
                        <span className="text-sm leading-snug text-[var(--foreground)]/75">
                          {link.description}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-[var(--accent-teal)] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </ArticleBlock>
          )}

          {article.sources.length > 0 && (
            <ArticleBlock title="Sources">
              <ol className="flex flex-col border-y border-[var(--border)]">
                {article.sources.map((source, i) => {
                  const kind = sourceKind(source.url)
                  return (
                    <li
                      key={source.url}
                      className="flex items-start gap-3 border-b border-[var(--border)] py-3 last:border-b-0"
                    >
                      <span className="w-5 shrink-0 text-sm tabular-nums text-[var(--foreground)]/60">
                        {i + 1}.
                      </span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-w-0 flex-1 items-start gap-1.5 text-sm text-[var(--foreground)] underline-offset-4 hover:text-[var(--accent-teal)] hover:underline"
                      >
                        {source.label}
                        <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-60" />
                      </a>
                      {kind && (
                        <Badge
                          variant={kind === 'official' ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {kind === 'official' ? 'Official' : 'Secondary'}
                        </Badge>
                      )}
                    </li>
                  )
                })}
              </ol>
            </ArticleBlock>
          )}
        </article>

        {/* Right rail, desktop only. The space under the contents is reserved for a display ad
            once AdSense is approved; nothing renders there until then. */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-8">
            <ArticleContents items={contents} />
          </div>
        </aside>
      </div>
    </main>
  )
}

function ArticleBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[1.375rem] leading-snug font-semibold text-[var(--foreground)] sm:text-[1.625rem]">
        {title}
      </h2>
      {children}
    </section>
  )
}
