import {
  BRAND,
  BRAND_LINE,
  FILL_LINE,
  IllustrationFrame,
  LINE,
  PAGE,
} from './frame'

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
  const r = (a * Math.PI) / 180
  const p = (d: number) =>
    `${(196 + Math.cos(r) * d).toFixed(1)} ${(38 + Math.sin(r) * d).toFixed(1)}`
  return { a, d: `M${p(22)}L${p(30)}` }
})

/** Solar calculator: panels on a sloped roof under the sun. */
export function SolarIllustration() {
  return (
    <IllustrationFrame>
      <circle cx="196" cy="38" r="16" className={BRAND} />
      {RAYS.map((ray) => (
        <path key={ray.a} d={ray.d} className={BRAND_LINE} />
      ))}
      <path d="M12 162H228" className={LINE} />
      <rect x="40" y="110" width="140" height="52" className={FILL_LINE} />
      <path d="M28 112L110 60L192 112Z" className={FILL_LINE} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${52 + i * 18} ${104 - i * 11.5}l16 -10l10 16l-16 10z`}
          className="fill-[var(--foreground)]/80 stroke-[var(--background)]"
          strokeWidth={1.5}
        />
      ))}
      <rect x="98" y="128" width="22" height="34" className={PAGE} />
    </IllustrationFrame>
  )
}
