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
  Sidebar, SidebarClose, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from '@/components/ui/sidebar'

import { Logo } from '@/components/logo'
import { AppBar } from '@/components/app-bar'
import { BottomNavItem } from '@/components/bottom-nav-item'
import { TopNav } from './global-nav'
import { LanguageToggle } from './i18n/language-toggle'

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
// the 2one voice (factual, no hype, honest about the gaps). Copy lives in i18n
// (overview.faq.items.<id>.{q,a}); this is just the render order.
const FAQ_IDS = ['brand', 'produce', 'who', 'shadcn', 'access'] as const

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

function CodeBlock({ code }: { code: string }) {
  const { t } = useTranslation()
  const [done, setDone] = useState(false)
  return (
    <div className="relative min-w-0">
      <pre className="overflow-hidden whitespace-pre-wrap break-words rounded-md bg-muted p-3 pr-11 font-mono text-sm text-muted-foreground">{code}</pre>
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

// Copy-only control — a pill button that copies `text` on click (no code block,
// no scroll). Shows a "Copied" state briefly.
function CopyButton({ text, label }: { text: string; label: string }) {
  const { t } = useTranslation()
  const [done, setDone] = useState(false)
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 font-normal"
      aria-label={done ? t('common.copiedToClipboard') : label}
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400) }}
    >
      {done ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
      <span className="truncate">{done ? t('common.copied') : label}</span>
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

// The logo sits in the SidebarHeader when the menu is expanded; when the menu is
// collapsed (or on mobile, where it's an off-canvas sheet) it hops to the top bar
// next to the hamburger — so the wordmark is always visible exactly once.
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

export function Showcase() {
  const { t } = useTranslation()
  const [active, setActive] = useState('overview')

  const NAV = [
    { grp: t('common.onThisPage'), items: [['overview', t('overview.sidebar.overview'), ''], ['use', t('overview.sidebar.howToUse'), '']] },
  ]

  useEffect(() => {
    // Honour an incoming section hash (e.g. /#faq, /#support arriving from the
    // Help menu on another page). The browser's native anchor jump fires before
    // React has rendered the section, so it lands at the top instead — land on
    // the section ourselves after mount, re-asserting across the first frames as
    // fonts/layout settle.
    const hash = decodeURIComponent(location.hash.slice(1))
    const timers: ReturnType<typeof setTimeout>[] = []
    if (hash) {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
      // Recompute the target each time (so a late web-font/logo/layout reflow
      // can't leave us off the section), and clear the 56px sticky header.
      const settle = () => {
        const el = document.getElementById(hash)
        if (!el) return
        const y = window.scrollY + el.getBoundingClientRect().top - 64
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      }
      settle()
      requestAnimationFrame(settle)
      document.fonts?.ready.then(settle).catch(() => {})
      // Re-assert across the first frames while fonts + footer assets settle.
      for (const ms of [120, 300, 600]) timers.push(setTimeout(settle, ms))
    }

    const secs = Array.from(document.querySelectorAll('.g-section[id]'))
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-45% 0px -50% 0px' })
    secs.forEach((s) => obs.observe(s))
    return () => { obs.disconnect(); timers.forEach(clearTimeout) }
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
            <TopNav current="/" />
            <div className="ml-auto flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">

            {/* OVERVIEW */}
            <section id="overview" className="g-section g-hero">
              <div className="g-eyebrow">{t('overview.hero.eyebrow')}</div>
              <h1>{t('overview.hero.titleLead')} <span className="thin">{t('overview.hero.titleThin')}</span></h1>
              <p><Trans i18nKey="overview.hero.body" components={{ b: <b className="text-foreground" />, em: <em /> }} /></p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="lg"><a href="/graph.html">{t('overview.hero.exploreGraph')} <ArrowRight /></a></Button>
                <Button asChild size="lg" variant="outline"><a href="/dls.html">{t('overview.hero.readGuide')}</a></Button>
              </div>

              {/* DLS teaser — content + a way into the dedicated DLS page (which now hosts the theming playground) */}
              <Card className="mt-8">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden><BookOpen /></div>
                  <CardTitle className="pt-2 text-base">{t('overview.dlsTeaser.title')}</CardTitle>
                  <CardDescription>{t('overview.dlsTeaser.body')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline"><a href="/dls.html">{t('overview.dlsTeaser.cta')} <ArrowRight /></a></Button>
                </CardContent>
              </Card>

              {/* Features — the key selling points, each with checkable evidence (honest, no hype) */}
              <div className="g-eyebrow mt-14">{t('overview.features.eyebrow')}</div>
              <h2>{t('overview.features.title')}</h2>
              <p className="g-lede">{t('overview.features.lede')}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {([
                  [<Network />, 'opinionated', 'npm run what-uses'],
                  [<Accessibility />, 'accessible', 'npm run a11y'],
                  [<Sparkles />, 'aiLegible', 'rules/ux-rules.json'],
                  [<Globe />, 'universal', 'tokens/*.json'],
                ] as [React.ReactNode, string, string][]).map(([icon, key, ev]) => (
                  <Card key={key} className="flex flex-col">
                    <CardHeader>
                      <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden>{icon}</div>
                      <CardTitle className="pt-2 text-base">{t(`overview.features.${key}.title`)}</CardTitle>
                      <CardDescription>{t(`overview.features.${key}.desc`)}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Badge variant="outline" className="font-mono font-normal">{ev}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="g-eyebrow mt-14">{t('overview.available.eyebrow')}</div>
              <h2>{t('overview.available.title')}</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {([[String(COUNT.components), t('overview.available.components')], [String(COUNT.shadcn), t('overview.available.shadcn')], [String(COUNT.twoOne), t('overview.available.twoOne')], ['1', t('overview.available.hueFree')]] as [string, string][]).map(([k, l]) => (
                  <Card key={l}>
                    <CardHeader>
                      <CardDescription>{l}</CardDescription>
                      <CardTitle className="text-3xl font-semibold tabular-nums">{k}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>

            {/* HOW TO USE THE APPLICATION — connect to the library + build with AI (from the 2one library, token-driven) */}
            <section id="use" className="g-section">
              <div className="g-eyebrow">{t('overview.use.eyebrow')}</div><h2>{t('overview.use.title')}</h2>
              <p className="g-lede">{t('overview.use.lede')}</p>

              <div className="mt-2 grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Badge variant="outline">1</Badge> {t('overview.use.step1.title')}</CardTitle>
                    <CardDescription><Trans i18nKey="overview.use.step1.desc" components={{ mono: <span className="font-mono" /> }} /></CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0"><CopyButton text="https://github.com/yokesh-2one/2one-design-library" label={t('overview.use.step1.copy')} /></CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Badge variant="outline">2</Badge> {t('overview.use.step2.title')}</CardTitle>
                    <CardDescription>{t('overview.use.step2.desc')}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Badge variant="outline">3</Badge> {t('overview.use.step3.title')}</CardTitle>
                    <CardDescription>{t('overview.use.step3.desc')}</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="mt-4 min-w-0">
                <CardHeader>
                  <CardTitle className="text-base">{t('overview.use.prompt.title')}</CardTitle>
                  <CardDescription>{t('overview.use.prompt.desc')}</CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                  <CodeBlock code={`Prompt for Building with the 2one Design Library

I want to build [Product], for [target users], to [the outcome they want].

Core features / workflows:
1. [Feature or workflow step]
2. [Feature or workflow step]
3. [Feature or workflow step]

Design system — read it first
Use the 2one Design Library: https://github.com/yokesh-2one/2one-design-library
Read manifest.json FIRST — it is the machine-readable index and the instructions_for_ai contract. Then, before building, summarise:
- the components, tokens and brand foundations that exist
- the templates relevant to this build (blocks, charts, page patterns, and Components for AI Interface if this is an assistant UI)
Use the knowledge graph for decisions (which component fits an intent, what a change touches): node scripts/graph-decide.mjs and npm run what-uses.

Build only from the system
- Compose from the real 2one components, tokens and templates — never hand-roll a parallel component or style. If the library has no primitive for something, say so instead of inventing one.
- Colour: grayscale foundation + one brand accent (--brand, #30A1FF) for emphasis only (links, focus, selection). danger/success only for validation state and data-trend deltas, always paired with an icon/arrow. Charts use the --chart-1..5 categorical palette. Never introduce another hue.
- Icons: lucide only. Buttons are pills; one primary action per view.
- Never convey state or a trend by colour alone — pair it with an icon or text.

Accessibility
Meet the 2one accessibility bar: WCAG AA + the APCA thresholds the repo audits, in light and dark. Non-negotiable — it outranks brand and aesthetics.

Accuracy
Answer and decide only from what is actually in the repo, and cite the file. If a token, component or rule is not there, say so; never guess.

After generating
Run  npx 2one check <path>  and fix everything it reports (it exits non-zero on a violation). The final result must read as 2one — voice, tone, and visual identity.`} />
                </CardContent>
              </Card>

              <Card className="mt-4 min-w-0">
                <CardHeader>
                  <CardTitle className="text-base">{t('overview.use.example.title')}</CardTitle>
                  <CardDescription>{t('overview.use.example.desc')}</CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                  <CodeBlock code={`Prompt for Building with the 2one Design Library

I want to build a videoconferencing application for users to connect with each other for networking and business meetings.

Core features / workflows:
1. Should have all the features of a standard video conferencing application
2. Should be accessible for older adults
3. Should be user friendly

Design system — read it first
Use the 2one Design Library: https://github.com/yokesh-2one/2one-design-library
Read manifest.json FIRST — it is the machine-readable index and the instructions_for_ai contract. Then, before building, summarise:
- the components, tokens and brand foundations that exist
- the templates relevant to this build (blocks, charts, page patterns, and Components for AI Interface if this is an assistant UI)
Use the knowledge graph for decisions (which component fits an intent, what a change touches): node scripts/graph-decide.mjs and npm run what-uses.

Build only from the system
- Compose from the real 2one components, tokens and templates — never hand-roll a parallel component or style. If the library has no primitive for something, say so instead of inventing one.
- Colour: grayscale foundation + one brand accent (--brand, #30A1FF) for emphasis only (links, focus, selection). danger/success only for validation state and data-trend deltas, always paired with an icon/arrow. Charts use the --chart-1..5 categorical palette. Never introduce another hue.
- Icons: lucide only. Buttons are pills; one primary action per view.
- Never convey state or a trend by colour alone — pair it with an icon or text.

Accessibility
Meet the 2one accessibility bar: WCAG AA + the APCA thresholds the repo audits, in light and dark. Non-negotiable — it outranks brand and aesthetics.

Accuracy
Answer and decide only from what is actually in the repo, and cite the file. If a token, component or rule is not there, say so; never guess.

After generating
Run  npx 2one check <path>  and fix everything it reports (it exits non-zero on a violation). The final result must read as 2one — voice, tone, and visual identity.`} />
                </CardContent>
              </Card>

              <Card className="mt-4 min-w-0">
                <CardHeader>
                  <CardTitle className="text-base">{t('overview.use.runLocally.title')}</CardTitle>
                  <CardDescription>{t('overview.use.runLocally.desc')}</CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                  <CopyButton text={'npm install\nnpm run dev'} label={t('overview.use.runLocally.copy')} />
                </CardContent>
              </Card>
            </section>

            {/* FAQ */}
            <section id="faq" className="g-section">
              <div className="g-eyebrow">{t('overview.faq.eyebrow')}</div><h2>{t('overview.faq.title')}</h2>
              <p className="g-lede">{t('overview.faq.lede')}</p>
              <Accordion type="single" collapsible className="mt-6 w-full max-w-3xl">
                {FAQ_IDS.map((id, i) => (
                  <AccordionItem key={id} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-base">{t(`overview.faq.items.${id}.q`)}</AccordionTrigger>
                    <AccordionContent className="max-w-[68ch] text-muted-foreground">{t(`overview.faq.items.${id}.a`)}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* SUPPORT */}
            <section id="support" className="g-section">
              <div className="g-eyebrow">{t('overview.support.eyebrow')}</div><h2>{t('overview.support.title')}</h2>
              <p className="g-lede">{t('overview.support.lede')}</p>
              <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden><Mail /></div>
                    <CardTitle className="pt-2 text-base">{t('overview.support.questions.title')}</CardTitle>
                    <CardDescription>{t('overview.support.questions.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild><a href="mailto:yokesh@2one.solutions">yokesh@2one.solutions <ArrowRight /></a></Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden><ExternalLink /></div>
                    <CardTitle className="pt-2 text-base">{t('overview.support.follow.title')}</CardTitle>
                    <CardDescription>{t('overview.support.follow.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline"><a href="https://www.linkedin.com/company/2onesolutions" target="_blank" rel="noreferrer">{t('overview.support.follow.cta')} <ArrowRight /></a></Button>
                  </CardContent>
                </Card>
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
