import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { canonicalLink } from '#/lib/seo'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy · Plotr Ai' },
      {
        name: 'description',
        content:
          'Privacy policy for Plotr Ai, including analytics, advertising, cookies, and user-submitted calculator data.',
      },
    ],
    links: [canonicalLink('/privacy-policy')],
  }),
})

function PrivacyPolicyPage() {
  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
      eyebrow={{ icon: ShieldCheck, label: 'Policy' }}
      title="Privacy Policy"
      tagline="How Plotr Ai handles calculator inputs, analytics, cookies, and advertising-related data."
      variant="reading"
      footnote="Last updated 22 June 2026. This page should be reviewed whenever analytics, advertising, or data-processing tools change."
    >
      <div className="flex flex-col gap-8">
        <ToolSection number="01" label="Information we handle" rule={false}>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Plotr Ai provides free calculators and home-planning tools. Most
            calculator inputs are processed in your browser and are not saved
            with your name. If you use image or AI features, uploaded files and
            prompts may be processed only to generate the requested result.
          </p>
        </ToolSection>

        <ToolSection number="02" label="Analytics and ads">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            We may use analytics tools to understand page views, device type,
            approximate location, and tool usage. If Google AdSense or other ad
            networks are enabled, third-party vendors may use cookies or similar
            technologies to serve and measure ads. Users can manage Google ad
            personalization from their Google account settings.
          </p>
        </ToolSection>

        <ToolSection number="03" label="Your choices">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            You can block cookies in your browser, avoid uploading personal
            documents, and contact us if you believe any data should be removed.
            Calculator estimates are informational and do not require signup.
          </p>
        </ToolSection>
      </div>
    </ToolPageShell>
  )
}
