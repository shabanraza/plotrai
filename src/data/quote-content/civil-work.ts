import {
  IS_1077,
  IS_1661,
  IS_2212,
  IS_456,
  type FinishingToolContent,
} from '#/data/finishing-calc-content'

export const CIVIL_WORK_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/civil-work-quotation-format',
  title: 'Civil work quotation format',
  metaTitle: 'Civil Work Quotation Format with Material — Free PDF · Plotr Ai',
  description:
    'Free civil work quotation format for India: enter brick wall, plaster and RCC slab sizes to work out bricks, cement bags, sand, aggregate and steel, add your rates for material and labour, add GST and download a PDF.',
  tagline:
    'A civil work quotation with material. Wall, plaster and slab sizes fill in bricks, cement, sand, aggregate and steel, you add your rates, and the PDF downloads from your browser.',
  context: {
    title: 'Sample civil work quotation with material',
    paragraphs: [
      'Take a 20 ft long, 10 ft high, 9 inch brick wall with one 21 sq ft door, plastered 12 mm on both faces, and a 20 × 15 ft RCC slab 125 mm thick.',
      'Brickwork uses common 230 mm bricks in 1:6 cement mortar with 5% wastage. Plaster is 1:4 with 10% wastage. The slab uses an M20 mix with about 80 kg of steel per m³. These are the same formulas as our brick, plaster and material calculators.',
      'The material lines add the cement and sand from all three items into one cement line and one sand line, so you buy them once. Labour is listed per sq ft for brickwork, plaster and the slab, the way most contractors quote small civil jobs.',
      'Each line’s amount is quantity × rate. GST is added only if you enter a rate, and the terms set the advance, how long the prices hold and what is excluded, such as shuttering hire, curing water or debris removal.',
    ],
  },
  faqs: [
    {
      q: 'What should a civil work quotation include?',
      a: 'Your details and GSTIN if registered, the client and site, each item of work with its material and labour, quantities and units, rates and amounts, the subtotal, GST and total, and terms for the advance, validity and exclusions.',
    },
    {
      q: 'What is the difference between a quotation with material and labour only?',
      a: 'With material, the contractor supplies bricks, cement, sand, aggregate and steel and lists them as lines. Labour only lists just the work per sq ft or per m³, and the owner buys the material.',
    },
    {
      q: 'How much cement is needed for an RCC slab?',
      a: 'An M20 slab takes about 8 bags of cement per m³ by the thumb rule. A 20 × 15 ft slab 125 mm thick is about 3.5 m³, or about 28 bags.',
    },
    {
      q: 'Does this tool give civil work rates?',
      a: 'No. Material and labour rates change by city and season, so every rate starts empty and you enter your own.',
    },
    {
      q: 'Is my quotation saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [IS_1077, IS_2212, IS_1661, IS_456],
  note: 'Thumb-rule quantities for quoting. A structural slab needs an engineer’s design and bar schedule.',
}
