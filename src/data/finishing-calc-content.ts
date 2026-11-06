import type { ToolSource } from '#/components/tools/tool-sources'
import {
  canonicalLink,
  faqPageLd,
  softwareAppLd,
  type FaqItem,
} from '#/lib/seo'

/** When the sources below were last checked. */
export const FINISHING_CHECKED = '2026-11-06'

const IS_456 = {
  label: 'IS 456:2000 Plain and reinforced concrete, code of practice (BIS)',
  url: 'https://law.resource.org/pub/in/bis/S03/is.456.2000.pdf',
}
const IS_1077 = {
  label: 'IS 1077:1992 Common burnt clay building bricks (BIS)',
  url: 'https://law.resource.org/pub/in/bis/S03/is.1077.1992.pdf',
}
const IS_2212 = {
  label: 'IS 2212:1991 Brickwork, code of practice (BIS)',
  url: 'https://law.resource.org/pub/in/bis/S03/is.2212.1991.pdf',
}
const IS_1661 = {
  label:
    'IS 1661:1972 Cement and cement-lime plaster finishes, code of practice (BIS)',
  url: 'https://law.resource.org/pub/in/bis/S03/is.1661.1972.pdf',
}
const IS_1786 = {
  label: 'IS 1786:2008 High strength deformed steel bars (BIS)',
  url: 'https://law.resource.org/pub/in/bis/S03/is.1786.2008.pdf',
}
const APCOLITE = {
  label:
    'Asian Paints Apcolite Premium Emulsion data sheet (8.4 m² per litre per coat at 50 µm)',
  url: 'https://static.asianpaints.com/content/dam/ap-qatar-revamp/products/interior/product-information-sheets/APCOLITE-PREMIUM-EMULSION-R.pdf',
}
const BIRLA_PUTTY = {
  label: 'Birla White WallCare Putty (1.86–2.04 m² per kg)',
  url: 'https://www.birlawhite.com/wallcare-putty',
}

export interface FinishingToolContent {
  path: string
  /** H1 and the menu title: the primary search phrase */
  title: string
  metaTitle: string
  description: string
  tagline: string
  context: { title: string; paragraphs: ReadonlyArray<string> }
  faqs: ReadonlyArray<FaqItem>
  sources: ReadonlyArray<ToolSource>
  note: string
}

export const TILES_CONTENT: FinishingToolContent = {
  path: '/tiles-calculator',
  title: 'Tiles calculator',
  metaTitle:
    'Tiles Calculator — How Many Tiles and Boxes for Floor or Wall · Plotr Ai',
  description:
    'Tiles calculator for India: enter the room in feet or metres, pick 600×600, 600×1200, 800×800 or wall tile sizes, and get the number of tiles and boxes with wastage.',
  tagline:
    'How many tiles and boxes you need for a floor or wall, with wastage for cuts and breakage.',
  context: {
    title: 'How the tiles calculator works',
    paragraphs: [
      'It multiplies the length and width to get the area, adds the wastage you choose, and divides by the area of one tile. The count is rounded up, because you cannot buy part of a tile.',
      'Keep 5–8% wastage for a simple rectangular room laid straight, and 10–15% for diagonal or herringbone patterns, many corners, or large-format tiles that break when cut.',
      'Tiles per box differs by brand and size, so the number of boxes appears only once you enter the count printed on the box.',
    ],
  },
  faqs: [
    {
      q: 'How many 2×2 tiles do I need for 100 sq ft?',
      a: 'A 600 × 600 mm (2 × 2 ft) tile covers about 3.9 sq ft, so 100 sq ft needs 26 tiles before wastage and about 29 tiles with 10% wastage.',
    },
    {
      q: 'How much extra tile should I buy?',
      a: 'Buy 5–8% extra for a straight lay in a regular room and 10–15% for diagonal patterns, many cuts or large-format tiles. Keep a few spare tiles from the same batch for future repairs.',
    },
    {
      q: 'How do I measure a room for floor tiles?',
      a: 'Measure the longest length and width of the floor and multiply them. For an L-shaped room, split it into rectangles, work out each area and add them together.',
    },
    {
      q: 'How many tiles are in a box?',
      a: 'It depends on the brand and size, so check the box or the dealer’s price list. Enter that number in the calculator to get the number of boxes.',
    },
  ],
  sources: [
    {
      label:
        'Tile area from the nominal tile size; boxes from the count printed on the box',
    },
  ],
  note: 'Tile counts use the nominal tile size and ignore grout joints, which makes the estimate slightly generous.',
}

