 # Vastu Rule Engine — Design Spec

**Date:** 2026-04-18
**Status:** Approved
**Scope:** Phase 1 of PlotRAI — the Vastu Rule Engine, a pure TypeScript module that evaluates floor plan layouts against classical Vastu Shastra rules and returns scores, violations, and remedies.

---

## Context

PlotRAI is an Indian-first web app that combines interactive floor planning, 3D visualization, and Vastu Shastra compliance — something no existing tool does. The competitive landscape is split into two disconnected categories:

1. **Vastu analyzers** (Grihafy, Vaastu AI, Kshetra AI, VastuAnalyzer) — upload-and-check only, no floor planner, no 3D.
2. **Floor planners** (Planner 5D, Coohom) — full design tools but zero real Vastu intelligence.

PlotRAI's differentiator is **live Vastu scoring built into the design process** — violations show as you draw, not after upload. The Rule Engine is the foundation that everything else builds on.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Vastu school | Classical only (v1), data model supports multiple schools | Ship faster, add MahaVastu/Anant later without rewrite |
| Input format | Structured JSON | Clean API, works with both floor planner UI and Vastu checker form |
| Output | Score + violations + remedies | Immediately useful standalone, matches what competitors charge for |
| Grid model | 8-direction zones + Brahmasthan center | Covers 90% of rules, 32-pada grid deferred |
| Rule storage | TypeScript config objects | Type-safe, version-controlled, no external dependency |
| Runtime | Client-side (pure TS) | Zero latency for real-time scoring, no API calls needed |
| Architecture | Pipeline (4 stages) | Clear data flow, each stage testable in isolation |

## Architecture

Pipeline of 4 pure functions:

```
LayoutInput → mapToZones() → evaluateRules() → calculateScore() → resolveRemedies() → VastuReport
```

Each stage receives input and returns output with no side effects.

## Data Types

### Input Types

```typescript
type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
type Zone = Direction | "CENTER"

type RoomType =
  | "master_bedroom" | "bedroom" | "kids_bedroom" | "guest_bedroom"
  | "kitchen" | "dining" | "living" | "drawing"
  | "puja" | "study" | "store"
  | "toilet" | "bathroom"
  | "parking" | "servant_quarter" | "balcony"
  | "staircase" | "entrance"

type PlotShape = "rectangle" | "square" | "L" | "corner"
type Unit = "ft" | "m"
type VastuSchool = "classical"

interface PlotInput {
  length: number
  width: number
  unit: Unit
  facing: Direction
  shape: PlotShape
  floors: 1 | 2 | 3
  setbacks: { front: number; back: number; left: number; right: number }
}

interface RoomInput {
  id: string
  type: RoomType
  sqft: number
  zone: Zone
  isMainEntrance?: boolean
}

interface LayoutInput {
  plot: PlotInput
  rooms: RoomInput[]
  school: VastuSchool
}
```

### Zone Configuration

```typescript
interface ZoneConfig {
  zone: Zone
  element: "water" | "fire" | "earth" | "air" | "space"
  deity: string
  idealRooms: RoomType[]
  acceptableRooms: RoomType[]
  forbiddenRooms: RoomType[]
}
```

The 9 zone configs encode the classical Vastu Purusha Mandala:

| Zone | Element | Deity | Ideal Rooms | Forbidden |
|------|---------|-------|-------------|-----------|
| N | Water | Kubera | living, study | - |
| NE | Water | Ishaan | puja | toilet, kitchen, staircase |
| E | Fire | Indra | entrance, living, guest_bedroom | - |
| SE | Fire | Agni | kitchen, dining | - |
| S | Earth | Yama | bedroom | entrance |
| SW | Earth | Nairitya | master_bedroom | entrance, toilet |
| W | Air | Varuna | kids_bedroom, dining, bathroom, store | - |
| NW | Air | Vayu | guest_bedroom, bathroom, parking | - |
| CENTER | Space | Brahma | (must be empty/open) | toilet, staircase, kitchen |

### Rule Types

```typescript
type Severity = "CRITICAL" | "HIGH" | "SOFT"

interface VastuRule {
  id: string
  name: string
  description: string
  severity: Severity
  weight: number
  category: "placement" | "entrance" | "structural" | "element"
  evaluate: (layout: LayoutInput, zonedRooms: ZonedRoom[], zoneMap: ZoneConfig[]) => Violation | null
}

interface Violation {
  ruleId: string
  severity: Severity
  roomId: string
  zone: Zone
  idealZones: Zone[]
  pointsDeducted: number
  message: string
}
```

### Output Types

```typescript
interface ScoreResult {
  overall: number
  grade: "excellent" | "good" | "needs_work" | "critical"
  perRoom: Record<string, { score: number; violations: Violation[] }>
  perCategory: Record<string, number>
}

type RemedyCost = "free" | "low" | "structural"

interface Remedy {
  violationId: string
  cost: RemedyCost
  estimatedPrice: string
  description: string
  impact: number
}

interface VastuReport {
  score: ScoreResult
  violations: Violation[]
  remedies: Remedy[]
  summary: {
    criticalCount: number
    highCount: number
    softCount: number
    topRemedies: Remedy[]
  }
}
```

