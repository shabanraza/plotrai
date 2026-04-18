import type { LayoutInput, VastuRule, Violation, ZonedRoom } from "./types"
import { ZONE_CONFIGS } from "./data/zone-configs"

export function evaluateRules(
  layout: LayoutInput,
  zonedRooms: ZonedRoom[],
  rules: VastuRule[],
): Violation[] {
  const violations: Violation[] = []

  for (const rule of rules) {
    const violation = rule.evaluate(layout, zonedRooms, ZONE_CONFIGS)
    if (violation) {
      violations.push(violation)
    }
  }

  return violations
}
