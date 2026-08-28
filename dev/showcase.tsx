import { useEffect, useState } from 'react'
import {
  Star, Bold, Italic, Underline, Search, Bell, Home, User, Rocket, CreditCard,
  LogOut, CircleAlert, Copy, Check, Sun, Moon,
  Network, Accessibility, Sparkles, Globe, ArrowRight, Mail, ExternalLink, BookOpen,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import graphData from '../graph.json'
import manifest from '../manifest.json'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Toolbar, ToolbarSpacer } from '@/components/ui/toolbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Toaster } from '@/components/ui/sonner'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'

import { Logo } from '@/components/logo'
import { AppBar } from '@/components/app-bar'
import { BottomNavItem } from '@/components/bottom-nav-item'

// blocks (templates)
import { LoginForm as Login01 } from '@/blocks/login-01'
import { LoginForm as Login03 } from '@/blocks/login-03'
import { SignupForm as Signup01 } from '@/blocks/signup-01'
import { DashboardPlain } from '@/blocks/dashboard-plain/page'
import { ChartAreaInteractive as ChartArea } from '@/blocks/charts/chart-area-interactive'
import { ChartBarMultiple } from '@/blocks/charts/chart-bar-multiple'
import { ChartLineMultiple } from '@/blocks/charts/chart-line-multiple'
import { ChartPieDonutText } from '@/blocks/charts/chart-pie-donut-text'
import { ChartRadarDefault } from '@/blocks/charts/chart-radar-default'
import { ChartRadialStacked } from '@/blocks/charts/chart-radial-stacked'
import { MarketingHero } from '@/blocks/marketing/hero'
import { MarketingLogoCloud } from '@/blocks/marketing/logo-cloud'
import { MarketingFeatureGrid } from '@/blocks/marketing/feature-grid'
import { MarketingStats } from '@/blocks/marketing/stats'
import { MarketingTestimonial } from '@/blocks/marketing/testimonial'
import { MarketingPricing } from '@/blocks/marketing/pricing'
import { MarketingFaq } from '@/blocks/marketing/faq'
import { MarketingClientFaq } from '@/blocks/marketing/client-faq'
import { MarketingCtaBanner } from '@/blocks/marketing/cta-banner'
import { MarketingFooter } from '@/blocks/marketing/footer'
import { MarketingPage } from '@/blocks/marketing/page'

/* ---------- foundation data (from tokens/*.css) ---------- */
// Foundation swatches derive colour + label from the live @theme tokens
// (--color-<ramp>-<step> in tokens/colors.css), so this section can never
// drift from the real theme — change a token and the swatch follows.
const NEUTRAL = ['50', '100', '200', '300', '400', '600', '700', '800', '950']
const ACCENT = ['50', '100', '200', '300', '600', '700', '800', '950']
const SEM = ['danger-500', 'danger-600', 'success-600']
const TYPE: [string, string, string][] = [['display', 'text-display', '76 / 103'], ['h1', 'text-h1', '62 / 84'], ['h2', 'text-h2', '48 / 65'], ['h3', 'text-h3', '40 / 54'], ['h4', 'text-h4', '32 / 43'], ['h5', 'text-h5', '26 / 35'], ['h6', 'text-h6', '20 / 27'], ['base', 'text-base', '16 · body'], ['sm', 'text-sm', '14 · UI'], ['xs', 'text-xs', '12 · small']]
const RADII = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']

// FAQ — the questions teams ask when they first evaluate the system, answered in
// the 2one voice (factual, no hype, honest about the gaps). Rendered as its own
// guide section via the Accordion primitive.
const FAQS: { q: string; a: string }[] = [
  { q: "Whose brand do we build with — ours or 2one's?", a: "This repository is 2one's own system: our brand, built on shadcn/ui, so our team ships product and marketing that already look like 2one. We share it so you can try the approach on something real. If it fits, we build the same foundations for your brand, wire them into your front-end library, and wrap an application around them for your team." },
  { q: "What can our team actually produce with it?", a: "Websites, marketing pages and product screens — generated with AI against the system's rules, so the output stays on-brand and carries fewer bugs. The same foundations live in Figma for designers and developers to share. It won't hand you a finished application: it gives you a strong, consistent first version, and your team makes it their own." },
  { q: "Who is it for?", a: "The people deciding are product and engineering leaders — VPs, product managers, CXOs — who want their teams using AI productively, without the slop. The people using it day to day are developers, marketing teams and product managers who build against it." },
  { q: "Is it tied to shadcn, and how is it licensed?", a: "No. shadcn is simply what 2one runs on; if your team is on MudBlazor, or anything else, we build the same system there. Licensing is yours to choose — open (MIT) by default, so anyone can clone and use it, or proprietary if you would rather keep it in-house." },
  { q: "How do we get access?", a: "Clone the repository and install the packages locally. Access is being opened up so there is nothing to set up — the people we share it with can pull it and start building. Today it is the foundation our team builds on; on the roadmap, a shared design system your whole organisation can draw from." },
]

