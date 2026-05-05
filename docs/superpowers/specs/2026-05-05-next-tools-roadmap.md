# Plotrai — Next Tools Roadmap

**Date:** 2026-05-05
**Status:** Roadmap (pre-task-breakdown)
**Owner:** mohammad.shaban

---

## Context

Plotrai has shipped its V1 toolkit:

- `/vastu-checker` — Vastu compliance scoring (manual + image upload via Claude vision)
- `/floor-plan-3d` — 2D plan → isometric 3D render (OpenAI gpt-image-1 edit)
- `/interior-restyle` — Re-render any room photo in 5 styles
- `/empty-room-stager` — AI-furnish empty rooms
- `/plot-converter` — Indian land-unit converter

The product narrative is: **single-purpose, no-signup, India-first home-design utilities.** The V1 set is heavy on AI image tools and Vastu. To grow SEO traffic and LTV, the next batch should:

1. Capture the **highest-volume Indian construction / real-estate / land-record search queries** that incumbent tools serve poorly.
2. Lean into **deterministic calculators** (no AI cost, instant SEO compounding).
3. Add one or two **AI image extensions** that fit Indian context (where Western tools fail).
4. Open a **lead-gen surface** for home-loan / contractor / CA partners without breaking the no-signup promise.

Design constraints (already established): **Teal + Zinc palette, no gradients, no purple, dark + light mode**, editorial / drafting-table aesthetic.

---

## Methodology

Research conducted 2026-05-05. Sources: Google autocomplete + PAA (geo=IN), Trends India rising-queries, Ubersuggest / Ahrefs free previews, Reddit (`r/india`, `r/IndiaInvestments`, `r/IndianRealEstate`), Quora India, BusinessToday housing reports, civic blogs.

Search-volume estimates are **triangulated, not Google Ads-verified.** Treat them as ranges. Where a number couldn't be cross-confirmed, it's flagged "hypothesised."

Each tool below is named to match an actual search keyword (not a clever brand) so the URL slug doubles as SEO anchor.

---

## Roster — 12 candidate tools (ranked by ship priority)

| # | Tool | Slug | Primary keyword | Est. MSV (IN) | Build | Tier |
|---|---|---|---|---|---|---|
| 1 | Material Estimator Suite | `/material-calculator` | cement / sand / brick / steel calculator (bundled) | ~75k | 1 day | **Ship now** |
| 2 | Stamp Duty Calculator | `/stamp-duty-calculator` | stamp duty calculator (+ city long-tails) | ~80k + ~150k | 2-3 days | **Ship now** |
| 3 | Construction Cost Calculator | `/construction-cost-calculator` | construction cost calculator india | ~50k | 3 days | **Ship now** |
| 4 | Property Capital Gains Calculator | `/property-capital-gains-calculator` | capital gains property | ~20k | 2 days | Ship next |
| 5 | Property Tax Calculator | `/property-tax-calculator` | BBMP / MCD / PCMC / GHMC / KMC property tax | ~75k aggregate | 1 week | Ship next |
| 6 | FSI + Setback Calculator | `/fsi-setback-calculator` | FSI calculator + setback (city long-tails) | ~25k | 1 week | Ship next |
| 7 | Stage-wise BOQ Generator | `/boq-generator` | BOQ residential / house BOQ excel | ~8k | 3-5 days | Phase 2 |
| 8 | Bhulekh Smart Router | `/bhulekh` | bhulekh + state | ~200k aggregate | 1 week | Phase 2 (moat) |
| 9 | Circle Rate Lookup | `/circle-rate` | circle rate / ready reckoner | ~40k | 1 week / region | Phase 2 |
| 10 | RERA Verifier (multi-state) | `/rera-check` | RERA registration check | ~25k | 1-2 weeks | Phase 2 |
| 11 | Indian Exterior Render | `/exterior-design` | AI exterior / indian elevation | ~35k | 1 week | Phase 2 |
| 12 | Plot Buildability Pre-Check | `/plot-buildability` | plot buildability (emergent) | ~3-5k | Composite | Phase 3 |

