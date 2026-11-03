import { createFileRoute } from '@tanstack/react-router'
import { HubPage, hubHead } from '#/components/hub-page'

export const Route = createFileRoute('/build')({
  head: () => hubHead('build'),
  component: () => <HubPage id="build" />,
})
