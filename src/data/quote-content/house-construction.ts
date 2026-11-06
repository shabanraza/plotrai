import type { FinishingToolContent } from '#/data/finishing-calc-content'

export const HOUSE_CONSTRUCTION_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/house-construction-quotation',
  title: 'House construction quotation',
  metaTitle:
    'House Construction Quotation Format — Stage-Wise, Free PDF · Plotr Ai',
  description:
    'Free house construction quotation format for India: enter the built-up area and floors, quote each stage from foundation to handover per sq ft, add a stage-wise payment schedule and GST, and download a PDF. No sign-up.',
  tagline:
    'A stage-wise house construction quotation, from site preparation to handover. Enter the built-up area, add your rate for each stage, and the PDF downloads from your browser.',
  context: {
    title: 'Sample stage-wise house construction quotation',
    paragraphs: [
      'Take a G+1 house with 1,000 sq ft on each floor, 2,000 sq ft built-up in all. Each stage is one line of 2,000 sq ft, and the contractor enters a rate per sq ft for that stage.',
      'The seven stages match our construction cost calculator: site preparation, foundation, structure (RCC), masonry and plaster, electrical and plumbing, flooring and finishing, and paint and handover.',
      'The payment schedule ties each payment to a finished stage, using the typical share of cost for that stage. Edit the percentages to match what you agree with the owner.',
      'Each line’s amount is area × rate. GST is added only if you enter a rate, and the terms set the advance, how long the prices hold and what is excluded, such as approvals, the boundary wall, borewell or interiors.',
    ],
  },
  faqs: [
    {
      q: 'What should a house construction quotation include?',
      a: 'The contractor’s and owner’s details, the site, built-up area and floors, each stage of work with its rate and amount, the specification of materials, a stage-wise payment schedule, GST and total, and terms for validity and exclusions.',
    },
    {
      q: 'What is a stage-wise payment schedule?',
      a: 'Each payment falls due when a stage is finished, for example after the foundation, after each slab and after plastering. It protects the owner from paying ahead of the work.',
    },
    {
      q: 'What share of the cost goes to each stage?',
      a: 'In our construction cost model: site preparation 4%, foundation 13%, structure 22%, masonry and plaster 16%, electrical and plumbing 14%, flooring and finishing 19%, and paint and handover 12%. Your project may differ.',
    },
    {
      q: 'Does this tool give construction rates per sq ft?',
      a: 'Not in the quotation: every rate starts empty and you enter your own. For a city benchmark, use our construction cost calculator.',
    },
    {
      q: 'Is my quotation saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [
    { label: 'Stage list and typical shares from the Plotrai construction cost calculator' },
    { label: 'Line amounts, subtotal, GST and total are worked out from the rates you enter' },
  ],
  note: 'Stage shares are typical, not fixed. Attach the material specification (cement and steel brands, tile and fitting allowances) to the quotation.',
}
