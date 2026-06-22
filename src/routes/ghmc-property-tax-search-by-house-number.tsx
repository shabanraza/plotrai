import { createFileRoute } from '@tanstack/react-router'
import { MunicipalGuidePage } from '#/components/tools/municipal-guide-page'
import { MUNICIPAL_GUIDE_CONTENT } from '#/data/municipal-guide-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'

const CONTENT = MUNICIPAL_GUIDE_CONTENT['ghmc-property-tax-search-by-house-number']

export const Route = createFileRoute('/ghmc-property-tax-search-by-house-number')({
  component: () => <MunicipalGuidePage content={CONTENT} />,
  head: () => ({
    meta: [
      { title: 'GHMC Property Tax Search by House Number · Plotr Ai' },
      { name: 'description', content: CONTENT.description },
      { property: 'og:title', content: 'GHMC Property Tax Search by House Number' },
      { property: 'og:description', content: CONTENT.description },
      {
        property: 'og:url',
        content: 'https://plotrai.in/ghmc-property-tax-search-by-house-number',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/ghmc-property-tax-search-by-house-number')],
    scripts: [
      softwareAppLd({
        name: CONTENT.title,
        description: CONTENT.description,
        path: '/ghmc-property-tax-search-by-house-number',
        category: 'FinanceApplication',
      }),
      faqPageLd(CONTENT.faqs),
    ],
  }),
})
