import { createFileRoute } from '@tanstack/react-router'
import {
  SpecificMaterialCalculatorPage,
  type SpecificMaterialConfig,
} from '#/components/tools/specific-material-calculator-page'
import { canonicalLink, faqPageLd, softwareAppLd } from '#/lib/seo'
import { MATERIAL_CALC_FAQS } from '#/data/tool-seo-content'

const CONFIG: SpecificMaterialConfig = {
  mode: 'rcc_slab',
  path: 'rcc-slab-calculator',
  title: 'RCC Slab Calculator',
  description:
    'Estimate cement bags, sand, aggregate, and steel required for an RCC slab using length, width, thickness, and concrete grade.',
  defaultLength: 10,
  defaultWidth: 8,
  defaultThicknessMm: 150,
  showGrade: true,
  context: [
    'RCC slab estimates depend on concrete volume and steel percentage. This tool uses M20 residential-slab defaults with steel around 80 kg per cubic metre.',
    'Use the output for early budgeting and material ordering conversations. Structural drawings and bar-bending schedules should decide the final steel quantity.',
  ],
}

export const Route = createFileRoute('/rcc-slab-calculator')({
  component: () => <SpecificMaterialCalculatorPage config={CONFIG} />,
  head: () => ({
    meta: [
      { title: 'RCC Slab Calculator India — Cement, Steel, Sand · Plotr Ai' },
      { name: 'description', content: CONFIG.description },
      { property: 'og:title', content: 'RCC Slab Calculator India' },
      { property: 'og:description', content: CONFIG.description },
      { property: 'og:url', content: 'https://plotrai.in/rcc-slab-calculator' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink('/rcc-slab-calculator')],
    scripts: [
      softwareAppLd({
        name: 'RCC Slab Calculator India',
        description: CONFIG.description,
        path: '/rcc-slab-calculator',
      }),
      faqPageLd(MATERIAL_CALC_FAQS.slice(0, 4)),
    ],
  }),
})
