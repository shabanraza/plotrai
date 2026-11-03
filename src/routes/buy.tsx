import { createFileRoute } from '@tanstack/react-router'
import { HubPage, hubHead } from '#/components/hub-page'

export const Route = createFileRoute('/buy')({
  head: () => hubHead('buy'),
  component: () => <HubPage id="buy" />,
})
