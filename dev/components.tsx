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
import brand from '../brand/brand.json'

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
  shadcn: IX.components.shadcn_primitives.length,
  twoOne: IX.components.two_one_only.length,
  blocks: IX.templates.blocks.items.length,
  marketing: IX.templates.marketing.items.length,
  charts: IX.templates.charts.count,
  graphNodes: graphData.nodes.length,
}
const BLOCK_ITEMS = IX.templates.blocks.items as string[]
const CHART_ITEMS = IX.templates.charts.items as string[]

const NAV = [
  { grp: '', items: [['/', '← Dashboard', ''], ['/dls.html', 'What is a DLS?', '']] },
  { grp: 'Tier 1 · Brand', items: [['brand', 'Brand', '']] },
  { grp: 'Tier 2 · Foundation', items: [['color', 'Colour', ''], ['type', 'Typography', ''], ['radius', 'Radius', '']] },
  { grp: 'Shadcn components', items: [['actions', 'Actions', ''], ['forms', 'Forms', ''], ['overlays', 'Overlays', ''], ['data', 'Data display', ''], ['feedback', 'Feedback', ''], ['navigation', 'Navigation', '']] },
  { grp: '2one components', items: [['mobile', 'Mobile · 2one', String(COUNT.twoOne)]] },
  { grp: 'Tier 3 · Output', items: [['blocks', 'Blocks', String(COUNT.blocks)], ['marketing', 'Marketing', String(COUNT.marketing)], ['charts', 'Charts', String(COUNT.charts)]] },
  { grp: 'Explore', items: [['/graph.html', 'Knowledge graph', String(COUNT.graphNodes)]] },
]


