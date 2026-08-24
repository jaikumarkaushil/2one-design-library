import { useEffect, useState } from 'react'
import {
  Sun, Moon, ArrowLeft, ArrowUp, ArrowDown,
  // Tier 1 — brand modules
  Target, Gem, Drama, Users, Crown, Tag,
  // Tier 2 — design foundation
  Palette, Type, Shapes, Brush, Camera, LayoutGrid, MessageSquareQuote, Images,
  // Tier 3 — output
  Monitor, Megaphone, FileText,
  // guiding principle
  UserRound, Bot,
  // theming playground
  Check, CircleAlert,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/logo'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import brand from '../brand/brand.json'

/* ---------------------------------------------------------
   Content — condensed from the DLS definitions doc. Three
   tiers: strategic intent → building blocks → shipped output.
   Written in a professional, client-facing register for
   stakeholders who do not work in design day to day.
   --------------------------------------------------------- */

const NAV = [
  { grp: '', items: [['overview', 'What is a DLS?'], ['glance', 'The three tiers'], ['analogy', 'A working analogy']] },
  { grp: 'The three tiers', items: [['tier1', 'Tier 1 · Brand'], ['tier2', 'Tier 2 · Foundation'], ['tier3', 'Tier 3 · Output']] },
  { grp: 'More', items: [['principle', 'The guiding principle'], ['inrepo', 'Where it lives here'], ['theming', 'Theming playground']] },
  { grp: 'Explore', items: [['/', 'Catalog']] as [string, string][], },
] as { grp: string; items: [string, string][] }[]

// wire up the second Explore link separately (two external links)
const EXPLORE_LINKS: [string, string][] = [['/', 'Component catalog'], ['/graph.html', 'Knowledge graph']]

const TIER1_MODULES: [React.ReactNode, string, string][] = [
  [<Target />, 'Mission & Vision', 'The brand’s purpose today and its long-term aspiration — the reference point for every downstream decision.'],
  [<Gem />, 'Values', 'The core principles that guide how the brand behaves and makes decisions.'],
  [<Drama />, 'Personality', 'The brand’s human character — for example bold, precise, or approachable — which informs tone and visuals.'],
  [<Users />, 'Audiences & Personas', 'The defined segments the brand designs for, including their needs, behaviours, and context.'],
  [<Crown />, 'Archetype', 'The brand’s narrative role — Hero, Sage, Creator, and so on — used to keep its character consistent.'],
  [<Tag />, 'Tagline', 'A short, memorable line that captures the brand’s promise.'],
]

const TIER2_FOUNDATIONS: [React.ReactNode, string, string, string[]][] = [
  [<Palette />, 'Colours', 'The full colour system and the rules for using it — including accessibility.',
    ['Brand palette', 'Gradients', 'Neutral ramp', 'Semantic (success / error)', 'Contrast pairs', 'Usage do’s & don’ts']],
  [<Type />, 'Typography', 'The type system — hierarchy, legibility and the voice of text.',
    ['Brand typefaces', 'System fallbacks', 'Type scale (Display → Caption)', 'Weights & styles', 'Line-height & spacing', 'Script support']],
  [<Shapes />, 'Iconography', 'A consistent icon system across product and marketing.',
    ['Icon style', 'Base grid (e.g. 24×24)', 'Stroke weight', 'Categories', 'Size scale', 'Animated variants']],
  [<Brush />, 'Illustration', 'Rules for custom illustrated artwork.',
    ['Style guide', 'Illustration palette', 'People & inclusivity', 'Composition rules', 'Use-case library']],
  [<Camera />, 'Photography', 'Rules for real (non-illustrated) imagery.',
    ['Mood & style', 'Colour grading', 'Image treatment', 'Stock vs. custom']],
  [<LayoutGrid />, 'Graphics & Patterns', 'Supporting textures and decorative systems.',
    ['Background patterns', 'Data-viz style', 'Iconographic patterns', 'Surface effects']],
  [<MessageSquareQuote />, 'Voice & Tone', 'How the brand sounds — the language equivalent of the visuals.',
    ['Voice principles', 'Tone by context', 'Vocabulary do’s & don’ts', 'Writing examples', 'Localisation']],
  [<Images />, 'Moodboard', 'Reference material that anchors abstract style in concrete examples.',
    ['Inspiration boards', 'Aspirational references', 'Look-and-feel keywords', 'Texture & lighting refs']],
]

const TIER3_OUTPUTS: [React.ReactNode, string, string, string[]][] = [
  [<Monitor />, 'Product & Software', 'Digital interfaces where the system becomes functional UI.',
    ['Website', 'Web app / dashboards', 'Mobile app', 'Wearables', 'AR / VR']],
  [<Megaphone />, 'Marketing', 'Outward-facing materials for growth and engagement.',
    ['Social media', 'Motion / video', 'Ad formats', 'Pitch & sales decks']],
  [<FileText />, 'Comms & Internal', 'Internal and business-facing communication.',
    ['Internal decks', 'Reports & analytics', 'Stationery', 'Letterhead & signatures']],
]

function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'
  return (
    <Button variant="outline" size="sm" className={className}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun /> : <Moon />}{isDark ? 'Light' : 'Dark'}
    </Button>
  )
}

