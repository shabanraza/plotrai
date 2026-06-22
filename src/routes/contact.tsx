import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { Button } from '#/components/ui/button'
import { canonicalLink } from '#/lib/seo'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: 'Contact · Plotr Ai' },
      {
        name: 'description',
        content:
          'Contact Plotr Ai for calculator corrections, source updates, feedback, and support requests.',
      },
    ],
    links: [canonicalLink('/contact')],
  }),
})

function ContactPage() {
  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      eyebrow={{ icon: Mail, label: 'Contact' }}
      title="Contact Plotr Ai"
      tagline="Send corrections, source updates, bug reports, or tool suggestions."
      variant="reading"
      footnote="For official tax, registration, construction, or legal decisions, contact the relevant authority or professional directly."
    >
      <div className="flex flex-col gap-8">
        <ToolSection number="01" label="Email" rule={false}>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              For source corrections or support, email the Plotr Ai team.
              Include the page URL, the expected value, and the official source
              link if you are reporting a rate change.
            </p>
            <div>
              <Button asChild>
                <a href="mailto:contact@plotrai.in">
                  <Mail data-icon="inline-start" />
                  contact@plotrai.in
                </a>
              </Button>
            </div>
          </div>
        </ToolSection>

        <ToolSection number="02" label="What helps">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            The fastest corrections include the tool name, city or state,
            current value shown on Plotr Ai, the correct value, and an official
            source URL.
          </p>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}
