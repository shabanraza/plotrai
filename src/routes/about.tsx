import { createFileRoute } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      { title: 'About Plotr Ai — Free tools for Indian homeowners' },
      {
        name: 'description',
        content:
          'Plotr Ai is a free toolkit for Indian homeowners — Vastu compliance, AI 3D renders, interior restyling, and land-unit utilities. Single-purpose tools, no signup, no credit card.',
      },
      { property: 'og:title', content: 'About Plotr Ai · Indian home design, decoded' },
      {
        property: 'og:description',
        content:
          'Free tools built around Indian use cases — refreshed with Indian rates, tuned for Indian materials.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/about.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/about' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/about.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://plotrai.in/about' }],
  }),
})

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
