/*
  ReasoningPanel — a collapsible trace that streams reasoning steps along a
  timeline, then settles into a summary.

  Assistant "Element" (Tier 3). Composed from the DLS Collapsible + Button (ghost
  trigger) + Separator; the disclosure keeps the trace available without letting
  it dominate the answer. Steps stream in under motion-safe and appear at once
  under prefers-reduced-motion.
*/
import * as React from "react"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface ReasoningStep {
  title: string
  detail: string
}

export interface ReasoningPanelProps extends React.ComponentProps<"div"> {
  steps?: ReasoningStep[]
  summary?: string
  /** Milliseconds between steps appearing. */
  interval?: number
}

const DEFAULT_STEPS: ReasoningStep[] = [
  { title: "Reading the request", detail: "Drafts should be restored per thread, so composer state has to move out of the component." },
  { title: "Locating the seam", detail: "Draft state already flows through the runtime; persisting it per thread id avoids a parallel store." },
  { title: "Settling on an approach", detail: "Keep a map keyed by thread id, hydrate on switch, clear the entry once a message is sent." },
]

export function ReasoningPanel({
  steps = DEFAULT_STEPS,
  summary = "Persist composer drafts per thread through the existing runtime state, keyed by thread id.",
  interval = 700,
  className,
  ...props
}: ReasoningPanelProps) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  const [shown, setShown] = React.useState(reduce ? steps.length : 0)
  const [open, setOpen] = React.useState(true)
  const done = shown >= steps.length

  React.useEffect(() => {
    if (reduce || done) return
    const id = setInterval(() => setShown((n) => Math.min(n + 1, steps.length)), interval)
    return () => clearInterval(id)
  }, [done, steps.length, interval, reduce])

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("w-full", className)} {...props}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 text-muted-foreground">
          <ChevronRight
            className={cn(
              "size-4 transition-transform motion-reduce:transition-none",
              open && "rotate-90"
            )}
          />
          {done ? "Reasoning" : "Reasoning…"}
          <span className="text-xs tabular-nums">
            {done ? `${steps.length} steps` : `${shown}/${steps.length}`}
          </span>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2">
        <ol className="ml-3 border-l border-border pl-4">
          {steps.slice(0, shown).map((step, i) => (
            <li key={i} className="relative pb-4 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[21px] top-1 size-2 rounded-full bg-muted-foreground ring-4 ring-background"
              />
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>

        {done && (
          <>
            <Separator className="my-3" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Summary. </span>
              {summary}
            </p>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
