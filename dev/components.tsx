import { useEffect, useState } from 'react'
import {
  Star, Bold, Italic, Underline, Search, Bell, Home, User, Rocket, CreditCard,
  LogOut, CircleAlert, Copy, Check, Sun, Moon,
  Network, Accessibility, Sparkles, Globe, ArrowRight, Mail, ExternalLink, BookOpen,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation, Trans } from 'react-i18next'
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Calendar } from '@/components/ui/calendar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import {
  Sidebar, SidebarClose, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar'

import { Logo } from '@/components/logo'
import { AppBar } from '@/components/app-bar'
import { BottomNavItem } from '@/components/bottom-nav-item'
import { TopNav } from './global-nav'
import { LanguageToggle } from './i18n/language-toggle'

// Tier 3 · Components for AI Interface — folded in as a section of this page
// (they share the same primitives, tokens and rules as everything else).
import { LoadingState } from '@/ai-components/loading-state'
import { ThinkingIndicator } from '@/ai-components/thinking-indicator'
import { TypingIndicator } from '@/ai-components/typing-indicator'
import { StreamingText } from '@/ai-components/streaming-text'
import { ReasoningPanel } from '@/ai-components/reasoning-panel'
import { ReasoningEffort } from '@/ai-components/reasoning-effort'
import { GuardrailNotice } from '@/ai-components/guardrail-notice'

// blocks (templates)
import { LoginForm as Login01 } from '@/blocks/login-01'
import { LoginForm as Login02 } from '@/blocks/login-02'
import { LoginForm as Login03 } from '@/blocks/login-03'
import { LoginForm as Login04 } from '@/blocks/login-04'
import { LoginForm as Login05 } from '@/blocks/login-05'
import { SignupForm as Signup01 } from '@/blocks/signup-01'
import { SignupForm as Signup02 } from '@/blocks/signup-02'
import { SignupForm as Signup03 } from '@/blocks/signup-03'
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

// Own scroll position — set BEFORE first paint so the browser never restores a
// prior mid-page scroll (the page reopened at Overlays/Data). The component then
// scrolls to the top (or a linked #section) on mount.
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

/* ---------- foundation data (from tokens/*.css) ---------- */
// Foundation swatches derive colour + label from the live @theme tokens
// (--color-<ramp>-<step> in tokens/colors.css), so this section can never
// drift from the real theme — change a token and the swatch follows.
// The 2one colour foundation — three levels: PRIMARY (neutral), ACCENT (brand),
// SEMANTIC (danger/success). There is no grayscale "accent" ramp.
const NEUTRAL = ['50', '100', '200', '300', '400', '600', '700', '800', '950']
// brand = the ACCENT level. 500 is the identity (#30A1FF); 700/300 are the
// APCA-accessible steps the UI renders (light/dark).
const BRAND = ['50', '100', '300', '500', '700', '800']
const SEM = ['danger-500', 'danger-600', 'success-600']
const TYPE: [string, string, string][] = [['display', 'text-display', '76 / 103'], ['h1', 'text-h1', '62 / 84'], ['h2', 'text-h2', '48 / 65'], ['h3', 'text-h3', '40 / 54'], ['h4', 'text-h4', '32 / 43'], ['h5', 'text-h5', '26 / 35'], ['h6', 'text-h6', '20 / 27'], ['base', 'text-base', '16 · body'], ['sm', 'text-sm', '14 · UI'], ['xs', 'text-xs', '12 · small']]
const RADII = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']

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

// Components for AI Interface — each carries a machine-readable spec + graph
// node, so what it is composed of and what governs it are shown next to the
// live demo rather than asserted. Ordered as a short narrative of a turn.
const AI_SPECS = new Map(
  (((manifest.index.templates as any).aiComponents?.spec ?? []) as any[]).map((s: any) => [s.id, s])
)
const AI_ITEMS: { id: string; blurbKey: string; render: () => React.ReactNode }[] = [
  { id: 'ai-component:loading-state', blurbKey: 'ai.items.loadingState', render: () => <LoadingState /> },
  { id: 'ai-component:thinking-indicator', blurbKey: 'ai.items.thinkingIndicator', render: () => <ThinkingLabelDemo /> },
  { id: 'ai-component:typing-indicator', blurbKey: 'ai.items.typingIndicator', render: () => <div className="flex h-10 items-center"><TypingIndicator /></div> },
  { id: 'ai-component:streaming-text', blurbKey: 'ai.items.streamingText', render: () => <StreamingText /> },
  { id: 'ai-component:reasoning-panel', blurbKey: 'ai.items.reasoningPanel', render: () => <ReasoningPanel /> },
  { id: 'ai-component:reasoning-effort', blurbKey: 'ai.items.reasoningEffort', render: () => <ReasoningEffort /> },
  { id: 'ai-component:guardrail-notice', blurbKey: 'ai.items.guardrailNotice', render: () => <GuardrailNotice /> },
]

