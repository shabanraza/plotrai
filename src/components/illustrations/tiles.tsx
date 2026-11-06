import { BRAND, FILL, IllustrationFrame, LINE } from './frame'

const ROWS = [40, 70, 104, 142, 170]
const COLS = [0, 0.25, 0.5, 0.75, 1]

/** x on the floor's perspective trapezoid for column fraction t at height y. */
function xAt(t: number, y: number) {
  const k = (y - 40) / 130
  const l = 70 - 60 * k
  const r = 170 + 60 * k
  return l + (r - l) * t
}

/** Tiles calculator: a floor of square tiles in perspective, one highlighted. */
export function TilesIllustration() {
  return (
    <IllustrationFrame>
      <path d="M70 40H170L230 170H10Z" className={FILL} />
      <path
        d={`M${xAt(0.5, 104)} 104H${xAt(0.75, 104)}L${xAt(0.75, 142)} 142H${xAt(0.5, 142)}Z`}
        className={BRAND}
      />
      {ROWS.map((y) => (
        <path key={y} d={`M${xAt(0, y)} ${y}H${xAt(1, y)}`} className={LINE} />
      ))}
      {COLS.map((t) => (
        <path
          key={t}
          d={`M${xAt(t, 40)} 40L${xAt(t, 170)} 170`}
          className={LINE}
        />
      ))}
    </IllustrationFrame>
  )
}
