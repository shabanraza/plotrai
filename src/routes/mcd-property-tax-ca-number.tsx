import { createFileRoute } from '@tanstack/react-router'
import { MunicipalGuidePage } from '#/components/tools/municipal-guide-page'
import { MUNICIPAL_GUIDE_CONTENT } from '#/data/municipal-guide-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'

const CONTENT = MUNICIPAL_GUIDE_CONTENT['mcd-property-tax-ca-number']

export const Route = createFileRoute('/mcd-property-tax-ca-number')({
  component: () => <MunicipalGuidePage content={CONTENT} />,
  head: () => ({
    meta: [
      { title: 'MCD Property Tax CA Number Guide · Plotr Ai' },
      { name: 'description', content: CONTENT.description },
      { property: 'og:title', content: 'MCD Property Tax CA Number Guide' },
      { property: 'og:description', content: CONTENT.description },
      { property: 'og:url', content: 'https://plotrai.in/mcd-property-tax-ca-number' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/mcd-property-tax-ca-number')],
    scripts: [
      softwareAppLd({
        name: CONTENT.title,
        description: CONTENT.description,
        path: '/mcd-property-tax-ca-number',
        category: 'FinanceApplication',
      }),
      faqPageLd(CONTENT.faqs),
    ],
  }),
})
