import { NextStepCard } from '#/components/tools/next-step-card'
import { ResultBar } from '#/components/tools/result-bar'
import { ToolContext } from '#/components/tools/tool-context'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolSources } from '#/components/tools/tool-sources'
import {
  FINISHING_CHECKED,
  type FinishingToolContent,
} from '#/data/finishing-calc-content'

/**
 * Layout shared by the tiles, paint, brick, plaster and steel calculators: inputs, result,
 * next step, how it works, FAQ and sources. Each page supplies its own inputs and result.
 */
export function QuantityToolPage({
  content,
  headline,
  inputs,
  result,
  nextFrom,
  extra,
  illustration,
}: {
  content: FinishingToolContent
  /** Pre-formatted figure for the phone result bar; omit while there is no result */
  headline?: { label: string; value: string }
  inputs: React.ReactNode
  result: React.ReactNode
  /** Path whose next step to show; defaults to the page's own path */
  nextFrom?: string
  /** Extra section after the next step, e.g. links to city pages */
  extra?: React.ReactNode
  /** Decorative header picture, passed through to ToolPageShell */
  illustration?: React.ReactNode
}) {
  return (
    <ToolPageShell
      title={content.title}
      tagline={content.tagline}
      variant="single-column"
      illustration={illustration}
    >
      {headline && (
        <ResultBar
          label={headline.label}
          value={headline.value}
          targetId="result"
        />
      )}
      <div className="flex flex-col gap-14">
        {inputs}
        <ToolSection id="result" label="Result">
          {result}
        </ToolSection>
        <NextStepCard from={nextFrom ?? content.path} />
        {extra}
        <ToolContext title={content.context.title}>
          {content.context.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ToolContext>
        <ToolFaq items={content.faqs} />
        <ToolSources
          sources={content.sources}
          checked={FINISHING_CHECKED}
          note={content.note}
        />
      </div>
    </ToolPageShell>
  )
}
