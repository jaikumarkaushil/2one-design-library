import { useEffect, useMemo, useState } from 'react'
import { Sun, Moon, Plus, PencilLine, Wrench, Trash2, ShieldAlert, ArrowUpRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/logo'
import { TopNav } from './global-nav'
import { LanguageToggle } from './i18n/language-toggle'
// The single source of truth — the repo's own CHANGELOG.md, parsed at build time,
// so this page can never drift from the actual release notes.
import changelogRaw from '../CHANGELOG.md?raw'

const REPO_BLOB = 'https://github.com/yokesh-2one/2one-design-library/blob/main/'

type Group = { label: string; items: string[] }
type Release = { version: string; date?: string; slug: string; unreleased: boolean; groups: Group[] }

/* Parse the Keep-a-Changelog markdown: ## [version] - date → ### Group → - item. */
function parse(md: string): Release[] {
  const releases: Release[] = []
  let cur: Release | null = null
  let grp: Group | null = null
  for (const raw of md.split('\n')) {
    const rel = /^##\s+\[([^\]]+)\](?:\s*-\s*(.+))?/.exec(raw)
    if (rel) {
      const version = rel[1]
      cur = {
        version,
        date: rel[2]?.trim(),
        slug: 'v-' + version.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        unreleased: /unreleased/i.test(version),
        groups: [],
      }
      releases.push(cur)
      grp = null
      continue
    }
    const g = /^###\s+(.+)/.exec(raw)
    if (g && cur) { grp = { label: g[1].trim(), items: [] }; cur.groups.push(grp); continue }
    const it = /^-\s+(.+)/.exec(raw)
    if (it && grp) { grp.items.push(it[1]); continue }
    // a wrapped bullet continues on the next indented line
    if (/^\s{2,}\S/.test(raw) && grp && grp.items.length) grp.items[grp.items.length - 1] += ' ' + raw.trim()
  }
  return releases
}

const GROUP_ICON: Record<string, React.ReactNode> = {
  Added: <Plus className="size-3.5" />,
  Changed: <PencilLine className="size-3.5" />,
  Fixed: <Wrench className="size-3.5" />,
  Removed: <Trash2 className="size-3.5" />,
  Security: <ShieldAlert className="size-3.5" />,
  Deprecated: <ShieldAlert className="size-3.5" />,
}

/* Minimal inline markdown → JSX: **bold**, `code`, [text](url). Repo-relative
   links resolve to the file on GitHub. */
function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>)
    else if (m[2]) out.push(<code key={k++} className="mono">{m[2]}</code>)
    else {
      const href = m[4].startsWith('http') ? m[4] : REPO_BLOB + m[4]
      out.push(<a key={k++} className="underline underline-offset-2" href={href} target="_blank" rel="noreferrer">{m[3]}</a>)
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === 'dark'
  return (
    <Button variant="outline" size="sm"
      aria-label={isDark ? t('common.switchToLight') : t('common.switchToDark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun /> : <Moon />}{isDark ? t('common.light') : t('common.dark')}
    </Button>
  )
}

export function Changelog() {
  const { t } = useTranslation()
  const releases = useMemo(() => parse(changelogRaw), [])
  const [active, setActive] = useState(releases[0]?.slug ?? '')

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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <Logo variant="black" width={52} className="dark:hidden" />
            <Logo variant="white" width={52} className="hidden dark:block" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('changelog.releases')}</SidebarGroupLabel>
            <SidebarMenu>
              {releases.map((r) => (
                <SidebarMenuItem key={r.slug}>
                  <SidebarMenuButton asChild isActive={active === r.slug}>
                    <a href={'#' + r.slug}>{r.unreleased ? t('changelog.unreleased') : r.version}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-1 !h-5" />
          <TopNav current="/changelog.html" />
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="mx-auto w-full min-w-0 max-w-3xl px-6 pb-32 lg:px-10">
          <section className="g-section g-hero">
            <div className="g-eyebrow">{t('changelog.eyebrow')}</div>
            <h1>{t('changelog.title')}</h1>
            <p className="g-lede">{t('changelog.lede')}</p>
          </section>

          {releases.map((r) => (
            <section key={r.slug} id={r.slug} className="g-section">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="!mb-0">{r.unreleased ? t('changelog.unreleased') : r.version}</h2>
                {r.unreleased
                  ? <Badge variant="secondary">{t('changelog.inProgress')}</Badge>
                  : r.date && <span className="text-sm tabular-nums text-muted-foreground">{r.date}</span>}
              </div>
              <div className="mt-5 flex flex-col gap-6">
                {r.groups.map((g, gi) => (
                  <div key={gi}>
                    <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="flex size-6 items-center justify-center rounded-md border bg-muted text-foreground" aria-hidden>
                        {GROUP_ICON[g.label] ?? <Plus className="size-3.5" />}
                      </span>
                      {g.label}
                    </div>
                    <ul className="flex flex-col gap-2.5 text-sm leading-relaxed">
                      {g.items.map((item, ii) => (
                        <li key={ii} className="flex gap-2.5">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-border" aria-hidden />
                          <span className="min-w-0 text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">{inline(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">
            {t('changelog.footer')}{' '}
            <a className="underline underline-offset-2" href={REPO_BLOB + 'CHANGELOG.md'} target="_blank" rel="noreferrer">
              CHANGELOG.md <ArrowUpRight className="inline size-3.5 align-text-bottom" />
            </a>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
