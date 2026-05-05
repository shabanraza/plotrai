# Pure Geometry Floor Plan Engine — Complete Specification

## Context & Problem

Current system uses Claude API to generate room coordinates. LLMs cannot do spatial geometry. Rooms have gaps, overlaps, walls don't connect, doors are misplaced. This is not fixable by "better prompts" — it's architecturally wrong.

**Solution**: Deterministic geometry engine using Squarified Treemap + Constraint Satisfaction + Indian NBC building code validation. Zero AI for coordinates. AI only for natural language parsing.

**Same inputs = same output EVERY TIME.**

---

## What We Can and Cannot Achieve

| Feature | Achievable? | Notes |
|---------|------------|-------|
| Room tiling with zero gaps/overlaps | ✅ YES | Squarified treemap guarantees this mathematically |
| Proper wall connections at corners/T-joints | ✅ YES | Walls derived from room edges |
| Door/window on correct walls | ✅ YES | Computed from room adjacency graph |
| Indian standard room sizes (NBC) | ✅ YES | Hardcoded standards database |
| Ventilation validation | ✅ YES | Window-to-floor-area ratio checks |
| Instant generation (<100ms) | ✅ YES | Pure math, no API call |
| Garden/gym/outdoor areas | ✅ YES | Treated as rooms in outdoor zone |
| Guest room with dual doors | ✅ YES | Special room constraint rules |
| Rooms split across zones (front/back) | ✅ YES | Zone placement rules per room type |
| L-shaped/irregular plots | ⚠️ Phase 2 | Rectangular first, L-shape later |
| Multi-floor staircase alignment | ⚠️ Basic | Staircase reserved first, floors stacked |
| Full structural engineering | ❌ NO | Needs actual engineering software |
| Material/cost estimation | ❌ Future | Needs BOQ database |

---

## Architecture

```
[Natural Language / Form Input]
        ↓
[LLM Parser] → extracts: plot size, room count, style, preferences
        ↓
[Geometry Engine] → 5 stages:
   1. Zone Allocation (public/private/service/outdoor)
   2. Squarified Treemap (room tiling within zones)
   3. Constraint Solver (adjacency, attached bathrooms, dual-access rooms)
   4. Wall Generation (shared walls, exterior boundary)
   5. Door & Window Placement (adjacency graph + ventilation rules)
        ↓
[Validation Layer] → NBC checks, ventilation, size warnings, adjacency checks
        ↓
[SVG Renderer] → technical drawing with walls, doors, windows, dimensions
```

---

## The Algorithm — Step by Step

### Stage 1: Zone Allocation

Divide the buildable area into **4 functional zones** (not 3):

| Zone | What goes here | % of buildable area | Position rule |
|------|---------------|--------------------|----|
| **Public** | Living, dining, drawing, entrance | 25-35% | Front (facing direction) |
| **Private** | Bedrooms (master, kids, guest) | 35-45% | Back (quiet side, away from road) |
| **Service** | Kitchen, bathrooms, toilets, store, servant quarter | 15-25% | Side (access to plumbing wall) |
| **Outdoor** | Garden, gym, parking, balcony, terrace, courtyard | Remaining | Edges / setback area |

**Zone placement changes by facing direction:**

```
North-facing plot:          East-facing plot:
┌──────────────────┐        ┌──────────────────┐
│   PUBLIC (front)  │  N     │ SERV │  PUBLIC   │  E
│   Living/Entrance │        │      │  Living   │
├────────┬─────────┤        ├──────┤  Entrance  │
│ SERV   │ PRIVATE │        │PRIV  ├───────────┤
│Kitchen │ Bedrooms│        │Beds  │  OUTDOOR  │
│Bath    │         │        │      │  Garden   │
├────────┴─────────┤        └──────┴───────────┘
│   OUTDOOR/Park   │  S
└──────────────────┘
```

**How zone split works geometrically:**
1. Calculate buildable rect: `(setback_left, setback_front)` to `(plot_width - setback_right, plot_height - setback_back)`
2. Split buildable rect into 2-4 sub-rects based on zone areas
3. Split direction: along the LONGER axis first (landscape plot = vertical split, portrait = horizontal)
4. Each sub-rect becomes a zone container

---

### Stage 2: Squarified Treemap (Room Tiling Within Zones)

