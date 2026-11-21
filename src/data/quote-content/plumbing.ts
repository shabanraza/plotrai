import type { FinishingToolContent } from '#/data/finishing-calc-content'

export const PLUMBING_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/plumbing-quotation-format',
  title: 'Plumbing quotation format',
  metaTitle: 'Plumbing Quotation Format with Material List — Free PDF · Plotr Ai',
  description:
    'Free plumbing quotation format for India: count bathrooms, WCs, basins, sinks and taps, list CPVC and PVC pipes and fittings, add your rates and labour per point, add GST and download a PDF. No sign-up.',
  tagline:
    'A plumbing quotation with a material list and labour per point. Count the fixtures, enter the pipe lengths, add your rates, and the PDF downloads from your browser.',
  context: {
    title: 'Sample plumbing quotation with material',
    paragraphs: [
      'Take a 2BHK with 2 bathrooms (2 WCs, 2 basins, 2 showers), a kitchen sink and 6 other taps. That is 13 sanitary points, plus 2 concealed diverters or stop cocks for the bathrooms.',
      'Material lines cover CPVC pipe for hot and cold water supply, PVC or uPVC pipe for drainage, and fittings such as elbows, tees and valves. Pipe lengths depend on the layout, so enter the running metres you measured.',
      'Labour is usually quoted per sanitary point, with WC and wash basin fixing listed separately when the plumber also installs the sanitaryware.',
      'Each line’s amount is quantity × rate. GST is added only if you enter a rate, and the terms set the advance, how long the prices hold and what is excluded, such as sanitaryware, the water tank, and chasing and patching walls.',
    ],
  },
  faqs: [
    {
      q: 'What should a plumbing quotation list include?',
      a: 'Your details and GSTIN if registered, the client and site, the number of each fixture, pipes by type and size in running metres, fittings, labour per point, the subtotal, GST and total, and terms for the advance, validity and exclusions.',
    },
    {
      q: 'What is the difference between CPVC and PVC pipes?',
      a: 'CPVC handles hot and cold water and is used for supply lines inside the house. PVC or uPVC is used for cold water and for soil, waste and rainwater drainage.',
    },
    {
      q: 'How is plumbing labour charged?',
      a: 'Commonly per sanitary point (each WC, basin, sink, tap or shower outlet), or as a lump sum per bathroom. Rates vary by city, so enter your own.',
    },
    {
      q: 'Does this tool give plumbing rates?',
      a: 'No. Pipe, fitting and labour rates change by brand and city, so every rate starts empty and you enter your own.',
    },
    {
      q: 'Is my quotation saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [
    { label: 'IS 15778:2007 Chlorinated polyvinyl chloride (CPVC) pipes for potable hot and cold water (BIS)' },
    { label: 'IS 1172:1993 Code of basic requirements for water supply, drainage and sanitation (BIS)' },
    { label: 'Point count and line amounts are worked out from the numbers and rates you enter' },
  ],
  note: 'Pipe sizes and lengths depend on the layout and water pressure. Measure on site before you quote.',
}
