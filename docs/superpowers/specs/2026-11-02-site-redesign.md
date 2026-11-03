# Site redesign: easier to find, easier to read (2026-11-02)

**Status: PROPOSAL — awaiting approval. Nothing built.**
The theme stays locked (CLAUDE.md §5): Inter + JetBrains Mono, teal accents, zinc neutrals, white page, no gradients. The redesign changes structure, navigation and reading experience, not the brand.

## 1. What makes the site confusing today

| Problem | Evidence |
|---|---|
| **No navigation on mobile** | `Header.tsx` nav is `hidden sm:flex`, with no menu below 640px. Phone users see only the logo and theme toggle. |
| **The home page sells the wrong product** | Hero: "Indian home design toolkit", CTA "Try Vastu Checker", band "Live auspicious". GSC: Vastu = 184 of 124K impressions. Traffic is construction cost (46K), stamp duty (41K) and the material calculator (10K). |
| **One flat list of 22 tools** | The Tools menu and landing grid mix AI design, cement calculators, city tax guides and "coming soon" with no grouping by intent. |
| **Programmatic pages are hidden** | 18+ stamp duty states, 22+ construction cities, 12 unit pairs and the circle rate page are reachable mainly from an ~80-link footer. |
| **Tools are dead ends** | After a result there's no "next step". Stamp duty doesn't lead to buying cost and EMI; construction cost doesn't lead to materials or contractors. |
| **Three overlapping hub systems** | Topic hubs (`/property-buyer-guide`, `/house-design`, `/construction-materials`), the blog index and the Tools menu each group things differently. |

## 2. New structure: organise by what the visitor is doing

Five goal hubs replace the flat list and the three topic hubs:

| Hub (URL) | Tools | Programmatic pages | Guides |
|---|---|---|---|
| **Buying a home** `/buy` | Stamp duty, home buying cost + EMI, Delhi circle rate | Stamp duty by state | Document checklist, RERA, circle vs market rate, plot loan |
| **Building a house** `/build` | Construction cost, material, concrete, RCC slab, cement-sand-aggregate | Construction cost by city | Cost per floor, 2BHK, 30x40/30x50, steel, cement vs RMC |
| **Land and plots** `/land` | Plot area converter | 12 unit-pair pages | Bigha by state, gaj guides |
| **Paying tax** `/tax` | BBMP, GHMC, MCD, Jaipur property tax; capital gains; indexation | City tax guides | — |
| **Designing** `/design` | Vastu, floor plan 3D, interior restyle, empty room stager | — | House plans, duplex, false ceiling, kitchen, interiors |

- The old topic hub URLs **301-redirect** to the matching new hub, so no SEO equity is lost.
- Breadcrumbs everywhere become `Home › Hub › Page`, with `BreadcrumbList` JSON-LD.
- Every tool and page belongs to exactly one hub, defined in a single `src/data/site-map.ts`. The nav, hubs, footer, search and breadcrumbs all read from that file, so nothing drifts out of sync.

## 3. Navigation

**Desktop header:** Logo · Buy ▾ · Build ▾ · Land · Tax · Design · Guides · Search (Ctrl K) · theme.
- Each ▾ opens a `NavigationMenu` panel: tools on the left, "by state/city" quick links and 2 top guides on the right.

**Mobile header:** Logo · Search · ☰.
- ☰ opens a `Sheet` with the 5 hubs as an accordion, plus Guides. Search is at the top of the sheet.

**Search (Ctrl K / search icon):** a client-side command palette over `site-map.ts`.
- Covers every tool, state, city, unit pair and guide, about 100 entries.
- Typing "punjab" finds Punjab stamp duty; "100 gaj" finds gaj → sq ft.
- Uses the shadcn `Command` + `Dialog` components (to add via the shadcn CLI).

**Footer:** slimmed to five hub columns, with up to 6 links each plus "All …", and Company. The long state and city lists move onto the hub pages.

