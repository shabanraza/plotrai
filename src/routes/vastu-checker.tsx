import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowRight, Compass, ImageIcon, PenLine, AlertCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#/components/ui/tabs'
import { Spinner } from '#/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { ToolPageShell } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { PlotDetailsForm } from '#/components/vastu-checker/plot-details-form'
import { RoomPlacementList } from '#/components/vastu-checker/room-placement-list'
import { VastuMandala } from '#/components/vastu-checker/vastu-mandala'
import { VastuReport } from '#/components/vastu-checker/vastu-report'
import { ImageUpload } from '#/components/vastu-checker/image-upload'
import type {
  PlotDetails,
  RoomPlacement,
  Direction,
  RoomType,
  Zone,
} from '#/components/vastu-checker/types'
import { analyzeVastu } from '#/vastu/index'
import type { LayoutInput, VastuReport as VastuReportType } from '#/vastu/index'
import type { FloorPlanAnalysis } from '#/server/analyze-floor-plan'
import { track } from '#/lib/track'
import { VASTU_FAQS, VASTU_CONTEXT } from '#/data/tool-seo-content'
import { canonicalLink, softwareAppLd, faqPageLd } from '#/lib/seo'

export const Route = createFileRoute('/vastu-checker')({
  component: VastuCheckerPage,
  head: () => ({
    meta: [
      {
        title: 'Vastu Checker for Home — Free Online Vastu Compliance Tool · Plotr Ai',
      },
      {
        name: 'description',
        content:
          'Free Vastu Shastra checker for Indian homes. Score your floor plan against 14 classical rules — North/East/South/West facing houses, kitchen direction, bedroom placement, main entrance Vastu. No signup, mobile-friendly.',
      },
      { property: 'og:title', content: 'Vastu Checker for Home · Plotr Ai' },
      {
        property: 'og:description',
        content:
          'Score your floor plan against 14 classical Vastu Shastra rules. Free, mobile-first, no signup.',
      },
      { property: 'og:image', content: 'https://plotrai.in/og/vastu-checker.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://plotrai.in/vastu-checker' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/vastu-checker.png' },
    ],
    links: [canonicalLink('/vastu-checker')],
    scripts: [
      softwareAppLd({
        name: 'Vastu Checker for Home',
        description:
          'Free online tool to check Vastu Shastra compliance of any floor plan. Covers main entrance, kitchen, bedroom, toilet placement across 8 directions.',
        path: '/vastu-checker',
      }),
      faqPageLd(VASTU_FAQS),
    ],
  }),
})

const defaultPlotDetails: PlotDetails = {
  length: 40,
  width: 30,
  unit: 'ft',
  facing: 'N',
  shape: 'rectangle',
  floors: 1,
}

const defaultRooms: RoomPlacement[] = [
  { id: crypto.randomUUID(), type: 'master_bedroom', zone: 'SW', isMainEntrance: false },
  { id: crypto.randomUUID(), type: 'kitchen', zone: 'SE', isMainEntrance: false },
  { id: crypto.randomUUID(), type: 'toilet', zone: 'NW', isMainEntrance: false },
  { id: crypto.randomUUID(), type: 'living', zone: 'N', isMainEntrance: false },
  { id: crypto.randomUUID(), type: 'puja', zone: 'NE', isMainEntrance: false },
  { id: crypto.randomUUID(), type: 'entrance', zone: 'E', isMainEntrance: true },
]

const VALID_ROOM_TYPES = new Set<string>([
  'master_bedroom', 'bedroom', 'kids_bedroom', 'guest_bedroom',
  'kitchen', 'dining', 'living', 'drawing', 'puja', 'study',
  'store', 'toilet', 'bathroom', 'parking', 'servant_quarter',
  'balcony', 'staircase', 'entrance',
])

const VALID_ZONES = new Set<string>([
  'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'CENTER',
])

const VALID_DIRECTIONS = new Set<string>([
  'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW',
])

const ELEMENT_LEGEND = [
  { label: 'Water', color: 'bg-sky-500' },
  { label: 'Fire', color: 'bg-orange-500' },
  { label: 'Earth', color: 'bg-yellow-600' },
  { label: 'Air', color: 'bg-green-600' },
  { label: 'Space', color: 'bg-violet-600' },
] as const

type InputMode = 'manual' | 'upload'

function VastuCheckerPage() {
  const [inputMode, setInputMode] = useState<InputMode>('manual')
  const [plotDetails, setPlotDetails] = useState<PlotDetails>(defaultPlotDetails)
  const [rooms, setRooms] = useState<RoomPlacement[]>(defaultRooms)
  const [report, setReport] = useState<VastuReportType | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const validationError = useMemo(() => {
    if (plotDetails.length <= 0 || plotDetails.width <= 0) {
      return 'Plot length and width must be greater than 0.'
    }
    if (rooms.length === 0) {
      return 'Add at least 1 room before analyzing.'
    }
    return null
  }, [plotDetails.length, plotDetails.width, rooms.length])

  function handleSubmit() {
    setIsAnalyzing(true)
    const layout: LayoutInput = {
      plot: {
        length: plotDetails.length,
        width: plotDetails.width,
        unit: plotDetails.unit,
        facing: plotDetails.facing,
        shape: plotDetails.shape,
        floors: plotDetails.floors,
        setbacks: { front: 0, back: 0, left: 0, right: 0 },
      },
      rooms: rooms.map((r) => ({
        id: r.id,
        type: r.type,
        sqft: 0,
        zone: r.zone,
        isMainEntrance: r.isMainEntrance,
      })),
      school: 'classical' as const,
    }
    const result = analyzeVastu(layout)
    setReport(result)
    setIsAnalyzing(false)
    track(
      'vastu_analyzed',
      {
        facing: plotDetails.facing,
        rooms: String(rooms.length),
        grade: result.score.grade,
      },
      result.score.overall,
    )
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }

  function handleEdit() {
    setReport(null)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }

  function handleExtract(analysis: FloorPlanAnalysis) {
    const extractedRooms: RoomPlacement[] = analysis.rooms
      .filter((r) => VALID_ROOM_TYPES.has(r.type) && VALID_ZONES.has(r.zone))
      .map((r) => ({
        id: crypto.randomUUID(),
        type: r.type as RoomType,
        zone: r.zone as Zone,
        isMainEntrance: r.isMainEntrance,
      }))

    if (extractedRooms.length > 0) setRooms(extractedRooms)

    if (analysis.plot) {
      const updates: Partial<PlotDetails> = {}
      if (analysis.plot.length && analysis.plot.length > 0) updates.length = analysis.plot.length
      if (analysis.plot.width && analysis.plot.width > 0) updates.width = analysis.plot.width
      if (analysis.plot.facing && VALID_DIRECTIONS.has(analysis.plot.facing)) {
        updates.facing = analysis.plot.facing as Direction
      }
      if (Object.keys(updates).length > 0) {
        setPlotDetails((prev) => ({ ...prev, ...updates }))
      }
    }
    setInputMode('manual')
  }

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: 'Vastu Checker' }]}
      eyebrow={{ icon: Compass, label: 'Flagship · Live' }}
      title="Vastu Compliance Checker"
      tagline="Score your floor plan against 14 classical Vastu Shastra rules. Manual input or upload a plan — get instant violations and remedies."
      variant="progressive"
      headerActions={
        report ? (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <PenLine />
            Edit & Re-analyze
          </Button>
        ) : null
      }
    >
      {report ? (
        <VastuReport report={report} onEdit={handleEdit} />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="flex flex-col gap-10">
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as InputMode)}>
              <TabsList>
                <TabsTrigger value="manual">
                  <PenLine />
                  Manual input
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <ImageIcon />
                  Upload floor plan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-6 flex flex-col gap-10">
                <ToolSection
                  number="01"
                  label="Plot details"
                  description="Dimensions, facing, and number of floors."
                  rule={false}
                >
                  <PlotDetailsForm value={plotDetails} onChange={setPlotDetails} />
                </ToolSection>

                <ToolSection
                  number="02"
                  label="Room placement"
                  description="Pick rooms and their zones. The zone map updates live."
                >
                  <RoomPlacementList rooms={rooms} onChange={setRooms} />
                </ToolSection>

                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>Can't analyze yet</AlertTitle>
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  size="lg"
                  className="group w-full sm:w-auto"
                  onClick={handleSubmit}
                  disabled={isAnalyzing || !!validationError}
                >
                  {isAnalyzing ? <Spinner /> : null}
                  {isAnalyzing ? 'Analyzing…' : 'Analyze Vastu'}
                  {!isAnalyzing && (
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <ToolSection
                  number="01"
                  label="Upload your floor plan"
                  description="We'll extract rooms automatically and pre-fill the manual form."
                  rule={false}
                >
                  <ImageUpload onExtract={handleExtract} />
                </ToolSection>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="lg:sticky lg:top-6">
            <ToolSection
              label="Zone map"
              description="Live preview of room placement."
              layout="stacked"
              rule={false}
            >
              <div className="flex flex-col gap-3">
                <VastuMandala rooms={rooms} facing={plotDetails.facing} />
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
                  {ELEMENT_LEGEND.map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <span className={`size-2.5 rounded-sm ${color}`} aria-hidden />
                      {label}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)]/80">
                  Coloured zones are occupied · Amber{' '}
                  <strong className="text-amber-600">!</strong> = conflict
                </p>
              </div>
            </ToolSection>
          </aside>
        </div>
      )}

      <div className="mt-12 flex flex-col gap-10">
        <ToolContext title={VASTU_CONTEXT.title}>
          {VASTU_CONTEXT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </ToolContext>
        <ToolFaq items={VASTU_FAQS} />
      </div>
    </ToolPageShell>
  )
}
