import type { FaqItem } from '#/lib/seo'

export type BlogCluster = 'property-buyer' | 'house-design' | 'materials-cost'

export type BlogSlug =
  | 'property-document-checklist'
  | 'rera-project-search-guide'
  | 'circle-rate-vs-market-rate'
  | 'stamp-duty-registration-charges-india'
  | '30x40-house-plan'
  | 'north-facing-house-plan'
  | 'duplex-house-design'
  | 'floor-plan-to-3d-ai-guide'
  | 'steel-price-house-construction'
  | 'cement-vs-rmc'
  | 'false-ceiling-cost-per-sq-ft'
  | 'modular-kitchen-cost-india'

export type TopicHubPath =
  | '/property-buyer-guide'
  | '/house-design'
  | '/construction-materials'

export type BlogToolPath =
  | '/construction-cost-calculator'
  | '/material-calculator'
  | '/stamp-duty-calculator'
  | '/floor-plan-3d'
  | '/interior-restyle'
  | '/plot-converter'
  | '/property-capital-gains-calculator'
  | '/indexation-calculator'
  | '/vastu-checker'
  | '/bbmp-property-tax-calculator'
  | '/ghmc-property-tax-calculator'
  | '/mcd-property-tax-calculator'
  | '/concrete-calculator'
  | '/rcc-slab-calculator'

export interface BlogSectionTable {
  columns: ReadonlyArray<string>
  rows: ReadonlyArray<ReadonlyArray<string>>
}

export interface BlogSection {
  heading: string
  paragraphs: ReadonlyArray<string>
  bullets?: ReadonlyArray<string>
  table?: BlogSectionTable
}

export interface BlogHero {
  eyebrow: string
  stat: string
  supporting: string
}

export interface BlogSource {
  label: string
  url: string
}

export interface BlogArticle {
  slug: BlogSlug
  path: `/blog/${BlogSlug}`
  title: string
  description: string
  cluster: BlogCluster
  topicHubPath: TopicHubPath
  datePublished: string
  dateModified: string
  readingTime: string
  hero: BlogHero
  sections: ReadonlyArray<BlogSection>
  faqs: ReadonlyArray<FaqItem>
  relatedTools: ReadonlyArray<BlogToolPath>
  relatedArticles: ReadonlyArray<BlogSlug>
  sources: ReadonlyArray<BlogSource>
}

export interface TopicHub {
  path: TopicHubPath
  title: string
  description: string
  cluster: BlogCluster
  eyebrow: string
  intro: ReadonlyArray<string>
  featuredArticles: ReadonlyArray<BlogSlug>
  featuredTools: ReadonlyArray<BlogToolPath>
  faqs: ReadonlyArray<FaqItem>
}

export const BLOG_TOOL_META: Record<
  BlogToolPath,
  { title: string; description: string }
> = {
  '/construction-cost-calculator': {
    title: 'Construction Cost Calculator',
    description: 'Estimate stage-wise house construction cost by city and finish tier.',
  },
  '/material-calculator': {
    title: 'Material Calculator',
    description: 'Calculate cement, sand, aggregate, brick, and steel quantities.',
  },
  '/stamp-duty-calculator': {
    title: 'Stamp Duty Calculator',
    description: 'Check stamp duty and registration charges by state in India.',
  },
  '/floor-plan-3d': {
    title: 'Floor Plan to 3D',
    description: 'Convert a 2D floor plan into a furnished 3D render.',
  },
  '/interior-restyle': {
    title: 'Interior Restyle',
    description: 'Preview alternate interior styles from a room photo.',
  },
  '/plot-converter': {
    title: 'Plot Area Converter',
    description: 'Convert between Indian land units like gaj, marla, and bigha.',
  },
  '/property-capital-gains-calculator': {
    title: 'Capital Gains Calculator',
    description: 'Compare property capital gains tax outcomes across regimes.',
  },
  '/indexation-calculator': {
    title: 'Indexation Calculator',
    description: 'Work out indexed cost using Cost Inflation Index values.',
  },
  '/vastu-checker': {
    title: 'Vastu Checker',
    description: 'Score a home layout against practical Vastu rules and remedies.',
  },
  '/bbmp-property-tax-calculator': {
    title: 'BBMP Property Tax Calculator',
    description: 'Estimate Bangalore property tax using a simplified planning model.',
  },
  '/ghmc-property-tax-calculator': {
    title: 'GHMC Property Tax Calculator',
    description: 'Estimate Hyderabad residential property tax before portal payment.',
  },
  '/mcd-property-tax-calculator': {
    title: 'MCD Property Tax Calculator',
    description: 'Estimate Delhi property tax from visible residential inputs.',
  },
  '/concrete-calculator': {
    title: 'Concrete Calculator',
    description: 'Estimate concrete ingredients for PCC and site-mix jobs.',
  },
  '/rcc-slab-calculator': {
    title: 'RCC Slab Calculator',
    description: 'Calculate slab material quantities for reinforced concrete work.',
  },
}

