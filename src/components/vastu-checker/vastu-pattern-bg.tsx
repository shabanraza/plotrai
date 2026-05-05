export function DotGridBg() {
  return (
    <svg
      className="absolute inset-0 pointer-events-none no-print w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="1.5" fill="var(--border)" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  )
}

export function CompassWatermark() {
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const cardinalLen = 110
  const ordinalLen = 80
  const arrowSize = 8

  const directions = [
    { angle: -90, len: cardinalLen, cardinal: true },   // N
    { angle: -45, len: ordinalLen, cardinal: false },    // NE
    { angle: 0, len: cardinalLen, cardinal: true },      // E
    { angle: 45, len: ordinalLen, cardinal: false },     // SE
    { angle: 90, len: cardinalLen, cardinal: true },     // S
    { angle: 135, len: ordinalLen, cardinal: false },    // SW
    { angle: 180, len: cardinalLen, cardinal: true },    // W
    { angle: 225, len: ordinalLen, cardinal: false },    // NW
  ]

  const toRad = (deg: number) => (deg * Math.PI) / 180

  return (
    <svg
      className="absolute -top-20 -right-20 pointer-events-none no-print"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ animation: "slow-spin 120s linear infinite" }}
    >
      <style>{`@keyframes slow-spin { from { transform: rotate(0deg); transform-origin: center; } to { transform: rotate(360deg); transform-origin: center; } }`}</style>
      <g opacity="0.04" stroke="var(--accent-teal)" fill="var(--accent-teal)">
        {directions.map((d, i) => {
          const rad = toRad(d.angle)
          const ex = cx + Math.cos(rad) * d.len
          const ey = cy + Math.sin(rad) * d.len

          return (
            <g key={i}>
              <line
                x1={cx}
                y1={cy}
                x2={ex}
                y2={ey}
                strokeWidth={d.cardinal ? 2 : 1}
              />
              {d.cardinal && (
                <polygon
                  points={(() => {
                    const tipX = ex
                    const tipY = ey
                    const perpRad = toRad(d.angle + 90)
                    const backRad = toRad(d.angle + 180)
                    const bx = tipX + Math.cos(backRad) * arrowSize
                    const by = tipY + Math.sin(backRad) * arrowSize
                    const lx = bx + Math.cos(perpRad) * (arrowSize / 2)
                    const ly = by + Math.sin(perpRad) * (arrowSize / 2)
                    const rx = bx - Math.cos(perpRad) * (arrowSize / 2)
                    const ry = by - Math.sin(perpRad) * (arrowSize / 2)
                    return `${tipX},${tipY} ${lx},${ly} ${rx},${ry}`
                  })()}
                />
              )}
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={3} />
      </g>
    </svg>
  )
}
