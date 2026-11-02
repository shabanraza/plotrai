import { createFileRoute } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { canonicalLink } from '#/lib/seo'

export const Route = createFileRoute('/disclaimer')({
  component: DisclaimerPage,
  head: () => ({
    meta: [
      { title: 'Disclaimer · Plotr Ai' },
      {
        name: 'description',
        content:
          'Important disclaimer for Plotr Ai estimates, property taxes, stamp duty, construction costs, Vastu checks, and AI-generated outputs.',
      },
    ],
    links: [canonicalLink('/disclaimer')],
  }),
})

function DisclaimerPage() {
  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Disclaimer' }]}
      eyebrow={{ icon: CircleAlert, label: 'Important' }}
      title="Disclaimer"
      tagline="Calculator outputs are planning estimates. Final decisions should be checked with the right professional or authority."
      variant="reading"
      footnote="Last updated 2 November 2026."
    >
      <div className="flex flex-col gap-8">
        <ToolSection
          number="01"
          label="Property and tax estimates"
          rule={false}
        >
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Stamp duty, property tax, capital gains, and indexation tools are
            informational. Verify payable amounts with the relevant IGR,
            municipal portal, Income Tax rules, or a qualified CA or lawyer
            before filing, paying, or signing documents.
          </p>
        </ToolSection>

        <ToolSection number="02" label="Construction and Vastu">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Construction costs and material quantities are planning baselines.
            Site conditions, structural design, soil, local labour, approvals,
            contractor margin, and specification changes can materially change
            the final budget. Vastu outputs are belief-based guidance, not
            architectural, structural, or safety certification.
          </p>
        </ToolSection>

        <ToolSection number="03" label="AI outputs">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            AI-generated images, reports, or suggestions may contain mistakes.
            Review outputs before using them in construction, purchase, legal,
            or financial decisions.
          </p>
        </ToolSection>

        <ToolSection number="04" label="Partner links">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Some pages link to home loan and other partner offers. If you apply
            through these links we may earn a commission, at no extra cost to
            you. Partner links never change our calculator results. Loan
            approval, interest rates, and terms are decided solely by the
            lender.
          </p>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}
