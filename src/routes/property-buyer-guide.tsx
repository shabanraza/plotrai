import { createFileRoute } from '@tanstack/react-router'
import { TopicHubPage } from '#/components/blog/topic-hub-page'
import { TOPIC_HUB_BY_PATH } from '#/data/blog-content'
import { articleLd, canonicalLink, faqPageLd } from '#/lib/seo'

const HUB = TOPIC_HUB_BY_PATH.get('/property-buyer-guide')

export const Route = createFileRoute('/property-buyer-guide')({
  component: PropertyBuyerGuidePage,
  head: () => {
    if (!HUB) return {}
    return {
      meta: [
        { title: `${HUB.title} · Plotr Ai` },
        { name: 'description', content: HUB.description },
        { property: 'og:title', content: HUB.title },
        { property: 'og:description', content: HUB.description },
        { property: 'og:image', content: 'https://plotrai.in/og/landing.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: 'https://plotrai.in/property-buyer-guide' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://plotrai.in/og/landing.png' },
      ],
      links: [canonicalLink('/property-buyer-guide')],
      scripts: [
        articleLd({
          headline: HUB.title,
          description: HUB.description,
          path: HUB.path,
          datePublished: '2026-07-03',
          dateModified: '2026-07-03',
        }),
        faqPageLd(HUB.faqs),
      ],
    }
  },
})

function PropertyBuyerGuidePage() {
  if (!HUB) return null
  return <TopicHubPage hub={HUB} />
}
