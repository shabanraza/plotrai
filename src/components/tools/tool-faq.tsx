import { ChevronDown } from 'lucide-react'
import { ToolSection } from './tool-section'
import type { FaqItem } from '#/lib/seo'

interface ToolFaqProps {
  number?: string
  items: ReadonlyArray<FaqItem>
}

export function ToolFaq({ number = 'FAQ', items }: ToolFaqProps) {
  return (
    <ToolSection
      number={number}
      label="Common questions"
      description="Aam sawaal jo log is tool ke baare mein puchhte hain."
    >
      <dl className="flex flex-col">
        {items.map((item, i) => (
          <details
            key={item.q}
            className="group border-b border-[var(--border)] py-4 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
              <dt className="text-base font-semibold text-[var(--foreground)]">{item.q}</dt>
              <ChevronDown className="size-4 shrink-0 text-[var(--muted-foreground)] transition-transform group-open:rotate-180" />
            </summary>
            <dd className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {item.a}
            </dd>
          </details>
        ))}
      </dl>
    </ToolSection>
  )
}
