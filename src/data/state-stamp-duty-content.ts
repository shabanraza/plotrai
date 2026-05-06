import { STAMP_DUTY, type StateEntry } from './stamp-duty-rates'
import type { FaqItem } from '#/lib/seo'

/**
 * Programmatic SEO content for state-level stamp-duty pages.
 *
 * Each state gets a stable slug (used in the URL) and a curated
 * IGR portal link. FAQs are state-aware — they interpolate the
 * actual rate, female concession, and registration values so each
 * page has substantive unique content (not just templated boilerplate).
 */

export interface StateContent {
  slug: string
  state: string
  /** Display name used in titles and headlines */
  displayName: string
  /** State Inspector-General-of-Registration portal */
  igrPortal?: { label: string; url: string }
  /** State-specific extra context paragraphs */
  extraContext?: ReadonlyArray<string>
}

export const STATE_CONTENT: ReadonlyArray<StateContent> = [
  {
    slug: 'maharashtra',
    state: 'Maharashtra',
    displayName: 'Maharashtra',
    igrPortal: { label: 'IGR Maharashtra', url: 'https://igrmaharashtra.gov.in' },
    extraContext: [
      'Maharashtra applies an additional 1% metro cess on top of the base stamp duty within Mumbai, Pune, Nagpur, Nashik, and Thane municipal limits — this brings the effective rate to 6% for male buyers and 5% for female buyers in these zones.',
      'Pune additionally levies 1% Local Body Tax (LBT), making Pune the highest-stamp-duty city in Maharashtra at 7% for male buyers.',
    ],
  },
  {
    slug: 'karnataka',
    state: 'Karnataka',
    displayName: 'Karnataka',
    igrPortal: {
      label: 'Kaveri Online Services (IGR Karnataka)',
      url: 'https://kaverionline.karnataka.gov.in',
    },
    extraContext: [
      'Karnataka uses a slab-based rate: 2% for properties below ₹21 lakh, 3% between ₹21–45 lakh, and 5% above ₹45 lakh. There is no gender-based concession in Karnataka — male and female buyers pay the same rate.',
      'BBMP areas of Bangalore and major urban cities are subject to the full slab rate plus a 1% registration fee.',
    ],
  },
  {
    slug: 'delhi',
    state: 'Delhi (NCT)',
    displayName: 'Delhi NCT',
    igrPortal: { label: 'Delhi Revenue Department', url: 'https://doris.delhigovt.nic.in' },
    extraContext: [
      'Delhi offers one of the highest female-buyer concessions in India — 4% vs 6% for male buyers, a flat 2% rebate. Joint registration with a woman as primary owner gets the female rate.',
      'Delhi also charges a 1% registration fee on top of the stamp duty, payable at the sub-registrar office.',
    ],
  },
  {
    slug: 'tamil-nadu',
    state: 'Tamil Nadu',
    displayName: 'Tamil Nadu',
    igrPortal: { label: 'TNREGINET', url: 'https://tnreginet.gov.in' },
    extraContext: [
      'Tamil Nadu has India\'s highest combined registration charge at 4%, on top of 7% stamp duty — making Chennai\'s effective transaction cost 11% of property value. There is no gender-based concession.',
      'Coimbatore, Madurai, and Trichy follow the same statewide rate of 7% + 4%.',
    ],
  },
  {
    slug: 'telangana',
    state: 'Telangana',
    displayName: 'Telangana',
    igrPortal: { label: 'Registration & Stamps Department', url: 'https://registration.telangana.gov.in' },
    extraContext: [
      'Telangana has one of the lowest stamp duty rates in India at 4% (no gender concession), with 0.5% registration. This makes Hyderabad among the cheapest tier-1 cities for property registration nationwide.',
    ],
  },
  {
    slug: 'uttar-pradesh',
    state: 'Uttar Pradesh',
    displayName: 'Uttar Pradesh',
    igrPortal: { label: 'IGRSUP', url: 'https://igrsup.gov.in' },
    extraContext: [
      'Uttar Pradesh offers a flat ₹10,000 rebate for female buyers, which translates to a roughly 1% concession on properties below ₹10 lakh and a smaller percentage above. This is in addition to the lower 6% rate (vs 7% for male buyers).',
      'Noida, Greater Noida, and Ghaziabad fall under the standard UP rate of 7%/6% + 1% registration.',
    ],
  },
  {
    slug: 'west-bengal',
    state: 'West Bengal',
    displayName: 'West Bengal',
    igrPortal: { label: 'IGR West Bengal', url: 'https://wbregistration.gov.in' },
    extraContext: [
      'West Bengal applies different rates for urban and rural properties: 6% (male)/5% (female) in urban areas, 5%/4% in rural. The calculator above defaults to urban rates — verify your property\'s zoning before final calculation.',
      'Kolkata Municipal Corporation areas use the urban rate.',
    ],
  },
  {
    slug: 'gujarat',
    state: 'Gujarat',
    displayName: 'Gujarat',
    igrPortal: { label: 'GARVI', url: 'https://garvi.gujarat.gov.in' },
    extraContext: [
      'Gujarat does not offer any gender-based concession — both male and female buyers pay the same 4.9% stamp duty + 1% registration. This is one of India\'s most uniform stamp-duty regimes.',
      'Ahmedabad, Surat, Vadodara, and Rajkot follow identical rates statewide.',
    ],
  },
  {
    slug: 'rajasthan',
    state: 'Rajasthan',
    displayName: 'Rajasthan',
    igrPortal: { label: 'IGRS Rajasthan', url: 'https://epanjiyan.rajasthan.gov.in' },
    extraContext: [
      'Rajasthan offers a 1% concession for female buyers (5% vs 6% for males). The state has consistent rates across major cities including Jaipur, Jodhpur, Udaipur, and Kota.',
    ],
  },
  {
    slug: 'punjab',
    state: 'Punjab',
    displayName: 'Punjab',
    igrPortal: { label: 'NGDRS Punjab', url: 'https://punjab.gov.in' },
    extraContext: [
      'Punjab offers a substantial 2% concession for female buyers — 5% vs 7% for male buyers. This is one of the largest gender-based rebates in India.',
    ],
  },
  {
    slug: 'haryana',
    state: 'Haryana',
    displayName: 'Haryana',
    igrPortal: { label: 'JAMABANDI Haryana', url: 'https://jamabandi.nic.in' },
    extraContext: [
      'Haryana caps registration charges at ₹50,000 in urban areas, regardless of property value. This makes large transactions in Gurgaon and Faridabad significantly cheaper than other tier-1 markets where registration scales with value.',
      'Female buyers get a 2% concession (5% vs 7% for males).',
    ],
  },
  {
    slug: 'madhya-pradesh',
    state: 'Madhya Pradesh',
    displayName: 'Madhya Pradesh',
    igrPortal: { label: 'IGR MP / Sampada', url: 'https://www.mpigr.gov.in' },
    extraContext: [
      'Madhya Pradesh has India\'s highest combined transaction cost at 10.5% (7.5% stamp duty + 3% registration). No gender-based concession applies. Plan for this overhead when budgeting for property in Indore, Bhopal, or Jabalpur.',
    ],
  },
  {
    slug: 'kerala',
    state: 'Kerala',
    displayName: 'Kerala',
    igrPortal: { label: 'IGR Kerala', url: 'https://keralaregistration.gov.in' },
    extraContext: [
      'Kerala charges 8% stamp duty + 2% registration with no gender-based concession — making it one of the most expensive states for property registration. Cities like Kochi, Thiruvananthapuram, and Calicut all follow the same rate.',
    ],
  },
  {
    slug: 'odisha',
    state: 'Odisha',
    displayName: 'Odisha',
    igrPortal: { label: 'IGR Odisha', url: 'https://www.igrodisha.gov.in' },
    extraContext: [
      'Odisha offers a 1% female-buyer concession (4% vs 5% for males) and charges 2% registration. Bhubaneswar and Cuttack follow the same rate as the statewide default.',
    ],
  },
  {
    slug: 'andhra-pradesh',
    state: 'Andhra Pradesh',
    displayName: 'Andhra Pradesh',
    igrPortal: { label: 'IGRS Andhra Pradesh', url: 'https://registration.ap.gov.in' },
    extraContext: [
      'Andhra Pradesh charges 5% stamp duty + 1% registration with no gender concession. Vijayawada, Visakhapatnam, and Tirupati follow uniform rates statewide.',
    ],
  },
  {
    slug: 'bihar',
    state: 'Bihar',
    displayName: 'Bihar',
    igrPortal: { label: 'Bhumi Jankari Bihar', url: 'http://bhumijankari.bihar.gov.in' },
    extraContext: [
      'Bihar offers a small female-buyer concession (5.7% vs 6% for males) and charges 2% registration. Patna, Gaya, and Muzaffarpur follow uniform statewide rates.',
    ],
  },
  {
    slug: 'chandigarh',
    state: 'Chandigarh (UT)',
    displayName: 'Chandigarh',
    igrPortal: { label: 'Chandigarh Estate Office', url: 'https://chandigarh.gov.in' },
    extraContext: [
      'As a Union Territory, Chandigarh offers a 1% female-buyer concession (4% vs 5% for males). Combined transaction cost is among the lowest in north India at 6%.',
    ],
  },
]