// Component index derived from the knowledge graph (single source of truth — no
// hand-maintained list to drift). Each chip deep-links into /graph.html.
const GRAPH_COMPONENTS = (graphData.nodes as { id: string; type: string; label: string }[])
  .filter((n) => n.type === 'component' || n.type === 'component-2one')
  .map((n) => ({ id: n.id, label: n.label }))
  .sort((a, b) => a.label.localeCompare(b.label))

// Counts + template lists derived from the generated manifest/graph — never
// hand-typed, so a badge, heading or list can't drift from the real repo.
// Regenerated by `npm run build:meta`; `npm run check:meta` guards them.
const IX = manifest.index
const COUNT = {
  components: IX.components.count,
  shadcn: IX.components.primitives.length,
  twoOne: IX.components.own.length,
  blocks: IX.templates.blocks.items.length,
  marketing: IX.templates.marketing.items.length,
  charts: IX.templates.charts.count,
  graphNodes: graphData.nodes.length,
}
const BLOCK_ITEMS = IX.templates.blocks.items as string[]
const CHART_ITEMS = IX.templates.charts.items as string[]

const NAV = [
  { grp: 'Dashboard', items: [['overview', 'Overview', ''], ['use', 'How to use', '']] },
  { grp: 'Explore', items: [['/components.html', 'Components & assets', String(COUNT.components)], ['/assistant.html', 'Elements', String((manifest.index.templates as any).assistant?.count ?? 0)], ['/dls.html', 'What is a DLS?', ''], ['/graph.html', 'Knowledge graph', String(COUNT.graphNodes)]] },
  { grp: 'Help', items: [['faq', 'FAQ', ''], ['support', 'Support', '']] },
]


function CodeBlock({ code }: { code: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className="relative min-w-0">
      <pre className="overflow-hidden whitespace-pre-wrap break-words rounded-md bg-muted p-3 pr-11 font-mono text-sm text-muted-foreground">{code}</pre>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={done ? 'Copied' : 'Copy to clipboard'}
        className="absolute right-1.5 top-1.5"
        onClick={() => { navigator.clipboard?.writeText(code); setDone(true); setTimeout(() => setDone(false), 1200) }}
      >
        {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  )
}

// Copy-only control — a pill button that copies `text` on click (no code block,
// no scroll). Shows a "Copied" state briefly.
function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 font-normal"
      aria-label={done ? 'Copied to clipboard' : label}
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400) }}
    >
      {done ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
      <span className="truncate">{done ? 'Copied' : label}</span>
    </Button>
  )
}

function Block({ title, meta, className = '', children }: { title: string; meta?: string; className?: string; children: React.ReactNode }) {
  const col = className.includes('col')
  return (
    <Card className="min-w-0 gap-4">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {meta && <CardDescription>{meta}</CardDescription>}
      </CardHeader>
      <CardContent className={`flex min-w-0 flex-wrap gap-4 [&>*]:min-w-0 [&>*]:max-w-full ${col ? 'flex-col items-start' : 'items-center'}`}>
        {children}
      </CardContent>
    </Card>
  )
}
const Cap = ({ children }: { children: React.ReactNode }) => <span className="text-xs text-muted-foreground">{children}</span>

// Light/dark toggle — verifies the whole system in both themes (dogfoods ThemeProvider).
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

