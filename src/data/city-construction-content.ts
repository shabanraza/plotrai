import {
  CITY_RATES,
  CONSTRUCTION_LAST_UPDATED,
  GROUND_ONLY_PERCENT,
  getRateSource,
  isBenchmarkCity,
  type CityRates,
  type FinishTier,
} from './construction-cost-rates'
import type { FaqItem } from '#/lib/seo'

export interface CityContent {
  slug: string
  city: string
  state: string
  /**
   * Optional context paragraphs unique to this city. Never type a rupee figure here: use the
   * tokens {basic}, {standard}, {premium} and {luxury}, which cityContextParagraphs() fills from
   * the rates table so the text cannot drift from it.
   */
  extraContext?: ReadonlyArray<string>
}

export const CITY_CONTENT: ReadonlyArray<CityContent> = [
  {
    slug: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    extraContext: [
      'Mumbai building plans are sanctioned by the BMC, and fire and other clearances can apply depending on the plot and building type. Confirm the requirements for your plot before you budget.',
      'The standard rate of {standard} per sq ft in this table is a benchmark for a contractor-built house at standard finish. Quotes from smaller local builders can differ, so compare scope and specification line by line, not only the rate.',
    ],
  },
  {
    slug: 'delhi',
    city: 'Delhi',
    state: 'Delhi NCT',
    extraContext: [
      'Delhi residential construction is shaped by MCD and DDA building bye-laws, which set FAR limits and require sanctioned plans before work starts.',
      'The standard rate here is {standard} per sq ft. It covers construction only, so ask your architect or the local body what fees apply to your plot before comparing with Gurgaon or Noida.',
    ],
  },
  {
    slug: 'bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    extraContext: [
      'Bangalore construction is governed by BBMP and BDA bye-laws, and occupancy certificate (OC) compliance applies. The standard benchmark here is {standard} per sq ft.',
      'Outer areas such as Sarjapur and the Whitefield outskirts can quote differently from central areas, so get at least two local quotes for your exact location.',
    ],
  },
  {
    slug: 'north-bangalore',
    city: 'North Bangalore',
    state: 'Karnataka',
    extraContext: [
      'North Bangalore demand clusters around Yelahanka, Hebbal outskirts, Hennur, Thanisandra, Jakkur, Devanahalli, and the airport corridor. The standard benchmark here is {standard} per sq ft.',
      'For airport-belt and Devanahalli plots, check soil, borewell depth, road width, and approval jurisdiction carefully. Those site conditions can move the final quote more than the base per-sq-ft rate.',
    ],
  },
  {
    slug: 'pune',
    city: 'Pune',
    state: 'Maharashtra',
    extraContext: [
      'Pune plans are sanctioned by the Pune Municipal Corporation inside city limits, and OC compliance applies. The standard rate here is {standard} per sq ft.',
      'Outside PMC limits the approving body changes, so confirm the jurisdiction of your plot before you budget approval costs.',
    ],
  },
  {
    slug: 'chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    extraContext: [
      'Chennai construction is shaped by CMDA bye-laws and the coastal climate, so corrosion protection for steel and good waterproofing are worth budgeting for on top of the base rate.',
      'The standard rate here is {standard} per sq ft. Stamp duty and registration are separate from construction cost and are covered in our stamp duty calculator.',
    ],
  },
  {
    slug: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    extraContext: [
      'Hyderabad plans are approved by HMDA or the local municipal body, depending on where the plot sits. The standard benchmark here is {standard} per sq ft.',
      'Budget separately for soil testing, boundary wall, and borewell or water connection before comparing per-sq-ft quotes.',
    ],
  },
  {
    slug: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    extraContext: [
      'Kolkata plans are approved by the Kolkata Municipal Corporation inside city limits. The standard benchmark here is {standard} per sq ft.',
      'Soil-bearing capacity varies across Kolkata, and weak soil can call for a pile foundation, which raises foundation cost. Always do soil testing before finalising a budget.',
    ],
  },
  {
    slug: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    extraContext: [
      'Ahmedabad plans are approved by the Ahmedabad Municipal Corporation (AMC) or AUDA, depending on the plot location. The standard rate here is {standard} per sq ft.',
      'Check which authority covers your plot and whether the plot has a clear title and approved layout before you commit to a build budget.',
    ],
  },
  {
    slug: 'gurgaon',
    city: 'Gurgaon',
    state: 'Haryana',
    extraContext: [
      'Gurgaon (Gurugram) plots can carry licence fees and external or infrastructure charges that are separate from construction cost. Ask the developer or the authority for the current amounts.',
      'The standard benchmark here is {standard} per sq ft. High-rise towers use large contractors, while independent-floor builders quote on their own terms, so compare scope before comparing rates.',
    ],
  },
  {
    slug: 'noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    extraContext: [
      'Noida plots are allotted and regulated by the Noida Authority, which sets sector-wise charges and building rules. Those charges are separate from construction cost, so ask the Authority for the current amounts.',
      'The standard rate here is {standard} per sq ft, the InfraLens Noida (NCR-UP) figure, which this site also uses for Ghaziabad and Greater Noida.',
    ],
  },
  {
    slug: 'greater-noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    extraContext: [
      'Greater Noida independent-house quotes depend on plot access, logistics, and contractor availability in the sector. InfraLens has no Greater Noida page, so the standard rate of {standard} per sq ft is its Noida (NCR-UP) figure.',
      'For Greater Noida West and Yamuna Expressway plots, budget separately for soil testing, boundary wall, borewell or water connection, and local authority compliance before comparing per-sq-ft quotes.',
    ],
  },
  {
    slug: 'ghaziabad',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    extraContext: [
      'Ghaziabad construction demand clusters around Indirapuram, Raj Nagar Extension, Vaishali, Vasundhara, and NH-24/Delhi-Meerut corridor plots. InfraLens has no Ghaziabad page, so the standard rate of {standard} per sq ft is its Noida (NCR-UP) figure.',
      'Check GDA or local municipal approval, road width, parking, and drainage conditions before finalizing a quote; these local constraints can move the final budget more than the base material rate.',
    ],
  },
  {
    slug: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    extraContext: [
      'Jaipur plans are approved by the Jaipur Development Authority (JDA) or the municipal body, depending on the area. The standard rate here is {standard} per sq ft.',
      'Stone is widely used in Jaipur homes. If you plan stone flooring or cladding, price it separately from the base rate, which is for the tier specifications listed above.',
    ],
  },
  {
    slug: 'kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    extraContext: [
      'Kanpur construction draws on cement, brick, steel, and transport supply from the wider Uttar Pradesh region. The standard benchmark here is {standard} per sq ft.',
      'Older city plots can require extra demolition, debris removal, narrow-lane logistics, or foundation strengthening. Add a contingency before comparing Kanpur quotes with open-layout plots elsewhere.',
    ],
  },
  {
    slug: 'lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    extraContext: [
      'Lucknow plans are approved by the Lucknow Development Authority (LDA). The standard rate here is {standard} per sq ft.',
      'Check the permitted FAR and ground coverage for your plot with the LDA before you finalise the number of floors, since they decide how much you can build.',
    ],
  },
  {
    slug: 'indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    extraContext: [
      'Indore plans are approved by the Indore Municipal Corporation or the development authority, depending on the plot location. The standard rate here is {standard} per sq ft.',
      'Stamp duty and registration are separate from construction cost. Add them to your total acquisition budget using our stamp duty calculator for Madhya Pradesh.',
    ],
  },
  {
    slug: 'coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    extraContext: [
      'Coimbatore plans are approved by the Coimbatore City Municipal Corporation (CCMC) inside city limits. The standard rate here is {standard} per sq ft.',
      'Outside corporation limits the approving body changes, so confirm the jurisdiction of your plot and get at least two local quotes before you finalise a budget.',
    ],
  },
  {
    slug: 'kochi',
    city: 'Kochi',
    state: 'Kerala',
    extraContext: [
      'Kochi has a coastal climate, so corrosion protection for steel and good waterproofing are worth budgeting for on top of the base rate of {standard} per sq ft at standard finish.',
      'Contractors in Kerala often bring in labour from other states, so ask how labour is arranged and factor it into the timeline. Stamp duty and registration are separate from construction cost.',
    ],
  },
  {
    slug: 'chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    extraContext: [
      'Chandigarh is a planned city, and building plans are approved through the Chandigarh administration, which can add time before work starts. Confirm the approval steps for your sector early.',
      'The standard rate here is {standard} per sq ft. Rules for plot use, setbacks and number of floors vary by sector, so check them before you set a budget.',
    ],
  },
  {
    slug: 'bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    extraContext: [
      'Bhopal plans are approved by the Bhopal Municipal Corporation or the town and country planning authority, depending on the plot location. The standard rate here is {standard} per sq ft.',
      'Stamp duty and registration are separate from construction cost. Add them to your total acquisition budget using our stamp duty calculator for Madhya Pradesh.',
    ],
  },
  {
    slug: 'patna',
    city: 'Patna',
    state: 'Bihar',
    extraContext: [
      'Patna plans are approved by the Patna Municipal Corporation. The standard rate here is {standard} per sq ft.',
      'Local labour productivity and material logistics can stretch timelines, so agree stage-wise payments and a completion date in writing with your contractor.',
    ],
  },
  {
    slug: 'nagpur',
    city: 'Nagpur',
    state: 'Maharashtra',
    extraContext: [
      'Nagpur building plans are approved by the Nagpur Municipal Corporation inside city limits and by NMRDA in the surrounding region. Check which authority covers your plot before you budget approval fees.',
      'Nagpur has hot summers, so roof insulation, terrace waterproofing and heat-reflective paint are worth budgeting for on top of the base rate of {standard} per sq ft.',
    ],
  },
  {
    slug: 'surat',
    city: 'Surat',
    state: 'Gujarat',
    extraContext: [
      'Surat plans are approved by the Surat Municipal Corporation in city limits and SUDA in the wider urban area. The standard rate here is {standard} per sq ft.',
      'Much of Surat sits on low-lying ground near the Tapi, so check the plinth height and drainage requirements for your area. Raising the plinth adds to foundation cost.',
    ],
  },
  {
    slug: 'vadodara',
    city: 'Vadodara',
    state: 'Gujarat',
    extraContext: [
      'Vadodara plans are sanctioned by the Vadodara Municipal Corporation, or VUDA outside city limits. The standard rate here is {standard} per sq ft.',
      'Parts of Vadodara near the Vishwamitri river are flood-prone, so plinth height and drainage can add to foundation cost on low-lying plots.',
    ],
  },
  {
    slug: 'nashik',
    city: 'Nashik',
    state: 'Maharashtra',
    extraContext: [
      'Plans inside Nashik city limits are approved by the Nashik Municipal Corporation. Plots outside fall under the regional development authority, so confirm jurisdiction first.',
      'The standard rate here is {standard} per sq ft. Get at least two local quotes for your exact site, since access and soil can change the final figure.',
    ],
  },
  {
    slug: 'visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    extraContext: [
      'Visakhapatnam (Vizag) plans are approved by GVMC within city limits and VMRDA in the wider metro region. The standard rate here is {standard} per sq ft.',
      'Vizag is a coastal city, so plan for corrosion protection on reinforcement steel and good-quality exterior paint, which add a little to the standard rate.',
    ],
  },
  {
    slug: 'mysore',
    city: 'Mysore',
    state: 'Karnataka',
    extraContext: [
      'Mysore (Mysuru) plans are approved by the Mysuru City Corporation, or by the urban development authority for layouts outside the corporation. Check the layout approval before buying a plot.',
      'The standard rate here is {standard} per sq ft. Compare it with Bangalore only on the same specification, since finishes drive most of the difference.',
    ],
  },
  {
    slug: 'ranchi',
    city: 'Ranchi',
    state: 'Jharkhand',
    extraContext: [
      'Ranchi plans are approved by the Ranchi Municipal Corporation within city limits and the Ranchi Regional Development Authority outside. The standard rate here is {standard} per sq ft.',
      'Rocky sites can raise excavation costs, so get the soil and rock conditions checked before you fix the budget.',
    ],
  },
  {
    slug: 'dehradun',
    city: 'Dehradun',
    state: 'Uttarakhand',
    extraContext: [
      'Dehradun plans are approved by the Mussoorie Dehradun Development Authority (MDDA). The standard rate here is {standard} per sq ft.',
      'Dehradun lies in a high seismic zone, so earthquake-resistant design per IS 1893 is essential. Sloping sites can need retaining walls and deeper foundations, which add to cost.',
    ],
  },
  {
    slug: 'raipur',
    city: 'Raipur',
    state: 'Chhattisgarh',
    extraContext: [
      'Raipur plans are approved by the Raipur Municipal Corporation inside city limits and the development authority for Naya Raipur and outer areas.',
      'The standard rate here is {standard} per sq ft. Confirm which authority covers your plot, then get at least two local quotes.',
    ],
  },
  {
    slug: 'bhubaneswar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    extraContext: [
      'Bhubaneswar plans are approved by the Bhubaneswar Development Authority (BDA). The standard rate here is {standard} per sq ft.',
      'Odisha is cyclone-prone, so plan for stronger roof anchoring, window frames and good drainage. These add modestly to the base rate.',
    ],
  },
  {
    slug: 'ludhiana',
    city: 'Ludhiana',
    state: 'Punjab',
    extraContext: [
      'Ludhiana plans are approved by the Municipal Corporation Ludhiana inside city limits and GLADA in the wider area. The standard rate here is {standard} per sq ft.',
      'Plot sizes in Ludhiana are often quoted in marla and gaj, so convert to sq ft before comparing contractor quotes.',
    ],
  },
  {
    slug: 'agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    extraContext: [
      'Agra plans are approved by the Agra Development Authority. The standard rate here is {standard} per sq ft.',
      'Areas near the Taj Mahal fall inside the Taj Trapezium Zone, where construction and industrial activity face extra restrictions. Check before you buy a plot.',
    ],
  },
  {
    slug: 'varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    extraContext: [
      'Varanasi plans are approved by the Varanasi Development Authority. The standard rate here is {standard} per sq ft.',
      'Old-city plots are narrow with limited road access, which raises material handling and labour costs. Newer areas on the city outskirts are easier to build on.',
    ],
  },
  {
    slug: 'madurai',
    city: 'Madurai',
    state: 'Tamil Nadu',
    extraContext: [
      'Madurai plans are approved by the Madurai Corporation and the local planning authority. The standard rate here is {standard} per sq ft.',
      'Plot sizes in Madurai are often quoted in cents, so convert to sq ft before comparing quotes.',
    ],
  },
]

