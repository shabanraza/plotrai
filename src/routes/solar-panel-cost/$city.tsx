import { createFileRoute, notFound } from '@tanstack/react-router'
import { SolarCalculator } from '#/components/tools/solar-calculator'
import { finishingHead } from '#/data/finishing-calc-content'
import {
  SOLAR_CITY_BY_SLUG,
  buildSolarCityContent,
} from '#/data/solar-city-content'

export const Route = createFileRoute('/solar-panel-cost/$city')({
  loader: ({ params }) => {
    const city = SOLAR_CITY_BY_SLUG.get(params.city)
    if (!city) throw notFound()
    return { city }
  },
  head: ({ loaderData }) =>
    loaderData ? finishingHead(buildSolarCityContent(loaderData.city)) : {},
  component: SolarCityPage,
})

function SolarCityPage() {
  const { city } = Route.useLoaderData()
  return (
    <SolarCalculator
      key={city.slug}
      content={buildSolarCityContent(city)}
      stateRule={city.info?.rule}
      currentCity={city.slug}
    />
  )
}
