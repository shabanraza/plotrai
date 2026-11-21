import { BRAND, BRAND_LINE, FILL, IllustrationFrame, LINE, PAGE } from './frame'

/** Paint calculator: a roller halfway across a wall. */
export function PaintIllustration() {
  return (
    <IllustrationFrame>
      <rect x="20" y="20" width="200" height="140" rx="4" className={FILL} />
      <rect
        x="20"
        y="20"
        width="96"
        height="140"
        rx="4"
        className={BRAND}
        opacity={0.85}
      />
      <rect x="20" y="20" width="200" height="140" rx="4" className={LINE} />
      <path
        d="M116 30v120"
        className={BRAND_LINE}
        strokeWidth={3}
        strokeDasharray="2 6"
      />
      <rect x="104" y="44" width="28" height="64" rx="6" className={PAGE} />
      <rect x="104" y="44" width="10" height="64" rx="5" className={BRAND} />
      <path d="M132 76h22v40h-14v30" className={LINE} strokeWidth={3} />
      <rect x="134" y="146" width="12" height="26" rx="4" className={PAGE} />
    </IllustrationFrame>
  )
}
