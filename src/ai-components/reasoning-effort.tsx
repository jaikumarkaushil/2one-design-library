/*
  ReasoningEffort — how hard to think, and how much of that budget the run
  actually spent.

  Assistant "Element" (Tier 3). Composed from the DLS Progress + Badge. Effort is
  carried by a label AND a filled-segment shape, never by colour alone
  (rule no-color-alone); the budget bar is grayscale and reads the same in both
  themes.
*/
import * as React from "react"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type EffortLevel = "low" | "medium" | "high"

export interface ReasoningEffortProps extends React.ComponentProps<"div"> {
  level?: EffortLevel
  /** Tokens spent on reasoning. */
  spent?: number
  /** Tokens budgeted for reasoning. */
  budget?: number
}

const ORDER: EffortLevel[] = ["low", "medium", "high"]
const FILLED: Record<EffortLevel, number> = { low: 1, medium: 2, high: 3 }

export function ReasoningEffort({
  level = "high",
  spent = 1840,
  budget = 4096,
  className,
  ...props
}: ReasoningEffortProps) {
  const filled = FILLED[level]
  const pct = Math.min(100, Math.round((spent / budget) * 100))

  return (
    <div className={cn("w-full max-w-sm space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Effort</span>
          <div aria-hidden className="flex items-center gap-0.5">
            {ORDER.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-3 w-1 rounded-full",
                  i < filled ? "bg-foreground" : "bg-muted"
                )}
              />
            ))}
          </div>
          <Badge variant="secondary" className="capitalize">
            {level}
          </Badge>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {spent.toLocaleString()} / {budget.toLocaleString()} tokens
        </span>
      </div>
      <Progress value={pct} aria-label={`Reasoning budget used: ${pct}%`} />
    </div>
  )
}
