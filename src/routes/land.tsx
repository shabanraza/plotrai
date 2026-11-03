import { createFileRoute } from '@tanstack/react-router'
import { HubPage, hubHead } from '#/components/hub-page'

export const Route = createFileRoute('/land')({
  head: () => hubHead('land'),
  component: () => <HubPage id="land" />,
})
