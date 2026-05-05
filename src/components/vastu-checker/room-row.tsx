import { X } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Checkbox } from "#/components/ui/checkbox"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { ZONE_CONFIGS } from "#/vastu/data/zone-configs"
import type { RoomPlacement, RoomType, Zone } from "./types"

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "master_bedroom", label: "Master Bedroom" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kids_bedroom", label: "Kids Bedroom" },
  { value: "guest_bedroom", label: "Guest Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "dining", label: "Dining" },
  { value: "living", label: "Living" },
  { value: "drawing", label: "Drawing" },
  { value: "puja", label: "Puja" },
  { value: "study", label: "Study" },
  { value: "store", label: "Store" },
  { value: "toilet", label: "Toilet" },
  { value: "bathroom", label: "Bathroom" },
  { value: "parking", label: "Parking" },
  { value: "servant_quarter", label: "Servant Quarter" },
  { value: "balcony", label: "Balcony" },
  { value: "staircase", label: "Staircase" },
  { value: "entrance", label: "Entrance" },
]

const ZONES: { value: Zone; label: string }[] = [
  { value: "N", label: "North (N)" },
  { value: "NE", label: "North-East (NE)" },
  { value: "E", label: "East (E)" },
  { value: "SE", label: "South-East (SE)" },
  { value: "S", label: "South (S)" },
  { value: "SW", label: "South-West (SW)" },
  { value: "W", label: "West (W)" },
  { value: "NW", label: "North-West (NW)" },
  { value: "CENTER", label: "Center" },
]

function getZoneIndicator(roomType: RoomType, zone: Zone): "ideal" | "forbidden" | null {
  const config = ZONE_CONFIGS.find((c) => c.zone === zone)
  if (!config) return null
  if (config.idealRooms.includes(roomType)) return "ideal"
  if (config.forbiddenRooms.includes(roomType)) return "forbidden"
  return null
}

interface RoomRowProps {
  room: RoomPlacement
  index: number
  onChange: (room: RoomPlacement) => void
  onRemove: () => void
}

export function RoomRow({ room, index, onChange, onRemove }: RoomRowProps) {
  function update<K extends keyof RoomPlacement>(key: K, val: RoomPlacement[K]) {
    onChange({ ...room, [key]: val })
  }

  return (
    <div className="flex items-end gap-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Label htmlFor={`room-type-${index}`}>Room Type</Label>
        <Select
          value={room.type}
          onValueChange={(v) => update("type", v as RoomType)}
        >
          <SelectTrigger id={`room-type-${index}`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPES.map((rt) => (
              <SelectItem key={rt.value} value={rt.value}>
                {rt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <Label htmlFor={`room-zone-${index}`}>Zone</Label>
        <Select
          value={room.zone}
          onValueChange={(v) => update("zone", v as Zone)}
        >
          <SelectTrigger id={`room-zone-${index}`} className="w-full">
            <SelectValue>
              {ZONES.find((z) => z.value === room.zone)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ZONES.map((z) => {
              const indicator = getZoneIndicator(room.type, z.value)
              return (
                <SelectItem key={z.value} value={z.value}>
                  <span className="flex items-center gap-2">
                    {indicator === "ideal" && (
                      <span className="inline-block size-2 shrink-0 rounded-full bg-emerald-500" />
                    )}
                    {indicator === "forbidden" && (
                      <span className="inline-block size-2 shrink-0 rounded-full bg-red-500" />
                    )}
                    {indicator === null && (
                      <span className="inline-block size-2 shrink-0" />
                    )}
                    {z.label}
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {room.type === "entrance" && (
        <div className="flex h-9 items-center gap-2">
          <Checkbox
            id={`main-entrance-${index}`}
            checked={room.isMainEntrance}
            onCheckedChange={(checked) =>
              update("isMainEntrance", checked === true)
            }
          />
          <Label
            htmlFor={`main-entrance-${index}`}
            className="cursor-pointer whitespace-nowrap text-sm font-normal"
          >
            Main Entrance
          </Label>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label={`Remove room ${index + 1}`}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
