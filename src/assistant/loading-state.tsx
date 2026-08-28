/*
  LoadingState — a placeholder that keeps time while the model has nothing to
  show yet.

  Assistant "Element" (Tier 3). A grayscale pixel matrix marks "working, nothing
  to render", and the DLS Skeleton stands in for the answer shape that is coming
  (rule loading-state). All motion collapses under prefers-reduced-motion.
*/
import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface LoadingStateProps extends React.ComponentProps<"div"> {
  label?: string
  /** Show skeleton answer-lines beneath the matrix. */
  withSkeleton?: boolean
}

const CELLS = Array.from({ length: 16 })

export function LoadingState({
  label = "Drafting a reply",
  withSkeleton = true,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("w-full max-w-sm space-y-4", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div aria-hidden className="grid grid-cols-4 gap-1">
          {CELLS.map((_, i) => (
            <span
              key={i}
              className="size-1.5 rounded-[2px] bg-muted-foreground animate-pulse motion-reduce:animate-none"
              style={{ animationDelay: `${(i % 4) * 120 + Math.floor(i / 4) * 60}ms` }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      {withSkeleton && (
        <div aria-hidden className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      )}
    </div>
  )
}
