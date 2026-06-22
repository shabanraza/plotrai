import type { FaqItem } from '#/lib/seo'

/**
 * SEO content per tool — FAQ items target Hinglish + English long-tail
 * queries (e.g. "stamp duty kaise calculate kare", "north facing house
 * vastu"). Keep answers concise (2-4 sentences) and cite the underlying
 * rule, formula, or source. Visible on-page (no accordion-hidden) so
 * Google indexes them at full weight.
 */

export const VASTU_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'Vastu Shastra kya hai aur ghar ke liye kyu zaroori hai?',
    a: 'Vastu Shastra is an ancient Indian architectural science that maps the eight directions to natural elements (earth, water, fire, air, space) and assigns ideal room functions to each zone. Followers believe correct placement balances energy flow and improves health, prosperity, and relationships at home.',
  },
  {
    q: 'North-facing house ke liye main entrance kaha best hai?',
    a: 'For a north-facing plot, the main entrance is most auspicious in the North or North-East zone. Avoid the South-West entrance — that quadrant is reserved for the master bedroom. The exact pada (sub-zone) within North also matters; padas 3-5 are considered most beneficial.',
  },
  {
    q: 'Kitchen kis direction mein hona chahiye Vastu ke hisaab se?',
    a: 'The South-East (Agneya) zone is the canonical Vastu placement for the kitchen because it is the fire zone. The cook should face East while cooking. North-West is the secondary acceptable zone. Avoid kitchens in the North-East, which is the water/spiritual zone.',
  },
  {
    q: 'Vastu dosh kaise theek karein bina toda-fodi ke?',
    a: 'Most minor Vastu doshas can be remedied without structural changes — common fixes include placing a brass pyramid in the affected zone, mirrors to redirect energy flow, salt bowls to absorb negative energy, or specific colors on walls. Major doshas (toilet in NE, kitchen in NE) usually need structural correction.',
  },
  {
    q: 'Master bedroom Vastu ke hisaab se kis direction mein hona chahiye?',
    a: 'The master bedroom is best placed in the South-West (Nairutya) zone, which is the earth element zone associated with stability and authority. Sleep with the head pointing South or East — never North, which is considered inauspicious for sleep direction.',
  },
  {
    q: 'Toilet/bathroom Vastu mein kahan hona chahiye?',
    a: 'Toilets are best placed in the West or North-West, with the WC facing North or South so the user faces East or West. Strictly avoid toilets in the North-East (most auspicious zone) and the South-East (fire zone) — these are the two worst placements per traditional Vastu.',
  },
]

export const STAMP_DUTY_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'Stamp duty kya hai aur kyu deni padti hai?',
    a: 'Stamp duty is a state-level tax paid to register a property transaction with the government. Without paying stamp duty and registering the sale deed, the transaction is not legally enforceable in court. Rates vary by state (3–8%) and by buyer category (women often get a 1–2% concession).',
  },
  {
    q: 'Mumbai mein 1 crore ke flat pe stamp duty kitni lagegi?',
    a: 'In Maharashtra (Mumbai/Pune urban), stamp duty is currently 6% for men and 5% for women, plus 1% registration charge. So on a ₹1 crore flat, a male buyer pays approx ₹6 lakh stamp duty + ₹1 lakh registration = ₹7 lakh total. A female buyer saves ₹1 lakh.',
  },
  {
    q: 'Stamp duty kaun bharta hai — buyer ya seller?',
    a: 'In India, stamp duty is paid by the buyer in 99% of cases, regardless of state. This is a long-standing convention — the seller only handles capital gains tax. Some states allow joint stamp paper but the cost is borne by the buyer.',
  },
  {
    q: 'Female buyer ko stamp duty mein discount milta hai?',
    a: 'Yes — most Indian states offer a 1–2% concession on stamp duty if the property is registered solely in a woman\'s name or jointly with a woman as the primary owner. Maharashtra, Delhi, Haryana, UP, Rajasthan, Punjab, and others have this concession.',
  },
  {
    q: 'Stamp duty registration charges kaise calculate hote hain?',
    a: 'Stamp duty is calculated on the higher of (a) the agreement value or (b) the state\'s ready reckoner / circle rate. Registration charge is a separate 1% on the same value, capped at ₹30,000 in some states. Use the calculator above for state-wise live rates.',
  },
  {
    q: 'Under-construction flat pe stamp duty kab deni hoti hai?',
    a: 'For under-construction properties, stamp duty is paid at the time of registering the sale agreement (typically when 20–25% payment is made). A separate registration fee may apply when the sale deed is executed at possession. GST (5% on under-construction) is paid separately to the builder.',
  },
]

