import { createFileRoute } from '@tanstack/react-router'
import { SolarCalculator } from '#/components/tools/solar-calculator'
import { finishingHead } from '#/data/finishing-calc-content'
import { SOLAR_CONTENT } from '#/data/solar-calc-content'

export const Route = createFileRoute('/solar-panel-cost-calculator')({
  component: () => <SolarCalculator content={SOLAR_CONTENT} />,
  head: () => finishingHead(SOLAR_CONTENT),
})
