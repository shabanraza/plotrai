import type { FaqItem } from '#/lib/seo'
import { convertLandArea, type UnitKey } from '#/lib/plot-units'

/**
 * Programmatic unit-pair pages served at /convert/{slug}.
 *
 * Basis:
 * - 'exact'      — fixed by the metric/imperial definition (sq yd = 9 sq ft, acre = 43,560 sq ft).
 * - 'definition' — fixed as a fraction of an acre in revenue usage (cent = 1/100 acre,
 *                  gunta = 1/40 acre, kanal = 1/8 acre, marla = 1/160 acre).
 * - 'convention' — local unit whose size varies by state/district (bigha, ground). We show the
 *                  commonly cited value plus regional variants and tell users to confirm on their
 *                  land record. No official government table was found for these (checked 2026-11-02).
 */
export type UnitBasis = 'exact' | 'definition' | 'convention'

export interface SourceRef {
  label: string
  url: string
}

export interface UnitVariant {
  region: string
  sqft: number
  note?: string
  source: SourceRef
}

export interface UnitPairPage {
  slug: string
  from: UnitKey
  to: UnitKey
  /** Short unit names as people search them ("gaj", "sq ft"). */
  fromShort: string
  toShort: string
  /** Region the default factor applies to, for units whose size varies ("UP"). */
  fromQualifier?: string
  /** Values shown in the quick-reference table, in `from` units. */
  commonValues: ReadonlyArray<number>
  basis: UnitBasis
  basisNote: string
  intro: string
  variants?: ReadonlyArray<UnitVariant>
  /** State-specific page: put the qualifier in the title and H1 ("Bigha to sq ft in Bihar"). */
  stateInTitle?: boolean
  /** The unit whose size varies by state, when it is the `to` unit ("gaj to bigha"). */
  variantUnit?: string
}

export const LAND_UNIT_PAGES_LAST_REVIEWED = '2026-11-06'

const BIGHA_VARIANTS: ReadonlyArray<UnitVariant> = [
  {
    region: 'Uttar Pradesh (pucca)',
    sqft: 27000,
    note: 'Some districts use 27,225 sq ft; kachha bigha is about one-third.',
    source: {
      label: 'L&T Realty',
      url: 'https://www.lntrealty.com/blogs/bigha-to-square-feet-conversion-guide',
    },
  },
  {
    region: 'Bihar',
    sqft: 27220,
    note: '1 bigha = 20 katha.',
    source: {
      label: 'Kotak Mahindra Bank',
      url: 'https://www.kotak.bank.in/en/stories-in-focus/loans/home-loan/understanding-bigha-in-india-convert-to-square-feet-acres-and-hectares.html',
    },
  },
  {
    region: 'Rajasthan (pucca)',
    sqft: 27225,
    source: {
      label: 'Tata Capital',
      url: 'https://www.tatacapital.com/calculator/bigha-to-square-feet.html',
    },
  },
  {
    region: 'Rajasthan (kachha)',
    sqft: 17424,
    source: {
      label: 'Tata Capital',
      url: 'https://www.tatacapital.com/calculator/bigha-to-square-feet.html',
    },
  },
  {
    region: 'West Bengal',
    sqft: 14400,
    note: '1 bigha = 20 katha of 720 sq ft.',
    source: {
      label: 'Kotak Mahindra Bank',
      url: 'https://www.kotak.bank.in/en/stories-in-focus/loans/home-loan/understanding-bigha-in-india-convert-to-square-feet-acres-and-hectares.html',
    },
  },
]

/** Biswa is 1/20 of the local bigha in UP, Rajasthan and Bihar usage, so it varies with it. */
const BISWA_SOURCE: SourceRef = {
  label: 'Bajaj Finserv (1 bigha = 20 biswa)',
  url: 'https://www.bajajfinserv.in/bigha-to-biswa',
}

const BISWA_VARIANTS: ReadonlyArray<UnitVariant> = BIGHA_VARIANTS.filter((v) =>
  /Uttar Pradesh|Bihar|Rajasthan/.test(v.region),
).map((v) => ({
  region: v.region,
  sqft: v.sqft / 20,
  note: `1/20 of a ${v.sqft.toLocaleString('en-IN')} sq ft bigha.`,
  source: BISWA_SOURCE,
}))

const BIGHA_UP_NOTE =
  'Uses the common UP bigha of 27,000 sq ft. Bigha has no single national size, so check the state table and confirm the size used on your khatauni or sale deed.'

