import { createFileRoute, redirect } from '@tanstack/react-router'

// Old topic hub, merged into the /buy hub in the 2026-11 redesign. Permanent redirect keeps its links.
export const Route = createFileRoute('/property-buyer-guide')({
  beforeLoad: () => {
    throw redirect({ to: '/buy', statusCode: 301 })
  },
})
