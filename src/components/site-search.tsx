import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Building2, MapPin, Ruler } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import {
  SITE_ENTRIES,
  SITE_HUBS,
  searchFilter,
  type EntryKind,
  type SiteEntry,
} from '#/data/site-map'

const GROUPS: ReadonlyArray<{ kind: EntryKind; heading: string }> = [
  { kind: 'tool', heading: 'Calculators and tools' },
  { kind: 'state', heading: 'Stamp duty by state' },
  { kind: 'city', heading: 'Construction cost by city' },
  { kind: 'unit', heading: 'Land unit conversions' },
  { kind: 'guide', heading: 'Guides' },
]

const KIND_ICON = { state: MapPin, city: Building2, unit: Ruler, guide: BookOpen } as const

const HUB_LABEL = Object.fromEntries(SITE_HUBS.map((h) => [h.id, h.label]))

/**
 * Site-wide search palette over site-map.ts. Opens with Ctrl K / ⌘K or from the header buttons.
 * Matching is client-side (cmdk), across titles plus each entry's keywords.
 */
export function SiteSearch({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  function go(entry: SiteEntry) {
    onOpenChange(false)
    navigate({ to: entry.to })
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Plotr Ai"
      description="Find a calculator, state, city, land unit or guide"
      filter={searchFilter}
      className="top-[12%] translate-y-0 sm:max-w-xl"
    >
      <CommandInput placeholder="Try “punjab stamp duty” or “100 gaj”" className="text-base sm:text-sm" />
      <CommandList className="max-h-[min(60vh,420px)]">
        <CommandEmpty>No pages match. Try a state, city or unit name.</CommandEmpty>
        {GROUPS.map(({ kind, heading }) => {
          const entries = SITE_ENTRIES.filter((e) => e.kind === kind)
          if (entries.length === 0) return null
          return (
            <CommandGroup key={kind} heading={heading}>
              {entries.map((entry) => {
                const Icon = entry.icon ?? (kind === 'tool' ? undefined : KIND_ICON[kind])
                return (
                  <CommandItem
                    key={entry.to}
                    value={`${entry.title} ${entry.to}`}
                    keywords={entry.keywords ? [...entry.keywords] : undefined}
                    onSelect={() => go(entry)}
                  >
                    {Icon && <Icon className="text-[var(--accent-teal)]" />}
                    <span className="min-w-0 flex-1 truncate">{entry.title}</span>
                    <span className="hidden font-mono text-[10.5px] tracking-wider text-[var(--muted-foreground)] uppercase sm:inline">
                      {HUB_LABEL[entry.hub]}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}
