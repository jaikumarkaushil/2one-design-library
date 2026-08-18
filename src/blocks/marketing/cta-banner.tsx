import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Closing CTA band — an inverted near-black panel (bg-foreground / text-background).
// The panel flips with the theme; the CTA is an inverted button (bg-background) so
// it contrasts on the panel in BOTH themes. One primary CTA.
export function MarketingCtaBanner({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full bg-foreground text-background", className)} {...props}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-20 text-center md:py-24">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Build products that look like they belong together.
        </h2>
        <p className="max-w-xl text-lg text-background/70 text-pretty">
          Start with the free tier — the full component set, both themes, no card required.
        </p>
        <Button size="lg" className="bg-background text-foreground shadow-sm hover:bg-background/90">
          Get started <ArrowRight />
        </Button>
      </div>
    </section>
  )
}
