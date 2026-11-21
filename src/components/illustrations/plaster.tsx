import { BRAND, FILL, IllustrationFrame, LINE, PAGE } from './frame'

const COURSES = [0, 1, 2, 3, 4, 5]
const JOINTS = COURSES.flatMap((r) =>
  [0, 1, 2, 3, 4]
    .map((c) => ({ r, x: 20 + c * 48 + (r % 2 ? 24 : 0) }))
    .filter((j) => j.x > 20 && j.x < 220),
)

/** Plaster calculator: a trowel spreading a smooth coat over a brick wall. */
export function PlasterIllustration() {
  return (
    <IllustrationFrame>
      <rect x="20" y="20" width="200" height="140" rx="4" className={FILL} />
      {COURSES.slice(1).map((r) => (
        <path key={r} d={`M20 ${20 + r * 22}H220`} className={LINE} />
      ))}
      {JOINTS.map((j) => (
        <path
          key={`${j.r}-${j.x}`}
          d={`M${j.x} ${20 + j.r * 22}v22`}
          className={LINE}
        />
      ))}
      <path d="M20 20H120C126 60 112 110 124 160H20Z" className={PAGE} />
      <rect x="20" y="20" width="200" height="140" rx="4" className={LINE} />
      <path d="M112 70l52 -8 4 44 -52 8z" className={BRAND} />
      <path d="M142 86l24 -18" className={LINE} strokeWidth={3} />
      <path d="M166 68l18 -14" className={LINE} strokeWidth={8} />
    </IllustrationFrame>
  )
}
