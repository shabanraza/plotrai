import type { Remedy, Violation } from "./types"
import { REMEDY_TEMPLATES } from "./data/remedies"

export function resolveRemedies(violations: Violation[]): Remedy[] {
  const remedies: Remedy[] = []

  for (const violation of violations) {
    const templates = REMEDY_TEMPLATES[violation.ruleId]
    if (!templates) continue

    for (const template of templates) {
      remedies.push({
        violationId: violation.ruleId,
        cost: template.cost,
        estimatedPrice: template.estimatedPrice,
        description: template.description,
        impact: template.impact,
      })
    }
  }

  // Sort by cost: free first, then low, then structural
  const costOrder = { free: 0, low: 1, structural: 2 }
  remedies.sort((a, b) => costOrder[a.cost] - costOrder[b.cost])

  return remedies
}
