import { createFileRoute, redirect } from '@tanstack/react-router'

// Old topic hub, merged into the /design hub in the 2026-11 redesign. Permanent redirect keeps its links.
export const Route = createFileRoute('/house-design')({
  beforeLoad: () => {
    throw redirect({ to: '/design', statusCode: 301 })
  },
})