export const MATERIAL_CALC_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'M20 concrete ke liye cement, sand, aggregate ka ratio kya hai?',
    a: 'M20 grade concrete (20 N/mm² strength) uses a nominal mix ratio of 1:1.5:3 — that is, 1 part cement, 1.5 parts sand, 3 parts aggregate. For 1 cubic meter of M20 concrete you need approximately 8 bags of cement (50 kg each), 0.42 cum sand, and 0.83 cum aggregate.',
  },
  {
    q: 'Plaster ke liye cement aur sand ka ratio kya hona chahiye?',
    a: 'Internal plaster (12 mm thick) uses a 1:6 cement-to-sand ratio. External plaster (15–20 mm thick) uses a stronger 1:4 mix to resist weathering. Per 100 sq ft of 12 mm plaster, you need approximately 1 bag cement + 5.5 cuft sand.',
  },
  {
    q: 'RCC slab ke liye steel ki kitni quantity chahiye?',
    a: 'For a residential RCC slab, the standard steel requirement is 80–100 kg per cubic meter of concrete (or 1% of the concrete volume). For commercial/multi-storey work this rises to 120–150 kg/cum. Our calculator above uses 100 kg/cum as the default.',
  },
  {
    q: 'Ek cement bag mein kitne cubic feet hote hain?',
    a: 'One 50 kg bag of cement equals approximately 1.226 cubic feet (0.0347 cum) by loose volume. This is the standard density used in BIS code IS 4926 calculations for concrete and mortar mixes.',
  },
  {
    q: '1000 sq ft ka ghar banane mein kitna cement lagega?',
    a: 'A standard 1000 sq ft single-floor RCC house needs roughly 400 bags of cement (50 kg each) — about 100 bags for the slab, 80 for columns/beams, 100 for brickwork mortar, and 120 for plaster. This varies ±20% based on slab thickness, wall type, and finishing spec.',
  },
  {
    q: 'Brick ki kitni quantity lagti hai per square meter wall mein?',
    a: 'A standard 9-inch (230 mm) brick wall needs approximately 100 bricks per square meter of wall area. A 4.5-inch (115 mm) partition wall needs 50 bricks per sq m. Add 5% for breakage during transport and laying.',
  },
]

