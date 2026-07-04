import type { FaqItem } from '#/lib/seo'
import type { BlogSlug } from '#/data/blog-content'

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
  relatedGuides?: ReadonlyArray<BlogSlug>
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
    relatedGuides: [
      'property-document-checklist',
      'stamp-duty-registration-charges-india',
      'rera-project-search-guide',
    ],
    context: [
      'BBMP property tax queries spike when a new assessment year opens, notices are issued, or residents need receipt/payment proof. For 2026-27, the strongest search intent is not only “calculator” but also “what changed, where do I pay, and how do I check notices”.',
      'This guide keeps the official portal path and the calculator path together. Use it as a planning checklist; BBMP remains the final source for payable amount, arrears, rebates, and property-record status.',
    ],
    faqs: [
      {
        q: 'How do I check BBMP property tax 2026-27?',
        a: 'To check BBMP property tax 2026-27, keep your SAS, PID, khata, or e-khata details ready, verify the property record on the official BBMP portal, and use the BBMP Property Tax Calculator for an estimate.',
      },
      {
        q: 'Where can I download a BBMP property tax receipt?',
        a: 'After payment, the receipt can be downloaded or printed from the official BBMP property tax portal. Plotr Ai does not store receipts; it only provides an estimate and checklist.',
      },
      {
        q: 'Can a BBMP e-khata notice affect property tax?',
        a: 'An e-khata or property-record notice can affect assessment, owner details, or payment workflow. Always verify the final status through official BBMP/e-aasthi records.',
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
    relatedGuides: [
      'property-document-checklist',
      'rera-project-search-guide',
      'circle-rate-vs-market-rate',
    ],
    context: [
      'GHMC search demand is heavily lookup-driven. Users often know their house number but not their exact tax formula, so the page should help them move from “find my property” to “understand the payable amount”.',
      'For Hyderabad residential properties, use the calculator for a quick planning estimate, then verify the actual demand, arrears, rebates, and receipt history on GHMC services.',
    ],
    faqs: [
      {
        q: 'Can GHMC property tax be searched by house number?',
        a: 'GHMC property tax lookup usually supports property identifiers such as PTIN, house number, or linked owner/mobile details depending on the official portal flow. Use official GHMC services for final search results.',
      },
      {
        q: 'How do I check GHMC property tax dues?',
        a: 'To check GHMC dues, search the property record on the official property tax service. For an estimate, use plinth area, monthly rental value, tax slab, depreciation, and cess fields.',
      },
      {
        q: 'How do I download a GHMC property tax receipt?',
        a: 'A paid receipt can be downloaded from official GHMC services. The Plotr Ai calculator estimates tax amount only; it does not handle payment or receipt generation.',
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
    relatedGuides: [
      'property-document-checklist',
      'circle-rate-vs-market-rate',
      'stamp-duty-registration-charges-india',
    ],
    context: [
      'MCD property tax searches are often identifier-first. People are not only looking for a calculator; they need to understand what the CA number or UPIC is, where it appears, and how it connects to the payment record.',
      'This guide intentionally keeps the identifier explanation, official portal, and calculator together so Delhi homeowners can move from record lookup to an estimated payable amount without leaving the page family.',
    ],
    faqs: [
      {
        q: 'What is a CA number in MCD property tax?',
        a: 'A CA number can be an identifier linked to a property tax record, similar to the way UPIC or property IDs help locate a Delhi property record. Exact naming can vary by portal flow and receipt format.',
      },
      {
        q: 'How do I check the MCD property tax last date for 2025-26?',
        a: 'Verify the MCD property tax last date and rebate window on the official MCD portal. Dates can change by assessment year, so a calculator result should not be treated as a payment deadline.',
      },
      {
        q: 'Why can an MCD tax estimate differ from official demand?',
        a: 'Official demand is calculated from colony category, property use, covered area, age factor, structure factor, occupancy, arrears, and rebates. Plotr Ai provides a planning estimate; verify the final amount through the MCD record.',
      },
    ],
  },
}

export const MUNICIPAL_GUIDE_SLUGS = Object.keys(
  MUNICIPAL_GUIDE_CONTENT,
) as Array<MunicipalGuideSlug>
