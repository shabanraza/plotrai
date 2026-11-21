import type { FaqItem } from '#/lib/seo'
import { costRange, rateRange } from '#/lib/cost-format'

/**
 * SEO content per tool — FAQ items target English India long-tail
 * queries (e.g. "how to calculate stamp duty", "north facing house
 * vastu"). Keep answers concise (2-4 sentences) and cite the underlying
 * rule, formula, or source. Visible on-page (no accordion-hidden) so
 * Google indexes them at full weight.
 */

export const VASTU_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'What is Vastu Shastra and why is it important for a home?',
    a: 'Vastu Shastra is an ancient Indian architectural science that maps the eight directions to natural elements (earth, water, fire, air, space) and assigns ideal room functions to each zone. Followers believe correct placement balances energy flow and improves health, prosperity, and relationships at home.',
  },
  {
    q: 'Where is the best main entrance for a north-facing house?',
    a: 'For a north-facing plot, the main entrance is most auspicious in the North or North-East zone. Avoid the South-West entrance — that quadrant is reserved for the master bedroom. The exact pada (sub-zone) within North also matters; padas 3-5 are considered most beneficial.',
  },
  {
    q: 'Which direction is best for a kitchen according to Vastu?',
    a: 'The South-East (Agneya) zone is the canonical Vastu placement for the kitchen because it is the fire zone. The cook should face East while cooking. North-West is the secondary acceptable zone. Avoid kitchens in the North-East, which is the water/spiritual zone.',
  },
  {
    q: 'How can Vastu dosh be fixed without demolition?',
    a: 'Most minor Vastu doshas can be remedied without structural changes — common fixes include placing a brass pyramid in the affected zone, mirrors to redirect energy flow, salt bowls to absorb negative energy, or specific colors on walls. Major doshas (toilet in NE, kitchen in NE) usually need structural correction.',
  },
  {
    q: 'Which direction is best for the master bedroom according to Vastu?',
    a: 'The master bedroom is best placed in the South-West (Nairutya) zone, which is the earth element zone associated with stability and authority. Sleep with the head pointing South or East — never North, which is considered inauspicious for sleep direction.',
  },
  {
    q: 'Where should a toilet or bathroom be placed according to Vastu?',
    a: 'Toilets are best placed in the West or North-West, with the WC facing North or South so the user faces East or West. Strictly avoid toilets in the North-East (most auspicious zone) and the South-East (fire zone) — these are the two worst placements per traditional Vastu.',
  },
]

export const STAMP_DUTY_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'What is stamp duty and why is it paid?',
    a: 'Stamp duty is a state-level tax paid to register a property transaction with the government. Without paying stamp duty and registering the sale deed, the transaction is not legally enforceable in court. Rates vary by state (3–8%) and by buyer category (women often get a 1–2% concession).',
  },
  {
    q: 'How much stamp duty applies on a ₹1 crore flat in Mumbai?',
    a: 'In Maharashtra (Mumbai/Pune urban), stamp duty is currently 6% for men and 5% for women, plus 1% registration charge. So on a ₹1 crore flat, a male buyer pays approx ₹6 lakh stamp duty + ₹1 lakh registration = ₹7 lakh total. A female buyer saves ₹1 lakh.',
  },
  {
    q: 'Who pays stamp duty in India: buyer or seller?',
    a: 'In India, stamp duty is paid by the buyer in 99% of cases, regardless of state. This is a long-standing convention — the seller only handles capital gains tax. Some states allow joint stamp paper but the cost is borne by the buyer.',
  },
  {
    q: 'Do female buyers get a stamp duty concession?',
    a: 'Yes — most Indian states offer a 1–2% concession on stamp duty if the property is registered solely in a woman\'s name or jointly with a woman as the primary owner. Maharashtra, Delhi, Haryana, UP, Rajasthan, Punjab, and others have this concession.',
  },
  {
    q: 'How are stamp duty and registration charges calculated?',
    a: 'Stamp duty is calculated on the higher of (a) the agreement value or (b) the state\'s ready reckoner / circle rate. Registration charge is a separate 1% on the same value, capped at ₹30,000 in some states. Use the calculator above for state-wise live rates.',
  },
  {
    q: 'When is stamp duty paid for an under-construction flat?',
    a: 'For under-construction properties, stamp duty is paid at the time of registering the sale agreement (typically when 20–25% payment is made). A separate registration fee may apply when the sale deed is executed at possession. GST (5% on under-construction) is paid separately to the builder.',
  },
]

