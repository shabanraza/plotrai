import { cn } from '#/lib/utils'

interface LogoProps {
  className?: string
  /** When true, only render the icon mark (no wordmark). */
  iconOnly?: boolean
}

/**
 * Plotr Ai brand logo.
 *
 * Uses `currentColor` for the navy/foreground parts so the logo adapts to
 * light/dark mode automatically. Orange "Ai" and green leaves are fixed
 * brand colours that read well on both backgrounds.
 */
export function Logo({ className, iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('text-[#15265F] dark:text-[#dbe2f5]', className)}
        role="img"
        aria-label="Plotr Ai"
      >
        <IconMark />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 320 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[#15265F] dark:text-[#dbe2f5]', className)}
      role="img"
      aria-label="Plotr Ai"
    >
      <g transform="translate(0 0)">
        <IconMark />
      </g>
      {/* Vertical separator between mark and wordmark */}
      <line
        x1="74"
        y1="14"
        x2="74"
        y2="50"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Wordmark — Plotr (currentColor) + Ai (brand orange) */}
      <text
        x="86"
        y="46"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="36"
        letterSpacing="-1.5"
        fill="currentColor"
      >
        Plotr
      </text>
      <text
        x="178"
        y="46"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="36"
        letterSpacing="-1.5"
        fill="var(--accent-teal)"
      >
        Ai
      </text>
    </svg>
  )
}

/** Reusable house + compass + leaf icon mark, drawn into a 64×64 box. */
function IconMark() {
  return (
    <>
      {/* Drafting compass */}
      <g
        stroke="currentColor"
        fill="none"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <circle cx="13" cy="14" r="2" fill="currentColor" />
        <line x1="13" y1="14" x2="9" y2="48" />
        <line x1="13" y1="14" x2="17" y2="44" />
        {/* House */}
        <path d="M 18 38 L 36 18 L 54 38 L 54 52 L 18 52 Z" />
        <rect x="29" y="30" width="6" height="6" strokeWidth="1.6" />
        <rect x="40" y="42" width="5" height="10" strokeWidth="1.6" />
        {/* Ground line */}
        <line x1="6" y1="55" x2="58" y2="55" strokeWidth="2" />
      </g>
      {/* Leaves — fixed brand greens */}
      <path d="M 54 44 Q 60 38 66 42 Q 62 50 54 44 Z" fill="#7CB342" />
      <path d="M 56 50 Q 62 44 68 48 Q 64 55 56 50 Z" fill="#9CCC65" />
    </>
  )
}
