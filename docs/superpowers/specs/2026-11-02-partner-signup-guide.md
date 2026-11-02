# Partner sign-up guide: home-loan affiliates + contractor/interior aggregators

Companion to `2026-11-02-gsc-growth-and-monetization-plan.md`. Researched 2026-11-02.
**Payouts and campaign status change often.** Treat every number below as "as listed by the network on that date" and confirm it in your dashboard after you're approved.

---

## Part A: Home-loan affiliate (goes on the total-cost/EMI calculator + stamp duty pages)

### How this works in India
Banks and BankBazaar don't usually take small publishers directly. You join an **affiliate network**, apply to a bank's **home-loan campaign** inside it, and get a tracking link. Payment is usually **CPL** (per qualified lead) or per **sanction/disbursal**, validated 45–60 days later.

### Step 1: Prepare before applying (networks reject thin or unclear sites)
- [ ] The site has About, Contact, Privacy Policy, Terms and Disclaimer pages. *(plotrai.in already has all five.)*
- [ ] A business email on the domain (e.g. `partners@plotrai.in`) rather than Gmail. This raises approval odds.
- [ ] PAN card plus a bank account for payouts. GST is needed once you cross the threshold; some networks ask for it up front.
- [ ] A one-paragraph pitch: *"plotrai.in: free Indian property calculators (stamp duty for 18 states, construction cost for 21 cities). 124K Google impressions/quarter, home-buyer intent. Placement: home-loan CTA beside the total-cost and EMI calculator results."*
- [ ] A screenshot of your GSC performance graph. Networks ask for traffic proof.

