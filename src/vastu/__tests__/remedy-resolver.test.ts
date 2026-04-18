import { describe, expect, it } from "vitest"
import { resolveRemedies } from "../remedy-resolver"
import type { Violation } from "../types"

function makeViolation(ruleId: string): Violation {
  return {
    ruleId,
    severity: "CRITICAL",
    roomId: "room-0",
    zone: "NE",
    idealZones: ["NW"],
    pointsDeducted: 10,
    message: `Test violation for ${ruleId}`,
  }
}

describe("resolveRemedies", () => {
  it("returns remedies for H1 violation", () => {
    const violations = [makeViolation("H1")]
    const remedies = resolveRemedies(violations)

    expect(remedies.length).toBeGreaterThan(0)
    expect(remedies.some((r) => r.description.includes("toilet"))).toBe(true)
    expect(remedies.every((r) => r.violationId === "H1")).toBe(true)
  })

  it("sorts remedies by cost: free first, then low, then structural", () => {
    const violations = [makeViolation("H4")]
    const remedies = resolveRemedies(violations)

    expect(remedies[0].cost).toBe("free")
    expect(remedies[1].cost).toBe("structural")
  })

  it("returns remedies for multiple violations", () => {
    const violations = [makeViolation("H1"), makeViolation("H2")]
    const remedies = resolveRemedies(violations)

    const h1Remedies = remedies.filter((r) => r.violationId === "H1")
    const h2Remedies = remedies.filter((r) => r.violationId === "H2")

    expect(h1Remedies.length).toBeGreaterThan(0)
    expect(h2Remedies.length).toBeGreaterThan(0)
  })

  it("returns empty array for unknown ruleId", () => {
    const violations = [makeViolation("UNKNOWN")]
    const remedies = resolveRemedies(violations)

    expect(remedies).toHaveLength(0)
  })

  it("returns empty array for no violations", () => {
    const remedies = resolveRemedies([])

    expect(remedies).toHaveLength(0)
  })

  it("each remedy has valid impact and price", () => {
    const violations = [makeViolation("S1")]
    const remedies = resolveRemedies(violations)

    for (const r of remedies) {
      expect(r.impact).toBeGreaterThan(0)
      expect(r.estimatedPrice).toMatch(/₹/)
    }
  })
})
