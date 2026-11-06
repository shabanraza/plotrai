/**
 * "Next step" card shown after a tool's result, so a visitor moves on to the next decision
 * instead of hitting a dead end. Keyed by the tool's path; targets must exist in site-map.ts.
 */
export interface NextStep {
  to: string
  title: string
  description: string
}

export const NEXT_STEPS: Record<string, NextStep> = {
  '/brick-calculator': {
    to: '/plaster-calculator',
    title: 'Plaster the wall next',
    description: 'Cement and sand for plastering the same wall area.',
  },
  '/plaster-calculator': {
    to: '/paint-calculator',
    title: 'Then paint it',
    description: 'Litres of paint and kg of putty for the plastered area.',
  },
  '/paint-calculator': {
    to: '/painting-quotation-format',
    title: 'Turn this into a painting quotation',
    description: 'Add your rates for material and labour and download the quote as a PDF.',
  },
  '/painting-quotation-format': {
    to: '/tiles-work-quotation-format',
    title: 'Quoting floor tiles too? Make a tiles quotation',
    description: 'Same format for tile fixing, with tiles and skirting worked out from room sizes.',
  },
  '/tiles-work-quotation-format': {
    to: '/construction-cost-calculator',
    title: 'See the budget for the whole house',
    description: 'Per sq ft construction cost for your city, broken down by build stage.',
  },
  '/tiles-calculator': {
    to: '/construction-cost-calculator',
    title: 'See the budget for the whole house',
    description: 'Per sq ft construction cost for your city, broken down by build stage.',
  },
  '/steel-calculator': {
    to: '/rcc-slab-calculator',
    title: 'Add cement, sand and aggregate for the slab',
    description: 'The RCC slab calculator gives the concrete materials for the same slab.',
  },
  '/solar-panel-cost-calculator': {
    to: '/construction-cost-calculator',
    title: 'Building a new house? Budget the whole build',
    description: 'Per sq ft construction cost for your city, broken down by build stage.',
  },
  '/stamp-duty-calculator': {
    to: '/home-buying-cost-calculator',
    title: 'Add GST, the down payment and your EMI',
    description: 'The home buying cost calculator adds every cost on top of the property price.',
  },
  '/delhi-circle-rate': {
    to: '/stamp-duty/delhi',
    title: 'Work out stamp duty in Delhi',
    description: 'Stamp duty is charged on the higher of the sale price and the circle-rate value.',
  },
  '/construction-cost-calculator': {
    to: '/material-calculator',
    title: 'Check the quantities in your contractor’s quote',
    description: 'Estimate cement, bricks, steel and sand for any wall, slab or column.',
  },
  '/material-calculator': {
    to: '/construction-cost-calculator',
    title: 'See the budget for the whole house',
    description: 'Per sq ft construction cost for your city, broken down by build stage.',
  },
  '/plot-converter': {
    to: '/construction-cost-calculator',
    title: 'Building on this plot?',
    description: 'Estimate the construction cost for your city and finish level.',
  },
  '/property-capital-gains-calculator': {
    to: '/home-buying-cost-calculator',
    title: 'Reinvesting in another home?',
    description: 'Work out the full cost of the next purchase, including stamp duty and GST.',
  },
  '/indexation-calculator': {
    to: '/property-capital-gains-calculator',
    title: 'Turn the indexed cost into tax',
    description: 'For a sale after July 2024, compare 20% with indexation against 12.5% without it.',
  },
  '/bbmp-property-tax-calculator': {
    to: '/bbmp-property-tax-2026-27',
    title: 'Pay BBMP tax for 2026-27',
    description: 'Due dates, the rebate window, e-khata and where to download the receipt.',
  },
  '/ghmc-property-tax-calculator': {
    to: '/ghmc-property-tax-search-by-house-number',
    title: 'Find your GHMC tax by house number',
    description: 'Look up the PTIN and dues for a Hyderabad property.',
  },
  '/mcd-property-tax-calculator': {
    to: '/mcd-property-tax-ca-number',
    title: 'Find your MCD CA number and pay',
    description: 'Where to find the CA number or UPIC, deadlines and receipts.',
  },
}
