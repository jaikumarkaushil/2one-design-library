import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import manifest from '../manifest.json'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Logo } from '@/components/logo'

import { LoadingState } from '@/assistant/loading-state'
import { ThinkingIndicator } from '@/assistant/thinking-indicator'
import { TypingIndicator } from '@/assistant/typing-indicator'
import { StreamingText } from '@/assistant/streaming-text'
import { ReasoningPanel } from '@/assistant/reasoning-panel'
import { ReasoningEffort } from '@/assistant/reasoning-effort'
import { GuardrailNotice } from '@/assistant/guardrail-notice'

// The spec layer is the point: each element carries its grounding + governing
// rules in the manifest, so this page shows the MACHINE-LEGIBLE facts next to
// the live demo rather than asserting them by hand.
const SPECS = new Map(
  (((manifest.index.templates as any).assistant?.spec ?? []) as any[]).map((s: any) => [s.id, s])
)

type Item = { id: string; blurb: string; render: () => React.ReactNode }

// Ordered as a short narrative of a turn: pending → working → composing →
// streaming → the trace → the dial → a refusal.
const ITEMS: Item[] = [
  { id: 'element:loading-state', blurb: 'Holds the frame while the model has nothing to show yet, and hints at the answer shape coming.', render: () => <LoadingState /> },
  { id: 'element:thinking-indicator', blurb: 'Names the step the agent is on, with elapsed time — so a slow turn reads as work, not a hang.', render: () => <ThinkingIndicator label="Reading the request" /> },
  { id: 'element:typing-indicator', blurb: 'Presence, not noise — a lightweight cue that a reply is coming.', render: () => <div className="flex h-10 items-center"><TypingIndicator /></div> },
  { id: 'element:streaming-text', blurb: 'The leading edge carries the brand accent, then settles into ink as the answer catches up.', render: () => <StreamingText /> },
  { id: 'element:reasoning-panel', blurb: 'A collapsible trace that streams its steps along a timeline, then settles into a summary.', render: () => <ReasoningPanel /> },
  { id: 'element:reasoning-effort', blurb: 'How hard to think, and how much of that budget the run actually spent.', render: () => <ReasoningEffort /> },
  { id: 'element:guardrail-notice', blurb: 'A refusal in its own shape — grayscale, never alarming — with the nearest safe alternative.', render: () => <GuardrailNotice /> },
]

const NAV = [
  { grp: '', items: [['/', '← Dashboard'], ['/components.html', 'Components & assets'], ['/dls.html', 'What is a DLS?']] },
  { grp: 'Elements', items: [['#reasoning', 'Reasoning', String(ITEMS.length)]] },
  { grp: 'Explore', items: [['/graph.html', 'Knowledge graph']] },
] as { grp: string; items: (string[])[] }[]

function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun /> : <Moon />}
      {isDark ? 'Light' : 'Dark'}
    </Button>
  )
}

export function AssistantElements() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <Logo variant="black" width={52} className="dark:hidden" />
            <Logo variant="white" width={52} className="hidden dark:block" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {NAV.map((g, i) => (
            <SidebarGroup key={i}>
              {g.grp && <SidebarGroupLabel>{g.grp}</SidebarGroupLabel>}
              <SidebarMenu>
                {g.items.map(([id, label, n]) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton asChild>
                      <a href={id}>{label}</a>
                    </SidebarMenuButton>
                    {n && <SidebarMenuBadge>{n}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 !h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Elements</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ThemeToggle className="ml-auto" />
        </header>

        <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">
          <section className="g-section">
            <div className="g-eyebrow">Tier 3 · Assistant</div>
            <h2>Elements</h2>
            <p className="g-lede">
              Every state an assistant can be in — built from real 2one primitives and tokens, so an
              agent adapts the content, not the structure. Each element carries a machine-readable spec
              and a graph node (<span className="mono">element:&lt;id&gt;</span>), so its grounding and
              governing rules travel with it. This is the <span className="mono">Reasoning</span> category.
            </p>
          </section>

          <section id="reasoning" className="g-section">
            <div className="g-eyebrow">Reasoning · {ITEMS.length} elements</div>
            <div className="grid gap-4 md:grid-cols-2">
              {ITEMS.map((item, i) => {
                const spec: any = SPECS.get(item.id)
                const title = spec?.label ?? item.id
                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-baseline gap-2">
                        <span className="mono text-xs text-muted-foreground tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <CardTitle className="text-base">{title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.blurb}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex min-h-28 items-center rounded-lg border border-dashed border-border bg-muted/30 p-4">
                        {item.render()}
                      </div>
                      {spec?.governed_by?.length ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">Governed by</span>
                          {spec.governed_by.map((r: string) => (
                            <Badge key={r} variant="secondary" className="mono text-[11px]">{r}</Badge>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
