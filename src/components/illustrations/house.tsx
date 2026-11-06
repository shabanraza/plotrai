import {
  BRAND,
  BRAND_LINE,
  FILL_LINE,
  IllustrationFrame,
  LINE,
  PAGE,
} from './frame'

/** Material and construction cost calculators: a two-storey house going up, with scaffolding. */
export function HouseIllustration() {
  return (
    <IllustrationFrame>
      <path d="M12 162H228" className={LINE} />
      <rect x="40" y="102" width="120" height="60" className={FILL_LINE} />
      <rect x="58" y="118" width="22" height="20" className={PAGE} />
      <rect x="112" y="122" width="24" height="40" className={BRAND} />
      <rect x="34" y="94" width="132" height="8" className={FILL_LINE} />
      {[40, 98, 152].map((x) => (
        <rect
          key={x}
          x={x}
          y="44"
          width="8"
          height="50"
          className={FILL_LINE}
        />
      ))}
      <path d="M44 44V30M102 44V30M156 44V30" className={BRAND_LINE} />
      <path
        d="M176 162V40M206 162V40M176 70h30M176 100h30M176 130h30M176 70l30 30M206 100l-30 30"
        className={LINE}
      />
      <path d="M120 14h96M200 14v26" className={LINE} />
      <rect x="192" y="40" width="16" height="10" className={BRAND} />
    </IllustrationFrame>
  )
}
