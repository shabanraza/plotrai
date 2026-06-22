#!/usr/bin/env node
/**
 * Generate OG/Twitter card images (1200×630 PNG) for every Plotr Ai route.
 *
 * Why a build-time Node script (and not a runtime endpoint)
 * --------------------------------------------------------
 * Cloudflare Workers can render SVG inline, but the cheapest, most reliable
 * way to ship og:image cards is a directory of static PNGs under public/og/.
 * They are served by the Workers static-asset binding with edge cache, no
 * cold-start hit, and Facebook (which prefers PNG over SVG) gets a real PNG.
 *
 * Brand rules (see CLAUDE.md)
 *   - Inter sans only, NO decorative serifs
 *   - Teal #0d9488 accents, Zinc neutrals
 *   - NO gradients, NO purple, NO drop-shadows
 *   - White background in the card (so it reads on every chat preview)
 *
 * Run with: `node scripts/generate-og-images.mjs`
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'public/og')

const WIDTH = 1200
const HEIGHT = 630

// Brand tokens — kept literal here so the generator has zero project-source coupling
const TEAL = '#0d9488'
const TEAL_BRIGHT = '#14b8a6'
const TEAL_BG = '#ecfdf5' // very light teal tint for accent strip
const NAVY = '#15265F' // logo navy ("Plotr")
const ZINC_900 = '#18181b'
const ZINC_700 = '#3f3f46'
const ZINC_500 = '#71717a'
const ZINC_200 = '#e4e4e7'
const LEAF_GREEN = '#7CB342'
const LEAF_GREEN_LIGHT = '#9CCC65'

/**
 * XML-escape a string so it can safely sit inside an SVG <text> node.
 */
function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Wrap a title across up to 2 lines, breaking on word boundaries.
 * `maxCharsPerLine` is a rough heuristic for ~64px Inter Bold at 1200px width.
 */
function wrapTitle(title, maxCharsPerLine = 28) {
  const words = title.split(/\s+/)
  const lines = []
  let current = ''
  for (const w of words) {
    if (!current) {
      current = w
    } else if ((current + ' ' + w).length <= maxCharsPerLine) {
      current += ' ' + w
    } else {
      lines.push(current)
      current = w
    }
    if (lines.length === 2) break
  }
  if (current && lines.length < 2) lines.push(current)
  // If we ran out of room, append ellipsis to the second line
  if (lines.length === 2 && words.join(' ').length > lines.join(' ').length) {
    lines[1] = lines[1].replace(/\s+\S+$/, '') + '…'
  }
  return lines
}

/**
 * Truncate the subtitle to ~90 chars on a single line.
 */
