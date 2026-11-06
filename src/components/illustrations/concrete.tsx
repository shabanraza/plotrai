import { BRAND, FILL, FILL_LINE, IllustrationFrame, LINE, PAGE } from './frame'

const STONES = [
  [150, 142],
  [166, 134],
  [182, 142],
  [198, 150],
  [174, 152],
  [158, 156],
  [190, 158],
  [206, 160],
  [174, 122],
  [142, 158],
]
const GRAINS = [
  [60, 120],
  [84, 104],
  [96, 132],
  [72, 146],
  [110, 146],
]

/** Concrete and mix calculators: a heap of sand, a heap of aggregate and a cement bag. */
export function ConcreteIllustration() {
  return (
    <IllustrationFrame>
      <path d="M12 162H228" className={LINE} />
      <path
        d="M20 162C40 100 70 84 82 84S120 110 136 162Z"
        className={FILL_LINE}
      />
      {GRAINS.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={1.6}
          className="fill-[var(--foreground)]/40"
        />
      ))}
      <path
        d="M130 162C144 124 160 108 174 108S206 128 222 162Z"
        className={FILL}
      />
      {STONES.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x - 6} ${y}l4 -6h7l3 6 -4 5h-7z`}
          className={PAGE}
        />
      ))}
      {/* cement bag */}
      <path
        d="M94 40Q118 30 142 40L146 72Q118 80 90 72Z"
        className={BRAND}
      />
      <path
        d="M98 42l-2 -8M138 42l2 -8"
        className="stroke-[var(--brand)]"
        strokeWidth={3}
      />
      <path
        d="M104 56h28M108 63h20"
        className="stroke-[var(--background)]"
        strokeWidth={2.5}
      />
    </IllustrationFrame>
  )
}