**Why squarified treemap?**
- Standard treemap produces thin elongated rectangles
- Squarified version optimizes for aspect ratio ≈ 1.0 (square-ish rooms)
- Mathematically guarantees: rooms fill the zone rectangle COMPLETELY, no gaps, no overlaps

**Algorithm (per zone):**
```
function squarifiedLayout(rooms[], container_rect):
  if rooms.length == 0: return
  if rooms.length == 1: assign rooms[0] = container_rect; return
  
  Sort rooms by area (largest first)
  
  current_row = []
  remaining = [...rooms]
  
  while remaining.length > 0:
    // Try adding next room to current row
    candidate = [...current_row, remaining[0]]
    
    // Calculate aspect ratios if we add this room
    if worst_aspect_ratio(candidate, container) <= worst_aspect_ratio(current_row, container):
      current_row = candidate
      remaining.shift()
    else:
      // Finalize current row, start new row
      layoutRow(current_row, container)
      shrink container by the row's width
      current_row = []
  
  // Layout any remaining rooms
  if current_row.length > 0:
    layoutRow(current_row, container)
```

**Room area calculation:**
- Each room gets area based on: `max(minArea, buildable_zone_area × room_weight / total_weight)`
- `room_weight` = priority from standards database (living=10, master_bed=9, kitchen=8...)
- If total room area > zone area → rooms get proportionally squeezed → validation warns about small rooms

---

### Stage 3: Constraint Solver (The Hard Part)

After treemap places rooms, apply architectural constraints. Some constraints modify the layout.

#### Constraint 1: Attached Bathroom

**When**: Master bedroom (or any bedroom with `attachedBathroom: true`)

**Algorithm**:
1. Find the master bedroom rect from treemap output
2. Determine which edge to carve: prefer the shorter dimension's end
3. Split: 70% bedroom, 30% bathroom (min bathroom width: 5ft)
4. Bathroom gets wall on 3 sides + shared wall with bedroom
5. Door: placed on the shared wall

```
Before:                After:
┌──────────────┐       ┌──────────┬───┐
│              │       │          │   │
│  Master Bed  │  →    │ Master   │ WC│
│  14×12       │       │ Bed 10×12│5×6│
│              │       │          │   │
└──────────────┘       └──────────┴───┘
```

#### Constraint 2: Guest Room with Dual Access

**When**: Guest bedroom with `dualAccess: true` OR room type is `guest_bedroom`

**Algorithm**:
1. Guest room MUST be placed on the house exterior boundary (has at least one exterior wall)
2. Door 1: Interior door on shared wall with living/corridor (for family access)
3. Door 2: Exterior door on exterior wall (for guest direct entry from outside)
4. If guest room is NOT on exterior → validation error: "Guest room needs exterior wall for separate entrance"

```
┌─────────────────────┐
│     Living Room      │
├──────────┬──────────┤
│          │  Guest   │←── Door 2 (exterior, direct entry)
│ Kitchen  │  Room    │
│          │     ↑    │
└──────────┴──Door 1──┘
                (interior, to living)
```

#### Constraint 3: Rooms in Specific Positions (Front/Back/Side)

**When**: User specifies room position preference

**Room position rules** (default, user can override):
| Room Type | Default Position | Why |
|-----------|-----------------|-----|
| Living/Drawing | Front (facing side) | Welcoming, road-facing |
| Entrance | Front (facing side) | Main access point |
| Master Bedroom | Back (quiet side) | Privacy, noise isolation |
| Kids Bedroom | Back or side | Safety, quiet |
| Guest Bedroom | Front or side | Separate access, convenience |
| Kitchen | Side or back | Service access, ventilation |
| Parking | Front | Vehicle access from road |
| Garden | Back or side | Privacy, open space |
| Servant Quarter | Back or side | Service access |
| Puja Room | Inside (no specific edge needed) | Quiet, private |

**Algorithm for position enforcement:**
1. Tag each room with its position preference: `front`, `back`, `left`, `right`, `any`
2. During zone allocation, rooms tagged `front` go to the zone closest to facing direction
3. Rooms tagged `back` go to the opposite zone
4. If a room MUST be on an exterior wall (guest room, parking), validate after placement

#### Constraint 4: Garden / Gym / Outdoor Areas

**When**: User adds garden, gym, courtyard, terrace, or open area

**Types of outdoor/special spaces:**

