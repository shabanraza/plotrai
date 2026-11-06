import { createFileRoute } from '@tanstack/react-router'
import { ToolSection } from '#/components/tools/tool-section'
import { useCounts } from '#/components/tools/trade-quote-builders'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { finishingHead } from '#/data/finishing-calc-content'
import { ELECTRICAL_QUOTATION_CONTENT as CONTENT } from '#/data/quote-content/electrical'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'

export const Route = createFileRoute('/electrical-quotation-format')({
  component: ElectricalQuotationPage,
  head: () => finishingHead(CONTENT),
})

const POINTS = [
  { key: 'light', label: 'Light points', initial: '14' },
  { key: 'fan', label: 'Fan points', initial: '5' },
  { key: 'socket', label: 'Socket points (6 A)', initial: '12' },
  { key: 'power', label: 'Power points (16 A)', initial: '4' },
  { key: 'ac', label: 'AC points', initial: '2' },
  { key: 'db', label: 'Distribution boards', initial: '1' },
] as const

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'w15', description: 'Copper wire 1.5 sq mm, lights and fans (material)', unit: 'coil' },
  { id: 'w25', description: 'Copper wire 2.5 sq mm, sockets (material)', unit: 'coil' },
  { id: 'w4', description: 'Copper wire 4 sq mm, power and AC (material)', unit: 'coil' },
  { id: 'conduit', description: 'PVC conduit, boxes and accessories (material)', unit: 'lot', qty: '1' },
  { id: 'switches', description: 'Modular switches, sockets and plates (material)', unit: 'point', auto: 'points' },
  { id: 'db', description: 'Distribution board (material)', unit: 'nos', auto: 'db' },
  { id: 'mcb', description: 'MCBs and RCCB (material)', unit: 'nos' },
  { id: 'labour', description: 'Labour: wiring per point', unit: 'point', auto: 'points' },
  { id: 'fitting', description: 'Labour: fixing lights and fans', unit: 'nos', auto: 'fixtures' },
]

function ElectricalQuotationPage() {
  const points = useCounts(POINTS)
  const c = points.counts
  const total = c.light + c.fan + c.socket + c.power + c.ac

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="Electrical quotation"
      tool="electrical"
      defaultLines={LINES}
      autoQty={{ points: total, db: c.db, fixtures: c.light + c.fan }}
      defaultTerms={{
        advance: '40',
        validity: '15',
        exclusions:
          'Light fittings, fans, chasing and patching of walls, and the electricity meter connection are not included unless listed above.',
      }}
      builder={
        <ToolSection
          label="Points to wire"
          description="Count each outlet. The totals fill in switches, labour per point and fittings below."
        >
          <div className="flex flex-col gap-6">
            {points.node}
            <BuilderSummary>
              Total <b><span>{total} points</span></b>
              {' · '}lights and fans <span>{c.light + c.fan}</span>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
    />
  )
}
