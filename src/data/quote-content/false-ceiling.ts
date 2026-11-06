import type { FinishingToolContent } from '#/data/finishing-calc-content'

export const FALSE_CEILING_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/false-ceiling-quotation-format',
  title: 'False ceiling quotation format',
  metaTitle:
    'False Ceiling Quotation Format — Gypsum and POP per Sq Ft with Material, Free PDF · Plotr Ai',
  description:
    'Free false ceiling quotation format for India: enter room sizes to work out the ceiling area in sq ft and the border length, choose gypsum, POP or PVC, add your rates per sq ft with material, add GST and download a PDF.',
  tagline:
    'A gypsum or POP false ceiling quotation per sq ft with material. Room sizes fill in the ceiling area and border length, you add your rates, and the PDF downloads from your browser.',
  context: {
    title: 'Sample false ceiling quotation with material',
    paragraphs: [
      'Take a 12 × 10 ft bedroom and a 16 × 12 ft hall. The ceiling area is 120 + 192 = 312 sq ft, and the borders add up to 44 + 56 = 100 running ft.',
      'False ceilings are normally quoted per sq ft of ceiling area, with material: the boards or POP, the GI frame and channels, jointing and finishing. That is one line of 312 sq ft.',
      'Coves, borders and bulkheads are often quoted per running ft, light cut-outs per number, and painting the ceiling per sq ft. Delete any line you don’t charge separately.',
      'Each line’s amount is quantity × rate. GST is added only if you enter a rate, and the terms set the advance, how long the prices hold and what is excluded, such as lights, electrical wiring and scaffolding for double-height rooms.',
    ],
  },
  faqs: [
    {
      q: 'How is a false ceiling charged?',
      a: 'Per sq ft of ceiling area, including material, with extras such as coves and borders per running ft and light cut-outs per number. Rates vary by material, design and city.',
    },
    {
      q: 'Gypsum or POP: which is better for a false ceiling?',
      a: 'Gypsum board is factory-made, quicker to install and gives a uniform finish. POP is made on site, suits curved and detailed designs, and takes longer and more skill. PVC panels are used in damp areas such as bathrooms and balconies.',
    },
    {
      q: 'How do I calculate false ceiling area?',
      a: 'Multiply each room’s length by its width and add the rooms together. The border length is the room’s perimeter, 2 × (length + width).',
    },
    {
      q: 'Does this tool give false ceiling rates per sq ft?',
      a: 'No. Rates change by material, brand, design and city, so every rate starts empty and you enter your own.',
    },
    {
      q: 'Is my quotation saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [
    { label: 'IS 2095 (Part 1):2011 Gypsum plaster boards, specification (BIS)' },
    { label: 'Ceiling area and border length from room sizes; line amounts from the rates you enter' },
  ],
  note: 'Area is the flat ceiling. Add bulkheads, drops and curved coves as separate lines measured on site.',
}
