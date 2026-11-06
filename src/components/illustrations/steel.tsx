import { BRAND_LINE, IllustrationFrame, LINE } from './frame'

const BARS = [44, 70, 96, 122, 148]
const RIBS = Array.from({ length: 16 }, (_, k) => 32 + k * 12)

/** Steel calculator: a bundle of ribbed TMT bars, one in blue, tied at two points. */
export function SteelIllustration() {
  return (
    <IllustrationFrame>
      {BARS.map((y, i) => {
        const accent = i === 2
        return (
          <g key={y}>
            <path
              d={`M24 ${y}H216`}
              className={accent ? BRAND_LINE : LINE}
              strokeWidth={12}
            />
            {RIBS.map((x) => (
              <path
                key={x}
                d={`M${x} ${y - 6}l5 12`}
                className="fill-none stroke-[var(--background)]"
                strokeWidth={1.5}
              />
            ))}
          </g>
        )
      })}
      <path d="M60 32v128M180 32v128" className={LINE} strokeWidth={3} />
    </IllustrationFrame>
  )
}
