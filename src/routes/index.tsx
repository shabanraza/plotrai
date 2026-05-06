import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Box,
  Building2,
  Calculator,
  Compass,
  Hammer,
  Heart,
  Palette,
  Receipt,
  Ruler,
  Sofa,
  TrendingUp,
  Wand2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ToolCard } from '#/components/landing/tool-card'
import { ComingSoonCard } from '#/components/landing/coming-soon-card'

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        property: 'og:title',
        content: 'Plotr Ai — Free single-purpose tools for Indian homeowners',
      },
      {
        property: 'og:description',
        content:
          'Vastu, stamp duty, construction material, capital gains, floor plans — built for India.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/landing.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/landing.png' },
    ],
  }),
})

interface Pill {
  to?: string
  icon: LucideIcon
  /** Two-line uppercase label. Use \n for the line break. */
  label: string
  bgClass: string
  iconClass: string
}

/** Soft pastels via existing element-* CSS tokens — no purple, no gradients. */
const PILLS: ReadonlyArray<Pill> = [
  {
    to: '/construction-cost-calculator',
    icon: Hammer,
    label: 'Construction\nGuide',
    bgClass: 'bg-[var(--element-water-bg-occupied)]',
    iconClass: 'text-[var(--element-water-border)]',
  },
  {
    to: '/vastu-checker',
    icon: Compass,
    label: 'Vastu\nGuide',
    bgClass: 'bg-[var(--element-air-bg-occupied)]',
    iconClass: 'text-[var(--element-air-border)]',
  },
  {
    to: '/material-calculator',
    icon: Calculator,
    label: 'Material\nCalculator',
    bgClass: 'bg-[var(--element-fire-bg-occupied)]',
    iconClass: 'text-[var(--element-fire-border)]',
  },
  {
    icon: Heart,
    label: '100% Free\nfor India',
    bgClass: 'bg-[var(--accent-teal-light)]',
    iconClass: 'text-[var(--accent-teal)]',
  },
]

function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <Hero />
      <ToolPillsSection />
      <ToolsSection />
      <ComingSoonSection />
      <Footnote />
    </main>
  )
}

function Hero() {
  return (
    <section className="flex flex-col items-center gap-11 pt-16 pb-16 text-center sm:pt-24 sm:pb-20">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)]/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        <span className="size-1.5 rounded-full bg-[var(--accent-teal)]" aria-hidden />
        Indian home design toolkit
      </span>

      <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-5xl">
        Free single-purpose tools{' '}
        <span className="text-[var(--accent-teal)]">for Indian homeowners.</span>
      </h1>

      <p className="max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
        Vastu compliance, 2D-to-3D renders, interior restyling, plot-area conversion. No signup,
        no credit card — open a tool and start.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link to="/vastu-checker">
            Try Vastu Checker
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <a href="#tools">Browse all tools</a>
        </Button>
      </div>
    </section>
  )
}

function ToolPillsSection() {
  return (
    <section className="border-t border-[var(--border)] py-14 sm:py-20">
      {/* centred tagline */}
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <span className="h-px flex-1 bg-[var(--accent-teal)]/40" aria-hidden />
        <h2 className="text-balance text-center text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl md:text-2xl">
          Design better. Build smarter.{' '}
          <span className="text-[var(--accent-teal)]">Live auspicious.</span>
        </h2>
        <span className="h-px flex-1 bg-[var(--accent-teal)]/40" aria-hidden />
      </div>

      {/* big pastel pills with 2-line uppercase labels */}
      <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-y-8 sm:mt-12 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-[var(--border)]">
        {PILLS.map((p) => (
          <PillItem key={p.label} pill={p} />
        ))}
      </ul>
    </section>
  )
}

