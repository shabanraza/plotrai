import { createFileRoute } from '@tanstack/react-router'
import { Wand2 } from 'lucide-react'
import { ImageToolPage } from '#/components/tools/image-tool-page'

export const Route = createFileRoute('/interior-restyle')({
  component: InteriorRestylePage,
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
    />
  )
}
