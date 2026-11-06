/**
 * Copy for the trade quotation format pages (tiles, electrical, plumbing…). Painting lives in
 * painting-quotation-content.ts. Every page leaves rates empty: the user enters their own.
 */
import {
  FINISHING_CHECKED,
  TILES_CONTENT,
  type FinishingToolContent,
} from '#/data/finishing-calc-content'

export const TRADE_QUOTE_CHECKED = FINISHING_CHECKED

const MATHS_SOURCE = {
  label: 'Line amounts, subtotal, GST and total are worked out from the rates you enter',
}

export const TILES_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/tiles-work-quotation-format',
  title: 'Tiles work quotation format',
  metaTitle: 'Tiles Work Quotation Format with Material — Free PDF · Plotr Ai',
  description:
    'Free tiles work quotation format for India: enter room sizes and tile size to work out tiles, skirting and laying area, add your rates for material and labour per sq ft, add GST and download a PDF. No sign-up.',
  tagline:
    'A tile fixing quotation with material and labour. Room sizes fill in the number of tiles, the laying area and skirting, you add your rates, and the PDF downloads from your browser.',
  context: {
    title: 'Sample tiles work quotation with material',
    paragraphs: [
      'Take a 12 × 10 ft hall: 120 sq ft of floor and 44 running ft of skirting. With 600 × 600 mm tiles (about 3.9 sq ft each) and 10% wastage, that is 132 sq ft to cover, or 35 tiles.',
      'Material lines list the tiles, tile adhesive or cement mortar, and grout. Adhesive and grout coverage depend on the product and bed thickness, so read them off the bag before you fill in those quantities.',
      'Labour is quoted per sq ft of floor laid, here 120 sq ft, with skirting per running ft. Contractors who quote laying with material as one rate per sq ft can delete the material lines and put that rate on the labour line.',
      'Each line’s amount is quantity × rate. GST is added only if you enter a rate, and the terms set the advance, how long the prices hold and what is excluded, such as breaking old tiles or debris removal.',
    ],
  },
  faqs: [
    {
      q: 'What should a tiles work quotation include?',
      a: 'Your details and GSTIN if registered, the client and site, a quote number and date, each line with quantity, unit, rate and amount, the subtotal, GST and total, and terms for the advance, validity and exclusions.',
    },
    {
      q: 'How is tile fixing labour charged?',
      a: 'Usually per sq ft of area laid for floors and walls, and per running ft for skirting. Rates vary by city and tile size, so enter your own.',
    },
    {
      q: 'How many tiles do I need for 100 sq ft?',
      a: 'A 600 × 600 mm tile covers about 3.9 sq ft, so 100 sq ft needs 26 tiles before wastage and about 29 with 10% wastage.',
    },
    {
      q: 'Does this tool give tile rates?',
      a: 'No. Tile prices and labour rates change by brand, size and city, so every rate starts empty and you enter your own.',
    },
    {
      q: 'Is my quotation saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [...TILES_CONTENT.sources, MATHS_SOURCE],
  note: 'Tile counts use the nominal tile size and ignore grout joints, which makes them slightly generous.',
}
