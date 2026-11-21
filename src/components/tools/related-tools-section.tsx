import { Link } from '@tanstack/react-router'
import { ToolSection } from '#/components/tools/tool-section'
import { SITE_ENTRIES, type SiteEntry } from '#/data/site-map'

/** Look up site-map entries by path; throws on an unknown path so a typo fails loudly. */
export function resolveRelatedTools(paths: ReadonlyArray<string>): ReadonlyArray<SiteEntry> {
  return paths.map((path) => {
    const entry = SITE_ENTRIES.find((e) => e.to === path)
    if (!entry) throw new Error(`related-tools-section: ${path} is not in the site map`)
    return entry
  })
}

interface RelatedToolsSectionProps {
  paths: ReadonlyArray<string>
  label?: string
}

export function RelatedToolsSection({ paths, label = 'More calculators' }: RelatedToolsSectionProps) {
  const entries = resolveRelatedTools(paths)
  return (
    <ToolSection label={label}>
      <ul className="grid gap-2 sm:grid-cols-2">
        {entries.map((e) => (
          <li key={e.to}>
            <Link
              to={e.to}
              className="flex h-full flex-col gap-0.5 rounded-lg bg-[var(--muted)] px-4 py-3 transition-colors hover:bg-[var(--brand-light)]"
            >
              <span className="text-base font-medium text-[var(--brand)]">{e.title}</span>
              <span className="text-sm text-[var(--foreground)]/75">{e.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </ToolSection>
  )
}
