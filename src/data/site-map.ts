import type { LucideIcon } from 'lucide-react'
import {
  Box,
  BrickWall,
  Building2,
  Calculator,
  Compass,
  Grid3x3,
  Hammer,
  KeyRound,
  Layers3,
  MapPinned,
  PaintRoller,
  Receipt,
  ReceiptIndianRupee,
  Ruler,
  Shovel,
  Sofa,
  TrendingUp,
  Wand2,
  Weight,
} from 'lucide-react'
import { BLOG_ARTICLES, type BlogCluster } from '#/data/blog-content'
import { CITY_CONTENT } from '#/data/city-construction-content'
import { LAND_UNIT_PAGES, pageTitle } from '#/data/land-unit-pages'
import { STATE_CONTENT } from '#/data/state-stamp-duty-content'

/**
 * Single source of truth for site navigation: the header menus, mobile menu and search all read
 * from here. Every page belongs to exactly one hub (grouped by what the visitor is doing).
 * Programmatic pages (states, cities, unit pairs, guides) are derived from their data files, so
 * new entries appear in navigation automatically.
 */

export type HubId = 'buy' | 'build' | 'land' | 'tax' | 'design'

export interface SiteHub {
  id: HubId
  /** Short label for the header */
  label: string
  /** Longer label for cards and the mobile menu */
  title: string
  description: string
  icon: LucideIcon
}

export type EntryKind = 'tool' | 'state' | 'city' | 'unit' | 'guide'

export interface SiteEntry {
  title: string
  to: string
  description: string
  hub: HubId
  kind: EntryKind
  icon?: LucideIcon
  /** Extra search terms not in the title */
  keywords?: ReadonlyArray<string>
}

export const SITE_HUBS: ReadonlyArray<SiteHub> = [
  {
    id: 'buy',
    label: 'Buy',
    title: 'Buying a home',
    description: 'Stamp duty, total buying cost and EMI.',
    icon: KeyRound,
  },
  {
    id: 'build',
    label: 'Build',
    title: 'Building a house',
    description: 'Construction cost, cement, steel and concrete.',
    icon: Hammer,
  },
  {
    id: 'land',
    label: 'Land',
    title: 'Land and plots',
    description: 'Gaj, bigha, acre and other land units.',
    icon: Ruler,
  },
  {
    id: 'tax',
    label: 'Tax',
    title: 'Paying tax',
    description: 'Property tax and capital gains.',
    icon: ReceiptIndianRupee,
  },
  {
    id: 'design',
    label: 'Design',
    title: 'Designing',
    description: 'Vastu, 3D floor plans and interiors.',
    icon: Sofa,
  },
]

