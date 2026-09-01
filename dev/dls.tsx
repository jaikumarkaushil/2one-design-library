import { useEffect, useState } from 'react'
import {
  Sun, Moon, ArrowUp, ArrowDown,
  // Tier 1 — brand modules
  Target, Gem, Drama, Users, Crown, Tag,
  // Tier 2 — design foundation
  Palette, Type, Shapes, Brush, Camera, LayoutGrid, MessageSquareQuote, Images,
  // Tier 3 — output
  Monitor, Megaphone, FileText,
  // guiding principle
  UserRound, Bot,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation, Trans } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar, SidebarClose, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/logo'
import { TopNav } from './global-nav'
import { LanguageToggle } from './i18n/language-toggle'
import brand from '../brand/brand.json'

/* ---------------------------------------------------------
   Content — condensed from the DLS definitions doc. Three
   tiers: strategic intent → building blocks → shipped output.
   Copy lives in dev/i18n/{en,fr}.json (dls.*); this file wires
   icons + structure to those keys.
   --------------------------------------------------------- */

// [icon, key into dls.<tier>.modules.<key>]
const TIER1_MODULES: [React.ReactNode, string][] = [
  [<Target />, 'missionVision'],
  [<Gem />, 'values'],
  [<Drama />, 'personality'],
  [<Users />, 'audiences'],
  [<Crown />, 'archetype'],
  [<Tag />, 'tagline'],
]

const TIER2_FOUNDATIONS: [React.ReactNode, string][] = [
  [<Palette />, 'colours'],
  [<Type />, 'typography'],
  [<Shapes />, 'iconography'],
  [<Brush />, 'illustration'],
  [<Camera />, 'photography'],
  [<LayoutGrid />, 'graphics'],
  [<MessageSquareQuote />, 'voice'],
  [<Images />, 'moodboard'],
]

const TIER3_OUTPUTS: [React.ReactNode, string][] = [
  [<Monitor />, 'product'],
  [<Megaphone />, 'marketing'],
  [<FileText />, 'comms'],
]

// [tierKey into dls.tiers, colour var, rowKey into dls.glance.<rowKey>{Name,Desc}]
const ROWS: [string, string, string][] = [
  ['one', 'var(--tier-1)', 'row1'],
  ['two', 'var(--tier-2)', 'row2'],
  ['three', 'var(--tier-3)', 'row3'],
]

