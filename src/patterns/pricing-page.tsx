import * as React from "react"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MarketingFaq } from "@/blocks/marketing/faq"
import { MarketingCtaBanner } from "@/blocks/marketing/cta-banner"

/*
  Pricing page — a PAGE PATTERN (Tier 3): a complete, opinionated composition, not
  a single section. It answers "how do I build a 2one pricing page?", so an AI (or
  a person) adapts the CONTENT rather than re-deciding the STRUCTURE.

  Composition (top → bottom):
    1. Plans        — tier Cards + a billing-period toggle; the recommended plan is
                      marked with a Badge + border-foreground (never colour alone).
    2. Comparison   — a feature-by-feature Table; ✓ / — are icon + sr-only text.
    3. FAQ          — reuses <MarketingFaq/> (modular: same block the marketing page uses).
    4. CTA          — reuses <MarketingCtaBanner/>.

  Standards this pattern encodes: grayscale tokens only · pill Buttons · lucide only
  · ONE primary action per section · state shown with icon+text, never colour alone
  · responsive (cards stack, comparison table scrolls) · real commercial copy.

  Machine-readable spec: rules/patterns/pricing-page.json (purpose / when-not /
  primary action / anti-patterns) and the graph node pattern:pricing-page.
*/

type Period = "monthly" | "annual"

const PLANS = [
  {
    name: "Starter", recommended: false,
    price: { monthly: "$0", annual: "$0" }, cadence: "forever",
    desc: "For trying 2one on a real project.",
    features: ["Full component set", "Light + audited dark", "Community support"],
    cta: "Start free", primary: false,
  },
  {
    name: "Team", recommended: true,
    price: { monthly: "$49", annual: "$39" }, cadence: "per editor / month",
    desc: "For product teams shipping together.",
    features: ["Everything in Starter", "Templates & page patterns", "Knowledge-graph impact analysis", "Priority support"],
    cta: "Start free trial", primary: true,
  },
  {
    name: "Enterprise", recommended: false,
    price: { monthly: "Custom", annual: "Custom" }, cadence: "",
    desc: "For organisations adopting 2one at scale.",
    features: ["Everything in Team", "SSO & audit logs", "Dedicated design review", "SLA"],
    cta: "Contact sales", primary: false,
  },
]

const COMPARISON: { label: string; values: (boolean | string)[] }[] = [
  { label: "Components & tokens", values: [true, true, true] },
  { label: "Light + audited dark", values: [true, true, true] },
  { label: "Page patterns & templates", values: [false, true, true] },
  { label: "Knowledge-graph impact analysis", values: [false, true, true] },
  { label: "SSO & audit logs", values: [false, false, true] },
  { label: "Support", values: ["Community", "Priority", "Dedicated + SLA"] },
]

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string") return <span className="text-sm">{v}</span>
  return v
    ? <><Check className="mx-auto size-4 text-foreground" aria-hidden /><span className="sr-only">Included</span></>
    : <><Minus className="mx-auto size-4 text-muted-foreground" aria-hidden /><span className="sr-only">Not included</span></>
}

export function PricingPage({ className, ...props }: React.ComponentProps<"main">) {
  const [period, setPeriod] = React.useState<Period>("monthly")

  return (
    <main className={cn("w-full bg-background", className)} {...props}>
      {/* 1 — PLANS */}
      <section aria-labelledby="pricing-heading" className="w-full border-b">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 id="pricing-heading" className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Simple, honest pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">Start free. Upgrade when your team does. No card required to try it.</p>
          </div>

          <div className="mt-8 flex justify-center">
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual <Badge variant="secondary" className="ml-2">−20%</Badge></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <Card key={p.name} className={cn("flex flex-col", p.recommended && "border-foreground shadow-md")}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{p.name}</CardTitle>
                    {p.recommended && <Badge>Recommended</Badge>}
                  </div>
                  <CardDescription>{p.desc}</CardDescription>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-bold tracking-tight tabular-nums">{p.price[period]}</span>
                    {p.cadence && <span className="text-sm text-muted-foreground">/ {p.cadence}</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="flex flex-col gap-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={p.primary ? "default" : "outline"}>{p.cta}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 2 — COMPARISON */}
      <section aria-labelledby="compare-heading" className="w-full border-b">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 id="compare-heading" className="text-center text-3xl font-bold tracking-tight text-balance md:text-4xl">Compare plans</h2>
          <div className="mt-10 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Feature</TableHead>
                  {PLANS.map((p) => <TableHead key={p.name} className="text-center">{p.name}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    {row.values.map((v, i) => <TableCell key={i} className="text-center">{<Cell v={v} />}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* 3 — FAQ (reused block) */}
      <MarketingFaq />

      {/* 4 — CTA (reused block) */}
      <MarketingCtaBanner />
    </main>
  )
}
