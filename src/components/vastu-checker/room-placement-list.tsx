import { Plus } from "lucide-react"
import { Button } from "#/components/ui/button"
import { RoomRow } from "./room-row"
import type { RoomPlacement } from "./types"

const MAX_ROOMS = 15

interface RoomPlacementListProps {
  rooms: RoomPlacement[]
  onChange: (rooms: RoomPlacement[]) => void
}

export function getDefaultRooms(): RoomPlacement[] {
  return [
    { id: crypto.randomUUID(), type: "master_bedroom", zone: "SW", isMainEntrance: false },
    { id: crypto.randomUUID(), type: "kitchen", zone: "SE", isMainEntrance: false },
    { id: crypto.randomUUID(), type: "toilet", zone: "NW", isMainEntrance: false },
    { id: crypto.randomUUID(), type: "living", zone: "N", isMainEntrance: false },
    { id: crypto.randomUUID(), type: "puja", zone: "NE", isMainEntrance: false },
    { id: crypto.randomUUID(), type: "entrance", zone: "E", isMainEntrance: true },
  ]
}

export function RoomPlacementList({ rooms, onChange }: RoomPlacementListProps) {
  function handleRoomChange(index: number, updated: RoomPlacement) {
    const next = [...rooms]
    next[index] = updated
    onChange(next)
  }

  function handleRemove(index: number) {
    onChange(rooms.filter((_, i) => i !== index))
  }

  function handleAdd() {
    if (rooms.length >= MAX_ROOMS) return
    onChange([
      ...rooms,
      {
        id: crypto.randomUUID(),
        type: "bedroom",
        zone: "S",
        isMainEntrance: false,
      },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rooms.map((room, index) => (
          <RoomRow
            key={room.id}
            room={room}
            index={index}
            onChange={(updated) => handleRoomChange(index, updated)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        disabled={rooms.length >= MAX_ROOMS}
      >
        <Plus className="size-4" />
        Add Room
      </Button>
    </div>
  )
}
