import type { LayoutInput, ZonedRoom } from "./types"
import { ZONE_CONFIGS } from "./data/zone-configs"

export function mapToZones(layout: LayoutInput): ZonedRoom[] {
  return layout.rooms.map((room) => {
    const zoneConfig = ZONE_CONFIGS.find((zc) => zc.zone === room.zone)!

    return {
      room,
      zoneConfig,
      isIdeal: zoneConfig.idealRooms.includes(room.type),
      isAcceptable: zoneConfig.acceptableRooms.includes(room.type),
      isForbidden: zoneConfig.forbiddenRooms.includes(room.type),
    }
  })
}