/* The pyramid: strategic intent at the apex, shipped output at the base.
   Fills are the grayscale --tier-N tokens (dls.css), so it recolors with
   the theme. Labels sit inside each band in its own contrasting ink. */
function TierPyramid() {
  return (
    <svg className="dls-pyramid" viewBox="0 0 480 320" role="img"
      aria-label="A three-tier pyramid: Tier 1 Brand at the top, Tier 2 Design Foundation in the middle, Tier 3 Design System at the base.">
      {/* Tier 3 — base (widest) */}
      <polygon points="120.4,206 359.6,206 420,300 60,300" fill="var(--tier-3)" stroke="var(--border)" />
      <text x="240" y="252" textAnchor="middle" fill="var(--tier-3-ink)">
        <tspan className="t-tag" fontSize="10" fill="var(--muted-foreground)">TIER 3 · WHERE</tspan>
        <tspan className="t-title" x="240" dy="20" fontSize="16">Design System</tspan>
      </text>
      {/* Tier 2 — middle */}
      <polygon points="180.2,113 299.8,113 355.7,200 124.3,200" fill="var(--tier-2)" />
      <text x="240" y="150" textAnchor="middle" fill="var(--tier-2-ink)">
        <tspan className="t-tag" fontSize="9" opacity="0.85">TIER 2 · WHAT</tspan>
        <tspan className="t-title" x="240" dy="18" fontSize="15">Design Foundation</tspan>
      </text>
      {/* Tier 1 — apex (narrowest) */}
      <polygon points="240,20 295.9,107 184.1,107" fill="var(--tier-1)" />
      <text x="240" y="72" textAnchor="middle" fill="var(--tier-1-ink)">
        <tspan className="t-tag" fontSize="8" opacity="0.75">TIER 1</tspan>
        <tspan className="t-title" x="240" dy="15" fontSize="14">Brand</tspan>
      </text>
    </svg>
  )
}

const ROWS: [string, string, string, string][] = [
  ['Tier 1', 'Brand foundation', 'var(--tier-1)', 'Defines why the brand exists and who it serves. This tier is pure strategy and contains no visual rules; everything below must trace back to it.'],
  ['Tier 2', 'Design foundation', 'var(--tier-2)', 'The reusable building blocks — colour, typography, iconography, and voice. This is the brand’s vocabulary; no element here is a finished deliverable.'],
  ['Tier 3', 'Design system', 'var(--tier-3)', 'The building blocks assembled into finished, shippable work — applications, websites, decks, and campaigns. This is what customers ultimately see.'],
]

// Icon tile — the library pattern (size-10, bordered, muted ground, size-5 icon),
// not a bespoke class, so it matches the feature cards across the app.
function IconTile({ children }: { children: React.ReactNode }) {
  return <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-foreground [&_svg]:size-5" aria-hidden>{children}</div>
}