function ThemeToggle({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'
  return (
    <Button variant="outline" size="sm" className={className}
      aria-label={isDark ? t('common.switchToLight') : t('common.switchToDark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun /> : <Moon />}{isDark ? t('common.light') : t('common.dark')}
    </Button>
  )
}

/* The pyramid: strategic intent at the apex, shipped output at the base.
   Fills are the grayscale --tier-N tokens (dls.css), so it recolors with
   the theme. Labels sit inside each band in its own contrasting ink. */
function TierPyramid() {
  const { t } = useTranslation()
  return (
    <svg className="dls-pyramid" viewBox="0 0 480 320" role="img" aria-label={t('dls.pyramid.aria')}>
      {/* Tier 3 — base (widest) */}
      <polygon points="120.4,206 359.6,206 420,300 60,300" fill="var(--tier-3)" stroke="var(--border)" />
      <text x="240" y="252" textAnchor="middle" fill="var(--tier-3-ink)">
        <tspan className="t-tag" fontSize="10" fill="var(--muted-foreground)">{t('dls.pyramid.tier3Tag')}</tspan>
        <tspan className="t-title" x="240" dy="20" fontSize="16">{t('dls.pyramid.tier3Title')}</tspan>
      </text>
      {/* Tier 2 — middle */}
      <polygon points="180.2,113 299.8,113 355.7,200 124.3,200" fill="var(--tier-2)" />
      <text x="240" y="150" textAnchor="middle" fill="var(--tier-2-ink)">
        <tspan className="t-tag" fontSize="9" opacity="0.85">{t('dls.pyramid.tier2Tag')}</tspan>
        <tspan className="t-title" x="240" dy="18" fontSize="15">{t('dls.pyramid.tier2Title')}</tspan>
      </text>
      {/* Tier 1 — apex (narrowest) */}
      <polygon points="240,20 295.9,107 184.1,107" fill="var(--tier-1)" />
      <text x="240" y="72" textAnchor="middle" fill="var(--tier-1-ink)">
        <tspan className="t-tag" fontSize="8" opacity="0.75">{t('dls.pyramid.tier1Tag')}</tspan>
        <tspan className="t-title" x="240" dy="15" fontSize="14">{t('dls.pyramid.tier1Title')}</tspan>
      </text>
    </svg>
  )
}

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

export function Dls() {
  const { t } = useTranslation()
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

  const NAV: { grp: string; items: [string, string][] }[] = [
    { grp: t('dls.sidebar.onThisPage'), items: [['overview', t('dls.sidebar.overview')], ['glance', t('dls.sidebar.glance')], ['analogy', t('dls.sidebar.analogy')]] },
    { grp: t('dls.sidebar.threeTiers'), items: [['tier1', t('dls.sidebar.tier1')], ['tier2', t('dls.sidebar.tier2')], ['tier3', t('dls.sidebar.tier3')]] },
    { grp: t('dls.sidebar.more'), items: [['principle', t('dls.sidebar.principle')], ['inrepo', t('dls.sidebar.inrepo')]] },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Logo variant="black" width={52} className="dark:hidden" />
              <Logo variant="white" width={52} className="hidden dark:block" />
            </div>
            <SidebarClose />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {NAV.map((g, i) => (
            <SidebarGroup key={i}>
              {g.grp && <SidebarGroupLabel>{g.grp}</SidebarGroupLabel>}
              <SidebarMenu>
                {g.items.map(([id, label]) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton asChild isActive={active === id}>
                      <a href={id.startsWith('/') ? id : '#' + id}>{label}</a>
                    </SidebarMenuButton>
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
          <TopNav current="/dls.html" />
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-32 lg:px-10">

          {/* OVERVIEW / HERO */}
          <section id="overview" className="g-section g-hero">
            <div className="g-eyebrow">{t('dls.hero.eyebrow')}</div>
            <h1>{t('dls.hero.titleLead')} <span className="thin">{t('dls.hero.titleThin')}</span></h1>
            <p>
              <Trans i18nKey="dls.hero.body" components={{ b: <b className="text-foreground" />, em: <em /> }} />
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                [t('dls.hero.card1Tag'), t('dls.hero.card1Title'), t('dls.hero.card1Sub')],
                [t('dls.hero.card2Tag'), t('dls.hero.card2Title'), t('dls.hero.card2Sub')],
                [t('dls.hero.card3Tag'), t('dls.hero.card3Title'), t('dls.hero.card3Sub')],
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
            <div className="g-eyebrow">{t('dls.glance.eyebrow')}</div><h2>{t('dls.glance.title')}</h2>
            <p className="g-lede"><Trans i18nKey="dls.glance.lede" components={{ b: <b /> }} /></p>
            <div className="dls-glance">
              <div>
                <TierPyramid />
                <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><ArrowDown className="size-3.5" /> {t('dls.glance.cascades')}</span>
                  <span className="flex items-center gap-1.5"><ArrowUp className="size-3.5" /> {t('dls.glance.traces')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {ROWS.map(([tierKey, color, rowKey]) => (
                  <Card key={tierKey}>
                    <CardHeader className="flex-row items-stretch gap-3 space-y-0">
                      <span className="w-1.5 shrink-0 self-stretch rounded-full" style={{ background: color }} aria-hidden />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{t(`dls.tiers.${tierKey}`)}</span>
                          <CardTitle className="text-base">{t(`dls.glance.${rowKey}Name`)}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">{t(`dls.glance.${rowKey}Desc`)}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* ANALOGY */}
          <section id="analogy" className="g-section">
            <div className="g-eyebrow">{t('dls.analogy.eyebrow')}</div><h2>{t('dls.analogy.title')}</h2>
            <p className="g-lede"><Trans i18nKey="dls.analogy.lede" components={{ em: <em /> }} /></p>
            <div className="dls-grid three">
              {([['one', 'card1'], ['two', 'card2'], ['three', 'card3']] as const).map(([tierKey, cardKey]) => (
                <Card key={cardKey} className="gap-2">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit">{t(`dls.tiers.${tierKey}`)}</Badge>
                    <CardTitle className="text-base">{t(`dls.analogy.${cardKey}Title`)}</CardTitle>
                    <CardDescription><Trans i18nKey={`dls.analogy.${cardKey}Desc`} components={{ b: <b className="text-foreground" /> }} /></CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <Card className="mt-4">
              <CardContent className="flex items-start gap-3 pt-6 text-sm text-muted-foreground">
                <IconTile><FileText /></IconTile>
                <p className="m-0">
                  <Trans i18nKey="dls.analogy.construction" components={{ b: <b className="text-foreground" /> }} />
                </p>
              </CardContent>
            </Card>
          </section>

          {/* TIER 1 */}
          <section id="tier1" className="g-section">
            <div className="g-eyebrow flex items-center gap-2">
              <span className="inline-block size-3 rounded-full" style={{ background: 'var(--tier-1)' }} /> {t('dls.tier1.eyebrow')}
            </div>
            <h2>{t('dls.tier1.title')}</h2>
            <p className="g-lede"><Trans i18nKey="dls.tier1.lede" components={{ b: <b /> }} /></p>
            <div className="dls-grid">
              {TIER1_MODULES.map(([icon, key]) => (
                <ModuleCard key={key} icon={icon} title={t(`dls.tier1.modules.${key}.title`)} desc={t(`dls.tier1.modules.${key}.desc`)} />
              ))}
            </div>

            {/* The 2one brand, applied — the real Tier 1 assets, from brand/brand.json */}
            <Separator className="my-8" />
            <h3 className="text-lg font-semibold tracking-tight">{t('dls.tier1.appliedTitle')}</h3>
            <p className="g-lede"><Trans i18nKey="dls.tier1.appliedLede" components={{ mono: <span className="mono" /> }} /></p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">{t('dls.tier1.missionCard')}</CardTitle></CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('dls.tier1.mission')}</div><p className="mt-1 text-foreground">{brand.mission}</p></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('dls.tier1.vision')}</div><p className="mt-1 text-foreground">{brand.vision}</p></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('dls.tier1.tagline')}</div><p className="mt-1 text-foreground">{brand.tagline}</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">{t('dls.tier1.voiceCard')}</CardTitle><CardDescription>{t('dls.tier1.voiceCardDesc')}</CardDescription></CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('dls.tier1.voice')}</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.voice.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('dls.tier1.tone')}</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.tone.descriptors.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                  <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('dls.tier1.personality')}</div><div className="mt-1.5 flex flex-wrap gap-1.5">{brand.personality.map((d) => <Badge key={d} variant="outline">{d}</Badge>)}<Badge variant="outline">{t('dls.tier1.archetype', { name: brand.archetype.name })}</Badge></div></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">{t('dls.tier1.whoFor')}</CardTitle><CardDescription>{t('dls.tier1.whoForDesc')}</CardDescription></CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    {brand.personas.map((p) => (
                      <li key={p.id} className="flex items-start gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden /><span>{p.label}</span></li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">{t('dls.tier1.logo')}</CardTitle><CardDescription>{t('dls.tier1.logoDesc')}</CardDescription></CardHeader>
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
              <span className="inline-block size-3 rounded-full" style={{ background: 'var(--tier-2)' }} /> {t('dls.tier2.eyebrow')}
            </div>
            <h2>{t('dls.tier2.title')}</h2>
            <p className="g-lede">{t('dls.tier2.lede')}</p>
            <div className="dls-grid two">
              {TIER2_FOUNDATIONS.map(([icon, key]) => (
                <ModuleCard key={key} icon={icon} title={t(`dls.tier2.modules.${key}.title`)} desc={t(`dls.tier2.modules.${key}.desc`)} subs={t(`dls.tier2.modules.${key}.subs`, { returnObjects: true }) as string[]} />
              ))}
            </div>
          </section>

          {/* TIER 3 */}
          <section id="tier3" className="g-section">
            <div className="g-eyebrow flex items-center gap-2">
              <span className="inline-block size-3 rounded-full border" style={{ background: 'var(--tier-3)' }} /> {t('dls.tier3.eyebrow')}
            </div>
            <h2>{t('dls.tier3.title')}</h2>
            <p className="g-lede">{t('dls.tier3.lede')}</p>
            <div className="dls-grid three">
              {TIER3_OUTPUTS.map(([icon, key]) => (
                <ModuleCard key={key} icon={icon} title={t(`dls.tier3.modules.${key}.title`)} desc={t(`dls.tier3.modules.${key}.desc`)} subs={t(`dls.tier3.modules.${key}.subs`, { returnObjects: true }) as string[]} />
              ))}
            </div>
          </section>

          {/* GUIDING PRINCIPLE */}
          <section id="principle" className="g-section">
            <div className="g-eyebrow">{t('dls.principle.eyebrow')}</div><h2>{t('dls.principle.title')}</h2>
            <p className="g-lede">{t('dls.principle.lede')}</p>
            <div className="dls-grid two">
              <Card>
                <CardHeader>
                  <IconTile><UserRound /></IconTile>
                  <CardTitle className="text-base">{t('dls.principle.humanTitle')}</CardTitle>
                  <CardDescription>{t('dls.principle.humanDesc')}</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <IconTile><Bot /></IconTile>
                  <CardTitle className="text-base">{t('dls.principle.aiTitle')}</CardTitle>
                  <CardDescription>{t('dls.principle.aiDesc')}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* WHERE IT LIVES IN THIS REPO */}
          <section id="inrepo" className="g-section">
            <div className="g-eyebrow">{t('dls.inrepo.eyebrow')}</div><h2>{t('dls.inrepo.title')}</h2>
            <p className="g-lede"><Trans i18nKey="dls.inrepo.lede" components={{ mono: <span className="mono" /> }} /></p>
            <div className="dls-map">
              <div className="dls-map-row">
                <div className="k">{t('dls.inrepo.tier1Key')}</div>
                <div className="v">
                  <p><Trans i18nKey="dls.inrepo.tier1Desc" components={{ code: <code /> }} /></p>
                  <div className="flex flex-wrap gap-2">{['brand/brand.json', 'brand/BRAND.md', 'brand/logo'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
              <div className="dls-map-row">
                <div className="k">{t('dls.inrepo.tier2Key')}</div>
                <div className="v">
                  <p><Trans i18nKey="dls.inrepo.tier2Desc" components={{ code: <code /> }} /></p>
                  <div className="flex flex-wrap gap-2">{['tokens/colors.json', 'tokens/typography.json', 'tokens/spacing.json', 'src/components/ui'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
              <div className="dls-map-row">
                <div className="k">{t('dls.inrepo.tier3Key')}</div>
                <div className="v">
                  <p><Trans i18nKey="dls.inrepo.tier3Desc" components={{ code: <code /> }} /></p>
                  <div className="flex flex-wrap gap-2">{['src/blocks', 'recipes/build-an-app.md', 'recipes/build-a-website.md'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
              <div className="dls-map-row">
                <div className="k">{t('dls.inrepo.aiKey')}</div>
                <div className="v">
                  <p>{t('dls.inrepo.aiDesc')}</p>
                  <div className="flex flex-wrap gap-2">{['manifest.json', 'registry.json', 'graph.json'].map((s) => <Badge key={s} variant="outline" className="font-mono font-normal">{s}</Badge>)}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm"><a href="/">{t('dls.inrepo.backToCatalog')}</a></Button>
              <Button asChild variant="outline" size="sm"><a href="/graph.html">{t('dls.inrepo.openGraph')}</a></Button>
            </div>
          </section>


          <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">
            {t('common.footerDls')}
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
