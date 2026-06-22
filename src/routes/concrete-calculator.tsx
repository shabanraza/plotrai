import { createFileRoute } from '@tanstack/react-router'
import {
  SpecificMaterialCalculatorPage,
  type SpecificMaterialConfig,
} from '#/components/tools/specific-material-calculator-page'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import { MATERIAL_CALC_FAQS } from '#/data/tool-seo-content'

const CONFIG: SpecificMaterialConfig = {
  mode: 'pcc',
  path: 'concrete-calculator',
  title: 'Concrete Calculator',
  description:
    'Calculate cement, sand, and aggregate for PCC or site-mixed concrete in India. Choose dimensions, thickness, and concrete grade.',
  defaultLength: 10,
  defaultWidth: 3,
  defaultThicknessMm: 100,
  showGrade: true,
  context: [
    'This calculator estimates wet concrete volume from length, width, and thickness, then applies common Indian nominal mix thumb rules for cement, sand, and aggregate.',
    'Use it for PCC beds, footings, small slabs, and quick procurement planning. For structural RCC, final mix design should come from your structural engineer or ready-mix supplier.',
  ],
}

export const Route = createFileRoute('/concrete-calculator')({
  component: () => <SpecificMaterialCalculatorPage config={CONFIG} />,
  head: () => ({
    meta: [
      { title: 'Concrete Calculator India — Cement, Sand, Aggregate · Plotr Ai' },
      { name: 'description', content: CONFIG.description },
      { property: 'og:title', content: 'Concrete Calculator India' },
      { property: 'og:description', content: CONFIG.description },
      { property: 'og:url', content: 'https://plotrai.in/concrete-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/concrete-calculator')],
    scripts: [
      softwareAppLd({
        name: 'Concrete Calculator India',
        description: CONFIG.description,
        path: '/concrete-calculator',
      }),
      faqPageLd(MATERIAL_CALC_FAQS.slice(0, 4)),
    ],
  }),
})