function truncateSubtitle(s, max = 84) {
  const oneLine = s.replace(/\s+/g, ' ').trim()
  if (oneLine.length <= max) return oneLine
  return oneLine.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

/**
 * Build the OG card SVG.
 *
 * Layout (1200×630):
 *   - 8px solid teal accent bar across the top
 *   - Top-left logo (icon mark + "Plotr" + "Ai" wordmark)
 *   - Top-right small mono kicker for the route slug ("/vastu-checker")
 *   - Centre-left big title (Inter Bold, up to 2 lines)
 *   - Below title: subtitle (Inter Regular, single line, zinc-700)
 *   - Bottom-left: "plotrai.in"
 *   - Bottom-right: "Free for Indian homeowners"
 *   - Thin zinc-200 hairline above the footer
 */
function buildSvg({ title, subtitle, slug, kicker = 'PLOTR AI' }) {
  const titleLines = wrapTitle(title)
  const subtitleClean = truncateSubtitle(subtitle)
  const titleY = titleLines.length === 1 ? 360 : 320
  const lineHeight = 80

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      .sans { font-family: 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; }
      .mono { font-family: 'JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', monospace; }
    </style>
  </defs>

  <!-- Pure white background (matches landing in light mode) -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>

  <!-- Teal accent bar at the top, no gradient -->
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="${TEAL}"/>

  <!-- Top-left logo: icon mark scaled to 56px high -->
  <g transform="translate(80, 70) scale(0.875)">
    <!-- Icon mark (matches src/components/logo.tsx) -->
    <g stroke="${NAVY}" fill="none" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <circle cx="13" cy="14" r="2" fill="${NAVY}"/>
      <line x1="13" y1="14" x2="9" y2="48"/>
      <line x1="13" y1="14" x2="17" y2="44"/>
      <path d="M 18 38 L 36 18 L 54 38 L 54 52 L 18 52 Z"/>
      <rect x="29" y="30" width="6" height="6" stroke-width="1.6"/>
      <rect x="40" y="42" width="5" height="10" stroke-width="1.6"/>
      <line x1="6" y1="55" x2="58" y2="55" stroke-width="2"/>
    </g>
    <path d="M 54 44 Q 60 38 66 42 Q 62 50 54 44 Z" fill="${LEAF_GREEN}"/>
    <path d="M 56 50 Q 62 44 68 48 Q 64 55 56 50 Z" fill="${LEAF_GREEN_LIGHT}"/>
  </g>
  <!-- Wordmark: Plotr (navy) + Ai (teal), Inter Black -->
  <line x1="160" y1="86" x2="160" y2="120" stroke="${ZINC_200}" stroke-width="1.5"/>
  <text x="178" y="118" class="sans" font-weight="800" font-size="40" letter-spacing="-1.2" fill="${NAVY}">Plotr</text>
  <text x="288" y="118" class="sans" font-weight="800" font-size="40" letter-spacing="-1.2" fill="${TEAL}">Ai</text>

  <!-- Top-right route kicker -->
  <text x="${WIDTH - 80}" y="113" class="mono" text-anchor="end" font-size="18" letter-spacing="2" fill="${ZINC_500}">${xmlEscape(kicker)}</text>

  <!-- Title block, left-aligned -->
  ${titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${titleY + i * lineHeight}" class="sans" font-weight="800" font-size="68" letter-spacing="-2" fill="${ZINC_900}">${xmlEscape(line)}</text>`,
    )
    .join('\n  ')}

  <!-- Subtitle -->
  <text x="80" y="${titleY + titleLines.length * lineHeight + 24}" class="sans" font-weight="400" font-size="24" fill="${ZINC_700}">${xmlEscape(subtitleClean)}</text>

  <!-- Footer hairline -->
  <line x1="80" y1="540" x2="${WIDTH - 80}" y2="540" stroke="${ZINC_200}" stroke-width="1"/>

  <!-- Footer left: domain -->
  <text x="80" y="582" class="sans" font-weight="600" font-size="22" fill="${ZINC_900}">plotrai.in</text>
  <text x="80" y="608" class="mono" font-size="14" letter-spacing="1.5" fill="${ZINC_500}">${xmlEscape(slug)}</text>

  <!-- Footer right: tagline pill -->
  <rect x="${WIDTH - 380}" y="563" width="300" height="40" rx="20" fill="${TEAL_BG}" stroke="${TEAL_BRIGHT}" stroke-width="1"/>
  <text x="${WIDTH - 230}" y="589" class="sans" font-weight="600" font-size="16" text-anchor="middle" fill="${TEAL}">Free for Indian homeowners</text>
</svg>`
}

/**
 * Render an SVG buffer to a 1200×630 PNG with sharp.
 */
async function renderPng(svg) {
  return await sharp(Buffer.from(svg, 'utf-8'), { density: 144 })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/**
 * Master list of cards to render.
 * Pulled by hand from each route's existing head() so the OG card matches the page metadata.
 */
const CARDS = [
  // Landing
  {
    slug: 'landing',
    routePath: '/',
    kicker: 'PLOTRAI.IN',
    title: 'Free single-purpose tools for Indian homeowners',
    subtitle: 'Vastu, stamp duty, construction material, capital gains, floor plans — built for India.',
  },
  // Vastu
  {
    slug: 'vastu-checker',
    routePath: '/vastu-checker',
    kicker: 'VASTU CHECKER',
    title: 'Vastu Checker for Home',
    subtitle: 'Score any floor plan against 14 classical Vastu Shastra rules. Free, no signup.',
  },
  // Material Calculator
  {
    slug: 'material-calculator',
    routePath: '/material-calculator',
    kicker: 'MATERIAL CALCULATOR',
    title: 'Construction Material Calculator India',
    subtitle: 'Calculate cement, sand, bricks, and steel for any build. Fresh Indian rates 2026.',
  },
  // Stamp Duty Calculator
  {
    slug: 'stamp-duty-calculator',
    routePath: '/stamp-duty-calculator',
    kicker: 'STAMP DUTY · INDIA',
    title: 'Stamp Duty Calculator India 2026',
    subtitle: 'All major Indian states and cities. Female-buyer discount included. Fresh 2026 rates.',
  },
  // Construction Cost Calculator
  {
    slug: 'construction-cost-calculator',
    routePath: '/construction-cost-calculator',
    kicker: 'CONSTRUCTION COST',
    title: 'Construction Cost Calculator India 2026',
    subtitle: 'Per-sq-ft cost by city, finish tier, and floors. Stage-wise breakdown across 7 stages.',
  },
  // Property Capital Gains Calculator
  {
    slug: 'property-capital-gains-calculator',
    routePath: '/property-capital-gains-calculator',
    kicker: 'CAPITAL GAINS · LTCG',
    title: 'Property Capital Gains Calculator India 2026',
    subtitle: 'Both post-Jul-2024 regimes (12.5% no indexation vs 20% with) — picks the lower tax.',
  },
  // Plot Converter
  {
    slug: 'plot-converter',
    routePath: '/plot-converter',
    kicker: 'PLOT AREA · CONVERTER',
    title: 'Plot Area Converter India',
    subtitle: 'Convert between Indian land units — gaj, bigha, cent, acre — with region-wise standards.',
  },
  // Floor Plan 3D
  {
    slug: 'floor-plan-3d',
    routePath: '/floor-plan-3d',
    kicker: 'AI · 2D → 3D',
    title: '2D Floor Plan → 3D Render',
    subtitle: 'Free AI tool to convert 2D plans into furnished 3D isometric renders.',
  },
  // Interior Restyle
  {
    slug: 'interior-restyle',
    routePath: '/interior-restyle',
    kicker: 'AI · INTERIOR RESTYLE',
    title: 'Interior Restyle AI',
    subtitle: 'Re-render any room in a new style — same layout, brand-new vibe.',
  },
  // Empty Room Stager
  {
    slug: 'empty-room-stager',
    routePath: '/empty-room-stager',
    kicker: 'AI · VIRTUAL STAGING',
    title: 'Empty Room Stager AI',
    subtitle: 'Virtually furnish empty rooms — perfect for real-estate listings and pre-purchase visualisation.',
  },
  // About
  {
    slug: 'about',
    routePath: '/about',
    kicker: 'ABOUT',
    title: 'Indian home design, decoded.',
    subtitle: 'Plotr Ai is a free toolkit for Indian homeowners — Vastu, stamp duty, materials, plans.',
  },
]

/**
 * Programmatic state cards — `/stamp-duty/<state>`.
 * Pulled from src/data/state-stamp-duty-content.ts.
 */
const STATE_CARDS = [
  { slug: 'maharashtra', name: 'Maharashtra' },
  { slug: 'karnataka', name: 'Karnataka' },
  { slug: 'delhi', name: 'Delhi NCT' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu' },
  { slug: 'telangana', name: 'Telangana' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh' },
  { slug: 'west-bengal', name: 'West Bengal' },
  { slug: 'gujarat', name: 'Gujarat' },
  { slug: 'rajasthan', name: 'Rajasthan' },
  { slug: 'punjab', name: 'Punjab' },
  { slug: 'haryana', name: 'Haryana' },
  { slug: 'madhya-pradesh', name: 'Madhya Pradesh' },
  { slug: 'kerala', name: 'Kerala' },
  { slug: 'odisha', name: 'Odisha' },
  { slug: 'andhra-pradesh', name: 'Andhra Pradesh' },
  { slug: 'bihar', name: 'Bihar' },
  { slug: 'chandigarh', name: 'Chandigarh' },
].map(({ slug, name }) => ({
  slug: `stamp-duty-${slug}`,
  routePath: `/stamp-duty/${slug}`,
  kicker: `STAMP DUTY · ${name.toUpperCase()}`,
  title: `${name} Stamp Duty Calculator 2026`,
  subtitle: `Stamp duty + registration rates for ${name}, with male, female, and joint buyer breakdowns.`,
}))

/**
 * Programmatic city cards — `/construction-cost/<city>`.
 * Pulled from src/data/city-construction-content.ts.
 */
const CITY_CARDS = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'North Bangalore',
  'Pune',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad',
  'Gurgaon',
  'Noida',
  'Greater Noida',
  'Ghaziabad',
  'Jaipur',
  'Kanpur',
  'Lucknow',
  'Indore',
  'Coimbatore',
  'Kochi',
  'Chandigarh',
  'Bhopal',
  'Patna',
].map((city) => {
  const slug = city.toLowerCase().replaceAll(' ', '-')
  return {
    slug: `construction-cost-${slug}`,
    routePath: `/construction-cost/${slug}`,
    kicker: `CONSTRUCTION · ${city.toUpperCase()}`,
    title: `${city} Construction Cost 2026`,
    subtitle: `House construction cost per sq ft in ${city} across basic, standard, premium, luxury tiers.`,
  }
})

const ALL_CARDS = [...CARDS, ...STATE_CARDS, ...CITY_CARDS]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  let count = 0
  for (const card of ALL_CARDS) {
    const svg = buildSvg({
      title: card.title,
      subtitle: card.subtitle,
      slug: card.routePath,
      kicker: card.kicker,
    })
    const png = await renderPng(svg)
    const svgPath = resolve(OUT_DIR, `${card.slug}.svg`)
    const pngPath = resolve(OUT_DIR, `${card.slug}.png`)
    await writeFile(svgPath, svg, 'utf-8')
    await writeFile(pngPath, png)
    count += 1
    process.stdout.write(`  ✓ ${card.slug}.png\n`)
  }
  console.log(`\nGenerated ${count} OG cards (SVG + PNG) in ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
