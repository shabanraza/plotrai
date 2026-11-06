import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ResultBarProps {
  /** e.g. "Total construction cost" */
  label: string
  /** Pre-formatted headline figure, e.g. "₹38,25,000" */
  value: string
  /** id of the result section to scroll to */
  targetId: string
}

/**
 * Phones only: a bar pinned to the bottom of the screen showing the headline result while the
 * visitor is still filling in inputs. It hides once the result section is on screen or above it.
 * Sets data-result-bar on <html> so the floating chat button can move up out of the way.
 */
export function ResultBar({ label, value, targetId }: ResultBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      // Show only while the result is still below the fold
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top > 0)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  useEffect(() => {
    const root = document.documentElement
    if (visible) root.dataset.resultBar = 'visible'
    else delete root.dataset.resultBar
    return () => {
      delete root.dataset.resultBar
    }
  }, [visible])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
      className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--border)] bg-[var(--background)]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-left backdrop-blur-md lg:hidden"
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-xs text-[var(--foreground)]/75">{label}</span>
        <span className="text-xl font-semibold tabular-nums text-[var(--foreground)]">{value}</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--brand)]">
        See breakdown
        <ChevronDown className="size-4" />
      </span>
    </button>
  )
}
