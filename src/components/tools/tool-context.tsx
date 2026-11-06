interface ToolContextProps {
  /** @deprecated No longer shown */
  number?: string
  /** @deprecated No longer shown */
  label?: string
  title: string
  children: React.ReactNode
}

/**
 * Long-form explanatory section below a tool's interactive area ("What is X", "How to use").
 * Kept visible (no accordion): Google ranks visible body copy higher than collapsed content.
 */
export function ToolContext({ title, children }: ToolContextProps) {
  return (
    <section className="flex max-w-[68ch] flex-col gap-3">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed text-[var(--foreground)]/80 [&_a]:text-[var(--brand)] [&_a]:underline-offset-4 hover:[&_a]:underline">
        {children}
      </div>
    </section>
  )
}
