import { cn } from '#/lib/utils'

interface ToolSectionProps {
  /** Anchor for in-page links, e.g. the mobile result bar */
  id?: string
  /** @deprecated No longer shown; kept so existing call sites compile */
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
  /** @deprecated Sections are separated by whitespace now; kept so existing call sites compile */
  rule?: boolean
}

export function ToolSection({
  id,
  label,
  description,
  action,
  children,
  className,
  layout = 'stacked',
}: ToolSectionProps) {
  const isStacked = layout === 'stacked'

  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20',
        isStacked
          ? 'flex flex-col gap-4'
          : 'grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-x-10',
        className,
      )}
    >
      <header className={cn('flex flex-col gap-1', !isStacked && 'lg:pt-1')}>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{label}</h2>
          {description && (
            <p className="text-sm text-[var(--foreground)]/75">{description}</p>
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