const ACRE_FRACTION_NOTE = (fraction: string) =>
  `Fixed as ${fraction} of an acre (1 acre = 43,560 sq ft) in revenue usage, so the value is exact.`

export const LAND_UNIT_PAGES: ReadonlyArray<UnitPairPage> = [
  {
    slug: 'gaj-to-sq-ft',
    from: 'sqyd',
    to: 'sqft',
    fromShort: 'gaj',
    toShort: 'sq ft',
    commonValues: [1, 50, 100, 120, 150, 200, 250, 300, 500, 1000],
    basis: 'exact',
    basisNote: '1 gaj is 1 square yard, which is exactly 9 square feet (3 ft × 3 ft).',
    intro:
      'Gaj is the everyday name for a square yard in North India, used for plots in Delhi, UP, Haryana, Punjab and Rajasthan. Multiply gaj by 9 to get square feet.',
  },
  {
    slug: 'sq-ft-to-gaj',
    from: 'sqft',
    to: 'sqyd',
    fromShort: 'sq ft',
    toShort: 'gaj',
    commonValues: [450, 600, 900, 1000, 1200, 1350, 1500, 1800, 2000, 2400],
    basis: 'exact',
    basisNote: '1 square foot is 1/9 of a square yard (gaj).',
    intro:
      'Builders quote flats in square feet while plot dealers in North India quote in gaj. Divide square feet by 9 to get gaj.',
  },
  {
    slug: 'acre-to-sq-ft',
    from: 'acre',
    to: 'sqft',
    fromShort: 'acre',
    toShort: 'sq ft',
    commonValues: [0.25, 0.5, 1, 2, 2.5, 5, 10],
    basis: 'exact',
    basisNote: '1 acre is exactly 43,560 square feet.',
    intro:
      'The acre is used across India for agricultural and large plots. One acre is 43,560 square feet.',
  },
  {
    slug: 'acre-to-gaj',
    from: 'acre',
    to: 'sqyd',
    fromShort: 'acre',
    toShort: 'gaj',
    commonValues: [0.25, 0.5, 1, 2, 5, 10],
    basis: 'exact',
    basisNote: '1 acre is exactly 4,840 square yards (gaj).',
    intro:
      'When agricultural land is cut into residential plots in North India, acres are converted into gaj. One acre is 4,840 gaj.',
  },
  {
    slug: 'hectare-to-acre',
    from: 'hectare',
    to: 'acre',
    fromShort: 'hectare',
    toShort: 'acre',
    commonValues: [0.5, 1, 2, 5, 10, 25, 100],
    basis: 'exact',
    basisNote: '1 hectare is 10,000 square metres, about 2.471 acres.',
    intro:
      'Government land records and many state revenue documents use hectares, while buyers think in acres. One hectare is about 2.47 acres.',
  },
  {
    slug: 'sq-m-to-sq-ft',
    from: 'sqm',
    to: 'sqft',
    fromShort: 'sq m',
    toShort: 'sq ft',
    commonValues: [10, 50, 60, 90, 100, 150, 200, 500],
    basis: 'exact',
    basisNote: '1 square metre is about 10.764 square feet (1 m = 3.2808 ft).',
    intro:
      'RERA filings and sale deeds often state carpet area in square metres. Multiply by 10.764 to get square feet.',
  },
  {
    slug: 'marla-to-sq-ft',
    from: 'marla',
    to: 'sqft',
    fromShort: 'marla',
    toShort: 'sq ft',
    commonValues: [1, 3, 5, 8, 10, 15, 20],
    basis: 'definition',
    basisNote: `${ACRE_FRACTION_NOTE('1/160')} Some urban schemes use a smaller 225 sq ft marla — check your allotment letter.`,
    intro:
      'Marla is the standard plot unit in Punjab, Haryana, Himachal and J&K. In revenue records 1 marla = 272.25 sq ft and 20 marla make 1 kanal.',
  },
  {
    slug: 'kanal-to-sq-ft',
    from: 'kanal',
    to: 'sqft',
    fromShort: 'kanal',
    toShort: 'sq ft',
    commonValues: [0.5, 1, 2, 4, 8],
    basis: 'definition',
    basisNote: ACRE_FRACTION_NOTE('1/8'),
    intro:
      'Kanal is used in Punjab, Haryana and J&K for larger plots. 1 kanal = 20 marla = 5,445 sq ft, and 8 kanal make an acre.',
  },
  {
    slug: 'gunta-to-sq-ft',
    from: 'gunta',
    to: 'sqft',
    fromShort: 'gunta',
    toShort: 'sq ft',
    commonValues: [1, 2, 5, 10, 20, 40],
    basis: 'definition',
    basisNote: ACRE_FRACTION_NOTE('1/40'),
    intro:
      'Gunta (or guntha) is used for land in Karnataka, Maharashtra, Telangana and Andhra Pradesh. 40 gunta make 1 acre, so 1 gunta = 1,089 sq ft.',
  },
  {
    slug: 'cent-to-sq-ft',
    from: 'cent',
    to: 'sqft',
    fromShort: 'cent',
    toShort: 'sq ft',
    commonValues: [1, 3, 5, 10, 20, 50, 100],
    basis: 'definition',
    basisNote: ACRE_FRACTION_NOTE('1/100'),
    intro:
      'Cent is the common plot unit in Kerala and Tamil Nadu. 100 cents make 1 acre, so 1 cent = 435.6 sq ft.',
  },
  {
    slug: 'bigha-to-sq-ft',
    from: 'bigha_uttar',
    to: 'sqft',
    fromShort: 'bigha',
    toShort: 'sq ft',
    fromQualifier: 'UP',
    commonValues: [0.5, 1, 2, 5, 10],
    basis: 'convention',
    basisNote:
      'Bigha has no single national size. The calculator uses the common UP value of 27,000 sq ft; see the state table for other regions and confirm the size used on your khatauni or sale deed.',
    intro:
      'Bigha is a traditional land unit in UP, Bihar, Rajasthan, MP, West Bengal and Assam, but its size changes from state to state and even between districts.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'bigha-to-acre',
    from: 'bigha_uttar',
    to: 'acre',
    fromShort: 'bigha',
    toShort: 'acre',
    fromQualifier: 'UP',
    commonValues: [1, 2, 5, 10, 20],
    basis: 'convention',
    basisNote:
      'Uses the common UP bigha of 27,000 sq ft (about 0.62 acre). Other states differ — see the state table and confirm on your land record.',
    intro:
      'Farmland is often sold in bigha but financed and valued in acres. Because bigha size varies by state, the acre figure depends on where the land is.',
    variants: BIGHA_VARIANTS,
  },
  // Exact and acre-fraction pairs
  {
    slug: 'sq-ft-to-sq-m',
    from: 'sqft',
    to: 'sqm',
    fromShort: 'sq ft',
    toShort: 'sq m',
    commonValues: [100, 500, 1000, 1200, 1500, 2000, 2400],
    basis: 'exact',
    basisNote: '1 square foot is about 0.0929 square metres (1 ft = 0.3048 m).',
    intro:
      'Flats are sold in square feet, but RERA registrations, sale deeds and building plans often use square metres. Divide square feet by 10.764 to get square metres.',
  },
  {
    slug: 'sq-ft-to-acre',
    from: 'sqft',
    to: 'acre',
    fromShort: 'sq ft',
    toShort: 'acre',
    commonValues: [1000, 5000, 10000, 21780, 43560, 100000],
    basis: 'exact',
    basisNote: '1 acre is exactly 43,560 square feet.',
    intro:
      'Plot layouts and farmhouse plots are often measured in square feet but priced per acre. Divide square feet by 43,560 to get acres.',
  },
  {
    slug: 'gaj-to-sq-m',
    from: 'sqyd',
    to: 'sqm',
    fromShort: 'gaj',
    toShort: 'sq m',
    commonValues: [50, 100, 150, 200, 250, 300, 500],
    basis: 'exact',
    basisNote: '1 gaj (square yard) is about 0.8361 square metres.',
    intro:
      'Plots in North India are quoted in gaj, while development authority maps and building byelaws use square metres. Multiply gaj by 0.836 to get square metres.',
  },
  {
    slug: 'sq-ft-to-cent',
    from: 'sqft',
    to: 'cent',
    fromShort: 'sq ft',
    toShort: 'cent',
    commonValues: [500, 1000, 1500, 2000, 2400, 4356, 5000],
    basis: 'definition',
    basisNote: ACRE_FRACTION_NOTE('1/100'),
    intro:
      'In Kerala and Tamil Nadu, land is sold in cents while houses are planned in square feet. 1 cent = 435.6 sq ft, so divide square feet by 435.6.',
  },
  // UP bigha and biswa pairs
  {
    slug: 'sq-ft-to-bigha',
    variantUnit: 'bigha',
    from: 'sqft',
    to: 'bigha_uttar',
    fromShort: 'sq ft',
    toShort: 'bigha',
    commonValues: [1000, 5000, 10000, 13500, 27000, 54000],
    basis: 'convention',
    basisNote: BIGHA_UP_NOTE,
    intro:
      'In Uttar Pradesh a pucca bigha is commonly taken as 27,000 sq ft, so divide square feet by 27,000. The size differs in other states and some UP districts.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'bigha-to-gaj',
    from: 'bigha_uttar',
    to: 'sqyd',
    fromShort: 'bigha',
    toShort: 'gaj',
    fromQualifier: 'UP',
    commonValues: [0.5, 1, 2, 5, 10],
    basis: 'convention',
    basisNote: BIGHA_UP_NOTE,
    intro:
      'When farmland is cut into residential plots in UP, bigha are converted into gaj. A 27,000 sq ft UP bigha is 3,000 gaj.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'gaj-to-bigha',
    variantUnit: 'bigha',
    from: 'sqyd',
    to: 'bigha_uttar',
    fromShort: 'gaj',
    toShort: 'bigha',
    commonValues: [100, 500, 1000, 1500, 3000, 6000],
    basis: 'convention',
    basisNote: BIGHA_UP_NOTE,
    intro:
      'Plot buyers in UP often need to know what share of a bigha their gaj plot is. With a 27,000 sq ft bigha, 3,000 gaj make 1 bigha.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'bigha-to-hectare',
    from: 'bigha_uttar',
    to: 'hectare',
    fromShort: 'bigha',
    toShort: 'hectare',
    fromQualifier: 'UP',
    commonValues: [1, 2, 5, 10, 20],
    basis: 'convention',
    basisNote: BIGHA_UP_NOTE,
    intro:
      'Revenue records and government schemes use hectares, while sellers quote bigha. A 27,000 sq ft UP bigha is about 0.25 hectare.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'bigha-to-biswa',
    from: 'bigha_uttar',
    to: 'biswa_uttar',
    fromShort: 'bigha',
    toShort: 'biswa',
    commonValues: [0.25, 0.5, 1, 2, 5, 10],
    basis: 'convention',
    basisNote:
      '1 bigha = 20 biswa wherever biswa is used, so this ratio holds whatever the local bigha size is.',
    intro:
      'Biswa is the smaller unit used with bigha in UP, Rajasthan and Haryana. 20 biswa make a bigha, and 20 biswansi make a biswa.',
    variants: BISWA_VARIANTS,
  },
  {
    slug: 'biswa-to-sq-ft',
    from: 'biswa_uttar',
    to: 'sqft',
    fromShort: 'biswa',
    toShort: 'sq ft',
    fromQualifier: 'UP',
    commonValues: [1, 2, 5, 10, 15, 20],
    basis: 'convention',
    basisNote:
      'Uses 1/20 of the common 27,000 sq ft UP bigha. Biswa follows the local bigha, so check the state table and your land record.',
    intro:
      'Small plots in UP villages and peri-urban areas are often sold in biswa. With a 27,000 sq ft bigha, 1 biswa is 1,350 sq ft.',
    variants: BISWA_VARIANTS,
  },
  {
    slug: 'gaj-to-biswa',
    variantUnit: 'biswa',
    from: 'sqyd',
    to: 'biswa_uttar',
    fromShort: 'gaj',
    toShort: 'biswa',
    commonValues: [50, 100, 150, 200, 500, 1000],
    basis: 'convention',
    basisNote:
      'Uses a UP biswa of 1,350 sq ft (1/20 of a 27,000 sq ft bigha), which is 150 gaj.',
    intro:
      'Plot dealers in UP often quote gaj for land that the khatauni records in biswa. 150 gaj make 1 biswa on the common UP bigha.',
    variants: BISWA_VARIANTS,
  },
  // State bigha pages
  {
    slug: 'bigha-to-sq-ft-bihar',
    from: 'bigha_bihar',
    to: 'sqft',
    fromShort: 'bigha',
    toShort: 'sq ft',
    fromQualifier: 'Bihar',
    stateInTitle: true,
    commonValues: [0.5, 1, 2, 5, 10],
    basis: 'convention',
    basisNote:
      'Uses 27,220 sq ft, the commonly cited Bihar bigha of 20 katha. Some districts differ, so confirm the size on your khatiyan or sale deed.',
    intro:
      'In Bihar, 1 bigha = 20 katha and 1 katha = 20 dhur. The commonly cited bigha is about 27,220 sq ft, though katha size changes between districts.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'bigha-to-sq-ft-rajasthan',
    from: 'bigha_rajasthan',
    to: 'sqft',
    fromShort: 'bigha',
    toShort: 'sq ft',
    fromQualifier: 'Rajasthan',
    stateInTitle: true,
    commonValues: [0.5, 1, 2, 5, 10],
    basis: 'convention',
    basisNote:
      'Uses the pucca bigha of 27,225 sq ft (165 × 165 ft). A kachha bigha is 17,424 sq ft, so confirm which one your jamabandi uses.',
    intro:
      'Rajasthan uses two bighas: the pucca bigha of 27,225 sq ft (165 ft × 165 ft) and the smaller kachha bigha of 17,424 sq ft. Each has 20 biswa.',
    variants: BIGHA_VARIANTS,
  },
  {
    slug: 'bigha-to-sq-ft-west-bengal',
    from: 'bigha_west_bengal',
    to: 'sqft',
    fromShort: 'bigha',
    toShort: 'sq ft',
    fromQualifier: 'West Bengal',
    stateInTitle: true,
    commonValues: [0.5, 1, 2, 5, 10],
    basis: 'convention',
    basisNote:
      'Uses 14,400 sq ft: 20 katha of 720 sq ft each. Confirm the area on your khatian or sale deed.',
    intro:
      'West Bengal’s bigha is about half the size of the UP or Rajasthan bigha. 1 bigha = 20 katha, and 1 katha = 720 sq ft, so 1 bigha = 14,400 sq ft.',
    variants: BIGHA_VARIANTS,
  },
]

