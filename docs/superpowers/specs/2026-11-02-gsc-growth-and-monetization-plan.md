# GSC review → growth + monetization plan (2026-11-02)

**Status: PROPOSAL — nothing built yet, awaiting approval.**
Source: Google Search Console, `sc-domain:plotrai.in`, Web search, last 3 months (Aug 1 – Oct 31, 2026).

## 1. Where we stand

| Metric | Value |
|---|---|
| Clicks | 1.15K (~12/day) |
| Impressions | 124K |
| CTR | 0.9% |
| Avg position | 10.3 |
| Indexed / not indexed | 67 / 3 |

Traffic by section:

| Section | Pages | Clicks | Impr. | CTR | Read |
|---|---|---|---|---|---|
| `/construction-cost/{city}` | 21 | 284 | 46.3K | 0.6% | Largest cluster, ranks p6–9, CTR weak |
| `/stamp-duty/{state}` | 18 | 307 | 40.9K | 0.75% | Second cluster, mostly p8–13 → **biggest quick win** |
| `/material-calculator` | 1 | 278 | 10.0K | 2.8% | Best performer |
| `/ghmc-property-tax-calculator` | 1 | 112 | 5.8K | 1.9% | Proves the city property-tax pattern |
| `/plot-converter` | 1 | 12 | 5.3K | **0.2%** | Worst CTR on site |
| `/construction-cost-calculator` | 1 | 31 | 4.7K | 0.7% | p12.7 |
| `/property-capital-gains-calculator` | 1 | 55 | 3.4K | 1.6% | p18 |
| `/stamp-duty-calculator` (hub) | 1 | 1 | 1.0K | 0.1% | **p51** |
| `/mcd-property-tax-calculator` | 1 | 7 | 807 | — | p20 |
| `/indexation-calculator` | 1 | 9 | 800 | — | p22 |
| `/bbmp-property-tax-calculator` | 1 | 1 | 574 | — | p19 |
| AI image tools (3) | 3 | 16 | 315 | — | Negligible search traffic |

Top queries by clicks: `construction material calculator 3.0` (66, p3.4), `property indexation calculator` (23, p5.5), `construction material calculator` (20, p9.4), `rajasthan stamp duty rates 2026` (10, p3.7), `ghmc property tax calculator` (8, p6.6).

## 2. Indexing + sitemap

| URL | Status | Action |
|---|---|---|
| `/stamp-duty/$state` | 404 (crawled Sep 28) | Literal route template leaked into a crawl. Not in the live HTML any more. Click **Validate fix** in GSC. |
| `http://plotrai.in/` | Page with redirect | Expected (301 → https). Ignore. |
| `/ghmc-property-tax-search-by-house-number` | Crawled – not indexed (Aug 23) | Returns 200, in sitemap. Likely judged thin. Add content, then use **Request indexing**. |

- **Sitemap:** Google last read it Jun 22, 2026 and saw 58 URLs. The live file lists 80. **Resubmitted today**, and GSC now shows 80 discovered.
- The `ea3155e` commit (real per-page `lastmod`) is on `origin/ccr-73ad8e8e-wdwykt` but **not on main/production**. Merge and deploy it, then resubmit again.
- Legacy URLs still getting impressions return 404: `/bhopal`, `/property-capital-gain-tax-calculator`, `/property-capital-gains-tax-in-india-post-budget-2024`, `/cement-sand-aggregate-calculator-for-concrete-for-m5-to-m20`, `/aj/punjab-stamp-duty-calculator-2026-7-male-5-female`. Add 301s to the matching pages.
- Trailing-slash redirects are **307** (temporary). They should be 301/308.

## 3. Quick wins (do these before new features)

Note: the top 1,000 queries account for only 22.7K of the 124K impressions. The rest is long-tail or anonymized, so page-level numbers matter more than query lists.

