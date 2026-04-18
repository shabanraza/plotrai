import { mapToZones } from "./zone-mapper"
import { evaluateRules } from "./rule-evaluator"
import { calculateScore } from "./score-calculator"
import { resolveRemedies } from "./remedy-resolver"
import { VASTU_RULES } from "./data/rules"
import type { LayoutInput, VastuReport } from "./types"

export function analyzeVastu(layout: LayoutInput): VastuReport {
  const zonedRooms = mapToZones(layout)
  const violations = evaluateRules(layout, zonedRooms, VASTU_RULES)
  const score = calculateScore(violations)
  const remedies = resolveRemedies(violations)

  const criticalCount = violations.filter(
    (v) => v.severity === "CRITICAL",
  ).length
  const highCount = violations.filter((v) => v.severity === "HIGH").length
  const softCount = violations.filter((v) => v.severity === "SOFT").length

  const topRemedies = [...remedies]
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3)

  return {
    score,
    violations,
    remedies,
    summary: {
      criticalCount,
      highCount,
      softCount,
      topRemedies,
    },
  }
}

export type {
  LayoutInput,
  PlotInput,
  RoomInput,
  Direction,
  Zone,
  RoomType,
  VastuReport,
  ScoreResult,
  Violation,
  Remedy,
  Severity,
  RemedyCost,
  VastuSchool,
} from "./types"
