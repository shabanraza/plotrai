import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Box,
  Building2,
  Calculator,
  Compass,
  Hammer,
  Heart,
  MessageSquare,
  Palette,
  Receipt,
  Ruler,
  Sofa,
  TrendingUp,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ToolCard } from '#/components/landing/tool-card'
import { ComingSoonCard } from '#/components/landing/coming-soon-card'

export const Route = createFileRoute('/')({ component: LandingPage })

interface CategoryChip {
  to?: string
  icon: LucideIcon
  label: string
  bgClass: string
  iconClass: string
}

/** Soft pastels via existing element-* CSS tokens — no purple, no gradients. */
const CATEGORIES: ReadonlyArray<CategoryChip> = [
  {
    to: '/construction-cost-calculator',
    icon: Hammer,
    label: 'Construction',
    bgClass: 'bg-[var(--element-water-bg-occupied)]',
    iconClass: 'text-[var(--element-water-border)]',
  },
  {
    to: '/vastu-checker',
    icon: Compass,
    label: 'Vastu',
    bgClass: 'bg-[var(--element-air-bg-occupied)]',
    iconClass: 'text-[var(--element-air-border)]',
  },
  {
    to: '/material-calculator',
    icon: Calculator,
    label: 'Materials',
    bgClass: 'bg-[var(--element-fire-bg-occupied)]',
    iconClass: 'text-[var(--element-fire-border)]',
  },
  {
    icon: Heart,
    label: 'Free for India',
    bgClass: 'bg-[var(--accent-teal-light)]',
    iconClass: 'text-[var(--accent-teal)]',
  },
]

function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <Hero />
      <ToolsSection />
      <ComingSoonSection />
      <Footnote />
    </main>
  )
}

function Hero() {
  return (
    <section className="flex flex-col items-start gap-6 pt-16 pb-16 sm:pt-24 sm:pb-20">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)]/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        <span className="size-1.5 rounded-full bg-[var(--accent-teal)]" aria-hidden />
        Indian home design toolkit
      </span>

      <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl md:text-5xl">
        Free single-purpose tools for Indian homeowners.
      </h1>

      <p className="max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
        Vastu compliance, 2D-to-3D renders, interior restyling, plot-area conversion. No signup,
        no credit card — open a tool and start.
      </p>

      <div className="flex flex-wrap items-center gap-3">
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

function ToolsSection() {
  return (
    <section id="tools" className="scroll-mt-16 pb-20 sm:pb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-teal)]">
        Tools — 9 live · no signup · 14 Vastu rules
      </p>

      <h2 className="mt-3 max-w-3xl text-balance text-2xl font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--foreground)] sm:text-3xl md:text-[40px]">
        Design better. Build smarter.{' '}
        <span className="text-[var(--accent-teal)]">Live auspicious.</span>
      </h2>

      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
        Each tool is a single page. Pick a category, or scroll for the full lineup.
      </p>

      <ul className="mt-7 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <CategoryPill key={c.label} chip={c} />
        ))}
      </ul>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

function CategoryPill({ chip }: { chip: CategoryChip }) {
  const Icon = chip.icon
  const inner = (
    <>
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full ${chip.bgClass}`}
      >
        <Icon className={`size-3 ${chip.iconClass}`} />
      </span>
      {chip.label}
    </>
  )

  if (chip.to) {
    return (
      <li>
        <Link
          to={chip.to}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] no-underline transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/60"
        >
          {inner}
        </Link>
      </li>
    )
  }
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)]">
      {inner}
    </li>
  )
}

function ComingSoonSection() {
  return (
    <section className="border-t border-[var(--border)] py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-teal)]">
        Roadmap
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[28px]">
        Shipping next
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
        Drop your email on a tool below. We ping you only when that one ships.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          icon={MessageSquare}
          title="AI Architect Chat"
          description="Ask about Vastu, NBC norms, or material trade-offs — with citations."
          toolKey="architect-chat"
        />
      </div>
    </section>
  )
}

function Footnote() {
  return (
    <section className="border-t border-[var(--border)] py-10">
      <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
        Made for Indian homeowners. All tools run on standard web — no installs. Vastu Checker
        analysis is local; AI renders use OpenAI's image API. Rates and conversions are kept
        current to local Indian standards; for legal documents, cross-check with your local
        sub-registrar.
      </p>
    </section>
  )
}
