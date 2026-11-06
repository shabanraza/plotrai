import type { FinishingToolContent } from '#/data/finishing-calc-content'

export const WORK_ORDER_CONTENT: FinishingToolContent = {
  path: '/work-order-format',
  title: 'Work order format',
  metaTitle: 'Work Order Format for Civil Work — Free PDF Template · Plotr Ai',
  description:
    'Free civil work order format for India: fill in the owner and contractor, scope of work, item rates, payment stages, start and completion dates and terms, and download the work order as a PDF. No sign-up.',
  tagline:
    'A civil work order from owner to contractor: parties, scope, item rates, payment stages and terms. Fill it in and download the PDF from your browser.',
  context: {
    title: 'Sample civil work order',
    paragraphs: [
      'A work order is what the owner gives the contractor after accepting a quotation. It fixes what will be done, at what rate, by when, and how payment will be made.',
      'Take an order for a ground floor slab and walls: the scope names the drawings and specification, the item lines list brickwork per sq ft, plaster per sq ft and the RCC slab per sq ft at the agreed rates, and the quantities are measured on completion.',
      'The payment stages tie each payment to finished work, for example 30% after the slab is cast, 40% after brickwork and 30% after plaster and curing. A retention of 5% held for a defects period is common on bigger jobs.',
      'Both parties sign and keep a copy. The terms cover material supply, site safety, the defects period and how disputes will be settled.',
    ],
  },
  faqs: [
    {
      q: 'What is a work order in construction?',
      a: 'A written instruction from the owner to a contractor to carry out stated work at agreed rates. It follows the accepted quotation and is the basis for measurement and payment.',
    },
    {
      q: 'What should a work order include?',
      a: 'The owner and contractor details, the site, the work order number and date, the scope of work, item rates, start and completion dates, payment stages, and terms such as material supply, retention, defects period and dispute settlement.',
    },
    {
      q: 'What is the difference between a quotation and a work order?',
      a: 'The contractor sends a quotation to offer prices. The owner issues a work order to accept and confirm the work at those prices.',
    },
    {
      q: 'Is a work order legally binding?',
      a: 'Once accepted and signed by both parties it is evidence of a contract. For large works, have a lawyer review it and consider a formal agreement on stamp paper.',
    },
    {
      q: 'Is my work order saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [
    { label: 'Indian Contract Act, 1872' },
    { label: 'Line amounts, subtotal, GST and total are worked out from the rates you enter' },
  ],
  note: 'A template, not legal advice. For large contracts, have the terms reviewed and signed on stamp paper as your state requires.',
}
