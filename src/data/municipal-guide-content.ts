import type { FaqItem } from '#/lib/seo'

export type MunicipalGuideSlug =
  | 'bbmp-property-tax-2026-27'
  | 'ghmc-property-tax-search-by-house-number'
  | 'mcd-property-tax-ca-number'

interface GuideStep {
  label: string
  detail: string
}

interface GuideReference {
  label: string
  value: string
}

export interface MunicipalGuideContent {
  slug: MunicipalGuideSlug
  authority: 'BBMP' | 'GHMC' | 'MCD'
  city: string
  title: string
  description: string
  eyebrow: string
  calculatorPath: string
  officialUrl: string
  officialLabel: string
  lastUpdated: string
  trendSignal: string
  steps: ReadonlyArray<GuideStep>
  references: ReadonlyArray<GuideReference>
  context: ReadonlyArray<string>
  faqs: ReadonlyArray<FaqItem>
}

export const MUNICIPAL_GUIDE_CONTENT: Record<
  MunicipalGuideSlug,
  MunicipalGuideContent
> = {
  'bbmp-property-tax-2026-27': {
    slug: 'bbmp-property-tax-2026-27',
    authority: 'BBMP',
    city: 'Bangalore',
    title: 'BBMP Property Tax 2026-27',
    description:
      'BBMP property tax 2026-27 guide for Bangalore homeowners: calculator link, e-khata notice context, rebate inputs, receipt/payment checkpoints, and official portal links.',
    eyebrow: 'Bangalore · 2026-27',
    calculatorPath: '/bbmp-property-tax-calculator',
    officialUrl: 'https://bbmptax.karnataka.gov.in/',
    officialLabel: 'BBMP property tax portal',
    lastUpdated: '2026-06-22',
    trendSignal:
      'Google Trends marked “bbmp property tax 2026-27”, “bbmp property tax notices”, and “e-aasthi portal” as breakout related queries in India.',
    steps: [
      {
        label: 'Find your property record',
        detail:
          'Keep SAS application number, PID, khata, or e-khata details ready before checking dues on the BBMP portal.',
      },
      {
        label: 'Estimate the payable amount',
        detail:
          'Use built-up area, residential unit area value, age depreciation, cess, and rebate in the Plotr Ai calculator.',
      },
      {
        label: 'Verify on the official portal',
        detail:
          'Match the estimate against BBMP records, current notices, rebate eligibility, and any arrears before payment.',
      },
      {
        label: 'Save receipt after payment',
        detail:
          'Download or print the receipt from the official portal for loan, sale, mutation, or rental documentation.',
      },
    ],
    references: [
      { label: 'Primary identifier', value: 'SAS / PID / khata details' },
      { label: 'High-intent query', value: 'bbmp property tax 2026-27' },
      { label: 'Related intent', value: 'receipt, payment, notices, e-khata' },
    ],
    context: [
      'BBMP property tax queries spike when a new assessment year opens, notices are issued, or residents need receipt/payment proof. For 2026-27, the strongest search intent is not only “calculator” but also “what changed, where do I pay, and how do I check notices”.',
      'This guide keeps the official portal path and the calculator path together. Use it as a planning checklist; BBMP remains the final source for payable amount, arrears, rebates, and property-record status.',
    ],
    faqs: [
      {
        q: 'BBMP property tax 2026-27 kaise check karein?',
        a: 'BBMP property tax 2026-27 check karne ke liye SAS, PID, khata, ya e-khata details ready rakhein, official BBMP portal par record verify karein, aur estimate ke liye BBMP Property Tax Calculator use karein.',
      },
      {
        q: 'BBMP property tax receipt download kahan se hota hai?',
        a: 'Payment ke baad receipt official BBMP property tax portal se download ya print hoti hai. Plotr Ai receipt store nahi karta; yeh sirf estimate aur checklist provide karta hai.',
      },
      {
        q: 'BBMP e-khata notice property tax ko affect karta hai?',
        a: 'E-khata ya property-record notice assessment, owner details, ya payment workflow ko affect kar sakta hai. Final status hamesha official BBMP/e-aasthi records se verify karein.',
      },
    ],
  },
  'ghmc-property-tax-search-by-house-number': {
    slug: 'ghmc-property-tax-search-by-house-number',
    authority: 'GHMC',
    city: 'Hyderabad',
    title: 'GHMC Property Tax Search by House Number',
    description:
      'GHMC property tax search guide for Hyderabad: house number/PTIN lookup intent, dues checks, receipt/payment path, and a residential property tax estimator.',
    eyebrow: 'Hyderabad · Search',
    calculatorPath: '/ghmc-property-tax-calculator',
    officialUrl: 'https://www.ghmc.gov.in/Propertytax.aspx',
    officialLabel: 'GHMC property tax services',
    lastUpdated: '2026-06-22',
    trendSignal:
      'Google Trends showed “property tax search by house number” at +400% and “ghmc property tax search by house number” at +350% in related rising queries.',
    steps: [
      {
        label: 'Collect lookup details',
        detail:
          'Use house number, PTIN, owner details, or mobile-linked records depending on the official GHMC workflow available to you.',
      },
      {
        label: 'Check dues and receipt status',
        detail:
          'Look up pending dues, paid receipts, arrears, and half-yearly demand on GHMC property tax services.',
      },
      {
        label: 'Estimate before paying',
        detail:
          'Use plinth area, monthly rental value, depreciation, slab rate, and library cess in the GHMC calculator.',
      },
      {
        label: 'Reconcile with official demand',
        detail:
          'Treat the calculator as a planning estimate and the GHMC portal as the final record for demand/payment.',
      },
    ],
    references: [
      { label: 'Primary identifier', value: 'House number / PTIN' },
      { label: 'High-intent query', value: 'ghmc property tax search by house number' },
      { label: 'Related intent', value: 'dues, receipt, payment, mobile number' },
    ],
    context: [
      'GHMC search demand is heavily lookup-driven. Users often know their house number but not their exact tax formula, so the page should help them move from “find my property” to “understand the payable amount”.',
      'For Hyderabad residential properties, use the calculator for a quick planning estimate, then verify the actual demand, arrears, rebates, and receipt history on GHMC services.',
    ],
    faqs: [
      {
        q: 'GHMC property tax house number se search ho sakta hai?',
        a: 'GHMC property tax lookup usually supports property identifiers such as PTIN, house number, or linked owner/mobile details depending on the official portal flow. Use official GHMC services for final search results.',
      },
      {
        q: 'GHMC property tax dues kaise check karein?',
        a: 'GHMC dues check karne ke liye official property tax service par property record search karein. Estimate ke liye plinth area, monthly rental value, tax slab, depreciation, aur cess fields use karein.',
      },
      {
        q: 'GHMC receipt download kaise karein?',
        a: 'Paid receipt official GHMC services se download hoti hai. Plotr Ai calculator tax amount estimate karta hai, payment ya receipt generation nahi.',
      },
    ],
  },
  'mcd-property-tax-ca-number': {
    slug: 'mcd-property-tax-ca-number',
    authority: 'MCD',
    city: 'Delhi',
    title: 'MCD Property Tax CA Number Guide',
    description:
      'MCD property tax CA number guide for Delhi homeowners: what CA number means, where to use it, last-date search intent, official portal link, and tax estimator.',
    eyebrow: 'Delhi · CA Number',
    calculatorPath: '/mcd-property-tax-calculator',
    officialUrl: 'https://mcdonline.nic.in/ptrmcd/web/citizen/property/propertyTaxCalculatorSearchByUpic',
    officialLabel: 'MCD property tax system',
    lastUpdated: '2026-06-22',
    trendSignal:
      'Google Trends marked “ca number in property tax”, “mcdonline.nic”, and “mcd property tax last date 2025 26” as breakout related queries.',
    steps: [
      {
        label: 'Identify the property number',
        detail:
          'Use the CA number, UPIC, or property record details shown in MCD records or prior receipts.',
      },
      {
        label: 'Check last date and rebates',
        detail:
          'Before paying, confirm the current assessment year deadline, rebate window, and any arrears on MCD records.',
      },
      {
        label: 'Estimate annual value',
        detail:
          'Use covered area, monthly unit value, tax slab, depreciation, and rebate in the MCD calculator.',
      },
      {
        label: 'Pay only on official systems',
        detail:
          'Use Plotr Ai for calculation and official MCD systems for assessment, payment, and receipt generation.',
      },
    ],
    references: [
      { label: 'Primary identifier', value: 'CA number / UPIC' },
      { label: 'High-intent query', value: 'ca number in property tax' },
      { label: 'Related intent', value: 'last date, receipt, mcdonline.nic' },
    ],
    context: [
      'MCD property tax searches are often identifier-first. People are not only looking for a calculator; they need to understand what the CA number or UPIC is, where it appears, and how it connects to the payment record.',
      'This guide intentionally keeps the identifier explanation, official portal, and calculator together so Delhi homeowners can move from record lookup to an estimated payable amount without leaving the page family.',
    ],
    faqs: [
      {
        q: 'MCD property tax mein CA number kya hota hai?',
        a: 'CA number property tax record se linked identifier ho sakta hai, similar to the way UPIC or property IDs help locate a Delhi property record. Exact naming can vary by portal flow and receipt format.',
      },
      {
        q: 'MCD property tax last date 2025-26 kaise check karein?',
        a: 'MCD property tax last date aur rebate window official MCD portal par verify karein. Dates assessment year ke hisaab se change ho sakti hain, so calculator result ko payment deadline nahi maana chahiye.',
      },
      {
        q: 'MCD tax estimate aur official demand alag kyun ho sakta hai?',
        a: 'Official demand colony category, property use, covered area, age factor, structure factor, occupancy, arrears, and rebates se calculate hoti hai. Plotr Ai planning estimate deta hai; final amount MCD record se verify karein.',
      },
    ],
  },
}

export const MUNICIPAL_GUIDE_SLUGS = Object.keys(
  MUNICIPAL_GUIDE_CONTENT,
) as Array<MunicipalGuideSlug>
