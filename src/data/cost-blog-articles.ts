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
function costRange(sqft: number, tier: FinishTier, factor = 1) {
  const { min, max } = tierBand(tier)
  return `${lakh(sqft * min * factor).slice(0, -1)}–${lakh(sqft * max * factor).slice(1)}`
}

function rateRange(tier: FinishTier) {
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
    relatedTools: ['/construction-cost-calculator', '/material-calculator', '/rcc-slab-calculator'],
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
    relatedTools: ['/construction-cost-calculator', '/material-calculator', '/floor-plan-3d'],
    relatedArticles: ['construction-cost-per-floor', '2bhk-3bhk-interior-cost', '30x40-house-construction-cost'],
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
] as const
