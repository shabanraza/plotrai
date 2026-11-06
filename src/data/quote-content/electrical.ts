import type { FinishingToolContent } from '#/data/finishing-calc-content'

export const ELECTRICAL_QUOTATION_CONTENT: FinishingToolContent = {
  path: '/electrical-quotation-format',
  title: 'Electrical quotation format',
  metaTitle:
    'Electrical Quotation Format for House Wiring with Material — Free PDF · Plotr Ai',
  description:
    'Free electrical quotation format for house wiring in India: count light, fan, socket, power and AC points, list wire, conduit, DB and MCBs, add your rates and labour per point, add GST and download a PDF. No sign-up.',
  tagline:
    'A house wiring quotation with material and labour per point. Count the points, list the wire, DB and MCBs, add your rates, and the PDF downloads from your browser.',
  context: {
    title: 'Sample house wiring quotation with material',
    paragraphs: [
      'Take a 2BHK with 14 light points, 5 fan points, 12 socket points (6 A), 4 power points (16 A) and 2 AC points. That is 37 points in all.',
      'Electricians in India usually quote labour per point, so the labour line is 37 points. Switches, sockets and plates are also listed per point.',
      'Wire is listed by size. 1.5 sq mm is common for light and fan circuits, 2.5 sq mm for socket circuits, and 4 sq mm for power and AC points. Quantities depend on the run lengths, so enter the coils or metres you measured. The DB and MCBs are listed as numbers.',
      'Each line’s amount is quantity × rate. GST is added only if you enter a rate, and the terms set the advance, how long the prices hold and what is excluded, such as light fittings, chasing and patching walls, or the meter connection.',
    ],
  },
  faqs: [
    {
      q: 'What is a point in electrical wiring?',
      a: 'A point is one outlet: a light, fan, socket, power or AC outlet, with its switch and the wiring from the board. Labour is commonly quoted per point.',
    },
    {
      q: 'What should an electrical quotation include?',
      a: 'Your details and GSTIN if registered, the client and site, the number of each type of point, wire by size, conduit, the DB and MCBs, labour, the subtotal, GST and total, and terms for the advance, validity and exclusions.',
    },
    {
      q: 'Which wire size is used for house wiring?',
      a: '1.5 sq mm copper is common for lights and fans, 2.5 sq mm for 6 A socket circuits, and 4 sq mm for 16 A power and AC points. Follow the load and IS 732 for your circuits.',
    },
    {
      q: 'Does this tool give electrical rates per point?',
      a: 'No. Rates change by city, brand and finish, so every rate starts empty and you enter your own.',
    },
    {
      q: 'Is my quotation saved or sent anywhere?',
      a: 'No. The PDF is built in your browser and nothing you type is sent to our server.',
    },
  ],
  sources: [
    { label: 'IS 732:2019 Code of practice for electrical wiring installations (BIS)' },
    { label: 'Point count and line amounts are worked out from the numbers and rates you enter' },
  ],
  note: 'Wire sizes are common practice, not a design. Size circuits for the actual load as per IS 732 and get the installation tested.',
}
