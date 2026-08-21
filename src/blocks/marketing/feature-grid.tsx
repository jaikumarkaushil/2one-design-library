import { Boxes, Gauge, Palette, ShieldCheck, Sparkles, Workflow } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FEATURES = [
  { icon: Boxes, title: "Real components", desc: "54 shadcn/ui primitives re-skinned to the 2one tokens — not screenshots." },
  { icon: Palette, title: "One token system", desc: "Grayscale by design. Change a token in one place and every screen follows." },
  { icon: ShieldCheck, title: "Accessible by default", desc: "Radix primitives and an APCA contrast audit that runs on every change." },
  { icon: Gauge, title: "Light + dark", desc: "Two audited themes ship together — no third palette to maintain." },
  { icon: Sparkles, title: "AI-legible", desc: "A manifest, knowledge graph and rules so any AI builds on-brand, first try." },
  { icon: Workflow, title: "Impact analysis", desc: "Ask what a token change touches before you ship it — change-safety at scale." },
]

// Feature grid — 3–6 feature cards. Each is a real Card with a lucide icon.
export function MarketingFeatureGrid({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full border-b bg-background", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Everything you need to stay on-brand
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            The building blocks and the guardrails, in one place.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                  <Icon className="size-5" aria-hidden />
                </div>
                <CardTitle className="pt-2">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
