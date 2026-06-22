import { createFileRoute } from '@tanstack/react-router'
import { PropertyTaxPage } from '#/components/tools/property-tax-page'
import { PROPERTY_TAX_CONTENT } from '#/data/property-tax-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'

const CONTENT = PROPERTY_TAX_CONTENT['bbmp-property-tax-calculator']

export const Route = createFileRoute('/bbmp-property-tax-calculator')({
  component: () => <PropertyTaxPage content={CONTENT} />,
  head: () => ({
    meta: [
      { title: 'BBMP Property Tax Calculator Bangalore · Plotr Ai' },
      { name: 'description', content: CONTENT.description },
      { property: 'og:title', content: 'BBMP Property Tax Calculator' },
      { property: 'og:description', content: CONTENT.description },
      { property: 'og:url', content: 'https://plotrai.in/bbmp-property-tax-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/bbmp-property-tax-calculator')],
    scripts: [
      softwareAppLd({
        name: CONTENT.title,
        description: CONTENT.description,
        path: '/bbmp-property-tax-calculator',
        category: 'FinanceApplication',
      }),
      faqPageLd(CONTENT.faqs),
    ],
  }),
})
