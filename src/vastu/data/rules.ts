import type { VastuRule } from "../types"

export const VASTU_RULES: VastuRule[] = [
  {
    id: "H1",
    name: "Toilet in NE",
    description:
      "Toilet in NE (Ishaan) zone blocks wealth and spiritual energy",
    severity: "CRITICAL",
    weight: 10,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const room = zonedRooms.find(
        (zr) => zr.room.type === "toilet" && zr.room.zone === "NE",
      )
      if (!room) return null
      return {
        ruleId: "H1",
        severity: "CRITICAL",
        roomId: room.room.id,
        zone: "NE",
        idealZones: ["NW", "W"],
        pointsDeducted: 10,
        message: "Toilet placed in NE (Ishaan) zone — blocks wealth and spiritual energy",
      }
    },
  },
  {
    id: "H2",
    name: "Kitchen in SW",
    description: "Kitchen in SW clashes with earth/stability element",
    severity: "CRITICAL",
    weight: 15,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const room = zonedRooms.find(
        (zr) => zr.room.type === "kitchen" && zr.room.zone === "SW",
      )
      if (!room) return null
      return {
        ruleId: "H2",
        severity: "CRITICAL",
        roomId: room.room.id,
        zone: "SW",
        idealZones: ["SE"],
        pointsDeducted: 15,
        message: "Kitchen placed in SW (Nairitya) zone — fire element clashes with earth/stability",
      }
    },
  },
  {
    id: "H3",
    name: "Main entrance facing South",
    description: "Main entrance facing S or SSE is a high violation",
    severity: "HIGH",
    weight: 20,
    category: "entrance",
    evaluate: (_layout, zonedRooms) => {
      const entrance = zonedRooms.find(
        (zr) => zr.room.isMainEntrance && zr.room.zone === "S",
      )
      if (!entrance) return null
      return {
        ruleId: "H3",
        severity: "HIGH",
        roomId: entrance.room.id,
        zone: "S",
        idealZones: ["E", "N", "NE"],
        pointsDeducted: 20,
        message: "Main entrance faces South — considered inauspicious, prefer East or North",
      }
    },
  },
  {
    id: "H4",
    name: "Load in Brahmasthan",
    description: "Column or heavy load in Brahmasthan center is critical",
    severity: "CRITICAL",
    weight: 15,
    category: "structural",
    evaluate: (_layout, zonedRooms) => {
      const room = zonedRooms.find((zr) => zr.room.zone === "CENTER")
      if (!room) return null
      return {
        ruleId: "H4",
        severity: "CRITICAL",
        roomId: room.room.id,
        zone: "CENTER",
        idealZones: [],
        pointsDeducted: 15,
        message: "Room placed in Brahmasthan (center) — sacred zone must remain open and empty",
      }
    },
  },
  {
    id: "S1",
    name: "Master bedroom not in SW",
    description: "Master bedroom should be in SW for stability and authority",
    severity: "SOFT",
    weight: 15,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const masterBed = zonedRooms.find(
        (zr) => zr.room.type === "master_bedroom",
      )
      if (!masterBed || masterBed.room.zone === "SW") return null
      return {
        ruleId: "S1",
        severity: "SOFT",
        roomId: masterBed.room.id,
        zone: masterBed.room.zone,
        idealZones: ["SW"],
        pointsDeducted: 15,
        message: `Master bedroom in ${masterBed.room.zone} — should be in SW for stability and authority`,
      }
    },
  },
  {
    id: "S2",
    name: "Staircase in NE",
    description: "Staircase in NE disrupts spiritual energy flow",
    severity: "HIGH",
    weight: 10,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const room = zonedRooms.find(
        (zr) => zr.room.type === "staircase" && zr.room.zone === "NE",
      )
      if (!room) return null
      return {
        ruleId: "S2",
        severity: "HIGH",
        roomId: room.room.id,
        zone: "NE",
        idealZones: ["S", "W", "SW"],
        pointsDeducted: 10,
        message: "Staircase in NE (Ishaan) zone — disrupts spiritual energy, prefer S/W/SW",
      }
    },
  },
  {
    id: "S3",
    name: "Kitchen not in SE",
    description: "Kitchen should be in SE (Agni/fire element zone)",
    severity: "SOFT",
    weight: 15,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const kitchen = zonedRooms.find((zr) => zr.room.type === "kitchen")
      if (!kitchen || kitchen.room.zone === "SE") return null
      return {
        ruleId: "S3",
        severity: "SOFT",
        roomId: kitchen.room.id,
        zone: kitchen.room.zone,
        idealZones: ["SE"],
        pointsDeducted: 15,
        message: `Kitchen in ${kitchen.room.zone} — should be in SE (Agni zone) for fire element alignment`,
      }
    },
  },
  {
    id: "S4",
    name: "Puja not in NE",
    description: "Puja/prayer room should be in NE (Ishaan zone)",
    severity: "SOFT",
    weight: 10,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const puja = zonedRooms.find((zr) => zr.room.type === "puja")
      if (!puja || puja.room.zone === "NE") return null
      return {
        ruleId: "S4",
        severity: "SOFT",
        roomId: puja.room.id,
        zone: puja.room.zone,
        idealZones: ["NE"],
        pointsDeducted: 10,
        message: `Puja room in ${puja.room.zone} — should be in NE (Ishaan zone) for spiritual energy`,
      }
    },
  },
  {
    id: "S5",
    name: "Living room not in N/NE/E",
    description: "Living room should be in N, NE, or E zones",
    severity: "SOFT",
    weight: 5,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const living = zonedRooms.find((zr) => zr.room.type === "living")
      if (!living) return null
      const idealZones = ["N", "NE", "E"] as const
      if ((idealZones as readonly string[]).includes(living.room.zone))
        return null
      return {
        ruleId: "S5",
        severity: "SOFT",
        roomId: living.room.id,
        zone: living.room.zone,
        idealZones: ["N", "NE", "E"],
        pointsDeducted: 5,
        message: `Living room in ${living.room.zone} — should be in N, NE, or E for positive energy`,
      }
    },
  },
  {
    id: "S6",
    name: "Guest bedroom not in NW",
    description: "Guest bedroom should be in NW (Vayu/air element)",
    severity: "SOFT",
    weight: 5,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const guest = zonedRooms.find(
        (zr) => zr.room.type === "guest_bedroom",
      )
      if (!guest || guest.room.zone === "NW") return null
      return {
        ruleId: "S6",
        severity: "SOFT",
        roomId: guest.room.id,
        zone: guest.room.zone,
        idealZones: ["NW"],
        pointsDeducted: 5,
        message: `Guest bedroom in ${guest.room.zone} — should be in NW (Vayu zone) so guests don't overstay`,
      }
    },
  },
  {
    id: "S7",
    name: "Toilet in SE (kitchen zone)",
    description: "Toilet in SE contaminates the fire/kitchen zone",
    severity: "HIGH",
    weight: 5,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const room = zonedRooms.find(
        (zr) => zr.room.type === "toilet" && zr.room.zone === "SE",
      )
      if (!room) return null
      return {
        ruleId: "S7",
        severity: "HIGH",
        roomId: room.room.id,
        zone: "SE",
        idealZones: ["NW", "W"],
        pointsDeducted: 5,
        message: "Toilet in SE (Agni zone) — contaminates the fire/kitchen zone",
      }
    },
  },
  {
    id: "S8",
    name: "Entrance not in E/N/NE",
    description: "Main entrance should ideally be in E, N, or NE",
    severity: "SOFT",
    weight: 5,
    category: "entrance",
    evaluate: (_layout, zonedRooms) => {
      const entrance = zonedRooms.find((zr) => zr.room.isMainEntrance)
      if (!entrance) return null
      const idealZones = ["E", "N", "NE"] as const
      if ((idealZones as readonly string[]).includes(entrance.room.zone))
        return null
      // S entrance is already caught by H3, skip to avoid double-counting
      if (entrance.room.zone === "S") return null
      return {
        ruleId: "S8",
        severity: "SOFT",
        roomId: entrance.room.id,
        zone: entrance.room.zone,
        idealZones: ["E", "N", "NE"],
        pointsDeducted: 5,
        message: `Main entrance in ${entrance.room.zone} — prefer E, N, or NE for auspicious entry`,
      }
    },
  },
  {
    id: "S9",
    name: "Dining not in W/SE",
    description: "Dining room should be in W or SE zones",
    severity: "SOFT",
    weight: 5,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const dining = zonedRooms.find((zr) => zr.room.type === "dining")
      if (!dining) return null
      const idealZones = ["W", "SE"] as const
      if ((idealZones as readonly string[]).includes(dining.room.zone))
        return null
      return {
        ruleId: "S9",
        severity: "SOFT",
        roomId: dining.room.id,
        zone: dining.room.zone,
        idealZones: ["W", "SE"],
        pointsDeducted: 5,
        message: `Dining room in ${dining.room.zone} — should be in W or SE`,
      }
    },
  },
  {
    id: "S10",
    name: "Store/heavy items not in SW/S",
    description: "Storage and heavy items should be in SW or S zones",
    severity: "SOFT",
    weight: 5,
    category: "placement",
    evaluate: (_layout, zonedRooms) => {
      const store = zonedRooms.find((zr) => zr.room.type === "store")
      if (!store) return null
      const idealZones = ["SW", "S"] as const
      if ((idealZones as readonly string[]).includes(store.room.zone))
        return null
      return {
        ruleId: "S10",
        severity: "SOFT",
        roomId: store.room.id,
        zone: store.room.zone,
        idealZones: ["SW", "S"],
        pointsDeducted: 5,
        message: `Store room in ${store.room.zone} — heavy items should be in SW or S for stability`,
      }
    },
  },
]