### A. Stamp duty state pages, p8–14 with high impressions
| Query | Impr. | Pos | Page |
|---|---|---|---|
| stamp duty in punjab | 501 | 9.9 | `/stamp-duty/punjab` (7.2K impr, 0.9%) |
| stamp duty in rajasthan | 410 | 10.0 | `/stamp-duty/rajasthan` |
| stamp duty in gujarat | 393 | 12.9 | `/stamp-duty/gujarat` (p10.8) |
| stamp duty in bihar | 276 | 13.3 | `/stamp-duty/bihar` |
| स्टाम्प शुल्क उत्तर प्रदेश | 254 | 8.1 | `/stamp-duty/uttar-pradesh` (6.8K impr, 0.5%) |
| up stamp duty calculator | 218 | 11.8 | 〃 |
| ap registration charges calculator | 199 | 13.9 | `/stamp-duty/andhra-pradesh` (p12.1) |
| gujarat stamp duty calculator | 174 | 11.1 | `/stamp-duty/gujarat` |
| stamp duty calculator kerala | 172 | 9.7 | `/stamp-duty/kerala` (p10.6) |
| registry charges in punjab for female | 130 | 10.1 | `/stamp-duty/punjab` |

Fixes for each state page, templated:
1. Answer-first block above the calculator: "Stamp duty in {State} 2026: X% men, Y% women, Z% registration", plus a rate table. Queries are informational ("stamp duty in X"), not "calculator".
2. A dedicated **female buyer** H2 and FAQ. Many "for female" variants appear.
3. **Registration charges** H2. "registry charges", "registration charges calculator" queries.
4. A Hindi summary block for UP, Bihar, Rajasthan, MP. Hindi queries are showing up.
5. FAQPage JSON-LD, and "Last updated" in the visible text.
6. Weak states: Maharashtra p15.8, Karnataka p27, West Bengal p26, Telangana p18. These need the content depth that Punjab and Rajasthan have.
7. `/stamp-duty-calculator` hub at **p51**. Make it the real hub: state picker, a short national explainer, links to every state page.

### B. `/plot-converter`: 5.3K impr, 0.2% CTR
`100 gaj in square feet` sits at **p2 with 0 clicks**. The SERP answers it, and our generic title doesn't win the click. Build programmatic unit-pair pages (`/gaj-to-sq-ft`, `/bigha-to-acre`, …) with the answer and a conversion table above the fold. Make the title lead with the unit pair.

### C. Construction cost cluster
- `/construction-cost/patna`: 7.3K impr at p6.4 but 0.7% CTR. Test a title that leads with the query phrase, e.g. "House Construction Cost in Patna 2026 (per sq ft)".
- `/construction-cost/bangalore` at **p28.7** while every other city is at p6–9. It probably cannibalizes `/north-bangalore`. Differentiate the content and cross-link both. Chennai is at p24 for the same reason (thin compared with competitors).
- `/construction-cost-calculator` p12.7: link to it from all 21 city pages with the anchor text "construction cost calculator".

### D. Others
- `material calculator`: 1,431 impr, p7.7, 0.8% CTR. Start the title with "Material Calculator".
- Capital gains: `capital gains tax calculator on sale of property in india` gets 170 impr at p7.4 with 0 clicks. `/property-capital-gains-calculator` (p18) and `/indexation-calculator` (p22) overlap. Pick one primary intent per page and cross-link them.
- MCD (p20) and BBMP (p19) property tax pages: bring them up to GHMC's depth.

## 4. Feature re-rank

How to read this: GSC only shows queries we already rank for, so low numbers for a new topic don't prove low demand. The stronger signal is **topical adjacency**. Google already trusts us on stamp duty (41K impr) and city construction cost (46K impr). Features that plug into those clusters rank faster.

| Rank | Feature | GSC signal | Why |
|---|---|---|---|
| **1** | **Total home-buying cost + EMI calculator** (+ home-loan affiliate) | Direct: tiny (25 impr on "loan"). Adjacent: the 41K stamp-duty cluster | It is the natural next step from every stamp duty page (price + stamp duty + registration + GST + brokerage + loan EMI). It is also the **primary monetization surface**. Target "total cost of buying a house in India" style queries rather than head-on "EMI calculator", where banks dominate. |
| **2** | **Circle rate lookup: Delhi, Gurgaon, Noida** | `ready reckoner haryana` already at **p1.5** (126 impr). The blog post `circle-rate-vs-market-rate` exists. Delhi, Gurgaon and Noida construction-cost pages get 1–3K impr each | Stamp duty is charged on the higher of circle rate and deal value, so this feeds feature 1 and the stamp duty pages. Data comes from published government PDFs. Medium effort; it needs a yearly refresh. |
| **3** | **More city property tax pages** (PMC, PCMC, KMC, Chennai) | Property-tax queries: 2,080 impr. GHMC page 5.8K impr, `ghmc tax calculator` 19.5% CTR. No Pune/Kolkata/Chennai tax queries yet | The pattern is proven and cheap (`property-tax-page.tsx` template). **But fix MCD/BBMP first**: they sit at p19–20, which shows a new city doesn't rank automatically. Then do PMC → Chennai → KMC → PCMC. |
| **4** | **RERA check by state** | 85 impr; the RERA blog guide gets 347 impr at p22 | We can't actually verify a project (state portals, captchas), so this can only be a router plus a guide. Low moat. Better handled by improving the existing blog post. |
| **5** | **FSI + setback calculator** | **0** impressions | Rules vary by city and authority, so the accuracy and liability risk is high, with no demand signal. Park it. |

