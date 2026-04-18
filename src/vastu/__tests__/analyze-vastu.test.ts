import { describe, expect, it } from "vitest"
import { analyzeVastu } from "../index"
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

describe("analyzeVastu (integration)", () => {
  it("perfect layout returns score 100 with zero violations", () => {
    const layout = makeLayout([
      { type: "puja", zone: "NE" },
      { type: "kitchen", zone: "SE" },
      { type: "master_bedroom", zone: "SW" },
      { type: "living", zone: "N" },
      { type: "entrance", zone: "E", isMainEntrance: true },
      { type: "guest_bedroom", zone: "NW" },
      { type: "dining", zone: "W" },
      { type: "store", zone: "S" },
    ])
    const report = analyzeVastu(layout)

    expect(report.score.overall).toBe(100)
    expect(report.score.grade).toBe("excellent")
    expect(report.violations).toHaveLength(0)
    expect(report.remedies).toHaveLength(0)
    expect(report.summary.criticalCount).toBe(0)
    expect(report.summary.highCount).toBe(0)
    expect(report.summary.softCount).toBe(0)
  })

  it("worst-case layout returns low score with CRITICAL violations", () => {
    const layout = makeLayout([
      { type: "toilet", zone: "NE" },
      { type: "kitchen", zone: "SW" },
      { type: "entrance", zone: "S", isMainEntrance: true },
      { type: "staircase", zone: "CENTER" },
    ])
    const report = analyzeVastu(layout)

    expect(report.score.overall).toBeLessThan(40)
    expect(report.score.grade).toBe("critical")
    expect(report.summary.criticalCount).toBeGreaterThanOrEqual(2)
    expect(report.violations.length).toBeGreaterThanOrEqual(3)
    expect(report.remedies.length).toBeGreaterThan(0)
  })

  it("partial compliance returns mid-range score", () => {
    const layout = makeLayout([
      { type: "puja", zone: "NE" },
      { type: "kitchen", zone: "SE" },
      { type: "master_bedroom", zone: "N" }, // not in SW → S1 soft
      { type: "living", zone: "SW" }, // not in N/NE/E → S5 soft
      { type: "entrance", zone: "E", isMainEntrance: true },
    ])
    const report = analyzeVastu(layout)

    expect(report.score.overall).toBeGreaterThanOrEqual(65)
    expect(report.score.overall).toBeLessThanOrEqual(100)
    expect(report.summary.softCount).toBeGreaterThan(0)
    expect(report.summary.criticalCount).toBe(0)
  })

  it("empty rooms returns score 100", () => {
    const layout = makeLayout([])
    const report = analyzeVastu(layout)

    expect(report.score.overall).toBe(100)
    expect(report.score.grade).toBe("excellent")
    expect(report.violations).toHaveLength(0)
  })

  it("summary counts match violation severities", () => {
    const layout = makeLayout([
      { type: "toilet", zone: "NE" }, // H1 CRITICAL
      { type: "staircase", zone: "NE" }, // S2 HIGH
      { type: "master_bedroom", zone: "E" }, // S1 SOFT
    ])
    const report = analyzeVastu(layout)

    const criticals = report.violations.filter(
      (v) => v.severity === "CRITICAL",
    )
    const highs = report.violations.filter((v) => v.severity === "HIGH")
    const softs = report.violations.filter((v) => v.severity === "SOFT")

    expect(report.summary.criticalCount).toBe(criticals.length)
    expect(report.summary.highCount).toBe(highs.length)
    expect(report.summary.softCount).toBe(softs.length)
  })

  it("topRemedies contains at most 3 highest-impact fixes", () => {
    const layout = makeLayout([
      { type: "toilet", zone: "NE" },
      { type: "kitchen", zone: "SW" },
      { type: "entrance", zone: "S", isMainEntrance: true },
      { type: "master_bedroom", zone: "N" },
    ])
    const report = analyzeVastu(layout)

    expect(report.summary.topRemedies.length).toBeLessThanOrEqual(3)
    // Top remedies should be sorted by impact descending
    for (let i = 1; i < report.summary.topRemedies.length; i++) {
      expect(report.summary.topRemedies[i - 1].impact).toBeGreaterThanOrEqual(
        report.summary.topRemedies[i].impact,
      )
    }
  })
})
