/**
 * Lightweight inline SVG illustrations for each tool card.
 * Pure CSS / SVG — no external assets, no purple, Teal accents only.
 */

const VASTU_WEDGES = Array.from({ length: 8 }).map((_, i) => {
  const a = (i * 45 - 90 - 22.5) * (Math.PI / 180)
  const b = (i * 45 - 90 + 22.5) * (Math.PI / 180)
  const r = 68
  const x1 = (Math.cos(a) * r).toFixed(3)
  const y1 = (Math.sin(a) * r).toFixed(3)
  const x2 = (Math.cos(b) * r).toFixed(3)
  const y2 = (Math.sin(b) * r).toFixed(3)
  const filled = i === 3 || i === 5
  return {
    i,
    d: `M0 0 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`,
    filled,
  }
})

export function VastuVisual() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern id="vastu-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.8" fill="var(--border)" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#vastu-grid)" />
      <g transform="translate(160, 100)">
        <circle r="68" fill="none" stroke="var(--border)" strokeWidth="0.6" opacity="0.6" />
        <circle r="52" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
        {VASTU_WEDGES.map((w) => (
          <path
            key={w.i}
            d={w.d}
            fill={w.filled ? 'var(--accent-teal)' : 'transparent'}
            fillOpacity={w.filled ? 0.12 : 0}
            stroke="var(--border)"
            strokeWidth="0.5"
            opacity="0.85"
          />
        ))}
        <circle r="6" fill="var(--accent-teal)" />
        <line x1="0" y1="-72" x2="0" y2="72" stroke="var(--accent-teal)" strokeWidth="0.8" opacity="0.5" />
        <line x1="-72" y1="0" x2="72" y2="0" stroke="var(--accent-teal)" strokeWidth="0.8" opacity="0.5" />
        <text x="0" y="-78" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--accent-teal)">N</text>
      </g>
    </svg>
  )
}

export function FloorPlan3DVisual() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern id="fp-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="var(--border)" strokeWidth="0.4" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#fp-grid)" />
      {/* isometric room boxes */}
      <g transform="translate(160, 110)" fill="var(--card)" stroke="var(--accent-teal)" strokeWidth="1">
        {/* base footprint */}
        <path d="M -90 0 L 0 -45 L 90 0 L 0 45 Z" fill="var(--muted)" fillOpacity="0.4" />
        {/* room A: extruded */}
        <path d="M -70 -10 L -10 -40 L -10 -22 L -70 8 Z" fill="var(--accent-teal)" fillOpacity="0.18" />
        <path d="M -70 -10 L -70 8 L -70 -10 Z" />
        <path d="M -10 -40 L 30 -20 L 30 8 L -10 -22 Z" fill="var(--accent-teal)" fillOpacity="0.30" />
        <path d="M -70 -10 L -10 -40 L 30 -20 L -30 10 Z" fill="var(--card)" />
        {/* room B */}
        <path d="M 30 -20 L 70 0 L 70 22 L 30 8 Z" fill="var(--accent-teal)" fillOpacity="0.22" />
        <path d="M -30 10 L 30 8 L 70 22 L 10 38 Z" fill="var(--card)" stroke="var(--accent-teal)" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

export function RestyleVisual() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 size-full" aria-hidden="true">
      <rect width="320" height="200" fill="var(--muted)" opacity="0.3" />
      {/* split view divider */}
      <line x1="160" y1="0" x2="160" y2="200" stroke="var(--accent-teal)" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
      {/* left: muted rect = before */}
      <g opacity="0.55">
        <rect x="30" y="50" width="100" height="100" fill="var(--card)" stroke="var(--border)" />
        <rect x="42" y="115" width="50" height="25" fill="var(--muted)" />
        <rect x="100" y="125" width="20" height="20" fill="var(--muted)" />
        <line x1="30" y1="80" x2="130" y2="80" stroke="var(--border)" strokeWidth="0.5" />
      </g>
      {/* right: vivid teal = after */}
      <g>
        <rect x="190" y="50" width="100" height="100" fill="var(--card)" stroke="var(--accent-teal)" />
        <rect x="202" y="115" width="50" height="25" fill="var(--accent-teal)" fillOpacity="0.25" />
        <rect x="260" y="125" width="20" height="20" fill="var(--accent-teal)" fillOpacity="0.4" />
        <circle cx="270" cy="70" r="5" fill="var(--accent-teal)" />
        <line x1="190" y1="80" x2="290" y2="80" stroke="var(--accent-teal)" strokeWidth="0.6" opacity="0.7" />
      </g>
      {/* arrow */}
      <g transform="translate(160, 100)" stroke="var(--accent-teal)" fill="var(--accent-teal)">
        <circle r="11" fill="var(--background)" stroke="var(--accent-teal)" />
        <path d="M -3 -3 L 3 0 L -3 3 Z" />
      </g>
    </svg>
  )
}

export function StagerVisual() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 size-full" aria-hidden="true">
      <rect width="320" height="200" fill="var(--muted)" opacity="0.25" />
      {/* empty room outline */}
      <g transform="translate(160, 110)" fill="none" stroke="var(--accent-teal)" strokeWidth="1">
        <path d="M -100 -40 L 100 -40 L 100 50 L -100 50 Z" />
        <path d="M -100 -40 L -75 -55 L 75 -55 L 100 -40" opacity="0.5" />
        <path d="M -75 -55 L -75 35 L -100 50" opacity="0.5" />
        <path d="M 75 -55 L 75 35 L 100 50" opacity="0.5" />
        <line x1="-75" y1="35" x2="75" y2="35" opacity="0.5" />
      </g>
      {/* furniture appearing */}
      <g transform="translate(160, 110)">
        <rect x="-65" y="-5" width="50" height="30" fill="var(--accent-teal)" fillOpacity="0.3" stroke="var(--accent-teal)" />
        <rect x="-10" y="5" width="35" height="30" fill="var(--accent-teal)" fillOpacity="0.18" stroke="var(--accent-teal)" />
        <rect x="35" y="-15" width="25" height="40" fill="var(--accent-teal)" fillOpacity="0.25" stroke="var(--accent-teal)" />
        <circle cx="-40" cy="-25" r="7" fill="var(--accent-teal)" fillOpacity="0.4" />
      </g>
      {/* sparkles */}
      <g fill="var(--accent-teal)">
        <circle cx="80" cy="40" r="1.5" />
        <circle cx="240" cy="60" r="1.5" />
        <circle cx="100" cy="170" r="1.5" />
        <circle cx="220" cy="160" r="1.5" />
      </g>
    </svg>
  )
}
