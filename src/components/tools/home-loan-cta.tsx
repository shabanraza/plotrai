import { ArrowUpRight, Landmark } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { track } from '#/lib/track'

const AFFILIATE_URL: string | undefined = import.meta.env.VITE_HOME_LOAN_AFFILIATE_URL

/**
 * Home-loan affiliate CTA. Renders nothing until VITE_HOME_LOAN_AFFILIATE_URL
 * is set, so pages can ship before the affiliate account is approved.
 */
export function HomeLoanCta({ source, loanAmount }: { source: string; loanAmount?: number }) {
  if (!AFFILIATE_URL) return null

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--background)] text-[var(--foreground)]">
          <Landmark className="size-4" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-[var(--foreground)]">
            Compare home loan offers
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Check rates and eligibility from multiple banks in one application.
          </p>
          <p className="text-xs text-[var(--muted-foreground)]/80">
            Partner link — we may earn a commission if you apply, at no cost to you.
          </p>
        </div>
      </div>
      <Button asChild size="lg" className="shrink-0">
        <a
          href={AFFILIATE_URL}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => track('home_loan_cta_click', { source }, loanAmount)}
        >
          Check loan offers
          <ArrowUpRight data-icon="inline-end" />
        </a>
      </Button>
    </div>
  )
}
