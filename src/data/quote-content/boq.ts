import { IS_456, type FinishingToolContent } from '#/data/finishing-calc-content'

export const BOQ_CONTENT: FinishingToolContent = {
  path: '/boq-format-residential-building',
  title: 'BOQ format for residential building',
  metaTitle:
    'BOQ Format for Residential Building — Free Excel (CSV) and PDF · Plotr Ai',
  description:
    'Free BOQ format for a residential building in India: add slabs, columns, walls, PCC and plaster in metres to work out cement, sand, aggregate, bricks and steel, enter your rates, and download the bill of quantities as PDF or Excel (CSV).',
  tagline:
    'A bill of quantities for a house, worked out from the elements you add. Enter your rates, then download it as a PDF or as a CSV that opens in Excel.',
  context: {
    title: 'Sample BOQ for a residential building',
    paragraphs: [
      'Take one room’s structure: a 6 × 4 m RCC slab 125 mm thick, a 230 mm brick wall 20 m long and 3 m high, and 60 m² of 12 mm plaster.',
      'Each element uses the material calculator’s thumb rules: M20 concrete for slabs and columns (about 8 bags of cement per m³), 1:2:4 for PCC, brickwork in 1:6 mortar with about 500 bricks per m³, and 1:4 plaster at 12 mm.',
      'The BOQ adds the cement, sand, aggregate, bricks and steel from every element into one line each, ready for rates. Add labour or other items as extra lines.',
      'Download the PDF to share, or the CSV to keep working in Excel or Google Sheets. The CSV keeps the quantities, rates, amounts, GST and total.',
    ],
  },
  faqs: [
    {
      q: 'What is a BOQ in construction?',
      a: 'A bill of quantities lists every item of material or work with its quantity, unit, rate and amount. Contractors price it, and owners use it to compare quotes and track payments.',
    },
    {
      q: 'Can I download this BOQ in Excel?',
      a: 'Yes. The CSV download opens directly in Excel or Google Sheets with every line, rate, amount, GST and the total.',
    },
    {
      q: 'How accurate are the BOQ quantities?',
      a: 'They use common thumb rules, so they suit early estimates and small jobs. For a full building, take quantities from the structural drawings and bar bending schedule.',
    },
    {
      q: 'Does this tool give material rates?',
      a: 'No. Every rate starts empty, so enter current prices from your supplier. Our material calculator shows live cement and steel benchmarks if you need a reference.',
    },
    {
      q: 'Is my BOQ saved or sent anywhere?',
      a: 'No. The PDF and CSV are built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [
    IS_456,
    { label: 'IS 1200 Method of measurement of building and civil engineering works (BIS)' },
    { label: 'Material coefficients from the Plotrai material calculator thumb rules' },
  ],
  note: 'Thumb-rule quantities for estimates. Take quantities for a full building from its drawings.',
}
