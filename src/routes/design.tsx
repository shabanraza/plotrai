import { createFileRoute } from '@tanstack/react-router'
import { HubPage, hubHead } from '#/components/hub-page'

export const Route = createFileRoute('/design')({
  head: () => hubHead('design'),
  component: () => <HubPage id="design" />,
})
