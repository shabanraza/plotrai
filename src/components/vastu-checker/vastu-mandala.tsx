import { useMemo } from "react"
import { ZONE_CONFIGS } from "#/vastu/data/zone-configs"
import type { Zone, Direction, RoomPlacement } from "#/components/vastu-checker/types"

interface VastuMandalaProps {
  rooms: RoomPlacement[]
  facing: Direction
  className?: string
}

/* ── Direction angles ── */
const DIR_ANGLES: Record<Direction, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
}

/* ── Grid positions for 3x3 (col, row) ── */
const GRID_POS: Record<Zone, [number, number]> = {
  NW: [0, 0],
  N: [1, 0],
  NE: [2, 0],
  W: [0, 1],
  CENTER: [1, 1],
  E: [2, 1],
  SW: [0, 2],
  S: [1, 2],
  SE: [2, 2],
}

/* ── Directional label positions on the outer circle ── */
const LABEL_POS: Record<Direction, { x: number; y: number }> = {
  N: { x: 180, y: 22 },
  NE: { x: 297, y: 63 },
  E: { x: 338, y: 184 },
  SE: { x: 297, y: 305 },
  S: { x: 180, y: 346 },
  SW: { x: 63, y: 305 },
  W: { x: 22, y: 184 },
  NW: { x: 63, y: 63 },
}

/* ── Zone → element lookup (for directional label coloring) ── */
const DIR_TO_ELEMENT: Record<Direction, string> = {
  N: "water",
  NE: "water",
  E: "fire",
  SE: "fire",
  S: "earth",
  SW: "earth",
  W: "air",
  NW: "air",
}

/* ── Room short-name map ── */
const ROOM_SHORT_NAMES: Record<string, string> = {
  master_bedroom: "Mstr Bed",
  bedroom: "Bedroom",
  kids_bedroom: "Kids Bed",
  guest_bedroom: "Guest Bed",
  kitchen: "Kitchen",
  dining: "Dining",
  living: "Living",
  drawing: "Drawing",
  puja: "Puja",
  study: "Study",
  store: "Store",
  toilet: "Toilet",
  bathroom: "Bath",
  parking: "Parking",
  servant_quarter: "Servant",
  balcony: "Balcony",
  staircase: "Stairs",
  entrance: "Entrance",
}

/* ── Element icon components ── */

function WaterIcon({ color, occupied }: { color: string; occupied: boolean }) {
  return (
    <g
      style={{
        animation: occupied ? "ripple 3s ease-in-out infinite" : undefined,
        transformOrigin: "center",
      }}
    >
      <path
        d="M6,10 C10,6 14,14 18,10 C22,6 26,14 30,10"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6,18 C10,14 14,22 18,18 C22,14 26,22 30,18"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6,26 C10,22 14,30 18,26 C22,22 26,30 30,26"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  )
}

function FireIcon({ color, occupied }: { color: string; occupied: boolean }) {
  const innerColor = occupied ? "#fbbf24" : color
  return (
    <g
      style={{
        animation: occupied ? "flicker 2s ease-in-out infinite" : undefined,
      }}
    >
      <path
        d="M18,4 C18,4 10,16 10,22 C10,27 14,30 18,30 C22,30 26,27 26,22 C26,16 18,4 18,4Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M18,14 C18,14 14,20 14,24 C14,26.5 16,28 18,28 C20,28 22,26.5 22,24 C22,20 18,14 18,14Z"
        fill={innerColor}
        opacity="0.7"
      />
    </g>
  )
}

function EarthIcon({ color }: { color: string; occupied: boolean }) {
  return (
    <g>
      <polygon points="4,30 14,10 24,30" fill={color} opacity={0.4} />
      <polygon points="12,30 22,8 32,30" fill={color} opacity={0.75} />
      <polygon points="18,30 26,12 34,30" fill={color} opacity={0.3} />
    </g>
  )
}

function AirIcon({ color, occupied }: { color: string; occupied: boolean }) {
  return (
    <g
      style={{
        animation: occupied ? "sway 4s ease-in-out infinite" : undefined,
        transformOrigin: "center",
      }}
    >
      <path
        d="M6,10 C12,6 20,14 30,10"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M4,18 C10,14 22,22 32,18"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M8,26 C14,22 24,30 34,26"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>
  )
}

function SpaceIcon({ color, occupied }: { color: string; occupied: boolean }) {
  return (
    <g>
      <circle cx="18" cy="18" r="4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="18" cy="18" r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.25"
        style={{
          animation: occupied ? "flicker 4s ease-in-out infinite" : undefined,
        }}
      />
    </g>
  )
}

function ElementIcon({
  element,
  occupied,
}: {
  element: string
  occupied: boolean
}) {
  const color = occupied
    ? `var(--element-${element}-text)`
    : "var(--muted-foreground)"

  switch (element) {
    case "water":
      return <WaterIcon color={color} occupied={occupied} />
    case "fire":
      return <FireIcon color={color} occupied={occupied} />
    case "earth":
      return <EarthIcon color={color} occupied={occupied} />
    case "air":
      return <AirIcon color={color} occupied={occupied} />
    case "space":
      return <SpaceIcon color={color} occupied={occupied} />
    default:
      return null
  }
}

/* ── Main component ── */