| Space | Where it goes | Algorithm behavior |
|-------|---------------|-------------------|
| Front garden/lawn | Between setback and house boundary (front) | Deducted from front setback area, NOT from buildable area |
| Back garden | Between house boundary and back setback | Same as front but on back side |
| Internal courtyard | Center of house | Reserve a rect in the CENTER of buildable area BEFORE zone allocation. Zones wrap around it. |
| Gym/home office | Inside house (treated as a room) | Added to Private zone with room type `gym` or `study` |
| Parking | Front, outside main house footprint | Placed in setback area or as first room in front zone |
| Terrace | Upper floor open area | On floor 2+, mark a portion as open (no roof) |
| Balcony | Attached to bedroom, on exterior edge | Carve from room rect (like attached bathroom but smaller, on exterior wall side) |

**Internal courtyard algorithm:**
```
If courtyard requested:
  1. Calculate courtyard size: min(12×12 ft, 15% of buildable area)
  2. Place courtyard rect at CENTER of buildable area
  3. Split remaining buildable area into 4 L-shaped zones around courtyard
  4. Assign Public/Private/Service to the L-zones based on facing direction
  5. Courtyard provides natural light + ventilation to all surrounding rooms
```

```
Courtyard layout:
┌──────┬────────┬──────┐
│ Bed  │Courtyd │ Bed  │
├──────┤ (open) ├──────┤
│Living│        │Kitchn│
├──────┴────────┴──────┤
│       Entrance       │
└──────────────────────┘
```

#### Constraint 5: 2BHK with Separated Bedrooms

**When**: User has 2+ bedrooms that should NOT be adjacent (e.g., one front, one back)

**Algorithm**:
1. If user marks a bedroom as `position: 'front'` and another as `position: 'back'`
2. During zone allocation, these rooms go to DIFFERENT zones
3. The treemap for each zone places them independently
4. They end up on opposite sides of the house — separated by living/service rooms in between
5. This naturally creates the "one front, one back" layout

```
2BHK with separated bedrooms:
┌──────────────────────┐
│  Guest Bed (front)   │ ← road facing, has exterior door
├──────────┬───────────┤
│          │           │
│  Living  │  Kitchen  │
│          │           │
├──────────┴───────────┤
│  Master Bed (back)   │ ← quiet side, private
└──────────────────────┘
```

#### Constraint 6: Corridor/Passage Generation

**When**: Rooms are NOT all directly adjacent to each other (common in larger homes)

**Problem**: In a simple treemap, every room touches at least one other room. But if room A needs to access room C, and room B is between them, you need a corridor.

**Algorithm**:
1. After treemap layout, build reachability graph: can you get from entrance to every room through doorways?
2. If any room is UNREACHABLE (no door path from entrance to room):
   - Option A: Add a corridor strip (3ft wide) between the unreachable room and the nearest reachable room
   - Option B: Rearrange rooms so the unreachable room becomes adjacent to a reachable one
3. Corridor is a special room type: `corridor`, width exactly 3-4ft, runs along the length needed
4. For homes with 5+ rooms: always insert a corridor spine connecting all zones

```
Large home with corridor:
┌──────┬──────┬──────┐
│ Bed1 │ Bed2 │ Bed3 │
├──────┴──────┴──────┤
│   C O R R I D O R  │ ← 3.5ft wide passage
├──────┬──────┬──────┤
│Living│Dining│Kitchn│
└──────┴──────┴──────┘
```

#### Constraint 7: Plumbing Wall Alignment

**When**: Always (reduces construction cost)

**Rule**: All wet rooms (kitchen, bathrooms, toilets) should share a "plumbing wall" — a single wall run that carries water supply and drainage pipes.

**Algorithm**:
1. After zone allocation, ensure all Service zone rooms share at least one common wall line
2. Ideally: kitchen and bathrooms are on the same side of the house (plumbing stack on one wall)
3. Validation: if wet rooms are scattered across 3+ different walls → warning "plumbing complexity high, consider grouping wet rooms"

---

### Stage 4: Wall Generation

After rooms are finalized by the constraint solver:

1. **Find house boundary**: outer envelope of all room rects
2. **Exterior walls**: 4 walls around house boundary (thickness 0.75ft, load-bearing)
3. **Interior walls**: every shared edge between two adjacent rooms (thickness 0.5ft)
4. **Partition walls**: bathroom-to-bedroom dividers (thickness 0.375ft)
5. **Wall merging**: if two wall segments are collinear and touching → merge into one wall
6. **Wall IDs**: sequential w1, w2, w3... for deterministic output

