import { createFileRoute, redirect } from '@tanstack/react-router'

// Old topic hub, merged into the /build hub in the 2026-11 redesign. Permanent redirect keeps its links.
export const Route = createFileRoute('/construction-materials')({
  beforeLoad: () => {
    throw redirect({ to: '/build', statusCode: 301 })
  },
})