export const HOME_BUYING_COST_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'What is the total cost of buying a house in India?',
    a: 'On top of the agreement value, budget for stamp duty (3–8% by state), registration (usually 1%), GST on under-construction property (5%, or 1% for affordable housing), brokerage (around 1% on resale), legal and documentation fees, and the home loan processing fee (0.25–1% of the loan). Together these one-time charges are typically 7–14% of the property price.',
  },
  {
    q: 'How much down payment do I need for a home loan?',
    a: 'RBI caps the loan-to-value ratio at 90% for properties up to ₹30 lakh, 80% for ₹30–75 lakh, and 75% above ₹75 lakh. So the minimum down payment is 10%, 20%, or 25% of the property value. Stamp duty, registration, and GST are not financed by most banks and must be paid in cash on top of the down payment.',
  },
  {
    q: 'How is home loan EMI calculated?',
    a: 'EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the tenure in months. A ₹50 lakh loan at 8.5% for 20 years works out to about ₹43,400 a month.',
  },
  {
    q: 'Is GST charged on a ready-to-move flat?',
    a: 'No. GST applies only to under-construction property sold before the completion certificate is issued: 5% without input tax credit, or 1% for affordable housing (value up to ₹45 lakh and carpet area within 60 sq m in metros or 90 sq m elsewhere). Ready-to-move and resale homes attract no GST.',
  },
  {
    q: 'Can stamp duty be included in the home loan?',
    a: 'Generally no. Banks lend against the agreement value and treat stamp duty, registration, and GST as the buyer\'s own contribution. Plan to pay these from savings along with your down payment.',
  },
]

export const MATERIAL_CALC_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'What is the cement, sand, and aggregate ratio for M20 concrete?',
    a: 'M20 grade concrete (20 N/mm² strength) uses a nominal mix ratio of 1:1.5:3 — that is, 1 part cement, 1.5 parts sand, 3 parts aggregate. For 1 cubic meter of M20 concrete you need approximately 8 bags of cement (50 kg each), 0.42 cum sand, and 0.83 cum aggregate.',
  },
  {
    q: 'What cement and sand ratio should be used for plaster?',
    a: 'Internal plaster (12 mm thick) uses a 1:6 cement-to-sand ratio. External plaster (15–20 mm thick) uses a stronger 1:4 mix to resist weathering. Per 100 sq ft of 12 mm plaster, you need approximately 1 bag cement + 5.5 cuft sand.',
  },
  {
    q: 'How much steel is required for an RCC slab?',
    a: 'For a residential RCC slab, the standard steel requirement is 80–100 kg per cubic meter of concrete (or 1% of the concrete volume). For commercial/multi-storey work this rises to 120–150 kg/cum. Our calculator above uses 100 kg/cum as the default.',
  },
  {
    q: 'How many cubic feet are in one cement bag?',
    a: 'One 50 kg bag of cement equals approximately 1.226 cubic feet (0.0347 cum) by loose volume. This is the standard density used in BIS code IS 4926 calculations for concrete and mortar mixes.',
  },
  {
    q: 'How much cement is needed for a 1000 sq ft house?',
    a: 'A standard 1000 sq ft single-floor RCC house needs roughly 400 bags of cement (50 kg each) — about 100 bags for the slab, 80 for columns/beams, 100 for brickwork mortar, and 120 for plaster. This varies ±20% based on slab thickness, wall type, and finishing spec.',
  },
  {
    q: 'How many bricks are needed per square meter of wall?',
    a: 'A standard 9-inch (230 mm) brick wall needs approximately 100 bricks per square meter of wall area. A 4.5-inch (115 mm) partition wall needs 50 bricks per sq m. Add 5% for breakage during transport and laying.',
  },
]

