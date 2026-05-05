import { Link } from '@tanstack/react-router'
import {
  Box,
  Calculator,
  Compass,
  Hammer,
  Receipt,
  Ruler,
  Sofa,
  TrendingUp,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '#/components/ui/navigation-menu'

interface ToolEntry {
  to: string
  icon: LucideIcon
  title: string
  description: string
  status: 'flagship' | 'live' | 'utility'
}

const TOOLS: ReadonlyArray<ToolEntry> = [
  {
    to: '/vastu-checker',
    icon: Compass,
    title: 'Vastu Checker',
    description: 'Score floor plans against 14 classical Vastu rules.',
    status: 'flagship',
  },
  {
    to: '/floor-plan-3d',
    icon: Box,
    title: 'Floor Plan → 3D',
    description: '2D plan → furnished isometric 3D render.',
    status: 'live',
  },
  {
    to: '/interior-restyle',
    icon: Wand2,
    title: 'Interior Restyle',
    description: 'Re-render any room photo in a new style.',
    status: 'live',
  },
  {
    to: '/empty-room-stager',
    icon: Sofa,
    title: 'Empty Room Stager',
    description: 'AI-furnish an empty room photo.',
    status: 'live',
  },
  {
    to: '/plot-converter',
    icon: Ruler,
    title: 'Plot Area Converter',
    description: 'Gunta, bigha, marla — region-aware land units.',
    status: 'utility',
  },
  {
    to: '/material-calculator',
    icon: Calculator,
    title: 'Material Calculator',
    description: 'Cement, bricks, steel, sand for any element.',
    status: 'utility',
  },
  {
    to: '/stamp-duty-calculator',
    icon: Receipt,
    title: 'Stamp Duty Calculator',
    description: 'State-wise stamp duty + registration in India.',
    status: 'utility',
  },
  {
    to: '/construction-cost-calculator',
    icon: Hammer,
    title: 'Construction Cost Calculator',
    description: 'Per sq ft × city × tier — stage-wise breakdown.',
    status: 'utility',
  },
  {
    to: '/property-capital-gains-calculator',
    icon: TrendingUp,
    title: 'Capital Gains Calculator',
    description: 'Property LTCG — both regimes computed.',
    status: 'utility',
  },
]

export function ToolsMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-8 bg-transparent px-3 text-[13px] font-medium text-[var(--muted-foreground)] hover:bg-[var(--chip-bg)] hover:text-[var(--foreground)] data-[state=open]:bg-[var(--chip-bg)] data-[state=open]:text-[var(--foreground)]">
            Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent className="left-1/2 top-full mt-2 -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--popover)] p-3 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_8px_24px_-4px_rgba(24,24,27,0.10),0_24px_48px_-12px_rgba(24,24,27,0.10)] md:!w-[640px] md:max-w-[calc(100vw-2rem)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_12px_32px_-4px_rgba(0,0,0,0.5)]">
            <ul className="grid gap-1 sm:grid-cols-2">
              {TOOLS.map((tool) => (
                <ToolMenuItem key={tool.to} tool={tool} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ToolMenuItem({ tool }: { tool: ToolEntry }) {
  const Icon = tool.icon
  return (
    <li>
      <Link
        to={tool.to}
        className="group grid grid-cols-[auto_1fr] gap-3 rounded-lg p-3 no-underline outline-none transition-colors hover:bg-[var(--muted)]/60 focus-visible:bg-[var(--muted)]/60"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent-teal-light)] text-[var(--accent-teal)]">
          <Icon className="size-4" />
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
