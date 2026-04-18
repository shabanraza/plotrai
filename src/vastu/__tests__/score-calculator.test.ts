import { describe, expect, it } from "vitest"
import { calculateScore } from "../score-calculator"
import type { Violation } from "../types"

function makeViolation(
  overrides: Partial<Violation> & { ruleId: string; pointsDeducted: number },
): Violation {
  return {
    severity: "SOFT",
    roomId: "room-0",
    zone: "N",
    idealZones: ["S"],
    message: "test violation",
    ...overrides,
  }
}

describe("calculateScore", () => {
  it("returns score 100 and excellent grade with no violations", () => {
    const result = calculateScore([])

    expect(result.overall).toBe(100)
    expect(result.grade).toBe("excellent")
  })

  it("deducts points correctly for two violations", () => {
    const violations = [
      makeViolation({ ruleId: "H1", pointsDeducted: 10 }),
      makeViolation({
        ruleId: "S1",
        pointsDeducted: 15,
        roomId: "room-1",
      }),
    ]
    const result = calculateScore(violations)

    expect(result.overall).toBe(75)
    expect(result.grade).toBe("good")
  })

  it("returns grade needs_work for score 40-64", () => {
    const violations = [
      makeViolation({ ruleId: "H1", pointsDeducted: 10 }),
      makeViolation({
        ruleId: "H2",
        pointsDeducted: 15,
        roomId: "room-1",
      }),
      makeViolation({
        ruleId: "H3",
        pointsDeducted: 20,
        roomId: "room-2",
      }),
    ]
    const result = calculateScore(violations)

    expect(result.overall).toBe(55)
    expect(result.grade).toBe("needs_work")
  })

  it("returns grade critical for score below 40", () => {
    const violations = [
      makeViolation({ ruleId: "H1", pointsDeducted: 10 }),
      makeViolation({
        ruleId: "H2",
        pointsDeducted: 15,
        roomId: "room-1",
      }),
      makeViolation({
        ruleId: "H3",
        pointsDeducted: 20,
        roomId: "room-2",
      }),
      makeViolation({
        ruleId: "H4",
        pointsDeducted: 15,
        roomId: "room-3",
      }),
      makeViolation({
        ruleId: "S1",
        pointsDeducted: 15,
        roomId: "room-4",
      }),
    ]
    const result = calculateScore(violations)

    expect(result.overall).toBe(25)
    expect(result.grade).toBe("critical")
  })

  it("clamps score to 0 (never negative)", () => {
    const violations = Array.from({ length: 10 }, (_, i) =>
      makeViolation({
        ruleId: `R${i}`,
        pointsDeducted: 20,
        roomId: `room-${i}`,
      }),
    )
    const result = calculateScore(violations)

    expect(result.overall).toBe(0)
    expect(result.grade).toBe("critical")
  })

  it("builds perRoom breakdown correctly", () => {
    const violations = [
      makeViolation({
        ruleId: "H1",
        pointsDeducted: 10,
        roomId: "toilet-1",
      }),
      makeViolation({
        ruleId: "S3",
        pointsDeducted: 15,
        roomId: "kitchen-1",
      }),
    ]
    const result = calculateScore(violations)

    expect(result.perRoom["toilet-1"].score).toBe(90)
    expect(result.perRoom["toilet-1"].violations).toHaveLength(1)
    expect(result.perRoom["kitchen-1"].score).toBe(85)
    expect(result.perRoom["kitchen-1"].violations).toHaveLength(1)
  })

  it("builds perCategory breakdown", () => {
    const violations = [
      makeViolation({
        ruleId: "H3",
        pointsDeducted: 20,
        roomId: "entrance-1",
      }),
    ]
    const result = calculateScore(violations)

    expect(result.perCategory["entrance"]).toBe(80)
  })
})
