import type { RemedyCost } from "../types"

interface RemedyTemplate {
  cost: RemedyCost
  estimatedPrice: string
  description: string
  impact: number
}

export const REMEDY_TEMPLATES: Record<string, RemedyTemplate[]> = {
  H1: [
    {
      cost: "structural",
      estimatedPrice: "₹10,000-50,000",
      description: "Relocate toilet from NE to NW or W zone",
      impact: 10,
    },
    {
      cost: "low",
      estimatedPrice: "₹500-2,000",
      description:
        "Place a Vastu pyramid or salt lamp in NE to neutralize negative energy",
      impact: 4,
    },
  ],
  H2: [
    {
      cost: "structural",
      estimatedPrice: "₹15,000-60,000",
      description: "Relocate kitchen from SW to SE zone",
      impact: 15,
    },
    {
      cost: "low",
      estimatedPrice: "₹1,000-3,000",
      description:
        "Place the cooking stove in the SE corner of the current kitchen",
      impact: 5,
    },
  ],
  H3: [
    {
      cost: "structural",
      estimatedPrice: "₹20,000-1,00,000",
      description: "Create a new main entrance in E or N direction",
      impact: 20,
    },
    {
      cost: "low",
      estimatedPrice: "₹2,000-5,000",
      description:
        "Place a Vastu yantra or auspicious symbols at the S entrance to mitigate effect",
      impact: 8,
    },
  ],
  H4: [
    {
      cost: "structural",
      estimatedPrice: "₹50,000+",
      description:
        "Remove load-bearing structure from Brahmasthan; consult structural engineer",
      impact: 15,
    },
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Keep Brahmasthan area well-lit and clutter-free to reduce negative impact",
      impact: 5,
    },
  ],
  S1: [
    {
      cost: "structural",
      estimatedPrice: "₹10,000-40,000",
      description: "Swap master bedroom to SW zone",
      impact: 15,
    },
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Place the bed in the SW corner of the current room with head facing South",
      impact: 5,
    },
  ],
  S2: [
    {
      cost: "structural",
      estimatedPrice: "₹30,000-1,00,000",
      description: "Relocate staircase from NE to S, W, or SW zone",
      impact: 10,
    },
    {
      cost: "low",
      estimatedPrice: "₹1,000-3,000",
      description:
        "Place heavy objects or Vastu remedies under the staircase to ground energy",
      impact: 4,
    },
  ],
  S3: [
    {
      cost: "structural",
      estimatedPrice: "₹15,000-60,000",
      description: "Relocate kitchen to SE zone",
      impact: 15,
    },
    {
      cost: "low",
      estimatedPrice: "₹500-1,000",
      description: "Ensure cooking stove faces SE direction within the kitchen",
      impact: 5,
    },
  ],
  S4: [
    {
      cost: "structural",
      estimatedPrice: "₹5,000-20,000",
      description: "Move puja room to NE zone",
      impact: 10,
    },
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Create a small puja corner in the NE area of the existing room",
      impact: 4,
    },
  ],
  S5: [
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Arrange main seating area to face N or E direction in the current room",
      impact: 3,
    },
    {
      cost: "low",
      estimatedPrice: "₹1,000-3,000",
      description:
        "Use light colors (white, cream, light blue) in the living room to enhance positive energy",
      impact: 2,
    },
  ],
  S6: [
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Place guest bed with head facing W in the current room to mitigate effect",
      impact: 2,
    },
    {
      cost: "structural",
      estimatedPrice: "₹5,000-15,000",
      description: "Swap guest bedroom to NW zone",
      impact: 5,
    },
  ],
  S7: [
    {
      cost: "structural",
      estimatedPrice: "₹10,000-40,000",
      description: "Relocate toilet from SE to NW or W zone",
      impact: 5,
    },
    {
      cost: "low",
      estimatedPrice: "₹500-1,500",
      description:
        "Keep toilet door closed at all times and place air-purifying plants nearby",
      impact: 2,
    },
  ],
  S8: [
    {
      cost: "low",
      estimatedPrice: "₹2,000-5,000",
      description:
        "Add auspicious symbols (toran, swastik) at the entrance to enhance positivity",
      impact: 3,
    },
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Keep entrance well-lit, clean, and clutter-free to invite positive energy",
      impact: 2,
    },
  ],
  S9: [
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Face W while eating; arrange dining table so head of family faces W",
      impact: 3,
    },
    {
      cost: "structural",
      estimatedPrice: "₹5,000-15,000",
      description: "Move dining area to W or SE zone",
      impact: 5,
    },
  ],
  S10: [
    {
      cost: "free",
      estimatedPrice: "₹0",
      description:
        "Move heavy items (almirah, safe) to SW or S corner of the current room",
      impact: 3,
    },
    {
      cost: "structural",
      estimatedPrice: "₹5,000-15,000",
      description: "Relocate store room to SW or S zone",
      impact: 5,
    },
  ],
}
