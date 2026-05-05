# Vastu Checker — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Scope:** Phase 2 of PlotRAI — a form-based Vastu compliance checker UI that uses the Rule Engine from Phase 1.

---

## Context

The Vastu Rule Engine (`src/vastu/`) is complete with 14 rules, scoring, and remedies. The Vastu Checker is the first user-facing feature — a public page where anyone can input their plot details and room placements to get an instant Vastu compliance report.

Every competitor (Grihafy, Vaastu AI, Kshetra AI) is upload-only and light-theme-only. PlotRAI's checker is form-based with live validation and supports both dark and light themes.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Input mode | Form only (v1) | No image upload, feeds directly to rule engine |
| Room input UX | Dropdown per room | Simple, maps directly to engine input |
| Report display | Inline results + PDF download | Show results on page AND offer PDF export |
| Access | Public, no auth | Great for SEO and user acquisition |
| UI layout | Single page with scroll | Form at top, results below after submission |
| Color palette | Teal + Zinc | Both dark and light mode, differentiates from competitors |
| Component library | shadcn/ui | Already installed, Radix-based, Tailwind-native |

## Color System

### Teal + Zinc Palette

**Light mode:**
- Background: `#ffffff` / Surface: `#f4f4f5`
- Text primary: `#18181b` / Text secondary: `#a1a1aa`
- Accent: `#0d9488` (teal-600) / Accent light: `#f0fdfa`
- Borders: `#e4e4e7`

**Dark mode:**
- Background: `#09090b` / Surface: `#18181b`
- Text primary: `#fafafa` / Text secondary: `#71717a`
- Accent: `#14b8a6` (teal-400) / Accent dark: `#0d2d2a`
- Borders: `#27272a`

**Status colors (both modes):**
- Critical/Error: `#dc2626` (red-600) / dark: `#f87171`
- Warning/High: `#d97706` (amber-600) / dark: `#fbbf24`
- Success/Good: `#16a34a` (green-600) / dark: `#4ade80`
- Soft/Info: `#0d9488` (teal-600) / dark: `#5eead4`

## Page Structure

Route: `/vastu-checker`

### Section 1: Hero + Form

**Plot Details (top of form):**
- Length (number input, ft/m)
- Width (number input, ft/m)
- Facing direction (select: N/NE/E/SE/S/SW/W/NW)
- Plot shape (select: rectangle/square/L/corner)
- Number of floors (select: 1/2/3)

**Room Placements (dynamic list):**
- Each row: Room type (select) + Zone (select) + Remove button
- "Add Room" button to add more rows
- Zone dropdown shows green highlight for ideal zones, red for forbidden
- Pre-populated with common rooms: master_bedroom, kitchen, toilet, living, puja, entrance
- Entrance row has "Main entrance" checkbox

**Submit button:** "Analyze Vastu →"

### Section 2: Results (appears after submission)

**Score Overview:**
- Score circle (0-100) with teal accent color
- Grade label (Excellent/Good/Needs Work/Critical)
- Summary badges: X Critical, X High, X Soft

**Violations List:**
- Cards sorted by severity (CRITICAL first)
- Each card: severity badge, rule name, description, points deducted
- Color-coded left border: red for critical, amber for high, teal for soft

**Top Remedies:**
- Top 3 highest-impact fixes
- Each: description, cost estimate (₹), impact (points recovered), cost badge (free/low/structural)

**Actions:**
- "Download PDF Report" button
- "Edit & Re-analyze" button (scrolls back to form)

## Components to Build

| Component | File | Purpose |
|-----------|------|---------|
| VastuCheckerPage | `src/routes/vastu-checker.tsx` | Route component, orchestrates form + results |
| PlotDetailsForm | `src/components/vastu-checker/plot-details-form.tsx` | Plot inputs (length, width, facing, etc.) |
| RoomPlacementList | `src/components/vastu-checker/room-placement-list.tsx` | Dynamic room rows with add/remove |
| RoomRow | `src/components/vastu-checker/room-row.tsx` | Single room type + zone select row |
| ScoreDisplay | `src/components/vastu-checker/score-display.tsx` | Score circle + grade + summary badges |
| ViolationCard | `src/components/vastu-checker/violation-card.tsx` | Single violation with severity styling |
| RemedyCard | `src/components/vastu-checker/remedy-card.tsx` | Single remedy with cost badge |
| VastuReport | `src/components/vastu-checker/vastu-report.tsx` | Composed results section |
| ThemeProvider | `src/components/theme-provider.tsx` | Dark/light mode toggle with system preference |

## Data Flow

```
User fills form
  → Build LayoutInput from form state
  → Call analyzeVastu(layout) from src/vastu/
  → Receive VastuReport
  → Render ScoreDisplay + ViolationCards + RemedyCards
  → PDF: convert report to downloadable PDF
```

Form state managed with TanStack Form. No server calls needed — the rule engine runs client-side.

## PDF Generation

Use browser-native `window.print()` with a print-specific CSS stylesheet as v1. Clean, no extra dependencies. The results section gets print-optimized styles (white background, no interactive elements, proper page breaks).

## Theme Implementation

- CSS variables in `src/styles.css` for the Teal + Zinc palette
- `prefers-color-scheme` media query for system default
- Manual toggle via ThemeProvider (localStorage persistence)
- Dark/light class on `<html>` element

## Testing

- Component tests: form validation, room add/remove, score display rendering
- Integration: fill form → submit → verify report renders with correct data
- Edge cases: empty rooms, all violations, perfect score
- Visual: both dark and light modes render correctly

## Future Extensions (Not in v1)

- Image upload with AI extraction (Phase 3)
- Save/share report via URL
- Multi-language support (Hindi, Tamil, etc.)
- Comparison mode (compare two layouts)
