import type { StampDutyRate } from '#/data/stamp-duty-rates'

export type StampDutyGender = 'male' | 'female' | 'joint'

export interface StampDutyInput {
  propertyValue: number
  rate: StampDutyRate
  gender: StampDutyGender
  loanLtvPercent: number
}

export interface StampDutyResult {
  stampDutyPercent: number
  stampDutyAmount: number
  registrationAmount: number
  totalGovernmentCharges: number
  downPayment: number
  totalCashRequired: number
}

export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
  const propertyValue = positive(input.propertyValue)
  const loanLtv = Math.min(Math.max(percent(input.loanLtvPercent), 0), 0.9)
  const stampDutyPercent = input.rate[input.gender]
  const stampDutyAmount = propertyValue * percent(stampDutyPercent)
  const uncappedRegistration = propertyValue * percent(input.rate.registration)
  const registrationAmount = input.rate.registrationCap
    ? Math.min(uncappedRegistration, input.rate.registrationCap)
    : uncappedRegistration
  const totalGovernmentCharges = stampDutyAmount + registrationAmount
  const downPayment = propertyValue * (1 - loanLtv)

  return {
    stampDutyPercent,
    stampDutyAmount,
    registrationAmount,
    totalGovernmentCharges,
    downPayment,
    totalCashRequired: totalGovernmentCharges + downPayment,
  }
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0
}

function percent(value: number) {
  return Number.isFinite(value) ? value / 100 : 0
}