**Corner joints**: Where walls meet at T or L joints, the polygon overlap naturally creates solid corners. No special handling needed in SVG rendering.

---

### Stage 5: Door & Window Placement

#### Doors

1. Build **room adjacency graph** from room geometry
2. For each room, pick the best door wall based on type:

| Room | Door connects to | Special rules |
|------|-----------------|---------------|
| Entrance | Exterior wall (facing side) | Main entrance, 3.5ft wide |
| Living | Entrance + Dining | May have 2 doors |
| Dining | Living + Kitchen | |
| Kitchen | Dining | 3ft door |
| Master Bedroom | Corridor/Living | 3ft door |
| Attached Bathroom | Its parent bedroom | 2.5ft door, on shared wall |
| Common Bathroom | Corridor | 2.5ft door |
| Guest Bedroom | Living (interior) + Exterior wall (separate entry) | 2 doors if dual-access |
| Puja Room | Living or corridor | 2.5ft door |
| Store | Kitchen or corridor | 2.5ft door |
| Parking | Exterior wall | Wide opening, 8ft |
| Servant Quarter | Exterior wall or service corridor | Separate access |

3. Door position: centered on shared wall, offset if another door already exists
4. Minimum distance between two doors on same wall: 3ft

#### Windows

1. Identify exterior walls for each room
2. Calculate required window area: `floor_area × ventilation_ratio` (from NBC standards)
3. Place windows on exterior walls, avoiding door zones (3ft clearance from any door)

| Room | Window size | Ventilation ratio | Special |
|------|-----------|-------------------|---------|
| Living | 5ft × 4ft | 10% | Multiple windows if large room |
| Bedrooms | 4ft × 4ft | 10% | At least 1 per bedroom |
| Kitchen | 3.5ft × 4ft | 12% | Must have for exhaust |
| Bathroom | 2ft × 2ft | 8% | High sill (5ft) for privacy |
| Toilet | 1.5ft × 1.5ft | 8% | Optional, can use exhaust fan |
| Dining | 3.5ft × 4ft | 10% | |
| Study | 3ft × 4ft | 10% | |
| Rooms with NO exterior wall | — | — | Validation WARNING |

4. If a room has NO exterior wall: flag it as ventilation warning, suggest exhaust fan

---

## Indian Building Standards Database

### Room Sizes (NBC + Market Preferred)

| Room | NBC Minimum | Market Preferred | Luxury | Min Width | Min Height |
|------|-----------|-----------------|--------|-----------|------------|
| Master Bedroom | 120 sqft | 168 sqft (12×14) | 224 sqft (14×16) | 10 ft | 10 ft |
| Bedroom | 100 sqft | 120 sqft (10×12) | 168 sqft (12×14) | 10 ft | 10 ft |
| Kids Bedroom | 90 sqft | 110 sqft (10×11) | 132 sqft (11×12) | 9 ft | 10 ft |
| Guest Bedroom | 100 sqft | 120 sqft (10×12) | 168 sqft (12×14) | 10 ft | 10 ft |
| Kitchen | 50 sqft | 100 sqft (10×10) | 168 sqft (12×14) | 7 ft | 7 ft |
| Dining | 80 sqft | 120 sqft (10×12) | 168 sqft (12×14) | 8 ft | 8 ft |
| Living Room | 120 sqft | 210 sqft (14×15) | 360 sqft (18×20) | 12 ft | 12 ft |
| Drawing Room | 100 sqft | 156 sqft (12×13) | 224 sqft (14×16) | 10 ft | 10 ft |
| Puja Room | 25 sqft | 35 sqft (5×7) | 63 sqft (7×9) | 5 ft | 5 ft |
| Study | 48 sqft | 80 sqft (8×10) | 120 sqft (10×12) | 7 ft | 7 ft |
| Store Room | 25 sqft | 36 sqft (6×6) | 64 sqft (8×8) | 5 ft | 5 ft |
| Toilet | 15 sqft | 24 sqft (4×6) | 35 sqft (5×7) | 3.5 ft | 4 ft |
| Bathroom | 25 sqft | 40 sqft (5×8) | 80 sqft (8×10) | 5 ft | 5 ft |
| Parking (1 car) | 100 sqft | 144 sqft (9×16) | 200 sqft (10×20) | 8 ft | 16 ft |
| Servant Quarter | 48 sqft | 80 sqft (8×10) | 100 sqft (10×10) | 8 ft | 8 ft |
| Balcony | 20 sqft | 40 sqft (4×10) | 72 sqft (6×12) | 4 ft | 5 ft |
| Staircase | 24 sqft | 35 sqft (3.5×10) | 60 sqft (5×12) | 3 ft | 8 ft |
| Entrance/Foyer | 16 sqft | 30 sqft (5×6) | 48 sqft (6×8) | 4 ft | 4 ft |
| Corridor | — | 3.5 ft wide × length | 4 ft wide | 3 ft | — |
| Garden | — | User defined | — | — | — |
| Gym | 64 sqft | 120 sqft (10×12) | 200 sqft (10×20) | 8 ft | 8 ft |
| Home Office | 48 sqft | 80 sqft (8×10) | 120 sqft (10×12) | 7 ft | 7 ft |

