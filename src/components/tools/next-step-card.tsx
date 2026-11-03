import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { NEXT_STEPS } from '#/data/next-steps'
import { track } from '#/lib/track'

/** Card after a tool's result pointing to the next decision. Renders nothing if `from` has none. */
export function NextStepCard({ from }: { from: string }) {
  const step = NEXT_STEPS[from]
  if (!step) return null

  return (
    <CalloutLink
      to={step.to}
      kicker="Next step"
      title={step.title}
      description={step.description}
      onClick={() => track('next_step_click', { from, to: step.to })}
    />
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

/** Teal link card used for next steps on tools and for calculator / read-next cards in articles. */
export function CalloutLink({ to, kicker, title, description, onClick }: CalloutLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-[var(--accent-teal)]/30 bg-[var(--accent-teal-light)] p-4 no-underline transition-colors hover:border-[var(--accent-teal)]/60 sm:p-5"
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
