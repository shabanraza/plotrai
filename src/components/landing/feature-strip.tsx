import { Link } from '@tanstack/react-router'
import { Calculator, Compass, Hammer, Heart, type LucideIcon } from 'lucide-react'

interface FeatureItem {
  to?: string
  icon: LucideIcon
  label: string
  /** Tailwind color tokens for the icon circle (light bg + icon color). */
  bgClass: string
  iconClass: string
}

/**
 * Reuses the project's existing element colour tokens (sky/sage/peach/teal) so the
 * pastels are on-brand. No purple, no gradients — single-tone fills only.
 */
const ITEMS: ReadonlyArray<FeatureItem> = [
  {
    to: '/construction-cost-calculator',
    icon: Hammer,
    label: 'Construction\nGuide',
    bgClass:
      'bg-[var(--element-water-bg-occupied)] text-[var(--element-water-text)]',
    iconClass: 'text-[var(--element-water-border)]',
  },
  {
    to: '/vastu-checker',
    icon: Compass,
    label: 'Vastu\nGuide',
    bgClass: 'bg-[var(--element-air-bg-occupied)] text-[var(--element-air-text)]',
    iconClass: 'text-[var(--element-air-border)]',
  },
  {
    to: '/material-calculator',
    icon: Calculator,
    label: 'Material\nCalculator',
    bgClass: 'bg-[var(--element-fire-bg-occupied)] text-[var(--element-fire-text)]',
    iconClass: 'text-[var(--element-fire-border)]',
  },
  {
    icon: Heart,
    label: '100% Free\nfor India',
    bgClass: 'bg-[var(--accent-teal-light)]',
    iconClass: 'text-[var(--accent-teal)]',
  },
]

export function FeatureStrip() {
  return (
    <section className="border-y border-[var(--border)] py-12 sm:py-16">
      {/* Headline with side rules */}
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <span className="h-px flex-1 bg-[var(--accent-teal)]/40" aria-hidden />
        <h2 className="text-balance text-center text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl md:text-2xl">
          Design better. Build smarter.{' '}
          <span className="text-[var(--accent-teal)]">Live auspicious.</span>
        </h2>
        <span className="h-px flex-1 bg-[var(--accent-teal)]/40" aria-hidden />
      </div>

      {/* Feature row */}
      <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-y-8 px-4 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-[var(--border)] sm:px-6">
        {ITEMS.map((item) => (
          <FeaturePill key={item.label} item={item} />
        ))}
      </ul>
    </section>
  )
}

function FeaturePill({ item }: { item: FeatureItem }) {
  const Icon = item.icon
  const inner = (
    <div className="flex flex-col items-center justify-center gap-2 px-2 text-center sm:flex-row sm:gap-3 sm:px-4 sm:text-left">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14 ${item.bgClass}`}
      >
        <Icon className={`size-5 sm:size-6 ${item.iconClass}`} />
      </span>
      <span className="whitespace-pre-line text-[11px] font-bold uppercase leading-tight tracking-[0.06em] text-[var(--foreground)] sm:text-sm">
        {item.label}
      </span>
    </div>
  )

  if (item.to) {
    return (
      <li>
        <Link
          to={item.to}
          className="block no-underline transition-opacity hover:opacity-80"
        >
          {inner}
        </Link>
      </li>
    )
  }

  return <li>{inner}</li>
}
