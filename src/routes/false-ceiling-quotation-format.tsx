import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ToolSection } from '#/components/tools/tool-section'
import { useAreaRooms } from '#/components/tools/trade-quote-builders'
import {
  BuilderSummary,
  TradeQuotePage,
  type TradeLineDef,
} from '#/components/tools/trade-quote-page'
import { FieldLegend, FieldSet } from '#/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { finishingHead } from '#/data/finishing-calc-content'
import { FALSE_CEILING_QUOTATION_CONTENT as CONTENT } from '#/data/quote-content/false-ceiling'
import { TRADE_QUOTE_CHECKED } from '#/data/trade-quote-content'
import { formatQty } from '#/lib/finishing-calc'

export const Route = createFileRoute('/false-ceiling-quotation-format')({
  component: FalseCeilingQuotationPage,
  head: () => finishingHead(CONTENT),
})

const MATERIALS = {
  gypsum: 'Gypsum board false ceiling with GI frame, jointing and finishing (with material)',
  pop: 'POP false ceiling with GI frame and finishing (with material)',
  pvc: 'PVC panel false ceiling with frame (with material)',
} as const
type Material = keyof typeof MATERIALS

const LINES: ReadonlyArray<TradeLineDef> = [
  { id: 'ceiling', description: MATERIALS.gypsum, unit: 'sq ft', auto: 'area', descKey: 'ceiling' },
  { id: 'cove', description: 'Cove or border', unit: 'running ft', auto: 'border' },
  { id: 'cutouts', description: 'Light cut-outs', unit: 'nos' },
  { id: 'paint', description: 'Ceiling paint, primer and 2 coats', unit: 'sq ft', auto: 'area' },
]

function FalseCeilingQuotationPage() {
  const rooms = useAreaRooms('Bedroom')
  const [material, setMaterial] = useState<Material>('gypsum')

  return (
    <TradeQuotePage
      content={CONTENT}
      checked={TRADE_QUOTE_CHECKED}
      docTitle="False ceiling quotation"
      tool="false-ceiling"
      defaultLines={LINES}
      autoDescriptions={{ ceiling: MATERIALS[material] }}
      autoQty={{ area: Math.round(rooms.areaSqFt), border: Math.round(rooms.perimeterFt) }}
      defaultTerms={{
        advance: '50',
        validity: '15',
        exclusions:
          'Light fittings, electrical wiring and scaffolding for double-height areas are not included unless listed above.',
      }}
      builder={
        <ToolSection
          label="Rooms and material"
          description="Room sizes in feet fill in the ceiling area and border length below."
        >
          <div className="flex flex-col gap-8">
            {rooms.node}
            <FieldSet>
              <FieldLegend variant="label">Ceiling material</FieldLegend>
              <ToggleGroup
                type="single"
                value={material}
                onValueChange={(v) => v && setMaterial(v as Material)}
                variant="outline"
                className="justify-start"
              >
                <ToggleGroupItem value="gypsum" className="min-h-10 px-4">Gypsum</ToggleGroupItem>
                <ToggleGroupItem value="pop" className="min-h-10 px-4">POP</ToggleGroupItem>
                <ToggleGroupItem value="pvc" className="min-h-10 px-4">PVC</ToggleGroupItem>
              </ToggleGroup>
            </FieldSet>
            <BuilderSummary>
              Ceiling area <b><span>{formatQty(rooms.areaSqFt, 0)} sq ft</span></b>
              {' · '}border <span>{formatQty(rooms.perimeterFt, 0)} running ft</span>
            </BuilderSummary>
          </div>
        </ToolSection>
      }
    />
  )
}
