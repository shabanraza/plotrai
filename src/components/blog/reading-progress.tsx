import { useEffect, useRef } from 'react'

/**
 * Thin teal bar under the site header showing how far through the article the reader is.
 * Written straight to the DOM on scroll so it doesn't re-render the article.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = document.getElementById(targetId)
    const bar = barRef.current
    if (!target || !bar) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = target.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 1
      bar.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return (
    <div aria-hidden className="fixed inset-x-0 top-14 z-40 h-0.5 lg:top-12">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-[var(--accent-teal)]"
      />
    </div>
  )
}
