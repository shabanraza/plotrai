# AI-Powered Floor Plan Designer

## Context
PlotRAI currently has a basic grid-based room placement tool and a Vastu rule engine. The next phase is a **Planner 5D-level** floor plan designer where AI generates a complete architectural floor plan from user input (plot size, room count, design style) — then the user can view it in 2D (professional architectural drawing) and 3D (extruded walkable view). **Vastu compliance is fully optional** — users can toggle it on/off as an overlay; it is NOT part of the core floor plan flow.

### Research Summary
- **Best AI approach**: Claude API + structured outputs (Zod schema) → floor plan JSON with coordinates. Anthropic SDK already wired.
- **2D rendering**: SVG — already in codebase, supports CSS variables, zoom/pan, no new library needed.
- **3D rendering**: React Three Fiber + drei — lazy-loaded to avoid 150KB+ in initial bundle.
- **Competitive tools**: Planner 5D, RoomSketcher, Floorplanner.
- **Professional architect standards**: Floor plans must include wall thickness, door swing arcs, window symbols, room dimensions, built-in fixtures (kitchen counter, bathroom fixtures, wardrobes), scale bar, north arrow, and proper annotation standards.
- **Indian market**: Common plot sizes (20x30 to 50x80 ft), mandatory rooms (puja, servant quarter, parking), wet/dry kitchen separation, city-specific setback rules.

---

## Design Style Picker — `src/data/design-styles.ts`

Users pick a home design style BEFORE generating. The style affects AI's layout decisions (open vs closed concept, room proportions, kitchen style, hallway usage, outdoor spaces). Show trending badge on popular styles.

### Global Styles

| Style | Key Layout Impact | Trending |
|-------|-------------------|----------|
| **Modern / Contemporary** | Open floor plan, minimal hallways, large windows, indoor-outdoor flow | Yes |
| **Minimalist** | Clean layouts, built-in storage, no wasted space, single flowing space | Yes |
| **Japandi** (Japanese + Scandinavian) | Open with subtle room separation, multi-functional spaces, low furniture | Hot 2025 |
| **Scandinavian** | Light/airy, open-concept, efficient use of space, max natural light | Yes |
| **Industrial** | Open-plan, high ceilings, large windows, exposed elements, loft-style | - |
| **Mid-Century Modern** | Open-concept, minimal partition walls, large windows, clean sightlines | - |
| **Mediterranean** | Semi-open, central courtyard, arched doorways, multiple outdoor spaces | - |
| **Farmhouse / Cottage** | Central kitchen-dining, open living, covered porches, practical utility | Yes |
| **Art Deco** | Formal/symmetrical layouts, designated spaces, geometric precision | Revival |

### Indian Styles

| Style | Key Layout Impact | Trending |
|-------|-------------------|----------|
| **Indo-Contemporary** | Modern open layouts + traditional rooms (puja, servant quarter), clean aesthetic | Hot |
| **South Indian Traditional** (Chettinad/Kerala) | Central courtyard, rooms around perimeter, natural ventilation, high ceilings | Heritage |
| **North Indian / Haveli** | Inward-facing, internal courtyard, multi-level, segregated family quarters | Heritage |
| **Compact / Budget** | Maximum efficiency, no wasted hallways, multifunctional spaces, 800-1200 sqft | Popular |
| **Luxury Villa** | 3000+ sqft, guest wing, home theater, pool area, multiple living zones | Premium |

### How Style Affects AI Generation
The selected style is passed to Claude's prompt and influences:
- **Open vs closed rooms**: Modern/Japandi → open concept; Traditional → separate rooms
- **Kitchen type**: Indian styles → wet/dry kitchen separation; Western → open kitchen
- **Hallway usage**: Modern → no hallways; Colonial → central hallway
- **Outdoor spaces**: Mediterranean → courtyard; Farmhouse → covered porch; Indian → balconies + terrace
- **Room proportions**: Industrial → rectangular; Mediterranean → balanced/square-ish
- **Privacy level**: Open-concept sacrifices privacy; Traditional maintains it