function CodeBlock({ code }: { code: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className="relative min-w-0">
      <pre className="overflow-x-auto rounded-md bg-muted p-3 pr-11 font-mono text-sm text-muted-foreground">{code}</pre>
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

export function Components() {
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
              <span className="text-xs leading-tight text-muted-foreground">design language<br />system</span>
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
            <span className="text-sm text-muted-foreground">
              <b className="font-semibold text-foreground">2one</b> Design Language System
            </span>
            <ThemeToggle className="ml-auto" />
          </header>
          <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">

            {/* TIER 1 · BRAND */}
            <section id="brand" className="g-section">
              <div className="g-eyebrow">Tier 1 · Brand</div><h2>Brand foundation</h2>
              <p className="g-lede">The strategic core — the “why” and “who” every asset traces back to, pulled from <span className="mono">brand/brand.json</span>. Full context lives on the <a className="underline underline-offset-2" href="/dls.html">DLS guide</a>.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">Mission · vision · tagline</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Mission</div><p className="mt-1 text-foreground">{brand.mission}</p></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Vision</div><p className="mt-1 text-foreground">{brand.vision}</p></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Tagline</div><p className="mt-1 text-foreground">{brand.tagline}</p></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Voice · tone · personality</CardTitle><CardDescription>Match this in any 2one-facing copy.</CardDescription></CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Voice</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.voice.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Tone</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.tone.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Personality</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.personality.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}<Badge variant="outline">Archetype: {brand.archetype.name}</Badge></div></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Who it’s for</CardTitle></CardHeader>
                  <CardContent><ul className="grid gap-2 text-sm">{brand.personas.map((p) => <li key={p.id} className="flex items-start gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden /><span>{p.label}</span></li>)}</ul></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">The logo</CardTitle><CardDescription>Two fills only — black on light, white on dark. Never recolour, rotate, or distort.</CardDescription></CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-3">
                    <div className="rounded-lg border bg-white p-4"><Logo variant="black" width={96} /></div>
                    <div className="rounded-lg bg-neutral-950 p-4"><Logo variant="white" width={96} /></div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* COLOUR */}
            <section id="color" className="g-section">
              <div className="g-eyebrow">Foundations</div><h2>Colour</h2>
              <p className="g-lede">Grayscale by design — no brand hue. <b>danger</b> and <b>success</b> are the only colours, reserved for validation.</p>
              {/* Safelist: Tailwind v4 tree-shakes @theme vars no utility references.
                  The swatches read var(--color-<ramp>-<step>) at runtime, so we force
                  those vars into :root by naming every ramp utility here (literal names
                  only — Tailwind can't see interpolated class names). Kept hidden. */}
              <div className="hidden bg-neutral-50 bg-neutral-100 bg-neutral-200 bg-neutral-300 bg-neutral-400 bg-neutral-600 bg-neutral-700 bg-neutral-800 bg-neutral-950 bg-accent-50 bg-accent-100 bg-accent-200 bg-accent-300 bg-accent-600 bg-accent-700 bg-accent-800 bg-accent-950 bg-danger-500 bg-danger-600 bg-success-600" aria-hidden />
              <div className="g-scale-label">neutral</div>
              <Swatches items={NEUTRAL} prefix="neutral-" />
              <div className="g-scale-label">accent</div>
              <Swatches items={ACCENT} prefix="accent-" />
              <div className="g-scale-label">semantic</div>
              <Swatches items={SEM} prefix="" />
            </section>

            {/* TYPE */}
            <section id="type" className="g-section">
              <div className="g-eyebrow">Foundations</div><h2>Typography</h2>
              <p className="g-lede"><b>Satoshi</b> for the heading scale, <b>Inter</b> for body &amp; UI. The scale below renders from the real tokens.</p>
              <div className="mt-4">
                {TYPE.map(([k, cls, spec]) => (
                  <div className="g-type-row" key={k}>
                    <div className="spec">--text-{k}<br />{spec}</div>
                    <div className={`demo ${cls} ${['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(k) ? 'font-heading font-bold' : ''}`}>Two one</div>
                  </div>
                ))}
              </div>
            </section>

            {/* RADIUS */}
            <section id="radius" className="g-section">
              <div className="g-eyebrow">Foundations</div><h2>Radius</h2>
              <p className="g-lede">From hairline chips to fully-round pills. Buttons use <span className="mono">full</span> — the 2one signature.</p>
              <div className="g-radii">
                {RADII.map((r) => <div className="g-rd" key={r} style={{ borderRadius: `var(--radius-${r})` }}>{r}</div>)}
              </div>
            </section>

            {/* ACTIONS */}
            <section id="actions" className="g-section">
              <div className="g-eyebrow">Components</div><h2>Actions</h2>
              <p className="g-lede">Buttons are pills; one primary per view.</p>
              <Block title="Button" meta="variant × size">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Delete</Button>
                <Button disabled>Disabled</Button>
                <Button size="sm">Small</Button>
                <Button size="lg"><Rocket /> Large</Button>
              </Block>
              <div className="g-grid2">
                <Block title="ButtonGroup">
                  <ButtonGroup>
                    <Button variant="outline">Day</Button>
                    <Button variant="outline">Week</Button>
                    <Button variant="outline">Month</Button>
                  </ButtonGroup>
                </Block>
                <Block title="Toggle · ToggleGroup">
                  <Toggle aria-label="Star"><Star /></Toggle>
                  <ToggleGroup type="multiple" variant="outline">
                    <ToggleGroupItem value="b" aria-label="Bold"><Bold /></ToggleGroupItem>
                    <ToggleGroupItem value="i" aria-label="Italic"><Italic /></ToggleGroupItem>
                    <ToggleGroupItem value="u" aria-label="Underline"><Underline /></ToggleGroupItem>
                  </ToggleGroup>
                </Block>
                <Block title="Toolbar" meta="wraps — never clips" className="col">
                  {/* Actions wrap instead of scrolling: the Leave button stays visible at any width. */}
                  <Toolbar className="w-full rounded-lg border p-2">
                    <Button variant="ghost" size="sm"><Bold /> Bold</Button>
                    <Button variant="ghost" size="sm"><Italic /> Italic</Button>
                    <Button variant="ghost" size="sm"><Underline /> Underline</Button>
                    <ToolbarSpacer />
                    <Button variant="destructive" size="sm">Leave</Button>
                  </Toolbar>
                </Block>
              </div>
            </section>

            {/* FORMS */}
            <section id="forms" className="g-section">
              <div className="g-eyebrow">Components</div><h2>Forms</h2>
              <div className="g-grid2">
                <Block title="Input · Label" className="col">
                  <div className="grid w-full max-w-sm gap-1.5"><Label htmlFor="em">Email</Label><Input id="em" placeholder="you@example.com" /></div>
                  <div className="grid w-full max-w-sm gap-1.5">
                    <Label htmlFor="pw">Password</Label>
                    <Input id="pw" type="password" aria-invalid defaultValue="123" aria-describedby="pw-err" />
                    <p id="pw-err" className="flex items-center gap-1.5 text-sm text-destructive"><CircleAlert className="size-4" /> Must be at least 8 characters.</p>
                  </div>
                </Block>
                <Block title="Textarea" className="col">
                  <Textarea placeholder="Write a message…" className="w-full" />
                </Block>
                <Block title="Checkbox · Radio · Switch" className="col">
                  <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Remember me</label>
                  <label className="flex items-center gap-2 text-sm"><Checkbox /> Subscribe</label>
                  <RadioGroup defaultValue="std" className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="std" /> Standard</label>
                    <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="exp" /> Express</label>
                  </RadioGroup>
                  <label className="flex items-center gap-2 text-sm"><Switch defaultChecked /> Wi-Fi</label>
                </Block>
                <Block title="Select" className="col">
                  <Select><SelectTrigger className="w-52"><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent><SelectItem value="in">India</SelectItem><SelectItem value="us">United States</SelectItem><SelectItem value="de">Germany</SelectItem></SelectContent>
                  </Select>
                </Block>
                <Block title="Slider" className="col"><Slider defaultValue={[40]} max={100} step={1} className="w-64" /></Block>
                <Block title="InputOTP" className="col"><OtpDemo /></Block>
              </div>
            </section>

            {/* OVERLAYS */}
            <section id="overlays" className="g-section">
              <div className="g-eyebrow">Components</div><h2>Overlays</h2>
              <Block title="Dialog · Sheet · Popover · Dropdown · Tooltip · Alert dialog">
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline">Dialog</Button></DialogTrigger>
                  <DialogContent><DialogHeader><DialogTitle>Upgrade to Pro</DialogTitle><DialogDescription>Unlock every component.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose><Button>Continue</Button></DialogFooter></DialogContent>
                </Dialog>
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline">Sheet</Button></SheetTrigger>
                  <SheetContent><SheetHeader><SheetTitle>Settings</SheetTitle><SheetDescription>Slide-over panel.</SheetDescription></SheetHeader></SheetContent>
                </Sheet>
                <Popover>
                  <PopoverTrigger asChild><Button variant="outline">Popover</Button></PopoverTrigger>
                  <PopoverContent className="text-sm">Anchored floating content.</PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline">Menu</Button></DropdownMenuTrigger>
                  <DropdownMenuContent><DropdownMenuLabel>Account</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><User /> Profile</DropdownMenuItem><DropdownMenuItem><CreditCard /> Billing</DropdownMenuItem><DropdownMenuItem><LogOut /> Log out</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
                <Tooltip><TooltipTrigger asChild><Button variant="outline">Tooltip</Button></TooltipTrigger><TooltipContent>Helpful hint</TooltipContent></Tooltip>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </Block>
            </section>

            {/* DATA DISPLAY */}
            <section id="data" className="g-section">
              <div className="g-eyebrow">Components</div><h2>Data display</h2>
              <div className="g-grid2">
                <Card>
                  <CardHeader><CardTitle>Upgrade to Pro</CardTitle><CardDescription>Unlock every component.</CardDescription></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">Grayscale, token-driven, ready to ship.</CardContent>
                  <CardFooter><Button>Continue</Button></CardFooter>
                </Card>
                <Block title="Tabs" className="col">
                  <Tabs defaultValue="a" className="w-full"><TabsList><TabsTrigger value="a">Overview</TabsTrigger><TabsTrigger value="b">Details</TabsTrigger></TabsList><TabsContent value="a" className="text-sm text-muted-foreground pt-2">Overview panel.</TabsContent><TabsContent value="b" className="text-sm text-muted-foreground pt-2">Details panel.</TabsContent></Tabs>
                </Block>
                <Block title="Accordion" className="col">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="1"><AccordionTrigger>Is it themed to 2one?</AccordionTrigger><AccordionContent>Yes — every token maps to the 2one system.</AccordionContent></AccordionItem>
                    <AccordionItem value="2"><AccordionTrigger>Light and dark?</AccordionTrigger><AccordionContent>Yes — both themes ship and both pass the APCA audit. Toggle with the ThemeProvider.</AccordionContent></AccordionItem>
                  </Accordion>
                </Block>
                <Block title="Table" className="col">
                  <Table><TableHeader><TableRow><TableHead>Plan</TableHead><TableHead>Seats</TableHead><TableHead className="text-right">Price</TableHead></TableRow></TableHeader>
                    <TableBody>
                      <TableRow><TableCell>Starter</TableCell><TableCell>3</TableCell><TableCell className="text-right">$0</TableCell></TableRow>
                      <TableRow><TableCell>Pro</TableCell><TableCell>10</TableCell><TableCell className="text-right">$49</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </Block>
                <Block title="Badge · Avatar" className="col">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge>Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Badge variant="destructive">Error</Badge>
                    <Avatar><AvatarFallback>YK</AvatarFallback></Avatar>
                  </div>
                </Block>
                <Block title="Progress · Skeleton · Separator" className="col">
                  <Progress value={62} className="w-64" />
                  <div className="flex items-center gap-3 w-full"><Skeleton className="size-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>
                  <div className="flex items-center gap-2 text-sm">Home <Separator orientation="vertical" className="h-4" /> Docs</div>
                </Block>
              </div>
            </section>

            {/* FEEDBACK */}
            <section id="feedback" className="g-section">
              <div className="g-eyebrow">Components</div><h2>Feedback</h2>
              <Block title="Alert · Toast · Spinner" className="col">
                <Alert className="max-w-md"><Rocket /><AlertTitle>Heads up</AlertTitle><AlertDescription>This is the 2one-themed alert.</AlertDescription></Alert>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => toast('Saved', { description: 'Your changes are live.' })}>Show toast</Button>
                  <Spinner /> <Cap>Spinner</Cap>
                </div>
              </Block>
            </section>

            {/* NAVIGATION */}
            <section id="navigation" className="g-section">
              <div className="g-eyebrow">Components</div><h2>Navigation</h2>
              <div className="g-grid2">
                <Block title="Breadcrumb" className="col">
                  <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
                </Block>
                <Block title="Pagination" className="col">
                  <div className="w-full overflow-x-auto">
                    <Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationContent></Pagination>
                  </div>
                </Block>
              </div>
            </section>

            {/* MOBILE / 2ONE */}
            <section id="mobile" className="g-section">
              <div className="g-eyebrow">Components · 2one-only</div><h2>Mobile &amp; brand</h2>
              <p className="g-lede">The three components shadcn has no equivalent for.</p>
              <div className="g-grid2">
                <Block title="AppBar" className="col">
                  <div className="w-80 rounded-xl border overflow-hidden"><AppBar title="Sign in" onBack={() => {}} trailingSlot={<Avatar className="size-7"><AvatarFallback>Y</AvatarFallback></Avatar>} /></div>
                </Block>
                <Block title="BottomNavItem" className="col">
                  <div className="flex w-80 rounded-xl border overflow-hidden">
                    <BottomNavItem icon={<Home />} label="Home" selected />
                    <BottomNavItem icon={<Search />} label="Search" />
                    <BottomNavItem icon={<Bell />} label="Alerts" />
                    <BottomNavItem icon={<User />} label="Profile" />
                  </div>
                </Block>
                <Block title="Logo" meta="black on light / white on dark">
                  {/* fixed grounds — the mark is demoed on its intended surface, not the page theme's */}
                  <div className="rounded-lg border bg-white p-4"><Logo variant="black" width={120} /></div>
                  <div className="rounded-lg bg-neutral-950 p-4"><Logo variant="white" width={120} /></div>
                </Block>
              </div>
            </section>

            {/* BLOCKS */}
            <section id="blocks" className="g-section">
              <div className="g-eyebrow">Templates</div><h2>Blocks</h2>
              <p className="g-lede">Pre-composed, auto-themed forms built from the 2one components — ready to drop into an app.</p>
              <div className="g-grid2">
                <Block title="login-03" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login03 /></div></Block>
                <Block title="login-01" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login01 /></div></Block>
                <Block title="signup-01" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Signup01 /></div></Block>
              </div>
              <Card className="mt-6 gap-4">
                <CardHeader>
                  <CardTitle className="text-base">dashboard-plain</CardTitle>
                  <CardDescription>block · content only, no navigation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] overflow-auto rounded-lg border">
                    <DashboardPlain />
                  </div>
                </CardContent>
              </Card>
              <div className="g-scale-label">All blocks</div>
              <div className="g-index">
                {BLOCK_ITEMS.map((b) => <span key={b} className="chip">{b}</span>)}
              </div>
            </section>

            {/* MARKETING */}
            <section id="marketing" className="g-section">
              <div className="g-eyebrow">Templates</div><h2>Marketing</h2>
              <p className="g-lede">Landing-page sections, built entirely from the library — grayscale, light + dark. Each is a full-bleed section; <code>marketing/page.tsx</code> composes them into a complete page.</p>
              <div className="mt-6 flex flex-col gap-6">
                {([
                  ['hero', <MarketingHero />],
                  ['logo-cloud', <MarketingLogoCloud />],
                  ['feature-grid', <MarketingFeatureGrid />],
                  ['stats', <MarketingStats />],
                  ['testimonial', <MarketingTestimonial />],
                  ['pricing', <MarketingPricing />],
                  ['faq', <MarketingFaq />],
                  ['client-faq', <MarketingClientFaq />],
                  ['cta-banner', <MarketingCtaBanner />],
                  ['footer', <MarketingFooter />],
                ] as [string, React.ReactNode][]).map(([id, node]) => (
                  <div key={id}>
                    <div className="g-scale-label">{id}</div>
                    <div className="overflow-hidden rounded-lg border">{node}</div>
                  </div>
                ))}
                <div>
                  <div className="g-scale-label">page — full landing page (composed)</div>
                  <div className="h-[720px] overflow-auto rounded-lg border"><MarketingPage /></div>
                </div>
              </div>
            </section>

            {/* CHARTS */}
            <section id="charts" className="g-section">
              <div className="g-eyebrow">Templates · data viz</div><h2>Charts</h2>
              <p className="g-lede">{COUNT.charts} chart templates across every type — grayscale by default (the <code>--chart-1…5</code> tokens map to the neutral ramp, no hues). One of each type shown; the full set lives in <code>src/blocks/charts/</code>.</p>
              <div className="g-grid2">
                <ChartArea />
                <ChartBarMultiple />
                <ChartLineMultiple />
                <ChartRadarDefault />
                <ChartPieDonutText />
                <ChartRadialStacked />
              </div>
              <div className="g-scale-label">All {COUNT.charts} charts</div>
              <div className="g-index">
                {CHART_ITEMS.map((c) => <span key={c} className="chip">{c}</span>)}
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
