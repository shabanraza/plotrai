import type { FinishingToolContent } from '#/data/finishing-calc-content'
import { SOLAR_CENTRAL_SOURCES, SOLAR_CONTENT } from '#/data/solar-calc-content'
import { CITY_CONTENT } from '#/data/city-construction-content'
import type { ToolSource } from '#/components/tools/tool-sources'
import {
  DEFAULT_COST_PER_KW,
  calculateSolar,
  formatRupees,
  stateSubsidyFor,
  type StateSubsidyRule,
} from '#/lib/solar-calc'

export interface StateSolarInfo {
  /** Applied automatically on the city page when set */
  rule?: StateSubsidyRule & { agency: string }
  /** What the state adds, in a sentence or two */
  summary: string
  sources: ReadonlyArray<ToolSource>
}

const UPNEDA_FAQ = {
  label:
    'UPNEDA rooftop solar FAQ (state subsidy ₹15,000 per kW, up to ₹30,000, residential)',
  url: 'https://upneda.org.in/MediaGallery/Documents/FAQRooftop.pdf',
}
const DELHI_SOLAR_PORTAL = {
  label:
    'Delhi Solar Portal, Delhi Solar Energy Policy (₹2,000 per kW up to ₹10,000; GBI ₹3 per unit up to 3 kW)',
  url: 'https://solar.delhi.gov.in/page/about-delhi-solar-energy-policy',
}
const DELHI_CABINET_2025 = {
  label:
    'Saur Energy, 21 May 2025: Delhi cabinet approves ₹10,000 per kW, up to ₹30,000 (not yet on the Delhi Solar Portal)',
  url: 'https://www.saurenergy.com/solar-energy-news/delhi-govt-announces-state-subsidies-under-pm-surya-ghar',
}
const GUJARAT_TOP_UP = {
  label:
    'Energetica India, 22 Oct 2026: Gujarat top-up for systems up to 2.18 kWp (consumer pays 10% of the benchmark cost)',
  url: 'https://www.energetica-india.net/news/gujarat-announces-additional-state-subsidy-for-rts-up-to-2-18-kwp-under-pm-surya-ghar',
}

/** Only top-ups confirmed on an official state source are applied automatically. */
export const STATE_SOLAR: Record<string, StateSolarInfo> = {
  'Uttar Pradesh': {
    rule: { perKw: 15000, cap: 30000, agency: 'UPNEDA' },
    summary:
      'Uttar Pradesh adds its own subsidy through UPNEDA: ₹15,000 per kW, up to ₹30,000 per residential consumer, on top of the central subsidy.',
    sources: [UPNEDA_FAQ],
  },
  'Delhi NCT': {
    rule: { perKw: 2000, cap: 10000, agency: 'Delhi Solar Policy' },
    summary:
      'The Delhi Solar Portal lists a state capital subsidy of ₹2,000 per kW, up to ₹10,000, credited in the first electricity bill, plus a generation-based incentive of ₹3 per unit for systems up to 3 kW and ₹2 per unit from 3 to 10 kW. In May 2025 the Delhi cabinet approved ₹10,000 per kW (up to ₹30,000), but the portal still shows the older figure, so confirm with your discom.',
    sources: [DELHI_SOLAR_PORTAL, DELHI_CABINET_2025],
  },
  Gujarat: {
    summary:
      'Gujarat announced a top-up in October 2026 for systems up to 2.18 kWp commissioned on or after 22 October 2026: the household pays 10% of the benchmark cost (5% for SC and ST households) and the state covers the gap after the central subsidy. We could not read the official notification, so it is not added automatically; enter it in the state subsidy field once your discom confirms it.',
    sources: [GUJARAT_TOP_UP],
  },
}

export interface SolarCity {
  slug: string
  city: string
  state: string
  info: StateSolarInfo | undefined
}

/** Same cities as the construction cost pages, minus the sub-area pages. */
export const SOLAR_CITIES: ReadonlyArray<SolarCity> = CITY_CONTENT.filter(
  (c) => c.slug !== 'north-bangalore',
).map((c) => ({
  slug: c.slug,
  city: c.city,
  state: c.state,
  info: STATE_SOLAR[c.state],
}))

export const SOLAR_CITY_BY_SLUG = new Map(SOLAR_CITIES.map((c) => [c.slug, c]))

export function solarCityPath(slug: string) {
  return `/solar-panel-cost/${slug}`
}

function stateName(state: string) {
  return state === 'Delhi NCT' ? 'Delhi' : state
}

/** 3 kW at the default price after central and (where applied) state subsidy. */
export function solarCityExample(c: SolarCity) {
  const state = c.info?.rule ? stateSubsidyFor(3, c.info.rule) : 0
  const r = calculateSolar({
    kw: 3,
    category: 'general',
    costPerKw: DEFAULT_COST_PER_KW,
    stateSubsidy: state,
    monthlyUnits: 0,
    tariff: 0,
    unitsPerKwPerDay: 0,
  })
  return r
}

export function buildSolarCityContent(c: SolarCity): FinishingToolContent {
  const st = stateName(c.state)
  const ex = solarCityExample(c)
  const rule = c.info?.rule
  const stateLine = c.info
    ? c.info.summary
    : `We have not found a ${st} state top-up on an official source, so only the central subsidy is applied. If your discom offers one, add it in the state subsidy field.`

  return {
    path: solarCityPath(c.slug),
    title: `Solar panel cost in ${c.city}`,
    metaTitle: `Solar Panel Cost in ${c.city} 2026 with Subsidy (1–10 kW) · Plotr Ai`,
    description: `Rooftop solar panel cost in ${c.city}: a 3 kW system costs about ${formatRupees(ex.netCost)} after the PM Surya Ghar subsidy${rule ? ` and the ${rule.agency} top-up` : ''}. Check 1, 2, 3, 5 or 10 kW with units, savings and payback.`,
    tagline: `Rooftop solar cost for a home in ${c.city} after the PM Surya Ghar subsidy${rule ? ` and the ${st} state subsidy` : ''}, with the units it generates and how soon it pays back.`,
    context: {
      title: `Solar subsidy in ${c.city}`,
      paragraphs: [
        `Homes in ${c.city} get the central PM Surya Ghar subsidy: ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, up to ₹78,000.`,
        stateLine,
        ...SOLAR_CONTENT.context.paragraphs.slice(0, 1),
        ...SOLAR_CONTENT.context.paragraphs.slice(2),
      ],
    },
    faqs: [
      {
        q: `What is the cost of a 3 kW solar system in ${c.city}?`,
        a: `At an indicative ₹60,000 per kW, a 3 kW system costs about ₹1,80,000. After the ₹78,000 central subsidy${ex.stateSubsidy > 0 ? ` and ${formatRupees(ex.stateSubsidy)} from the ${rule?.agency} state subsidy` : ''} you pay about ${formatRupees(ex.netCost)}. Get quotes from registered vendors in ${c.city}; prices differ by brand and roof.`,
      },
      {
        q: `Is there a state solar subsidy in ${st}?`,
        a: stateLine,
      },
      SOLAR_CONTENT.faqs[1],
      SOLAR_CONTENT.faqs[4],
      SOLAR_CONTENT.faqs[5],
    ],
    sources: [...SOLAR_CENTRAL_SOURCES, ...(c.info?.sources ?? [])],
    note: SOLAR_CONTENT.note,
  }
}