**Skipped on purpose** (too saturated or off-brief): EMI calculator, home-loan eligibility, paint calculator, road tax, generic interior tools.

---

## Per-tool detail

### 1. Material Estimator Suite — `/material-calculator`

**Why first:** trivial build, ~75k MSV currently fragmented across 4 single-material competitor sites. Pure SEO compounding starts the day it ships.

**What it does:** user picks structural element (wall / slab / column / footing / plaster), enters dimensions, picks brick size + mortar ratio. Output: cement bags, sand cuft, bricks count, steel kg in one card. Includes a dynamic "today's market rate" line per material (manually maintained JSON, ₹350-400 cement, ₹55-75/kg steel, ₹8-12/brick — refresh monthly).

**Pain points solved:**
- Cost #1: builder/contractor/YouTube quotes never agree
- Cost #3: stale calculators show ₹350/bag when reality is ₹400+

**Competitors:** Civilcalculate, MKBudyog, JSWNeosteel, ARSGroup — each does one material, each is brand-locked or single-page.

**Gap:** no neutral, all-in-one, mobile-first, India-fresh estimator.

**Build:** pure client-side math. JSON of brick sizes, mortar ratios, steel grades. PDF export via `react-pdf` or browser print stylesheet.

**Monetization:** SEO traffic → contractor lead capture (light email-to-quote form, optional).

---

### 2. Stamp Duty Calculator — `/stamp-duty-calculator`

**Why second:** highest verified single-keyword MSV after Bhulekh. Mobile UX is the wedge against 99acres / MagicBricks / Bajaj Finserv. Direct home-loan affiliate monetization.

**What it does:** select state → city → gender → buyer type (first-time / individual / joint / corporate) → property value. Output: stamp duty + registration charges + total cash needed beyond loan. Disclose the formula. PDF receipt for record.

**Pain points solved:**
- RE #1: existing calculators come ₹40k off actual
- RE #2: first-time buyers blindsided by ₹5-7L cash gap

**Competitors:** 99acres, MagicBricks, Bajaj Finserv, SquareYards. All cluttered desktop, weak mobile, rates often stale.

**Gap:** focused single-purpose page, fresh 2026 rates, mobile-first, no signup wall.

**Data:** maintain a state-and-city rate matrix (≈30-35 entries). Source from each state's IGR portal. Refresh quarterly.

**Build:** pure client-side, JSON-backed lookup table.

**Monetization:** "Get pre-approved home loan" CTA → BankBazaar / Paisabazaar / Bajaj affiliate.

---

### 3. Construction Cost Calculator — `/construction-cost-calculator`

**What it does:** plot area + city + finish tier (basic / standard / premium / luxury) + structure type (G+1, G+2, etc.) → stage-wise cost breakdown across 7 stages: site prep, foundation, structure (RCC), masonry + plaster, electrical + plumbing, flooring + finishing, painting + handover. Each stage shows rupee value and % of total. PDF for builder negotiation.

**Pain points solved:**
- Cost #1, #2, #4: no per-stage cost reference; labour rate confusion; stage-wise payment planning

**Competitors:** HireAndBuild, Houseyog, AECORD, UltraTech — single number outputs (e.g. "₹1,840/sq ft"), no stage logic, brand-biased.

**Gap:** stage-wise breakdown that maps to how Indian builders actually invoice and how owners actually pay.

**Data:** JSON of (city × tier) → ₹/sq ft, with stage % distribution.

**Build:** pure client-side. Same chassis as Stamp Duty — form + tabular output + PDF.