export function Showcase() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll('.g-section[id]'))
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-45% 0px -50% 0px' })
    secs.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        {/* App shell — the library's own Sidebar, not bespoke chrome */}
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
                      <SidebarMenuButton asChild isActive={active === id}>
                        <a href={id.startsWith('/') ? id : `#${id}`}>{label}</a>
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
                <BreadcrumbItem><BreadcrumbPage>Dashboard</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <ThemeToggle className="ml-auto" />
          </header>
          <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">

            {/* OVERVIEW */}
            <section id="overview" className="g-section g-hero">
              <div className="g-eyebrow">Design language system · delivered as a product</div>
              <h1>Ship on-brand product &amp; marketing, <span className="thin">without the guesswork.</span></h1>
              <p>2one is a design language system for <b className="text-foreground">product development and product marketing</b> — the components, tokens, brand, and the rules that bind them. A <b className="text-foreground">knowledge graph</b> makes the system opinionated and deterministic, so people <em>and</em> AI build interfaces that already feel like 2one.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="lg"><a href="/graph.html">Explore the knowledge graph <ArrowRight /></a></Button>
                <Button asChild size="lg" variant="outline"><a href="/dls.html">Read the guide</a></Button>
              </div>

              {/* DLS teaser — content + a way into the dedicated DLS page (which now hosts the theming playground) */}
              <Card className="mt-8">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden><BookOpen /></div>
                  <CardTitle className="pt-2 text-base">New here? Start with the DLS</CardTitle>
                  <CardDescription>A Design Language System is the shared kit — brand, tokens, components, and the rules that bind them. The guide explains the three tiers it’s built from and includes the live theming playground: set one brand colour and watch the whole system recolour, contrast-checked as you go.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline"><a href="/dls.html">Open the DLS guide <ArrowRight /></a></Button>
                </CardContent>
              </Card>

              {/* Differentiators — the key selling points, each with checkable evidence (honest, no hype) */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {([
                  [<Network />, 'Opinionated & deterministic', 'A knowledge graph of every token, component and rule — ask what a change touches before you ship it.', 'npm run what-uses'],
                  [<Accessibility />, 'Accessible by default', 'Radix primitives + an APCA contrast audit that runs on every change, in light and dark.', 'npm run a11y'],
                  [<Sparkles />, 'AI-legible', 'Machine-readable UX rules with severity + precedence, so AI composes the 2one language — it doesn’t invent one.', 'rules/ux-rules.json'],
                  [<Globe />, 'Universal & one system', 'One grayscale token system, two audited themes, semantic HTML — the same product feel on every surface.', 'tokens/*.json'],
                ] as [React.ReactNode, string, string, string][]).map(([icon, title, desc, ev]) => (
                  <Card key={title} className="flex flex-col">
                    <CardHeader>
                      <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden>{icon}</div>
                      <CardTitle className="pt-2 text-base">{title}</CardTitle>
                      <CardDescription>{desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Badge variant="outline" className="font-mono font-normal">{ev}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {([[String(COUNT.components), 'Components'], [String(COUNT.shadcn), 'shadcn primitives'], [String(COUNT.twoOne), '2one-authored'], ['1', 'Hue-free system']] as [string, string][]).map(([k, l]) => (
                  <Card key={l}>
                    <CardHeader>
                      <CardDescription>{l}</CardDescription>
                      <CardTitle className="text-3xl font-semibold tabular-nums">{k}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Card className="min-w-0">
                  <CardHeader>
                    <CardTitle className="text-base">Run it locally</CardTitle>
                    <CardDescription>Works today — no registry, no auth.</CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0">
                    <CopyButton text={'npm install\nnpm run dev'} label="Copy install commands" />
                  </CardContent>
                </Card>
                <Card className="min-w-0">
                  <CardHeader>
                    <CardTitle className="text-base">Use in your app</CardTitle>
                    <CardDescription>React 19 · Tailwind v4.</CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0">
                    <CopyButton text={"import { Button } from '@yokesh-2one/design-library'\nimport '@yokesh-2one/design-library/styles'"} label="Copy import" />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* HOW TO USE THE APPLICATION — connect to the library + build with AI (from the 2one library, token-driven) */}
            <section id="use" className="g-section">
              <div className="g-eyebrow">Start here</div><h2>How to use the application</h2>
              <p className="g-lede">A step-by-step way to connect an AI assistant to the 2one library and build with it. Point your assistant — Claude Code, Cursor, Copilot, Gemini — at the repo, have it read the system, then build from the real components, tokens and rules. No manual coding required.</p>

              <div className="mt-2 grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Badge variant="outline">1</Badge> Connect to the library</CardTitle>
                    <CardDescription>Give your AI the repo. It reads <span className="font-mono">manifest.json</span> first, then builds only from the system.</CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0"><CopyButton text="https://github.com/yokesh-2one/2one-design-library" label="Copy GitHub link" /></CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Badge variant="outline">2</Badge> Ask for a summary first</CardTitle>
                    <CardDescription>Have it report which components, tokens, brand foundations and templates exist — before it builds anything.</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Badge variant="outline">3</Badge> Build with the prompt</CardTitle>
                    <CardDescription>Fill the [brackets] in the prompt below and paste it. The assistant composes real 2one UI; you refine.</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="mt-4 min-w-0">
                <CardHeader>
                  <CardTitle className="text-base">The build prompt</CardTitle>
                  <CardDescription>Copy it, fill in the [brackets], and paste it into your AI assistant.</CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                  <CodeBlock code={`Prompt for Building with the 2one Design Library

I want to build [Product], used by [target users] to [why users want to use it].

Workflow / Core Features:
1. [Feature / workflow step 1]
2. [Feature / workflow step 2]
3. [Feature / workflow step 3]

Design System Source
Use the 2one Design Library, hosted at:
https://github.com/yokesh-2one/2one-design-library

Before building anything, read the repo and give me a brief summary of:
- What components, tokens, and brand foundations are available
- Any templates relevant to this specific build

Component Rules
- Use ShadCN components and templates as the primary UI library.
- If no ShadCN equivalent exists for something this build needs, flag it explicitly instead of improvising a new style or component from scratch.
- All colors, typography, iconography, and other visual elements must come from the 2one Design Library — do not introduce styles, colors, or components outside of it.

Accuracy Rule
Only answer questions and make design decisions based on what's actually in the repo. Do not hallucinate or assume components, tokens, or brand rules that aren't present — if something is unclear or missing, say so rather than guessing.

Accessibility
All components and layouts must meet the accessibility standards defined in the 2one Design Library (WCAG AA baseline, APCA contrast thresholds where specified). Never use color alone to convey state or information — pair it with an icon or other visual cue.

Brand Consistency
The final product must be consistent with the 2one brand foundation (voice, tone, personality, and visual identity) as defined in the repo.`} />
                </CardContent>
              </Card>
            </section>

            {/* FAQ */}
            <section id="faq" className="g-section">
              <div className="g-eyebrow">Help</div><h2>FAQ</h2>
              <p className="g-lede">The questions teams ask us when they first see the system — what it is, what you can build with it, how it’s licensed, and how an engagement works.</p>
              <Accordion type="single" collapsible className="mt-6 w-full max-w-3xl">
                {FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                    <AccordionContent className="max-w-[68ch] text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* SUPPORT */}
            <section id="support" className="g-section">
              <div className="g-eyebrow">Help</div><h2>Support</h2>
              <p className="g-lede">Questions about the system, or want it built for your brand? We answer directly — with full transparency about what it does and doesn’t do today.</p>
              <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden><Mail /></div>
                    <CardTitle className="pt-2 text-base">Questions</CardTitle>
                    <CardDescription>Email us and we’ll get back to you.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild><a href="mailto:yokesh@2one.solutions">yokesh@2one.solutions <ArrowRight /></a></Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden><ExternalLink /></div>
                    <CardTitle className="pt-2 text-base">Follow us</CardTitle>
                    <CardDescription>Updates and what we’re shipping.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline"><a href="https://www.linkedin.com/company/2onesolutions" target="_blank" rel="noreferrer">2one Solutions on LinkedIn <ArrowRight /></a></Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">@yokesh-2one/design-library · shadcn/ui re-skinned to the 2one tokens · light + audited dark · rendered live from the real components.</footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  )
}

function OtpDemo() {
  const [v, setV] = useState('482')
  return (
    <InputOTP maxLength={6} value={v} onChange={setV}>
      <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
    </InputOTP>
  )
}

function Swatches({ items, prefix }: { items: string[]; prefix: string }) {
  const [hex, setHex] = useState<Record<string, string>>({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const next: Record<string, string> = {}
    items.forEach((k) => { next[k] = cs.getPropertyValue(`--color-${prefix}${k}`).trim() })
    setHex(next)
  }, [items, prefix])
  return (
    <div className="g-swatches">
      {items.map((k) => (
        <div className="g-sw" key={k}>
          <div className="chip" style={{ background: `var(--color-${prefix}${k})` }} />
          <div className="m"><div>{prefix}{k}</div><div className="hx">{hex[k]}</div></div>
        </div>
      ))}
    </div>
  )
}
