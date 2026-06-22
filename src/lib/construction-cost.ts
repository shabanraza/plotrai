import type {
  CityRates,
  FinishTier,
  StageBreakdown,
} from '#/data/construction-cost-rates'

export interface ConstructionCostInput {
  city: string
  tier: FinishTier
  areaPerFloorSqft: number
  floors: number
  cityRates: Record<string, CityRates>
  stages: ReadonlyArray<StageBreakdown>
}

export interface ConstructionStageCost extends StageBreakdown {
  cost: number
}

export interface ConstructionCostResult {
  totalAreaSqft: number
  baseRatePerSqft: number
  totalCost: number
  stageRows: ReadonlyArray<ConstructionStageCost>
}

export function calculateConstructionCost(
  input: ConstructionCostInput,
): ConstructionCostResult {
  const areaPerFloorSqft = positive(input.areaPerFloorSqft)
  const floors = Math.max(Math.floor(positive(input.floors)), 1)
  const totalAreaSqft = areaPerFloorSqft * floors
  const baseRatePerSqft = input.cityRates[input.city]?.[input.tier] ?? 0
  const totalCost = totalAreaSqft * baseRatePerSqft

  return {
    totalAreaSqft,
    baseRatePerSqft,
    totalCost,
    stageRows: input.stages.map((stage) => ({
      ...stage,
      cost: (totalCost * stage.percent) / 100,
    })),
  }
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}
