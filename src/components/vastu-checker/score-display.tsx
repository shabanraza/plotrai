import { useEffect, useRef, useState } from "react"
import { Badge } from "#/components/ui/badge"
import type { ScoreResult, VastuReport } from "#/vastu/index"
import { AlertTriangle, CheckCircle } from "lucide-react"

const GRADE_CONFIG = {
  excellent: {
    label: "Excellent",
    color: "var(--status-success)",
    track: "var(--status-success)",
  },
  good: {
    label: "Good",
    color: "var(--accent-teal)",
    track: "var(--accent-teal)",
  },
  needs_work: {
    label: "Needs Work",
    color: "var(--status-warning)",
    track: "var(--status-warning)",
  },
  critical: {
    label: "Critical",
    color: "var(--status-critical)",
    track: "var(--status-critical)",
  },
} as const

interface ScoreDisplayProps {
  score: ScoreResult
  summary: VastuReport["summary"]
}

function useCountUp(target: number, durationMs = 1000) {
  const [display, setDisplay] = useState(0)
  const prevTarget = useRef(target)

  useEffect(() => {
    const start = prevTarget.current !== target ? 0 : display
    prevTarget.current = target
    const startTime = performance.now()
    let frameId: number

    function tick(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(start + (target - start) * eased))
      if (t < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs])

  return display
}

export function ScoreDisplay({ score, summary }: ScoreDisplayProps) {
  const config = GRADE_CONFIG[score.grade]
  const radius = 50
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const progress = (score.overall / 100) * circumference
  const offset = circumference - progress
  const displayScore = useCountUp(score.overall)

  return (
    <div className="flex items-center justify-between gap-6">
      {/* LEFT — score number + grade + badges */}
      <div className="flex flex-col gap-3 min-w-0">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Vastu Score
          </p>
          <p className="text-5xl font-bold leading-none" style={{ color: config.color }}>
            {displayScore}
            <span className="text-xl text-muted-foreground font-normal ml-1">/100</span>
          </p>
          <p className="mt-1.5 text-sm font-semibold uppercase tracking-wide" style={{ color: config.color }}>
            {config.label}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {summary.criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1.5 px-2.5 py-1 text-xs">
              <AlertTriangle className="size-3" />
              {summary.criticalCount} Critical
            </Badge>
          )}
          {summary.highCount > 0 && (
            <Badge
              variant="outline"
              className="gap-1.5 border-amber-400 px-2.5 py-1 text-xs text-amber-600 dark:border-amber-500 dark:text-amber-400"
            >
              <AlertTriangle className="size-3" />
              {summary.highCount} High
            </Badge>
          )}
          {summary.softCount > 0 && (
            <Badge
              variant="secondary"
              className="gap-1.5 px-2.5 py-1 text-xs"
              style={{ color: "var(--accent-teal)" }}
            >
              <CheckCircle className="size-3" />
              {summary.softCount} Soft
            </Badge>
          )}
        </div>
      </div>

      {/* RIGHT — animated circle */}
      <div className="shrink-0">
        <div className="relative h-[130px] w-[130px]">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full -rotate-90"
            aria-label={`Vastu score: ${score.overall} out of 100`}
          >
            <circle cx="60" cy="60" r={58} strokeWidth={4} stroke="var(--border)" opacity={0.3} fill="none" />
            {[{ angle: -90 }, { angle: 0 }, { angle: 90 }, { angle: 180 }].map(({ angle }) => {
              const rad = (angle * Math.PI) / 180
              const outerR = 58
              const tickLen = 4
              const x1 = 60 + outerR * Math.cos(rad)
              const y1 = 60 + outerR * Math.sin(rad)
              const x2 = 60 + (outerR - tickLen) * Math.cos(rad)
              const y2 = 60 + (outerR - tickLen) * Math.sin(rad)
              return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1.5} />
            })}
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={config.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${config.color})`, transitionDelay: "200ms" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: config.color }}>
              {displayScore}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