export const LAND_UNIT_PAGE_BY_SLUG = new Map(
  LAND_UNIT_PAGES.map((p) => [p.slug, p] as const),
)

export function convertForPage(page: UnitPairPage, value: number) {
  return convertLandArea(value, page.from, page.to)
}

/** Factor for one `from` unit expressed in `to` units. */
export function pageFactor(page: UnitPairPage) {
  return convertForPage(page, 1)
}

export function formatArea(n: number) {
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return '0'
  if (Math.abs(n) >= 1000) return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  if (Math.abs(n) >= 1) return Number(n.toFixed(3)).toString()
  return Number(n.toFixed(4)).toString()
}

/** "1 bigha (UP)" or "1 gaj". */
export function qualifiedUnit(page: UnitPairPage, amount: number | string) {
  return `${amount} ${page.fromShort}${page.fromQualifier ? ` (${page.fromQualifier})` : ''}`
}

/** Name of the unit whose size the state table shows. */
export function variantUnit(page: UnitPairPage) {
  return page.variantUnit ?? page.fromShort
}

export function pageTitle(page: UnitPairPage) {
  const base = `${capitalize(page.fromShort)} to ${capitalize(page.toShort)}`
  return page.stateInTitle && page.fromQualifier ? `${base} in ${page.fromQualifier}` : base
}