## 5. Monetization plan

| # | Stream | Where | When | Notes |
|---|---|---|---|---|
| 1 | **Home-loan affiliate links** | New total-cost/EMI calculator (primary). "Financing this purchase?" block on every `/stamp-duty/{state}` page | With feature 1 | Use a CPL partner program (bank aggregator affiliate programs, or Indian affiliate networks). The user picks and signs up for one. `rel="sponsored nofollow"`, a visible "affiliate link" disclosure, GA4 click events. Must look like a teal CTA under the result, not an ad. |
| 2 | **Contractor / interior lead forms** | `/construction-cost/{city}` (46K impr: the biggest audience with build intent), `/material-calculator`, construction-cost calculator. Interior leads on `/interior-restyle` and `/empty-room-stager` results | Phase 1, alongside the affiliate | Form fields: name, phone, city, plot size, budget, timeline, plus a consent checkbox. Store in D1 (already used for render credits) and send an email notification. Sell leads manually to local contractors first to validate demand before building a marketplace. Update privacy policy. Built with shadcn `Field` and `Alert`, plus a sonner toast. |
| 3 | **Paid credits for AI image tools** | floor-plan-3d, interior-restyle, empty-room-stager | Phase 2, low priority | The credit ledger already exists (`render-credits.ts`: 1 free anonymous render/day, 3 credits on signup). Add credit packs through a payment gateway such as Razorpay; the user needs a KYC'd merchant account. Search traffic to these tools is negligible (~315 impr/3 mo), so treat it as a side revenue line. Price packs from the measured model cost per render. |
| 4 | **AdSense** | Content and info sections only (blog, stamp duty explainer text). Never inside tool UIs or next to affiliate CTAs | Later: once at ~10K+ monthly sessions | At the current ~400 clicks/month, revenue would be trivial. It would also hurt Core Web Vitals and pull clicks away from the affiliate and lead CTAs. |

## 6. Proposed sequence

**Phase 0: this week (SEO fixes, no new tools)**
1. Merge `ccr-73ad8e8e-wdwykt` (sitemap lastmod), deploy, resubmit the sitemap.
2. 301s for legacy URLs; trailing-slash 307 → 308.
3. Stamp duty template upgrade (§3A): answer block, female/registration H2s, Hindi block, FAQ schema, plus the hub page.
4. Title/meta tests: material calculator, Patna (and other construction-cost cities), plot converter.
5. GHMC house-number page: content, then request indexing. Validate the `$state` 404 fix in GSC.

**Phase 1: weeks 2–4**
6. Total home-buying cost + EMI calculator with the home-loan affiliate; link it from all stamp duty pages.
7. Contractor lead form on construction-cost city pages.

**Phase 2: weeks 5–8**
8. Circle rate: Delhi, Gurgaon, Noida (wired into stamp duty and total cost).
9. Property tax: fix MCD/BBMP, then PMC, Chennai, KMC, PCMC.
10. Gaj/bigha unit-pair pages (§3B).
11. Credit packs for AI tools.

**Later:** RERA router (as a blog upgrade), AdSense at the traffic threshold. FSI/setback is parked.

## Decisions needed from the user
- Approve Phase 0 + 1 scope.
- Choose a home-loan affiliate program and sign up (needs the user's own account/KYC).
- Lead handling: sell manually to local contractors, or partner with an aggregator?
- Razorpay (or another gateway) merchant account for credit packs.
