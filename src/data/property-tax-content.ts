import type { FaqItem } from '#/lib/seo'
import type { BlogSlug } from '#/data/blog-content'

export type PropertyTaxSlug =
  | 'bbmp-property-tax-calculator'
  | 'ghmc-property-tax-calculator'
  | 'mcd-property-tax-calculator'

export interface PropertyTaxContent {
  slug: PropertyTaxSlug
  city: string
  authority: string
  title: string
  description: string
  defaultArea: number
  defaultRate: number
  rateLabel: string
  taxRate: number
  rebatePercent: number
  depreciationPercent: number
  cessPercent: number
  lastUpdated: string
  sourceUrls: ReadonlyArray<{ label: string; url: string }>
  guideLinks?: ReadonlyArray<{ label: string; href: string; description: string }>
  relatedGuides?: ReadonlyArray<BlogSlug>
  estimateNote: string
  context: ReadonlyArray<string>
  faqs: ReadonlyArray<FaqItem>
}

export const PROPERTY_TAX_CONTENT: Record<PropertyTaxSlug, PropertyTaxContent> =
  {
    'bbmp-property-tax-calculator': {
      slug: 'bbmp-property-tax-calculator',
      city: 'Bangalore',
      authority: 'BBMP',
      title: 'BBMP Property Tax Calculator',
      description:
        'Estimate BBMP property tax for residential properties in Bangalore using built-up area, monthly unit value, depreciation, and rebate inputs.',
      defaultArea: 1200,
      defaultRate: 3,
      rateLabel: 'monthly unit area value / sq ft',
      taxRate: 20,
      rebatePercent: 5,
      depreciationPercent: 0,
      cessPercent: 24,
      lastUpdated: '2026-06-22',
      sourceUrls: [
        {
          label: 'BBMP tax calculator',
          url: 'https://bbmptax.karnataka.gov.in/forms/calculator.aspx',
        },
        {
          label: 'BBMP residential UAV annexure',
          url: 'https://bbmptax.karnataka.gov.in/documents/annexure_I%20Table-I%20Unit%20Area%20Value%20for%20Residential%20Properties%20.pdf',
        },
      ],
      guideLinks: [
        {
          label: 'BBMP property tax 2026-27 guide',
          href: '/bbmp-property-tax-2026-27',
          description:
            'Assessment-year checklist, e-khata notice context, payment and receipt search intent.',
        },
      ],
      relatedGuides: [
        'property-document-checklist',
        'stamp-duty-registration-charges-india',
        'circle-rate-vs-market-rate',
      ],
      estimateNote:
        'BBMP residential estimate uses built-up area x monthly UAV x 10 months, then depreciation, 20% tax, 24% cess, and optional early-payment rebate.',
      context: [
        'BBMP property tax is commonly estimated from built-up area, property usage, zone/category, age depreciation, and applicable cess. Residential UAV calculation uses 10 months because two months are treated as repair and maintenance allowance.',
        'Use this calculator to plan the annual outflow before you open the BBMP payment portal. Adjust the unit area value to match your ward, usage, and property category.',
      ],
      faqs: [
        {
          q: 'How is BBMP property tax calculated?',
          a: 'BBMP property tax usually depends on built-up area, usage type, unit area value, property age depreciation, and cess. This calculator uses a simplified planning formula so you can estimate the yearly amount before final payment on the BBMP portal.',
        },
        {
          q: 'What is needed for BBMP property tax online payment?',
          a: 'You generally need your property identification details such as SAS application number, PID, or khata-related information. This tool does not pay tax; it only estimates the amount.',
        },
      ],
    },
    'ghmc-property-tax-calculator': {
      slug: 'ghmc-property-tax-calculator',
      city: 'Hyderabad',
      authority: 'GHMC',
      title: 'GHMC Property Tax Calculator',
      description:
        'Estimate GHMC residential property tax in Hyderabad from plinth area, monthly rental value, slab rate, depreciation, and library cess.',
      defaultArea: 1200,
      defaultRate: 4,
      rateLabel: 'monthly rental value / sq ft',
      taxRate: 17,
      rebatePercent: 0,
      depreciationPercent: 10,
      cessPercent: 8,
      lastUpdated: '2026-06-22',
      sourceUrls: [
        {
          label: 'GHMC property tax services',
          url: 'https://www.ghmc.gov.in/Propertytax.aspx',
        },
      ],
      guideLinks: [
        {
          label: 'GHMC property tax search by house number',
          href: '/ghmc-property-tax-search-by-house-number',
          description:
            'House number/PTIN lookup guide for dues, receipt, and official payment checks.',
        },
      ],
      relatedGuides: [
        'property-document-checklist',
        'rera-project-search-guide',
        'stamp-duty-registration-charges-india',
      ],
      estimateNote:
        'GHMC residential estimate uses plinth area x monthly rental value x 12 months, then slab tax, depreciation, and library cess. Exact tax depends on official assessment.',
      context: [
        'GHMC residential property tax is based on gross annual rental value, slab percentage, building age depreciation, and library cess. Commercial properties use a different formula.',
        'This page is tuned for residential planning in Hyderabad. For payment, mutation, and official dues, use GHMC records and the official GHMC portal.',
      ],
      faqs: [
        {
          q: 'What is the GHMC property tax formula?',
          a: 'For residential property, GHMC tax is commonly estimated from gross annual rental value, a slab rate, building depreciation, and library cess. Exact payable tax can vary by locality and official assessment.',
        },
        {
          q: 'When are property tax due dates in Hyderabad?',
          a: 'GHMC property tax is generally paid in half-yearly cycles. Check the official GHMC portal for the current year due dates, rebates, and interest rules.',
        },
      ],
    },
    'mcd-property-tax-calculator': {
      slug: 'mcd-property-tax-calculator',
      city: 'Delhi',
      authority: 'MCD',
      title: 'MCD Property Tax Calculator',
      description:
        'Estimate MCD property tax for Delhi residential properties using annual value, tax rate, occupancy, age depreciation, and rebate.',
      defaultArea: 1000,
      defaultRate: 10,
      rateLabel: 'monthly unit value / sq ft',
      taxRate: 12,
      rebatePercent: 10,
      depreciationPercent: 0,
      cessPercent: 0,
      lastUpdated: '2026-06-22',
      sourceUrls: [
        {
          label: 'MCD tentative property tax calculator',
          url: 'https://mcdonline.nic.in/ptrmcd/web/citizen/property/propertyTaxCalculatorSearchByUpic',
        },
      ],
      guideLinks: [
        {
          label: 'MCD property tax CA number guide',
          href: '/mcd-property-tax-ca-number',
          description:
            'CA number, UPIC, last-date, receipt, and official Delhi property-tax record guide.',
        },
      ],
      relatedGuides: [
        'property-document-checklist',
        'circle-rate-vs-market-rate',
        'stamp-duty-registration-charges-india',
      ],
      estimateNote:
        'MCD estimate is a planning shortcut. Official payable tax depends on UPIC, colony category, covered area, use, occupancy, structure, age factors, and current rebates.',
      context: [
        'MCD property tax in Delhi depends on property category, colony/unit value, covered area, usage, occupancy, structure, age, and applicable rebates.',
        'Use this as a quick estimator for budgeting. Final assessment and payment should be completed through the official MCD property tax system.',
      ],
      faqs: [
        {
          q: 'How is MCD property tax calculated in Delhi?',
          a: 'MCD property tax depends on annual value, property category, covered area, usage, occupancy, structure, and age factors. This calculator gives a planning estimate from the most visible inputs.',
        },
        {
          q: 'Is rebate available on MCD property tax?',
          a: 'Rebate rules can apply for early payment, specific owner categories, or property types. Adjust the rebate field if you know your eligible discount before paying on the official portal.',
        },
      ],
    },
  }

export const PROPERTY_TAX_SLUGS = Object.keys(
  PROPERTY_TAX_CONTENT,
) as Array<PropertyTaxSlug>
