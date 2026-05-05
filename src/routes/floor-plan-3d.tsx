import { createFileRoute } from '@tanstack/react-router'
import { Box } from 'lucide-react'
import { ImageToolPage } from '#/components/tools/image-tool-page'

export const Route = createFileRoute('/floor-plan-3d')({
  component: FloorPlan3DPage,
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
    />
  )
}
