import type { Direction, Zone, RoomType } from "#/vastu/index"
import type { PlotShape } from "#/vastu/types"

export type { Direction, Zone, RoomType, PlotShape }

export interface PlotDetails {
  length: number
  width: number
  unit: "ft" | "m"
  facing: Direction
  shape: PlotShape
  floors: 1 | 2 | 3
}

export interface RoomPlacement {
  id: string
  type: RoomType
  zone: Zone
  isMainEntrance: boolean
}
