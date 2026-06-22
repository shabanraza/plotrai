import { createFileRoute } from '@tanstack/react-router'
import { MunicipalGuidePage } from '#/components/tools/municipal-guide-page'
import { MUNICIPAL_GUIDE_CONTENT } from '#/data/municipal-guide-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'

const CONTENT = MUNICIPAL_GUIDE_CONTENT['bbmp-property-tax-2026-27']

export const Route = createFileRoute('/bbmp-property-tax-2026-27')({
  component: () => <MunicipalGuidePage content={CONTENT} />,
  head: () => ({
    meta: [
      { title: 'BBMP Property Tax 2026-27 Guide · Plotr Ai' },
      { name: 'description', content: CONTENT.description },
      { property: 'og:title', content: 'BBMP Property Tax 2026-27' },
      { property: 'og:description', content: CONTENT.description },
      { property: 'og:url', content: 'https://plotrai.in/bbmp-property-tax-2026-27' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/bbmp-property-tax-2026-27')],
    scripts: [
      softwareAppLd({
        name: CONTENT.title,
        description: CONTENT.description,
        path: '/bbmp-property-tax-2026-27',
        category: 'FinanceApplication',
      }),
      faqPageLd(CONTENT.faqs),
    ],
  }),
})