export function buildUnitPageFaqs(page: UnitPairPage): ReadonlyArray<FaqItem> {
  const one = formatArea(pageFactor(page))
  const sample = page.commonValues.find((v) => v >= 10) ?? page.commonValues.at(-1) ?? 1
  const faqs: Array<FaqItem> = [
    {
      q: `How many ${page.toShort} are in 1 ${page.fromShort}?`,
      a: `${qualifiedUnit(page, 1)} = ${one} ${page.toShort}. ${page.basisNote}`,
    },
    {
      q: `How many ${page.toShort} are in ${sample} ${page.fromShort}?`,
      a: `${qualifiedUnit(page, sample)} = ${formatArea(convertForPage(page, sample))} ${page.toShort}.`,
    },
    {
      q: `How do I convert ${page.fromShort} to ${page.toShort}?`,
      a: `Multiply the number of ${page.fromShort} by ${one} to get ${page.toShort}.`,
    },
  ]
  if (page.variants) {
    faqs.push({
      q: `Is 1 ${variantUnit(page)} the same size in every state?`,
      a: `No. ${page.variants.map((v) => `${v.region}: ${v.sqft.toLocaleString('en-IN')} sq ft`).join('; ')}. Always confirm the size used on your land record.`,
    })
  }
  return faqs
}

function capitalize(s: string) {
  return s.replace(/^\w/, (c) => c.toUpperCase())
}