export const CONSTRUCTION_COST_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'India mein 1000 sq ft ghar banane mein kitna kharcha aata hai?',
    a: 'In 2026 rates, a standard-quality 1000 sq ft house in India costs ₹13–15 lakh (₹1300–1500 per sq ft). Premium finish: ₹18–22 lakh. Luxury: ₹25 lakh+. Tier-1 cities (Mumbai, Bangalore, Delhi) add 15–20% over these baseline tier-2 figures.',
  },
  {
    q: 'Construction cost per sq ft kitni hoti hai 2026 mein?',
    a: 'Construction cost varies by city and quality: standard ₹1300–1500/sq ft, mid-range ₹1800–2200/sq ft, premium ₹2500–3000/sq ft, luxury ₹3500+/sq ft. These cover labour + material for civil work only — excludes land, government approvals, and interior fit-out.',
  },
  {
    q: 'Construction cost mein kya kya included hota hai?',
    a: 'Standard construction cost includes: civil structure (foundation, slab, columns, walls), basic electrical and plumbing, doors and windows, basic flooring (vitrified tile), basic painting, and labour. It excludes: modular kitchen, false ceiling, AC, premium fittings, landscaping, compound wall, and government approval fees.',
  },
  {
    q: 'Material aur labour cost ka ratio kya hota hai construction mein?',
    a: 'In Indian residential construction, the typical split is 65% materials + 30% labour + 5% contingency. Materials = cement (15%), steel (12%), bricks/blocks (10%), aggregates (8%), finishing (20%). Labour includes mason, carpenter, plumber, electrician, painter.',
  },
  {
    q: 'Construction cost loan ke through cover kar sakte hain?',
    a: 'Yes — most banks offer construction loans up to 75% of the estimated cost (after deducting plot value if owned). EMI starts after each disbursement tranche. SBI Realty, HDFC Construction Loan, and ICICI Home Loan are common options at 8.4–9.5% interest in 2026.',
  },
]

export const CAPITAL_GAINS_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'Property bechne pe capital gains tax kitna lagta hai?',
    a: 'Long-term capital gains (held > 24 months) on property are taxed at 12.5% without indexation as of FY 2025-26 (post Budget 2024 reform). Short-term gains (< 24 months) are added to your income and taxed at slab rates. Use Section 54/54F to claim full exemption by reinvesting in another residential property.',
  },
  {
    q: 'Section 54 exemption kaise milti hai?',
    a: 'Section 54 lets you avoid LTCG tax if you reinvest the entire capital gain (not full sale value) in another residential house — purchased within 2 years or constructed within 3 years of sale. Maximum exemption is ₹10 crore per Budget 2023 cap. Only available for individuals and HUFs.',
  },
  {
    q: 'Indexation benefit khatm ho gaya hai property pe?',
    a: 'Yes — Budget 2024 removed indexation for properties bought after 23 July 2024. Properties bought before that date have a "grandfathered" choice: pay 20% LTCG with indexation OR 12.5% without indexation, whichever is lower. Always run both calculations.',
  },
  {
    q: 'Inherited property bechne pe capital gains tax lagta hai?',
    a: 'Inheritance itself is not taxed in India, but when you sell inherited property, capital gains tax applies. The cost of acquisition is the original price your ancestor paid, and the holding period includes their tenure — so most inherited properties qualify for LTCG (12.5%) automatically.',
  },
  {
    q: 'Capital Gains Account Scheme (CGAS) kya hai?',
    a: 'CGAS lets you park sale proceeds in a designated bank account if you can\'t reinvest before the income-tax return filing deadline. Funds must be used for reinvestment within Section 54 timelines (2/3 years). Available at all PSU banks and selected private banks.',
  },
]

