/*
  The ONE global navigation, shown as a horizontal menu in the TOP HEADER of
  every page (matching the Knowledge-graph page). The sidebar is then scoped to
  the current page's own sections — e.g. Overview's sidebar shows only its
  in-page anchors, Components' shows the component tiers.

  Top-level destinations are flat links; educational + support links live under
  a "Help" menu (What is a DLS?, FAQ, Support). Labels are keyed into i18n so
  the menu is bilingual like the rest of the showcase; the hrefs stay fixed.
*/
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const GLOBAL_NAV: [string, string][] = [
  ['/', 'nav.overview'],
  ['/components.html', 'nav.components'],
  ['/graph.html', 'nav.graph'],
]

// Grouped under the Help menu. FAQ/Support are sections on the Overview page,
// so `/#faq` and `/#support` load Overview and scroll there from any page.
export const HELP_NAV: [string, string][] = [
  ['/dls.html', 'nav.dls'],
  ['/#faq', 'overview.sidebar.faq'],
  ['/#support', 'overview.sidebar.support'],
]

const linkClass = (active: boolean) =>
  'whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ' +
  (active
    ? 'bg-accent font-medium text-foreground'
    : 'text-muted-foreground hover:bg-accent hover:text-foreground')

export function TopNav({ current }: { current: string }) {
  const { t } = useTranslation()
  // What is a DLS? now lives under Help, so Help reads as the active section there.
  const helpActive = HELP_NAV.some(([href]) => href === current)
  return (
    <nav aria-label="Primary" className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
      {GLOBAL_NAV.map(([href, key]) => {
        const active = current === href
        return (
          <a
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={linkClass(active)}
          >
            {t(key)}
          </a>
        )
      })}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-current={helpActive ? 'page' : undefined}
          className={linkClass(helpActive) + ' inline-flex items-center gap-1'}
        >
          {t('common.help')}
          <ChevronDown className="size-3.5" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {HELP_NAV.map(([href, key]) => (
            <DropdownMenuItem key={href} asChild>
              <a href={href}>{t(key)}</a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
