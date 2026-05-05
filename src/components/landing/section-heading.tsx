interface SectionHeadingProps {
  number: string
  kicker: string
  title: string
  description?: string
}

export function SectionHeading({ number, kicker, title, description }: SectionHeadingProps) {
  return (
    <div className="fade-rise grid gap-x-8 gap-y-4 border-t border-[var(--border)] pt-8 md:grid-cols-[auto_1fr] md:pt-10">
      <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] md:flex-col md:items-end md:gap-1 md:pt-2">
        <span className="text-[var(--accent-teal)]">{number}</span>
        <span className="hidden h-px w-8 bg-[var(--border)] md:block" />
        <span>{kicker}</span>
      </div>
      <div className="max-w-3xl">
        <h2 className="text-balance text-2xl font-semibold leading-tight tracking-[-0.015em] text-[var(--foreground)] sm:text-[28px]">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