export function VastuMandala({
  rooms,
  facing,
  className,
}: VastuMandalaProps) {
  /* Derive roomsByZone map */
  const roomsByZone = useMemo(() => {
    const map = new Map<Zone, RoomPlacement[]>()
    for (const room of rooms) {
      const existing = map.get(room.zone) ?? []
      map.set(room.zone, [...existing, room])
    }
    return map
  }, [rooms])

  /* Grid origin: center the 3x3 within the circle */
  const cellSize = 90
  const gap = 6
  const gridWidth = cellSize * 3 + gap * 2
  const gridOrigin = (360 - gridWidth) / 2

  /* Compass needle angle */
  const needleAngle = DIR_ANGLES[facing]

  return (
    <div className={`mx-auto ${className ?? ""}`} style={{ maxWidth: className?.includes("max-w-") ? undefined : 360 }}>
      <svg
        viewBox="0 0 360 360"
        width="100%"
        height="100%"
        role="img"
        aria-label="Vastu Mandala zone map"
      >
        {/* ── Outer decorative circle ── */}
        <circle
          cx="180"
          cy="180"
          r="165"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
        />

        {/* ── Directional labels ── */}
        {(Object.keys(LABEL_POS) as Direction[]).map((dir) => {
          const pos = LABEL_POS[dir]
          const element = DIR_TO_ELEMENT[dir]
          const roomsInDir = roomsByZone.get(dir as Zone) ?? []
          const occupied = roomsInDir.length > 0
          return (
            <text
              key={dir}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fontWeight="600"
              fill={
                occupied
                  ? `var(--element-${element}-text)`
                  : "var(--muted-foreground)"
              }
            >
              {dir}
            </text>
          )
        })}

        {/* ── 3x3 Zone grid ── */}
        {ZONE_CONFIGS.map((cfg) => {
          const [col, row] = GRID_POS[cfg.zone]
          const x = gridOrigin + col * (cellSize + gap)
          const y = gridOrigin + row * (cellSize + gap)

          const roomsInZone = roomsByZone.get(cfg.zone) ?? []
          const occupied = roomsInZone.length > 0
          const conflict = roomsInZone.length > 1
          const primaryRoom = roomsInZone[0] ?? null

          const elemBg = occupied
            ? `var(--element-${cfg.element}-bg-occupied)`
            : `var(--element-${cfg.element}-bg)`
          const elemBorder = occupied
            ? `var(--element-${cfg.element}-border)`
            : "var(--border)"
          const elemText = `var(--element-${cfg.element}-text)`

          const roomLabel = primaryRoom
            ? ROOM_SHORT_NAMES[primaryRoom.type] ?? primaryRoom.type
            : null
          const conflictSuffix =
            conflict
              ? roomsInZone.length === 2
                ? " +1"
                : ` +${roomsInZone.length - 1}`
              : ""

          return (
            <g key={cfg.zone} data-deity={cfg.deity}>
              <title>{`${cfg.zone} — ${cfg.deity} (${cfg.element})${primaryRoom ? ` — ${roomLabel}` : ""}`}</title>

              {/* Cell background */}
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx="8"
                fill={elemBg}
                stroke={elemBorder}
                strokeWidth={occupied ? 2 : 1}
                strokeDasharray={conflict ? "4 3" : undefined}
                style={{
                  animation: occupied
                    ? "zone-pulse 2s ease-in-out 1"
                    : undefined,
                  transformOrigin: `${x + cellSize / 2}px ${y + cellSize / 2}px`,
                }}
              />

              {/* Element icon (36×36) centered in upper portion of cell */}
              <g
                transform={`translate(${x + (cellSize - 36) / 2}, ${y + 14})`}
                opacity={occupied ? 1 : 0.35}
              >
                <ElementIcon element={cfg.element} occupied={occupied} />
              </g>

              {/* Room name label (when occupied) */}
              {occupied && roomLabel && (
                <text
                  x={x + cellSize / 2}
                  y={y + 63}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight="600"
                  fill={elemText}
                >
                  {roomLabel}{conflictSuffix}
                </text>
              )}

              {/* Zone abbreviation */}
              <text
                x={x + cellSize / 2}
                y={y + 77}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fontWeight="500"
                fill={occupied ? elemText : "var(--muted-foreground)"}
                opacity={0.75}
              >
                {cfg.zone}
              </text>

              {/* Conflict warning badge */}
              {conflict && (
                <g>
                  <rect
                    x={x + 72}
                    y={y + 4}
                    width={14}
                    height={14}
                    rx={3}
                    fill="#d97706"
                  />
                  <text
                    x={x + 79}
                    y={y + 13}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="700"
                    fill="white"
                  >
                    !
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* ── Compass needle ── */}
        <g
          style={{
            transform: `rotate(${needleAngle}deg)`,
            transformOrigin: "180px 180px",
          }}
        >
          {/* N half — teal, long */}
          <polygon
            points="180,42 172,180 188,180"
            fill="var(--accent-teal)"
            opacity="0.95"
          />
          {/* S half — muted tail */}
          <polygon
            points="180,292 172,180 188,180"
            fill="var(--muted-foreground)"
            opacity="0.25"
          />
          {/* Center pivot ring */}
          <circle cx="180" cy="180" r="11" fill="var(--background)" stroke="var(--accent-teal)" strokeWidth="2.5"/>
          <circle cx="180" cy="180" r="5" fill="var(--accent-teal)"/>
        </g>
      </svg>
    </div>
  )
}
