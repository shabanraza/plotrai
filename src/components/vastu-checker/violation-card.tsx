import { Badge } from "#/components/ui/badge"
import type { Violation } from "#/vastu/index"
import { AlertTriangle } from "lucide-react"

const SEVERITY_CONFIG = {
  CRITICAL: {
    color: "var(--status-critical)",
    variant: "destructive" as const,
    label: "Critical",
  },
  HIGH: {
    color: "var(--status-warning)",
    variant: "outline" as const,
    label: "High",
  },
  SOFT: {
    color: "var(--accent-teal)",
    variant: "secondary" as const,
    label: "Soft",
  },
} as const

interface ViolationCardProps {
  violation: Violation
  index: number
}

export function ViolationCard({ violation, index }: ViolationCardProps) {
  const config = SEVERITY_CONFIG[violation.severity]

  return (
    <article
      className="violation-card animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-3 border-t border-[var(--border)] py-5 first:border-t-0 first:pt-0"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center gap-2">
        <Badge
          variant={config.variant}
          className={
            violation.severity === "HIGH"
              ? "gap-1 border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400"
              : "gap-1"
          }
        >
          <AlertTriangle className="size-3" />
          {config.label}
        </Badge>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {violation.ruleId}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--foreground)]">
        {violation.message}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted-foreground)]">
        <span>
          Zone: <strong className="font-medium text-[var(--foreground)]">{violation.zone}</strong>
        </span>
        <span>
          Ideal:{" "}
          <strong className="font-medium text-[var(--foreground)]">
            {violation.idealZones.join(", ")}
          </strong>
        </span>
        <span className="ml-auto font-medium" style={{ color: config.color }}>
          −{violation.pointsDeducted} pts
        </span>
      </div>
    </article>
  )
}
