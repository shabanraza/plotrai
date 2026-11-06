import { BRAND, FILL_LINE, IllustrationFrame } from './frame'

interface Brick {
  x: number
  y: number
  w: number
  accent: boolean
}

/** Six courses in running bond, clipped to the wall edges. */
const BRICKS: Brick[] = Array.from({ length: 6 }, (_, r) => {
  const y = 30 + r * 22
  const offset = r % 2 === 0 ? 0 : -24
  return Array.from({ length: 6 }, (_, c) => {
    const x0 = 20 + offset + c * 48
    const x = Math.max(20, x0)
    const w = Math.min(220, x0 + 44) - x
    return { x, y, w, accent: r === 2 && c === 3 }
  }).filter((b) => b.w > 4)
}).flat()

/** Brick calculator: a wall in running bond, one brick picked out in blue. */
export function BrickIllustration() {
  return (
    <IllustrationFrame>
      {BRICKS.map((b) => (
        <rect
          key={`${b.x}-${b.y}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={18}
          rx={2}
          className={b.accent ? BRAND : FILL_LINE}
        />
      ))}
    </IllustrationFrame>
  )
}