export const SITE_TOOLS: ReadonlyArray<SiteEntry> = [
  // Buy
  { title: 'Stamp duty calculator', to: '/stamp-duty-calculator', description: 'Stamp duty and registration by state.', hub: 'buy', kind: 'tool', icon: Receipt, keywords: ['registration charges', 'registry'] },
  { title: 'Home buying cost calculator', to: '/home-buying-cost-calculator', description: 'Stamp duty, GST, down payment and EMI together.', hub: 'buy', kind: 'tool', icon: KeyRound, keywords: ['emi', 'home loan', 'down payment', 'gst'] },
  { title: 'Delhi circle rate', to: '/delhi-circle-rate', description: 'Category A–H rates and minimum property value.', hub: 'buy', kind: 'tool', icon: MapPinned, keywords: ['delhi', 'circle rate', 'minimum value'] },
  // Build
  { title: 'Construction cost calculator', to: '/construction-cost-calculator', description: 'Per sq ft cost by city and finish, stage-wise.', hub: 'build', kind: 'tool', icon: Hammer, keywords: ['house construction cost', 'building cost'] },
  { title: 'Material calculator', to: '/material-calculator', description: 'Cement, bricks, steel and sand for any element.', hub: 'build', kind: 'tool', icon: Calculator, keywords: ['cement bags', 'bricks', 'steel', 'sand'] },
  { title: 'Concrete calculator', to: '/concrete-calculator', description: 'Cement, sand and aggregate for PCC and concrete.', hub: 'build', kind: 'tool', icon: Layers3 },
  { title: 'RCC slab calculator', to: '/rcc-slab-calculator', description: 'Slab cement, steel, sand and aggregate.', hub: 'build', kind: 'tool', icon: Hammer, keywords: ['roof slab'] },
  { title: 'Cement sand aggregate calculator', to: '/cement-sand-aggregate-calculator', description: 'Concrete material quantity by mix.', hub: 'build', kind: 'tool', icon: Calculator, keywords: ['m20', 'm15', 'cum'] },
  { title: 'Brick calculator', to: '/brick-calculator', description: 'Bricks, cement and sand for a 9 or 4.5 inch wall.', hub: 'build', kind: 'tool', icon: BrickWall, keywords: ['bricks', '9 inch wall', 'brickwork'] },
  { title: 'Steel calculator', to: '/steel-calculator', description: 'TMT bar weight and steel for slabs, beams and columns.', hub: 'build', kind: 'tool', icon: Weight, keywords: ['tmt', 'rebar', 'bar weight', 'd2/162'] },
  { title: 'Plaster calculator', to: '/plaster-calculator', description: 'Cement and sand for wall and ceiling plaster.', hub: 'build', kind: 'tool', icon: Shovel, keywords: ['plastering', 'mortar'] },
  { title: 'Tiles calculator', to: '/tiles-calculator', description: 'How many tiles and boxes for a floor or wall.', hub: 'build', kind: 'tool', icon: Grid3x3, keywords: ['flooring', 'tile boxes', 'vitrified'] },
  { title: 'Paint calculator', to: '/paint-calculator', description: 'Litres of paint and kg of putty for a room.', hub: 'build', kind: 'tool', icon: PaintRoller, keywords: ['wall paint', 'putty', 'emulsion'] },
  // Land
  { title: 'Plot area converter', to: '/plot-converter', description: 'Every Indian land unit, region-aware.', hub: 'land', kind: 'tool', icon: Ruler, keywords: ['gaj', 'bigha', 'acre', 'marla', 'gunta', 'cent'] },
  // Tax
  { title: 'Capital gains calculator', to: '/property-capital-gains-calculator', description: 'Property LTCG under both regimes.', hub: 'tax', kind: 'tool', icon: TrendingUp, keywords: ['ltcg', 'sell property tax'] },
  { title: 'Indexation calculator', to: '/indexation-calculator', description: 'CII indexed cost and gain.', hub: 'tax', kind: 'tool', icon: TrendingUp, keywords: ['cii', 'cost inflation index'] },
  { title: 'BBMP property tax calculator', to: '/bbmp-property-tax-calculator', description: 'Bangalore property tax estimate.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['bangalore', 'bengaluru'] },
  { title: 'BBMP property tax 2026-27', to: '/bbmp-property-tax-2026-27', description: 'Due dates, e-khata and receipts.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['bangalore'] },
  { title: 'GHMC property tax calculator', to: '/ghmc-property-tax-calculator', description: 'Hyderabad property tax estimate.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['hyderabad'] },
  { title: 'GHMC house number search', to: '/ghmc-property-tax-search-by-house-number', description: 'Find Hyderabad tax by house number.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['hyderabad', 'ptin'] },
  { title: 'MCD property tax calculator', to: '/mcd-property-tax-calculator', description: 'Delhi property tax estimate.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['delhi', 'house tax'] },
  { title: 'MCD CA number guide', to: '/mcd-property-tax-ca-number', description: 'Delhi CA number, UPIC and receipts.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['delhi', 'upic'] },
  { title: 'Jaipur property tax calculator', to: '/jaipur-property-tax-calculator', description: 'UD tax from plot area and DLC rate.', hub: 'tax', kind: 'tool', icon: Building2, keywords: ['jaipur', 'ud tax', 'rajasthan', 'dlc'] },
  // Design
  { title: 'Vastu checker', to: '/vastu-checker', description: 'Score a floor plan against 14 Vastu rules.', hub: 'design', kind: 'tool', icon: Compass },
  { title: 'Floor plan to 3D', to: '/floor-plan-3d', description: 'Turn a 2D plan into a furnished 3D render.', hub: 'design', kind: 'tool', icon: Box },
  { title: 'Interior restyle', to: '/interior-restyle', description: 'Re-render a room photo in a new style.', hub: 'design', kind: 'tool', icon: Wand2 },
  { title: 'Empty room stager', to: '/empty-room-stager', description: 'Furnish an empty room photo with AI.', hub: 'design', kind: 'tool', icon: Sofa },
]

export const CLUSTER_HUB: Record<BlogCluster, HubId> = {
  'property-buyer': 'buy',
  'materials-cost': 'build',
  'house-design': 'design',
}

export const SITE_PROGRAMMATIC: ReadonlyArray<SiteEntry> = [
  ...STATE_CONTENT.map<SiteEntry>((s) => ({
    title: `${s.displayName} stamp duty`,
    to: `/stamp-duty/${s.slug}`,
    description: `Stamp duty and registration rates in ${s.displayName}.`,
    hub: 'buy',
    kind: 'state',
    keywords: [s.state, 'registry'],
  })),
  ...CITY_CONTENT.map<SiteEntry>((c) => ({
    title: `${c.city} construction cost`,
    to: `/construction-cost/${c.slug}`,
    description: `House construction cost per sq ft in ${c.city}.`,
    hub: 'build',
    kind: 'city',
    keywords: [c.state, 'per sq ft'],
  })),
  ...LAND_UNIT_PAGES.map<SiteEntry>((p) => ({
    title: pageTitle(p),
    to: `/convert/${p.slug}`,
    description: `Convert ${p.fromShort} to ${p.toShort}.`,
    hub: 'land',
    kind: 'unit',
    keywords: [`${p.fromShort} in ${p.toShort}`],
  })),
]

export const SITE_GUIDES: ReadonlyArray<SiteEntry> = BLOG_ARTICLES.map<SiteEntry>((a) => ({
  title: a.title,
  to: a.path,
  description: a.description,
  hub: CLUSTER_HUB[a.cluster],
  kind: 'guide',
}))

export const SITE_ENTRIES: ReadonlyArray<SiteEntry> = [
  ...SITE_TOOLS,
  ...SITE_PROGRAMMATIC,
  ...SITE_GUIDES,
]

export function entriesForHub(hub: HubId, kind?: EntryKind) {
  return SITE_ENTRIES.filter((e) => e.hub === hub && (!kind || e.kind === kind))
}

const FOOTER_LINKS_PER_HUB = 6

/**
 * Footer links for a hub: calculators first, then the hub's other tools, then its most popular
 * state/city/unit pages to fill the column. Capped so the footer stays short.
 */
export function footerLinksForHub(hub: HubId): Array<{ label: string; to: string }> {
  const tools = entriesForHub(hub, 'tool')
  const ranked = [
    ...tools.filter((t) => /calculator/i.test(t.title)),
    ...tools.filter((t) => !/calculator/i.test(t.title)),
    ...entriesForHub(hub).filter((e) => e.kind !== 'tool' && e.kind !== 'guide'),
  ]
  return ranked.slice(0, FOOTER_LINKS_PER_HUB).map((e) => ({ label: e.title, to: e.to }))
}

export const SITE_HUB_BY_ID = new Map(SITE_HUBS.map((hub) => [hub.id, hub]))

export function hubPath(hub: HubId) {
  return `/${hub}`
}

const ENTRY_BY_PATH = new Map(SITE_ENTRIES.map((e) => [e.to, e]))

/** Programmatic pages sit under the tool they extend: Home › Buying a home › Stamp Duty Calculator › Punjab. */
const PARENT_TOOL: Partial<Record<EntryKind, string>> = {
  state: '/stamp-duty-calculator',
  city: '/construction-cost-calculator',
  unit: '/plot-converter',
}

export interface Crumb {
  label: string
  href?: string
}

/**
 * Breadcrumb trail for any page in the site map, or null for pages outside it (legal pages,
 * the home page). `currentLabel` overrides the last crumb, e.g. "Punjab" for a state page.
 */
export function breadcrumbForPath(path: string, currentLabel?: string): Crumb[] | null {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path
  const entry = ENTRY_BY_PATH.get(normalized)
  if (!entry) return null
  const hub = SITE_HUB_BY_ID.get(entry.hub)
  if (!hub) return null

  const trail: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: hub.title, href: hubPath(hub.id) },
  ]
  const parent = PARENT_TOOL[entry.kind]
  const parentEntry = parent ? ENTRY_BY_PATH.get(parent) : undefined
  if (parentEntry) trail.push({ label: parentEntry.title, href: parentEntry.to })
  trail.push({ label: entry.kind === 'tool' ? entry.title : (currentLabel ?? entry.title) })
  return trail
}

/** Label for a hub's programmatic link group in menus, e.g. "Stamp duty by state". */
export const HUB_PROGRAMMATIC_LABEL: Partial<Record<HubId, { kind: EntryKind; label: string }>> = {
  buy: { kind: 'state', label: 'Stamp duty by state' },
  build: { kind: 'city', label: 'Construction cost by city' },
  land: { kind: 'unit', label: 'Popular conversions' },
}

/**
 * Search palette matcher (cmdk `filter` signature). Every word of the query must appear in the
 * title or keywords. Bare numbers ("100 gaj", "30x40") are dropped, since people type the value
 * they want to convert along with the unit.
 */
export function searchFilter(value: string, search: string, keywords?: string[]) {
  const haystack = `${value} ${keywords?.join(' ') ?? ''}`.toLowerCase()
  const words = search.toLowerCase().split(/\s+/).filter(Boolean)
  const terms = words.filter((w) => !/^[\d.,x]+$/.test(w))
  if (terms.length === 0) return words.some((w) => haystack.includes(w)) ? 1 : 0
  if (!terms.every((t) => haystack.includes(t))) return 0
  // Rank title-start matches first
  return haystack.startsWith(terms[0]) ? 1 : 0.5
}
