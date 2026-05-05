import { cn } from '#/lib/utils'

interface ToolSectionProps {
  number?: string
  label: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
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
  rule = true,
}: ToolSectionProps) {
  return (
    <section
      className={cn(
        rule && 'border-t border-[var(--border)] pt-7',
        'flex flex-col gap-4',
        className,
      )}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {number && (
              <span className="mr-2 text-[var(--accent-teal)]">{number}</span>
            )}
            {label}
          </p>
          {description && (
            <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div>{children}</div>
    </section>
  )
}