### Step 2: Join networks (free). Apply to 2–3 in parallel.
| Network | What's there for us | Link |
|---|---|---|
| **INRDeals** | BankBazaar Home Loan campaign, CPL, listed "up to ₹875", zero joining fee, 7-day payment cycle after validation | [Campaign page](https://inrdeals.com/campaigns/bank-bazaarhome-loan-affiliate-program) |
| **Cuelinks** | ICICI Home Loan CPL (**currently paused by the advertiser**); Creditlinks loan CPL (pays on disbursal) | [ICICI](https://www.cuelinks.com/campaigns/icici-home-loan-affiliate-program) · [Creditlinks](https://www.cuelinks.com/campaigns/creditlinks-affiliate-program) |
| **Admitad** | PNB Housing home-loan CPL; ICICI listed as closed | [PNB Housing](https://www.admitad.com/in/blog/pnb-affiliate-program/) |
| **vCommission** | Large Indian network. Check for loan campaigns after sign-up | vcommission.com |

Sign-up is the same on each network:
1. Create a publisher account and add `https://plotrai.in` as your property.
2. Verify site ownership. This is usually a meta tag or a file. Send it to me and I'll add it to `__root.tsx`.
3. Search campaigns for "home loan" and click **Apply**. Approval takes from a few days to two weeks.
4. Once approved, copy the **deep/tracking link** and send it to me. I'll wire it in with `rel="sponsored nofollow"`, a disclosure line, and GA4 click events.

### Step 3: Direct lender / DSA programs (higher payout, more paperwork)
These pay per **disbursed loan** but usually require you to register as a referral partner or DSA (KYC, agreement).
- **HDFC Bank**: referral programme with an application form on its site.
- **Ruloans**: partner form on its website.
- **Easiloan**: loan partner program, commission per disbursed loan ([details](https://www.easiloan.com/blog/earn-big-as-loan-partner-with-easiloan)).

Recommended order: start with **INRDeals (BankBazaar)** because it's open and pre-approved. Add Cuelinks/Admitad as backups. Consider direct DSA once you see 50+ loan clicks/month.

### Rules to follow (or you get banned / risk penalties)
- Disclose clearly, e.g. "We may earn a commission if you apply through this link."
- Use **no** "guaranteed approval" or "lowest rate" claims. Banks enforce their brand guidelines.
- Never collect a user's PAN, income or other financial details ourselves and forward them. Send users to the partner's form via the link.
- Read each campaign's **allowed media**. Some ban SEO, coupon or email traffic.

---

## Part B: Contractor / interior lead aggregators (goes on `/construction-cost/{city}`, material calculator, AI image tools)

### Two models. Pick one to start.

**Model 1: Refer to an aggregator (easiest, start here)**
They build or design; you send leads; they pay a % or a fixed fee per converted project.

| Company | Program | Terms seen | Link |
|---|---|---|---|
| **Brick&Bolt** (construction, many cities) | Channel Partner Program: fill in details, get verified, then upload leads | Their public referral page lists 0.5% of project value (1st), 0.75% (2nd), 1% (3rd+). Channel-partner terms are negotiated | [Channel partner](https://www.bricknbolt.com/channel-partner-program) · [Referral](https://www.bricknbolt.com/referral) |
| **Livspace** (interiors) | Referral program (live from Oct 1, 2025; can change any time); separate *Livpreneur* designer partner model | Terms on their policy page | [Referral policy](https://www.livspace.com/in/interiors/service/service-referral-policy) · [Livpreneur](https://www.livspace.com/in/livpreneur) |
| **HomeLane** (interiors) | Partner registration form | Not public; ask on the call | [Partner form](https://www.homelane.com/partner) |
| **Design Cafe** (interiors) | Design Partner Program (for designers) | Not public | Contact via site |
| **BuildNext** | Sales-partner/franchise model (materials). Not a referral program | n/a | Skip for now |

How to approach them:
1. Fill in the partner form. **Don't sign up as an individual "refer a friend"**; choose channel or business partner.
2. When their partnership manager calls, ask:
   - Which **cities** do you serve? Match these to our 21 city pages: Brick&Bolt is strongest in Bangalore, Hyderabad, Chennai and NCR.
   - Payout **per lead** (CPL) or **% per signed project**? Ask for CPL as well; it pays even if they close badly.
   - How do you **track and report** lead status? Ask for a dashboard or a monthly sheet.
   - **Payout timeline** (construction deals close in 1–3 months).
   - Do you have an **API / webhook** for lead push, or should we email or upload a CSV?
3. Sign their partner agreement. Check the **exclusivity** clause: some (e.g. D'Life's Silver Envoy) cancel you if you work with competitors. Avoid exclusivity at this stage.
4. Send me the lead-push method (API endpoint / email / upload portal). I'll build the form to send leads there, with explicit consent text naming the partner.

**Model 2: Sell leads to local contractors yourself (higher margin, more work)**
1. Build the lead form first (it stores to D1) and collect leads for 4–6 weeks to see volume per city.
2. In the top 3 cities by leads, find 3–5 contractors per city (Google Maps, JustDial, local builder associations).
3. Offer a flat **₹ per verified lead**, or the first 5 leads free as a trial.
4. Share each lead with at most 2–3 contractors, and tell the user upfront ("up to 3 verified builders will call you").

**Recommended:** Model 1 with **Brick&Bolt** (construction) plus **Livspace or HomeLane** (interiors) first. Move to Model 2 only in cities the aggregators don't serve.

### Legal/consent (required either way)
- A consent checkbox that names who will contact the user, e.g. "I agree to be contacted by Plotrai and its partners (e.g. Brick&Bolt) by phone/WhatsApp."
- Update `/privacy-policy` with a section on lead sharing. India's DPDP Act requires purpose-specific consent.
- Store consent timestamps with each lead in D1, and give users a way to delete their data.

---

## What I need from you to start building
1. Which affiliate network approved you, and the tracking link(s).
2. Which aggregator(s) signed you, plus their lead-push method and the city list.
3. A business email address to show on the form and in the disclosures.

Until those arrive I can build both features with **placeholder partner config** (env vars), so they go live the day you're approved.