function ModuleCard({ icon, title, desc, subs }: { icon: React.ReactNode; title: string; desc: string; subs?: string[] }) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <IconTile>{icon}</IconTile>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      {subs && (
        <CardContent>
          <div className="flex flex-wrap gap-2">{subs.map((s) => <Badge key={s} variant="outline" className="font-normal">{s}</Badge>)}</div>
        </CardContent>
      )}
    </Card>
  )
}

/* ---------- Theming playground: APCA ported from scripts/apca-audit.mjs ---------- */
function sRGBtoY(hex: string) {
  const h = hex.replace('#', ''); const R = parseInt(h.slice(0, 2), 16), G = parseInt(h.slice(2, 4), 16), B = parseInt(h.slice(4, 6), 16)
  const f = (v: number) => Math.pow(v / 255, 2.4); return 0.2126729 * f(R) + 0.7151522 * f(G) + 0.0721750 * f(B)
}
function apca(txt: string, bg: string) {
  let t = sRGBtoY(txt), b = sRGBtoY(bg)
  const bT = 0.022, bC = 1.414, dY = 0.0005, s = 1.14, lB = 0.027, lW = 0.027, lC = 0.1, nBG = 0.56, nT = 0.57, rT = 0.62, rB = 0.65
  t = t > bT ? t : t + Math.pow(bT - t, bC); b = b > bT ? b : b + Math.pow(bT - b, bC)
  if (Math.abs(b - t) < dY) return 0
  let C: number
  if (b > t) { const S = (Math.pow(b, nBG) - Math.pow(t, nT)) * s; C = S < lC ? 0 : S - lB }
  else { const S = (Math.pow(b, rB) - Math.pow(t, rT)) * s; C = S > -lC ? 0 : S + lW }
  return Math.round(C * 1000) / 10
}
const bestFg = (bg: string) => (Math.abs(apca('#ffffff', bg)) >= Math.abs(apca('#09090b', bg)) ? '#ffffff' : '#09090b')
const PRESETS = ['#09090b', '#0057ff', '#15803d', '#7c3aed', '#db2777', '#ea580c']
const THEME_VARS = ['--primary', '--primary-foreground', '--sidebar-primary', '--sidebar-primary-foreground', '--ring']

