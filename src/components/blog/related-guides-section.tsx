import { LinkGrid, type LinkGridItem } from '#/components/blog/link-grid'
import { ToolSection } from '#/components/tools/tool-section'

interface RelatedGuidesSectionProps {
  items: ReadonlyArray<LinkGridItem>
  number?: string
  label?: string
  description?: string
}

export function RelatedGuidesSection({
  items,
  number = 'MORE',
  label = 'Related guides',
  description = 'Read the matching explainers, checklists, and planning notes.',
}: RelatedGuidesSectionProps) {
  if (!items.length) return null

  return (
    <ToolSection number={number} label={label} description={description}>
      <LinkGrid items={items} />
    </ToolSection>
  )
}
