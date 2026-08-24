import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Marketing hero — headline + subhead + one primary pill CTA (+ optional
// secondary), with a media slot. Full-bleed <section>; content capped at max-w-7xl.
export function MarketingHero({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full border-b bg-background", className)} {...props}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
        <Badge variant="secondary">Design Language System · v0.2</Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
          Ship on-brand product, faster.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground text-pretty">
          One source of truth for every piece 2one builds — components, tokens and brand —
          so people and AI create products that look and feel like 2one.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            Get started <ArrowRight />
          </Button>
          <Button size="lg" variant="outline">
            Read the docs
          </Button>
        </div>
        {/* media slot — drop a product screenshot or video here */}
        <div className="mt-8 flex aspect-video w-full max-w-4xl items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
          Product preview
        </div>
      </div>
    </section>
  )
}
