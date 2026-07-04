import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { LinkGrid } from '#/components/blog/link-grid'
import {
  getArticleLinkItem,
  getToolLinkItem,
  type TopicHub,
} from '#/data/blog-content'

interface TopicHubPageProps {
  hub: TopicHub
}

export function TopicHubPage({ hub }: TopicHubPageProps) {
  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: hub.title },
      ]}
      eyebrow={{ label: hub.eyebrow }}
      title={hub.title}
      tagline={hub.description}
      variant="single-column"
      footnote="These guides are written as practical planning references for Indian homeowners. Always verify local rules, municipal workflows, and final professional advice before paying or building."
    >
      <div className="flex flex-col gap-10">
        <ToolSection label="What this hub covers" rule={false}>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              {hub.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </ToolSection>

        <ToolSection
          label="Featured guides"
          description="The highest-intent explainers in this topic cluster."
        >
          <LinkGrid items={hub.featuredArticles.map(getArticleLinkItem)} />
        </ToolSection>

        <ToolSection
          label="Matching tools"
          description="Use the calculators and visual tools that support these guides."
        >
          <LinkGrid items={hub.featuredTools.map(getToolLinkItem)} />
        </ToolSection>

        <ToolFaq number="FAQ" items={hub.faqs} />
      </div>
    </ToolPageShell>
  )
}
