import { CITY_RATES, type CityRates } from './construction-cost-rates'
import type { FaqItem } from '#/lib/seo'

export interface CityContent {
  slug: string
  city: string
  state: string
  /** Optional context paragraphs unique to this city */
  extraContext?: ReadonlyArray<string>
}

export const CITY_CONTENT: ReadonlyArray<CityContent> = [
  {
    slug: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    extraContext: [
      'Mumbai has India\'s highest residential construction rates due to land scarcity, high labour costs, and strict BMC compliance requirements (fire NOC, environment clearance for plots above 2000 sq m).',
      'The standard Mumbai construction cost of ₹2400/sq ft assumes a tier-1 contractor — local builders may quote 10-15% lower but with longer timelines and weaker compliance.',
    ],
  },
  {
    slug: 'delhi',
    city: 'Delhi',
    state: 'Delhi NCT',
    extraContext: [
      'Delhi residential construction is shaped by MCD/DDA building bye-laws, which set strict FAR limits and require sanctioned plans before commencement. Construction labour rates are higher than NCR satellite cities.',
      'Delhi rates exclude statutory development charges (typically ₹150-300 per sq ft additional) — factor these in when comparing with Gurgaon or Noida.',
    ],
  },
  {
    slug: 'bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    extraContext: [
      'Bangalore construction is governed by BBMP/BDA bye-laws with mandatory rainwater harvesting, solar water heaters, and OC compliance. The cost per sq ft is similar to Pune and Chennai but labour productivity is among India\'s best.',
      'Builder-grade construction in outer Bangalore (Sarjapur, Whitefield outskirts) can be 10-15% cheaper than central areas due to lower land surcharge.',
    ],
  },
  {
    slug: 'north-bangalore',
    city: 'North Bangalore',
    state: 'Karnataka',
    extraContext: [
      'North Bangalore demand clusters around Yelahanka, Hebbal outskirts, Hennur, Thanisandra, Jakkur, Devanahalli, and the airport corridor. Independent-house budgets here often track slightly below central Bangalore because site access and contractor logistics are easier outside the core.',
      'For airport-belt and Devanahalli plots, check soil, borewell depth, road width, and approval jurisdiction carefully. Those site conditions can move the final quote more than the base per-sq-ft rate.',
    ],
  },
  {
    slug: 'pune',
    city: 'Pune',
    state: 'Maharashtra',
    extraContext: [
      'Pune\'s construction rates are roughly 10% lower than Mumbai despite both being in Maharashtra, due to lower labour costs and easier raw-material logistics from Pune-Solapur corridor.',
      'PMC (Pune Municipal Corporation) zones have OC compliance and additional 1% LBT — factor into total cost.',
    ],
  },
  {
    slug: 'chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    extraContext: [
      'Chennai construction is shaped by CMDA bye-laws and the city\'s coastal climate — anti-corrosion treatment for steel and cement is essential, adding 3-5% to standard cost.',
      'Tamil Nadu\'s combined stamp duty + registration of 11% (highest in India) makes total acquisition cost in Chennai higher despite mid-range construction rates.',
    ],
  },
  {
    slug: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    extraContext: [
      'Hyderabad has India\'s most affordable tier-1 construction at ₹2050/sq ft for standard finish — driven by lower labour costs, abundant local granite/marble, and HMDA\'s streamlined approval process.',
      'Combined with Telangana\'s 4.5% stamp duty + registration (lowest among major cities), Hyderabad has the cheapest total cost of ownership for tier-1 metro property in India.',
    ],
  },
  {
    slug: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    extraContext: [
      'Kolkata construction rates are 15-20% lower than Mumbai/Delhi due to lower land surcharge and abundant local labour. KMC bye-laws permit higher FAR than most metros.',
      'Soil-bearing capacity in Kolkata is poor in many areas (deltaic clay) — pile foundation can add 15-20% to foundation costs. Always do soil testing before finalizing budget.',
    ],
  },
  {
    slug: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    extraContext: [
      'Ahmedabad has the lowest tier-1 construction cost among Indian metros at ₹1950/sq ft for standard finish — Gujarat\'s pro-builder policies, GIDC infrastructure, and mature steel/cement supply chains keep costs efficient.',
      'AMC (Ahmedabad Municipal Corporation) bye-laws are well-documented and OC issuance is among India\'s fastest, reducing project carrying cost.',
    ],
  },
  {
    slug: 'gurgaon',
    city: 'Gurgaon',
    state: 'Haryana',
    extraContext: [
      'Gurgaon (Gurugram) construction rates are 5-10% higher than Delhi due to premium positioning and HUDA development charges. License fees and EDC/IDC can add ₹400-800/sq ft to total cost.',
      'High-rise tower construction in Gurgaon\'s sectors uses tier-1 contractors only — independent floor builders quote 10-15% lower with shorter timelines.',
    ],
  },
  {
    slug: 'noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    extraContext: [
      'Noida construction follows Delhi rates roughly within 2-3%. NOIDA Authority\'s sectoral rates and development charges add a meaningful overhead — typically ₹300-600/sq ft beyond construction.',
      'Greater Noida and Yamuna Expressway zones have 8-12% lower base rates due to lower land carrying cost.',
    ],
  },
  {
    slug: 'greater-noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    extraContext: [
      'Greater Noida independent-house construction typically prices below central Noida because plot access, logistics, and contractor availability are easier in developing sectors.',
      'For Greater Noida West and Yamuna Expressway plots, budget separately for soil testing, boundary wall, borewell or water connection, and local authority compliance before comparing per-sq-ft quotes.',
    ],
  },
  {
    slug: 'ghaziabad',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    extraContext: [
      'Ghaziabad construction demand clusters around Indirapuram, Raj Nagar Extension, Vaishali, Vasundhara, and NH-24/Delhi-Meerut corridor plots. Rates are usually below Noida but above smaller UP cities.',
      'Check GDA or local municipal approval, road width, parking, and drainage conditions before finalizing a quote; these local constraints can move the final budget more than the base material rate.',
    ],
  },
  {
    slug: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    extraContext: [
      'Jaipur construction is among India\'s most cost-efficient at ₹1850/sq ft for standard finish, driven by abundant Makrana marble, Kota stone, and skilled local stonemasons.',
      'JDA (Jaipur Development Authority) approval timelines are moderate — budget 4-6 months for sanction approval before commencement.',
    ],
  },
  {
    slug: 'kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    extraContext: [
      'Kanpur has a cost advantage from the Kanpur-Lucknow industrial corridor, with competitive labour and mature cement, brick, steel, and transport supply chains.',
      'Older city plots can require extra demolition, debris removal, narrow-lane logistics, or foundation strengthening. Add a contingency before comparing Kanpur quotes with open-layout Lucknow plots.',
    ],
  },
  {
    slug: 'lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    extraContext: [
      'Lucknow has India\'s second-lowest tier-2 construction cost at ₹1800/sq ft for standard finish. LDA (Lucknow Development Authority) bye-laws favor independent housing with FAR up to 1.5 in residential zones.',
      'Local labour is cheap and abundant; material logistics from Kanpur-Lucknow industrial corridor keep cement and steel costs competitive.',
    ],
  },
  {
    slug: 'indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    extraContext: [
      'Indore construction is highly cost-efficient at ₹1800/sq ft for standard finish. The city benefits from MP\'s robust cement industry (Birla, ACC plants) and competitive labour rates.',
      'MP\'s 10.5% combined stamp duty + registration is the highest in India — make sure to factor this into total acquisition cost when comparing Indore to other cities.',
    ],
  },
  {
    slug: 'coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    extraContext: [
      'Coimbatore is Tamil Nadu\'s most cost-efficient construction market at ₹1800/sq ft for standard finish — aided by local steel manufacturing (Pricol, Lakshmi industries) and lower labour costs vs Chennai.',
      'CCMC bye-laws are straightforward and OC issuance is among the fastest in South India.',
    ],
  },
  {
    slug: 'kochi',
    city: 'Kochi',
    state: 'Kerala',
    extraContext: [
      'Kochi construction is moderately priced at ₹1950/sq ft for standard finish but Kerala\'s 10% stamp duty + registration makes total cost steep. Coastal climate requires premium anti-corrosion treatment (3-5% surcharge).',
      'Skilled labour shortage in Kerala (migration to Gulf) often pushes contractors to import labour from Bengal/Odisha — factor logistics into timeline.',
    ],
  },
  {
    slug: 'chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    extraContext: [
      'Chandigarh\'s strict urban-planning grid (Le Corbusier sectors) and mandatory architectural approval through Chandigarh Estate Office add 4-6 months to project timelines.',
      'Construction cost is moderately above national average due to high-spec compliance — but resale values in Chandigarh sectors are exceptional, justifying the premium.',
    ],
  },
  {
    slug: 'bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    extraContext: [
      'Bhopal construction is among India\'s most affordable at ₹1750/sq ft for standard finish. BMC\'s straightforward bye-laws and abundant local labour keep costs efficient.',
      'Combined with MP\'s high stamp duty (10.5% total), Bhopal\'s low construction cost partially offsets the registration premium — making it a balanced second-home market.',
    ],
  },
  {
    slug: 'patna',
    city: 'Patna',
    state: 'Bihar',
    extraContext: [
      'Patna has the most affordable tier-2 construction cost at ₹1750/sq ft for standard finish, though local labour productivity and material logistics can extend timelines vs Delhi/Mumbai.',
      'PMC bye-laws permit FAR up to 2.0 in residential zones — making vertical construction economical.',
    ],
  },
]