export const PAINT_CONTENT: FinishingToolContent = {
  path: '/paint-calculator',
  title: 'Paint calculator',
  metaTitle:
    'Paint Calculator — Litres of Paint and Putty for a Room in Sq Ft · Plotr Ai',
  description:
    'Paint calculator for Indian homes: enter room size in feet or metres to get the paintable area, litres of emulsion for two coats, and kg of wall putty, with editable coverage.',
  tagline:
    'Litres of paint and kilos of wall putty for a room, from its size, the number of coats and the paint’s coverage.',
  context: {
    title: 'How the paint calculator works',
    paragraphs: [
      'The paintable area is the four walls (2 × (length + width) × height), plus the ceiling if you include it, minus doors and windows. Litres = area × coats ÷ coverage per litre per coat.',
      'The default coverage of 90 sq ft per litre per coat comes from the Asian Paints Apcolite Premium Emulsion data sheet (8.4 m² per litre at a typical 50 µm film). Rough, porous or freshly plastered walls take more paint, so enter the coverage printed on your tin if it differs.',
      'Wall putty uses Birla White’s stated coverage of 1.86–2.04 m² per kg. We use the lower end, about 20 sq ft per kg. Primer coverage varies by product, so check the tin.',
    ],
  },
  faqs: [
    {
      q: 'How much paint do I need for a 10×12 room?',
      a: 'A 12 × 10 ft room with a 10 ft ceiling has about 440 sq ft of wall. After 40 sq ft for a door and window, two coats at 90 sq ft per litre need about 9 litres for the walls, or about 11.6 litres with the ceiling.',
    },
    {
      q: 'How many coats of paint are needed?',
      a: 'Two coats of emulsion over primer is standard for interior walls. A third coat may be needed for a big colour change or a dark shade over a light one.',
    },
    {
      q: 'How much area does 1 litre of paint cover?',
      a: 'It depends on the product and surface. The Asian Paints Apcolite Premium Emulsion data sheet gives 8.4 m² (about 90 sq ft) per litre per coat at a typical film thickness. Practical coverage on rough walls is lower.',
    },
    {
      q: 'How much wall putty is needed per sq ft?',
      a: 'Birla White states 1.86–2.04 m² per kg for WallCare Putty, which is about 20–22 sq ft per kg. A 500 sq ft wall area needs roughly 25 kg.',
    },
  ],
  sources: [APCOLITE, BIRLA_PUTTY],
  note: 'Theoretical coverage from the manufacturers. Real coverage drops on rough or porous walls, so buy a little extra from the same batch.',
}

export const BRICK_CONTENT: FinishingToolContent = {
  path: '/brick-calculator',
  title: 'Brick calculator',
  metaTitle:
    'Brick Calculator India — Bricks, Cement and Sand for 9 or 4.5 Inch Wall · Plotr Ai',
  description:
    'Brick calculator for India: number of bricks, cement bags and sand for a 9 inch or 4.5 inch wall, in feet or metres, for common 230 mm or IS modular bricks with a 10 mm joint.',
  tagline:
    'Bricks, cement bags and sand for a 9 inch or 4.5 inch wall, with doors and windows deducted.',
  context: {
    title: 'How the brick calculator works',
    paragraphs: [
      'Wall volume = (length × height − openings) × thickness. A 9 inch wall is one brick length thick and a 4.5 inch wall is one brick width. Each brick takes up its own size plus a 10 mm mortar joint on three faces, which gives the brick count.',
      'Mortar is the wall volume left after the bricks. We multiply it by 1.33 for dry volume and split it by the mix: 1:6 is usual for 9 inch walls and 1:4 for 4.5 inch partition walls. One 50 kg bag of cement is 0.0347 m³.',
      'A common 230 × 110 × 75 mm brick works out to about 409 bricks per m³ of wall, and an IS modular 190 × 90 × 90 mm brick to 500.',
    ],
  },
  faqs: [
    {
      q: 'How many bricks are in 1 m³ of brickwork?',
      a: 'About 409 common 230 × 110 × 75 mm bricks, or 500 IS modular 190 × 90 × 90 mm bricks, with a 10 mm mortar joint and before wastage.',
    },
    {
      q: 'How many bricks for a 10 × 10 ft wall?',
      a: 'A 9 inch wall of common bricks, 10 × 10 ft, needs about 920 bricks with 5% wastage. A 4.5 inch wall needs about 440.',
    },
    {
      q: 'Which mortar ratio is used for brickwork?',
      a: 'Cement mortar 1:6 is common for 9 inch load-bearing and outer walls, and 1:4 for 4.5 inch partition walls, which are thinner and need the extra strength.',
    },
    {
      q: 'How much wastage should I add for bricks?',
      a: 'Add about 5% for breakage in transport and cutting. Use more if the bricks are poorly burnt or unloaded by tipping.',
    },
  ],
  sources: [IS_1077, IS_2212],
  note: 'Thumb-rule quantities for planning. Brick sizes vary by kiln, so measure a few bricks from your supplier.',
}