export const CONSTRUCTION_COST_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'How much does it cost to build a 1,000 sq ft house in India?',
    a: `At 2026 rates, a standard-finish 1,000 sq ft house costs about ${costRange(1000, 'standard')} (${rateRange('standard')}) across the cities we track. Basic finish is ${costRange(1000, 'basic')}, premium ${costRange(1000, 'premium')} and luxury ${costRange(1000, 'luxury')}. The low end is our cheapest tracked city and the high end is our most expensive tracked city.`,
  },
  {
    q: 'What is the construction cost per sq ft in 2026?',
    a: `Across the cities we track, construction cost runs ${rateRange('basic')} for basic finish, ${rateRange('standard')} for standard, ${rateRange('premium')} for premium and ${rateRange('luxury')} for luxury. These cover labour and material for civil work only. They exclude land, government approvals and interior fit-out.`,
  },
  {
    q: 'What is included in construction cost?',
    a: 'Standard construction cost includes: civil structure (foundation, slab, columns, walls), basic electrical and plumbing, doors and windows, basic flooring (vitrified tile), basic painting, and labour. It excludes: modular kitchen, false ceiling, AC, premium fittings, landscaping, compound wall, and government approval fees.',
  },
  {
    q: 'What is the material and labour cost ratio in construction?',
    a: 'In Indian residential construction, the typical split is 65% materials + 30% labour + 5% contingency. Materials = cement (15%), steel (12%), bricks/blocks (10%), aggregates (8%), finishing (20%). Labour includes mason, carpenter, plumber, electrician, painter.',
  },
  {
    q: 'Can construction cost be covered through a loan?',
    a: 'Yes — most banks offer construction loans up to 75% of the estimated cost (after deducting plot value if owned). EMI starts after each disbursement tranche. SBI Realty, HDFC Construction Loan, and ICICI Home Loan are common options at 8.4–9.5% interest in 2026.',
  },
]

