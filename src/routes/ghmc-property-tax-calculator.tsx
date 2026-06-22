import { createFileRoute } from '@tanstack/react-router'
import { PropertyTaxPage } from '#/components/tools/property-tax-page'
import { PROPERTY_TAX_CONTENT } from '#/data/property-tax-content'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'

const CONTENT = PROPERTY_TAX_CONTENT['ghmc-property-tax-calculator']

export const Route = createFileRoute('/ghmc-property-tax-calculator')({
  component: () => <PropertyTaxPage content={CONTENT} />,
  head: () => ({
    meta: [
      { title: 'GHMC Property Tax Calculator Hyderabad · Plotr Ai' },
      { name: 'description', content: CONTENT.description },
      { property: 'og:title', content: 'GHMC Property Tax Calculator' },
      { property: 'og:description', content: CONTENT.description },
      { property: 'og:url', content: 'https://plotrai.in/ghmc-property-tax-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/ghmc-property-tax-calculator')],
    scripts: [
      softwareAppLd({
        name: CONTENT.title,
        description: CONTENT.description,
        path: '/ghmc-property-tax-calculator',
        category: 'FinanceApplication',
      }),
      faqPageLd(CONTENT.faqs),
    ],
  }),
})
