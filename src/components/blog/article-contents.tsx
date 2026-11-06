import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { cn } from '#/lib/utils'

export interface ContentsItem {
  id: string
  label: string
}

/** Stable anchor id for a section heading, e.g. "Plot loan vs home loan" → "plot-loan-vs-home-loan". */
export function headingId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Desktop rail: sticky contents list that highlights the section being read. */
export function ArticleContents({ items }: { items: ReadonlyArray<ContentsItem> }) {
  const active = useActiveSection(items)

  return (
    <nav aria-label="In this article" className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-[var(--foreground)]">In this article</p>
      <ol className="flex flex-col border-l border-[var(--border)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-sm leading-snug text-[var(--foreground)]/70 no-underline transition-colors hover:text-[var(--foreground)]',
                active === item.id &&
                  'border-[var(--brand)] font-medium text-[var(--foreground)]',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Below lg: the same list, folded away so it doesn't push the article down. */
export function ArticleContentsMobile({ items }: { items: ReadonlyArray<ContentsItem> }) {
  return (
    <Accordion type="single" collapsible className="rounded-xl bg-[var(--muted)] px-4 lg:hidden">
      <AccordionItem value="contents" className="border-b-0">
        <AccordionTrigger className="min-h-11 items-center py-3 text-base font-semibold hover:no-underline">
          In this article
        </AccordionTrigger>
        <AccordionContent>
          <nav aria-label="In this article">
            <ol className="flex list-decimal flex-col gap-1 pl-5 text-base marker:text-[var(--foreground)]/50">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block py-1.5 text-[var(--foreground)]/80 no-underline hover:text-[var(--brand)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

/** The last section whose heading has scrolled past the top quarter of the screen. */
function useActiveSection(items: ReadonlyArray<ContentsItem>) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.25
      let current = items[0]?.id
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [items])

  return active
}