export const CITY_BY_SLUG = new Map(CITY_CONTENT.map((c) => [c.slug, c]))

export function getCityRates(cityName: string): CityRates | undefined {
  return CITY_RATES[cityName]
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
      a: `In ${content.city}, the 2026 standard-quality construction rate is ₹${r.standard.toLocaleString('en-IN')}/sq ft. Basic finish is ₹${r.basic.toLocaleString('en-IN')}/sq ft, premium is ₹${r.premium.toLocaleString('en-IN')}/sq ft, and luxury is ₹${r.luxury.toLocaleString('en-IN')}/sq ft. These rates reflect local labour and material costs in ${content.state}.`,
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
      a: `A 2000 sq ft standard duplex in ${content.city} costs approximately ₹${(cost2000 / 100000).toFixed(1)} lakh. Foundation and structural cost can be slightly higher for a two-floor structure than a single-floor house, but the per-sq-ft rate usually stays close to the same range.`,
    },
    {
      q: `What is the labour and material cost ratio for construction in ${content.city}?`,
      a: `Typical residential construction in ${content.city} follows a 65% material + 30% labour + 5% contingency split. Material breakdown is roughly cement 15%, steel 12%, bricks 10%, aggregates 8%, and finishing 20%. Compare labour rates in ${content.city} with other cities in ${content.state} before finalising a contractor quote.`,
    },
    {
      q: `What is included and excluded in construction cost in ${content.city}?`,
      a: `A typical ${content.city} quote includes civil structure (foundation, slab, columns, walls), basic electrical/plumbing rough-in, doors and windows, basic flooring, and labour. It excludes modular kitchen, false ceiling, AC, premium fittings, landscaping, compound wall, and government approval fees, which can add ₹50-200/sq ft in ${content.city}.`,
    },
  ]

  if (content.slug === 'bangalore' || content.slug === 'north-bangalore') {
    faqs.splice(1, 0, {
      q: 'What is the house construction cost in North Bangalore?',
      a: `North Bangalore areas such as Yelahanka, Hebbal outskirts, Devanahalli, Hennur, and Thanisandra typically cost around ₹${r.standard.toLocaleString('en-IN')}/sq ft for standard finish, ₹${r.basic.toLocaleString('en-IN')}/sq ft basic, and ₹${r.premium.toLocaleString('en-IN')}/sq ft premium. Sites farther from central BBMP zones can be cheaper, but borewell, soil, and approval costs vary by layout.`,
    })
  }

  return faqs
}
