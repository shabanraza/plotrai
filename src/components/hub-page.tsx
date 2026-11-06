import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { HUB_CONTENT } from '#/data/hub-content'
import {
  HUB_PROGRAMMATIC_LABEL,
  SITE_HUB_BY_ID,
  entriesForHub,
  hubPath,
  type HubId,
} from '#/data/site-map'
import { SITE_URL, breadcrumbLd, canonicalLink, faqPageLd } from '#/lib/seo'
import { shortLabel } from './tools-menu'

/** `head()` for a hub route: title, description, OpenGraph, canonical, FAQ + breadcrumb JSON-LD. */
export function hubHead(id: HubId) {
  const content = HUB_CONTENT[id]
  const hub = SITE_HUB_BY_ID.get(id)
  const path = hubPath(id)
  return {
    meta: [
      { title: `${content.metaTitle} · Plotr Ai` },
      { name: 'description', content: content.metaDescription },
      { property: 'og:title', content: content.metaTitle },
      { property: 'og:description', content: content.metaDescription },
      { property: 'og:image', content: `${SITE_URL}/og/landing.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: `${SITE_URL}${path}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: `${SITE_URL}/og/landing.png` },
    ],
    links: [canonicalLink(path)],
    scripts: [
      faqPageLd(content.faqs),
      breadcrumbLd([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: hub?.title ?? content.h1, url: `${SITE_URL}${path}` },
      ]),
    ],
  }
}

/** Hub page: tools → "by state / city / unit" links → guides → FAQ. */
export function HubPage({ id }: { id: HubId }) {
  const hub = SITE_HUB_BY_ID.get(id)
  const content = HUB_CONTENT[id]
  if (!hub) return null

  const tools = entriesForHub(id, 'tool')
  const quick = HUB_PROGRAMMATIC_LABEL[id]
  const quickLinks = quick ? entriesForHub(id, quick.kind) : []
  const guides = entriesForHub(id, 'guide')
  let n = 0
  const next = () => String(++n).padStart(2, '0')

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: hub.title }]}
      eyebrow={{ icon: hub.icon, label: hub.title }}
      title={content.h1}
      tagline={content.tagline}
    >
      <div className="flex flex-col gap-14">
        <ToolSection number={next()} label="Calculators and tools" rule={false}>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <li key={tool.to}>
                  <Link
                    to={tool.to}
                    className="group grid min-h-11 grid-cols-[auto_1fr_auto] items-center gap-3 py-4 no-underline"
                  >
                    <span className="flex size-9 items-center justify-center rounded-md bg-[var(--muted)] text-[var(--foreground)]">
                      {Icon && <Icon className="size-4" />}
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--brand)]">
                        {tool.title}
                      </span>
                      <span className="text-sm leading-snug text-[var(--foreground)]/75">
                        {tool.description}
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </ToolSection>

        {quick && quickLinks.length > 0 && (
          <ToolSection number={next()} label={quick.label}>
            <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-4">
              {quickLinks.map((entry) => (
                <li key={entry.to}>
                  <Link
                    to={entry.to}
                    className="flex min-h-11 items-center rounded-md px-2 -mx-2 text-[15px] text-[var(--foreground)] no-underline hover:bg-[var(--muted)]/60 hover:text-[var(--brand)]"
                  >
                    {shortLabel(entry)}
                  </Link>
                </li>
              ))}
            </ul>
          </ToolSection>
        )}

        {guides.length > 0 && (
          <ToolSection number={next()} label="Guides">
            <ul className="grid gap-x-6 sm:grid-cols-2">
              {guides.map((guide) => (
                <li key={guide.to}>
                  <Link to={guide.to} className="group flex flex-col gap-1 py-4 no-underline">
                    <span className="text-base font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--brand)]">
                      {guide.title}
                    </span>
                    <span className="line-clamp-2 text-sm leading-relaxed text-[var(--foreground)]/75">
                      {guide.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ToolSection>
        )}

        <ToolFaq items={content.faqs} />
      </div>
    </ToolPageShell>
  )
}