export const BLOG_ARTICLES: ReadonlyArray<BlogArticle> = [
  {
    slug: 'property-document-checklist',
    path: '/blog/property-document-checklist',
    title: 'Property Document Checklist in India Before You Buy',
    description:
      'A practical property document checklist for Indian homebuyers covering title, approvals, tax receipts, RERA, and possession risks.',
    cluster: 'property-buyer',
    topicHubPath: '/property-buyer-guide',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '8 min read',
    hero: {
      eyebrow: 'Property Buyer Guide',
      stat: '10 essential checks',
      supporting: 'Reduce title, approval, and payment surprises before token money.',
    },
    sections: [
      {
        heading: 'Start with ownership and title clarity',
        paragraphs: [
          'The first job is to verify who actually owns the property and whether they have the right to sell it. Sale deed, parent title chain, and mutation or khata records together tell you whether the current seller is the legal owner or only an occupant with partial paperwork.',
          'Buyers often jump straight to price negotiation, but the better order is title first, approvals second, and payment last. If the chain of title is patchy, a cheaper deal can become impossible to finance, insure, or resell later.',
        ],
        bullets: [
          'Ask for the latest registered sale deed and the prior title chain.',
          'Cross-check the owner name against tax records, khata or mutation, and possession documents.',
          'If the seller is acting through a power of attorney, verify the original authorization and its current validity.',
        ],
      },
      {
        heading: 'Match approvals to the actual building on site',
        paragraphs: [
          'A property can look complete and still have approval problems. For apartments, compare sanctioned plan, commencement approvals, occupancy or completion status, and RERA disclosures with what exists on the ground.',
          'For independent houses or plotted construction, local sanction, setback compliance, and completion evidence matter because future regularization can be expensive or uncertain.',
        ],
        table: {
          columns: ['Document', 'Why it matters'],
          rows: [
            ['Sale deed', 'Shows legal transfer history and ownership basis.'],
            ['Sanctioned plan', 'Confirms the structure was approved, not improvised later.'],
            ['Occupancy or completion proof', 'Reduces risk around utilities, handover, and resale.'],
            ['Property tax receipt', 'Shows the local body record is active and current.'],
            ['RERA details', 'Helps validate project status, promoter, and timeline disclosures.'],
          ],
        },
      },
      {
        heading: 'Check financial and possession risk before paying a token',
        paragraphs: [
          'Ask whether the property is mortgaged, involved in litigation, or sold with pending society dues or unpaid utility bills. These are not rare edge cases. They are routine cleanup items that can become your problem if you skip them.',
          'Before paying token money, decide who will hold it, what triggers refund, and which missing documents must be produced before the next payment milestone. Good paperwork is not only legal hygiene. It is negotiation leverage.',
        ],
        bullets: [
          'Request an encumbrance search or equivalent debt and charge confirmation.',
          'Collect the latest maintenance, electricity, water, and tax clearance proofs.',
          'Write refund triggers into the token or booking receipt if due diligence fails.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which property document is the most important before buying?',
        a: 'The registered title deed is the anchor document, but it is not enough alone. Buyers should also verify the title chain, approvals, tax records, and RERA or completion status before paying a token.',
      },
      {
        q: 'Should I check RERA even for a ready-to-move apartment?',
        a: 'Yes. RERA helps confirm the promoter, project details, and disclosures. For ready inventory, it is still useful to compare what was promised against approvals and actual handover status.',
      },
      {
        q: 'Can home-loan approval replace legal due diligence?',
        a: 'No. Bank approval is helpful, but it does not replace your own document review. Some issues matter to your resale or possession risk even if a lender is willing to fund the property.',
      },
    ],
    relatedTools: [
      '/stamp-duty-calculator',
      '/property-capital-gains-calculator',
      '/bbmp-property-tax-calculator',
    ],
    relatedArticles: [
      'rera-project-search-guide',
      'circle-rate-vs-market-rate',
    ],
    sources: [
      {
        label: 'MahaRERA project search',
        url: 'https://maharera.maharashtra.gov.in/projects-search-result',
      },
      {
        label: 'Karnataka RERA projects',
        url: 'https://rera.karnataka.gov.in/viewAllProjects?language=en',
      },
      {
        label: 'UP RERA projects',
        url: 'https://uprera.azurewebsites.net/View_projects.aspx',
      },
    ],
  },
  {
    slug: 'rera-project-search-guide',
    path: '/blog/rera-project-search-guide',
    title: 'How to Use RERA Project Search Before Booking a Property',
    description:
      'A step-by-step RERA project search guide for Indian buyers to verify builders, project phase, approvals, and delivery signals.',
    cluster: 'property-buyer',
    topicHubPath: '/property-buyer-guide',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'Property Buyer Guide',
      stat: '4-step builder check',
      supporting: 'Validate the project before you lock a booking form or token payment.',
    },
    sections: [
      {
        heading: 'Use RERA search to confirm the project actually exists as advertised',
        paragraphs: [
          'Search the project by promoter name, project name, or registration number on the relevant state portal. Your goal is not just to see a listing. You want to compare the portal entry with the brochure, WhatsApp pitch, and site visit claims.',
          'If the name, phase, or promoter entity differs, slow down. Many buyer mistakes start with assuming the marketing brand and the legally registered project are the same thing.',
        ],
        bullets: [
          'Match the exact phase, tower, or block you are being sold.',
          'Check whether the project status is active, expired, or updated with delays.',
          'Review the promoter entity name instead of relying only on the brand name.',
        ],
      },
      {
        heading: 'Read the disclosures, not only the headline registration',
        paragraphs: [
          'The strongest value in RERA is the disclosure layer. You can inspect completion timelines, approval references, and in many states the project documents uploaded by the promoter.',
          'This helps you separate a routine delay from a pattern of non-disclosure. If construction progress, approvals, or completion dates are thin or stale, treat that as a real signal, not an administrative detail.',
        ],
        table: {
          columns: ['What to compare', 'Why it matters'],
          rows: [
            ['Registration number', 'Confirms the exact legal project record.'],
            ['Completion date', 'Shows whether the delivery promise is still realistic.'],
            ['Promoter name', 'Helps identify the accountable legal entity.'],
            ['Uploaded approvals', 'Supports claims about sanction and execution.'],
          ],
        },
      },
      {
        heading: 'Pair RERA search with document and cost checks',
        paragraphs: [
          'RERA search is a high-signal filter, but it is not the whole due diligence stack. After the portal check, continue with title documents, payment plan review, and a realistic cash-flow estimate including stamp duty and registration.',
          'That sequence gives you a cleaner go or no-go decision. First confirm the project identity, then confirm legality, then confirm affordability.',
        ],
        bullets: [
          'Move next to the property document checklist before paying a booking amount.',
          'Estimate stamp duty and registration separately from the builder quotation.',
          'Keep screenshots or PDFs of the RERA search result for negotiation and later reference.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I trust a project just because it is on RERA?',
        a: 'No. RERA registration is a strong starting point, not a guarantee of low risk. Buyers should still review documents, approvals, payment terms, and delivery signals.',
      },
      {
        q: 'Which RERA portal should I use?',
        a: 'Use the state portal that covers the project location. RERA is state-level in practice, so Maharashtra, Karnataka, Telangana, and UP all maintain separate search experiences.',
      },
      {
        q: 'What if the project name in the brochure does not match the portal?',
        a: 'Pause and ask for the exact RERA registration details. Differences can be harmless branding, but they can also hide phase confusion or sales claims that do not map cleanly to the legal project record.',
      },
    ],
    relatedTools: [
      '/stamp-duty-calculator',
      '/bbmp-property-tax-calculator',
      '/ghmc-property-tax-calculator',
    ],
    relatedArticles: [
      'property-document-checklist',
      'stamp-duty-registration-charges-india',
    ],
    sources: [
      {
        label: 'Telangana RERA search',
        url: 'https://rerait.telangana.gov.in/SearchList/Search',
      },
      {
        label: 'MahaRERA search',
        url: 'https://maharera.maharashtra.gov.in/projects-search-result',
      },
      {
        label: 'Karnataka RERA projects',
        url: 'https://rera.karnataka.gov.in/viewAllProjects?language=en',
      },
    ],
  },
  {
    slug: 'circle-rate-vs-market-rate',
    path: '/blog/circle-rate-vs-market-rate',
    title: 'Circle Rate vs Market Rate in India: What Buyers Should Know',
    description:
      'Understand the difference between circle rate and market rate, and how it affects stamp duty, registration, and deal negotiation in India.',
    cluster: 'property-buyer',
    topicHubPath: '/property-buyer-guide',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Property Buyer Guide',
      stat: '2 prices to track',
      supporting: 'One affects tax. The other affects the real deal you are negotiating.',
    },
    sections: [
      {
        heading: 'Circle rate is the government floor, not the live market quote',
        paragraphs: [
          'Circle rate, guideline value, or ready reckoner rate is the government benchmark used to prevent under-reporting in property registration. Market rate is the price buyers and sellers are actually agreeing to in that locality at that moment.',
          'The two can be close in some micro-markets and far apart in others. As a buyer, you need both because stamp duty and registration use the higher of the declared value and the government benchmark.',
        ],
        table: {
          columns: ['Term', 'What it controls'],
          rows: [
            ['Circle rate', 'Minimum benchmark for duty and registration calculation.'],
            ['Market rate', 'Actual negotiated sale price in the live market.'],
            ['Agreement value', 'Declared transaction value used in the deed.'],
          ],
        },
      },
      {
        heading: 'Why the gap matters during budgeting',
        paragraphs: [
          'If market rate is lower than circle rate, your registration cost can still be based on the higher government value. That changes the total upfront cash you need even if the negotiation looks attractive on paper.',
          'If market rate is much higher than circle rate, the tax side may feel lighter, but the deal can still stretch affordability because loan eligibility, interiors, and moving costs are tied to the actual spend, not the benchmark.',
        ],
        bullets: [
          'Estimate stamp duty on the higher of the two values.',
          'Check nearby resale data and active listings before treating one broker quote as the market rate.',
          'Use the gap as a negotiation input, especially when the benchmark looks stale.',
        ],
      },
      {
        heading: 'Use the benchmark to ask better questions, not to replace locality research',
        paragraphs: [
          'Circle rate is useful because it gives you a defensible floor for taxes and a sanity check for suspiciously low quotes. It is weaker as a pricing oracle because locality quality, builder brand, floor level, and possession timing can move market value quickly.',
          'The smart approach is simple: verify the benchmark, compare it with current asking rates, then calculate your full registration burden before you commit.',
        ],
        bullets: [
          'Use stamp duty and registration cost as part of your total acquisition budget.',
          'Keep the benchmark printout or portal result when discussing pricing with the seller.',
          'If you are comparing multiple cities, repeat the same math because benchmark behavior changes a lot across states.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is stamp duty always charged on market rate?',
        a: 'No. It is usually charged on the higher of the declared agreement value and the state benchmark such as circle rate or ready reckoner value.',
      },
      {
        q: 'Can market rate be below circle rate?',
        a: 'Yes. That can happen in weak micro-markets, older projects, or distressed sales. Even then, registration cost may still follow the higher benchmark value.',
      },
      {
        q: 'Does circle rate tell me whether the property is fairly priced?',
        a: 'Not by itself. It is a useful floor and tax input, but fair pricing still depends on locality, building condition, supply, and transaction urgency.',
      },
    ],
    relatedTools: [
      '/stamp-duty-calculator',
      '/plot-converter',
      '/property-capital-gains-calculator',
    ],
    relatedArticles: [
      'stamp-duty-registration-charges-india',
      'property-document-checklist',
    ],
    sources: [
      {
        label: 'Delhi circle rate portal',
        url: 'https://revenue.delhi.gov.in/revenue/circle-rates',
      },
      {
        label: 'Maharashtra ready reckoner guidance',
        url: 'https://igrmaharashtra.gov.in/',
      },
    ],
  },
  {
    slug: 'stamp-duty-registration-charges-india',
    path: '/blog/stamp-duty-registration-charges-india',
    title: 'Stamp Duty and Registration Charges in India: Budgeting the Extra Cash',
    description:
      'Understand stamp duty and registration charges in India, why they differ by state, and how to budget them before you finalize a property purchase.',
    cluster: 'property-buyer',
    topicHubPath: '/property-buyer-guide',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'Property Buyer Guide',
      stat: 'Often 4% to 8%+',
      supporting: 'This is usually the biggest cash outflow beyond the property value itself.',
    },
    sections: [
      {
        heading: 'Treat duty and registration as a separate budget bucket',
        paragraphs: [
          'Many buyers focus on booking amount, down payment, and EMI, then discover too late that stamp duty and registration need separate upfront cash. These charges are usually not the kind of surprise you can smooth over with a small buffer.',
          'The exact rate depends on the state, buyer category, and in some cases whether the purchase is individual, joint, or concessional. That is why state-specific calculation matters more than using a generic percentage from memory.',
        ],
        bullets: [
          'Budget the property cost and the government charges separately.',
          'Ask whether women buyer concessions or category rebates apply in your state.',
          'Check whether the benchmark value is higher than the negotiated deal price.',
        ],
      },
      {
        heading: 'Registration charge is not the same as stamp duty',
        paragraphs: [
          'Stamp duty is the tax on the transaction. Registration charge is the fee for recording the deed with the government. Buyers often mention them together because they are paid in the same workflow, but they are distinct line items.',
          'On a purchase day, that distinction matters because the combined outflow is what affects your cash requirement, while the component breakdown explains why two states with similar prices can feel very different at closing time.',
        ],
        table: {
          columns: ['Charge', 'What it represents'],
          rows: [
            ['Stamp duty', 'Transaction tax paid to the state government.'],
            ['Registration charge', 'Fee for legally recording the deed.'],
            ['Benchmark impact', 'The calculation can use the higher government value, not only the deal price.'],
          ],
        },
      },
      {
        heading: 'Calculate first, then align payment milestones',
        paragraphs: [
          'The cleanest workflow is to estimate the charges before you finalize the agreement value. That lets you decide how much cash to keep liquid, whether to move ownership into a woman buyer category where concession applies, and whether your payment milestones need adjustment.',
          'Once you know the likely duty and registration burden, the rest of your transaction planning becomes calmer and more realistic.',
        ],
        bullets: [
          'Use a state-specific calculator before signing the deed.',
          'Confirm the final figures with the sub-registrar or the official portal before payment.',
          'Carry the same estimate into your overall acquisition spreadsheet so you do not underfund the closing day.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are stamp duty and registration charges included in a home loan?',
        a: 'Usually buyers should not assume that. Many transactions require these costs to be arranged separately as upfront cash, even when the property purchase itself is financed.',
      },
      {
        q: 'Why do women buyers sometimes pay less stamp duty?',
        a: 'Many states offer a concession when the property is registered in a woman buyer’s name. The exact concession and eligibility vary by state and ownership structure.',
      },
      {
        q: 'Can the final amount change after I use an online calculator?',
        a: 'Yes. A calculator is a planning tool. Final government demand can still depend on the exact benchmark value, buyer category, deed details, and current state rules.',
      },
    ],
    relatedTools: [
      '/stamp-duty-calculator',
      '/plot-converter',
      '/bbmp-property-tax-calculator',
    ],
    relatedArticles: [
      'circle-rate-vs-market-rate',
      'property-document-checklist',
    ],
    sources: [
      {
        label: 'Maharashtra IGR',
        url: 'https://igrmaharashtra.gov.in/',
      },
      {
        label: 'Karnataka Kaveri services',
        url: 'https://kaveri.karnataka.gov.in/',
      },
    ],
  },
  {
    slug: '30x40-house-plan',
    path: '/blog/30x40-house-plan',
    title: '30x40 House Plan Ideas for Indian Homeowners',
    description:
      'Layout ideas, room priorities, parking tradeoffs, and practical planning tips for a 30x40 house plan in India.',
    cluster: 'house-design',
    topicHubPath: '/house-design',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'House Design Guide',
      stat: '1,200 sq ft plot logic',
      supporting: 'Balance parking, stair placement, ventilation, and future floors without crowding the plan.',
    },
    sections: [
      {
        heading: 'Use the 30x40 plot as a planning envelope, not a promise of built-up area',
        paragraphs: [
          'A 30x40 site is 1,200 square feet on paper, but the useful buildable area depends on setbacks, stair strategy, parking, and whether you need future expansion. That means the best 30x40 plan is the one that respects movement and daylight, not the one that squeezes in the highest room count.',
          'For many urban Indian homes, the real question is not whether you can fit three bedrooms. It is whether you can fit them without wrecking circulation and ventilation.',
        ],
        bullets: [
          'Decide early if ground-floor parking is non-negotiable.',
          'Keep the stair position compatible with future rental or duplex use.',
          'Reserve wall lines and shaft zones so bathrooms and services stack cleanly on later floors.',
        ],
      },
      {
        heading: 'Room allocation works better when priorities are explicit',
        paragraphs: [
          'A 30x40 plan becomes easier when you rank priorities: car parking, one bedroom on ground, puja niche, utility, or rental potential. Without that ranking, plans drift into compromise everywhere.',
          'The strongest small-plot layouts usually keep living and dining generous enough for daily use, while bedrooms stay efficient and bathrooms stack around shared plumbing zones.',
        ],
        table: {
          columns: ['Priority', 'Typical response'],
          rows: [
            ['Parking first', 'Compact living area, stair aligned to one edge.'],
            ['Family living first', 'Reduce ground-floor bedroom count or parking width.'],
            ['Rental future', 'Separate stair and service alignment from day one.'],
          ],
        },
      },
      {
        heading: 'Visual testing helps before you freeze the construction set',
        paragraphs: [
          'Once the rough plan is ready, convert it into a 3D view or at least a furniture-aware sketch. That step reveals whether the passage is too tight, the sofa clashes with the entry, or the dining table blocks movement.',
          'A quick visualization does not replace an architect, but it catches very practical mistakes before they become concrete and tile.',
        ],
        bullets: [
          'Test the plan in 3D with actual bed, sofa, and dining footprints.',
          'Check if window placements still work after wardrobe and TV walls are added.',
          'Run the layout through a Vastu review only after the basic circulation works.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can a 30x40 plot fit 3 bedrooms?',
        a: 'Yes, often it can, but the comfort level depends on setbacks, parking, stair design, and whether one bedroom is on the ground floor. Good planning matters more than raw room count.',
      },
      {
        q: 'Is a 30x40 plan good for duplex design?',
        a: 'Yes. A 30x40 site is a common starting point for compact duplex homes, especially when the stair and plumbing layout are planned for two floors from the beginning.',
      },
      {
        q: 'Should I test a 30x40 plan in 3D before finalizing it?',
        a: 'Yes. A quick 3D or furniture-aware view helps catch circulation, storage, and window-placement issues that are easy to miss in a flat 2D drawing.',
      },
    ],
    relatedTools: [
      '/floor-plan-3d',
      '/vastu-checker',
      '/construction-cost-calculator',
    ],
    relatedArticles: [
      'north-facing-house-plan',
      'duplex-house-design',
    ],
    sources: [
      {
        label: 'National Building Code of India overview',
        url: 'https://www.bis.gov.in/',
      },
      {
        label: 'DDA building byelaws overview',
        url: 'https://dda.gov.in/',
      },
    ],
  },
  {
    slug: 'north-facing-house-plan',
    path: '/blog/north-facing-house-plan',
    title: 'North-Facing House Plan Tips for Indian Homes',
    description:
      'Planning tips for a north-facing house including entry, room placement, parking, and Vastu-friendly compromises that still work in real life.',
    cluster: 'house-design',
    topicHubPath: '/house-design',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'House Design Guide',
      stat: 'North frontage planning',
      supporting: 'Balance road access, daylight, parking, and Vastu preferences on compact plots.',
    },
    sections: [
      {
        heading: 'North-facing is a site condition, not a complete design answer',
        paragraphs: [
          'A north-facing plot gives you a specific road relation and light pattern, but the rest of the house still depends on setbacks, family routine, and whether the site is narrow, corner, or future-ready for another floor.',
          'People often over-focus on the main door while under-planning the stair, utility, or parking. In practice, those decisions shape the comfort of the house more than orientation alone.',
        ],
        bullets: [
          'Plan entry, parking, and living together instead of treating the door separately.',
          'Use the northern edge well for arrival and openness without exposing every private room.',
          'Keep future expansion in mind if the stair must support another floor later.',
        ],
      },
      {
        heading: 'A practical north-facing layout still needs zone discipline',
        paragraphs: [
          'Even if you care about Vastu, real plots rarely allow a perfect textbook layout. What helps most is keeping high-traffic public functions easy to access, bedrooms quieter, and wet areas stacked efficiently.',
          'North-facing homes often benefit from a clear front arrival zone, with living or sit-out space handled carefully so privacy is not lost the moment the gate opens.',
        ],
        table: {
          columns: ['Zone', 'Usually works well'],
          rows: [
            ['Front / north edge', 'Entry, sit-out, parking, or living interface.'],
            ['Center', 'Dining, stair spine, or family circulation.'],
            ['Back / private edge', 'Bedrooms, utility, or quieter service spaces.'],
          ],
        },
      },
      {
        heading: 'Use Vastu as a review layer after the plan works',
        paragraphs: [
          'The best workflow is to make the house livable first, then run a Vastu review on top of it. That avoids forcing impractical room placements that break movement or ventilation.',
          'When the 2D plan is stable, test it in 3D and then score it with a Vastu checker so you can see where small adjustments may improve both logic and comfort.',
        ],
        bullets: [
          'Test furniture clearances before locking the entrance wall and window positions.',
          'Use a Vastu review to identify adjustments, not to replace site planning.',
          'If the plot is tight, prioritize daylight, privacy, and plumbing efficiency before ornamental rules.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is a north-facing house good in India?',
        a: 'It can be very workable. Orientation alone does not decide quality. A north-facing house performs well when entry, privacy, ventilation, and room zoning are planned properly.',
      },
      {
        q: 'Should I choose the main door only based on Vastu?',
        a: 'No. Vastu can be one input, but the entry also needs to support parking, movement, privacy, and facade balance.',
      },
      {
        q: 'Can I review a north-facing plan in 3D before finalizing it?',
        a: 'Yes. A quick 3D check makes it easier to judge the entry sequence, furniture placement, and front elevation impact before construction begins.',
      },
    ],
    relatedTools: [
      '/vastu-checker',
      '/floor-plan-3d',
      '/plot-converter',
    ],
    relatedArticles: [
      '30x40-house-plan',
      'duplex-house-design',
    ],
    sources: [
      {
        label: 'National Building Code of India overview',
        url: 'https://www.bis.gov.in/',
      },
    ],
  },
  {
    slug: 'duplex-house-design',
    path: '/blog/duplex-house-design',
    title: 'Duplex House Design Ideas for Indian Families',
    description:
      'Planning advice for duplex house design in India, including stair strategy, privacy, room split, and future flexibility.',
    cluster: 'house-design',
    topicHubPath: '/house-design',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'House Design Guide',
      stat: 'Two-level planning',
      supporting: 'Use the upper floor for privacy without making the stair the house’s biggest problem.',
    },
    sections: [
      {
        heading: 'A good duplex is really a good vertical circulation plan',
        paragraphs: [
          'Duplex homes feel premium when the two floors have a clear relationship. The stair is what makes or breaks that relationship. If it lands awkwardly, every room around it starts to compromise.',
          'Before you think about facade style, decide how family members will move between public and private zones. That is the backbone of the plan.',
        ],
        bullets: [
          'Keep the stair easy to access from the entry without cutting through living space.',
          'Use the upper floor for bedrooms, family lounge, or study where privacy matters more.',
          'Align plumbing stacks so attached bathrooms do not create messy vertical services later.',
        ],
      },
      {
        heading: 'Split functions by noise and privacy, not just by room count',
        paragraphs: [
          'Ground floors usually handle arrival, living, dining, kitchen, and a guest or elder-friendly bedroom. Upper floors can take family bedrooms, a quieter lounge, and terrace access.',
          'This split works because it follows routine. Guests do not need to climb. Children and parents still get private space upstairs. The home feels larger because the activity zones are more intentional.',
        ],
        table: {
          columns: ['Level', 'Best-fit functions'],
          rows: [
            ['Ground floor', 'Living, dining, kitchen, guest room, parking access.'],
            ['Upper floor', 'Family bedrooms, lounge, study, terrace connection.'],
          ],
        },
      },
      {
        heading: 'Design today with tomorrow’s flexibility in mind',
        paragraphs: [
          'Many Indian duplex homes eventually need partial independence between floors for grown children, parents, or rental use. A few early decisions make that easier later: stair privacy, bathroom stacking, and utility planning.',
          'A 3D preview is especially useful for duplexes because double-height aspirations, stair bulk, and furniture proportions are hard to read in flat drawings.',
        ],
        bullets: [
          'Keep enough headroom and landing width for comfortable daily use.',
          'Test the stair massing in 3D before finalizing room sizes around it.',
          'If you care about Vastu, review the finished floor split rather than isolated rooms.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What should go on the ground floor of a duplex house?',
        a: 'Living, dining, kitchen, and at least one convenient bedroom are common ground-floor priorities. This keeps day-to-day life accessible and guest-friendly.',
      },
      {
        q: 'Why is the stair so important in duplex design?',
        a: 'Because it affects circulation, light, room sizing, and privacy on both levels. A poorly placed stair creates compromise everywhere around it.',
      },
      {
        q: 'Should I visualize a duplex plan in 3D?',
        a: 'Yes. Duplexes benefit a lot from 3D review because vertical space, furniture scale, and stair bulk are difficult to judge in 2D alone.',
      },
    ],
    relatedTools: [
      '/floor-plan-3d',
      '/construction-cost-calculator',
      '/vastu-checker',
    ],
    relatedArticles: [
      '30x40-house-plan',
      'north-facing-house-plan',
    ],
    sources: [
      {
        label: 'National Building Code of India overview',
        url: 'https://www.bis.gov.in/',
      },
    ],
  },
  {
    slug: 'floor-plan-to-3d-ai-guide',
    path: '/blog/floor-plan-to-3d-ai-guide',
    title: 'How to Convert a Floor Plan to 3D with AI',
    description:
      'A practical guide to turning a 2D floor plan into a useful 3D preview, including what inputs improve the render and what AI can and cannot validate.',
    cluster: 'house-design',
    topicHubPath: '/house-design',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'House Design Guide',
      stat: 'Best with clean 2D inputs',
      supporting: 'AI renders are strongest as layout and mood validators, not structural drawings.',
    },
    sections: [
      {
        heading: 'The cleaner the 2D input, the better the 3D output',
        paragraphs: [
          'AI does best when the floor plan is legible. Clear room walls, a clean background, and a stable top-down layout help the model infer furniture and circulation much more consistently than a cluttered screenshot full of dimensions and notes.',
          'Think of the input as instructions to a visual assistant. If the plan is noisy, the output starts guessing in the wrong places.',
        ],
        table: {
          columns: ['Input choice', 'Effect on output'],
          rows: [
            ['Clean top-down plan', 'Better room understanding and furniture placement.'],
            ['Heavy dimensions and notes', 'Higher risk of visual confusion in the render.'],
            ['Clear room labels', 'Helps the model infer likely room usage.'],
          ],
        },
      },
      {
        heading: 'Use the 3D render to test scale and mood, not legal compliance',
        paragraphs: [
          'A 3D render is excellent for checking whether rooms feel too narrow, whether the sofa blocks the path, or whether a bedroom looks usable once furniture is added. It is weak for structural, legal, or measurement-certified conclusions.',
          'That is why the most useful workflow is: plan in 2D, visualize in 3D, then return to the technical drawing with improved clarity about what should change.',
        ],
        bullets: [
          'Use 3D to assess circulation, openings, and approximate furniture comfort.',
          'Do not treat AI imagery as a substitute for an architect’s working drawings.',
          'If you need Vastu review, score the layout separately instead of reading it from the render alone.',
        ],
      },
      {
        heading: 'A strong workflow combines 3D, cost, and rule checking',
        paragraphs: [
          'Once the render reveals a better layout direction, run the same plan through cost and rule tools. That way your preferred design is not only attractive but also financially and spatially realistic.',
          'This stacked workflow is where small homeowners gain the most: faster iteration without hiring full visualization support too early.',
        ],
        bullets: [
          'Convert the plan to 3D first to understand space and furniture.',
          'Check construction cost next to make sure the chosen built-up area is realistic.',
          'Review Vastu last if directional balance matters for the family.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can AI convert any floor plan into a good 3D render?',
        a: 'AI works best with clear, uncluttered plans. Messy sketches or dimension-heavy screenshots can still work, but they usually need more trial and cleanup.',
      },
      {
        q: 'Is an AI 3D render enough for construction?',
        a: 'No. It is a concept and communication tool. Construction still needs technical drawings, structural design, approvals, and site-specific detailing.',
      },
      {
        q: 'What should I check after generating the 3D view?',
        a: 'Look at furniture scale, walking clearances, window usefulness, and whether the layout still feels practical once rooms are visualized as real spaces.',
      },
    ],
    relatedTools: [
      '/floor-plan-3d',
      '/vastu-checker',
      '/construction-cost-calculator',
    ],
    relatedArticles: [
      '30x40-house-plan',
      'duplex-house-design',
    ],
    sources: [
      {
        label: 'Plotr Ai floor plan to 3D tool',
        url: 'https://plotrai.in/floor-plan-3d',
      },
    ],
  },
  {
    slug: 'steel-price-house-construction',
    path: '/blog/steel-price-house-construction',
    title: 'How Steel Price Changes Affect House Construction Cost',
    description:
      'Understand how changes in steel price affect a house construction budget, especially for slabs, beams, and staged payments.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'Construction Materials Guide',
      stat: 'High impact on RCC work',
      supporting: 'Steel moves a small number of items, but those items sit in the cost-critical structure.',
    },
    sections: [
      {
        heading: 'Steel affects fewer line items than cement, but often hits harder',
        paragraphs: [
          'Not every material swing hurts equally. Steel is concentrated in slabs, beams, columns, and structural reinforcement, so price changes land directly on the most important parts of the frame.',
          'That means even a moderate increase can change the timing and confidence of your RCC stage budget, especially if you are building floor by floor.',
        ],
        bullets: [
          'Track steel closely before slab casting and beam-heavy stages.',
          'Separate structural material budget from finishing budget in your spreadsheet.',
          'Ask contractors whether their quote assumes a fixed or floating steel rate.',
        ],
      },
      {
        heading: 'Rising steel cost changes contractor conversations',
        paragraphs: [
          'When steel moves up, contractors often push for rate revision, earlier material purchase, or smaller stage buffers. Buyers who only track total cost miss the negotiation happening underneath.',
          'If you know the steel-sensitive stages in advance, you can decide whether to lock material early, release a purchase tranche, or redesign nothing and simply absorb the increase with clearer expectations.',
        ],
        table: {
          columns: ['Stage', 'Steel sensitivity'],
          rows: [
            ['Columns and beams', 'High because reinforcement density is concentrated.'],
            ['Slab casting', 'High because timing and volume are fixed together.'],
            ['Finishing work', 'Low because steel is not the dominant cost driver there.'],
          ],
        },
      },
      {
        heading: 'Use quantity and cost tools together',
        paragraphs: [
          'The most reliable response is to calculate material quantity first and city-level cost second. That stops you from reacting emotionally to market noise and lets you estimate the real rupee effect on your specific build.',
          'Once the steel-heavy stages are visible, your contingency planning becomes much more practical.',
        ],
        bullets: [
          'Estimate steel quantity from slab and RCC dimensions before discussing price impact.',
          'Refresh overall project cost when the structural stage is approaching.',
          'Keep a dedicated contingency for structural materials rather than one generic buffer.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does steel price affect the whole house equally?',
        a: 'No. It has the biggest effect on RCC and structural stages such as slabs, columns, and beams. Finishing stages are less sensitive.',
      },
      {
        q: 'Should I lock steel early for a house build?',
        a: 'It depends on the project schedule and your contractor terms. Early locking can help in rising markets, but only if quantity and staging are already clear.',
      },
      {
        q: 'What is the best way to estimate steel impact on my house budget?',
        a: 'Calculate the likely steel quantity for your structural stages and then refresh your total construction estimate using current local rates.',
      },
    ],
    relatedTools: [
      '/material-calculator',
      '/construction-cost-calculator',
      '/rcc-slab-calculator',
    ],
    relatedArticles: [
      'cement-vs-rmc',
      'false-ceiling-cost-per-sq-ft',
    ],
    sources: [
      {
        label: 'Economic Times cement and construction demand coverage',
        url: 'https://m.economictimes.com/markets/expert-view/cement-sector-faces-muted-q1-fy27-as-heat-water-scarcity-hit-demand-ashikas-jyoti-gupta/articleshow/132089641.cms',
      },
      {
        label: 'Times of India steel price impact report',
        url: 'https://timesofindia.indiatimes.com/city/coimbatore/20-rise-in-steel-prices-likely-to-slow-down-construction-activity/articleshow/128728821.cms',
      },
    ],
  },
  {
    slug: 'cement-vs-rmc',
    path: '/blog/cement-vs-rmc',
    title: 'Cement Mix vs Ready-Mix Concrete for Home Construction',
    description:
      'A practical comparison of site-mixed cement concrete versus RMC for Indian home construction projects.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Construction Materials Guide',
      stat: 'Quality vs convenience tradeoff',
      supporting: 'Choose based on volume, access, supervision, and timeline rather than habit.',
    },
    sections: [
      {
        heading: 'The right choice depends on control and scale',
        paragraphs: [
          'Site mix gives you flexibility on smaller pours and remote sites, but it also demands tighter supervision. Ready-mix concrete reduces batching inconsistency and labor coordination, especially when volumes are meaningful and delivery access is straightforward.',
          'For homeowners, the decision is rarely ideological. It is operational: who is supervising, how large is the pour, and can the site handle delivery timing cleanly?',
        ],
      },
      {
        heading: 'Compare both options against your project conditions',
        paragraphs: [
          'Small residential jobs sometimes default to site mix simply because that is what local labor expects. But if you are doing repeated structural pours with limited supervision, quality consistency can become more valuable than informal flexibility.',
        ],
        table: {
          columns: ['Situation', 'Usually better fit'],
          rows: [
            ['Small isolated repair or minor pour', 'Site mix can be practical.'],
            ['Large slab or repeated RCC work', 'RMC often improves consistency and speed.'],
            ['Tight supervision unavailable', 'RMC can reduce batching variability.'],
          ],
        },
      },
      {
        heading: 'Run quantity and cost numbers before deciding',
        paragraphs: [
          'The easiest mistake is choosing on anecdote rather than quantity. Calculate the concrete volume first, then compare material handling, wastage, and labor implications.',
          'When the numbers are visible, the decision usually becomes clearer and less emotional.',
        ],
        bullets: [
          'Estimate total concrete volume for slab, column, or footing work first.',
          'Factor in labor supervision and wastage, not only bag price.',
          'Revisit the choice if the project timeline compresses or supervision changes.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is RMC always better than site mix?',
        a: 'No. RMC is often better for consistency and larger pours, but site mix can still be practical for smaller jobs, remote access conditions, or highly controlled supervised work.',
      },
      {
        q: 'What matters more, cement brand or mix quality?',
        a: 'Mix quality and batching discipline usually matter more in day-to-day execution. A good brand does not rescue poor water control or sloppy site mixing.',
      },
      {
        q: 'How do I compare site mix and RMC for my project?',
        a: 'Start with concrete volume, then compare supervision, delivery access, labor coordination, and likely wastage rather than headline material price alone.',
      },
    ],
    relatedTools: [
      '/concrete-calculator',
      '/material-calculator',
      '/construction-cost-calculator',
    ],
    relatedArticles: [
      'steel-price-house-construction',
      'modular-kitchen-cost-india',
    ],
    sources: [
      {
        label: 'UltraTech concrete resources',
        url: 'https://www.ultratechcement.com/for-homebuilders/home-building-explained-single/descriptive-articles/ready-mix-concrete',
      },
      {
        label: 'BIS',
        url: 'https://www.bis.gov.in/',
      },
    ],
  },
  {
    slug: 'false-ceiling-cost-per-sq-ft',
    path: '/blog/false-ceiling-cost-per-sq-ft',
    title: 'False Ceiling Cost per Sq Ft in India',
    description:
      'A planning guide to false ceiling cost per square foot in India, including material choices, room strategy, and hidden cost drivers.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '6 min read',
    hero: {
      eyebrow: 'Construction Materials Guide',
      stat: 'Room-by-room budgeting',
      supporting: 'False ceiling cost swings more on design intent and detailing than on area alone.',
    },
    sections: [
      {
        heading: 'Per-sq-ft cost is useful, but only as a starting benchmark',
        paragraphs: [
          'False ceiling cost is often quoted per square foot because it gives homeowners a fast mental model. The problem is that lighting cuts, drops, coves, access panels, and moisture conditions can move the real cost meaningfully.',
          'That means area helps you shortlist, but the design treatment decides the final budget.',
        ],
      },
      {
        heading: 'Choose the ceiling type room by room',
        paragraphs: [
          'Bedrooms, living rooms, and kitchens do not need the same treatment. A light perimeter design may be enough in one room while another needs only a simple service cover or no false ceiling at all.',
          'This is where homeowners save money: by using false ceiling as a targeted design tool rather than a blanket finish across the whole house.',
        ],
        table: {
          columns: ['Ceiling approach', 'Where it often fits'],
          rows: [
            ['Simple gypsum perimeter', 'Bedrooms and modest living areas.'],
            ['Full designer ceiling', 'Feature living rooms or premium lounge spaces.'],
            ['Minimal utility cover', 'Kitchens, corridors, or service-heavy areas.'],
          ],
        },
      },
      {
        heading: 'Budget with lighting and maintenance in mind',
        paragraphs: [
          'The visible board is not the whole job. Lighting fixtures, access to services, moisture resistance, and repair convenience all influence whether a ceiling remains a good idea after handover.',
          'Plan these alongside your interior budget so the ceiling supports the room instead of quietly inflating it.',
        ],
        bullets: [
          'Count light points and cove details before accepting a per-sq-ft quote.',
          'Keep bathrooms and moisture-prone edges on a stricter material check.',
          'Use a smaller feature area if the full-room design pushes the interior budget too far.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is false ceiling worth it for every room?',
        a: 'Not necessarily. It works best where lighting, concealment, or visual finish adds real value. Some rooms are better left simpler to protect the budget.',
      },
      {
        q: 'Why can false ceiling cost vary so much at the same area?',
        a: 'Design complexity, lighting cuts, material choice, drops, and access details often matter more than raw area alone.',
      },
      {
        q: 'Should I include false ceiling in the main construction budget?',
        a: 'It is usually smarter to treat it as a finishing or interiors line item so you can decide room by room based on remaining budget and design goals.',
      },
    ],
    relatedTools: [
      '/construction-cost-calculator',
      '/material-calculator',
      '/interior-restyle',
    ],
    relatedArticles: [
      'modular-kitchen-cost-india',
      'cement-vs-rmc',
    ],
    sources: [
      {
        label: 'Saint-Gobain Gyproc India',
        url: 'https://www.gyproc.in/',
      },
    ],
  },
  {
    slug: 'modular-kitchen-cost-india',
    path: '/blog/modular-kitchen-cost-india',
    title: 'Modular Kitchen Cost in India: How to Budget by Scope',
    description:
      'A practical modular kitchen cost guide for Indian homeowners covering layout, finishes, storage decisions, and cost tiers.',
    cluster: 'materials-cost',
    topicHubPath: '/construction-materials',
    datePublished: '2026-07-03',
    dateModified: '2026-07-03',
    readingTime: '7 min read',
    hero: {
      eyebrow: 'Construction Materials Guide',
      stat: 'Scope drives price',
      supporting: 'Cabinet finish, shutter count, hardware, and countertop decisions move the budget faster than area alone.',
    },
    sections: [
      {
        heading: 'Kitchen cost is shaped by modules and finishes, not just size',
        paragraphs: [
          'Two kitchens with the same floor area can have very different budgets. Storage type, hardware quality, countertop choice, shutter finish, and appliance integration all reshape the number quickly.',
          'That is why homeowners should budget the kitchen as a package of decisions instead of chasing a single rate card.',
        ],
      },
      {
        heading: 'Use a tiered budget before you finalize finishes',
        paragraphs: [
          'A simple tier model helps prevent overspending. Define whether you are building for essential function, family durability, or premium visual finish before you get lost in sample catalogs.',
        ],
        table: {
          columns: ['Budget tier', 'Typical direction'],
          rows: [
            ['Basic', 'Functional modules, simpler shutters, restrained hardware.'],
            ['Mid-range', 'Better finish mix, smarter storage, stronger daily durability.'],
            ['Premium', 'Richer finish palette, advanced hardware, more appliance integration.'],
          ],
        },
      },
      {
        heading: 'Sequence the kitchen after core civil planning',
        paragraphs: [
          'Kitchen cost becomes easier to control when the civil and utility positions are already stable. Moving sinks, chimneys, or appliance points late is one of the fastest ways to make the fit-out feel expensive.',
          'Use a restyle or 3D preview once the layout is fixed so you can compare finish directions without changing the underlying plumbing and electrical logic.',
        ],
        bullets: [
          'Lock sink, hob, fridge, and utility positions before final quotation.',
          'Compare visual styles separately from storage and hardware essentials.',
          'Keep a line item for appliances and countertop if your vendor quote excludes them.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is modular kitchen cost based only on running feet?',
        a: 'No. Running feet can be a shorthand, but the real cost also depends on shutter finish, hardware, countertop, storage complexity, and appliance integration.',
      },
      {
        q: 'When should I finalize the modular kitchen design?',
        a: 'After the civil layout, plumbing, and electrical positions are stable. That keeps late changes from inflating the quote.',
      },
      {
        q: 'Can I use a visual tool before buying a kitchen finish?',
        a: 'Yes. Once the layout is fixed, a visual preview helps compare styles and colors without changing the functional plan.',
      },
    ],
    relatedTools: [
      '/interior-restyle',
      '/construction-cost-calculator',
      '/floor-plan-3d',
    ],
    relatedArticles: [
      'false-ceiling-cost-per-sq-ft',
      '30x40-house-plan',
    ],
    sources: [
      {
        label: 'Hettich India',
        url: 'https://www.hettich.com/in_EN/home',
      },
    ],
  },
] as const

export const BLOG_BY_SLUG = new Map(BLOG_ARTICLES.map((article) => [article.slug, article]))

export const BLOG_SLUGS = BLOG_ARTICLES.map((article) => article.slug)

export const TOPIC_HUBS: ReadonlyArray<TopicHub> = [
  {
    path: '/property-buyer-guide',
    title: 'Property Buyer Guide for Indian Homeowners',
    description:
      'Practical guides for document checks, RERA search, circle rate, registration cost, and the high-friction steps before you book a property.',
    cluster: 'property-buyer',
    eyebrow: 'Topic Hub · Property Buyer',
    intro: [
      'This hub is for the messy stage before purchase decisions become irreversible. It groups the due-diligence, tax, and lookup content that buyers usually discover too late.',
      'Use it when you are shortlisting a property, checking documents, or working out how much extra cash the transaction really needs beyond the quoted price.',
    ],
    featuredArticles: [
      'property-document-checklist',
      'rera-project-search-guide',
      'circle-rate-vs-market-rate',
      'stamp-duty-registration-charges-india',
    ],
    featuredTools: [
      '/stamp-duty-calculator',
      '/property-capital-gains-calculator',
      '/bbmp-property-tax-calculator',
    ],
    faqs: [
      {
        q: 'What should I check before paying a token amount for property?',
        a: 'Start with ownership, title chain, approvals, RERA status, and the real registration cost. A token should follow due diligence, not replace it.',
      },
      {
        q: 'Which Plotr Ai tools help a property buyer most?',
        a: 'The stamp duty calculator, capital gains calculator, and city-specific property tax estimators are the most relevant financial planning tools in this cluster.',
      },
    ],
  },
  {
    path: '/house-design',
    title: 'House Design Guides for Indian Plots and Families',
    description:
      'Planning guides for compact plots, north-facing homes, duplex layouts, and 2D-to-3D visualization before you finalize a design direction.',
    cluster: 'house-design',
    eyebrow: 'Topic Hub · House Design',
    intro: [
      'This hub covers the planning questions that happen before detailed interior design and before construction drawings are frozen.',
      'The goal is simple: help you make better decisions about layout, room priorities, orientation, and visualization while the design is still flexible.',
    ],
    featuredArticles: [
      '30x40-house-plan',
      'north-facing-house-plan',
      'duplex-house-design',
      'floor-plan-to-3d-ai-guide',
    ],
    featuredTools: [
      '/floor-plan-3d',
      '/vastu-checker',
      '/construction-cost-calculator',
    ],
    faqs: [
      {
        q: 'Should I test my plan in 3D before finalizing it?',
        a: 'Yes. A quick 3D preview exposes furniture, circulation, and frontage issues earlier than a flat plan usually does.',
      },
      {
        q: 'Does orientation decide the whole house design?',
        a: 'No. Orientation matters, but stair placement, privacy, setbacks, parking, and future growth usually decide whether the plan works comfortably.',
      },
    ],
  },
  {
    path: '/construction-materials',
    title: 'Construction Materials and Cost Guides for Home Building',
    description:
      'Practical guidance on steel price impact, concrete choices, false ceiling budgeting, and modular kitchen scope for Indian home builders.',
    cluster: 'materials-cost',
    eyebrow: 'Topic Hub · Materials and Cost',
    intro: [
      'This hub helps homeowners connect quantity, scope, and finishing choices to real project cost. It is designed for the stage where civil work, interiors, and contractor decisions start to overlap.',
      'Use it to turn scattered quotes into a more structured view of what is essential, what is optional, and what needs a contingency buffer.',
    ],
    featuredArticles: [
      'steel-price-house-construction',
      'cement-vs-rmc',
      'false-ceiling-cost-per-sq-ft',
      'modular-kitchen-cost-india',
    ],
    featuredTools: [
      '/material-calculator',
      '/construction-cost-calculator',
      '/floor-plan-3d',
    ],
    faqs: [
      {
        q: 'Which cost decisions should homeowners review first?',
        a: 'Start with structural quantities and stage-wise construction cost, then move to optional finish layers like ceilings, kitchens, and premium interiors.',
      },
      {
        q: 'How do I avoid getting lost in material quotations?',
        a: 'Estimate quantity first, then compare quotations against scope, supervision, and delivery timing instead of chasing isolated unit rates.',
      },
    ],
  },
]

export const TOPIC_HUB_BY_PATH = new Map(TOPIC_HUBS.map((hub) => [hub.path, hub]))

export const FEATURED_GUIDE_PATHS: ReadonlyArray<string> = [
  '/blog',
  '/property-buyer-guide',
  '/house-design',
  '/construction-materials',
  '/blog/property-document-checklist',
  '/blog/rera-project-search-guide',
  '/blog/30x40-house-plan',
  '/blog/steel-price-house-construction',
]

export function getArticlesByCluster(cluster: BlogCluster) {
  return BLOG_ARTICLES.filter((article) => article.cluster === cluster)
}

export function getTopicHubForCluster(cluster: BlogCluster) {
  const hub = TOPIC_HUBS.find((entry) => entry.cluster === cluster)
  if (!hub) {
    throw new Error(`Missing topic hub for cluster: ${cluster}`)
  }
  return hub
}

export function getArticleLinkItem(slug: BlogSlug) {
  const article = BLOG_BY_SLUG.get(slug)
  if (!article) {
    throw new Error(`Unknown blog article slug: ${slug}`)
  }

  return {
    to: article.path,
    label: article.title,
    description: article.description,
    badge: 'Guide',
  }
}

export function getToolLinkItem(path: BlogToolPath) {
  const tool = BLOG_TOOL_META[path]
  if (!tool) {
    throw new Error(`Unknown tool path: ${path}`)
  }

  return {
    to: path,
    label: tool.title,
    description: tool.description,
    badge: 'Tool',
  }
}

export function getTopicHubLinkItem(path: TopicHubPath) {
  const hub = TOPIC_HUB_BY_PATH.get(path)
  if (!hub) {
    throw new Error(`Unknown hub path: ${path}`)
  }

  return {
    to: hub.path,
    label: hub.title,
    description: hub.description,
    badge: 'Hub',
  }
}