### Staircase Standards (NBC)

| Parameter | Value | Source |
|-----------|-------|--------|
| Riser height (max) | 19cm (7.5") | NBC |
| Riser height (optimal) | 15cm (6") | IS 1642 |
| Tread depth (min) | 25cm (10") | NBC |
| Width (min residential) | 900mm (3ft) | NBC |
| Width (comfortable) | 1050mm (3.5ft) | Practice |
| Max risers per flight | 15 | NBC |
| Landing min depth | Equal to stair width | NBC |
| Headroom clearance | 2.1m (7ft) minimum | NBC |
| Comfort formula | 2R + T = 600-630mm | IS 1642 |

### Ventilation Standards (NBC)

| Room | Window area as % of floor area | Special |
|------|-------------------------------|---------|
| Habitable rooms | 10% minimum | — |
| Kitchen | 12% minimum | Must have exhaust outlet |
| Bathroom | 8% minimum | Min 0.37 sqm window area |
| Toilet | 8% minimum | Can substitute with exhaust fan |
| Corridor | 5% if enclosed | — |
| Internal courtyard | Min 3m × 3m | NBC Chapter 4 |

### Structural Rules

| Parameter | Value | Source |
|-----------|-------|--------|
| Column spacing (typical) | 3-4m (10-13ft) | IS 456:2000 |
| Column spacing (max) | 4.5m (15ft) | Practice |
| Column size (G+0) | 9" × 9" (230mm) | Practice |
| Column size (G+1) | 12" × 12" (300mm) | Practice |
| Exterior wall | 9" (230mm) load-bearing | Practice |
| Interior wall | 6" (150mm) | Practice |
| Partition wall | 4.5" (115mm) | Practice |
| Ceiling height (min) | 9ft (2.75m) | NBC |
| Ceiling height (comfortable) | 10ft (3.05m) | Market preferred |

---

## Kitchen Layout Patterns (Sub-Engine)

Kitchen is the most geometrically complex room. The algorithm auto-selects a layout based on room dimensions.

### Layout Selection Rules

| Layout | Min Room Size | Min Width | When Auto-Selected |
|--------|-------------|-----------|-------------------|
| One-wall | 48 sqft (8×6) | 8 ft wall | Width < 8ft OR area < 60 sqft |
| Galley/Parallel | 70 sqft (7×10) | 7 ft | Width 7-9ft, depth > 10ft |
| L-shaped | 100 sqft (10×10) | 10 ft | Width 10-13ft (most common Indian) |
| U-shaped | 100 sqft (10×10) | 10 ft | Width 10-12ft, 3 walls available |
| Island | 144 sqft (12×12) | 12 ft | Width ≥ 12ft AND area ≥ 144 sqft |
| Peninsula | 120 sqft (10×12) | 10 ft | Width 10-14ft, open to dining |
| G-shaped | 150 sqft (13×12) | 13 ft | Large kitchen, 200+ sqft |

### Work Triangle Validation
- Points: Hob → Sink → Fridge
- Each side: 4-9 ft
- Total perimeter: 13-26 ft
- Obstacle intrusion: max 12"
- Clearance between parallel counters (galley): min 3ft, ideal 4-5ft
- Island clearance: 36" minimum on all sides, 42-48" with seating

### Indian Wet-Dry Kitchen Geometry
When user enables `wetDrySeparation`:
1. Split kitchen rect: 60% wet (cooking zone) + 40% dry (prep zone)
2. Separation: partition wall with pass-through opening or sliding door
3. Wet zone: hob, chimney (24-30" above hob), main sink, spice storage — MUST have exterior wall
4. Dry zone: secondary counter, oven, fridge, prep area
5. Chimney clearance: 60-75 cm above cooktop

### Kitchen Fixture Placement Order
1. Select layout type from room dimensions
2. Place counters along walls per layout pattern
3. Hob: on counter AWAY from window (fire safety), near chimney wall
4. Sink: on counter NEAR window (natural light for washing)
5. Fridge: at triangle endpoint near entry (quick access)
6. Validate work triangle perimeter
7. If island: center of room, 36"+ clearance all sides

---

## Bathroom Layout Patterns (Sub-Engine)

### Bathroom Types

| Type | Fixtures | Min Size | Typical Size | When Used |
|------|---------|----------|-------------|-----------|
| Powder room | Toilet + basin | 15 sqft (3×5) | 20 sqft (4×5) | Guest half-bath, near entrance |
| 3/4 bath | Toilet + basin + shower | 35 sqft (5×7) | 40 sqft (5×8) | Common bathroom |
| Full bath | Toilet + basin + shower + tub | 48 sqft (6×8) | 60 sqft (6×10) | Master ensuite |
| Luxury ensuite | Toilet + double basin + shower + tub | 70 sqft (7×10) | 100 sqft (10×10) | Master suite luxury |

### Fixture Spacing (NBC)
- Between any two fixtures: 30" (2.5ft) minimum
- Clearance in front of fixture: 24" (2ft) minimum
- Toilet center to side wall: 15" minimum
- Shower interior: min 30×30" (2.5×2.5 ft)
- Bathtub: min 60×32" (5×2.7 ft)

### Fixture Placement Algorithm
1. Determine bathroom type from area
2. Toilet: against back wall, away from door
3. Basin: near door side (first thing accessed)
4. Shower: corner opposite basin (wet zone separation)
5. Tub (if full bath): along longest wall
6. Validate all 30" spacing rules
7. Wet zone (shower/tub) separated from dry zone (basin/toilet)

---

## Bedroom Layout Patterns (Sub-Engine)

### Master Suite Carve-Out
When master bedroom area ≥ 150 sqft, auto-carve:
- Attached bathroom: 30% of rect (min 5×7 ft), shared wall with bedroom
- Walk-in closet: 15% of rect (min 4×6 ft, only if total > 200 sqft)
- Bed: centered on longest wall, opposite window
- Wardrobe: wall adjacent to closet/bathroom

### Kids Bedroom + Study Nook
When `kids_bedroom` and area ≥ 100 sqft:
- Study desk: along window wall (natural light), 4×2 ft minimum
- Bed: opposite side from desk
- Bookshelf: between bed and desk as visual separator

### Guest Bedroom Dual-Access
- Must be on house exterior boundary
- Door 1: interior, on shared wall with living/corridor
- Door 2: exterior, direct entry from outside for guest independence
- If not on exterior → validation error

---

## BHK Layout Templates

Pre-defined room configurations. User selects BHK type → rooms auto-populated.

### 1BHK (450-600 sqft)
| Room | Count | Typical Size |
|------|-------|-------------|
| Bedroom | 1 | 10×12 ft |
| Living + Dining | 1 combined | 12×14 ft |
| Kitchen | 1 | 8×8 ft |
| Bathroom | 1 | 5×7 ft |
| Entrance | 1 | 4×4 ft |

### 2BHK (650-800 sqft)
| Room | Count | Typical Size |
|------|-------|-------------|
| Master Bedroom + Bath | 1 | 12×12 ft + 5×7 ft |
| Bedroom | 1 | 10×12 ft |
| Living + Dining | 1 combined | 14×14 ft |
| Kitchen | 1 | 8×10 ft |
| Common Bathroom | 1 | 5×7 ft |
| Entrance | 1 | 4×5 ft |

### 3BHK (900-1200 sqft)
| Room | Count | Typical Size |
|------|-------|-------------|
| Master Bedroom + Bath | 1 | 12×14 ft + 6×8 ft |
| Bedroom | 2 | 10×12 ft each |
| Living | 1 | 14×15 ft |
| Dining | 1 | 10×12 ft |
| Kitchen | 1 | 10×10 ft |
| Common Bathroom | 1 | 5×8 ft |
| Puja Room | 1 | 5×7 ft |
| Entrance | 1 | 5×5 ft |

### 3BHK + Servant (1200-1500 sqft)
Same as 3BHK plus:
| Servant Quarter | 1 | 8×10 ft |
| Servant Bathroom | 1 | 4×5 ft |
Servant quarter: near kitchen, separate exterior access

### Duplex
**Ground floor**: parking, entrance, living, dining, kitchen, 1 bedroom, common bath, staircase
**First floor**: master bed + ensuite, 2 bedrooms, study/office, terrace, staircase (aligned)

### Row House (12-20ft wide, 40-60ft deep)
Rooms stack front-to-back. Only front/rear facade windows.
**Ground**: parking/entrance → living → kitchen
**First**: bedroom1 → bedroom2 → bathroom
Staircase: central spine dividing left/right

### Corner Plot (2 open sides)
Primary entrance: main road face
Secondary entrance: side road (service/parking)
Bedrooms: quieter side. Living: main road face.
Advantage: windows on 2 faces, cross-ventilation.

---

## Design Style Impact on Layout Geometry

| Style | Zone Split | Kitchen | Corridor | Outdoor |
|-------|-----------|---------|----------|---------|
| Modern | Open public zone (living+dining+kitchen merged) | Island/peninsula, open to living | No corridor, open flow | Balconies |
| Traditional Indian | Separate rooms, formal drawing | Closed, L/U-shaped | Central corridor connecting rooms | Courtyard, verandah |
| Compact/Budget | Maximized room area, no wasted space | One-wall or L-shaped | No corridor | Balcony only |
| Indo-Contemporary | Semi-open (kitchen open to dining, living separate) | L-shaped with breakfast bar | Minimal corridor | Sit-out, balcony |
| South Indian | Rooms around courtyard | Separate closed kitchen | Verandah as corridor | Central courtyard |
| Luxury Villa | Multiple living zones, generous proportions | Island kitchen, wet-dry separation | Grand foyer + corridor | Garden, terrace, sit-out |

### Open Concept Geometry
When style is `modern`, `japandi`, `minimalist`, or `scandinavian`:
- Living + Dining + Kitchen = ONE merged zone (no walls between them)
- Kitchen island serves as visual separator
- Single large rect instead of 3 separate rects
- Minimum combined area: 300 sqft for comfortable open plan
- Clearance: 36" thoroughfare width between zones

---

## Edge Cases & How Algorithm Handles Them

### Edge Case 1: Too many rooms for plot size
**Scenario**: User adds 8 rooms to a 20×30 plot (600 sqft buildable ≈ 480 sqft after setbacks)
**Algorithm**: Rooms get proportionally squeezed. Some fall below NBC minimum.
**User response**: Validation shows: "⚠️ Master Bedroom is 85 sqft — below NBC minimum 120 sqft. Remove a room or increase plot size."

### Edge Case 2: All rooms requested are bedrooms (no living/kitchen)
**Scenario**: User adds 4 bedrooms, 0 living, 0 kitchen
**Algorithm**: No Public or Service zone allocated. All rooms go to Private zone.
**User response**: Validation shows: "ℹ️ No living room or kitchen included. Consider adding them for a complete home."

### Edge Case 3: Garden larger than remaining plot
**Scenario**: 30×40 plot, user wants 500 sqft garden + 3BHK
**Algorithm**: Garden allocated first from outdoor zone. If it exceeds 40% of buildable area → warning.
**User response**: "⚠️ Garden takes 60% of buildable area. Indoor rooms will be smaller than recommended."

### Edge Case 4: Parking on a narrow plot
**Scenario**: 20×30 plot, parking requested (needs 9×16 ft)
**Algorithm**: Parking requires 144 sqft = 30% of 480 sqft buildable. Placed at front, takes nearly full width.
**User response**: If parking takes >25% → warning: "Parking takes significant space. Consider separate parking structure."

### Edge Case 5: Internal courtyard on small plot
**Scenario**: 20×30 plot with courtyard request
**Algorithm**: Courtyard minimum 9×9 ft = 81 sqft. On 480 sqft buildable, that's 17%.
**User response**: If plot < 1200 sqft total → "Plot too small for internal courtyard. Consider a light well or skylight instead."

### Edge Case 6: Multi-floor with ground-floor parking
**Scenario**: G+1 with parking on ground floor
**Algorithm**: 
1. Reserve staircase area (3.5×10 ft)
2. Reserve parking at front (9×16 ft) 
3. Ground floor: parking + entrance + living + kitchen + dining + staircase
4. Upper floor: all bedrooms + bathrooms + staircase (same position)

### Edge Case 7: Duplex internal staircase placement
**Scenario**: Duplex where staircase must be accessible from living area but not visible
**Algorithm**: Staircase placed adjacent to living room but behind a wall. Door from living to staircase lobby.

---

## Room Types — Extended List

Beyond the standard 18 types, the algorithm should support:

| Room Type | Zone | Position | Ventilation | Special Rules |
|-----------|------|----------|-------------|---------------|
| `garden` | Outdoor | Back/side | N/A (open) | In setback area, not buildable |
| `gym` | Private | Any | 10% | Min 8×8 ft, needs ventilation |
| `home_office` | Private | Any | 10% | Min 7×7 ft |
| `courtyard` | Center | Center | Open to sky | Min 9×9 ft, rooms wrap around |
| `corridor` | Any | Auto-generated | 5% if enclosed | 3-4ft wide, connects zones |
| `utility` | Service | Back | 5% | Washing machine, water heater |
| `prayer_hall` | Private | Center/quiet | 5% | Larger version of puja room |
| `terrace` | Outdoor | Upper floor | Open | No roof, railing required |
| `sit_out` | Outdoor | Front/back | Open | Covered, open sides |
| `car_porch` | Outdoor | Front | Open | Covered, no walls |

---

## Data Sources

| Data | Source | Confidence |
|------|--------|------------|
| Room minimum sizes | NBC India Chapter 4 + IS 3861 | Official standard |
| Room recommended sizes | Builder market data (99acres, MagicBricks) | Industry practice |
| Ventilation ratios | NBC Chapter 4, Section 4.4.4 | Official standard |
| Staircase dimensions | NBC Chapter 4 + IS 1642 | Official standard |
| Ceiling height | NBC 2.75m habitable rooms | Official standard |
| Column spacing | IS 456:2000 | Engineering standard |
| Wall thickness | Indian construction practice (9"/6"/4.5") | Industry practice |
| Setback rules | City-specific (defaults provided) | Approximate |
| Fire safety | NBC Chapter 7, IS 1644 | Official standard |
| Adjacency rules | Architectural best practices + Indian lifestyle | Professional practice |

---

## Implementation Files

| File | Action | What |
|------|--------|------|
| `src/lib/layout-engine.ts` | **Rewrite** | Squarified treemap + zone allocation + all 7 constraints |
| `src/data/indian-building-standards.ts` | **Create** | NBC room sizes, ventilation, staircase, structural rules |
| `src/lib/plan-validator.ts` | **Create** | NBC validation with error/warning/info |
| `src/lib/door-generator.ts` | **Create** | Adjacency graph → door placement (including dual-access) |
| `src/lib/window-generator.ts` | **Create** | Exterior walls → window placement (ventilation-aware) |
| `src/lib/wall-generator.ts` | **Modify** | Collinear merging, T-joint handling |
| `src/server/generate-floor-plan.ts` | **Modify** | Remove AI, use geometry engine pipeline |
| `src/types/floor-plan.ts` | **Modify** | Add ValidationResult, new room types, room constraints |
| `src/components/floor-plan-designer/plan-viewer.tsx` | **Modify** | Show validation panel |
| `src/components/floor-plan-designer/sidebar-controls.tsx` | **Modify** | Add room position preferences, garden/gym/courtyard options |

---

## Verification

1. **30×40 plot, 3BHK**: master bed + 2 bed + kitchen + dining + living + 2 bath + entrance → all rooms tile, walls connect, doors on shared walls, windows on exterior
2. **20×30 plot, 2BHK**: same rooms → warnings about small sizes
3. **Same input twice → identical output** (deterministic)
4. **Different facing (N vs E) → rooms rearranged**
5. **Guest room dual-access**: 2 doors (interior + exterior)
6. **Garden + 3BHK**: garden in outdoor zone, house rooms in buildable area
7. **Internal courtyard**: rooms wrap around courtyard center
8. **G+1 with parking**: parking on ground, bedrooms upstairs, staircase aligned
9. **8 rooms on 20×30**: validation errors for undersized rooms
10. **Generation instant** (<100ms)
11. `npx tsc --noEmit` — no errors