## Pipeline Stages

### Stage 1: Zone Mapper (`mapToZones`)

Takes `LayoutInput`, returns `ZonedRoom[]`. For each room, looks up the zone config and flags whether the room is in an ideal, acceptable, or forbidden zone.

```typescript
interface ZonedRoom {
  room: RoomInput
  zoneConfig: ZoneConfig
  isIdeal: boolean
  isAcceptable: boolean
  isForbidden: boolean
}

function mapToZones(layout: LayoutInput): ZonedRoom[]
```

### Stage 2: Rule Evaluator (`evaluateRules`)

Runs all ~15 VastuRule objects against the layout. Each rule's `evaluate` function checks a specific condition and returns a `Violation` or `null`. Collects all non-null violations.

```typescript
function evaluateRules(
  layout: LayoutInput,
  zonedRooms: ZonedRoom[],
  rules: VastuRule[]
): Violation[]
```

### Stage 3: Score Calculator (`calculateScore`)

Starts at 100, deducts `pointsDeducted` for each violation. Computes per-room and per-category breakdowns.

Grade thresholds:
- 85-100 → `"excellent"`
- 65-84 → `"good"`
- 40-64 → `"needs_work"`
- 0-39 → `"critical"`

```typescript
function calculateScore(violations: Violation[]): ScoreResult
```

### Stage 4: Remedy Resolver (`resolveRemedies`)

Maps each violation to one or more remedies, ranked by cost (free → low → structural). Each remedy includes estimated ₹ price and how many score points it recovers.

```typescript
function resolveRemedies(violations: Violation[]): Remedy[]
```

### Entry Point

```typescript
function analyzeVastu(layout: LayoutInput): VastuReport
```

Composes all 4 stages and returns the complete report.

## Rule Set (v1 — Classical Vastu)

| ID | Rule | Severity | Weight | Category |
|----|------|----------|--------|----------|
| H1 | Toilet in NE | CRITICAL | 10 | placement |
| H2 | Kitchen in SW | CRITICAL | 15 | placement |
| H3 | Main entrance facing S/SSE | HIGH | 20 | entrance |
| H4 | Load/column in Brahmasthan (CENTER) | CRITICAL | 15 | structural |
| S1 | Master bedroom not in SW | SOFT | 15 | placement |
| S2 | Staircase in NE | HIGH | 10 | placement |
| S3 | Kitchen not in SE | SOFT | 15 | placement |
| S4 | Puja not in NE | SOFT | 10 | placement |
| S5 | Living room not in N/NE/E | SOFT | 5 | placement |
| S6 | Guest bedroom not in NW | SOFT | 5 | placement |
| S7 | Toilet in kitchen zone (SE) | HIGH | 5 | placement |
| S8 | Entrance not in E/N/NE | SOFT | 5 | entrance |
| S9 | Dining not in W/SE | SOFT | 5 | placement |
| S10 | Store/heavy items not in SW/S | SOFT | 5 | placement |

Total weights = 100 points.

## File Structure

```
src/
  vastu/
    index.ts                 # Public API: export { analyzeVastu }
    types.ts                 # All type definitions
    zone-mapper.ts           # mapToZones()
    rule-evaluator.ts        # evaluateRules()
    score-calculator.ts      # calculateScore()
    remedy-resolver.ts       # resolveRemedies()
    data/
      zone-configs.ts        # 9 zone definitions
      rules.ts               # All VastuRule objects
      remedies.ts            # Remedy templates per rule ID
    __tests__/
      zone-mapper.test.ts
      rule-evaluator.test.ts
      score-calculator.test.ts
      remedy-resolver.test.ts
      analyze-vastu.test.ts  # Integration test: full pipeline
```

## Testing Strategy

**Unit tests (per stage):**
- zone-mapper: room in zone X → correct zoneConfig, correct isIdeal/isForbidden flags
- rule-evaluator: toilet in NE → H1 CRITICAL violation; kitchen in SE → no violation
- score-calculator: 2 violations (10+15 pts) → score 75, grade "good"
- remedy-resolver: H1 violation → "move toilet to NW/W" remedy with ₹ estimate

**Integration test (full pipeline):**
- Perfect layout → score 100, zero violations
- Worst-case layout (toilet NE, kitchen SW, entrance S) → score near 0, 3+ CRITICAL violations, remedies for each
- Partial compliance → score 65-85, only SOFT violations

**Edge cases:**
- Empty rooms list → score 100
- Room in CENTER → violation if not empty/open
- Multiple rooms in same zone → both evaluated independently
- All rooms in ideal zones → score 100

**No mocks needed** — pure functions with zero external dependencies.

## Future Extensions (Not in v1)

- Multiple Vastu schools (MahaVastu, Anant) — add rule sets to data/, filter by `school` field
- 32-pada grid for entrance evaluation
- AI-powered natural language explanations via Claude API
- Image upload → AI vision → structured input extraction
- Server-side execution for PDF report generation