function CodeBlock({ code }: { code: string }) {
  const { t } = useTranslation()
  const [done, setDone] = useState(false)
  return (
    <div className="relative min-w-0">
      <pre className="overflow-x-auto rounded-md bg-muted p-3 pr-11 font-mono text-sm text-muted-foreground">{code}</pre>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={done ? t('common.copied') : t('common.copyToClipboard')}
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

// AI-interface helpers — the label is localized, the demo itself is language-neutral.
function ThinkingLabelDemo() {
  const { t } = useTranslation()
  return <ThinkingIndicator label={t('ai.thinkingLabel')} />
}
function AIChipRow({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {items.map((v) => (
        <Badge key={v} variant="secondary" className="mono text-[11px] font-normal">{v}</Badge>
      ))}
    </div>
  )
}

// Light/dark toggle — verifies the whole system in both themes (dogfoods ThemeProvider).
function ThemeToggle({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      aria-label={isDark ? t('common.switchToLight') : t('common.switchToDark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun /> : <Moon />}
      {isDark ? t('common.light') : t('common.dark')}
    </Button>
  )
}

// The logo sits in the SidebarHeader when the menu is expanded; when collapsed
// (or on mobile) it hops to the top bar next to the hamburger.
function TopBarLogo() {
  const { t } = useTranslation()
  const { state, isMobile } = useSidebar()
  if (state === 'expanded' && !isMobile) return null
  return (
    <>
      <a href="/" className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={t('common.dashboardAria')}>
        <Logo variant="black" width={46} className="dark:hidden" />
        <Logo variant="white" width={46} className="hidden dark:block" />
      </a>
      <Separator orientation="vertical" className="mx-1 !h-5" />
    </>
  )
}

export function Components() {
  const { t } = useTranslation()
  // Open at Tier 1 · Brand — the first section — so the sidebar reads active there on load.
  const [active, setActive] = useState('brand')

  const NAV = [
    { grp: t('components.sidebar.tier1'), items: [['brand', t('components.sidebar.brand'), '']] },
    { grp: t('components.sidebar.tier2'), items: [['color', t('components.sidebar.colour'), ''], ['type', t('components.sidebar.typography'), ''], ['radius', t('components.sidebar.radius'), '']] },
    { grp: t('components.sidebar.tier3'), items: [['blocks', t('components.sidebar.blocks'), String(COUNT.blocks)], ['marketing', t('components.sidebar.marketing'), String(COUNT.marketing)], ['charts', t('components.sidebar.charts'), String(COUNT.charts)]] },
    { grp: t('components.sidebar.twoOneComponents'), items: [['mobile', t('components.sidebar.mobile'), String(COUNT.twoOne)]] },
    { grp: t('nav.aiComponents'), items: [['ai', t('ai.sidebar.reasoning'), String(AI_ITEMS.length)]] },
    { grp: t('components.sidebar.shadcnComponents'), items: [['actions', t('components.sidebar.actions'), ''], ['forms', t('components.sidebar.forms'), ''], ['overlays', t('components.sidebar.overlays'), ''], ['data', t('components.sidebar.data'), ''], ['feedback', t('components.sidebar.feedback'), ''], ['navigation', t('components.sidebar.navigation'), ''], ['more', t('components.sidebar.more'), '']] },
  ]

  useEffect(() => {
    // Load from the TOP (or a linked section), never a browser-restored scroll
    // position, and never the spot a mounted widget scrolls itself to. The cmdk
    // Command in the "more" section scrolls itself into view a tick after mount,
    // which used to reopen the page mid-way (Overlays/More) — so re-assert the
    // intended position instantly across the first frames until it settles.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const hash = decodeURIComponent(location.hash.slice(1))
    const settle = () => {
      const el = hash ? document.getElementById(hash) : null
      if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
      else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    settle()
    const raf = requestAnimationFrame(settle)
    const t1 = setTimeout(settle, 120)

    const secs = Array.from(document.querySelectorAll('.g-section[id]'))
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-45% 0px -50% 0px' })
    secs.forEach((s) => obs.observe(s))
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); obs.disconnect() }
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        {/* App shell — the library's own Sidebar, not bespoke chrome */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between gap-2">
              <a href="/" className="flex items-center gap-2.5 px-2 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={t('common.dashboardAria')}>
                <Logo variant="black" width={52} className="dark:hidden" />
                <Logo variant="white" width={52} className="hidden dark:block" />
              </a>
              <SidebarClose />
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
            <TopBarLogo />
            <TopNav current="/components.html" />
            <div className="ml-auto flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">

            {/* TIER 1 · BRAND */}
            <section id="brand" className="g-section">
              <div className="g-eyebrow">{t('components.brand.eyebrow')}</div><h2>{t('components.brand.title')}</h2>
              <p className="g-lede"><Trans i18nKey="components.brand.lede" components={{ mono: <span className="mono" />, a: <a className="underline underline-offset-2" href="/dls.html" /> }} /></p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">{t('components.brand.missionCard')}</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('components.brand.mission')}</div><p className="mt-1 text-foreground">{brand.mission}</p></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('components.brand.vision')}</div><p className="mt-1 text-foreground">{brand.vision}</p></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('components.brand.tagline')}</div><p className="mt-1 text-foreground">{brand.tagline}</p></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">{t('components.brand.voiceCard')}</CardTitle><CardDescription>{t('components.brand.voiceCardDesc')}</CardDescription></CardHeader>
                  <CardContent className="grid gap-3 text-sm">
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('components.brand.voice')}</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.voice.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('components.brand.tone')}</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.tone.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('components.brand.personality')}</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.personality.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}<Badge variant="outline">{t('components.brand.archetype', { name: brand.archetype.name })}</Badge></div></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">{t('components.brand.whoFor')}</CardTitle></CardHeader>
                  <CardContent><ul className="grid gap-2 text-sm">{brand.personas.map((p) => <li key={p.id} className="flex items-start gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden /><span>{p.label}</span></li>)}</ul></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">{t('components.brand.logo')}</CardTitle><CardDescription>{t('components.brand.logoDesc')}</CardDescription></CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-3">
                    <div className="rounded-lg border bg-white p-4"><Logo variant="black" width={96} /></div>
                    <div className="rounded-lg bg-neutral-950 p-4"><Logo variant="white" width={96} /></div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* COLOUR */}
            <section id="color" className="g-section">
              <div className="g-eyebrow">{t('components.colour.eyebrow')}</div><h2>{t('components.colour.title')}</h2>
              <p className="g-lede"><Trans i18nKey="components.colour.lede" components={{ b: <b />, mono: <span className="mono" /> }} /></p>
              {/* Safelist: Tailwind v4 tree-shakes @theme vars no utility references.
                  The swatches read var(--color-<ramp>-<step>) at runtime, so we force
                  those vars into :root by naming every ramp utility here (literal names
                  only — Tailwind can't see interpolated class names). Kept hidden. */}
              <div className="hidden bg-neutral-50 bg-neutral-100 bg-neutral-200 bg-neutral-300 bg-neutral-400 bg-neutral-600 bg-neutral-700 bg-neutral-800 bg-neutral-950 bg-brand-50 bg-brand-100 bg-brand-300 bg-brand-500 bg-brand-700 bg-brand-800 bg-danger-500 bg-danger-600 bg-success-600" aria-hidden />
              <div className="g-scale-label">{t('components.colour.primaryLabel')}</div>
              <Swatches items={NEUTRAL} prefix="neutral-" />
              <div className="g-scale-label">{t('components.colour.accentLabel')}</div>
              <Swatches items={BRAND} prefix="brand-" />
              <div className="g-scale-label">{t('components.colour.semanticLabel')}</div>
              <Swatches items={SEM} prefix="" />
            </section>

            {/* TYPE */}
            <section id="type" className="g-section">
              <div className="g-eyebrow">{t('components.type.eyebrow')}</div><h2>{t('components.type.title')}</h2>
              <p className="g-lede"><Trans i18nKey="components.type.lede" components={{ b: <b /> }} /></p>
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
              <div className="g-eyebrow">{t('components.radius.eyebrow')}</div><h2>{t('components.radius.title')}</h2>
              <p className="g-lede"><Trans i18nKey="components.radius.lede" components={{ mono: <span className="mono" /> }} /></p>
              <div className="g-radii">
                {RADII.map((r) => <div className="g-rd" key={r} style={{ borderRadius: `var(--radius-${r})` }}>{r}</div>)}
              </div>
            </section>

            {/* BLOCKS */}
            <section id="blocks" className="g-section">
              <div className="g-eyebrow">{t('components.blocks.eyebrow')}</div><h2>{t('components.blocks.title')}</h2>
              <p className="g-lede">{t('components.blocks.lede')}</p>
              <div className="g-grid2">
                <Block title="login-01" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login01 /></div></Block>
                <Block title="login-02" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login02 /></div></Block>
                <Block title="login-03" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login03 /></div></Block>
                <Block title="login-04" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login04 /></div></Block>
                <Block title="login-05" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Login05 /></div></Block>
                <Block title="signup-01" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Signup01 /></div></Block>
                <Block title="signup-02" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Signup02 /></div></Block>
                <Block title="signup-03" meta="block" className="col"><div className="w-full max-w-sm mx-auto"><Signup03 /></div></Block>
              </div>
              <Card className="mt-6 gap-4">
                <CardHeader>
                  <CardTitle className="text-base">{t('components.blocks.dashboardTitle')}</CardTitle>
                  <CardDescription>{t('components.blocks.dashboardDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] overflow-auto rounded-lg border">
                    <DashboardPlain />
                  </div>
                </CardContent>
              </Card>
              <div className="g-scale-label">{t('components.blocks.allBlocks')}</div>
              <div className="g-index">
                {BLOCK_ITEMS.map((b) => <span key={b} className="chip">{b}</span>)}
              </div>
            </section>

            {/* MARKETING */}
            <section id="marketing" className="g-section">
              <div className="g-eyebrow">{t('components.marketing.eyebrow')}</div><h2>{t('components.marketing.title')}</h2>
              <p className="g-lede"><Trans i18nKey="components.marketing.lede" components={{ code: <code /> }} /></p>
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
                  <div className="g-scale-label">{t('components.marketing.fullPage')}</div>
                  <div className="h-[720px] overflow-auto rounded-lg border"><MarketingPage /></div>
                </div>
              </div>
            </section>

            {/* CHARTS */}
            <section id="charts" className="g-section">
              <div className="g-eyebrow">{t('components.charts.eyebrow')}</div><h2>{t('components.charts.title')}</h2>
              <p className="g-lede"><Trans i18nKey="components.charts.lede" values={{ count: COUNT.charts }} components={{ code: <code /> }} /></p>
              <div className="g-grid2">
                <ChartArea />
                <ChartBarMultiple />
                <ChartLineMultiple />
                <ChartRadarDefault />
                <ChartPieDonutText />
                <ChartRadialStacked />
              </div>
              <div className="g-scale-label">{t('components.charts.all', { count: COUNT.charts })}</div>
              <div className="g-index">
                {CHART_ITEMS.map((c) => <span key={c} className="chip">{c}</span>)}
              </div>
            </section>

            {/* MOBILE / 2ONE */}
            <section id="mobile" className="g-section">
              <div className="g-eyebrow">{t('components.mobile.eyebrow')}</div><h2>{t('components.mobile.title')}</h2>
              <p className="g-lede">{t('components.mobile.lede')}</p>
              <div className="g-grid2">
                <Block title="AppBar" className="col">
                  <div className="w-80 rounded-xl border overflow-hidden"><AppBar title={t('components.mobile.signIn')} onBack={() => {}} trailingSlot={<Avatar className="size-7"><AvatarFallback>Y</AvatarFallback></Avatar>} /></div>
                </Block>
                <Block title="BottomNavItem" className="col">
                  <div className="flex w-80 rounded-xl border overflow-hidden">
                    <BottomNavItem icon={<Home />} label={t('components.mobile.home')} selected />
                    <BottomNavItem icon={<Search />} label={t('components.mobile.search')} />
                    <BottomNavItem icon={<Bell />} label={t('components.mobile.alerts')} />
                    <BottomNavItem icon={<User />} label={t('components.mobile.profile')} />
                  </div>
                </Block>
                <Block title="Logo" meta={t('components.mobile.logoMeta')}>
                  {/* fixed grounds — the mark is demoed on its intended surface, not the page theme's */}
                  <div className="rounded-lg border bg-white p-4"><Logo variant="black" width={120} /></div>
                  <div className="rounded-lg bg-neutral-950 p-4"><Logo variant="white" width={120} /></div>
                </Block>
              </div>
            </section>

            {/* TIER 3 · COMPONENTS FOR AI INTERFACE */}
            <section id="ai" className="g-section">
              <div className="g-eyebrow">{t('ai.hero.eyebrow')}</div><h2>{t('ai.hero.title')}</h2>
              <p className="g-lede">
                <Trans i18nKey="ai.hero.lede" components={{ mono: <span className="mono">ai-component:&lt;id&gt;</span> }} />
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {AI_ITEMS.map((item, i) => {
                  const spec: any = AI_SPECS.get(item.id)
                  const title = spec?.label ?? item.id
                  const composes: string[] = spec?.composes?.components ?? []
                  const governed: string[] = spec?.governed_by ?? []
                  return (
                    <Card key={item.id} className="min-w-0 gap-4">
                      <CardHeader>
                        <div className="flex items-baseline gap-2">
                          <span className="mono text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                          <CardTitle className="text-base">{title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{t(item.blurbKey)}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-5">
                          {item.render()}
                        </div>
                        <div className="space-y-1.5">
                          <AIChipRow label={t('ai.composedOf')} items={composes} />
                          <AIChipRow label={t('ai.governedBy')} items={governed} />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>


            {/* ACTIONS */}
            <section id="actions" className="g-section">
              <div className="g-eyebrow">{t('components.actions.eyebrow')}</div><h2>{t('components.actions.title')}</h2>
              <p className="g-lede">{t('components.actions.lede')}</p>
              <Block title="Button" meta={t('components.actions.buttonMeta')}>
                <Button>{t('components.actions.primary')}</Button>
                <Button variant="secondary">{t('components.actions.secondary')}</Button>
                <Button variant="outline">{t('components.actions.outline')}</Button>
                <Button variant="ghost">{t('components.actions.ghost')}</Button>
                <Button variant="destructive">{t('components.actions.delete')}</Button>
                <Button disabled>{t('components.actions.disabled')}</Button>
                <Button size="sm">{t('components.actions.small')}</Button>
                <Button size="lg"><Rocket /> {t('components.actions.large')}</Button>
              </Block>
              <div className="g-grid2">
                <Block title="ButtonGroup">
                  <ButtonGroup>
                    <Button variant="outline">{t('components.actions.day')}</Button>
                    <Button variant="outline">{t('components.actions.week')}</Button>
                    <Button variant="outline">{t('components.actions.month')}</Button>
                  </ButtonGroup>
                </Block>
                <Block title="Toggle · ToggleGroup">
                  <Toggle aria-label="Star"><Star /></Toggle>
                  <ToggleGroup type="multiple" variant="outline">
                    <ToggleGroupItem value="b" aria-label={t('components.actions.bold')}><Bold /></ToggleGroupItem>
                    <ToggleGroupItem value="i" aria-label={t('components.actions.italic')}><Italic /></ToggleGroupItem>
                    <ToggleGroupItem value="u" aria-label={t('components.actions.underline')}><Underline /></ToggleGroupItem>
                  </ToggleGroup>
                </Block>
                <Block title="Toolbar" meta={t('components.actions.toggleMeta')} className="col">
                  {/* Actions wrap instead of scrolling: the Leave button stays visible at any width. */}
                  <Toolbar className="w-full rounded-lg border p-2">
                    <Button variant="ghost" size="sm"><Bold /> {t('components.actions.bold')}</Button>
                    <Button variant="ghost" size="sm"><Italic /> {t('components.actions.italic')}</Button>
                    <Button variant="ghost" size="sm"><Underline /> {t('components.actions.underline')}</Button>
                    <ToolbarSpacer />
                    <Button variant="destructive" size="sm">{t('components.actions.leave')}</Button>
                  </Toolbar>
                </Block>
              </div>
            </section>

            {/* FORMS */}
            <section id="forms" className="g-section">
              <div className="g-eyebrow">{t('components.forms.eyebrow')}</div><h2>{t('components.forms.title')}</h2>
              <div className="g-grid2">
                <Block title="Input · Label" className="col">
                  <div className="grid w-full max-w-sm gap-1.5"><Label htmlFor="em">{t('components.forms.email')}</Label><Input id="em" placeholder="you@example.com" /></div>
                  <div className="grid w-full max-w-sm gap-1.5">
                    <Label htmlFor="pw">{t('components.forms.password')}</Label>
                    <Input id="pw" type="password" aria-invalid defaultValue="123" aria-describedby="pw-err" />
                    <p id="pw-err" className="flex items-center gap-1.5 text-sm text-destructive"><CircleAlert className="size-4" /> {t('components.forms.passwordError')}</p>
                  </div>
                </Block>
                <Block title="Textarea" className="col">
                  <Textarea placeholder={t('components.forms.writeMessage')} aria-label={t('components.forms.message')} className="w-full" />
                </Block>
                <Block title="Checkbox · Radio · Switch" className="col">
                  <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> {t('components.forms.rememberMe')}</label>
                  <label className="flex items-center gap-2 text-sm"><Checkbox /> {t('components.forms.subscribe')}</label>
                  <RadioGroup defaultValue="std" className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="std" /> {t('components.forms.standard')}</label>
                    <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="exp" /> {t('components.forms.express')}</label>
                  </RadioGroup>
                  <label className="flex items-center gap-2 text-sm"><Switch defaultChecked /> {t('components.forms.wifi')}</label>
                </Block>
                <Block title="Select" className="col">
                  <Select><SelectTrigger className="w-52"><SelectValue placeholder={t('components.forms.country')} /></SelectTrigger>
                    <SelectContent><SelectItem value="in">{t('components.forms.india')}</SelectItem><SelectItem value="us">{t('components.forms.unitedStates')}</SelectItem><SelectItem value="de">{t('components.forms.germany')}</SelectItem></SelectContent>
                  </Select>
                </Block>
                <Block title="Slider" className="col"><Slider defaultValue={[40]} max={100} step={1} aria-label={t('components.forms.value')} className="w-64" /></Block>
                <Block title="InputOTP" className="col"><OtpDemo /></Block>
              </div>
            </section>

            {/* OVERLAYS */}
            <section id="overlays" className="g-section">
              <div className="g-eyebrow">{t('components.overlays.eyebrow')}</div><h2>{t('components.overlays.title')}</h2>
              <Block title={t('components.overlays.blockTitle')}>
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline">{t('components.overlays.dialog')}</Button></DialogTrigger>
                  <DialogContent><DialogHeader><DialogTitle>{t('components.overlays.upgradeTitle')}</DialogTitle><DialogDescription>{t('components.overlays.upgradeDesc')}</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="ghost">{t('components.overlays.cancel')}</Button></DialogClose><Button>{t('components.overlays.continue')}</Button></DialogFooter></DialogContent>
                </Dialog>
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline">{t('components.overlays.sheet')}</Button></SheetTrigger>
                  <SheetContent><SheetHeader><SheetTitle>{t('components.overlays.settings')}</SheetTitle><SheetDescription>{t('components.overlays.slideOver')}</SheetDescription></SheetHeader></SheetContent>
                </Sheet>
                <Popover>
                  <PopoverTrigger asChild><Button variant="outline">{t('components.overlays.popover')}</Button></PopoverTrigger>
                  <PopoverContent className="text-sm">{t('components.overlays.anchored')}</PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline">{t('components.overlays.menu')}</Button></DropdownMenuTrigger>
                  <DropdownMenuContent><DropdownMenuLabel>{t('components.overlays.account')}</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><User /> {t('components.overlays.profile')}</DropdownMenuItem><DropdownMenuItem><CreditCard /> {t('components.overlays.billing')}</DropdownMenuItem><DropdownMenuItem><LogOut /> {t('components.overlays.logOut')}</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
                <Tooltip><TooltipTrigger asChild><Button variant="outline">{t('components.overlays.tooltip')}</Button></TooltipTrigger><TooltipContent>{t('components.overlays.helpfulHint')}</TooltipContent></Tooltip>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive">{t('components.overlays.delete')}</Button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('components.overlays.areYouSure')}</AlertDialogTitle><AlertDialogDescription>{t('components.overlays.cannotUndo')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('components.overlays.cancel')}</AlertDialogCancel><AlertDialogAction>{t('components.overlays.delete')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </Block>
            </section>

            {/* DATA DISPLAY */}
            <section id="data" className="g-section">
              <div className="g-eyebrow">{t('components.data.eyebrow')}</div><h2>{t('components.data.title')}</h2>
              <div className="g-grid2">
                <Card>
                  <CardHeader><CardTitle>{t('components.data.upgradeTitle')}</CardTitle><CardDescription>{t('components.data.upgradeDesc')}</CardDescription></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{t('components.data.upgradeBody')}</CardContent>
                  <CardFooter><Button>{t('components.data.continue')}</Button></CardFooter>
                </Card>
                <Block title="Tabs" className="col">
                  <Tabs defaultValue="a" className="w-full"><TabsList><TabsTrigger value="a">{t('components.data.overview')}</TabsTrigger><TabsTrigger value="b">{t('components.data.details')}</TabsTrigger></TabsList><TabsContent value="a" className="text-sm text-muted-foreground pt-2">{t('components.data.overviewPanel')}</TabsContent><TabsContent value="b" className="text-sm text-muted-foreground pt-2">{t('components.data.detailsPanel')}</TabsContent></Tabs>
                </Block>
                <Block title="Accordion" className="col">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="1"><AccordionTrigger>{t('components.data.accordionQ1')}</AccordionTrigger><AccordionContent>{t('components.data.accordionA1')}</AccordionContent></AccordionItem>
                    <AccordionItem value="2"><AccordionTrigger>{t('components.data.accordionQ2')}</AccordionTrigger><AccordionContent>{t('components.data.accordionA2')}</AccordionContent></AccordionItem>
                  </Accordion>
                </Block>
                <Block title="Table" className="col">
                  <Table><TableHeader><TableRow><TableHead>{t('components.data.plan')}</TableHead><TableHead>{t('components.data.seats')}</TableHead><TableHead className="text-right">{t('components.data.price')}</TableHead></TableRow></TableHeader>
                    <TableBody>
                      <TableRow><TableCell>{t('components.data.starter')}</TableCell><TableCell>3</TableCell><TableCell className="text-right">$0</TableCell></TableRow>
                      <TableRow><TableCell>{t('components.data.pro')}</TableCell><TableCell>10</TableCell><TableCell className="text-right">$49</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </Block>
                <Block title="Badge · Avatar" className="col">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge>{t('components.data.default')}</Badge><Badge variant="secondary">{t('components.data.secondary')}</Badge><Badge variant="outline">{t('components.data.outline')}</Badge><Badge variant="destructive">{t('components.data.error')}</Badge>
                    <Avatar><AvatarFallback>YK</AvatarFallback></Avatar>
                  </div>
                </Block>
                <Block title="Progress · Skeleton · Separator" className="col">
                  <Progress value={62} className="w-64" />
                  <div className="flex items-center gap-3 w-full"><Skeleton className="size-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>
                  <div className="flex items-center gap-2 text-sm">{t('components.data.home')} <Separator orientation="vertical" className="h-4" /> {t('components.data.docs')}</div>
                </Block>
              </div>
            </section>

            {/* FEEDBACK */}
            <section id="feedback" className="g-section">
              <div className="g-eyebrow">{t('components.feedback.eyebrow')}</div><h2>{t('components.feedback.title')}</h2>
              <Block title={t('components.feedback.blockTitle')} className="col">
                <Alert className="max-w-md"><Rocket /><AlertTitle>{t('components.feedback.headsUp')}</AlertTitle><AlertDescription>{t('components.feedback.alertBody')}</AlertDescription></Alert>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => toast(t('components.feedback.toastTitle'), { description: t('components.feedback.toastDesc') })}>{t('components.feedback.showToast')}</Button>
                  <Spinner /> <Cap>{t('components.feedback.spinner')}</Cap>
                </div>
              </Block>
            </section>

            {/* NAVIGATION */}
            <section id="navigation" className="g-section">
              <div className="g-eyebrow">{t('components.navigation.eyebrow')}</div><h2>{t('components.navigation.title')}</h2>
              <div className="g-grid2">
                <Block title="Breadcrumb" className="col">
                  <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">{t('components.navigation.home')}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">{t('components.navigation.components')}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{t('components.navigation.button')}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
                </Block>
                <Block title="Pagination" className="col">
                  <div className="w-full overflow-x-auto">
                    <Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationContent></Pagination>
                  </div>
                </Block>
              </div>
            </section>

            {/* MORE COMPONENTS */}
            <section id="more" className="g-section">
              <div className="g-eyebrow">{t('components.more.eyebrow')}</div><h2>{t('components.more.title')}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Block title="Command" meta={t('components.more.commandMeta')}>
                  <Command className="max-w-sm rounded-lg border">
                    <CommandInput placeholder={t('components.more.searchPlaceholder')} aria-label={t('components.more.searchCommands')} />
                    <CommandList>
                      <CommandEmpty>{t('components.more.noResults')}</CommandEmpty>
                      <CommandGroup heading={t('components.more.suggestions')}>
                        <CommandItem><Search /> {t('components.more.searchDocs')}</CommandItem>
                        <CommandItem><User /> {t('components.more.profile')}</CommandItem>
                        <CommandSeparator />
                        <CommandItem><CreditCard /> {t('components.more.billing')}</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </Block>
                <Block title="Context menu" meta={t('components.more.contextMeta')}>
                  <ContextMenu>
                    <ContextMenuTrigger className="flex h-24 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                      {t('components.more.rightClickHere')}
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem><User /> {t('components.more.profile')}</ContextMenuItem>
                      <ContextMenuItem><CreditCard /> {t('components.more.billing')}</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem><LogOut /> {t('components.more.logOut')}</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </Block>
                <Block title="Menubar">
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger>{t('components.more.file')}</MenubarTrigger>
                      <MenubarContent><MenubarItem>{t('components.more.new')}</MenubarItem><MenubarItem>{t('components.more.open')}</MenubarItem><MenubarSeparator /><MenubarItem>{t('components.more.save')}</MenubarItem></MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>{t('components.more.edit')}</MenubarTrigger>
                      <MenubarContent><MenubarItem>{t('components.more.undo')}</MenubarItem><MenubarItem>{t('components.more.redo')}</MenubarItem></MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </Block>
                <Block title="Navigation menu">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>{t('components.more.product')}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-56 gap-1 p-2">
                            <NavigationMenuLink>{t('components.more.overview')}</NavigationMenuLink>
                            <NavigationMenuLink>{t('components.more.features')}</NavigationMenuLink>
                            <NavigationMenuLink>{t('components.more.pricing')}</NavigationMenuLink>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </Block>
                <Block title="Hover card" meta={t('components.more.hoverMeta')}>
                  <HoverCard>
                    <HoverCardTrigger asChild><Button variant="link">@2one</Button></HoverCardTrigger>
                    <HoverCardContent className="text-sm">{t('components.more.hoverCardBody')}</HoverCardContent>
                  </HoverCard>
                </Block>
                <Block title="Carousel">
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {[1, 2, 3].map((n) => (
                        <CarouselItem key={n}>
                          <div className="flex h-24 items-center justify-center rounded-md border text-2xl font-semibold">{n}</div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious /><CarouselNext />
                  </Carousel>
                </Block>
                <Block title={t('components.more.calendar')}>
                  <Calendar mode="single" className="w-fit rounded-md border" />
                </Block>
                <Block title="Resizable" meta={t('components.more.resizableMeta')}>
                  <ResizablePanelGroup direction="horizontal" className="h-24 max-w-sm rounded-md border">
                    <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center text-sm">{t('components.more.one')}</div></ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center text-sm">{t('components.more.two')}</div></ResizablePanel>
                  </ResizablePanelGroup>
                </Block>
              </div>
            </section>

            <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">{t('common.footerCatalog')}</footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  )
}

function OtpDemo() {
  const { t } = useTranslation()
  const [v, setV] = useState('482')
  return (
    <InputOTP maxLength={6} value={v} onChange={setV} aria-label={t('components.forms.otpLabel')}>
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