export const PLOT_CONVERTER_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: '1 gaj kitne square feet ke barabar hota hai?',
    a: 'In North India, 1 gaj = 9 square feet (1 sq yard). So a 100 gaj plot is 900 sq ft. In South India, gaj is rarely used — square feet and ground (1 ground = 2400 sq ft) are more common.',
  },
  {
    q: '1 acre mein kitne gaj hote hain?',
    a: '1 acre = 43,560 square feet. Since 1 gaj = 9 square feet, 1 acre = 4,840 gaj. For example, 0.5 acre is 2,420 gaj and 2 acre is 9,680 gaj.',
  },
  {
    q: 'Kanal to acre conversion kaise hota hai?',
    a: 'In Punjab, Haryana and Jammu & Kashmir planning records, 1 kanal = 5,445 square feet. So 1 kanal = 0.125 acre and 8 kanal = 1 acre.',
  },
  {
    q: 'Kanal to hectare conversion kitna hota hai?',
    a: '1 kanal = 5,445 square feet and 1 hectare = 107,639 square feet. So 1 kanal is approximately 0.0506 hectare, and 1 hectare is about 19.77 kanal.',
  },
  {
    q: 'Bigha to kanal conversion kya hai?',
    a: 'Bigha size changes by state, so bigha to kanal is not the same everywhere. Using the common UP/Bihar planning standard, 1 bigha = 27,000 square feet, which is about 4.96 kanal. Always check the local bigha definition before using it for legal land records.',
  },
  {
    q: '1 bigha kitne square feet hota hai?',
    a: 'Bigha varies massively by state — UP/Bihar: 27,000 sq ft; Rajasthan: 27,225 sq ft (pucca) or 17,424 (kachcha); Madhya Pradesh: 12,000 sq ft; West Bengal: 14,400 sq ft; Punjab: 9,070 sq ft. Always confirm the local definition before buying agricultural land.',
  },
  {
    q: '100 gaj plot kitna square feet hota hai?',
    a: '100 gaj ka plot 900 square feet hota hai, because 1 gaj = 9 square feet. In feet, a 100 gaj plot may be 30 ft × 30 ft, 20 ft × 45 ft, or another layout with the same total 900 sq ft area.',
  },
  {
    q: '1 acre mein kitne square feet aate hain?',
    a: '1 acre = 43,560 square feet = 4,840 square yards = 4,047 square meters. In Indian land units, 1 acre ≈ 4 bigha (UP) ≈ 18 ground (Tamil Nadu) ≈ 100 cents (Kerala/Karnataka).',
  },
  {
    q: 'Cent kya hota hai aur kitne square feet ka hota hai?',
    a: 'Cent is the standard land unit in Kerala, Tamil Nadu, and Karnataka. 1 cent = 435.6 square feet = 1/100th of an acre. So 100 cents = 1 acre. A typical residential plot in these states is 5–15 cents.',
  },
]

export const IMAGE_TOOL_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'Yeh AI render kitne accurate hote hain?',
    a: 'Our AI is tuned for quick visualisation and mood-boarding. Results are great for concept exploration but should not be used for construction-grade renders. For photorealistic professional output, hire a 3D artist — this tool is for ideation, not final delivery.',
  },
  {
    q: 'Floor plan 3D conversion ke liye image kis format mein chahiye?',
    a: 'Upload a clean 2D floor plan (PNG, JPG, or WebP, max 10 MB). Best results with crisp black lines on white background — hand-drawn sketches and screenshots from CAD software both work. Avoid plans with heavy dimensions clutter as they confuse the model.',
  },
  {
    q: 'Render generate karne mein kitna time lagta hai?',
    a: 'Each render takes 15–40 seconds depending on quality setting. Medium ≈ 15s, High ≈ 30s. The first render of the day may take a bit longer as the service warms up. You can regenerate as many times as you want until you like a result.',
  },
  {
    q: 'Daily limit kyon hai?',
    a: "Plotr Ai is free for everyone, so we apply a daily fair-use limit on AI renders to keep it that way. If you hit the cap, try again the next day — the manual modes of our other tools (Vastu checker, calculators) don't use any AI quota.",
  },
]

export const VASTU_CONTEXT = {
  title: 'What is Vastu Shastra and how does this checker work?',
  paragraphs: [
    'Vastu Shastra is the traditional Indian architectural science that prescribes how rooms, doors, and utilities should be positioned across the eight cardinal directions. The checker above takes your floor plan or manually entered room positions, maps each element to its Vastu zone, and runs a 14-rule engine over your layout to surface violations and remedies.',
    'Each rule cites its scriptural source (Manasara, Mayamatam) or contemporary reference (Bharatiya Vastu Samhita) so you can verify any flag. The checker is informational — for major construction decisions, consult a qualified Vastu consultant who can account for your nakshatra, rashi, and the specific energy patterns of your plot.',
    'Indian Vastu has both "ashtadik" (8-direction) and "16 mahapadas" (32-sub-zone) traditions. Our default uses the simpler 8-direction approach which is sufficient for 90% of modern residential layouts.',
  ],
}

