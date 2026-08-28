/*
  StreamingText — tokens arrive over time; the newest words carry the brand
  accent and settle into ink as they age.

  Assistant "Element" (Tier 3). The accent (--brand) is used for EMPHASIS only —
  it marks the leading edge of the stream, never signals state, and every word
  ends up as foreground text, so meaning never rests on colour (rule brand-accent
  + no-color-alone). Under prefers-reduced-motion the full text is shown at once.
*/
import * as React from "react"

import { cn } from "@/lib/utils"

export interface StreamingTextProps extends React.ComponentProps<"p"> {
  /** The full text to stream in. */
  text?: string
  /** Milliseconds between tokens. */
  interval?: number
  /** How many trailing words hold the accent before settling. */
  accentWords?: number
}

const DEFAULT_TEXT =
  "Tokens arrive one at a time. The newest words land in the brand accent and settle into ink as the answer catches up to the cursor."

export function StreamingText({
  text = DEFAULT_TEXT,
  interval = 90,
  accentWords = 3,
  className,
  ...props
}: StreamingTextProps) {
  const words = React.useMemo(() => text.split(" "), [text])
  const [shown, setShown] = React.useState(words.length)
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  const replay = React.useCallback(() => setShown(0), [])

  React.useEffect(() => {
    if (reduce || shown >= words.length) return
    const id = setInterval(() => setShown((n) => Math.min(n + 1, words.length)), interval)
    return () => clearInterval(id)
  }, [shown, words.length, interval, reduce])

  // Stream once on first mount.
  React.useEffect(() => {
    if (!reduce) setShown(0)
  }, [reduce])

  const streaming = shown < words.length

  return (
    <p
      aria-live="polite"
      aria-busy={streaming}
      className={cn("text-sm leading-relaxed text-foreground", className)}
      {...props}
    >
      {words.slice(0, shown).map((word, i) => {
        const fromEnd = shown - i
        const accent = streaming && fromEnd <= accentWords
        return (
          <span
            key={i}
            className={cn(
              "transition-colors duration-500",
              accent ? "text-brand" : "text-foreground"
            )}
          >
            {word}
            {i < shown - 1 ? " " : ""}
          </span>
        )
      })}
      {streaming && (
        <span aria-hidden className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-brand animate-pulse motion-reduce:animate-none" />
      )}
      {!streaming && (
        <button
          type="button"
          onClick={replay}
          className="ml-2 align-baseline text-xs text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Replay
        </button>
      )}
    </p>
  )
}
