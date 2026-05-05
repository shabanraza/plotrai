import { createFileRoute } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      eyebrow={{ icon: Info, label: 'About Plotr Ai' }}
      title="Indian home design, decoded."
      tagline="Plotr Ai is a free toolkit for Indian homeowners — Vastu compliance, AI 3D renders, interior restyling, and land-unit utilities. Single-purpose tools, no signup, no credit card."
      variant="reading"
    >
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
          We built Plotr Ai because Indian homeowners deserve better than imported AI tools that
          render Californian bungalows when you want a Mangalore-tile bungalow, and better than
          fee-based pandits who tell you to relocate a kitchen that can't move. Every tool here
          is built around an Indian use case, refreshed against Indian rates, and tuned for
          Indian materials.
        </p>
        <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
          The toolkit grows tool by tool. Drop your email on a Coming Soon card on the home page
          and we'll ping you only when that specific tool ships — no newsletter, no marketing
          blast.
        </p>
      </div>
    </ToolPageShell>
  )
}
