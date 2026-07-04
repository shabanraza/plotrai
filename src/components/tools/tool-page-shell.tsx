import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import { cn } from '#/lib/utils'

type Variant = 'workbench' | 'progressive' | 'single-column' | 'reading'

interface BreadcrumbEntry {
  label: string
  href?: string
}

interface EyebrowProps {
  icon?: LucideIcon
  label: string
}

interface ToolPageShellProps {
  breadcrumb?: ReadonlyArray<BreadcrumbEntry>
  eyebrow?: EyebrowProps
  title: string
  tagline?: string
  variant?: Variant
  headerActions?: React.ReactNode
  children: React.ReactNode
  footnote?: React.ReactNode
}

const VARIANT_MAX_W: Record<Variant, string> = {
  workbench: 'max-w-6xl',
  progressive: 'max-w-5xl',
  'single-column': 'max-w-6xl',
  reading: 'max-w-3xl',
}

const VARIANT_CONTENT_W: Record<Variant, string> = {
  workbench: '',
  progressive: 'max-w-[1040px]',
  'single-column': 'max-w-[980px]',
  reading: 'max-w-[760px]',
}

export function ToolPageShell({
  breadcrumb,
  eyebrow,
  title,
  tagline,
  variant = 'single-column',
  headerActions,
  children,
  footnote,
}: ToolPageShellProps) {
  const Icon = eyebrow?.icon
  const contentWidth = VARIANT_CONTENT_W[variant]
  return (
    <main className={cn('mx-auto px-4 pb-16 pt-8 sm:px-6 sm:pt-10', VARIANT_MAX_W[variant])}>
      <div className={cn('mx-auto w-full', contentWidth)}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              {breadcrumb.map((entry, i) => {
                const isLast = i === breadcrumb.length - 1
                return (
                  <span key={`${entry.label}-${i}`} className="contents">
                    <BreadcrumbItem>
                      {isLast || !entry.href ? (
                        <BreadcrumbPage>{entry.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={entry.href}>{entry.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </span>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-teal)]/25 bg-[var(--accent-teal-light)] px-3 py-1 text-xs font-medium text-[var(--accent-teal)]">
                {Icon && <Icon className="size-3" />}
                {eyebrow.label}
              </span>
            )}
            <h1 className="w-full text-balance text-[2.05rem] font-semibold leading-[1.02] text-[var(--foreground)] sm:text-[2.55rem] md:text-[2.9rem]">
              {title}
            </h1>
            {tagline && (
              <p className="mt-4 max-w-[62ch] text-[1rem] leading-8 text-[var(--muted-foreground)] sm:text-[1.15rem]">
                {tagline}
              </p>
            )}
          </div>
          {headerActions && <div className="shrink-0">{headerActions}</div>}
        </header>

        {children}

        {footnote && (
          <p className="mt-12 max-w-[62ch] text-xs leading-6 text-[var(--muted-foreground)]/80">
            {footnote}
          </p>
        )}
      </div>
    </main>
  )
}

interface WorkbenchProps {
  children: React.ReactNode
  className?: string
}

function Workbench({ children, className }: WorkbenchProps) {
  return (
    <div className={cn('grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start', className)}>
      {children}
    </div>
  )
}

function WorkbenchSidebar({ children, className }: WorkbenchProps) {
  return <aside className={cn('flex flex-col gap-7', className)}>{children}</aside>
}

function WorkbenchResult({ children, className }: WorkbenchProps) {
  return <section className={cn('flex flex-col gap-4', className)}>{children}</section>
}

Workbench.Sidebar = WorkbenchSidebar
Workbench.Result = WorkbenchResult

export { Workbench }
