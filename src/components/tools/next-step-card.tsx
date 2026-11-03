import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { NEXT_STEPS } from '#/data/next-steps'
import { track } from '#/lib/track'

/** Card after a tool's result pointing to the next decision. Renders nothing if `from` has none. */
export function NextStepCard({ from }: { from: string }) {
  const step = NEXT_STEPS[from]
  if (!step) return null

  return (
    <Link
      to={step.to}
      onClick={() => track('next_step_click', { from, to: step.to })}
      className="group flex items-center gap-4 rounded-xl border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-4 no-underline transition-colors hover:border-[var(--accent-teal)]/60 sm:p-5"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-[var(--accent-teal)]">Next step</span>
        <span className="text-base font-semibold text-[var(--foreground)]">{step.title}</span>
        <span className="text-sm leading-snug text-[var(--foreground)]/75">{step.description}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-[var(--accent-teal)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