export const CITY_BY_SLUG = new Map(CITY_CONTENT.map((c) => [c.slug, c]))

export function getCityRates(cityName: string): CityRates | undefined {
  return CITY_RATES[cityName]
}

export function formatRupees(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

/** City paragraphs with {basic}/{standard}/{premium}/{luxury} filled from the rates table. */
export function cityContextParagraphs(content: CityContent): ReadonlyArray<string> {
  const r = getCityRates(content.city)
  return (content.extraContext ?? []).map((p) =>
    p.replace(/\{(basic|standard|premium|luxury)\}/g, (_, tier: FinishTier) =>
      r ? formatRupees(r[tier]) : '',
    ),
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-11-21" → "21 Nov 2026" */
export function formatShortDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

const MAX_TITLE_LENGTH = 68

export function buildCityMeta(content: CityContent) {
  const r = getCityRates(content.city)
  const base = `Construction Cost per Sq Ft in ${content.city} 2026`
  const suffix = ' · Plotr Ai'
  if (!r) return { title: base + suffix, ogTitle: base, description: '', h1: '' }
  const freshness = isBenchmarkCity(content.city)
    ? `rates as of ${getRateSource(content.city).asOf}`
    : `updated ${formatShortDate(CONSTRUCTION_LAST_UPDATED)}`
  const withRange = `${base}: ${formatRupees(r.basic)}–${formatRupees(r.premium)}`
  const ogTitle = (withRange + suffix).length <= MAX_TITLE_LENGTH ? withRange : base
  return {
    title: ogTitle + suffix,
    ogTitle,
    description: `${content.city} house construction cost per sq ft, ${freshness}: ${formatRupees(r.basic)}–${formatRupees(r.luxury)}. Costs for 1,000, 1,200 and 1,500 sq ft and G+1.`,
    h1: `Construction cost per sq ft in ${content.city} (2026)`,
  }
}

export interface SizeCostRow {
  key: string
  label: string
  /** Built-up area per floor, sq ft */
  areaPerFloor: number
  /** Total built-up area, sq ft */
  area: number
  costs: Record<FinishTier, number>
}

const TIER_KEYS: ReadonlyArray<FinishTier> = ['basic', 'standard', 'premium', 'luxury']

/**
 * Single-floor sizes are area × rate. G+1 rows take the area as per floor: the ground floor is
 * priced at the full rate and the upper floor without the site preparation and foundation share
 * (GROUND_ONLY_PERCENT), the same logic as the cost guides.
 */
export function buildSizeCostRows(r: CityRates): ReadonlyArray<SizeCostRow> {
  const upperFactor = (100 - GROUND_ONLY_PERCENT) / 100
  const single = [1000, 1200, 1500, 2000].map((area): SizeCostRow => ({
    key: String(area),
    label: `${area.toLocaleString('en-IN')} sq ft`,
    areaPerFloor: area,
    area,
    costs: Object.fromEntries(TIER_KEYS.map((t) => [t, area * r[t]])) as Record<FinishTier, number>,
  }))
  const g1 = [1000, 1200, 1500].map((perFloor): SizeCostRow => ({
    key: `g1-${perFloor}`,
    label: `G+1 · ${perFloor.toLocaleString('en-IN')} per floor`,
    areaPerFloor: perFloor,
    area: perFloor * 2,
    costs: Object.fromEntries(
      TIER_KEYS.map((t) => [t, Math.round(perFloor * r[t] * (1 + upperFactor))]),
    ) as Record<FinishTier, number>,
  }))
  return [...single, ...g1]
}

/** Nearby cities that are not in the same state. */
const NEARBY: Record<string, ReadonlyArray<string>> = {
  delhi: ['gurgaon', 'noida', 'ghaziabad', 'jaipur', 'dehradun', 'ludhiana', 'chandigarh'],
  gurgaon: ['delhi', 'noida', 'ghaziabad'],
  noida: ['delhi', 'gurgaon', 'ghaziabad'],
  ghaziabad: ['delhi', 'noida', 'greater-noida'],
  jaipur: ['delhi', 'agra', 'ahmedabad'],
  chandigarh: ['ludhiana', 'dehradun', 'delhi', 'gurgaon'],
  ludhiana: ['chandigarh', 'delhi'],
  dehradun: ['chandigarh', 'delhi', 'ghaziabad'],
  kolkata: ['patna', 'ranchi', 'bhubaneswar'],
  patna: ['varanasi', 'ranchi', 'lucknow', 'kolkata'],
  ranchi: ['patna', 'kolkata', 'bhubaneswar', 'raipur'],
  raipur: ['nagpur', 'bhubaneswar', 'ranchi'],
  bhubaneswar: ['kolkata', 'ranchi', 'visakhapatnam'],
  visakhapatnam: ['bhubaneswar', 'hyderabad'],
  hyderabad: ['visakhapatnam', 'bangalore'],
  kochi: ['coimbatore', 'madurai', 'chennai'],
  coimbatore: ['kochi', 'bangalore', 'madurai'],
  madurai: ['kochi', 'coimbatore', 'chennai'],
  chennai: ['bangalore', 'coimbatore', 'madurai'],
  bangalore: ['chennai', 'hyderabad', 'mysore'],
  indore: ['bhopal', 'ahmedabad', 'nagpur'],
  bhopal: ['indore', 'nagpur'],
  agra: ['delhi', 'jaipur', 'lucknow'],
  ahmedabad: ['indore', 'jaipur', 'mumbai'],
  nagpur: ['raipur', 'bhopal', 'indore'],
}

const TOP_METROS = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune']

const RELATED_CITY_LIMIT = 8

/** Same-state cities first, then nearby cities, then the top metros. */
export function getRelatedCities(slug: string): ReadonlyArray<CityContent> {
  const self = CITY_BY_SLUG.get(slug)
  if (!self) return []
  const ordered = [
    ...CITY_CONTENT.filter((c) => c.state === self.state).map((c) => c.slug),
    ...(NEARBY[slug] ?? []),
    ...TOP_METROS,
  ]
  const seen = new Set<string>([slug])
  const out: Array<CityContent> = []
  for (const s of ordered) {
    const c = CITY_BY_SLUG.get(s)
    if (!c || seen.has(s)) continue
    seen.add(s)
    out.push(c)
    if (out.length === RELATED_CITY_LIMIT) break
  }
  return out
}

export function buildCityFaqs(content: CityContent): ReadonlyArray<FaqItem> {
  const r = getCityRates(content.city)
  if (!r) return []

  const cost1000 = r.standard * 1000
  const cost1500 = r.standard * 1500
  const cost2000 = r.standard * 2000

  const faqs: Array<FaqItem> = [
    {
      q: `What is the construction cost per sq ft in ${content.city} in 2026?`,
      a: `In ${content.city}, the standard-quality construction rate is ${formatRupees(r.standard)}/sq ft. Basic finish is ${formatRupees(r.basic)}/sq ft, premium is ${formatRupees(r.premium)}/sq ft, and luxury is ${formatRupees(r.luxury)}/sq ft. The source and its date are listed at the bottom of this page.`,
    },
    {
      q: `How much does it cost to build a 1000 sq ft house in ${content.city}?`,
      a: `A 1000 sq ft standard-quality house in ${content.city} costs approximately ₹${(cost1000 / 100000).toFixed(1)} lakh. Budget around ₹${((r.basic * 1000) / 100000).toFixed(1)} lakh for basic finish, ₹${((r.premium * 1000) / 100000).toFixed(1)} lakh for premium, and ₹${((r.luxury * 1000) / 100000).toFixed(1)} lakh for luxury. This is civil construction cost only; land and government approvals are separate.`,
    },
    {
      q: `What is the 1500 sq ft house construction cost in ${content.city}?`,
      a: `A 1500 sq ft standard house in ${content.city} costs approximately ₹${(cost1500 / 100000).toFixed(1)} lakh. Premium quality can cost around ₹${((r.premium * 1500) / 100000).toFixed(1)} lakh, while luxury quality can reach ₹${((r.luxury * 1500) / 100000).toFixed(1)} lakh. Keep a 10% contingency for design changes and unforeseen expenses.`,
    },
    {
      q: `What is the cost to build a 2000 sq ft duplex in ${content.city}?`,
      a: `A 2000 sq ft standard house in ${content.city} costs approximately ₹${(cost2000 / 100000).toFixed(1)} lakh at the single-floor rate. For a G+1 house with 1,000 sq ft per floor, the size table above shows the cost at each finish. The upper floor is priced without site preparation and foundation, which are paid for once on the ground floor.`,
    },
    {
      q: `What share of construction cost is labour in ${content.city}?`,
      a: `JK Cement's construction budgeting guide (23 Dec 2025) puts labour at roughly 25-30% of a house construction budget. The split in ${content.city} depends on the specification and contract type, so ask contractors to quote material and labour separately before you compare.`,
    },
    {
      q: `What is included and excluded in construction cost in ${content.city}?`,
      a: `A typical ${content.city} quote includes civil structure (foundation, slab, columns, walls), basic electrical/plumbing rough-in, doors and windows, basic flooring, and labour. It excludes modular kitchen, false ceiling, AC, premium fittings, landscaping, compound wall, and government approval fees.`,
    },
  ]

  const northBangalore = getCityRates('North Bangalore')
  if (northBangalore && (content.slug === 'bangalore' || content.slug === 'north-bangalore')) {
    faqs.splice(1, 0, {
      q: 'What is the house construction cost in North Bangalore?',
      a: `North Bangalore areas such as Yelahanka, Hebbal outskirts, Devanahalli, Hennur, and Thanisandra typically cost around ${formatRupees(northBangalore.standard)}/sq ft for standard finish, ${formatRupees(northBangalore.basic)}/sq ft basic, and ${formatRupees(northBangalore.premium)}/sq ft premium. Borewell, soil, and approval costs vary by layout.`,
    })
  }

  return faqs
}
