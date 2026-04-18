export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
export type Zone = Direction | "CENTER"

export type RoomType =
  | "master_bedroom"
  | "bedroom"
  | "kids_bedroom"
  | "guest_bedroom"
  | "kitchen"
  | "dining"
  | "living"
  | "drawing"
  | "puja"
  | "study"
  | "store"
  | "toilet"
  | "bathroom"
  | "parking"
  | "servant_quarter"
  | "balcony"
  | "staircase"
  | "entrance"

export type PlotShape = "rectangle" | "square" | "L" | "corner"
export type Unit = "ft" | "m"
export type VastuSchool = "classical"

export interface PlotInput {
  length: number
  width: number
  unit: Unit
  facing: Direction
  shape: PlotShape
  floors: 1 | 2 | 3
  setbacks: { front: number; back: number; left: number; right: number }
}

export interface RoomInput {
  id: string
  type: RoomType
  sqft: number
  zone: Zone
  isMainEntrance?: boolean
}

export interface LayoutInput {
  plot: PlotInput
  rooms: RoomInput[]
  school: VastuSchool
}

export interface ZoneConfig {
  zone: Zone
  element: "water" | "fire" | "earth" | "air" | "space"
  deity: string
  idealRooms: RoomType[]
  acceptableRooms: RoomType[]
  forbiddenRooms: RoomType[]
}

export interface ZonedRoom {
  room: RoomInput
  zoneConfig: ZoneConfig
  isIdeal: boolean
  isAcceptable: boolean
  isForbidden: boolean
}

export type Severity = "CRITICAL" | "HIGH" | "SOFT"

export interface VastuRule {
  id: string
  name: string
  description: string
  severity: Severity
  weight: number
  category: "placement" | "entrance" | "structural" | "element"
  evaluate: (
    layout: LayoutInput,
    zonedRooms: ZonedRoom[],
    zoneMap: ZoneConfig[],
  ) => Violation | null
}

export interface Violation {
  ruleId: string
  severity: Severity
  roomId: string
  zone: Zone
  idealZones: Zone[]
  pointsDeducted: number
  message: string
}

export interface ScoreResult {
  overall: number
  grade: "excellent" | "good" | "needs_work" | "critical"
  perRoom: Record<string, { score: number; violations: Violation[] }>
  perCategory: Record<string, number>
}

export type RemedyCost = "free" | "low" | "structural"

export interface Remedy {
  violationId: string
  cost: RemedyCost
  estimatedPrice: string
  description: string
  impact: number
}

export interface VastuReport {
  score: ScoreResult
  violations: Violation[]
  remedies: Remedy[]
  summary: {
    criticalCount: number
    highCount: number
    softCount: number
    topRemedies: Remedy[]
  }
}
