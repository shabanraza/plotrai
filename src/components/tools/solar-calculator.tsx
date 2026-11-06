import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { QuantityToolPage } from '#/components/tools/quantity-tool-page'
import { ToolSection } from '#/components/tools/tool-section'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '#/components/ui/field'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '#/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import type { FinishingToolContent } from '#/data/finishing-calc-content'
import { SOLAR_CITIES, type StateSolarInfo } from '#/data/solar-city-content'
import { formatQty } from '#/lib/finishing-calc'
import {
  DEFAULT_COST_PER_KW,
  DEFAULT_UNITS_PER_KW_PER_DAY,
  SPECIAL_CATEGORY_STATES,
  SYSTEM_SIZES_KW,
  calculateSolar,
  centralSubsidy,
  formatRupees,
  portalSizeBand,
  sizeForUnits,
  stateSubsidyFor,
  type StateCategory,
} from '#/lib/solar-calc'

/**
 * Rooftop solar cost calculator shared by /solar-panel-cost-calculator and the city pages.
 * A state rule, when given, fills in the state subsidy until the visitor types their own.
 */
export function SolarCalculator({
  content,
  stateRule,
  currentCity,
}: {
  content: FinishingToolContent
  stateRule?: StateSolarInfo['rule']
  /** Slug of the city page, left out of the city list */
  currentCity?: string
}) {
  const [units, setUnits] = useState('300')
  const [tariff, setTariff] = useState('7')
  const [kw, setKw] = useState('3')
  const [category, setCategory] = useState<StateCategory>('general')
  const [costPerKw, setCostPerKw] = useState(String(DEFAULT_COST_PER_KW))
  const [stateSubsidy, setStateSubsidy] = useState(stateRule ? '' : '0')
  const [yieldPerKw, setYieldPerKw] = useState(
    String(DEFAULT_UNITS_PER_KW_PER_DAY),
  )

  const monthlyUnits = parseNumber(units)
  const size = parseNumber(kw)
  const suggested = sizeForUnits(monthlyUnits, parseNumber(yieldPerKw))
  const autoState =
    stateRule && stateSubsidy === '' ? stateSubsidyFor(size, stateRule) : null
  const stateAmount = autoState ?? parseNumber(stateSubsidy)

  const result = useMemo(
    () =>
      calculateSolar({
        kw: size,
        category,
        costPerKw: parseNumber(costPerKw),
        stateSubsidy: stateAmount,
        monthlyUnits,
        tariff: parseNumber(tariff),
        unitsPerKwPerDay: parseNumber(yieldPerKw),
      }),
    [size, category, costPerKw, stateAmount, monthlyUnits, tariff, yieldPerKw],
  )

  const net = formatRupees(result.netCost)
  const sizeLabel = `${formatQty(size, 1)} kW`
  const payback =
    result.paybackYears === null
      ? 'No savings to pay it back'
      : `Pays back in about ${formatQty(result.paybackYears, 1)} years`

  return (
    <QuantityToolPage
      content={content}
      headline={
        result.grossCost > 0
          ? { label: 'Cost after subsidy', value: net }
          : undefined
      }
      inputs={
        <>
          <ToolSection
            label="Your electricity use"
            description="Take the units from your last few bills, not the amount."
          >
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="solar-units"
                label="Units used a month"
                suffix="units"
                value={units}
                onChange={setUnits}
                description={
                  monthlyUnits > 0
                    ? `About ${formatQty(suggested, 1)} kW covers this. The PM Surya Ghar portal suggests ${portalSizeBand(monthlyUnits)}.`
                    : undefined
                }
              />
              <NumberField
                id="solar-tariff"
                label="Electricity rate"
                suffix="₹ per unit"
                value={tariff}
                onChange={setTariff}
                description="Check the energy charge on your bill."
              />
            </FieldGroup>
          </ToolSection>

          <ToolSection label="Solar system">
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldLegend variant="label">System size</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={kw}
                  onValueChange={(v) => v && setKw(v)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  {SYSTEM_SIZES_KW.map((s) => (
                    <ToggleGroupItem
                      key={s}
                      value={String(s)}
                      className="min-h-10 px-4 tabular-nums"
                    >
                      {s} kW
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="solar-kw"
                  label="Or enter a size"
                  suffix="kW"
                  value={kw}
                  onChange={setKw}
                />
              </FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Where you live</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={category}
                  onValueChange={(v) => v && setCategory(v as StateCategory)}
                  variant="outline"
                  className="flex w-full flex-wrap justify-start"
                >
                  <ToggleGroupItem value="general" className="min-h-10 px-4">
                    Most states
                  </ToggleGroupItem>
                  <ToggleGroupItem value="special" className="min-h-10 px-4">
                    Special category state
                  </ToggleGroupItem>
                </ToggleGroup>
                <FieldDescription>
                  10% more subsidy in the {SPECIAL_CATEGORY_STATES}.
                </FieldDescription>
              </FieldSet>
            </div>
          </ToolSection>

          <ToolSection
            label="Price and generation"
            description="Replace these with your vendor's quote and local figures."
          >
            <FieldGroup className="grid gap-4 sm:grid-cols-3">
              <NumberField
                id="solar-cost"
                label="Installed price"
                suffix="₹ per kW"
                value={costPerKw}
                onChange={setCostPerKw}
                description="Indicative, before subsidy."
              />
              <NumberField
                id="solar-state-subsidy"
                label="State subsidy"
                suffix="₹"
                value={stateSubsidy}
                onChange={setStateSubsidy}
                placeholder={autoState !== null ? String(autoState) : undefined}
                description={
                  stateRule
                    ? `${formatRupees(autoState ?? stateAmount)} from ${stateRule.agency}: ${formatRupees(stateRule.perKw)} per kW up to ${formatRupees(stateRule.cap)}. Type to change.`
                    : 'If your state or discom adds one.'
                }
              />
              <NumberField
                id="solar-yield"
                label="Units per kW a day"
                suffix="units"
                value={yieldPerKw}
                onChange={setYieldPerKw}
                description="3–4 on average (BSES)."
              />
            </FieldGroup>
          </ToolSection>
        </>
      }
      nextFrom="/solar-panel-cost-calculator"
      extra={
        <ToolSection label="Solar panel cost by city">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {currentCity && (
              <li>
                <Link
                  to="/solar-panel-cost-calculator"
                  className="text-[var(--brand)] underline-offset-4 hover:underline"
                >
                  All India
                </Link>
              </li>
            )}
            {SOLAR_CITIES.filter((c) => c.slug !== currentCity).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/solar-panel-cost/$city"
                  params={{ city: c.slug }}
                  className="text-[var(--brand)] underline-offset-4 hover:underline"
                >
                  {c.city}
                </Link>
              </li>
            ))}
          </ul>
        </ToolSection>
      }
      result={
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 rounded-xl bg-[var(--brand-light)] p-5 sm:p-6">
            <p className="text-sm font-medium text-[var(--foreground)]/75">
              Cost after subsidy for {sizeLabel}
            </p>
            <p className="text-3xl font-semibold tracking-tight text-[var(--brand)] tabular-nums sm:text-4xl">
              {net}
            </p>
            <p className="text-sm text-[var(--foreground)]/75">
              {payback}, saving {formatRupees(result.monthlySavings)} a month
            </p>
          </div>
          <Table>
            <TableBody>
              <ResultRow
                label="System cost"
                value={formatRupees(result.grossCost)}
                note={`${sizeLabel} × ${formatRupees(parseNumber(costPerKw))} per kW`}
              />
              <ResultRow
                label="PM Surya Ghar subsidy"
                value={`− ${formatRupees(result.centralSubsidy)}`}
                note={`Central subsidy, capped at ${formatRupees(centralSubsidy(3, category))}`}
              />
              {result.stateSubsidy > 0 && (
                <ResultRow
                  label="State subsidy"
                  value={`− ${formatRupees(result.stateSubsidy)}`}
                  note={
                    stateRule && autoState !== null
                      ? stateRule.agency
                      : undefined
                  }
                />
              )}
            </TableBody>
            <TableFooter className="bg-transparent">
              <ResultRow label="You pay" value={net} />
            </TableFooter>
          </Table>
          <Table>
            <TableBody>
              <ResultRow
                label="Units generated"
                value={`${formatQty(result.monthlyGeneration)} a month`}
              />
              <ResultRow
                label="Units of your use covered"
                value={`${formatQty(result.unitsOffset)} a month`}
                note={
                  result.monthlyGeneration > result.unitsOffset
                    ? 'The surplus goes to the grid and is not counted in savings'
                    : undefined
                }
              />
              <ResultRow
                label="Savings"
                value={`${formatRupees(result.yearlySavings)} a year`}
              />
            </TableBody>
          </Table>
        </div>
      }
    />
  )
}

function ResultRow({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <TableRow>
      <TableCell className="py-3 whitespace-normal">
        <span className="font-medium">{label}</span>
        {note && (
          <span className="block text-sm text-[var(--muted-foreground)]">
            {note}
          </span>
        )}
      </TableCell>
      <TableCell className="py-3 text-right font-semibold tabular-nums">
        {value}
      </TableCell>
    </TableRow>
  )
}
