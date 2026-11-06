import {
  APCOLITE,
  BIRLA_PUTTY,
  FINISHING_CHECKED,
  type FinishingToolContent,
} from '#/data/finishing-calc-content'

export const PAINTING_QUOTATION_CHECKED = FINISHING_CHECKED

export const PAINTING_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/painting-quotation-format',
  title: 'Painting quotation format',
  metaTitle:
    'Painting Quotation Format with Material — Free PDF Template · Plotr Ai',
  description:
    'Free painting quotation format for India: add rooms to work out litres of paint and kg of putty, enter your rates for material and labour per sq ft, add GST and download the quotation as a PDF. No sign-up.',
  tagline:
    'Make a painting quotation with material and labour in a few minutes. Room sizes fill in the paint and putty quantities, you add your rates, and the PDF downloads straight from your browser.',
  context: {
    title: 'Sample painting quotation with material',
    paragraphs: [
      'Take one 12 × 10 ft bedroom with a 10 ft ceiling, walls only, and 40 sq ft of door and window. That is 400 sq ft of paintable wall.',
      'Material lines come first. Two coats of interior emulsion at 90 sq ft per litre per coat (the Apcolite data sheet figure) need about 8.9 litres, so quote 9 litres. Wall putty at about 20 sq ft per kg (Birla White’s stated coverage) needs 20 kg. Primer coverage differs by product, so read it off the tin before you fill in that line.',
      'Labour is quoted per sq ft of paintable area, here 400 sq ft. Some painters quote labour and material together as one rate per sq ft. If you do that, delete the material lines and put the combined rate on the labour line.',
      'Each line’s amount is quantity × rate. The subtotal adds the lines, GST is added on top only if you are registered and enter a rate, and the total is what the client pays. The terms cover the advance, how long the prices hold and what is not included, such as furniture shifting or wall repairs.',
    ],
  },
  faqs: [
    {
      q: 'What should a painting quotation include?',
      a: 'Your name, phone and GSTIN if registered; the client’s name and site address; a quote number and date; each line with description, quantity, unit, rate and amount; subtotal, GST and total; and terms for the advance, validity and exclusions.',
    },
    {
      q: 'What is the difference between a painting quotation with material and labour only?',
      a: 'A quotation with material lists putty, primer and paint as separate lines with quantities, plus labour per sq ft. A labour-only quotation has just the labour line, and the client buys the material. You can make either here by keeping or deleting the material lines.',
    },
    {
      q: 'How do I calculate paint quantity for a quotation?',
      a: 'Paintable area = 2 × (length + width) × height, plus the ceiling if included, minus doors and windows. Litres = area × coats ÷ coverage per litre per coat. Take the coverage from the paint’s data sheet or tin.',
    },
    {
      q: 'Does this tool give painting rates per sq ft?',
      a: 'No. Rates change by city, brand and finish, so every rate starts empty and you enter your own. The tool works out quantities and does the arithmetic.',
    },
    {
      q: 'Is my quotation data saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server. Keep the downloaded PDF, because the form clears when you leave the page.',
    },
  ],
  sources: [
    APCOLITE,
    BIRLA_PUTTY,
    { label: 'Line amounts, subtotal, GST and total are worked out from the rates you enter' },
  ],
  note: 'Quantities use the manufacturers’ theoretical coverage. Rough or porous walls take more, so check before you quote. GST, if any, is added at the rate you enter.',
}
