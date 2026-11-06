import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { NEXT_STEPS } from '#/data/next-steps'
import { track } from '#/lib/track'

/** Link after a tool's result pointing to the next decision. Renders nothing if `from` has none. */
export function NextStepCard({ from }: { from: string }) {
  const step = NEXT_STEPS[from]
  if (!step) return null

  return (
    <Link
      to={step.to}
      onClick={() => track('next_step_click', { from, to: step.to })}
      className="group flex flex-col gap-1 no-underline"
    >
      <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[var(--accent-teal)]">
        Next: {step.title}
        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </span>
      <span className="text-sm text-[var(--foreground)]/75">{step.description}</span>
    </Link>
  )
}

interface CalloutLinkProps {
  to: string
  /** Small teal line above the title, e.g. "Next step", "Read next" */
  kicker: string
  title: string
  description: string
  onClick?: () => void
}

/** Soft panel link used for the calculator and read-next cards in articles. */
export function CalloutLink({ to, kicker, title, description, onClick }: CalloutLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl bg-[var(--muted)] p-4 no-underline transition-colors hover:bg-[var(--accent-teal-light)] sm:p-5"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-[var(--accent-teal)]">{kicker}</span>
        <span className="text-base font-semibold text-[var(--foreground)]">{title}</span>
        <span className="text-sm leading-snug text-[var(--foreground)]/75">{description}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-[var(--accent-teal)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
