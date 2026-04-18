import type { ScoreResult, Violation } from "./types"

export function calculateScore(violations: Violation[]): ScoreResult {
  const totalDeducted = violations.reduce(
    (sum, v) => sum + v.pointsDeducted,
    0,
  )
  const overall = Math.max(0, 100 - totalDeducted)

  let grade: ScoreResult["grade"]
  if (overall >= 85) grade = "excellent"
  else if (overall >= 65) grade = "good"
  else if (overall >= 40) grade = "needs_work"
  else grade = "critical"

  const perRoom: ScoreResult["perRoom"] = {}
  for (const v of violations) {
    if (!perRoom[v.roomId]) {
      perRoom[v.roomId] = { score: 100, violations: [] }
    }
    perRoom[v.roomId].score -= v.pointsDeducted
    perRoom[v.roomId].violations.push(v)
  }
  for (const roomId of Object.keys(perRoom)) {
    perRoom[roomId].score = Math.max(0, perRoom[roomId].score)
  }

  const perCategory: ScoreResult["perCategory"] = {}
  const categoryTotals: Record<string, number> = {}
  for (const v of violations) {
    const cat = v.ruleId.startsWith("H")
      ? getCategoryFromId(v.ruleId, violations)
      : getCategoryFromId(v.ruleId, violations)
    if (!categoryTotals[cat]) categoryTotals[cat] = 0
    categoryTotals[cat] += v.pointsDeducted
  }
  for (const [cat, deducted] of Object.entries(categoryTotals)) {
    perCategory[cat] = Math.max(0, 100 - deducted)
  }

  return { overall, grade, perRoom, perCategory }
}

function getCategoryFromId(
  ruleId: string,
  violations: Violation[],
): string {
  const v = violations.find((v) => v.ruleId === ruleId)
  if (!v) return "placement"
  // Derive category from the rule ID prefix pattern
  if (ruleId === "H3" || ruleId === "S8") return "entrance"
  if (ruleId === "H4") return "structural"
  return "placement"
}
