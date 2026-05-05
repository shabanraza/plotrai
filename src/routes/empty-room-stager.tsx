import { createFileRoute } from '@tanstack/react-router'
import { Sofa } from 'lucide-react'
import { ImageToolPage } from '#/components/tools/image-tool-page'

export const Route = createFileRoute('/empty-room-stager')({
  component: EmptyRoomStagerPage,
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
    />
  )
}
