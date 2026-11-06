import { cn } from '#/lib/utils'

/** Shared colour classes: faint foreground lines, muted fills, one brand accent. */
export const LINE = 'fill-none stroke-[var(--foreground)]/35'
export const FILL = 'fill-[var(--muted)]'
export const FILL_LINE = 'fill-[var(--muted)] stroke-[var(--foreground)]/35'
export const BRAND = 'fill-[var(--brand)]'
export const BRAND_LINE = 'fill-none stroke-[var(--brand)]'
export const PAGE = 'fill-[var(--background)] stroke-[var(--foreground)]/35'

/** Decorative 240×180 SVG canvas; the shell sets its height. */
export function IllustrationFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 240 180"
      aria-hidden="true"
      focusable="false"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-full w-auto', className)}
    >
      {children}
    </svg>
  )
}
