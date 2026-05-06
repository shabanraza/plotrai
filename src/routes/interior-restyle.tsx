import { createFileRoute } from '@tanstack/react-router'
import { Wand2 } from 'lucide-react'
import { ImageToolPage } from '#/components/tools/image-tool-page'
import { IMAGE_TOOL_FAQS } from '#/data/tool-seo-content'
import { softwareAppLd, faqPageLd } from '#/lib/seo'

export const Route = createFileRoute('/interior-restyle')({
  component: InteriorRestylePage,
  head: () => ({
    meta: [
      { title: 'Interior Restyle AI — Re-render Any Room in Seconds · Plotr Ai' },
      {
        name: 'description',
        content:
          'Upload a room photo and re-render it in Modern, Indian Traditional, Scandinavian, Minimal, or Luxury style. Free AI tool, no signup.',
      },
      { property: 'og:title', content: 'Interior Restyle AI · Plotr Ai' },
      {
        property: 'og:description',
        content: 'Re-render any room in a new style — same layout, brand-new vibe.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/interior-restyle.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/interior-restyle' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/interior-restyle.png' },
    ],
    scripts: [
      softwareAppLd({
        name: 'Interior Restyle AI',
        description: 'AI tool that re-renders any interior photo in a chosen design style while preserving layout.',
        path: '/interior-restyle',
        category: 'DesignApplication',
      }),
      faqPageLd(IMAGE_TOOL_FAQS),
    ],
  }),
})

function InteriorRestylePage() {
  return (
    <ImageToolPage
      mode="interior-restyle"
      toolName="Interior Restyle"
      title="Interior Restyle"
      tagline="Upload a photo of any room and re-render it in a new style — same layout, brand-new vibe."
      uploadHint="Interior photo · PNG/JPG up to 10MB"
      ctaLabel="Restyle Room"
      eyebrowIcon={Wand2}
      eyebrowLabel="AI Render · Live"
      faqs={IMAGE_TOOL_FAQS}
    />
  )
}
