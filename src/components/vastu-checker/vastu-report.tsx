import { Button } from "#/components/ui/button"
import { Separator } from "#/components/ui/separator"
import type { VastuReport as VastuReportType } from "#/vastu/index"
import { Download, Wrench } from "lucide-react"
import { RemedyCard } from "./remedy-card"
import { ScoreDisplay } from "./score-display"
import { ViolationCard } from "./violation-card"

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, SOFT: 2 } as const

interface VastuReportProps {
  report: VastuReportType
  onEdit?: () => void
}

export function VastuReport({ report, onEdit }: VastuReportProps) {
  const sortedViolations = [...report.violations].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  )

  const topRemedies = report.summary.topRemedies.slice(0, 4)

  return (
    <div className="vastu-report space-y-6">
      {/* Score Overview */}
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <ScoreDisplay score={report.score} summary={report.summary} />
      </section>

      {/* Violations + Remedies side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Violations */}
        <section>
          <h2 className="mb-3 text-base font-semibold flex items-center gap-2">
            Violations
            <span className="text-sm font-normal text-muted-foreground">
              ({report.violations.length})
            </span>
          </h2>
          {sortedViolations.length > 0 ? (
            <div className="space-y-3">
              {sortedViolations.map((violation, i) => (
                <ViolationCard
                  key={`${violation.ruleId}-${violation.roomId}`}
                  violation={violation}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No violations found. Your layout follows Vastu principles well.
            </p>
          )}
        </section>

        {/* Top Remedies */}
        <section>
          <h2 className="mb-3 text-base font-semibold">Top Remedies</h2>
          {topRemedies.length > 0 ? (
            <div className="space-y-3">
              {topRemedies.map((remedy, i) => (
                <RemedyCard
                  key={remedy.violationId}
                  remedy={remedy}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No remedies needed.
            </p>
          )}
        </section>

      </div>

      <Separator />

      {/* Actions */}
      <div className="no-print flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => window.print()}>
          <Download />
          Download PDF Report
        </Button>
        {onEdit && (
          <Button variant="secondary" onClick={onEdit}>
            <Wrench />
            Edit &amp; Re-analyze
          </Button>
        )}
      </div>
    </div>
  )
}
