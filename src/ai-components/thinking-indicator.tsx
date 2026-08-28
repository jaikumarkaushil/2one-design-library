/*
  ThinkingIndicator — a live status line that names what the agent is doing
  right now, with elapsed time.

  Assistant "Element" (Tier 3): a composed piece for a single assistant-interface
  state. Built only from 2one primitives (Spinner) + tokens; the concept is
  inspired by assistant-ui's Elements catalogue, not copied from it.

  The label is the honest signal — presence alone ("Thinking…") tells the user
  nothing. Name the current step so a slow turn reads as work, not a hang.
*/
import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface ThinkingIndicatorProps extends React.ComponentProps<"div"> {
  /** What the agent is doing right now, e.g. "Reading the request". */
  label?: string
  /** Whether the run is in flight — stops the clock when false. */
  running?: boolean
}

export function ThinkingIndicator({
  label = "Thinking",
  running = true,
  className,
  ...props
}: ThinkingIndicatorProps) {
  const [seconds, setSeconds] = React.useState(0)

  React.useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {running ? (
        <Spinner className="size-4 text-brand" />
      ) : (
        <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground" />
      )}
      <span className="text-foreground">{label}</span>
      <span aria-hidden className="text-muted-foreground">·</span>
      <span className="tabular-nums">
        {running ? `${seconds}s` : `Thought for ${seconds}s`}
      </span>
    </div>
  )
}