export const PLASTER_CONTENT: FinishingToolContent = {
  path: '/plaster-calculator',
  title: 'Plaster calculator',
  metaTitle:
    'Plaster Calculator — Cement and Sand for Wall Plaster in Sq Ft · Plotr Ai',
  description:
    'Plaster calculator for India: cement bags and sand in cu ft for wall or ceiling plaster at 6, 12, 15 or 20 mm, in 1:3 to 1:6 mix, from area in sq ft or m².',
  tagline:
    'Cement bags and sand for plastering a wall or ceiling, by area, thickness and mix.',
  context: {
    title: 'How the plaster calculator works',
    paragraphs: [
      'Wet volume = area × thickness, plus the wastage you choose. Dry volume is 1.33 times the wet volume, and it is split by the mix to get cement (in 50 kg bags of 0.0347 m³) and sand.',
      'Common thicknesses are 6 mm on ceilings, 12 mm on smooth inside walls, 15 mm on rough brick and 20 mm outside, usually in two coats. Inside walls commonly use 1:4 or 1:6 and outside walls 1:4.',
      'Uneven brickwork eats plaster, so keep 5–10% wastage, or more on very uneven walls.',
    ],
  },
  faqs: [
    {
      q: 'How much cement is needed for 100 sq ft of plaster?',
      a: 'At 12 mm thick in 1:4 with 5% wastage, 100 sq ft needs about 0.9 bags of cement and 4.4 cu ft of sand.',
    },
    {
      q: 'What is the ratio of cement and sand for plaster?',
      a: 'Inside walls commonly use 1:4 to 1:6 and outside walls 1:4. Ceilings use a richer 1:3 at a thinner 6 mm.',
    },
    {
      q: 'What thickness should wall plaster be?',
      a: 'About 12 mm for smooth inside walls, 15 mm for rough brick and 20 mm for outside walls, usually laid in two coats. Ceilings take about 6 mm.',
    },
    {
      q: 'Why multiply by 1.33 for dry volume?',
      a: 'Dry cement and sand shrink in volume once mixed with water, because the water fills the voids. 1.33 is the standard factor used on Indian sites to convert wet mortar volume to dry material.',
    },
  ],
  sources: [IS_1661],
  note: 'Thumb-rule quantities for planning. Thickness on uneven walls is often higher than specified.',
}

export const STEEL_CONTENT: FinishingToolContent = {
  path: '/steel-calculator',
  title: 'Steel calculator',
  metaTitle:
    'Steel Calculator — TMT Bar Weight (D²/162) and Steel for Slab in Kg · Plotr Ai',
  description:
    'Steel calculator for India: TMT bar weight with the D²/162 formula for 6–32 mm bars, and steel in kg for a slab, beam, column or footing from its size and steel percentage.',
  tagline:
    'Weight of TMT bars by diameter and length, or steel for a slab, beam, column or footing.',
  context: {
    title: 'How the steel calculator works',
    paragraphs: [
      'Bar weight per metre = D² ÷ 162, with D in mm. It comes from steel’s density of 7,850 kg/m³: a 12 mm bar weighs about 0.89 kg per metre, and a standard 12 m length about 10.7 kg.',
      'For an element, steel = concrete volume × steel percentage × 7,850 kg/m³. The starting percentages are typical values. IS 456 sets limits, such as 0.12% minimum for slabs and 0.8% to 6% for columns, but the actual figure must come from your structural drawing.',
      'Add 5–8% for laps, hooks and cutting wastage before ordering.',
    ],
  },
  faqs: [
    {
      q: 'What is the formula for steel weight?',
      a: 'Weight in kg per metre = D² ÷ 162, where D is the bar diameter in mm. Multiply by the length in metres and the number of bars.',
    },
    {
      q: 'What is the weight of a 12 mm TMT bar?',
      a: 'About 0.89 kg per metre, so a standard 12 m bar weighs about 10.7 kg.',
    },
    {
      q: 'How much steel is needed for a slab?',
      a: 'At 1% of the concrete volume, a 1 m³ slab needs about 78.5 kg of steel. A 1,000 sq ft slab, 125 mm thick, is about 11.6 m³ and needs roughly 900 kg at 1%. Your structural drawing gives the real figure.',
    },
    {
      q: 'What is the minimum steel in a column as per IS 456?',
      a: 'IS 456 requires at least 0.8% and at most 6% of the gross column section as longitudinal steel, with 4% the practical limit to leave room for concrete.',
    },
  ],
  sources: [IS_456, IS_1786],
  note: 'Planning estimate only. Reinforcement must follow your structural engineer’s drawing and bar bending schedule.',
}

/** Route head for a quantity calculator: title, meta, OpenGraph, canonical and JSON-LD. */
export function finishingHead(content: FinishingToolContent) {
  const url = `https://plotrai.in${content.path}`
  return {
    meta: [
      { title: content.metaTitle },
      { name: 'description', content: content.description },
      { property: 'og:title', content: content.metaTitle },
      { property: 'og:description', content: content.description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [canonicalLink(content.path)],
    scripts: [
      softwareAppLd({
        name: content.title,
        description: content.description,
        path: content.path,
      }),
      faqPageLd(content.faqs),
    ],
  }
}
