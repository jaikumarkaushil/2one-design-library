import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const TIERS = [
  {
    name: "Starter", price: "$0", cadence: "/mo", popular: false,
    desc: "For trying the system.",
    features: ["Full component set", "Light + dark themes", "Community support"],
    cta: "Get started",
  },
  {
    name: "Team", price: "$49", cadence: "/mo", popular: true,
    desc: "For product teams shipping together.",
    features: ["Everything in Starter", "Templates & recipes", "Knowledge graph + impact analysis", "Priority support"],
    cta: "Start free trial",
  },
  {
    name: "Enterprise", price: "Custom", cadence: "", popular: false,
    desc: "For organisations at scale.",
    features: ["Everything in Team", "SSO & audit logs", "Dedicated review", "SLA"],
    cta: "Contact sales",
  },
]

// Pricing — 2–3 tiers as real Cards. The popular tier is marked with a Badge and
// carries the one filled/primary CTA; the others use outline. One CTA per tier.
export function MarketingPricing({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full border-b bg-background", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Simple, honest pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">Start free. Upgrade when your team does.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <Card key={t.name} className={cn("flex flex-col", t.popular && "border-foreground shadow-md")}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{t.name}</CardTitle>
                  {t.popular && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{t.desc}</CardDescription>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-bold tracking-tight tabular-nums">{t.price}</span>
                  <span className="text-sm text-muted-foreground">{t.cadence}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="flex flex-col gap-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={t.popular ? "default" : "outline"}>{t.cta}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
