import { ExternalLink } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { ToolSection } from './tool-section'

export interface ToolSource {
  label: string
  /** Omit for sources with no public page (e.g. contractor quote benchmarks) */
  url?: string
}

/**
 * Government domains count as official, other links as secondary. A source with no link gets no
 * badge, because we can't check which it is.
 */
export function sourceKind(url?: string): 'official' | 'secondary' | null {
  if (!url) return null
  try {
    const host = new URL(url).hostname
    return host.endsWith('.gov.in') || host.endsWith('.nic.in') ? 'official' : 'secondary'
  } catch {
    return null
  }
}

interface ToolSourcesProps {
  sources: ReadonlyArray<ToolSource>
  /** When the figures were last checked, as stored in the data file (e.g. "2026-06-22", "2026-Q2") */
  checked: string
  /** How to read the figures: estimate caveats, what is excluded */
  note?: string
}

/**
 * The last section of every tool page: where the numbers come from, whether each source is
 * official, and when they were last checked. Replaces ad-hoc footnotes.
 */
export function ToolSources({ sources, checked, note }: ToolSourcesProps) {
  return (
    <ToolSection label="Sources" description={`Last checked ${checked}.`}>
      <ul className="flex flex-col divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {sources.map((source) => {
          const kind = sourceKind(source.url)
          return (
            <li key={source.label} className="flex items-start justify-between gap-3 py-3">
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-sm text-[var(--foreground)] underline-offset-4 hover:text-[var(--accent-teal)] hover:underline"
                >
                  {source.label}
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-60" />
                </a>
              ) : (
                <span className="text-sm text-[var(--foreground)]">{source.label}</span>
              )}
              {kind && (
                <Badge variant={kind === 'official' ? 'default' : 'secondary'} className="shrink-0">
                  {kind === 'official' ? 'Official' : 'Secondary'}
                </Badge>
              )}
            </li>
          )
        })}
      </ul>
      {note && (
        <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-[var(--foreground)]/75">
          {note}
        </p>
      )}
    </ToolSection>
  )
}
