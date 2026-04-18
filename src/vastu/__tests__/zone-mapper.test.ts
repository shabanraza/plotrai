import { describe, expect, it } from "vitest"
import { mapToZones } from "../zone-mapper"
import type { LayoutInput } from "../types"

function makeLayout(
  rooms: Array<{ type: string; zone: string }>,
): LayoutInput {
  return {
    plot: {
      length: 40,
      width: 30,
      unit: "ft",
      facing: "N",
      shape: "rectangle",
      floors: 1,
      setbacks: { front: 5, back: 3, left: 2, right: 2 },
    },
    rooms: rooms.map((r, i) => ({
      id: `room-${i}`,
      type: r.type as any,
      sqft: 150,
      zone: r.zone as any,
    })),
    school: "classical",
  }
}

describe("mapToZones", () => {
  it("marks a room in its ideal zone", () => {
    const layout = makeLayout([{ type: "puja", zone: "NE" }])
    const result = mapToZones(layout)

    expect(result).toHaveLength(1)
    expect(result[0].isIdeal).toBe(true)
    expect(result[0].isAcceptable).toBe(false)
    expect(result[0].isForbidden).toBe(false)
  })

  it("marks a room in a forbidden zone", () => {
    const layout = makeLayout([{ type: "toilet", zone: "NE" }])
    const result = mapToZones(layout)

    expect(result[0].isIdeal).toBe(false)
    expect(result[0].isAcceptable).toBe(false)
    expect(result[0].isForbidden).toBe(true)
  })

  it("marks a room in an acceptable zone", () => {
    const layout = makeLayout([{ type: "study", zone: "NE" }])
    const result = mapToZones(layout)

    expect(result[0].isIdeal).toBe(false)
    expect(result[0].isAcceptable).toBe(true)
    expect(result[0].isForbidden).toBe(false)
  })

  it("marks a room in a neutral zone (not ideal, acceptable, or forbidden)", () => {
    const layout = makeLayout([{ type: "bedroom", zone: "N" }])
    const result = mapToZones(layout)

    expect(result[0].isIdeal).toBe(false)
    expect(result[0].isAcceptable).toBe(false)
    expect(result[0].isForbidden).toBe(false)
  })

  it("returns correct zoneConfig for each room", () => {
    const layout = makeLayout([{ type: "kitchen", zone: "SE" }])
    const result = mapToZones(layout)

    expect(result[0].zoneConfig.zone).toBe("SE")
    expect(result[0].zoneConfig.element).toBe("fire")
    expect(result[0].zoneConfig.deity).toBe("Agni")
  })

  it("handles multiple rooms", () => {
    const layout = makeLayout([
      { type: "puja", zone: "NE" },
      { type: "kitchen", zone: "SE" },
      { type: "master_bedroom", zone: "SW" },
    ])
    const result = mapToZones(layout)

    expect(result).toHaveLength(3)
    expect(result[0].isIdeal).toBe(true)
    expect(result[1].isIdeal).toBe(true)
    expect(result[2].isIdeal).toBe(true)
  })

  it("handles empty rooms list", () => {
    const layout = makeLayout([])
    const result = mapToZones(layout)

    expect(result).toHaveLength(0)
  })
})