export const STAMP_DUTY_CONTEXT = {
  title: 'How stamp duty and registration work in India',
  paragraphs: [
    'Every property transaction in India must be registered with the state government to be legally enforceable. The buyer pays two charges: (1) stamp duty (3–8% depending on state and gender), and (2) registration fee (typically 1%, sometimes capped). These charges are over and above the agreement value and GST (for under-construction properties).',
    'Stamp duty is calculated on the higher of (a) the agreement value declared in the sale deed, or (b) the state\'s ready reckoner / circle rate (the government\'s minimum benchmark for that locality). This prevents under-reporting of property prices.',
    'Most states offer a 1–2% concession if the property is registered in a woman\'s name. The rates above are 2026 figures sourced from state revenue department circulars — always verify with your local sub-registrar before final payment.',
  ],
}

export const MATERIAL_CALC_CONTEXT = {
  title: 'How construction material calculation works',
  paragraphs: [
    'Construction material requirements are derived from the structural element type, dimensions, and the relevant BIS code (IS 456 for concrete, IS 1077 for bricks, IS 1542 for plaster). The calculator above converts your inputs (length × width × thickness) into volume, then applies the standard mix ratio for that element to compute material quantities.',
    'For concrete (M20, M25, M30), the volume-to-bag-cement formula uses a 1.54 dry-volume factor (concrete shrinks ~54% from dry to wet state). For brickwork, we assume standard 230×115×75 mm modular bricks with 10 mm mortar joints. For plaster, we use 1.27 dry-volume factor and 30% wastage allowance per BIS guidance.',
    'All material rates above are user-editable so you can match local market prices. The default values are pulled from Houseyog\'s daily-updated cement price index and tier-2 city averages for sand, aggregate, brick, and steel. Your output is a quantity table plus a costed estimate.',
  ],
}

export const CONSTRUCTION_COST_CONTEXT = {
  title: 'Understanding construction cost in India',
  paragraphs: [
    'Construction cost in India is benchmarked in rupees per square foot of built-up area. The cost-per-sqft varies by city tier, finish quality, structural design (load-bearing vs RCC frame), and number of floors. The calculator above breaks your total cost into structural (60–65%), finishing (25–30%), and labour (10–15%) so you can plan disbursements.',
    'Our 2026 rates use CPWD (Central Public Works Department) Schedule of Rates as the baseline, adjusted for tier-1 city premium (Mumbai, Delhi, Bangalore +15–20%) and current cement/steel market index. The "standard quality" tier corresponds to vitrified flooring, basic painting, standard sanitaryware. Premium adds modular kitchen, false ceiling, branded fixtures.',
    'Always add 10% contingency over the calculated cost for unforeseen expenses — soil correction, design changes, plinth raise, additional electrical points. Major builders use the same contingency benchmark.',
  ],
}

export const CAPITAL_GAINS_CONTEXT = {
  title: 'Property capital gains tax in India (post-Budget 2024)',
  paragraphs: [
    'When you sell a property in India, the profit (sale price minus cost of acquisition minus improvement cost) is treated as capital gains. Held for less than 24 months → short-term, taxed at your slab rate. Held for 24+ months → long-term (LTCG), taxed at a flat 12.5% as of FY 2025-26.',
    'Budget 2024 abolished indexation benefit for properties acquired after 23 July 2024. For older properties, you can choose between (a) the new regime (12.5% without indexation) or (b) the old regime (20% with indexation), whichever yields lower tax. The calculator above runs both scenarios in parallel.',
    'You can fully avoid LTCG tax by reinvesting under Section 54 (residential property) or Section 54EC (capital gains bonds, max ₹50 lakh, 5-year lock-in). The exemption is tied to the gain amount, not the sale value — so partial reinvestment yields proportional exemption. Talk to a CA before filing if your sale value is over ₹2 crore.',
  ],
}
