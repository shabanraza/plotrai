import {
  CITY_RATES,
  CONSTRUCTION_LAST_UPDATED,
  STAGES,
  type FinishTier,
} from '#/data/construction-cost-rates'

/**
 * Cost articles whose rupee figures are derived from CITY_RATES so they never drift from the
 * construction cost calculator. Interior and tax figures are quoted from the cited sources.
 */

const CITY_NAMES = Object.keys(CITY_RATES).filter((c) => c !== 'Other')

/** Lowest and highest ₹/sq ft across tracked cities for a finish tier. */
export function tierBand(tier: FinishTier) {
  const rates = CITY_NAMES.map((c) => CITY_RATES[c][tier])
  return { min: Math.min(...rates), max: Math.max(...rates) }
}

/** Share of a single-storey build that is not repeated for each extra floor (site + foundation). */
export const GROUND_ONLY_PERCENT = STAGES.filter((s) =>
  ['site', 'foundation'].includes(s.key),
).reduce((sum, s) => sum + s.percent, 0)

export function lakh(rupees: number) {
  return `₹${(rupees / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })}L`
}

function rupees(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

/** Compact range, e.g. "₹17.5–24L". */
export function costRange(sqft: number, tier: FinishTier, factor = 1) {
  const { min, max } = tierBand(tier)
  return `${lakh(sqft * min * factor).slice(0, -1)}–${lakh(sqft * max * factor).slice(1)}`
}

export function rateRange(tier: FinishTier) {
  const { min, max } = tierBand(tier)
  return `${rupees(min)}–${rupees(max)}/sq ft`
}

const TIERS: ReadonlyArray<[FinishTier, string]> = [
  ['basic', 'Basic'],
  ['standard', 'Standard'],
  ['premium', 'Premium'],
]

const RATE_NOTE = `Plotr Ai construction rate benchmarks for ${CITY_NAMES.length} cities, ${CONSTRUCTION_LAST_UPDATED}. Civil construction only; excludes land, approvals and interiors.`

const PLOTRAI_RATES_SOURCE = {
  label: `Plotr Ai construction cost calculator (city rates, ${CONSTRUCTION_LAST_UPDATED})`,
  url: 'https://plotrai.in/construction-cost-calculator',
}

const UPPER_FLOOR_FACTOR = (100 - GROUND_ONLY_PERCENT) / 100

function plotCostTable(groundSqft: number) {
  return {
    columns: ['Finish', 'Ground floor', 'G+1'],
    rows: TIERS.map(([tier, label]) => [
      label,
      costRange(groundSqft, tier),
      costRange(groundSqft * 2, tier),
    ]),
  }
}


function rangeOf(lo: number, hi: number) {
  return `${lakh(lo).slice(0, -1)}–${lakh(hi).slice(1)}`
}

/** Cost range for several floors at once, e.g. a ground floor plus an upper floor. */
function multiFloorRange(
  floors: ReadonlyArray<readonly [sqft: number, factor: number]>,
  tier: FinishTier,
) {
  const { min, max } = tierBand(tier)
  const sum = (rate: number) => floors.reduce((t, [sqft, factor]) => t + sqft * rate * factor, 0)
  return rangeOf(sum(min), sum(max))
}

/** Cost of one city at one tier, as a single figure. */
function cityCost(city: string, sqft: number, tier: FinishTier) {
  return lakh(sqft * CITY_RATES[city][tier])
}

/** JK Cement (23 Dec 2025): labour is about a quarter to 30% of total cost. */
export const LABOUR_SHARE = { low: 0.25, high: 0.3 } as const

export function labourPerSqft(tier: FinishTier) {
  const { min, max } = tierBand(tier)
  return {
    low: Math.round(min * LABOUR_SHARE.low),
    high: Math.round(max * LABOUR_SHARE.high),
  }
}

function labourRateRange(tier: FinishTier) {
  const { low, high } = labourPerSqft(tier)
  return `${rupees(low)}–${rupees(high)}/sq ft`
}

/** Lowest basic rate across tracked cities. Used as a ceiling for village builds. */
export const VILLAGE_CEILING = (() => {
  const rate = tierBand('basic').min
  const city = CITY_NAMES.find((c) => CITY_RATES[c].basic === rate) ?? ''
  return { rate, city }
})()

const SQM_TO_SQFT = 10.7639
export const PMAY_G_SQFT = Math.round(25 * SQM_TO_SQFT)
const PMAY_G_PLAINS = 120000
const PMAY_G_HILLS = 130000

function pmayShare(grant: number) {
  return `${Math.round((grant / (PMAY_G_SQFT * VILLAGE_CEILING.rate)) * 100)}%`
}

const THREE_BHK_SIZES = [1200, 1400, 1500, 1600] as const

export const COST_BLOG_ARTICLES = [
  {
    slug: 'construction-cost-per-floor',
    path: '/blog/construction-cost-per-floor',
    title: 'Construction cost per floor in India (2026)',
    description:
      'How much one floor of a house costs to build in India in 2026, why the ground floor costs more than upper floors, and a per-floor budget table by finish tier.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-02',
    dateModified: '2026-11-02',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `${costRange(1000, 'standard')} per 1,000 sq ft floor`,
      supporting: `Standard finish, ground floor, across ${CITY_NAMES.length} Indian cities. Upper floors cost roughly ${100 - GROUND_ONLY_PERCENT}% of that.`,
    },
    sections: [
      {
        heading: 'Cost per floor starts with built-up area × rate',
        paragraphs: [
          `A floor's civil cost is its built-up area multiplied by the per-sq-ft rate for your city and finish. Across the cities we track, 2026 rates run ${rateRange('basic')} for basic finish, ${rateRange('standard')} for standard and ${rateRange('premium')} for premium.`,
          'Built-up area includes walls and balconies, so it is usually 15–20% more than the carpet area you will actually use. Always price on built-up area.',
        ],
        table: {
          columns: ['Finish', 'Per sq ft', '1,000 sq ft'],
          rows: TIERS.map(([tier, label]) => {
            const { min, max } = tierBand(tier)
            return [label, `₹${min.toLocaleString('en-IN')}–${max.toLocaleString('en-IN')}`, costRange(1000, tier)]
          }),
        },
      },
      {
        heading: 'Why the ground floor costs more than upper floors',
        paragraphs: [
          `In our stage-wise model, site preparation (${STAGES.find((s) => s.key === 'site')?.percent}%) and foundation (${STAGES.find((s) => s.key === 'foundation')?.percent}%) make up ${GROUND_ONLY_PERCENT}% of a single-storey build. Those costs are paid once, on the ground floor.`,
          `An upper floor reuses the foundation, so as a planning estimate it costs about ${100 - GROUND_ONLY_PERCENT}% of the ground floor at the same finish. The foundation must still be designed for the final number of floors from day one — upgrading it later is far more expensive.`,
        ],
        table: {
          columns: ['1,000 sq ft', 'Ground floor', 'Upper floor'],
          rows: TIERS.map(([tier, label]) => [
            label,
            costRange(1000, tier),
            costRange(1000, tier, UPPER_FLOOR_FACTOR),
          ]),
        },
      },
      {
        heading: 'What a per-floor rate leaves out',
        paragraphs: [
          'Per-sq-ft rates cover civil work, basic electrical and plumbing, flooring and paint. Budget separately for the items below.',
        ],
        bullets: [
          'Building plan approval and municipal fees.',
          'Staircase headroom, lift shaft, or terrace waterproofing on the top floor.',
          'Modular kitchen, wardrobes, false ceiling and other interiors.',
          'Borewell, sump, compound wall and gate.',
          'A 10% contingency for price changes and site surprises.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the construction cost per floor in India in 2026?',
        a: `For a 1,000 sq ft floor, expect about ${costRange(1000, 'standard')} at standard finish (${rateRange('standard')}). Basic finish is ${costRange(1000, 'basic')} and premium is ${costRange(1000, 'premium')}.`,
      },
      {
        q: 'Is the first floor cheaper to build than the ground floor?',
        a: `Usually yes. The ground floor carries site preparation and foundation, about ${GROUND_ONLY_PERCENT}% of a single-storey cost in our model, so an upper floor at the same finish costs roughly ${100 - GROUND_ONLY_PERCENT}% as much.`,
      },
      {
        q: 'Can I add a floor later?',
        a: 'Only if the foundation and columns were designed for it. Ask your structural engineer to design for the final number of floors before construction starts.',
      },
    ],
    relatedTools: ['/construction-cost-calculator', '/material-calculator', '/rcc-slab-calculator', '/brick-calculator', '/steel-calculator', '/tiles-calculator', '/home-interior-cost-calculator'],
    relatedArticles: ['2bhk-house-construction-cost', '30x40-house-construction-cost', 'steel-price-house-construction'],
    sources: [
      PLOTRAI_RATES_SOURCE,
      {
        label: 'CPWD Plinth Area Rates 2023 (Data Bank copy)',
        url: 'https://d2facr2wyrkyod.cloudfront.net/Data+Bank/CPWD+PAR/PAR 2023 print copy.pdf',
      },
    ],
  },
  {
    slug: '2bhk-house-construction-cost',
    path: '/blog/2bhk-house-construction-cost',
    title: '2BHK house construction cost in India (2026)',
    description:
      'What it costs to build a 2BHK house in India in 2026 — built-up area, per-sq-ft rates by finish, a cost table for 800 to 1,100 sq ft, and what is not included.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-02',
    dateModified: '2026-11-02',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `${costRange(900, 'standard')} for a 900 sq ft 2BHK`,
      supporting: `Standard finish, civil construction only, across ${CITY_NAMES.length} Indian cities.`,
    },
    sections: [
      {
        heading: 'How big is a 2BHK house?',
        paragraphs: [
          'An independent 2BHK — two bedrooms, a hall, a kitchen, and one or two bathrooms — usually needs 800–1,100 sq ft of built-up area. The lower end fits a compact family home; the upper end allows a second bathroom, a utility area and a small balcony.',
        ],
      },
      {
        heading: '2BHK construction cost by size and finish',
        paragraphs: [
          `The table multiplies built-up area by our 2026 city rate bands. The low figure is the cheapest tracked city; the high figure is Mumbai-level pricing.`,
        ],
        table: {
          columns: ['Sq ft', 'Basic', 'Standard', 'Premium'],
          rows: [800, 900, 1000, 1100].map((sqft) => [
            sqft.toLocaleString('en-IN'),
            costRange(sqft, 'basic'),
            costRange(sqft, 'standard'),
            costRange(sqft, 'premium'),
          ]),
        },
      },
      {
        heading: 'Where the money goes',
        paragraphs: [
          'In our stage-wise split, the RCC structure and the foundation together take about a third of the budget. Finishing — tiles, doors, windows and paint — takes almost another third.',
        ],
        table: {
          columns: ['Stage', 'Share of cost'],
          rows: STAGES.map((s) => [s.label, `${s.percent}%`]),
        },
      },
      {
        heading: 'Not included in these numbers',
        paragraphs: ['Add these on top of the construction estimate.'],
        bullets: [
          'Land and its stamp duty and registration.',
          'Plan approval fees and utility connections.',
          'Interiors: modular kitchen, wardrobes, false ceiling.',
          'Compound wall, gate, borewell and sump.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does it cost to build a 2BHK house in India?',
        a: `A 900 sq ft 2BHK costs about ${costRange(900, 'standard')} at standard finish in 2026, ${costRange(900, 'basic')} at basic finish, and ${costRange(900, 'premium')} at premium finish. Land, approvals and interiors are extra.`,
      },
      {
        q: 'How many sq ft is needed for a 2BHK house?',
        a: 'Usually 800–1,100 sq ft of built-up area, depending on whether you want one or two bathrooms and a balcony.',
      },
      {
        q: 'Can I build a 2BHK for ₹10 lakh?',
        a: `Only a small one at basic finish in a lower-cost city. At ${rateRange('basic')}, ₹10 lakh covers roughly ${Math.floor(1000000 / tierBand('basic').max / 10) * 10}–${Math.floor(1000000 / tierBand('basic').min / 10) * 10} sq ft.`,
      },
    ],
    relatedTools: ['/construction-cost-calculator', '/material-calculator', '/floor-plan-3d', '/brick-calculator', '/steel-calculator', '/tiles-calculator', '/home-interior-cost-calculator'],
    relatedArticles: ['3bhk-house-construction-cost', 'construction-cost-per-floor', '2bhk-3bhk-interior-cost', '30x40-house-construction-cost'],
    sources: [PLOTRAI_RATES_SOURCE],
  },
  {
    slug: '30x40-house-construction-cost',
    path: '/blog/30x40-house-construction-cost',
    title: '30x40 house construction cost in India (2026)',
    description:
      'Construction cost for a 30x40 (1,200 sq ft) plot in 2026: ground floor and G+1 budgets by finish, how setbacks change built-up area, and what to add on top.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-02',
    dateModified: '2026-11-02',
    readingTime: '5 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `${costRange(1000, 'standard')} ground floor`,
      supporting: 'Standard finish on about 1,000 sq ft built-up per floor on a 30x40 plot.',
    },
    sections: [
      {
        heading: 'A 30x40 plot is 1,200 sq ft — but you build less per floor',
        paragraphs: [
          'A 30x40 site measures 1,200 sq ft (about 133 gaj). Local building bye-laws require front, rear and side setbacks, so the built-up area per floor is usually lower. We use about 1,000 sq ft per floor for budgeting.',
          'Setbacks and the permitted FAR differ by city and plot width. Check your sanctioned plan before you finalise the budget.',
        ],
      },
      {
        heading: '30x40 house cost by finish',
        paragraphs: [`${RATE_NOTE}`],
        table: plotCostTable(1000),
      },
      {
        heading: 'Typical layouts on 30x40',
        paragraphs: [
          'A ground floor of about 1,000 sq ft fits a comfortable 2BHK with parking in the front setback. G+1 gives a 3BHK or two independent 2BHK units — a common choice when one floor is rented out.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the construction cost of a 30x40 house?',
        a: `With about 1,000 sq ft built-up per floor, the ground floor costs ${costRange(1000, 'standard')} at standard finish in 2026, and G+1 costs ${costRange(2000, 'standard')}.`,
      },
      {
        q: 'How many sq ft is a 30x40 site?',
        a: '1,200 sq ft, or about 133 square yards (gaj).',
      },
    ],
    relatedTools: ['/construction-cost-calculator', '/plot-converter', '/vastu-checker'],
    relatedArticles: ['30x40-house-plan', '30x50-house-construction-cost', 'construction-cost-per-floor'],
    sources: [PLOTRAI_RATES_SOURCE],
  },
  {
    slug: '30x50-house-construction-cost',
    path: '/blog/30x50-house-construction-cost',
    title: '30x50 house construction cost in India (2026)',
    description:
      'Construction cost for a 30x50 (1,500 sq ft) plot in 2026: ground floor and G+1 budgets by finish, setback impact on built-up area, and common layouts.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-02',
    dateModified: '2026-11-02',
    readingTime: '5 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `${costRange(1250, 'standard')} ground floor`,
      supporting: 'Standard finish on about 1,250 sq ft built-up per floor on a 30x50 plot.',
    },
    sections: [
      {
        heading: 'A 30x50 plot is 1,500 sq ft',
        paragraphs: [
          'A 30x50 site measures 1,500 sq ft (about 167 gaj). After setbacks, about 1,250 sq ft per floor is a reasonable budgeting figure, but your sanctioned plan decides the real number.',
        ],
      },
      {
        heading: '30x50 house cost by finish',
        paragraphs: [`${RATE_NOTE}`],
        table: plotCostTable(1250),
      },
      {
        heading: 'Typical layouts on 30x50',
        paragraphs: [
          'About 1,250 sq ft per floor fits a 3BHK on the ground floor, or a 2BHK plus a home office. G+1 is a popular duplex size for a single family.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the construction cost of a 30x50 house?',
        a: `With about 1,250 sq ft built-up per floor, the ground floor costs ${costRange(1250, 'standard')} at standard finish in 2026, and G+1 costs ${costRange(2500, 'standard')}.`,
      },
      {
        q: 'How many sq ft is a 30x50 site?',
        a: '1,500 sq ft, or about 167 square yards (gaj).',
      },
    ],
    relatedTools: ['/construction-cost-calculator', '/plot-converter', '/floor-plan-3d'],
    relatedArticles: ['30x40-house-construction-cost', 'duplex-house-design', 'construction-cost-per-floor'],
    sources: [PLOTRAI_RATES_SOURCE],
  },
  {
    slug: '2bhk-3bhk-interior-cost',
    path: '/blog/2bhk-3bhk-interior-cost',
    title: '2BHK and 3BHK interior design cost in India (2026)',
    description:
      'What 2BHK and 3BHK interiors cost in India in 2026 by city tier and package, what the quotes include, and how to keep the budget under control.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-02',
    dateModified: '2026-11-02',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Interior cost guide',
      stat: '₹8–13L for a metro 2BHK',
      supporting: 'Published 2026 price ranges from interior firms. Your quote depends on scope, finish and city.',
    },
    sections: [
      {
        heading: '2BHK interior cost by city tier',
        paragraphs: [
          'NoBroker Interiors (updated August 2026) quotes these averages for a full 2BHK interior: kitchen, wardrobes, TV unit, and basic false ceiling and lighting.',
        ],
        table: {
          columns: ['City tier', '2BHK interior'],
          rows: [
            ['Metro', '₹8–13 lakh'],
            ['Tier-2 city', '₹6–10 lakh'],
            ['Tier-3 town', '₹4.5–8 lakh'],
          ],
        },
      },
      {
        heading: '3BHK interior cost by package',
        paragraphs: [
          'NoBroker groups 3BHK interiors into three packages. Livspace (July 2026) quotes ₹15–35 lakh for a 3BHK in Mumbai and ₹12–25 lakh in Bengaluru.',
        ],
        table: {
          columns: ['Package', '3BHK interior'],
          rows: [
            ['Basic', '₹7–11 lakh'],
            ['Balanced', '₹12–19 lakh'],
            ['Luxury', '₹20–28 lakh'],
          ],
        },
      },
      {
        heading: 'Check what the quote includes',
        paragraphs: [
          'Two quotes with the same total can cover very different work. Before comparing, ask each firm for a room-wise list.',
        ],
        bullets: [
          'Is 18% GST included or added on top?',
          'Is loose furniture (sofa, beds, dining) included? Livspace lists it separately.',
          'Are appliances, lights and curtains part of the quote?',
          'What material is used for carcass and shutters (BWP plywood, HDHMR, MDF)?',
          'Warranty period on modules and hardware.',
        ],
      },
      {
        heading: 'Where to save without regret',
        paragraphs: [
          'Spend on the kitchen and wardrobes, which are hard to redo. Save on decorative false ceilings, feature walls and loose furniture, which you can add later.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does 2BHK interior design cost in India?',
        a: 'About ₹8–13 lakh in metros, ₹6–10 lakh in tier-2 cities and ₹4.5–8 lakh in tier-3 towns, according to NoBroker Interiors (2026).',
      },
      {
        q: 'How much does 3BHK interior design cost?',
        a: 'Roughly ₹7–11 lakh for a basic package, ₹12–19 lakh for a balanced one and ₹20–28 lakh for luxury (NoBroker, 2026). Livspace quotes ₹12–25 lakh in Bengaluru and ₹15–35 lakh in Mumbai.',
      },
      {
        q: 'Is GST charged on interior design?',
        a: 'Yes. Interior work is billed with 18% GST. Ask whether it is included in the quoted price.',
      },
    ],
    relatedTools: ['/interior-restyle', '/floor-plan-3d', '/construction-cost-calculator'],
    relatedArticles: ['modular-kitchen-cost-india', 'false-ceiling-cost-per-sq-ft', '2bhk-house-construction-cost'],
    sources: [
      {
        label: 'NoBroker Interiors — budget home interior design (Aug 2026)',
        url: 'https://www.nobroker.in/interiors/design-guides/budget-home-interior-design/',
      },
      {
        label: 'Livspace — 3BHK interior design cost guide (Jul 2026)',
        url: 'https://www.livspace.com/in/magazine/calculate-the-average-cost-of-a-3-bhk-apartment-interior-design',
      },
    ],
  },
  {
    slug: 'home-loan-for-plot',
    path: '/blog/home-loan-for-plot',
    title: 'Home loan for plot purchase in India: rules and tax benefits',
    description:
      'How a plot loan differs from a home loan, what lenders check, and when you can claim tax benefits under Section 24(b) and 80C — with the official Income Tax rules.',
    cluster: 'property-buyer',
    topicHubPath: '/property-buyer-guide',
    datePublished: '2026-11-02',
    dateModified: '2026-11-02',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Property buyer guide',
      stat: 'No tax benefit until the house is built',
      supporting: 'Interest on a plot-only loan qualifies only once a house is constructed on it.',
    },
    sections: [
      {
        heading: 'Plot loan vs home loan',
        paragraphs: [
          'A plot loan (also called a land loan) finances only the purchase of a residential plot. A home loan finances a built or under-construction house. Lenders treat plot loans as riskier, so they usually fund a smaller share of the price and may charge a slightly higher rate.',
          'Many lenders offer a composite "plot + construction" loan: one sanction that pays for the plot first and then releases the construction amount in stages.',
        ],
        table: {
          columns: ['', 'Plot loan', 'Home loan'],
          rows: [
            ['Funds', 'Plot only', 'Built home'],
            ['Share funded', 'Lower', '75–90% (RBI)'],
            ['Farm land', 'Not eligible', '—'],
            ['Tax benefit', 'After building', 'From possession'],
          ],
        },
      },
      {
        heading: 'What lenders check before sanctioning a plot loan',
        paragraphs: ['Most lenders will only finance a plot that can legally be built on.'],
        bullets: [
          'The plot is residential, not agricultural, and inside municipal or development authority limits.',
          'The layout is approved by the local planning authority.',
          'Clear title chain and encumbrance certificate for the required years.',
          'Some lenders require construction to start within a fixed period.',
        ],
      },
      {
        heading: 'Tax benefits: only after construction',
        paragraphs: [
          'Under the Income Tax Act, deductions for home loan interest (Section 24(b)) and principal (Section 80C) relate to a house property. Buying an empty plot alone does not create a house property, so there is no deduction while the land stays vacant.',
          'Once a house is built on the plot, the Income Tax Department allows interest of up to ₹2,00,000 a year on a self-occupied house, provided the loan was for acquisition or construction and the construction is completed within 5 years. Interest paid before completion is deductible in five equal yearly instalments, starting from the year construction is completed.',
          'New tax regime: the Income Tax Department’s New vs Old Regime FAQ states that interest on a self-occupied property is not deductible under Section 115BAC. Confirm with your tax adviser which regime suits you before relying on the deduction.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I get a home loan to buy a plot?',
        a: 'Yes, as a plot loan or a composite plot + construction loan. The plot must usually be residential, in an approved layout and within municipal or development authority limits.',
      },
      {
        q: 'Do I get tax benefits on a plot loan?',
        a: 'Not while the plot is vacant. After you build a house on it, interest becomes deductible under Section 24(b) — up to ₹2 lakh a year for a self-occupied house in the old regime, if construction is completed within 5 years. Pre-construction interest is claimed in five equal instalments.',
      },
      {
        q: 'Can I take a loan for agricultural land?',
        a: 'Not as a home or plot loan. Agricultural land is financed, if at all, through separate farm land loans with different rules.',
      },
    ],
    relatedTools: ['/stamp-duty-calculator', '/construction-cost-calculator', '/plot-converter'],
    relatedArticles: ['property-document-checklist', 'circle-rate-vs-market-rate', 'construction-cost-per-floor'],
    sources: [
      {
        label: 'Income Tax Department — interest on housing loan for self-occupied property',
        url: 'https://wm.incometaxindia.gov.in/w/in-case-of-a-self-occupied-property-how-much-of-interest-on-housing-loan-can-be-claimed-as-deduction-',
      },
      {
        label: 'Income Tax Department — Income from house property',
        url: 'https://www.incometaxindia.gov.in/w/income-from-house-property',
      },
      {
        label: 'Income Tax Department — New vs Old Regime FAQs (AY 2024-25)',
        url: 'https://www.incometax.gov.in/iec/foportal/sites/default/files/2024-07/New%20vs%20Old%20Regime%20FAQs.pdf',
      },
    ],
  },
  {
    slug: '3bhk-house-construction-cost',
    path: '/blog/3bhk-house-construction-cost',
    title: '3BHK house construction cost in India (2026)',
    description:
      'What it costs to build a 3BHK house in India in 2026: built-up area, cost for 1,200 to 1,600 sq ft by finish, single floor vs G+1, five city budgets and what is not included.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `${costRange(1400, 'standard')} for a 1,400 sq ft 3BHK`,
      supporting: `Standard finish, civil construction only, across ${CITY_NAMES.length} Indian cities.`,
    },
    sections: [
      {
        heading: 'How big is a 3BHK house?',
        paragraphs: [
          'An independent 3BHK has three bedrooms, a hall, a kitchen and two or three bathrooms. Plan on about 1,200–1,600 sq ft of built-up area.',
          'Built-up area includes the thickness of walls, balconies and the staircase. Carpet area, the floor you can actually walk on, is usually 15–20% less. Contractors quote on built-up area, so budget on that number.',
        ],
      },
      {
        heading: '3BHK construction cost by size and finish',
        paragraphs: [
          'Each figure is built-up area multiplied by our 2026 city rate band. The low figure is the cheapest city we track; the high figure is the most expensive.',
        ],
        table: {
          columns: ['Sq ft', 'Basic', 'Standard', 'Premium'],
          rows: THREE_BHK_SIZES.map((sqft) => [
            sqft.toLocaleString('en-IN'),
            costRange(sqft, 'basic'),
            costRange(sqft, 'standard'),
            costRange(sqft, 'premium'),
          ]),
        },
      },
      {
        heading: 'Single floor or G+1, and how much land you need',
        paragraphs: [
          'A 3BHK of 1,400 sq ft built on one floor needs a ground footprint of 1,400 sq ft. Split over two floors (G+1), each floor is about 700 sq ft, so you need roughly half the land footprint. Our 30x40 guide budgets about 1,000 sq ft of built-up area per floor on a 30x40 plot, and our 30x50 guide about 1,250 sq ft on a 30x50 plot. Your sanctioned plan decides the real figure.',
          `Going up is also a little cheaper per sq ft. Site preparation and foundation are ${GROUND_ONLY_PERCENT}% of a single-storey cost and are paid only once, so as a planning estimate the upper floor costs about ${100 - GROUND_ONLY_PERCENT}% of the ground floor. Design the foundation for both floors from the start.`,
        ],
        table: {
          columns: ['1,400 sq ft 3BHK', 'Single floor', 'G+1 (700 + 700 sq ft)'],
          rows: TIERS.map(([tier, label]) => [
            label,
            costRange(1400, tier),
            multiFloorRange([[700, 1], [700, UPPER_FLOOR_FACTOR]], tier),
          ]),
        },
      },
      {
        heading: '3BHK cost in Bangalore, Chennai, Hyderabad, Kolkata and Kochi',
        paragraphs: [
          "Rates differ by city. This table prices a 1,400 sq ft 3BHK at each city's own 2026 rates from the calculator. Open the city page for its full per-sq-ft breakdown.",
        ],
        table: {
          columns: ['City', 'Standard rate', 'Basic', 'Standard', 'Premium'],
          rows: ['Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Kochi'].map((city) => [
            city,
            `${rupees(CITY_RATES[city].standard)}/sq ft`,
            cityCost(city, 1400, 'basic'),
            cityCost(city, 1400, 'standard'),
            cityCost(city, 1400, 'premium'),
          ]),
        },
      },
      {
        heading: 'Where the money goes',
        paragraphs: [
          'The table splits a standard-finish 1,400 sq ft 3BHK by construction stage, using our stage-wise model. The RCC structure and the foundation together take about a third of the budget.',
        ],
        table: {
          columns: ['Stage', 'Share of cost', 'On 1,400 sq ft, standard'],
          rows: STAGES.map((s) => [
            s.label,
            `${s.percent}%`,
            costRange(1400, 'standard', s.percent / 100),
          ]),
        },
      },
      {
        heading: 'Plan the materials before you budget',
        paragraphs: [
          'Quantities are the quickest way to sanity-check a contractor quote. Use the brick, steel, tiles, plaster and paint calculators for each element, and the RCC slab calculator for the roof.',
        ],
      },
      {
        heading: 'Not included in these numbers',
        paragraphs: ['Add these on top of the construction estimate.'],
        bullets: [
          'Land, with its stamp duty and registration.',
          'Plan approval fees and utility connections.',
          'Interiors such as modular kitchen, wardrobes and false ceiling. See our 2BHK and 3BHK interior cost guide and the home interior cost calculator.',
          'Compound wall, gate, borewell and sump.',
        ],
      },
      {
        heading: 'Building a 3BHK in a village',
        paragraphs: [
          'Village builds usually cost less than city rates. Our village construction cost guide shows a 1BHK, 2BHK and 3BHK budget and the PMAY-G assistance.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does it cost to build a 3BHK house in India?',
        a: `A 1,400 sq ft 3BHK costs about ${costRange(1400, 'standard')} at standard finish in 2026. Basic finish is ${costRange(1400, 'basic')} and premium is ${costRange(1400, 'premium')}. Land, approvals and interiors are extra.`,
      },
      {
        q: 'How many sq ft is needed for a 3BHK house?',
        a: 'Plan on 1,200–1,600 sq ft of built-up area. The smaller end suits two bathrooms and compact rooms; the larger end gives a third bathroom, a utility area or a balcony.',
      },
      {
        q: 'How much land do I need for a 3BHK?',
        a: 'A 1,400 sq ft 3BHK on a single floor needs a ground footprint of 1,400 sq ft, plus setbacks that your local rules decide. As G+1 it needs about 700 sq ft per floor. Our 30x40 guide budgets about 1,000 sq ft of built-up area per floor on a 30x40 plot.',
      },
      {
        q: 'What is the cost of a 3BHK house in Bangalore and Kerala?',
        a: `At 2026 city rates, a 1,400 sq ft 3BHK at standard finish costs about ${cityCost('Bangalore', 1400, 'standard')} in Bangalore and ${cityCost('Kochi', 1400, 'standard')} in Kochi. Basic finish is ${cityCost('Bangalore', 1400, 'basic')} in Bangalore and ${cityCost('Kochi', 1400, 'basic')} in Kochi.`,
      },
      {
        q: 'Is it cheaper to build a 3BHK on one floor or G+1?',
        a: `G+1 is a little cheaper for the same built-up area. Site preparation and foundation (${GROUND_ONLY_PERCENT}% of a single-storey cost) are paid once, so an upper floor costs about ${100 - GROUND_ONLY_PERCENT}% of the ground floor. At standard finish, 1,400 sq ft costs ${costRange(1400, 'standard')} on one floor and ${multiFloorRange([[700, 1], [700, UPPER_FLOOR_FACTOR]], 'standard')} as G+1.`,
      },
      {
        q: 'How much do interiors cost on top of a 3BHK build?',
        a: 'Interiors are a separate budget. NoBroker Interiors (2026) quotes ₹7–11 lakh for a basic 3BHK package and ₹20–28 lakh for luxury. See our 2BHK and 3BHK interior cost guide for the sources.',
      },
    ],
    relatedTools: [
      '/construction-cost-calculator',
      '/brick-calculator',
      '/steel-calculator',
      '/tiles-calculator',
      '/plaster-calculator',
      '/paint-calculator',
      '/rcc-slab-calculator',
      '/home-interior-cost-calculator',
      '/construction-cost/bangalore',
      '/construction-cost/chennai',
      '/construction-cost/hyderabad',
      '/construction-cost/kolkata',
      '/construction-cost/kochi',
    ],
    relatedArticles: [
      '2bhk-house-construction-cost',
      '30x40-house-construction-cost',
      '30x50-house-construction-cost',
      '2bhk-3bhk-interior-cost',
      'house-construction-cost-in-village',
    ],
    sources: [
      PLOTRAI_RATES_SOURCE,
      {
        label: 'NoBroker Interiors — budget home interior design (Aug 2026)',
        url: 'https://www.nobroker.in/interiors/design-guides/budget-home-interior-design/',
      },
    ],
  },
  {
    slug: 'labour-cost-house-construction-per-sq-ft',
    path: '/blog/labour-cost-house-construction-per-sq-ft',
    title: 'Labour cost for house construction per sq ft in India (2026)',
    description:
      'Labour cost for house construction per sq ft in India in 2026: labour-only vs material-plus-labour contracts, labour share by finish, brickwork and painting labour rates, GST, and how to check a quote.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `${labourRateRange('standard')} at standard finish`,
      supporting: 'About a quarter to 30% of the total cost, applied to our 2026 city rate band.',
    },
    sections: [
      {
        heading: 'Labour-only vs material-plus-labour contracts',
        paragraphs: [
          'In a labour-only contract you buy the cement, steel, bricks and tiles yourself and pay the contractor only for work. You control quality and brands, but you must manage deliveries and wastage.',
          'In a material-plus-labour contract (a composite or turnkey contract) the contractor supplies both and quotes one per-sq-ft rate. That rate is what most construction cost calculators, including ours, show.',
        ],
      },
      {
        heading: 'Labour cost per sq ft by finish',
        paragraphs: [
          'JK Cement (23 Dec 2025) puts labour at about a quarter to 30% of the total cost of building a house. Other parts of the same page give lower shares, so treat this as a planning range rather than a fixed rule.',
          `We apply that share to our 2026 rate band across ${CITY_NAMES.length} cities. The low figure is 25% of the cheapest city and the high figure is 30% of the most expensive.`,
        ],
        table: {
          columns: ['Finish', 'Total cost per sq ft', 'Labour per sq ft', 'Labour on 1,000 sq ft'],
          rows: TIERS.map(([tier, label]) => {
            const { low, high } = labourPerSqft(tier)
            return [
              label,
              rateRange(tier).replace('/sq ft', ''),
              `${rupees(low)}–${rupees(high)}`,
              rangeOf(low * 1000, high * 1000),
            ]
          }),
        },
      },
      {
        heading: 'Item-wise labour rates published by others',
        paragraphs: [
          'Two published sources give item rates. They are per sq ft of the item (wall or painted area), not per sq ft of built-up area, so do not add them to the table above.',
        ],
        table: {
          columns: ['Item', 'Labour rate', 'Source'],
          rows: [
            ['Brickwork, 4.5 inch wall', '₹35–50/sq ft', 'Houseyog, updated 14 Apr 2026'],
            ['Brickwork, 9 inch wall', '₹50–65/sq ft', 'Houseyog, updated 14 Apr 2026'],
            ['Painting', '₹8–25/sq ft', 'Asian Paints, undated'],
          ],
        },
      },
      {
        heading: 'Plaster and tiling labour',
        paragraphs: [
          'We have no dated, cited labour rate for plaster or tiling, so we do not print one. Get the quantity first with the plaster and tiles calculators, then ask two or three local contractors for their rate per sq ft.',
        ],
      },
      {
        heading: 'GST on labour',
        paragraphs: [
          'A pure labour contract for construction of a single residential unit that is not part of a residential complex is exempt from GST under Entry 11 of Notification No. 12/2017 (Rate), dated 29 June 2017.',
          'Composite contracts, where the contractor supplies material as well, are taxable. We do not quote a rate here: check the GST rate on the invoice and ask your contractor or a tax adviser how your contract is classified.',
        ],
      },
      {
        heading: 'How to check a labour quote',
        paragraphs: ['Two quotes with the same total can cover very different work. Ask for these in writing.'],
        bullets: [
          'The measurement method: per sq ft of built-up area, wall area, or painted area.',
          'What is included: scaffolding, curing, water, electricity, cleaning and debris removal.',
          'Stage-wise payments tied to finished work (foundation, slab, brickwork, plaster) rather than dates.',
          'Who pays for rework and wastage.',
          'A retention of part of the payment until handover.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the labour cost for house construction per sq ft in India?',
        a: `Using JK Cement's figure of about a quarter to 30% of total cost, labour is roughly ${labourRateRange('basic')} at basic finish, ${labourRateRange('standard')} at standard and ${labourRateRange('premium')} at premium, across our 2026 city rate band.`,
      },
      {
        q: 'What is the labour rate for brickwork per sq ft?',
        a: 'Houseyog (updated 14 Apr 2026) lists ₹35–50 per sq ft for a 4.5 inch wall and ₹50–65 per sq ft for a 9 inch wall.',
      },
      {
        q: 'How much does painting labour cost per sq ft?',
        a: 'Asian Paints gives a painting labour range of ₹8–25 per sq ft. Its page is undated, so confirm the current rate locally.',
      },
      {
        q: 'Is GST charged on labour for house construction?',
        a: 'A pure labour contract for a single residential unit that is not part of a residential complex is exempt under Entry 11 of Notification 12/2017 (Rate). Composite contracts that include material are taxable, so check the rate on the invoice.',
      },
      {
        q: 'Should I choose a labour-only or a material-plus-labour contract?',
        a: 'Labour-only gives you control over materials and brands but needs you to manage purchases and wastage. A composite contract is simpler but harder to compare line by line. Ask for a quote on both and compare with our construction cost calculator.',
      },
    ],
    relatedTools: [
      '/construction-cost-calculator',
      '/brick-calculator',
      '/plaster-calculator',
      '/tiles-calculator',
      '/paint-calculator',
      '/material-calculator',
    ],
    relatedArticles: [
      '2bhk-house-construction-cost',
      '3bhk-house-construction-cost',
      'construction-cost-per-floor',
    ],
    sources: [
      PLOTRAI_RATES_SOURCE,
      {
        label: 'JK Cement — house construction cost in India (23 Dec 2025)',
        url: 'https://www.jkcement.com/blog/construction-budgeting/house-construction-cost-india/',
      },
      {
        label: 'Houseyog — brickwork labour rate per sq ft (updated 14 Apr 2026)',
        url: 'https://www.houseyog.com/blog/brickwork-labour-rate-per-sq-ft-india/',
      },
      {
        label: 'Asian Paints — painting cost per sq ft (undated)',
        url: 'https://www.asianpaints.com/blogs/painting-cost-per-sq-ft-india.html',
      },
      {
        label: 'Notification No. 12/2017 (Rate), 29 Jun 2017, Entry 11 pure labour contracts (MahaGST copy)',
        url: 'https://www.mahagst.gov.in/public/uploads/mvatservices/17689058070.%20Notification%20No.%2012-2017-%20State%20Tax%20(Rate)%20dated%2029-06-2017.pdf',
      },
    ],
  },
  {
    slug: 'house-construction-cost-in-village',
    path: '/blog/house-construction-cost-in-village',
    title: 'House construction cost in village (2026): 1BHK, 2BHK and 3BHK budgets',
    description:
      'House construction cost in a village in 2026: 1BHK, 2BHK and 3BHK budget ceilings, a 1,000 sq ft and 30x40 estimate, PMAY-G assistance, low-cost building choices and approvals.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'Construction cost guide',
      stat: `Up to ${lakh(1000 * VILLAGE_CEILING.rate)} for 1,000 sq ft`,
      supporting: `A ceiling, not a quote: our lowest basic city rate, ${rupees(VILLAGE_CEILING.rate)}/sq ft (${VILLAGE_CEILING.city}).`,
    },
    sections: [
      {
        heading: 'Why village costs differ from city costs',
        paragraphs: [
          'We have no official rural construction rate. Our rates cover cities only, so we use the lowest basic-finish city rate as a clearly labelled ceiling. Village builds usually come in at or below this figure.',
          'Costs are usually lower because land is cheaper, labour rates are often lower and designs are simpler. They can be higher if cement, steel and sand have to travel a long way to a remote site.',
        ],
      },
      {
        heading: '1BHK, 2BHK and 3BHK budget ceiling',
        paragraphs: [
          `Each figure is built-up area multiplied by ${rupees(VILLAGE_CEILING.rate)} per sq ft, the lowest basic rate we track (${VILLAGE_CEILING.city}, ${CONSTRUCTION_LAST_UPDATED}). Treat it as an upper limit for a basic-finish home, not a quote.`,
        ],
        table: {
          columns: ['Home', 'Built-up area', 'Budget ceiling'],
          rows: (
            [
              ['1BHK', 400],
              ['2BHK', 700],
              ['3BHK', 1100],
            ] as const
          ).map(([label, sqft]) => [
            label,
            `${sqft.toLocaleString('en-IN')} sq ft`,
            lakh(sqft * VILLAGE_CEILING.rate),
          ]),
        },
      },
      {
        heading: '1,000 sq ft and 30x40 house in a village',
        paragraphs: [
          `A 1,000 sq ft house costs up to ${lakh(1000 * VILLAGE_CEILING.rate)} on the same basis. A 30x40 plot is 1,200 sq ft; after setbacks our 30x40 guide budgets about 1,000 sq ft of built-up area per floor, so the same ceiling applies to one floor. Check what your gram panchayat allows on your plot.`,
        ],
      },
      {
        heading: 'PMAY-G assistance',
        paragraphs: [
          'The Union Cabinet approved implementation of the Pradhan Mantri Awaas Yojana (Gramin) for FY 2024-25 to 2028-29. Unit assistance is ₹1.20 lakh in plain areas and ₹1.30 lakh in North-Eastern and hill states. The minimum house size is 25 sq m, and toilet assistance of up to ₹12,000 is available through SBM-G.',
          `Worked example: 25 sq m is about ${PMAY_G_SQFT} sq ft. At ${rupees(VILLAGE_CEILING.rate)} per sq ft that is a ceiling of ${lakh(PMAY_G_SQFT * VILLAGE_CEILING.rate)}. The ₹1.20 lakh grant covers about ${pmayShare(PMAY_G_PLAINS)} of it and the ₹1.30 lakh grant about ${pmayShare(PMAY_G_HILLS)}. Eligibility is decided by the scheme; check with your gram panchayat.`,
        ],
      },
      {
        heading: 'Low-cost building choices',
        paragraphs: [
          'The CBRI PAHAL compendium is a reference from a government research institute on building technologies for affordable housing. Ask a local engineer which options suit your soil, climate and available materials.',
        ],
        bullets: [
          'Keep the plan simple: a compact rectangle uses less wall and roof.',
          'Use locally available walling material where it is suitable.',
          'Build the part you need now, but design the foundation for any floor you plan to add.',
          'Do not cut corners on foundation, steel cover and roof waterproofing.',
        ],
      },
      {
        heading: 'Approvals in a village',
        paragraphs: [
          'Most villages need permission from the gram panchayat before you build. Confirm the land-use status first: agricultural land usually needs conversion before a house can be built on it. Rules and fees differ by state, so ask your panchayat office for the current process.',
        ],
      },
      {
        heading: 'Materials checklist',
        paragraphs: [
          'Work out quantities before ordering. Use the brick, steel, tiles, plaster and paint calculators, and the material calculator for cement and sand. If you want rooftop solar, price it with the solar panel cost calculator.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the cost of building a house in a village?',
        a: `We have no official rural rate. Using our lowest basic city rate of ${rupees(VILLAGE_CEILING.rate)}/sq ft as a ceiling, a 700 sq ft 2BHK costs up to ${lakh(700 * VILLAGE_CEILING.rate)}. Village builds usually come in at or below this.`,
      },
      {
        q: 'What is the cost of a 1,000 sq ft house in a village?',
        a: `Up to about ${lakh(1000 * VILLAGE_CEILING.rate)} at basic finish, using our lowest city basic rate as a ceiling. Your actual cost depends on materials, transport and labour in your area.`,
      },
      {
        q: 'How much does a 30x40 house cost in a village?',
        a: `A 30x40 plot is 1,200 sq ft. With about 1,000 sq ft built up, the ceiling is ${lakh(1000 * VILLAGE_CEILING.rate)} at basic finish.`,
      },
      {
        q: 'How much money does PMAY-G give for a house?',
        a: 'The unit assistance is ₹1.20 lakh in plain areas and ₹1.30 lakh in North-Eastern and hill states, for FY 2024-25 to 2028-29. The minimum house size is 25 sq m, and toilet assistance of up to ₹12,000 is available through SBM-G.',
      },
      {
        q: 'Does PMAY-G cover the full cost of a house?',
        a: `No. For a 25 sq m house at our ${rupees(VILLAGE_CEILING.rate)}/sq ft ceiling, the ₹1.20 lakh grant covers about ${pmayShare(PMAY_G_PLAINS)} of the cost.`,
      },
      {
        q: 'Do I need permission to build a house in a village?',
        a: 'Usually from the gram panchayat, and the land must be of a use that allows housing. Rules differ by state, so check with your panchayat office.',
      },
    ],
    relatedTools: [
      '/construction-cost-calculator',
      '/brick-calculator',
      '/steel-calculator',
      '/tiles-calculator',
      '/plaster-calculator',
      '/paint-calculator',
      '/material-calculator',
      '/solar-panel-cost-calculator',
    ],
    relatedArticles: [
      '3bhk-house-construction-cost',
      '2bhk-house-construction-cost',
      '30x40-house-construction-cost',
      'labour-cost-house-construction-per-sq-ft',
    ],
    sources: [
      PLOTRAI_RATES_SOURCE,
      {
        label: 'PMO — Cabinet approves PMAY-G for FY 2024-25 to 2028-29',
        url: 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-implementation-of-the-pradhan-mantri-awaas-yojana-gramin-pmay-g-during-fy-2024-25-to-2028-29/',
      },
      {
        label: 'myScheme — Pradhan Mantri Awaas Yojana Gramin',
        url: 'https://myscheme.gov.in/schemes/pmay-g',
      },
      {
        label: 'CBRI — PAHAL compendium',
        url: 'https://cbri.res.in/wp-content/uploads/2020/11/pahal.pdf',
      },
    ],
  },
] as const
