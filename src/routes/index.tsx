import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Compass,
  Box,
  Wand2,
  Sofa,
  Ruler,
  Calculator,
  Palette,
  MessageSquare,
  Hammer,
  Receipt,
  TrendingUp,
  Building2,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ToolCard } from '#/components/landing/tool-card'
import { ComingSoonCard } from '#/components/landing/coming-soon-card'

export const Route = createFileRoute('/')({ component: LandingPage })

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
    <section className="flex flex-col items-start gap-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)]/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        <span className="size-1.5 rounded-full bg-[var(--accent-teal)]" aria-hidden />
        Indian home design toolkit
      </div>

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

      <StatsStrip />
    </section>
  )
}

function StatsStrip() {
  const items = [
    { value: '9', label: 'Live tools' },
    { value: '0', label: 'Signup required' },
    { value: '14', label: 'Vastu rules' },
    { value: 'Free', label: 'No credit card' },
  ]
  return (
    <dl className="mt-2 grid w-full grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border)] pt-6 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1">
          <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {it.label}
          </dt>
          <dd className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ToolsSection() {
  return (
    <section id="tools" className="scroll-mt-16 pb-16 sm:pb-20">
      <SectionLabel kicker="Tools" title="All tools" description="Use any tool standalone — they don't require an account." />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

function ComingSoonSection() {
  return (
    <section className="border-t border-[var(--border)] py-16 sm:py-20">
      <SectionLabel
        kicker="Roadmap"
        title="Shipping next"
        description="Drop your email on a tool below. We ping you only when that one ships."
      />

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

interface SectionLabelProps {
  kicker: string
  title: string
  description?: string
}

function SectionLabel({ kicker, title, description }: SectionLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-teal)]">
        {kicker}
      </p>
      <h2 className="text-2xl font-semibold tracking-[-0.015em] text-[var(--foreground)] sm:text-[28px]">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
      )}
    </div>
  )
}
