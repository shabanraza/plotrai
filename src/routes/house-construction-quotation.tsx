import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NumberField, parseNumber } from '#/components/tools/calc-fields'
import { QuoteWaitlist } from '#/components/tools/quote-waitlist'
import { ToolSection } from '#/components/tools/tool-section'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { FieldGroup } from '#/components/ui/field'
import { STAGES } from '#/data/construction-cost-rates'
import { finishingHead } from '#/data/finishing-calc-content'
import { HOUSE_CONSTRUCTION_QUOTATION_CONTENT as CONTENT } from '#/data/quote-content/house-construction'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'
import { formatQty } from '#/lib/finishing-calc'

export const Route = createFileRoute('/house-construction-quotation')({
  component: HouseConstructionQuotationPage,
  head: () => finishingHead(CONTENT),
})

const LINES: ReadonlyArray<TradeLineDef> = STAGES.map((s) => ({
  id: s.key,
  description: `${s.label}: ${s.description.replace(/\.$/, '')}`,
  unit: 'sq ft',
  auto: 'area',
}))

const PAYMENT_SCHEDULE = STAGES.map(
  (s, i) => `${i + 1}. On completion of ${s.label.toLowerCase().replace(' + ', ' and ')}: ${s.percent}%`,
).join('\n')

function HouseConstructionQuotationPage() {
  const [area, setArea] = useState('1000')
  const [floors, setFloors] = useState('2')
  const total = parseNumber(area) * Math.max(1, Math.floor(parseNumber(floors)))

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="House construction quotation"
      tool="house-construction"
      defaultLines={LINES}
      lineItemsLabel="Stages of work"
      autoQty={{ area: total }}
      extraFields={[
        { id: 'spec', label: 'Specification', multiline: true, defaultValue: 'Cement: \nSteel: \nBricks or blocks: \nFlooring allowance: \nSanitary and electrical fittings: ' },
        { id: 'payments', label: 'Payment schedule', multiline: true, defaultValue: PAYMENT_SCHEDULE },
      ]}
      defaultTerms={{
        advance: '10',
        validity: '30',
        exclusions:
          'Plan approval fees, electricity and water connections, boundary wall, borewell, sump and interiors are not included unless listed above.',
      }}
      builder={
        <ToolSection label="House size" description="Built-up area fills in the area on every stage below.">
          <div className="flex flex-col gap-6">
            <FieldGroup className="grid grid-cols-2 gap-4">
              <NumberField id="hc-area" label="Built-up area per floor" suffix="sq ft" value={area} onChange={setArea} />
              <NumberField id="hc-floors" label="Floors" value={floors} onChange={setFloors} />
            </FieldGroup>
            <BuilderSummary>
              Total built-up area <b><span>{formatQty(total, 0)} sq ft</span></b>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
      afterDownload={
        <div className="flex flex-col gap-3 rounded-xl bg-[var(--muted)] p-5">
          <p className="text-base font-semibold">Want quotes with your logo, saved and shareable?</p>
          <p className="text-sm text-[var(--foreground)]/75">
            We are testing branded quotations for contractors. Join the list and we will tell you when it is ready.
          </p>
          <div>
            <QuoteWaitlist tool="/house-construction-quotation" />
          </div>
        </div>
      }
    />
  )
}
