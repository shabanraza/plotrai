import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '#/components/ui/navigation-menu'
import {
  HUB_PROGRAMMATIC_LABEL,
  SITE_HUBS,
  entriesForHub,
  hubPath,
  type SiteEntry,
  type SiteHub,
} from '#/data/site-map'

/** How many "by state / by city" quick links a hub panel shows before "See all". */
const QUICK_LINK_LIMIT = 8
const GUIDE_LIMIT = 2

const TRIGGER_CLASS =
  'h-8 bg-transparent px-3 text-[13px] font-medium text-[var(--muted-foreground)] hover:bg-[var(--chip-bg)] hover:text-[var(--foreground)] data-[state=open]:bg-[var(--chip-bg)] data-[state=open]:text-[var(--foreground)]'

const PANEL_CLASS =
  'left-0 top-full mt-2 rounded-xl border border-[var(--border)] bg-[var(--popover)] p-3 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_8px_24px_-4px_rgba(24,24,27,0.10),0_24px_48px_-12px_rgba(24,24,27,0.10)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_12px_32px_-4px_rgba(0,0,0,0.5)]'

/**
 * Desktop header menus: one dropdown per hub (Buy, Build, Land, Tax, Design). Tools sit on the
 * left; "by state / by city" quick links and top guides on the right. All read from site-map.ts.
 */
export function ToolsMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-0.5">
        {SITE_HUBS.map((hub) => (
          // static: panels position against the whole menu, so the rightmost hub cannot overflow
          <NavigationMenuItem key={hub.id} className="static">
            <NavigationMenuTrigger className={TRIGGER_CLASS}>{hub.label}</NavigationMenuTrigger>
            <NavigationMenuContent className={`${PANEL_CLASS} ${panelWidth(hub)}`}>
              <HubPanel hub={hub} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function HubPanel({ hub }: { hub: SiteHub }) {
  const tools = entriesForHub(hub.id, 'tool')
  const quick = HUB_PROGRAMMATIC_LABEL[hub.id]
  const quickLinks = quick ? entriesForHub(hub.id, quick.kind) : []
  const guides = entriesForHub(hub.id, 'guide').slice(0, GUIDE_LIMIT)
  const hasSide = quickLinks.length > 0 || guides.length > 0

  return (
    <div className={hasSide ? 'grid gap-3 md:grid-cols-[1.15fr_1fr]' : 'grid'}>
      <div>
        <PanelKicker>{hub.title}</PanelKicker>
        <ul className="grid gap-0.5">
          {tools.map((tool) => (
            <ToolMenuItem key={tool.to} tool={tool} />
          ))}
        </ul>
        <Link
          to={hubPath(hub.id)}
          className="mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] font-medium text-[var(--accent-teal)] no-underline hover:bg-[var(--muted)]/60"
        >
          Everything in {hub.title.toLowerCase()}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {hasSide && (
        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-3">
          {quick && quickLinks.length > 0 && (
            <div>
              <PanelKicker>{quick.label}</PanelKicker>
              <ul className="grid grid-cols-2 gap-x-2">
                {quickLinks.slice(0, QUICK_LINK_LIMIT).map((entry) => (
                  <li key={entry.to}>
                    <Link
                      to={entry.to}
                      className="block truncate rounded-md px-2 py-1.5 text-[13px] text-[var(--foreground)] no-underline hover:bg-[var(--muted)]/60"
                    >
                      {shortLabel(entry)}
                    </Link>
                  </li>
                ))}
              </ul>
              {quickLinks.length > QUICK_LINK_LIMIT && (
                <p className="mt-1 px-2 font-mono text-[11px] text-[var(--muted-foreground)]">
                  +{quickLinks.length - QUICK_LINK_LIMIT} more · search to find yours
                </p>
              )}
            </div>
          )}
          {guides.length > 0 && (
            <div>
              <PanelKicker>Guides</PanelKicker>
              <ul className="grid gap-0.5">
                {guides.map((guide) => (
                  <li key={guide.to}>
                    <Link
                      to={guide.to}
                      className="group flex items-start gap-1.5 rounded-md px-2 py-1.5 text-[13px] leading-snug text-[var(--foreground)] no-underline hover:bg-[var(--muted)]/60"
                    >
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-[var(--accent-teal)]" />
                      <span className="line-clamp-2">{guide.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** "Punjab stamp duty" → "Punjab", "Pune construction cost" → "Pune"; unit pages keep their title. */
export function shortLabel(entry: SiteEntry) {
  if (entry.kind === 'state') return entry.title.replace(/ stamp duty$/, '')
  if (entry.kind === 'city') return entry.title.replace(/ construction cost$/, '')
  return entry.title
}

function PanelKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 px-2 font-mono text-[10.5px] font-medium tracking-[0.12em] text-[var(--muted-foreground)] uppercase">
      {children}
    </p>
  )
}

function ToolMenuItem({ tool }: { tool: SiteEntry }) {
  const Icon = tool.icon
  return (
    <li>
      <Link
        to={tool.to}
        className="group grid grid-cols-[auto_1fr] gap-3 rounded-lg p-2 no-underline outline-none transition-colors hover:bg-[var(--muted)]/60 focus-visible:bg-[var(--muted)]/60"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent-teal-light)] text-[var(--accent-teal)]">
          {Icon && <Icon className="size-4" />}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold text-[var(--foreground)]">{tool.title}</span>
          <span className="text-xs leading-snug text-[var(--muted-foreground)]">
            {tool.description}
          </span>
        </span>
      </Link>
    </li>
  )
}

/** Two-column panels (tools + quick links/guides) are wide; tool-only panels stay narrow. */
function panelWidth(hub: SiteHub) {
  const hasSide =
    Boolean(HUB_PROGRAMMATIC_LABEL[hub.id]) || entriesForHub(hub.id, 'guide').length > 0
  return hasSide ? 'md:!w-[600px]' : 'md:!w-[360px]'
}
