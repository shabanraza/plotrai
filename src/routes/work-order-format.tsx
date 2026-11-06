import { createFileRoute } from '@tanstack/react-router'
import {
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { finishingHead } from '#/data/finishing-calc-content'
import { WORK_ORDER_CONTENT as CONTENT } from '#/data/quote-content/work-order'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'

export const Route = createFileRoute('/work-order-format')({
  component: WorkOrderPage,
  head: () => finishingHead(CONTENT),
})

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'brick', description: 'Brickwork, 9 inch, in cement mortar 1:6', unit: 'sq ft' },
  { id: 'plaster', description: 'Plaster, 12 mm, cement mortar 1:4', unit: 'sq ft' },
  { id: 'slab', description: 'RCC slab including shuttering and curing', unit: 'sq ft' },
]

function WorkOrderPage() {
  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="Work order"
      tool="work-order"
      docKind="work order"
      partyLabels={{ from: 'Issued by (owner)', to: 'Contractor and order' }}
      nameLabels={{ from: 'Owner or firm name', to: 'Contractor name' }}
      addressLabel="Site address"
      lineItemsLabel="Item rates"
      defaultLines={LINES}
      extraFields={[
        { id: 'scope', label: 'Scope of work', multiline: true, defaultValue: 'Civil work as per the approved drawings and the specification attached, including all labour, tools and curing.' },
        { id: 'dates', label: 'Start and completion', defaultValue: 'Start date: .......... Completion date: ..........' },
        { id: 'payments', label: 'Payment stages', multiline: true, defaultValue: '1. On casting of the slab: 30%\n2. On completion of brickwork: 40%\n3. On completion of plaster and curing: 30%' },
        { id: 'material', label: 'Material supply', multiline: true, defaultValue: 'Cement, steel and sand supplied by the owner. Water and electricity at site by the owner.' },
      ]}
      defaultTerms={{
        advance: '10',
        validity: '7',
        exclusions:
          'Quantities will be measured jointly on completion. The contractor is responsible for site safety and will rectify defects reported within 6 months. Disputes will be settled by mutual discussion, failing which by arbitration.',
      }}
    />
  )
}