**Monetization:** contractor lead-gen + tie back to BOQ Generator (#7).

---

### 4. Property Capital Gains Calculator — `/property-capital-gains-calculator`

**Why:** post-Jul-2024 dual regime (12.5% without indexation vs 20% with indexation) is confusing; ClearTax/EZTax not updated cleanly; CA jargon scares first-time sellers.

**What it does:** purchase year + purchase price + sale year + sale price + holding type (LTCG / STCG) → calculator computes both regimes, picks the lower tax for the user, explains why. Adds Section 54 (residential reinvestment) / 54F / 54EC bond exemption shortcuts.

**Pain points solved:**
- RE #3: dual-regime confusion
- Hidden tax planning gap for sellers under ₹2 cr

**Competitors:** ClearTax, EZTax, MyITReturn, Bajaj. All bury the dual regime in CA-style language.

**Gap:** plain-English "your tax is ₹X under regime A, ₹Y under regime B; pick A — here's why" output.

**Build:** pure client-side. CII (Cost Inflation Index) JSON 2001-2026.

**Monetization:** "Need a CA?" CTA → CA partner network (e.g. ClearTax referral, IndiaFilings affiliate).

---

### 5. Property Tax Calculator — `/property-tax-calculator`

**What it does:** select municipal corporation (BBMP, MCD, PCMC, GHMC, KMC for v1; expand later) → fill the corp's actual form fields (built-up area, zone, usage, age) → output tax amount with year-on-year comparison. Optional "pay now" deep-link to the corp's portal.

**Pain points solved:**
- RE #4: each corp portal is flaky, intermittent uptime
- One unified form across 5 corps eliminates re-learning each portal

**Competitors:** Each corp's official portal (frequently down), Landeed (BBMP-only), GoDigit (MCD only).

**Gap:** unified UX across 5 major corps, with cached uptime status.

**Data:** per-corp formula + zone tables. Most are public. Refresh annually.

**Build:** medium — each corp has its own logic. Build BBMP first (largest MSV), add others.

**Monetization:** SEO + property-management lead-gen.

---

### 6. FSI + Setback Calculator — `/fsi-setback-calculator`

**What it does:** plot length × width + city + road width + plot type (corner / interior) → outputs FSI ratio, max built-up area, all 4 setbacks (front / back / left / right), max permissible height, and the specific DCR clause cite. PDF stamped with city byelaw reference.

**Pain points solved:**
- Compliance #2, #3: setback answers conflict on Quora; FSI buried in 200-page DCR PDFs

**Competitors:** Civiconcepts (2019-era), Foot2Feet, InfraLens. Generic FSI formula, no per-city DCR depth, no plot-shape input.

**Gap:** city-specific (BLR / PUN / MUM / DEL / HYD / CHN — 6 cities for v1), with plot-shape and corner-plot logic.

**Build:** medium. Per-city DCR digestion is the bulk of the work.

**Monetization:** ₹99-199 PDF stamped for architect/builder submission.

---

### 7. Stage-wise BOQ Generator — `/boq-generator`

**What it does:** plot area + finish tier + structure → auto-generates a Bill of Quantities split by 7 stages (same as #3) with line items, quantities, unit rates, and totals. Brandable PDF output (user can add their name + logo for free, or buy white-label for ₹99).

**Pain points solved:**
- Cost #2: BOQ jargon impenetrable; want stage-wise breakdown for stage-wise payment

**Competitors:** NexUtils, Capital Buildcon, Excel templates, Legrand. All generic, no Indian SoR (Schedule of Rates), no auto-pricing.

**Gap:** opinionated 7-stage BOQ priced from city-fresh rates (reuse #3's data).

**Build:** easy-medium. Reuses #3's cost JSON.

**Monetization:** ₹99-199 white-label PDF.

---

### 8. Bhulekh Smart Router — `/bhulekh`

**Why phase 2:** 200k+ aggregate MSV is enormous, incumbent UX (just a dump of state portal links) is genuinely broken, but state coverage is the moat — takes time to do well.

**What it does:** detect user's state (geolocation + selector) → deep-link to the right state's land-record portal with a "best time to use" indicator (most state portals are stable 11pm-6am IST). Show alt routes (e.g. CSC center, NRI guide for foreign-IP-blocked portals). Optional: paid "fetch + email me the record" service.

**Pain points solved:**
- Land #1: state portals only work 11pm-6am
- Land #4: NRIs blocked from foreign IPs

**Competitors:** Bhulekhindia.in, MagicBricks blog. Both just dump links.

**Gap:** uptime indicator + alt routes + value-add NRI service.

**Build:** week 1 = router + uptime monitor + 8 state coverage. Add states incrementally.

**Monetization:** ₹299-499 "fetch my khasra" lead-gen partnership with verification services.

---

### 9. Circle Rate Lookup — `/circle-rate`

**What it does:** state → city → locality → property type → output current circle rate / ready reckoner, with 5-year price trend chart. Cross-link to Stamp Duty (#2) for "what would I pay?" workflow.

**Pain points solved:**
- RE #1: per-state silos, no unified search

**Competitors:** Ghar.tv (Flash-era), per-state IGR portals, 99acres. Per-state silos, broken maps.

**Gap:** unified national search with trend data.

**Data:** scrape + manually maintain per-locality circle rates. Top 50 cities for v1.

**Build:** week per region. Data is the bulk.

**Monetization:** cross-link to #2 (stamp duty) + home-loan affiliate.

---

### 10. RERA Verifier — `/rera-check`

**What it does:** enter project name OR RERA number → search across all state RERA portals via federation → return registration status, builder name, completion deadline, complaint count, and a "verdict" (Verified / Lapsed / Not Found).

**Pain points solved:**
- RE #5: bought a flat that wasn't RERA-registered → want one-click "is this legit?"

**Competitors:** state RERA portals (each different, slow). No working aggregator.

**Gap:** federated search across 28 state portals.

**Build:** 1-2 weeks — each state portal has different APIs / scrape logic. Build top 5 states first (MH, KA, TN, TS, UP).

**Monetization:** freemium PDF report (₹49-99) with embedded compliance score.

---

### 11. Indian Exterior Render — `/exterior-design`

**What it does:** upload a house elevation drawing or photo → choose Indian-context style preset (Kota stone + jaali, exposed brick + Mangalore tile, Coastal Goan, Modern Bungalow, Hill Station Cottage, Heritage Haveli) → AI exterior render via gpt-image-1 edit (same backend as `/floor-plan-3d`).

**Pain points solved:**
- Design #2: Western AI tools produce California houses
- Design #3: architect render = ₹30k + 2 weeks; want quick "what would Kota stone look like?"

**Competitors:** mnml.ai, luw.ai, HomeDesigns AI. All Western-style outputs.

**Gap:** Indian-material presets (Kota stone, jaali, exposed brick, Mangalore tile, sandstone) baked into prompts.

**Build:** reuse `image-tool-page.tsx` chassis from existing 3 image tools. Add a sixth `mode: 'exterior-render'` to `generate-image-edit.ts` with new style presets.

**Monetization:** credit-based freemium (3 free renders, ₹99 for 10).

---

### 12. Plot Buildability Pre-Check — `/plot-buildability`

**What it does:** composite report — user enters plot dimensions + city + facing → tool composes outputs from #6 (FSI/setback), #9 (circle rate), `/vastu-checker` baseline, and a basic feasibility score. Single-page PDF: "Your plot can have X sq ft built-up, here's the cost (₹Y), stamp duty (₹Z), Vastu score (W%)."

**Pain points solved:**
- First-time buyer's "should I buy this plot?" decision in 1 PDF

**Competitors:** none — no one bundles these signals.

**Gap:** opinionated buy/don't-buy report.

**Build:** composite of 3 existing tools — only ships after #6 and #9 are live.

**Monetization:** ₹199-499 paid PDF.

---

## Recommended ship sequence

### Phase 1 — Ship in 2-3 weeks (compound SEO foundation)
1. **Material Estimator Suite** (1 day)
2. **Stamp Duty Calculator** (3 days)
3. **Construction Cost Calculator** (3 days)
4. **Property Capital Gains Calculator** (2 days)

Total: ~10 dev-days. All pure client-side calculators. Zero ongoing AI cost.

### Phase 2 — Ship in next 4-6 weeks (data moat tools)
5. **Property Tax Calculator** (BBMP first, expand)
6. **FSI + Setback Calculator** (6 cities)
7. **Stage-wise BOQ Generator** (reuses #3 data)
8. **Bhulekh Smart Router** (8 states first)
9. **Circle Rate Lookup** (top 50 cities)

### Phase 3 — Ship after Phase 2 traction
10. **RERA Verifier** (top 5 states)
11. **Indian Exterior Render** (uses existing chassis)
12. **Plot Buildability Pre-Check** (composite — only after #6 + #9 live)

---

## Cross-cutting infrastructure decisions

These will need decisions before Phase 1 starts:

1. **PDF generation** — `react-pdf` (full control, larger bundle) vs browser print stylesheet (free, less polished). Decision: print stylesheet for v1, switch to `react-pdf` if any tool starts charging for PDFs.
2. **Affiliate links** — pick 1 home-loan partner (BankBazaar / Paisabazaar / Bajaj) and 1 CA partner (ClearTax / IndiaFilings) before #2 ships, to bake the affiliate ID into env from the start.
3. **Rate data refresh cadence** — set up a JSON file per tool (`src/data/stamp-duty-rates.ts`, `src/data/construction-rates.ts`, etc.) with a `lastUpdated` field. Display it on each tool page for trust. Refresh quarterly.
4. **Landing page tools grid** — current landing has 4 tools live + 3 coming-soon. After Phase 1 ships, refactor the grid into a "Live tools" section that scales (probably a tools index `/tools` page, with the landing showing only the 3-4 hero tools).
5. **Lead-gen UX** — define one shared lead-capture component (email + WhatsApp opt-in) so all monetization CTAs use the same form. Avoid scattering signup forms across tools.

---

## Open questions for the user

These should be resolved before task breakdown:

1. **Phase 1 scope confirmation** — ship all 4 in Phase 1, or trim to top 3?
2. **Affiliate partners** — do you have an existing relationship with BankBazaar / Bajaj / etc., or should we sign up fresh?
3. **Pricing posture** — keep everything free in Phase 1 (pure SEO play) and only introduce paid tiers in Phase 2-3, or charge ₹99 PDFs from day 1?
4. **Rate-data sourcing** — do you have a contact who can supply construction / stamp-duty rate updates monthly, or is this a manual-research task each quarter?
5. **Tools index page** — at what point do we add `/tools` as a dedicated index? After Phase 1 (when we have 9 live tools) or now?

---

## Verification milestones (per tool, before shipping each)

Same checklist applies to every tool below — adapt the specifics:

1. Type-check + build pass (`npx tsc --noEmit`, `npm run build`).
2. Tool route renders in light + dark mode at 320px / 768px / 1280px viewports.
3. Empty / invalid / edge-case inputs handled with clear error copy.
4. PDF output (where applicable) matches on-screen state and prints clean.
5. SEO: page has unique `<title>`, `<meta description>`, OpenGraph image, and is linked from the landing tools grid.
6. Lighthouse: Perf ≥ 90, Accessibility ≥ 95, SEO = 100.
7. Smoke test the full user flow on mobile Safari + desktop Chrome.

---

## Files / patterns to reuse from V1

When task-breaking each tool, these existing patterns are the chassis:

- **Image tools**: `src/components/tools/image-tool-page.tsx` + `src/server/generate-image-edit.ts` — for #11 (Exterior Render).
- **Form-driven calculators**: pattern from `src/routes/plot-converter.tsx` — input form on left, result table on right, mobile stacks. Use this for #1, #2, #3, #4, #5, #6.
- **Result PDF output**: not yet built; first to ship is #1 or #2 — establish the print-CSS pattern there, then everyone reuses.
- **Landing tool card**: `src/components/landing/tool-card.tsx` — every new tool gets one card on `/`. After Phase 1, build `/tools` index.
- **Shared lead-gen form**: not yet built; build with #2 or #3 (first tool with affiliate CTA).
- **Theme tokens**: all in `src/styles.css` — Teal + Zinc, no gradients, no purple, light + dark.

---

## Summary

12 candidate tools, ranked by India MSV × build effort × competitive gap.
4 ship in Phase 1 (~10 dev-days, all client-side calculators).
5 in Phase 2 (data-moat tools).
3 in Phase 3 (composite + AI extension).
Open questions on partners, pricing, and `/tools` index need user decisions before task breakdown.

**Next step:** user confirms Phase 1 scope + answers the 5 open questions → break Phase 1 into per-tool task lists.
