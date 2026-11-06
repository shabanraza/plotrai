import type { FinishingToolContent } from '#/data/finishing-calc-content'

const NOBROKER = {
  label:
    'NoBroker, interior designer costs in India, June 2026 (kitchen, living room and bathroom ranges; city ranges)',
  url: 'https://www.nobroker.in/interiors/design-guides/interior-designer-costs-in-india/',
}
const DESIGNCAFE = {
  label:
    'DesignCafe, 3BHK interior design cost, September 2026 (wardrobes, false ceiling, painting)',
  url: 'https://www.designcafe.com/blog/home-interiors/3bhk-interior-design-cost/',
}
const LIVSPACE = {
  label:
    'Livspace, home interior price calculator, November 2026 (1BHK, 2BHK and 3BHK totals)',
  url: 'https://www.livspace.com/in/interiors/home-interior-price-calculator',
}

export const INTERIOR_CONTENT: FinishingToolContent = {
  path: '/home-interior-cost-calculator',
  title: 'Home interior cost calculator',
  metaTitle:
    'Home Interior Cost Calculator for 1, 2 and 3 BHK in India (2026) · Plotr Ai',
  description:
    'Home interior cost calculator for India: pick 1, 2, 3 or 4 BHK and a finish level to get an item-wise estimate for the modular kitchen, wardrobes, living room, false ceiling and painting.',
  tagline:
    'An item-wise interior budget for your flat: modular kitchen, wardrobes, living room, false ceiling and painting.',
  context: {
    title: 'How the home interior cost calculator works',
    paragraphs: [
      'There are no official rates for interiors, so each item uses a price range published by interior companies: NoBroker for the kitchen, living room and bathrooms by size, and DesignCafe for wardrobes, false ceiling and painting. Essential takes the low end of each range, mid-range the middle and premium the high end.',
      'Painting is priced on wall area, which is roughly 2.4 times the carpet area. That ratio comes from DesignCafe’s own example of a 1,300 sq ft 3BHK costing ₹55,000–1.1 lakh to paint.',
      'Loose furniture (beds, sofa, dining table), appliances, flooring, electrical rewiring, decor and design fees are not included. Ask every vendor for an item-wise quote with the board, finish and hardware brand named, so you can compare like with like.',
    ],
  },
  faqs: [
    {
      q: 'What is the interior cost for a 2BHK flat?',
      a: 'For an 850 sq ft 2BHK at mid-range finish, with a modular kitchen, two wardrobes, a living room unit, a false ceiling in the living and dining area and painting, the estimate is about ₹7.9 lakh. Livspace puts a 2BHK at ₹5.5–9 lakh and DesignCafe at ₹7–10 lakh.',
    },
    {
      q: 'How much does a 3BHK interior cost?',
      a: 'A 1,300 sq ft 3BHK at mid-range finish comes to about ₹9.3 lakh with three wardrobes. Livspace gives ₹8–14 lakh, and DesignCafe says a realistic middle-class 3BHK budget is ₹8–11 lakh.',
    },
    {
      q: 'What is the interior cost for a 1BHK?',
      a: 'A 500 sq ft 1BHK at mid-range finish is about ₹4.7 lakh with a small kitchen, one wardrobe and a living room unit. Livspace puts a 1BHK at ₹3.5–6 lakh.',
    },
    {
      q: 'How much does a modular kitchen cost?',
      a: 'NoBroker gives ₹1–2 lakh for a small kitchen (50–80 sq ft), ₹2–3.5 lakh for a medium one (80–120 sq ft) and ₹3.5–5 lakh or more for a large one. The board, shutter finish and hardware brand cause most of the difference.',
    },
    {
      q: 'Does interior cost differ by city?',
      a: 'Yes. NoBroker’s 2BHK ranges are ₹5–10 lakh in Mumbai, ₹5–9 lakh in Delhi NCR, ₹5–8 lakh in Bangalore, ₹4.5–8 lakh in Hyderabad, Chennai and Pune, ₹4–7 lakh in Kolkata and ₹3.5–6.5 lakh in tier-2 cities.',
    },
    {
      q: 'What is not included in the estimate?',
      a: 'Loose furniture such as beds, sofas and the dining table, kitchen appliances, flooring, electrical rewiring, decor and designer fees. Bathroom work is included only if you add bathrooms to upgrade.',
    },
  ],
  sources: [NOBROKER, DESIGNCAFE, LIVSPACE],
  note: 'Indicative estimate from published vendor price ranges, not a quote. Prices vary by city, material and brand; get item-wise quotes before you sign.',
}
