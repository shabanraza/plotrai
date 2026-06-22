import { Link } from '@tanstack/react-router'
import { ArrowRight, Building2, ExternalLink, TrendingUp } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { ToolContext } from '#/components/tools/tool-context'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import type { MunicipalGuideContent } from '#/data/municipal-guide-content'

interface MunicipalGuidePageProps {
  content: MunicipalGuideContent
}

export function MunicipalGuidePage({ content }: MunicipalGuidePageProps) {
  return (
    <ToolPageShell
      breadcrumb={[
        { label: 'Tools', href: '/' },
        { label: `${content.authority} Property Tax`, href: content.calculatorPath },
        { label: content.title },
      ]}
      eyebrow={{ icon: Building2, label: content.eyebrow }}
      title={content.title}
      tagline={content.description}
      variant="single-column"
      headerActions={
        <Button asChild>
          <Link to={content.calculatorPath}>
            Open calculator
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      }
      footnote={`Last checked ${content.lastUpdated}. This guide is for search and planning support. The official municipal portal remains the final source for dues, dates, rebates, payments, and receipts.`}
    >
      <div className="flex flex-col gap-10">
        <ToolSection number="01" label="Search opportunity" rule={false}>
          <div className="flex flex-col gap-3 rounded-md border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{content.authority}</Badge>
              <Badge variant="secondary">Rising search intent</Badge>
            </div>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {content.trendSignal}
            </p>
          </div>
        </ToolSection>

        <ToolSection
          number="02"
          label="What users are trying to do"
          description="A query-matched checklist for the page visitor."
        >
          <div className="rounded-md border border-[var(--border)] bg-[var(--background)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.steps.map((step) => (
                  <TableRow key={step.label}>
                    <TableCell className="font-medium">{step.label}</TableCell>
                    <TableCell className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {step.detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ToolSection>

        <ToolSection
          number="03"
          label="Identifiers and search phrases"
          description="Keep these words visible for users and search engines."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {content.references.map((reference) => (
              <div
                key={reference.label}
                className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {reference.label}
                </p>
                <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">
                  {reference.value}
                </p>
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection number="04" label="Official portal and calculator">
          <div className="flex flex-col gap-4 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[var(--foreground)]">
                Estimate here, verify officially
              </p>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Use Plotr Ai for a planning estimate, then confirm dues, deadlines, and receipts
                on {content.officialLabel}.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline">
                <a href={content.officialUrl} target="_blank" rel="noreferrer">
                  Official portal
                  <ExternalLink data-icon="inline-end" />
                </a>
              </Button>
              <Button asChild>
                <Link to={content.calculatorPath}>
                  Calculator
                  <TrendingUp data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </ToolSection>

        <ToolContext title={`${content.title}: how to use this page`}>
          {content.context.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ToolContext>

        <ToolFaq items={content.faqs} />
      </div>
    </ToolPageShell>
  )
}
