import { createFileRoute } from '@tanstack/react-router'
import { Box } from 'lucide-react'
import { ImageToolPage } from '#/components/tools/image-tool-page'
import { IMAGE_TOOL_FAQS } from '#/data/tool-seo-content'
import { canonicalLink, softwareAppLd, faqPageLd } from '#/lib/seo'

export const Route = createFileRoute('/floor-plan-3d')({
  component: FloorPlan3DPage,
  head: () => ({
    meta: [
      { title: '2D Floor Plan to 3D Render — AI Visualizer for Indian Homes · Plotr Ai' },
      {
        name: 'description',
        content:
          'Upload a 2D floor plan and get a furnished 3D isometric render in seconds. Free AI tool for Indian homeowners — no signup, mobile-friendly.',
      },
      { property: 'og:title', content: '2D Floor Plan → 3D Render · Plotr Ai' },
      {
        property: 'og:description',
        content: 'Free AI tool to convert 2D plans into furnished 3D isometric renders.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/floor-plan-3d.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/floor-plan-3d' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/floor-plan-3d.png' },
    ],
    links: [canonicalLink('/floor-plan-3d')],
    scripts: [
      softwareAppLd({
        name: '2D Floor Plan to 3D Render',
        description: 'AI tool that converts 2D architectural floor plans into furnished 3D isometric renders.',
        path: '/floor-plan-3d',
        category: 'DesignApplication',
      }),
      faqPageLd(IMAGE_TOOL_FAQS),
    ],
  }),
})

function FloorPlan3DPage() {
  return (
    <ImageToolPage
      mode="floor-plan-3d"
      toolName="Floor Plan → 3D"
      title="Floor Plan → 3D Render"
      tagline="Upload your 2D floor plan and see your home as a furnished 3D isometric render in seconds."
      uploadHint="Top-down 2D floor plan · PNG/JPG up to 10MB"
      ctaLabel="Generate 3D Render"
      eyebrowIcon={Box}
      eyebrowLabel="AI Render · Live"
      faqs={IMAGE_TOOL_FAQS}
    />
  )
}
