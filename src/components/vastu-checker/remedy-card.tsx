import { Badge } from "#/components/ui/badge"
import type { Remedy } from "#/vastu/index"
import { ArrowUp, Wrench } from "lucide-react"

interface RemedyCardProps {
  remedy: Remedy
  index: number
}

function CostBadge({ cost, price }: { cost: Remedy["cost"]; price: string }) {
  switch (cost) {
    case "free":
      return (
        <Badge variant="secondary" className="text-xs" style={{ color: "var(--status-success)" }}>
          Free
        </Badge>
      )
    case "low":
      return (
        <Badge variant="outline" className="text-xs" style={{ color: "var(--status-info)" }}>
          Low Cost {price}
        </Badge>
      )
    case "structural":
      return (
        <Badge
          variant="outline"
          className="border-amber-400 text-xs text-amber-600 dark:border-amber-500 dark:text-amber-400"
        >
          Structural {price}
        </Badge>
      )
  }
}

export function RemedyCard({ remedy, index }: RemedyCardProps) {
  return (
    <article
      className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-3 border-t border-[var(--border)] py-5 first:border-t-0 first:pt-0"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-start gap-3">
        <Badge variant="default" className="shrink-0 text-xs font-bold">
          #{index + 1}
        </Badge>
        <p className="text-sm leading-relaxed text-[var(--foreground)]">
          {remedy.description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Wrench className="size-3.5 text-[var(--muted-foreground)]" />
        <CostBadge cost={remedy.cost} price={remedy.estimatedPrice} />
        <span
          className="ml-auto flex items-center gap-1 text-xs font-semibold"
          style={{ color: "var(--status-success)" }}
        >
          <ArrowUp className="size-3" />+{remedy.impact} pts
        </span>
      </div>
    </article>
  )
}
