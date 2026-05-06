import { ToolSection } from './tool-section'

interface ToolContextProps {
  number?: string
  label?: string
  title: string
  children: React.ReactNode
}

/**
 * Long-form explanatory section that lives below a tool's interactive
 * area. Provides indexable depth ("What is X", "Why it matters",
 * "How to use"). Keep content visible (no accordion) — Google ranks
 * visible content higher than collapsed content for body copy.
 */
export function ToolContext({
  number = 'Guide',
  label = 'About this tool',
  title,
  children,
}: ToolContextProps) {
  return (
    <ToolSection number={number} label={label}>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
          {title}
        </h2>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          {children}
        </div>
      </div>
    </ToolSection>
  )
}
