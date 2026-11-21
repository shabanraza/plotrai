import { BRAND_LINE, FILL_LINE, IllustrationFrame, LINE } from './frame'

/** Point on the slab's top face: u runs along the length, v into the depth. */
function at(u: number, v: number) {
  return [30 + 140 * u + 40 * v, 70 - 30 * v] as const
}
const BARS = [0.15, 0.32, 0.5, 0.68, 0.85]

/** RCC slab calculator: a slab on two columns with its rebar mesh showing on top. */
export function RccSlabIllustration() {
  return (
    <IllustrationFrame>
      <path d="M12 162H228" className={LINE} />
      <rect x="44" y="92" width="18" height="70" className={FILL_LINE} />
      <rect x="150" y="92" width="18" height="70" className={FILL_LINE} />
      <path d="M30 70V92H170L210 62V40L170 70Z" className={FILL_LINE} />
      <path d="M30 70L70 40H210L170 70Z" className={FILL_LINE} />
      {BARS.map((t) => {
        const [x1, y1] = at(t, 0.1)
        const [x2, y2] = at(t, 0.9)
        const [a1, b1] = at(0.06, t)
        const [a2, b2] = at(0.94, t)
        return (
          <g key={t}>
            <path d={`M${x1} ${y1}L${x2} ${y2}`} className={BRAND_LINE} />
            <path d={`M${a1} ${b1}L${a2} ${b2}`} className={BRAND_LINE} />
          </g>
        )
      })}
    </IllustrationFrame>
  )
}
