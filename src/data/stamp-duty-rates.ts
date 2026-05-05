/**
 * Indian state-wise stamp duty + registration rates.
 *
 * Rates as of 2026-Q2, sourced from each state's Inspector General of Registration (IGR) portal.
 * Rates change frequently — refresh quarterly. Always cross-check the IGR portal for the
 * latest before legal documents.
 */

export interface StampDutyRate {
  /** % stamp duty for male buyer / individual */
  male: number
  /** % stamp duty for female buyer */
  female: number
  /** % stamp duty for joint owners (typically male+female) */
  joint: number
  /** % registration charges */
  registration: number
  /** Flat-fee cap on registration, if any (₹) */
  registrationCap?: number
  /** Free-text note shown to user */
  note?: string
}

export interface RegionEntry {
  /** Display label */
  city: string
  rates: StampDutyRate
}

export interface StateEntry {
  state: string
  /** Default rate when no city is selected */
  default: StampDutyRate
  /** Optional city-level overrides (Mumbai differs from rest of MH, etc.) */
  cities?: ReadonlyArray<RegionEntry>
}

export const STAMP_DUTY: ReadonlyArray<StateEntry> = [
  {
    state: 'Maharashtra',
    default: { male: 6, female: 5, joint: 5.5, registration: 1, note: 'Includes 1% metro cess.' },
    cities: [
      {
        city: 'Mumbai',
        rates: { male: 6, female: 5, joint: 5.5, registration: 1, note: '1% metro cess included.' },
      },
      {
        city: 'Pune',
        rates: { male: 7, female: 6, joint: 6.5, registration: 1, note: '1% LBT + 1% metro cess.' },
      },
      { city: 'Nagpur', rates: { male: 6, female: 5, joint: 5.5, registration: 1 } },
      { city: 'Nashik', rates: { male: 6, female: 5, joint: 5.5, registration: 1 } },
    ],
  },
  {
    state: 'Karnataka',
    default: {
      male: 5,
      female: 5,
      joint: 5,
      registration: 1,
      note: '3% for ₹21–45 lakh, 2% below ₹21 lakh.',
    },
    cities: [
      { city: 'Bangalore', rates: { male: 5, female: 5, joint: 5, registration: 1 } },
      { city: 'Mysore', rates: { male: 5, female: 5, joint: 5, registration: 1 } },
      { city: 'Mangalore', rates: { male: 5, female: 5, joint: 5, registration: 1 } },
    ],
  },
  {
    state: 'Delhi (NCT)',
    default: { male: 6, female: 4, joint: 5, registration: 1 },
  },
  {
    state: 'Tamil Nadu',
    default: { male: 7, female: 7, joint: 7, registration: 4 },
    cities: [
      { city: 'Chennai', rates: { male: 7, female: 7, joint: 7, registration: 4 } },
      { city: 'Coimbatore', rates: { male: 7, female: 7, joint: 7, registration: 4 } },
    ],
  },
  {
    state: 'Telangana',
    default: { male: 4, female: 4, joint: 4, registration: 0.5 },
    cities: [{ city: 'Hyderabad', rates: { male: 4, female: 4, joint: 4, registration: 0.5 } }],
  },
  {
    state: 'Uttar Pradesh',
    default: {
      male: 7,
      female: 6,
      joint: 6.5,
      registration: 1,
      note: 'Female buyers get ₹10,000 rebate (effectively 1% lower up to ₹10 lakh).',
    },
    cities: [
      { city: 'Lucknow', rates: { male: 7, female: 6, joint: 6.5, registration: 1 } },
      { city: 'Noida', rates: { male: 7, female: 6, joint: 6.5, registration: 1 } },
      { city: 'Greater Noida', rates: { male: 7, female: 6, joint: 6.5, registration: 1 } },
      { city: 'Ghaziabad', rates: { male: 7, female: 6, joint: 6.5, registration: 1 } },
    ],
  },
  {
    state: 'West Bengal',
    default: {
      male: 6,
      female: 5,
      joint: 5.5,
      registration: 1,
      note: '6%/5% urban; 5%/4% rural. Uses urban rates by default.',
    },
    cities: [{ city: 'Kolkata', rates: { male: 6, female: 5, joint: 5.5, registration: 1 } }],
  },
  {
    state: 'Gujarat',
    default: { male: 4.9, female: 4.9, joint: 4.9, registration: 1, note: 'No gender concession.' },
    cities: [
      { city: 'Ahmedabad', rates: { male: 4.9, female: 4.9, joint: 4.9, registration: 1 } },
      { city: 'Surat', rates: { male: 4.9, female: 4.9, joint: 4.9, registration: 1 } },
    ],
  },
  {
    state: 'Rajasthan',
    default: { male: 6, female: 5, joint: 5.5, registration: 1 },
    cities: [{ city: 'Jaipur', rates: { male: 6, female: 5, joint: 5.5, registration: 1 } }],
  },
  {
    state: 'Punjab',
    default: { male: 7, female: 5, joint: 6, registration: 1 },
  },
  {
    state: 'Haryana',
    default: {
      male: 7,
      female: 5,
      joint: 6,
      registration: 1,
      registrationCap: 50000,
      note: 'Registration capped at ₹50,000 in urban areas.',
    },
    cities: [
      {
        city: 'Gurgaon',
        rates: { male: 7, female: 5, joint: 6, registration: 1, registrationCap: 50000 },
      },
      {
        city: 'Faridabad',
        rates: { male: 7, female: 5, joint: 6, registration: 1, registrationCap: 50000 },
      },
    ],
  },
  {
    state: 'Madhya Pradesh',
    default: { male: 7.5, female: 7.5, joint: 7.5, registration: 3 },
  },
  {
    state: 'Kerala',
    default: { male: 8, female: 8, joint: 8, registration: 2, note: 'No gender concession.' },
  },
  {
    state: 'Odisha',
    default: { male: 5, female: 4, joint: 4.5, registration: 2 },
  },
  {
    state: 'Andhra Pradesh',
    default: { male: 5, female: 5, joint: 5, registration: 1 },
  },
  {
    state: 'Bihar',
    default: { male: 6, female: 5.7, joint: 5.85, registration: 2 },
  },
  {
    state: 'Chandigarh (UT)',
    default: { male: 5, female: 4, joint: 4.5, registration: 1 },
  },
]

export const STAMP_DUTY_LAST_UPDATED = '2026-Q2'
