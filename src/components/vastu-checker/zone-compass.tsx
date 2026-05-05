import type { Zone } from "./types"

const ZONE_GRID: { zone: Zone; label: string; element: string }[][] = [
  [
    { zone: "NW", label: "NW", element: "Air" },
    { zone: "N", label: "N", element: "Water" },
    { zone: "NE", label: "NE", element: "Water" },
  ],
  [
    { zone: "W", label: "W", element: "Air" },
    { zone: "CENTER", label: "CTR", element: "Space" },
    { zone: "E", label: "E", element: "Fire" },
  ],
  [
    { zone: "SW", label: "SW", element: "Earth" },
    { zone: "S", label: "S", element: "Fire" },
    { zone: "SE", label: "SE", element: "Fire" },
  ],
]

interface ZoneCompassProps {
  occupiedZones: Zone[]
  className?: string
}

export function ZoneCompass({ occupiedZones, className = "" }: ZoneCompassProps) {
  const occupied = new Set(occupiedZones)

  return (
    <div className={className}>
      <p className="text-sm font-medium text-[var(--foreground)] mb-2">
        Vastu Zone Map
      </p>
      <div
        className="grid grid-cols-3 w-[240px] border border-[var(--border)] rounded-lg overflow-hidden"
        role="img"
        aria-label="Vastu zone compass showing 9 directional zones"
      >
        {ZONE_GRID.flat().map((cell) => {
          const isOccupied = occupied.has(cell.zone)
          return (
            <div
              key={cell.zone}
              className={[
                "flex flex-col items-center justify-center py-3 px-1 border border-[var(--border)]",
                "transition-colors duration-200",
                isOccupied
                  ? "bg-[var(--accent-teal-light)]"
                  : "bg-[var(--card)]",
              ].join(" ")}
            >
              <span
                className="text-sm font-semibold leading-none"
                style={{ color: isOccupied ? "var(--accent-teal)" : "var(--foreground)" }}
              >
                {cell.label}
              </span>
              <span className="text-[10px] mt-1 text-[var(--muted-foreground)] leading-none">
                {cell.element}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