export const STATE_BY_SLUG = new Map(STATE_CONTENT.map((s) => [s.slug, s]))

export function getStateEntry(stateName: string): StateEntry | undefined {
  return STAMP_DUTY.find((s) => s.state === stateName)
}

export function getAllStateSlugs(): ReadonlyArray<string> {
  return STATE_CONTENT.map((s) => s.slug)
}

/**
 * Generate state-aware FAQ items. Same templates across states but
 * the rate, concession, and IGR portal are interpolated so each page
 * has substantive unique copy.
 */
export function buildStateFaqs(content: StateContent): ReadonlyArray<FaqItem> {
  const entry = getStateEntry(content.state)
  if (!entry) return []
  const r = entry.default
  const womenSavings = r.male - r.female
  const cityList =
    entry.cities && entry.cities.length > 0
      ? entry.cities.map((c) => c.city).join(', ')
      : null

  const faqs: Array<FaqItem> = [
    {
      q: `${content.displayName} mein stamp duty kitni lagti hai 2026 mein?`,
      a: `${content.displayName} mein male buyers ko ${r.male}% stamp duty + ${r.registration}% registration deni hoti hai. Female buyers ko ${r.female}% stamp duty + ${r.registration}% registration. ${r.note ?? ''} Total transaction cost male buyers ke liye ${(r.male + r.registration).toFixed(2)}% aur female buyers ke liye ${(r.female + r.registration).toFixed(2)}% banta hai.`,
    },
    {
      q: `${content.displayName} mein female buyer ko stamp duty discount milta hai?`,
      a:
        womenSavings > 0
          ? `Haan, ${content.displayName} mein female buyers ko ${womenSavings.toFixed(2)}% ka stamp duty concession milta hai (${r.female}% vs ${r.male}% for males). Property female owner ke naam pe ya joint with female as primary owner register karne pe yeh discount applicable hai.`
          : `${content.displayName} mein female buyers ke liye koi separate stamp duty concession nahi hai — male aur female dono ${r.male}% rate pay karte hain. State-wise variation hoti hai, isliye ${content.displayName} ke liye yeh dhyan rakhna zaroori hai.`,
    },
    {
      q: `${content.displayName} ke liye stamp duty kahan jama karein?`,
      a: content.igrPortal
        ? `${content.displayName} mein stamp duty ${content.igrPortal.label} portal (${content.igrPortal.url}) se online jama ki ja sakti hai. E-stamp paper print karke sub-registrar office mein document registration ke time submit karna hota hai. In-person registration ke liye nazdeeki sub-registrar office contact karein.`
        : `${content.displayName} mein stamp duty state IGR portal pe online ya nearest sub-registrar office mein deposit ki ja sakti hai. E-stamp paper aur online challan dono accept hote hain.`,
    },
    {
      q: `${content.displayName} mein 1 crore ke flat pe stamp duty kitni banegi?`,
      a: `${content.displayName} mein ₹1 crore ke flat pe male buyer ko ₹${(100 * r.male / 100).toLocaleString('en-IN')} lakh stamp duty + ₹${(100 * r.registration / 100).toLocaleString('en-IN')} lakh registration = ₹${((100 * (r.male + r.registration)) / 100).toLocaleString('en-IN')} lakh total deni hoti hai. Female buyer ko ₹${((100 * (r.female + r.registration)) / 100).toLocaleString('en-IN')} lakh — bachat ${((100 * womenSavings) / 100).toFixed(1)} lakh.`,
    },
    {
      q: `${content.displayName} mein under-construction property pe stamp duty kab deni hoti hai?`,
      a: `Under-construction property ke liye ${content.displayName} mein stamp duty sale agreement register karte time deni hoti hai (typically 20-25% payment ke baad). Sale deed final hone pe possession ke time additional registration fee bhi pay karna pad sakta hai. Builder se construction-linked GST (5%) alag se collect kiya jata hai — yeh stamp duty se separate hai.`,
    },
  ]

  if (cityList) {
    faqs.push({
      q: `${content.displayName} ke konse cities ka data is calculator mein hai?`,
      a: `${content.displayName} ke liye humne city-specific rates include kiye hain ${cityList} ke liye. In sab cities ke liye rates state-default se thode different ho sakte hain (especially Mumbai aur Pune mein metro cess). Calculator mein city select karne pe local rates apply hote hain.`,
    })
  }

  return faqs
}