---

## Professional Architectural Elements

What a senior architect includes that our AI must also generate:

### Structural Elements (in data model)
- **Wall types**: Exterior (9" thick), interior load-bearing (6"), partition (4.5")
- **Columns**: Structural support positions (shown as filled squares in 2D)
- **Staircase**: Direction arrows (UP/DN), step count, landing platform, width (min 3 ft)

### Built-in Fixtures (in AI output + 2D rendering)
- **Kitchen**: Counter layout (L/U/parallel/island), sink position, hob/chimney placement, fridge spot — follow the work triangle (hob-sink-fridge)
- **Bathrooms**: Toilet, wash basin, shower/tub positions (to scale)
- **Bedrooms**: Wardrobe placement, bed position indicator
- **Living/Dining**: Furniture layout suggestions (sofa set, dining table)

### Annotations (in 2D renderer)
- **Dimensions**: Interior room dimensions (L×W), wall-to-wall measurements, overall plot dimensions
- **Scale bar**: "1 unit = 1 ft" visual reference
- **North arrow**: Compass indicator (already have this)
- **Room labels**: Room name + area in sqft (e.g. "Master Bedroom — 168 sqft")
- **Title block**: Project name, plot size, date, floor number
- **Line weights**: Thick for cut walls, medium for doors/windows, thin for dimensions/annotations
- **Door swing arcs**: Quarter-circle showing opening direction
- **Window symbols**: Parallel lines in wall with type indicator

### Indian-Specific Requirements
- **Puja room**: 5×7 ft minimum, northeast preferred, door facing east/north
- **Servant quarter**: 8×10 ft minimum, separate entrance option, attached bathroom (4×5 ft)
- **Wet/Dry kitchen**: Separate cooking area (wet) from prep/baking area (dry), chimney placement 24-30" above hob
- **Parking**: 8.2×16.4 ft per car, turning radius consideration
- **Balcony per bedroom**: Standard in Indian homes
- **Terrace**: For water tank, clothes drying, future expansion
- **Setbacks**: Front/back/side margins per local bylaws

### Standard Room Dimensions (Indian)

| Room | Minimum | Comfortable | Large |
|------|---------|-------------|-------|
| Master Bedroom | 10×12 ft | 12×14 ft | 14×16 ft |
| Secondary Bedroom | 10×10 ft | 10×12 ft | 12×14 ft |
| Kitchen (Wet) | 8×10 ft | 10×12 ft | 12×14 ft |
| Kitchen (Dry) | 6×8 ft | 8×10 ft | - |
| Living Room | 12×14 ft | 14×18 ft | 18×20 ft |
| Dining | 10×12 ft | 12×14 ft | 14×16 ft |
| Bathroom (Compact) | 4×5 ft | 5×8 ft | 6×8 ft |
| Master Ensuite | 4×6 ft | 6×8 ft | 8×10 ft |
| Puja Room | 5×5 ft | 5×7 ft | 7×9 ft |
| Servant Quarter | 8×8 ft | 8×10 ft | 10×10 ft |
| Parking (per car) | 8×16 ft | 9×18 ft | 10×20 ft |
| Study | 8×8 ft | 8×10 ft | 10×12 ft |

### Common Indian Plot Sizes

| Plot | Area | Typical Layout |
|------|------|----------------|
| 20×30 ft | 600 sqft | 1-2 BHK, very compact |
| 20×40 ft | 800 sqft | 2 BHK |
| 30×40 ft | 1200 sqft | 2-3 BHK |
| 30×50 ft | 1500 sqft | 3-4 BHK |
| 40×60 ft | 2400 sqft | 3-4 BHK with garage |
| 50×80 ft | 4000 sqft | Large independent home |

**Key ratio**: Ground floor construction = 60-75% of plot area (remaining for setbacks, parking, garden).

---

## Data Model — `src/types/floor-plan.ts`

Single source of truth: AI generation → 2D rendering → 3D rendering → optional Vastu.

Uses **real-world coordinates in feet** (not grid cells).

```ts
// Geometric primitives
interface Point2D { x: number; y: number }
interface Rect { x: number; y: number; width: number; height: number }

// Room with built-in fixture support
interface FloorPlanRoom {
  id: string
  type: RoomType
  label: string
  rect: Rect                    // feet from plot top-left
  zone: Zone                    // derived from position (for optional Vastu)
  isMainEntrance: boolean
  wallHeight: number            // default 10ft
  floorLevel: number            // 0 = ground
  fixtures: FloorPlanFixture[]  // built-in items (counter, toilet, wardrobe, etc.)
}

// Built-in fixtures (kitchen counter, bathroom fixtures, wardrobes)
type FixtureType = 'counter_L' | 'counter_U' | 'counter_parallel' | 'counter_island'
  | 'sink' | 'hob' | 'fridge' | 'chimney'
  | 'toilet' | 'wash_basin' | 'shower' | 'bathtub'
  | 'wardrobe' | 'bed_single' | 'bed_double' | 'bed_king'
  | 'sofa' | 'dining_table' | 'study_desk'

interface FloorPlanFixture {
  id: string
  type: FixtureType
  rect: Rect        // position relative to room origin
  rotation: number  // degrees (0, 90, 180, 270)
}

// Wall with load-bearing flag
interface FloorPlanWall {
  id: string
  start: Point2D; end: Point2D
  thickness: number               // 0.375 (4.5"), 0.5 (6"), 0.75 (9") in feet
  type: 'exterior' | 'interior' | 'partition'
  loadBearing: boolean
  height: number
}

// Door with swing direction
interface FloorPlanDoor {
  id: string; wallId: string
  position: number              // 0-1 along wall
  width: number
  style: 'single' | 'double' | 'sliding' | 'pocket' | 'french' | 'main_entrance'
  swingDirection: 'inward' | 'outward' | 'left' | 'right'
}

// Window with type
interface FloorPlanWindow {
  id: string; wallId: string
  position: number
  width: number; height: number
  sillHeight: number
  style: 'fixed' | 'sliding' | 'casement' | 'bay'
}

// Staircase (for multi-floor)
interface FloorPlanStaircase {
  id: string
  rect: Rect
  direction: 'up' | 'down'
  steps: number
  landingAt?: number  // step number where landing occurs
}

// Column (structural support)
interface FloorPlanColumn {
  id: string
  center: Point2D
  size: number  // square column side length in feet
}

// Complete floor plan
interface FloorPlan {
  meta: { id: string; name: string; generatedBy: 'ai' | 'manual'; style: DesignStyle }
  plot: {
    width: number; height: number
    facing: Direction; unit: 'ft' | 'm'
    setbacks: { front: number; back: number; left: number; right: number }
  }
  rooms: FloorPlanRoom[]
  walls: FloorPlanWall[]
  doors: FloorPlanDoor[]
  windows: FloorPlanWindow[]
  staircases: FloorPlanStaircase[]
  columns: FloorPlanColumn[]
}
```

---

## User Flow

```
[Style Picker] → [Input Form] → [AI generates] → [2D Architectural View] ⟷ [3D View]
                                                         ↕
                                                   [Edit rooms]
                                                         ↕
                                                [Vastu overlay (optional)]
```

1. **Style picker** — visual cards showing design styles with trending badges, user picks one
2. **Input wizard** — plot size (or pick common Indian size), facing, room count, preferences
3. **AI generation** — Claude returns structured JSON (rooms + walls + doors + windows + fixtures)
4. **2D view** — professional architectural drawing: wall thickness, door arcs, window symbols, fixture layouts, dimensions, room labels with sqft
5. **Edit** — click rooms to move/resize, click walls to add doors/windows, adjust fixtures
6. **Vastu overlay (optional)** — toggle to show zone tints, compass, violation indicators
7. **3D toggle** — lazy-loaded, extrudes walls, shows fixtures, orbit camera
8. **Export** — PNG/PDF download (future: Supabase save)

---

## Phase 1 — Data Model + AI Generation + Style Picker

**Goal**: User picks a style, enters details → Claude generates floor plan → renders as basic 2D view.

### Files to create

| File | Purpose |
|------|---------|
| `src/types/floor-plan.ts` | All TypeScript interfaces above |
| `src/data/design-styles.ts` | Style definitions, descriptions, layout hints, trending flags |
| `src/data/room-dimensions.ts` | Standard Indian room dimensions (min/comfortable/large) |
| `src/data/plot-presets.ts` | Common Indian plot sizes (20x30, 30x40, etc.) |
| `src/server/generate-floor-plan.ts` | `createServerFn` — Claude structured output |
| `src/lib/floor-plan-to-layout.ts` | `FloorPlan → LayoutInput` bridge for optional Vastu |
| `src/lib/zone-from-position.ts` | Derive Vastu Zone from (x,y) position |
| `src/lib/wall-generator.ts` | Auto-generate walls from room rects (fallback) |
| `src/hooks/use-floor-plan-store.ts` | FloorPlan state + undo stack |
| `src/components/floor-plan-designer/style-picker.tsx` | Visual style selection cards |
| `src/components/floor-plan-designer/design-wizard.tsx` | Input form (plot, rooms, preferences) |
| `src/components/floor-plan-designer/generation-loading.tsx` | Loading animation during AI gen |
| `src/routes/design.tsx` | New route `/design` |

### AI Server Function — `src/server/generate-floor-plan.ts`

Pattern: same as existing `analyze-floor-plan.ts`.

**Input** (Zod validated):
```ts
{
  plotWidth: 40, plotHeight: 30,
  facing: 'N',
  floors: 1,
  roomPreferences: [
    { type: 'master_bedroom', count: 1 },
    { type: 'bedroom', count: 2 },
    { type: 'kitchen', count: 1, wetDrySeparation: true },
    { type: 'puja', count: 1 },
    ...
  ],
  style: 'japandi',         // from style picker
  vastuCompliant: false,     // optional, default false
  setbacks: { front: 5, back: 3, left: 1.5, right: 1.5 }
}
```

**Claude prompt strategy**:
- System: "You are a senior residential architect with 20 years experience. Generate a professional floor plan as structured JSON. All coordinates in feet from top-left (0,0). Follow these rules:
  - Rooms must not overlap and must fit within plot minus setbacks
  - All rooms must have at least one door
  - Exterior walls should have windows (except bathrooms: small high window)
  - Kitchen must follow work triangle (hob-sink-fridge)
  - Include built-in fixtures: kitchen counter, bathroom fixtures, wardrobe in bedrooms
  - Staircase if multi-floor (min 3ft wide, landing at direction change)
  - Room dimensions must be realistic (use standard Indian sizes)"
- Style instruction: "Design in {style} style: {style-specific layout rules from design-styles.ts}"
- If `vastuCompliant`: append Vastu room placement rules
- Output: validate with Zod, post-process to derive zones + fill defaults
- Fallback: `wall-generator.ts` derives walls from room rects if Claude output malformed

### Style Picker Component

- Grid of visual cards (2-3 per row)
- Each card: style name, 1-2 line description, key features, trending badge if applicable
- Selected card highlighted with teal border
- Show "What this means for your plan" tooltip with layout impact details

### Design Wizard Component

- **Step 1**: Plot size — pick from presets (20×30, 30×40, etc.) or enter custom dimensions
- **Step 2**: Room count — bedrooms (stepper), bathrooms (stepper), toggles for puja/servant quarter/parking/study
- **Step 3**: Kitchen preference — open/closed, wet-dry separation toggle
- **Step 4**: Optional preferences — number of floors, balcony per bedroom, terrace, garden area
- **Step 5**: Generate button + Vastu compliance switch (off by default)
- Reuse shadcn components throughout

---

## Phase 2 — 2D Professional Renderer

**Goal**: Plans render as professional architectural drawings like a senior architect would produce.

### Files to create

| File | Purpose |
|------|---------|
| `src/components/floor-plan-designer/svg-viewport.tsx` | Zoom/pan wrapper |
| `src/components/floor-plan-designer/plan-renderer.tsx` | Composes all SVG layers |
| `src/components/floor-plan-designer/plan-viewer.tsx` | Container with 2D/3D toggle + toolbar |
| `src/components/floor-plan-designer/toolbar.tsx` | Zoom, grid, dimensions, Vastu, fixtures, export toggles |
| `src/components/floor-plan-designer/layers/wall-layer.tsx` | Thick wall rects with line weight (exterior thicker) |
| `src/components/floor-plan-designer/layers/room-layer.tsx` | Room fills + labels + area sqft |
| `src/components/floor-plan-designer/layers/door-layer.tsx` | Door swing arcs (quarter-circle) + sliding symbols |
| `src/components/floor-plan-designer/layers/window-layer.tsx` | Window symbols (parallel lines in wall) |
| `src/components/floor-plan-designer/layers/fixture-layer.tsx` | Kitchen counter, bathroom fixtures, wardrobes, bed outlines |
| `src/components/floor-plan-designer/layers/dimension-layer.tsx` | Room dimensions + overall dimensions with arrows |
| `src/components/floor-plan-designer/layers/column-layer.tsx` | Structural columns (filled squares) |
| `src/components/floor-plan-designer/layers/staircase-layer.tsx` | Steps + direction arrow + "UP"/"DN" label |
| `src/components/floor-plan-designer/layers/annotation-layer.tsx` | Scale bar, title block, legend |
| `src/components/floor-plan-designer/layers/vastu-overlay.tsx` | Zone tints + compass + violations (toggleable) |
| `src/hooks/use-viewport.ts` | Zoom/pan state |

### Key details
- SVG viewBox in feet with padding for dimension lines
- **Line weights**: Exterior walls = 2px stroke, interior = 1.5px, partition = 1px dashed, dimensions = 0.5px
- **Door arcs**: Quarter-circle from hinge point, radius = door width, thin stroke
- **Window symbols**: Break in wall + parallel lines (2 for sliding, 1 for fixed)
- **Fixtures**: Simplified SVG shapes — L-shape for counter, oval for toilet, rectangle for bed, circle for wash basin
- **Dimensions**: Thin lines outside rooms with arrows, text at midpoint
- **Scale bar**: Bottom-left corner, shows "5 ft" reference
- **Room labels**: Centered text: "Master Bedroom" + "168 sqft" below
- Toggle layers: dimensions, fixtures, grid, Vastu overlay
- Touch zoom/pan for mobile

---

## Phase 3 — 2D Editing

**Goal**: Interactive modification of AI-generated plans.

### Files to create

| File | Purpose |
|------|---------|
| `src/components/floor-plan-designer/editing/room-drag-handle.tsx` | Move/resize |
| `src/components/floor-plan-designer/editing/wall-editor.tsx` | Click wall → add door/window |
| `src/components/floor-plan-designer/editing/fixture-editor.tsx` | Move/rotate fixtures within room |

### Key details
- Click room → 8 resize handles + drag to move (snap to 0.5ft grid)
- Collision detection (rooms must not overlap)
- Click wall → "Add Door" / "Add Window" context menu
- Click fixture → rotate (90° snap) / reposition within room
- Delete key removes selected element
- If Vastu toggled on: live `analyzeVastu()` on every edit
- Undo/redo history stack
- "Regenerate" sends updated constraints back to Claude
- "Try Different Style" re-generates with different style selection

---

## Phase 4 — 3D View

**Goal**: Toggle to see floor plan extruded in 3D.

### New dependencies
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### Files to create

| File | Purpose |
|------|---------|
| `src/lib/plan-to-3d.ts` | 2D → Three.js coordinate conversion |
| `src/components/floor-plan-designer/three/scene.tsx` | Canvas + lights + camera |
| `src/components/floor-plan-designer/three/wall-mesh.tsx` | Extruded wall boxes |
| `src/components/floor-plan-designer/three/room-floor.tsx` | Colored floor planes |
| `src/components/floor-plan-designer/three/door-mesh.tsx` | Door gaps + panels |
| `src/components/floor-plan-designer/three/window-mesh.tsx` | Glass cutouts |
| `src/components/floor-plan-designer/three/fixture-mesh.tsx` | Basic 3D fixture shapes |
| `src/components/floor-plan-designer/three/room-label-3d.tsx` | Floating HTML labels |
| `src/components/floor-plan-designer/three/controls.tsx` | OrbitControls |

### Key details
- **Lazy-load**: `React.lazy()` — Three.js only loads on "3D View" click
- Wall extrusion from 2D segments, doors as gaps, windows as glass panels
- Basic fixture 3D shapes (counter block, toilet, bed box)
- OrbitControls with ground constraint
- 3D is **view-only** — editing stays in 2D
- Style affects 3D materials: Modern → clean white; Industrial → concrete/metal; Traditional → warm wood tones

---

## Files modified (existing)

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Add "Design" nav link |
| `src/routeTree.gen.ts` | Auto-updated by TanStack Router |
| `package.json` | Add three/r3f deps in Phase 4 |

## Files NOT modified
- `src/vastu/*` — stays untouched, bridged via optional `floorPlanToLayoutInput()`
- `src/components/floor-plan/*` — existing basic editor stays at `/floor-plan`
- `src/server/analyze-floor-plan.ts` — image analysis stays separate

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| SVG over Konva/Fabric for 2D | Already in codebase, CSS variable theming, no 130KB+ library for ~50 elements |
| Real-world feet coords | Claude outputs natural dimensions; users understand feet |
| Wall auto-generation fallback | Claude may produce malformed walls; derive from room rects |
| **Vastu is optional** | Core product is floor plan design; Vastu is a toggle overlay, default OFF |
| Fixtures in data model | Professional plans show kitchen counters, bathroom fixtures — not just empty rooms |
| Style picker drives AI prompt | Design style fundamentally changes room layout, proportions, openness |
| Indian room dimension standards | AI must output realistic Indian residential sizes, not arbitrary numbers |
| Plot presets | Common Indian plot sizes (20×30 to 50×80) as quick-pick options |
| Lazy-load Three.js | 150KB+ gzipped; only load when user clicks "3D View" |
| Separate `/design` route | Keeps existing `/floor-plan` basic editor intact |

---

## Common Mistakes to Prevent (AI validation)

The AI-generated plan and the post-processing step should flag/prevent:
- Kitchen too small for Indian cooking (min 8×10 ft)
- No attached bathroom for master bedroom
- Staircase blocking center of home
- Rooms with no doors
- Exterior rooms with no windows
- Kitchen far from dining room
- Living room used as pass-through (no privacy)
- Bedrooms facing noisy road side (front)
- Parking too narrow for car doors to open
- Servant quarter with no separate entrance option
- Missing balcony in upper floors
- Insufficient ventilation (bathrooms, kitchen)

---

## Verification

1. **Phase 1**: Pick "Japandi" style → enter "30×40 ft, 2 bedrooms, 1 kitchen" → Claude returns valid JSON with fixtures → rooms display as colored blocks
2. **Phase 2**: Same plan renders with thick walls, door swing arcs, window symbols, kitchen counter layout, bathroom fixtures, dimensions, scale bar → zoom/pan works → dark mode correct → toggle fixtures on/off
3. **Phase 3**: Click room → drag to new position → add door on wall → rotate kitchen counter → undo works → toggle Vastu overlay and score updates
4. **Phase 4**: Click "3D View" → extruded walls → door gaps → window glass → fixture shapes visible → orbit camera
5. **TypeScript**: `npx tsc --noEmit` — no new errors
6. **Mobile**: 2D view scrollable/zoomable, form responsive, style picker works on phone
