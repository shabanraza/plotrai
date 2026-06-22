import { createFileRoute } from '@tanstack/react-router'
import {
  SpecificMaterialCalculatorPage,
  type SpecificMaterialConfig,
} from '#/components/tools/specific-material-calculator-page'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import { MATERIAL_CALC_FAQS } from '#/data/tool-seo-content'

const CONFIG: SpecificMaterialConfig = {
  mode: 'pcc',
  path: 'cement-sand-aggregate-calculator',
  title: 'Cement Sand Aggregate Calculator',
  description:
    'Calculate cement, sand, and aggregate quantity for concrete in bags and cubic feet using Indian construction thumb rules.',
  defaultLength: 5,
  defaultWidth: 4,
  defaultThicknessMm: 150,
  showGrade: true,
  context: [
    'Searchers often need one thing quickly: how many cement bags, how much sand, and how much aggregate for a known concrete volume. This calculator keeps that answer direct.',
    'The output is best for residential site planning and small works. For large pours, compare against your ready-mix supplier quote and add wastage based on site conditions.',
  ],
}

export const Route = createFileRoute('/cement-sand-aggregate-calculator')({
  component: () => <SpecificMaterialCalculatorPage config={CONFIG} />,
  head: () => ({
    meta: [
      { title: 'Cement Sand Aggregate Calculator India · Plotr Ai' },
      { name: 'description', content: CONFIG.description },
      { property: 'og:title', content: 'Cement Sand Aggregate Calculator' },
      { property: 'og:description', content: CONFIG.description },
      { property: 'og:url', content: 'https://plotrai.in/cement-sand-aggregate-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/cement-sand-aggregate-calculator')],
    scripts: [
      softwareAppLd({
        name: 'Cement Sand Aggregate Calculator India',
        description: CONFIG.description,
        path: '/cement-sand-aggregate-calculator',
      }),
      faqPageLd(MATERIAL_CALC_FAQS.slice(0, 4)),
    ],
  }),
})
