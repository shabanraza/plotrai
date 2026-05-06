import { createFileRoute } from '@tanstack/react-router'
import { Sofa } from 'lucide-react'
import { ImageToolPage } from '#/components/tools/image-tool-page'
import { IMAGE_TOOL_FAQS } from '#/data/tool-seo-content'
import { softwareAppLd, faqPageLd } from '#/lib/seo'

export const Route = createFileRoute('/empty-room-stager')({
  component: EmptyRoomStagerPage,
  head: () => ({
    meta: [
      { title: 'Empty Room Stager AI — Virtually Furnish Your Property · Plotr Ai' },
      {
        name: 'description',
        content:
          'Free AI tool to virtually stage empty rooms for real-estate listings, rent ads, or pre-purchase visualization. Upload, pick a style, download.',
      },
      { property: 'og:title', content: 'Empty Room Stager AI · Plotr Ai' },
      {
        property: 'og:description',
        content: 'Virtually furnish empty rooms — perfect for real-estate listings.',
      },
    ],
    scripts: [
      softwareAppLd({
        name: 'Empty Room Stager AI',
        description: 'AI virtual staging tool that adds furniture to empty room photos for real-estate listings.',
        path: '/empty-room-stager',
        category: 'DesignApplication',
      }),
      faqPageLd(IMAGE_TOOL_FAQS),
    ],
  }),
})

function EmptyRoomStagerPage() {
  return (
    <ImageToolPage
      mode="empty-room-stager"
      toolName="Empty Room Stager"
      title="Empty Room Stager"
      tagline="Upload an empty room photo and let AI furnish it — perfect for real-estate listings and pre-purchase visualization."
      uploadHint="Empty room photo · PNG/JPG up to 10MB"
      ctaLabel="Furnish Room"
      eyebrowIcon={Sofa}
      eyebrowLabel="AI Render · Live"
      faqs={IMAGE_TOOL_FAQS}
    />
  )
}
