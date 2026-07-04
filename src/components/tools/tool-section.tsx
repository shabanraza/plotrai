import { cn } from '#/lib/utils'

interface ToolSectionProps {
  number?: string
  label: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  /**
   * Stacked is the default tool-page flow.
   * Editorial keeps an optional label/content grid for non-tool reading layouts.
   */
  layout?: 'editorial' | 'stacked'
  /**
   * When true, renders the top hairline rule. Default true.
   * Set false for the very first section in a stack.
   */
  rule?: boolean
}

export function ToolSection({
  number,
  label,
  description,
  action,
  children,
  className,
  layout = 'stacked',
  rule = true,
}: ToolSectionProps) {
  const isStacked = layout === 'stacked'

  return (
    <section
      className={cn(
        rule && 'border-t border-[var(--border)] pt-7',
        isStacked
          ? 'flex flex-col gap-4'
          : 'grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-x-10',
        className,
      )}
    >
      <header className={cn('flex flex-col gap-1', !isStacked && 'lg:pt-1')}>
        <div className="flex flex-col gap-1">
          <p className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
            {number && (
              <span className="text-[var(--accent-teal)]">{number}</span>
            )}
            {label}
          </p>
          {description && (
            <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
          )}
        </div>
      </header>
      {action ? (
        <div
          className={cn(
            'min-w-0',
            !isStacked && 'lg:col-start-2 lg:row-start-1 lg:flex lg:justify-end',
          )}
        >
          {action}
        </div>
      ) : null}
      <div
        className={cn(
          'min-w-0',
          !isStacked &&
            (action
              ? 'lg:col-start-2 lg:row-start-2'
              : 'lg:col-start-2 lg:row-start-1'),
        )}
      >
        {children}
      </div>
    </section>
  )
}
