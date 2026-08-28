/*
  TypingIndicator — the classic three dots, tuned to read as presence rather
  than noise.

  Assistant "Element" (Tier 3). Atomic: composed from tokens + the spacing scale,
  no shadcn primitive exists for it. Grayscale on purpose — a coloured indicator
  would read as state, and "the model is composing" is not a state worth a hue.

  Motion is decorative, so it collapses to a static row under prefers-reduced-motion.
*/
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TypingIndicatorProps extends React.ComponentProps<"div"> {
  /** Accessible description of what the dots mean. */
  label?: string
}

export function TypingIndicator({
  label = "Assistant is typing",
  className,
  ...props
}: TypingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className="size-1.5 rounded-full bg-muted-foreground animate-pulse motion-reduce:animate-none"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