export const CAPITAL_GAINS_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'How much capital gains tax applies when selling property?',
    a: 'Property held for more than 24 months is long-term. Its gain is taxed at 12.5% without indexation, plus 4% health and education cess (and surcharge if your income is above ₹50 lakh). Residents and HUFs who bought before 23 July 2024 can instead pay 20% with indexation if that is lower. Property held for 24 months or less is short-term, and its gain is added to your income and taxed at slab rates.',
  },
  {
    q: 'Is exactly 24 months long-term?',
    a: 'No. Property must be held for more than 24 months to be long-term. If you sell on the day the 24th month ends, or earlier, the gain is short-term and taxed at your slab rate. Selling one day later makes it long-term, so check the dates before you sign the sale agreement.',
  },
  {
    q: 'Has the indexation benefit been removed for property?',
    a: 'For most sales, yes. For sales on or after 23 July 2024, long-term gains on land or buildings are taxed at 12.5% without indexation. There is a grandfathering choice for resident individuals and HUFs who acquired the property before 23 July 2024: they pay the lower of 12.5% without indexation or 20% with indexation. NRIs and companies get only the 12.5% rate. Sales before 23 July 2024 were taxed at 20% with indexation only.',
  },
  {
    q: 'What are the new section numbers under the Income-tax Act 2025?',
    a: 'The Income-tax Act 2025 has been in force since 1 April 2026, and "assessment year" is now "tax year". The long-term capital gains rate section 112 is now section 197. The exemptions are renumbered: section 54 is now section 82, section 54EC is now section 85 and section 54F is now section 86. The rules are the same, only the numbers changed.',
  },
  {
    q: 'How does the section 82 (old section 54) exemption work?',
    a: 'Section 82 lets an individual or HUF avoid tax on the long-term gain from selling a residential house by buying another house one year before or two years after the sale, or by constructing one within three years. Only the gain needs to be reinvested, not the full sale value. A new house cost above ₹10 crore is ignored. If the gain is ₹2 crore or less, you can choose one time in your life to buy two houses.',
  },
  {
    q: 'How does section 85 (old section 54EC) work?',
    a: 'Section 85 applies only to long-term gains from land or a building. You invest the gain in specified bonds within 6 months of the sale, up to ₹50 lakh in total, with a 5-year lock-in. Eligible issuers are REC, PFC, IRFC, HUDCO and IREDA; NHAI no longer issues these bonds. The amount invested is exempted from the gain rupee for rupee. It does not cut your tax rupee for rupee.',
  },
  {
    q: 'What is section 86 (old section 54F)?',
    a: 'Section 86 applies when you sell a long-term asset other than a residential house, such as a plot of land, and invest the net sale value in a residential house. If you invest all of it, the whole gain is exempt. If you invest only part, the exemption is pro-rata to the net sale value. The ₹10 crore cap on the new house cost applies here too.',
  },
  {
    q: 'How is capital gains tax worked out for an NRI selling property?',
    a: 'An NRI pays long-term capital gains tax at 12.5% without indexation, plus 4% cess and surcharge where it applies, on property sold on or after 23 July 2024. The grandfathering choice of 20% with indexation is only for resident individuals and HUFs. The buyer must deduct TDS on the payment, so the tax is often collected at the time of sale. The NRI can claim a refund when filing the return if too much was deducted.',
  },
  {
    q: 'I bought the property before 2001. What cost do I use?',
    a: 'For property acquired before 1 April 2001, you can use its fair market value on 1 April 2001 as the cost of acquisition, if that is higher than what was paid. Enter that value as the purchase price and any date in FY 2001-02, such as 1 April 2001. The index for 2001-02 is 100, the base year.',
  },
  {
    q: 'Does capital gains tax apply when selling inherited property?',
    a: 'Inheritance itself is not taxed in India, but selling inherited property attracts capital gains tax. The cost of acquisition is what the previous owner paid, and the holding period includes their tenure, so most inherited properties are long-term.',
  },
  {
    q: 'What is the Capital Gains Account Scheme (CGAS)?',
    a: 'CGAS lets you park the gain in a designated bank account if you cannot reinvest before the due date for filing your return. You must use the money for the house within the section 82 time limits. Money not used in time becomes taxable as long-term capital gain.',
  },
]