## 4. Home page

1. **Hero.** H1 "Property and home-building calculators for India". One-line subhead: "Free, with sources on every page." A search box replaces the two CTAs.
2. **"What are you doing?"** Five goal cards linking to the hubs (mockup: 5 across on desktop, 2 columns on mobile).
3. **Most used.** 4–6 tools, ordered by real GSC/GA4 usage, not hand-picked.
4. **Rates for your area.** Two selects: "Stamp duty in [state]" and "Construction cost in [city]", which jump straight to the programmatic page.
5. **Latest guides.** 3 cards.
6. **Trust strip.** Sources cited on every page · updated dates shown · free, no signup.

**Removed:** "Live auspicious" pill band, "Shipping next / coming soon" section, the 22-card grid.

## 5. Page templates

**Tool pages** (`ToolPageShell`):
- **Result-first on mobile.** A pinned result bar at the bottom of the screen shows the headline number as inputs change; tapping it scrolls to the full breakdown.
- **Next-step card after the result:**
  - stamp duty → buying cost + EMI
  - construction cost → material calculator
  - circle rate → stamp duty
- **Fixed section order:** Inputs → Result → Next step → How it works → FAQ → Sources.
- **Sources block.** One standard component listing the source, the last-checked date and whether it's official or secondary. This replaces the ad-hoc footnotes.

**Hub pages:** intro (2 lines) → tools grid → "by state / by city" link grid → guides → FAQ.

**Articles:** as in the earlier mockup.
- Reading progress bar, sticky contents list with scroll-spy (desktop), key-number card (render `hero.stat`).
- Inline calculator card after section 1, "Read next" card, numbered sources.
- A reserved ad slot in the right rail (empty until AdSense).

## 6. Readability rules (site-wide)

| Element | Now | New |
|---|---|---|
| Body text (tools) | 14–15px | **16px**, line height 1.6 |
| Body text (articles) | 16.8px | **18px**, line height 1.75, max 68ch |
| Muted text | `muted-foreground` for most copy | Reserved for captions; descriptions use `foreground` at 80% |
| Headings | Varied per page | One scale: H1 32/40 (mobile/desktop), H2 22/26, H3 18 |
| Tap targets | Some 32px | Min **44px** on mobile (toggles, links in grids) |
| Numbers | Mixed | `tabular-nums` everywhere; ₹ amounts ≥ 1L also shown as "₹17.5L" |

## 7. Rollout (one PR each, highest impact first)

| PR | Scope | Why first |
|---|---|---|
| R1 | `site-map.ts`, mobile menu (Sheet), grouped desktop menus, search palette | Fixes the biggest usability gap (no mobile nav) |
| R2 | Five hub pages, 301s from old topic hubs, breadcrumbs from `site-map.ts` | Makes programmatic pages discoverable; consolidates hubs |
| R3 | New home page | Aligns the first impression with actual traffic |
| R4 | Tool page template: pinned result bar, next-step card, sources block, type scale | Keeps users moving between tools |
| R5 | Article template | Retention and AdSense readiness |
| R6 | Slim footer | Cleanup once hubs exist |

Each PR: `tsc`, build, tests, 375/1280 light/dark screenshots.

## 8. How we'll know it worked

Compare 4 weeks before and after each PR (GA4 + GSC):
- **Mobile pages per session**, target +30%. R1 and R4 should move this.
- **Engaged time on articles**, target +25%, from R5.
- **Clicks from tool → tool** (new `next_step_click` event).
- **Home bounce rate.**
- **GSC CTR on hub-linked programmatic pages.**

## Open decisions

- Hub names: "Buy / Build / Land / Tax / Design" (short, used in the header) vs longer labels like "Buying a home" (used on cards). The proposal uses short names in the header and long names on cards.
- Should Vastu stay a home-page feature? Recommended: no. It moves into Design, since search data doesn't support leading with it.