function ThemingPlayground() {
  const [color, setColor] = useState('#09090b')
  useEffect(() => {
    const cur = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    if (/^#[0-9a-f]{6}$/i.test(cur)) setColor(cur)
  }, [])
  const apply = (c: string) => {
    setColor(c)
    const f = bestFg(c), r = document.documentElement.style
    r.setProperty('--primary', c); r.setProperty('--primary-foreground', f)
    r.setProperty('--sidebar-primary', c); r.setProperty('--sidebar-primary-foreground', f); r.setProperty('--ring', c)
  }
  const reset = () => {
    const r = document.documentElement.style
    THEME_VARS.forEach((p) => r.removeProperty(p))
    setColor(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#09090b')
  }
  const fg = bestFg(color)
  const lc = Math.abs(apca(fg, color))
  const pass = lc >= 75
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Brand colour</CardTitle>
        <CardDescription>Set <span className="mono">--primary</span> and the whole system recolors — buttons, links, focus, nav.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input type="color" aria-label="Pick brand colour" value={color} onChange={(e) => apply(e.target.value)}
            className="size-10 cursor-pointer rounded-md border bg-background p-0.5" />
          <span className="mono text-sm">{color}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS.map((p) => (
              <button key={p} aria-label={`Use ${p}`} onClick={() => apply(p)}
                className="size-6 rounded-full border" style={{ background: p }} />
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={reset} className="ml-auto">Reset</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {pass
            ? <Badge variant="secondary" className="gap-1.5"><Check className="size-3.5" /> APCA Lc {lc.toFixed(1)} · pass</Badge>
            : <Badge variant="destructive" className="gap-1.5"><CircleAlert className="size-3.5" /> APCA Lc {lc.toFixed(1)} · fail</Badge>}
          <span className="text-muted-foreground">{pass ? 'label clears the Lc 75 threshold for button text.' : 'label is unreadable on this colour — pick a darker/lighter hue.'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-md border p-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Badge>Badge</Badge>
          <a href="#theming" className="text-primary underline underline-offset-2 text-sm">A themed link</a>
          <Input placeholder="Focus me" className="w-40" />
        </div>
      </CardContent>
    </Card>
  )
}

export function Dls() {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll('.g-section[id]'))
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    secs.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur lg:px-6">
        <a href="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="2one — back to the dashboard">
          <Logo variant="black" width={48} className="dark:hidden" />
          <Logo variant="white" width={48} className="hidden dark:block" />
        </a>
        <Separator orientation="vertical" className="!h-5" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>What is a DLS?</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ThemeToggle className="ml-auto" />
      </header>

      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">

          {/* OVERVIEW / HERO */}
          <section id="overview" className="g-section g-hero">
            <div className="g-eyebrow">2one · design language system</div>
            <h1>The design language system, <span className="thin">explained.</span></h1>
            <p>
              A <b className="text-foreground">Design Language System (DLS)</b> is the complete set of rules, assets, and
              principles that define how a brand <em>looks</em>, <em>sounds</em>, and <em>behaves</em> across every surface —
              from a mission statement to a product icon. It is organised into three tiers that move from <b className="text-foreground">strategic
              intent</b> down to the <b className="text-foreground">finished work a customer sees</b>.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                ['Why & who', 'Tier 1 — Brand', 'Strategy and positioning.'],
                ['What', 'Tier 2 — Foundation', 'Reusable building blocks.'],
                ['Where', 'Tier 3 — Output', 'Shipped products and assets.'],
              ] as const).map(([tag, title, sub]) => (
                <Card key={title}>
                  <CardHeader>
                    <CardDescription className="font-mono text-[11px] uppercase tracking-widest">{tag}</CardDescription>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{sub}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* THE THREE TIERS — pyramid + rows */}
          <section id="glance" className="g-section">
            <div className="g-eyebrow">The model</div><h2>The three tiers, at a glance</h2>
            <p className="g-lede">The tiers can be read in either direction. Intent defined at the apex cascades <b>down</b> into everything the brand produces, and every finished asset at the base traces back <b>up</b> to the strategy that shaped it.</p>
            <div className="dls-glance">
              <div>
                <TierPyramid />
                <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><ArrowDown className="size-3.5" /> intent cascades down</span>
                  <span className="flex items-center gap-1.5"><ArrowUp className="size-3.5" /> output traces up</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {ROWS.map(([tier, name, color, desc]) => (
                  <Card key={tier}>
                    <CardHeader className="flex-row items-stretch gap-3 space-y-0">
                      <span className="w-1.5 shrink-0 self-stretch rounded-full" style={{ background: color }} aria-hidden />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{tier}</span>
                          <CardTitle className="text-base">{name}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">{desc}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* ANALOGY */}
          <section id="analogy" className="g-section">
            <div className="g-eyebrow">For non-design stakeholders</div><h2>A working analogy: language</h2>
            <p className="g-lede">The name is deliberate. A design <em>language</em> behaves much like a spoken one, and the three tiers map directly onto its structure.</p>
            <div className="dls-grid three">
              <Card className="gap-2">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Tier 1</Badge>
                  <CardTitle className="text-base">The intent behind speaking</CardTitle>
                  <CardDescription>Who you are addressing and what you mean to convey. This is the <b className="text-foreground">brand</b>: mission, values, personality, and audience.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="gap-2">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Tier 2</Badge>
                  <CardTitle className="text-base">Vocabulary and grammar</CardTitle>
                  <CardDescription>The words and rules you assemble sentences from. This is the <b className="text-foreground">design foundation</b>: colour, typography, iconography, and tone of voice — reusable, never a finished sentence on their own.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="gap-2">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Tier 3</Badge>
                  <CardTitle className="text-base">The conversations themselves</CardTitle>
                  <CardDescription>The sentences you actually say. This is the <b className="text-foreground">design system in use</b>: the product screens, websites, campaigns, and decks that customers experience.</CardDescription>
                </CardHeader>
              </Card>
            </div>
            <Card className="mt-4">
              <CardContent className="flex items-start gap-3 pt-6 text-sm text-muted-foreground">
                <IconTile><FileText /></IconTile>
                <p className="m-0">
                  An alternative analogy is construction. <b className="text-foreground">Tier 1</b> is the project brief — what is being built and for whom;
                  <b className="text-foreground"> Tier 2</b> is the materials and the building code; and <b className="text-foreground">Tier 3</b> is the finished, occupied building.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* TIER 1 */}
          <section id="tier1" className="g-section">
            <div className="g-eyebrow flex items-center gap-2">
              <span className="inline-block size-3 rounded-full" style={{ background: 'var(--tier-1)' }} /> Tier 1 · the apex
            </div>
            <h2>Brand foundation — the “why” and “who”</h2>
            <p className="g-lede">The strategic core of the system. This tier contains <b>no visual rules</b>; it defines why the brand exists and who it serves. Every decision in the tiers below must trace back to it.</p>
            <div className="dls-grid">
              {TIER1_MODULES.map(([icon, title, desc]) => (
                <ModuleCard key={title} icon={icon} title={title} desc={desc} />
              ))}
            </div>

            {/* The 2one brand, applied — the real Tier 1 assets, from brand/brand.json */}
            <Separator className="my-8" />
            <h3 className="text-lg font-semibold tracking-tight">The 2one brand, applied</h3>
            <p className="g-lede">Tier 1 for 2one itself — pulled from <span className="mono">brand/brand.json</span>, the source every on-brand asset traces back to.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Mission · vision · tagline</CardTitle></CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Mission</div><p className="mt-1 text-foreground">{brand.mission}</p></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Vision</div><p className="mt-1 text-foreground">{brand.vision}</p></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Tagline</div><p className="mt-1 text-foreground">{brand.tagline}</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Voice · tone · personality</CardTitle><CardDescription>How the brand speaks — match this in any 2one-facing copy.</CardDescription></CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Voice</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.voice.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Tone</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.tone.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Personality</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.personality.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}<Badge variant="outline">Archetype: {brand.archetype.name}</Badge></div></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Who it’s for</CardTitle><CardDescription>The personas the mission serves.</CardDescription></CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    {brand.personas.map((p) => (
                      <li key={p.id} className="flex items-start gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden /><span>{p.label}</span></li>
                    ))}
                  </ul>
                </CardContent>
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

          {/* TIER 2 */}
          <section id="tier2" className="g-section">
            <div className="g-eyebrow flex items-center gap-2">
              <span className="inline-block size-3 rounded-full" style={{ background: 'var(--tier-2)' }} /> Tier 2 · the middle
            </div>
            <h2>Design foundation — the building blocks</h2>
            <p className="g-lede">The reusable building blocks and rules derived from Tier 1 — the brand’s vocabulary. No element in this tier is a finished deliverable; each is a rule or component that Tier 3 assembles into shipped work.</p>
            <div className="dls-grid two">
              {TIER2_FOUNDATIONS.map(([icon, title, desc, subs]) => (
                <ModuleCard key={title} icon={icon} title={title} desc={desc} subs={subs} />
              ))}
            </div>
          </section>

          {/* TIER 3 */}
          <section id="tier3" className="g-section">
            <div className="g-eyebrow flex items-center gap-2">
              <span className="inline-block size-3 rounded-full border" style={{ background: 'var(--tier-3)' }} /> Tier 3 · the base
            </div>
            <h2>Design system — the shipped output</h2>
            <p className="g-lede">The applied layer, where the Tier 2 foundations are assembled into finished, shippable deliverables — organised by where they are used.</p>
            <div className="dls-grid three">
              {TIER3_OUTPUTS.map(([icon, title, desc, subs]) => (
                <ModuleCard key={title} icon={icon} title={title} desc={desc} subs={subs} />
              ))}
            </div>
          </section>

          {/* GUIDING PRINCIPLE */}
          <section id="principle" className="g-section">
            <div className="g-eyebrow">The guiding principle</div><h2>Human-understandable and AI-legible</h2>
            <p className="g-lede">A well-built DLS is documented clearly enough for a person to apply by hand, and structured precisely enough for an AI system to parse and build from without ambiguity.</p>
            <div className="dls-grid two">
              <Card>
                <CardHeader>
                  <IconTile><UserRound /></IconTile>
                  <CardTitle className="text-base">A person can apply it</CardTitle>
                  <CardDescription>Every rule, token, and asset is documented in plain language, so a new team member can produce on-brand work without a designer present.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconTile><Bot /></IconTile>
                  <CardTitle className="text-base">An AI can build from it</CardTitle>
                  <CardDescription>Every element is labelled and structured, so an AI assistant can read the system and generate on-brand work directly — without inventing colours, fonts, or components.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* WHERE IT LIVES IN THIS REPO */}
          <section id="inrepo" className="g-section">
            <div className="g-eyebrow">Applied to this library</div><h2>Where each tier lives in this library</h2>
            <p className="g-lede"><span className="mono">@yokesh-2one/design-library</span> implements this three-tier model directly. Each tier maps to specific files in the repository.</p>
            <div className="dls-map">
              <div className="dls-map-row">
                <div className="k">Tier 1 · Brand</div>
                <div className="v">
                  <p>Brand strategy — mission, values, personality, and voice — is defined in <code>brand/brand.json</code> and <code>brand/BRAND.md</code>.</p>
                  <div className="flex flex-wrap gap-2">{['brand/brand.json', 'brand/BRAND.md', 'brand/logo'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
              <div className="dls-map-row">
                <div className="k">Tier 2 · Foundation</div>
                <div className="v">
                  <p>The building blocks — colour, typography, and spacing — are defined as tokens in <code>tokens/</code> and consumed by the components in <code>src/components/ui</code>.</p>
                  <div className="flex flex-wrap gap-2">{['tokens/colors.json', 'tokens/typography.json', 'tokens/spacing.json', 'src/components/ui'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
              <div className="dls-map-row">
                <div className="k">Tier 3 · Output</div>
                <div className="v">
                  <p>The assembled, shippable pieces — pre-composed blocks, charts, and AI build recipes — live in <code>src/blocks</code> and <code>recipes/</code>.</p>
                  <div className="flex flex-wrap gap-2">{['src/blocks', 'recipes/build-an-app.md', 'recipes/build-a-website.md'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
              <div className="dls-map-row">
                <div className="k">AI-legible layer</div>
                <div className="v">
                  <p>A machine-readable index ties the system together. An AI assistant reads these files first, then builds only from the system.</p>
                  <div className="flex flex-wrap gap-2">{['manifest.json', 'registry.json', 'graph.json'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm"><a href="/">← Back to the component catalog</a></Button>
              <Button asChild variant="outline" size="sm"><a href="/graph.html">Open the knowledge graph →</a></Button>
            </div>
          </section>

          {/* THEMING PLAYGROUND — one variable recolours the whole system, APCA-checked live */}
          <section id="theming" className="g-section">
            <div className="g-eyebrow">Live</div><h2>Theming playground</h2>
            <p className="g-lede">Grayscale is the default, but the system is built to carry a brand colour. Set one variable — <span className="mono">--primary</span> — and the whole system recolours at once, with the APCA contrast check running live so an unreadable button never ships. This is exactly the change an AI makes when you ask it to “use our colour”.</p>
            <div className="mt-6 max-w-2xl"><ThemingPlayground /></div>
          </section>

          <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">
            @yokesh-2one/design-library · design language system reference · light and audited dark.
          </footer>
        </div>
      </div>
  )
}
