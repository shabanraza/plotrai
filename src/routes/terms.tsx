import { createFileRoute } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { canonicalLink } from '#/lib/seo'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: 'Terms of Use · Plotr Ai' },
      {
        name: 'description',
        content:
          'Terms of use for Plotr Ai calculators, Vastu tools, construction estimates, and property planning content.',
      },
    ],
    links: [canonicalLink('/terms')],
  }),
})

function TermsPage() {
  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
      eyebrow={{ icon: FileText, label: 'Terms' }}
      title="Terms of Use"
      tagline="The basic rules for using Plotr Ai’s free calculators and home-planning tools."
      variant="reading"
      footnote="Last updated 22 June 2026."
    >
      <div className="flex flex-col gap-8">
        <ToolSection number="01" label="Use of tools" rule={false}>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Plotr Ai tools are provided for planning and educational use. You
            may use the calculators for personal property budgeting,
            construction planning, and comparison work, but the outputs are not
            professional advice.
          </p>
        </ToolSection>

        <ToolSection number="02" label="No warranty">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Rates, tax rules, municipal formulas, and construction costs can
            change. We try to keep sources current, but we do not guarantee that
            any estimate is complete, legally binding, or accepted by an
            authority.
          </p>
        </ToolSection>

        <ToolSection number="03" label="Responsible use">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Do not upload files you do not have rights to use. Do not rely on
            Plotr Ai as the only source for legal, tax, design, safety,
            structural, or municipal decisions.
          </p>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}
