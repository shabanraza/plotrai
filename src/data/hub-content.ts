import type { HubId } from '#/data/site-map'
import type { FaqItem } from '#/lib/seo'

export interface HubContent {
  /** H1, the hub's primary search phrase */
  h1: string
  metaTitle: string
  metaDescription: string
  /** Two short lines under the H1 */
  tagline: string
  faqs: ReadonlyArray<FaqItem>
}

/**
 * Copy for the five hub pages (/buy, /build, /land, /tax, /design). Tool, state, city and guide
 * lists come from site-map.ts; only the words live here. No rates are quoted on hub pages, so
 * nothing here needs a monthly refresh.
 */
export const HUB_CONTENT: Record<HubId, HubContent> = {
  buy: {
    h1: 'Home Buying Calculators for India',
    metaTitle: 'Home Buying Calculators India — Stamp Duty, Registration, EMI',
    metaDescription:
      'Free calculators for buying a home in India: stamp duty and registration by state, total buying cost with GST and EMI, plus document and RERA guides.',
    tagline:
      'Work out what a property really costs before you pay a token: stamp duty, registration, GST, down payment and EMI.',
    faqs: [
      {
        q: 'What costs are added on top of the property price?',
        a: 'Stamp duty and registration charges (set by each state), GST on under-construction homes, legal and loan processing fees, and brokerage if you use an agent. The home buying cost calculator adds them up for your state.',
      },
      {
        q: 'Is stamp duty the same in every state?',
        a: 'No. Each state sets its own stamp duty and registration rates, and many give women buyers a lower rate. Pick your state below to see its current rates and the official source.',
      },
      {
        q: 'What should I check before paying a token amount?',
        a: 'Start with ownership and title chain, approvals, RERA registration and the real registration cost. A token should follow due diligence, not replace it.',
      },
    ],
  },
  build: {
    h1: 'House Construction Cost Calculators',
    metaTitle: 'House Construction Cost Calculator India — Per Sq Ft, Materials, Concrete',
    metaDescription:
      'Estimate house construction cost per sq ft by city, then the cement, steel, sand, bricks and concrete you need. Free calculators for Indian home builders.',
    tagline:
      'Estimate the build cost for your city, then the quantity of cement, steel, sand and concrete behind it.',
    faqs: [
      {
        q: 'Where should I start when budgeting a house?',
        a: 'Start with the construction cost calculator for your city and finish level to get a stage-wise budget, then use the material calculators to check quantities in contractor quotes.',
      },
      {
        q: 'Why does construction cost differ so much between cities?',
        a: 'Labour rates, material transport and local demand differ by city. The city pages below show the per sq ft range we use for each city and where it comes from.',
      },
      {
        q: 'How do I compare contractor quotations?',
        a: 'Estimate quantities first, then compare quotes on scope, specification and supervision rather than the headline per sq ft rate alone.',
      },
    ],
  },
  land: {
    h1: 'Land Measurement Units in India',
    metaTitle: 'Land Measurement Units India — Gaj, Bigha, Acre, Marla, Gunta Converter',
    metaDescription:
      'Convert Indian land units: gaj, bigha, biswa, acre, hectare, marla, kanal, gunta and cent to sq ft. Region-aware converter and ready conversion tables.',
    tagline:
      'Convert gaj, bigha, acre, marla, gunta and other Indian land units. Units like bigha differ by state, so check the region.',
    faqs: [
      {
        q: 'Why does a bigha differ from state to state?',
        a: 'Bigha is a traditional unit with no single national definition. Its size depends on the state, and sometimes the district, so always confirm the local value with your land record office.',
      },
      {
        q: 'Which land units are exact?',
        a: 'Acre, hectare, square yard (gaj) and square metre have fixed definitions. Traditional units such as bigha, biswa and kanal vary by region.',
      },
    ],
  },
  tax: {
    h1: 'Property Tax Calculators in India',
    metaTitle: 'Property Tax Calculator India — BBMP, GHMC, MCD, Capital Gains',
    metaDescription:
      'Estimate city property tax for Bengaluru (BBMP), Hyderabad (GHMC) and Delhi (MCD), and capital gains tax with indexation when you sell property.',
    tagline:
      'Estimate yearly property tax for your city, and the capital gains tax when you sell.',
    faqs: [
      {
        q: 'Are these property tax figures the final bill?',
        a: 'No. They are planning estimates based on each corporation’s published method. Your official demand notice from the municipal corporation is the amount you pay.',
      },
      {
        q: 'When do I pay capital gains tax on property?',
        a: 'When you sell. The gain is the sale price minus your cost, and for older purchases you may be able to compare the indexed and non-indexed calculations. The capital gains calculator shows both.',
      },
    ],
  },
  design: {
    h1: 'House Design Tools and Guides',
    metaTitle: 'House Design Tools — Vastu Checker, Floor Plan to 3D, Interior AI',
    metaDescription:
      'Check a floor plan against Vastu rules, turn a 2D plan into a 3D render, restyle or stage a room with AI, and read house plan guides for Indian plots.',
    tagline:
      'Test a layout before it is built: Vastu checks, 3D floor plans, and AI room restyling and staging.',
    faqs: [
      {
        q: 'Should I test my plan in 3D before finalising it?',
        a: 'Yes. A quick 3D preview exposes furniture, circulation and frontage problems earlier than a flat plan does.',
      },
      {
        q: 'Does plot orientation decide the whole design?',
        a: 'No. Orientation matters, but stair placement, privacy, setbacks, parking and future expansion usually decide whether a plan works.',
      },
    ],
  },
}
