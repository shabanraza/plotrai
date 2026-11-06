# Plotrai — agent rules (CLAUDE.md)

## Non-negotiable design rules

These apply to **every** UI change. Violating any of them costs us a re-do and the user has called this out repeatedly.

### 1. Always use shadcn components — never hand-roll

**Before** writing any UI, check if a shadcn primitive exists:
- Inputs with prefix/suffix → `<InputGroup>` + `<InputGroupAddon>` + `<InputGroupInput>` + `<InputGroupText>` (NEVER hand-roll a `<div className="flex border …"><span>₹</span><input/></div>`).
- Forms → `<FieldGroup>` + `<FieldSet>` + `<FieldLegend>` + `<Field>` + `<Label>` + `<Input>` (NEVER raw `<div>` with `<label>` + `<input>`).
- Option sets (2-7 choices) → `<ToggleGroup type="single">` (NEVER loop `<button>` with manual active state).
- Errors → `<Alert variant="destructive">` (NEVER `<p className="text-red-500">`).
- Loading → `<Spinner>` (NEVER `<Loader2 className="animate-spin">`).
- Empty states → `<Empty>` + `<EmptyHeader>` + `<EmptyMedia>` + `<EmptyTitle>` + `<EmptyDescription>` (NEVER hand-roll dashed-border placeholder divs).
- Toasts → `toast()` from `sonner` (already mounted in `__root.tsx`).
- Tabs → `<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>` with `variant="line"` for filter tabs.
- Dropdown nav → `<NavigationMenu>` (Tools menu is the canonical pattern at `src/components/tools-menu.tsx`).
- Tables → `<Table>` + `<TableHeader>` + `<TableBody>` + `<TableRow>` + `<TableCell>` + `<TableFooter>` (NEVER `<ul>` for tabular data).

