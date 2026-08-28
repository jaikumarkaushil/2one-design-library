/*
  GuardrailNotice — a refusal in its own shape, with the nearest thing the agent
  can do instead.

  Assistant "Element" (Tier 3). Composed from the DLS Alert + Button. A refusal
  is not an error, so it stays grayscale and is carried by an icon + text, never
  colour alone (rule no-color-alone). The single primary Button offers the
  nearest safe alternative — a dead end always leaves a door (rule one-primary).
*/
import * as React from "react"
import { ShieldAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface GuardrailNoticeProps extends React.ComponentProps<"div"> {
  title?: string
  message?: string
  /** The nearest thing the agent CAN do. Omit to hide the action. */
  alternativeLabel?: string
  onAlternative?: () => void
}

export function GuardrailNotice({
  title = "I can't help with that",
  message = "That request falls outside what I can safely do. Here's the closest thing I can help with instead.",
  alternativeLabel = "Explain the safe alternative",
  onAlternative,
  className,
  ...props
}: GuardrailNoticeProps) {
  return (
    <Alert className={cn("max-w-md", className)} {...props}>
      <ShieldAlert className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>{message}</span>
        {alternativeLabel && (
          <Button size="sm" onClick={onAlternative}>
            {alternativeLabel}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
