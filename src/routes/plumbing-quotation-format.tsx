import { createFileRoute } from '@tanstack/react-router'
import { ToolSection } from '#/components/tools/tool-section'
import { useCounts } from '#/components/tools/trade-quote-builders'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { finishingHead } from '#/data/finishing-calc-content'
import { PLUMBING_QUOTATION_CONTENT as CONTENT } from '#/data/quote-content/plumbing'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'

export const Route = createFileRoute('/plumbing-quotation-format')({
  component: PlumbingQuotationPage,
  head: () => finishingHead(CONTENT),
})

const FIXTURES = [
  { key: 'bath', label: 'Bathrooms', initial: '2' },
  { key: 'wc', label: 'WCs', initial: '2' },
  { key: 'basin', label: 'Wash basins', initial: '2' },
  { key: 'shower', label: 'Showers', initial: '2' },
  { key: 'sink', label: 'Kitchen sinks', initial: '1' },
  { key: 'tap', label: 'Other taps', initial: '6' },
] as const

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'cpvc', description: 'CPVC pipe, hot and cold supply (material)', unit: 'running m' },
  { id: 'pvc', description: 'PVC / uPVC drainage pipe (material)', unit: 'running m' },
  { id: 'fittings', description: 'Fittings: elbows, tees, valves (material)', unit: 'lot', qty: '1' },
  { id: 'diverter', description: 'Concealed diverter or stop cock (material)', unit: 'nos', auto: 'bath' },
  { id: 'labour', description: 'Labour: plumbing per sanitary point', unit: 'point', auto: 'points' },
  { id: 'wc', description: 'Labour: WC fixing', unit: 'nos', auto: 'wc' },
  { id: 'basin', description: 'Labour: wash basin and sink fixing', unit: 'nos', auto: 'basins' },
]

function PlumbingQuotationPage() {
  const fixtures = useCounts(FIXTURES)
  const c = fixtures.counts
  const points = c.wc + c.basin + c.shower + c.sink + c.tap

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="Plumbing quotation"
      tool="plumbing"
      defaultLines={LINES}
      autoQty={{ bath: c.bath, points, wc: c.wc, basins: c.basin + c.sink }}
      defaultTerms={{
        advance: '40',
        validity: '15',
        exclusions:
          'Sanitaryware, taps and fittings supplied by the client, the water tank, and chasing and patching of walls are not included unless listed above.',
      }}
      builder={
        <ToolSection
          label="Fixtures"
          description="Count each fixture. The totals fill in labour per point and fixing lines below."
        >
          <div className="flex flex-col gap-6">
            {fixtures.node}
            <BuilderSummary>
              Sanitary points <b><span>{points}</span></b>
              {' · '}bathrooms <span>{c.bath}</span>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
    />
  )
}