**Already installed (don't re-add)**: alert, badge, breadcrumb, button, card, checkbox, empty, field, input, input-group, label, navigation-menu, select, separator, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip.

### 2. Always invoke the shadcn skill before UI changes

Before adding or modifying any component or form, call the `shadcn` skill via `Skill` tool. The skill carries the exact rules for class-merging quirks (asChild + Slot conflicts), data-icon for buttons, semantic colour usage, and component composition. Skipping the skill = bugs.

### 3. Always invoke the frontend-design skill for new UI

When building a new page or rethinking layout/visual treatment, call `frontend-design:frontend-design`. Especially for:
- A new tool route's whole page design
- Hero/landing rework
- Anything visual the user describes as "redesign", "make it look like X", "match this reference"

The skill commits to a clear aesthetic direction and prevents generic AI-slop output.

### 4. Mobile-first by default

Every page renders correctly at **375px width** before anything else. Use Tailwind's mobile-first breakpoint strategy (no prefix = mobile, `sm:` = ≥640px, `md:` = ≥768px, `lg:` = ≥1024px). Never write a desktop-only layout that breaks on mobile. Test at 375px before claiming done.

### 5. Theme — locked in

- **Type**: Inter for everything, including numbers (use the `tabular-nums` class on figures in tables and results; don't turn on `tnum` globally, as it widens Inter's hyphens). JetBrains Mono only for keyboard hints and codes. NO Fraunces or any decorative serif.
- **Case**: sentence case for every visible heading, label, button and tool name ("Stamp duty calculator", "Total cash needed", "sq ft", "lakh"). Capitals only for acronyms (EMI, GST, BBMP, RCC) and proper nouns. NO `uppercase` class, NO letter-spaced all-caps kickers. Browser-tab `<title>` tags may stay in Title Case.
- **Scale**: H1 32px mobile / 40px desktop (`ToolPageShell`); section headings 18px semibold (`ToolSection`), no numbers or rules; labels 14px; body 16px. Muted colour is for captions; descriptions use `foreground` at 75–80%.
- **Palette**: black and white first. Zinc neutrals for almost everything; primary buttons are near-black in light mode and near-white in dark (`--primary`). Blue (`--brand`: #2563eb light / #60a5fa dark) is the single accent, used only for links, the selected pill, the "Next: …" line and the key result figure. Result panels are grey (`bg-[var(--muted)]`); `--brand-light` is for hover and selected tints only. NO teal. NO purple, NO gradients (radial or linear), NO drop-shadows that aren't multi-layer.
- **Backgrounds**: page is **pure white** in light mode (`oklch(1 0 0)`), slightly off-black in dark (`oklch(0.11 ...)`). Inputs inherit page bg via `bg-transparent` — they should look bright, not disabled.
- **Surfaces**: `--surface` is the off-white tint reserved for sections that need lift (landing tools section). Tool pages don't need it — they use editorial layout.
- Light + dark mode must both work. Test both.

### 6. Tool pages — flat, no Cards, no divider lines

Every tool route uses:
1. `<ToolPageShell>` (`src/components/tools/tool-page-shell.tsx`) — provides breadcrumb + eyebrow badge + h1 + tagline + footnote.
2. `<ToolSection>` (`src/components/tools/tool-section.tsx`) — provides an 18px semibold heading + content, separated by whitespace only. **Never** wrap form sections in `<Card>`.
3. shadcn primitives (per rule #1) for everything inside.

Flat rules (apply site-wide): no divider lines between list items or sections — use whitespace; no bordered cards — use soft `bg-[var(--muted)]` panels (results included; the figure inside is `text-[var(--brand)]`); inputs keep their outline; option sets are pills (`ToggleGroup variant="outline"`); tables keep only the header underline and the total line; the next step is a blue "Next: …" link line.

Variants on `ToolPageShell`: `workbench` (image tools) · `progressive` (vastu) · `single-column` (calculators) · `reading` (about).

Reference files to imitate:
- `src/routes/material-calculator.tsx` — calculator pattern
- `src/routes/plot-converter.tsx` — calculator with Tabs filter
- `src/routes/vastu-checker.tsx` — progressive with Tabs swap
- `src/components/tools/image-tool-page.tsx` — workbench (sidebar + result)

### 7. Landing — goal-first, frosted tiles, no editorial decoration

`/` follows the redesign spec (`docs/superpowers/specs/2026-11-02-site-redesign.md` §4): short hero (sans h1, one-line subhead, a search box that opens the site search), five goal cards linking to the hubs, "Most used" tools ordered by real GSC/GA4 data (never hand-picked), state/city selects, latest guides, trust strip. Tiles use `.frosted` (`src/styles.css`). All lists come from `src/data/site-map.ts`. No chapter numerals, no rotating italic word, no compass watermark.

### 8. SEO discipline (every NEW tool)

- URL slug = primary search keyword from research (`/stamp-duty-calculator`, not `/property-tax-helper`).
- `Route.head()` defines `<title>`, `<meta name="description">`, OpenGraph tags. Keyword-rich, India-specific.
- H1 = exact primary keyword phrase.
- See `docs/superpowers/specs/2026-05-05-next-tools-roadmap.md` for the keyword roster.

### 9. Real-time data where feasible

For tools that depend on market values:
- **Server-side fetch** with cache + fallback to hardcoded JSON.
- See `src/server/get-live-rates.ts` for the canonical pattern (Material Calculator uses it).
- Always show "Source · Last updated" prominently in the footnote.
- Make rates user-overrideable on the page so they can adjust if our fetch is stale.

## Verification before reporting done

1. `npx tsc --noEmit` — must be clean.
2. `npm run build` — must be clean.
3. `npm test` — 35/35 vastu tests still pass.
4. Visual smoke at **375px AND 1280px** in **light AND dark mode** via Playwright. Capture screenshots.
5. If a new tool was added: confirm landing grid + Tools NavigationMenu both list it.

## Memory

The user's design preferences and the locked-in theme also live in `~/.claude/projects/.../memory/feedback_design_theme.md`. That file is loaded automatically each session. This CLAUDE.md is the on-disk canonical version that ships with the repo.
