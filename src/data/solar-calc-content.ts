import type { FinishingToolContent } from '#/data/finishing-calc-content'

const PM_SURYA_GHAR = {
  label:
    'PM Surya Ghar: Muft Bijli Yojana national portal, MNRE (subsidy per kW and suitable capacity by monthly use)',
  url: 'https://pmsuryaghar.gov.in/',
}
const PM_SURYA_GHAR_FAQ = {
  label:
    'PM Surya Ghar FAQ, MNRE (₹78,000 maximum, RWA ₹18,000 per kW, 10% more in special category states)',
  url: 'https://pmsuryaghar.gov.in/#/faq',
}
const BSES_FAQ = {
  label:
    'BSES Delhi rooftop solar FAQ, September 2025 (1 kWp generates 3–4 units a day on average)',
  url: 'https://www.bsesdelhi.com/documents/55701/1611949183/RTS_FAQ_Sep25.pdf',
}
const BRIDGEWAY_PRICE = {
  label:
    'Bridgeway Power, 1 kW solar system price in India 2026 (installer quote, ₹55,000–65,000 per kW before subsidy; indicative)',
  url: 'https://bridgewaypower.in/blog/1kw-solar-system-price-india-2026',
}

export const SOLAR_CONTENT: FinishingToolContent = {
  path: '/solar-panel-cost-calculator',
  title: 'Solar panel cost calculator',
  metaTitle:
    'Solar Panel Cost Calculator with PM Surya Ghar Subsidy (1–10 kW) · Plotr Ai',
  description:
    'Rooftop solar panel cost calculator for India: pick 1, 2, 3, 5 or 10 kW, get the PM Surya Ghar subsidy (up to ₹78,000), the cost after subsidy, monthly units, savings and payback.',
  tagline:
    'Rooftop solar cost for your home after the PM Surya Ghar subsidy, with the units it generates and how soon it pays back.',
  context: {
    title: 'How the solar panel cost calculator works',
    paragraphs: [
      'The system cost is the size in kW times the installed price per kW. Prices differ by city, panel brand and roof, so the price is an indicative ₹60,000 per kW that you should replace with your vendor’s quote.',
      'The central subsidy follows the PM Surya Ghar slabs on the national portal: ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, capped at ₹78,000. Special category states get 10% more. Add any state or discom subsidy in its own field.',
      'Generation is the size times the units one kW makes a day, times 30. BSES puts this at 3–4 units a day; it is lower in cloudy or shaded places and higher in sunny states. Savings count only the units you would have used yourself, at your tariff, because surplus units sent to the grid are settled at a lower rate that differs by state.',
    ],
  },
  faqs: [
    {
      q: 'What is the cost of a 3 kW solar system after subsidy?',
      a: 'At ₹60,000 per kW, a 3 kW system costs about ₹1,80,000. The PM Surya Ghar subsidy is ₹78,000, so you pay about ₹1,02,000. Your vendor’s quote may be higher or lower.',
    },
    {
      q: 'How much subsidy is given for solar panels under PM Surya Ghar?',
      a: '₹30,000 for 1 kW, ₹60,000 for 2 kW and ₹78,000 for 3 kW or more. In the North Eastern states, Sikkim, Himachal Pradesh, Uttarakhand, Jammu and Kashmir, Ladakh, Andaman and Nicobar Islands and Lakshadweep it is 10% higher, up to ₹85,800.',
    },
    {
      q: 'Is there a subsidy for a 5 kW or 10 kW system?',
      a: 'Yes, but it stays at the ₹78,000 cap. Capacity above 3 kW gets no extra central subsidy, so the cost per kW after subsidy falls less for bigger systems.',
    },
    {
      q: 'How many units does a 1 kW solar panel generate?',
      a: 'About 3–4 units a day on average, or roughly 90–120 units a month, according to the BSES rooftop solar FAQ. Summer days give more and monsoon days less.',
    },
    {
      q: 'What size solar system do I need?',
      a: 'The PM Surya Ghar portal suggests 1–2 kW for up to 150 units a month, 2–3 kW for 150–300 units and above 3 kW for more than 300 units. Check the units on your last few electricity bills, not the amount.',
    },
    {
      q: 'How do I apply for the PM Surya Ghar subsidy?',
      a: 'Register on pmsuryaghar.gov.in with your electricity consumer number, pick a registered vendor and get the system installed with domestically made cells and modules. After the discom inspects and installs the net meter, the subsidy is paid into your bank account. The portal says the scheme closes on 31 March 2027.',
    },
    {
      q: 'Can a housing society get the subsidy?',
      a: 'Yes. A group housing society or resident welfare association gets ₹18,000 per kW for common facilities such as lifts, lighting and EV charging, up to 3 kW per house and 500 kW in total.',
    },
  ],
  sources: [PM_SURYA_GHAR, PM_SURYA_GHAR_FAQ, BSES_FAQ, BRIDGEWAY_PRICE],
  note: 'Estimate only. The subsidy follows the PM Surya Ghar slabs for residential consumers; the installed price and generation are indicative, so use your vendor’s quote and your discom’s tariff.',
}