function ToolsSection() {
  return (
    <section id="tools" className="scroll-mt-16 border-t border-[var(--border)] py-16 sm:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[28px]">
          Explore all tools
        </h2>
      </div>

      {/* tool grid */}
      <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          to="/vastu-checker"
          status="flagship"
          title="Vastu Checker"
          description="Score your floor plan against 14 classical Vastu rules. Manual or upload."
          icon={Compass}
          ctaLabel="Try Vastu Checker"
          featured
        />
        <ToolCard
          to="/floor-plan-3d"
          status="live"
          title="Floor Plan → 3D"
          description="Drop a 2D plan, get a furnished isometric 3D render in seconds."
          icon={Box}
        />
        <ToolCard
          to="/interior-restyle"
          status="live"
          title="Interior Restyle"
          description="Re-render any room photo in Modern, Indian, Scandi, Minimal, or Luxury."
          icon={Wand2}
        />
        <ToolCard
          to="/empty-room-stager"
          status="live"
          title="Empty Room Stager"
          description="Upload an empty room photo. AI furnishes it photorealistically."
          icon={Sofa}
        />
        <ToolCard
          to="/plot-converter"
          status="utility"
          title="Plot Area Converter"
          description="Gunta, bigha, marla, kanal, ankanam, gaj — region-aware conversions."
          icon={Ruler}
        />
        <ToolCard
          to="/material-calculator"
          status="utility"
          title="Material Calculator"
          description="Cement bags, sand cuft, bricks, steel kg for any construction element."
          icon={Calculator}
        />
        <ToolCard
          to="/stamp-duty-calculator"
          status="utility"
          title="Stamp Duty Calculator"
          description="State + city stamp duty and registration. Female-buyer rates included."
          icon={Receipt}
        />
        <ToolCard
          to="/construction-cost-calculator"
          status="utility"
          title="Construction Cost Calculator"
          description="Per sq ft cost by city, finish tier, and floors. Stage-wise breakdown."
          icon={Hammer}
        />
        <ToolCard
          to="/property-capital-gains-calculator"
          status="utility"
          title="Capital Gains Calculator"
          description="Post-Jul-2024 dual regime — picks the lower tax for you."
          icon={TrendingUp}
        />
      </div>
    </section>
  )
}

function PillItem({ pill }: { pill: Pill }) {
  const Icon = pill.icon
  const inner = (
    <div className="flex flex-col items-center justify-center gap-2 px-2 text-center sm:flex-row sm:gap-3 sm:px-6 sm:text-left">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14 ${pill.bgClass}`}
      >
        <Icon className={`size-5 sm:size-6 ${pill.iconClass}`} />
      </span>
      <span className="whitespace-pre-line text-[11px] font-bold uppercase leading-tight tracking-[0.06em] text-[var(--foreground)] sm:text-sm">
        {pill.label}
      </span>
    </div>
  )

  if (pill.to) {
    return (
      <li>
        <Link to={pill.to} className="block no-underline transition-opacity hover:opacity-80">
          {inner}
        </Link>
      </li>
    )
  }
  return <li>{inner}</li>
}

function ComingSoonSection() {
  return (
    <section className="border-t border-[var(--border)] py-16 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-teal)]">
          Roadmap
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[28px]">
          Shipping next
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Drop your email on a tool below. We ping you only when that one ships.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ComingSoonCard
          icon={Building2}
          title="Property Tax Calculator"
          description="Unified BBMP / MCD / PCMC / GHMC / KMC property tax in one form."
          toolKey="property-tax"
        />
        <ComingSoonCard
          icon={Palette}
          title="Color Palette Generator"
          description="Room photo or mood → matched paint codes from Asian Paints, Berger, Dulux."
          toolKey="color-palette"
        />
        <ComingSoonCard
          icon={Sparkles}
          title="3D Plan Walkthrough"
          description="Real-time isometric walkthroughs of your floor plan. Drop your email for early access."
          toolKey="walkthrough"
        />
      </div>
    </section>
  )
}

function Footnote() {
  return (
    <section className="border-t border-[var(--border)] py-10">
      <p className="text-center text-xs leading-relaxed text-[var(--muted-foreground)]">
        Made for Indian homeowners. All tools run on standard web — no installs. Vastu Checker
        analysis is local; AI renders use OpenAI's image API. Rates and conversions are kept
        current to local Indian standards; for legal documents, cross-check with your local
        sub-registrar.
      </p>
    </section>
  )
}