export const PLOT_CONVERTER_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'How many square feet are in 1 gaj?',
    a: 'In North India, 1 gaj = 9 square feet (1 sq yard). So a 100 gaj plot is 900 sq ft. In South India, gaj is rarely used — square feet and ground (1 ground = 2400 sq ft) are more common.',
  },
  {
    q: 'How many gaj are in 1 acre?',
    a: '1 acre = 43,560 square feet. Since 1 gaj = 9 square feet, 1 acre = 4,840 gaj. For example, 0.5 acre is 2,420 gaj and 2 acre is 9,680 gaj.',
  },
  {
    q: 'How does kanal to acre conversion work?',
    a: 'In Punjab, Haryana and Jammu & Kashmir planning records, 1 kanal = 5,445 square feet. So 1 kanal = 0.125 acre and 8 kanal = 1 acre.',
  },
  {
    q: 'What is the kanal to hectare conversion?',
    a: '1 kanal = 5,445 square feet and 1 hectare = 107,639 square feet. So 1 kanal is approximately 0.0506 hectare, and 1 hectare is about 19.77 kanal.',
  },
  {
    q: 'What is bigha to kanal conversion?',
    a: 'Bigha size changes by state, so bigha to kanal is not the same everywhere. Using the common UP/Bihar planning standard, 1 bigha = 27,000 square feet, which is about 4.96 kanal. Always check the local bigha definition before using it for legal land records.',
  },
  {
    q: 'How many square feet are in 1 bigha?',
    a: 'Bigha varies massively by state — UP/Bihar: 27,000 sq ft; Rajasthan: 27,225 sq ft (pucca) or 17,424 (kachcha); Madhya Pradesh: 12,000 sq ft; West Bengal: 14,400 sq ft; Punjab: 9,070 sq ft. Always confirm the local definition before buying agricultural land.',
  },
  {
    q: 'How many square feet are in a 100 gaj plot?',
    a: 'A 100 gaj plot is 900 square feet, because 1 gaj = 9 square feet. In feet, a 100 gaj plot may be 30 ft × 30 ft, 20 ft × 45 ft, or another layout with the same total 900 sq ft area.',
  },
  {
    q: 'How many square feet are in 1 acre?',
    a: '1 acre = 43,560 square feet = 4,840 square yards = 4,047 square meters. In Indian land units, 1 acre ≈ 4 bigha (UP) ≈ 18 ground (Tamil Nadu) ≈ 100 cents (Kerala/Karnataka).',
  },
  {
    q: 'What is a cent and how many square feet does it have?',
    a: 'Cent is the standard land unit in Kerala, Tamil Nadu, and Karnataka. 1 cent = 435.6 square feet = 1/100th of an acre. So 100 cents = 1 acre. A typical residential plot in these states is 5–15 cents.',
  },
]

export const IMAGE_TOOL_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: 'How accurate are these AI renders?',
    a: 'Our AI is tuned for quick visualisation and mood-boarding. Results are great for concept exploration but should not be used for construction-grade renders. For photorealistic professional output, hire a 3D artist — this tool is for ideation, not final delivery.',
  },
  {
    q: 'Which image format is needed for floor plan 3D conversion?',
    a: 'Upload a clean 2D floor plan (PNG, JPG, or WebP, max 10 MB). Best results with crisp black lines on white background — hand-drawn sketches and screenshots from CAD software both work. Avoid plans with heavy dimensions clutter as they confuse the model.',
  },
  {
    q: 'How long does it take to generate a render?',
    a: 'Each render takes 15–40 seconds depending on quality setting. Medium ≈ 15s, High ≈ 30s. The first render of the day may take a bit longer as the service warms up. You can regenerate as many times as you want until you like a result.',
  },
  {
    q: 'Why is there a daily limit?',
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
  title: 'Property capital gains tax in India for FY 2026-27',
  paragraphs: [
    'When you sell a property in India, the profit is the sale price, less transfer expenses such as brokerage and legal fees, less your cost of acquisition and cost of improvement. If you held the property for more than 24 months it is long-term. Exactly 24 months or less is short-term, and the gain is added to your income and taxed at slab rates.',
    'Long-term gains on land and buildings are taxed at 12.5% without indexation, plus 4% health and education cess (and surcharge if your income is above ₹50 lakh). Resident individuals and HUFs who acquired the property before 23 July 2024 can instead pay 20% with indexation, whichever is lower, on a sale on or after that date. NRIs and companies get only the 12.5% rate, and the buyer deducts TDS. For FY 2026-27 the Cost Inflation Index is 384 (CBDT Notification 85/2026). If you bought before 1 April 2001, you can use the fair market value on that date as your cost.',
    'You can reduce the taxable gain by reinvesting. Under the Income-tax Act 2025, section 82 (old 54) covers buying or building a house, and section 85 (old 54EC) covers specified bonds up to ₹50 lakh. Section 86 (old 54F) applies when you sell an asset other than a house. Section 85 exempts the gain rupee for rupee, it does not reduce the tax rupee for rupee. Talk to a CA before filing if the sale value is large.',
  ],
}
