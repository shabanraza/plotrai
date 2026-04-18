import { describe, expect, it } from "vitest"
import { evaluateRules } from "../rule-evaluator"
import { mapToZones } from "../zone-mapper"
import { VASTU_RULES } from "../data/rules"
import type { LayoutInput } from "../types"

function makeLayout(
  rooms: Array<{
    type: string
    zone: string
    isMainEntrance?: boolean
  }>,
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
      isMainEntrance: r.isMainEntrance,
    })),
    school: "classical",
  }
}

describe("evaluateRules", () => {
  it("detects H1: toilet in NE", () => {
    const layout = makeLayout([{ type: "toilet", zone: "NE" }])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const h1 = violations.find((v) => v.ruleId === "H1")
    expect(h1).toBeDefined()
    expect(h1!.severity).toBe("CRITICAL")
    expect(h1!.pointsDeducted).toBe(10)
  })

  it("no violation for kitchen in SE (correct placement)", () => {
    const layout = makeLayout([{ type: "kitchen", zone: "SE" }])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const kitchenViolation = violations.find(
      (v) => v.ruleId === "S3" || v.ruleId === "H2",
    )
    expect(kitchenViolation).toBeUndefined()
  })

  it("detects H3: main entrance facing S", () => {
    const layout = makeLayout([
      { type: "entrance", zone: "S", isMainEntrance: true },
    ])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const h3 = violations.find((v) => v.ruleId === "H3")
    expect(h3).toBeDefined()
    expect(h3!.severity).toBe("HIGH")
    expect(h3!.pointsDeducted).toBe(20)
  })

  it("no S1 violation when master bedroom is in SW", () => {
    const layout = makeLayout([{ type: "master_bedroom", zone: "SW" }])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const s1 = violations.find((v) => v.ruleId === "S1")
    expect(s1).toBeUndefined()
  })

  it("detects S1: master bedroom not in SW", () => {
    const layout = makeLayout([{ type: "master_bedroom", zone: "NE" }])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const s1 = violations.find((v) => v.ruleId === "S1")
    expect(s1).toBeDefined()
    expect(s1!.severity).toBe("SOFT")
    expect(s1!.idealZones).toEqual(["SW"])
  })

  it("detects H4: room in CENTER (Brahmasthan)", () => {
    const layout = makeLayout([{ type: "toilet", zone: "CENTER" }])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const h4 = violations.find((v) => v.ruleId === "H4")
    expect(h4).toBeDefined()
    expect(h4!.severity).toBe("CRITICAL")
  })

  it("detects multiple violations simultaneously", () => {
    const layout = makeLayout([
      { type: "toilet", zone: "NE" },
      { type: "kitchen", zone: "SW" },
      { type: "entrance", zone: "S", isMainEntrance: true },
    ])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    expect(violations.find((v) => v.ruleId === "H1")).toBeDefined()
    expect(violations.find((v) => v.ruleId === "H2")).toBeDefined()
    expect(violations.find((v) => v.ruleId === "H3")).toBeDefined()
  })

  it("returns no violations for a perfect layout", () => {
    const layout = makeLayout([
      { type: "puja", zone: "NE" },
      { type: "kitchen", zone: "SE" },
      { type: "master_bedroom", zone: "SW" },
      { type: "living", zone: "N" },
      { type: "entrance", zone: "E", isMainEntrance: true },
      { type: "guest_bedroom", zone: "NW" },
    ])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    expect(violations).toHaveLength(0)
  })

  it("S8 does not double-count with H3 for S entrance", () => {
    const layout = makeLayout([
      { type: "entrance", zone: "S", isMainEntrance: true },
    ])
    const zonedRooms = mapToZones(layout)
    const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)

    const entranceViolations = violations.filter(
      (v) => v.ruleId === "H3" || v.ruleId === "S8",
    )
    // Should only have H3, not S8 (which skips S to avoid double-counting)
    expect(entranceViolations).toHaveLength(1)
    expect(entranceViolations[0].ruleId).toBe("H3")
  })
})
