import { Link } from '@tanstack/react-router'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

interface ToolCardProps {
  to: string
  status: 'live' | 'flagship' | 'utility'
  title: string
  description: string
  icon: LucideIcon
  ctaLabel?: string
  featured?: boolean
}

const STATUS_LABEL: Record<ToolCardProps['status'], string> = {
  live: 'Live',
  flagship: 'Flagship',
  utility: 'Utility',
}

export function ToolCard({
  to,
  status,
  title,
  description,
  icon: Icon,
  ctaLabel = 'Open tool',
  featured = false,
}: ToolCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'frosted group flex h-full flex-col rounded-2xl no-underline',
        'p-6',
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            featured
              ? 'bg-[var(--accent-teal)] text-white'
              : 'bg-[var(--accent-teal-light)] text-[var(--accent-teal)]',
          )}
        >
          <Icon className="size-5" />
        </div>
        <Badge
          variant={featured ? 'default' : 'secondary'}
          className={cn(
            'font-mono text-[10px] uppercase tracking-[0.12em]',
            featured && 'bg-[var(--accent-teal)] hover:bg-[var(--accent-teal)]',
          )}
        >
          {STATUS_LABEL[status]}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>
      </div>

      <div
        className={cn(
          'mt-6 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
          featured
            ? 'bg-[var(--accent-teal)] text-white group-hover:bg-[var(--accent-teal)]/90'
            : 'bg-[var(--muted)]/60 text-[var(--foreground)] group-hover:bg-[var(--muted)]',
        )}
      >
        <span>{ctaLabel}</span>
        <ArrowUpRight
          className={cn(
            'size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            featured ? 'text-white' : 'text-[var(--accent-teal)]',
          )}
        />
      </div>
    </Link>
  )
}
