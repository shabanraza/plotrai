import { ArrowRight } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

export interface LinkGridItem {
  to: string
  label: string
  description: string
  badge?: string
}

interface LinkGridProps {
  items: ReadonlyArray<LinkGridItem>
  columns?: 'two' | 'three'
  compact?: boolean
}

export function LinkGrid({
  items,
  columns = 'two',
  compact = false,
}: LinkGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 'three' ? 'lg:grid-cols-3' : 'sm:grid-cols-2',
      )}
    >
      {items.map((item) => (
        <a
          key={item.to}
          href={item.to}
          className="group flex h-full flex-col gap-2 rounded-lg bg-[var(--muted)] px-4 py-3.5 transition-colors hover:bg-[var(--brand-light)]"
        >
          <div className="flex flex-wrap items-center gap-2">
            {item.badge && (
              <Badge variant="secondary" className="text-xs font-medium">
                {item.badge}
              </Badge>
            )}
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {item.label}
            </span>
          </div>
          <p
            className={cn(
              'text-sm leading-relaxed text-[var(--muted-foreground)]',
              compact && 'text-[13px]',
            )}
          >
            {item.description}
          </p>
          <div className="mt-auto flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
            Explore
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </a>
      ))}
    </div>
  )
}
