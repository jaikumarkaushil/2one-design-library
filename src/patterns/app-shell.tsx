'use client'

import * as React from 'react'
import { Home, Search, Bell, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Logo } from '@/components/logo'
import { AppBar } from '@/components/app-bar'
import { BottomNavItem } from '@/components/bottom-nav-item'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar'

/*
  App shell — a PAGE PATTERN (Tier 3): the frame nearly every product needs, so a
  builder adapts the destinations + content rather than re-deciding the chrome.
  One responsive shell, two shapes:

    • Desktop (md+) — the library Sidebar (brand in its header, destinations as the
      menu) beside a SidebarInset whose header carries the collapse trigger + the
      current section, then the scrollable content.
    • Mobile — a branded AppBar on top (the wordmark's home in product chrome), the
      scrollable content, and a BottomNavItem row along the bottom.

  Standards it encodes: the brand is the Logo COMPONENT (never typeset), sized for
  chrome (46px); grayscale tokens only; lucide icons only; the selected destination
  is marked by aria-current + weight/background, never colour alone; NO primary
  Button in the chrome, so the app's own primary is never shadowed.

  Machine-readable spec: rules/patterns/app-shell.json and the graph node
  pattern:app-shell.
*/

export interface AppShellDestination {
  id: string
  label: string
  icon: React.ReactNode
}

const DEFAULT_DESTINATIONS: AppShellDestination[] = [
  { id: 'home', label: 'Home', icon: <Home /> },
  { id: 'search', label: 'Search', icon: <Search /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell /> },
  { id: 'profile', label: 'Profile', icon: <User /> },
]

export interface AppShellProps {
  /** App/brand name, shown as the accessible section title. */
  title?: string
  /** Left nav destinations. Defaults to a four-item social layout. */
  destinations?: AppShellDestination[]
  /** Controlled active destination id; falls back to internal state. */
  activeId?: string
  onNavigate?: (id: string) => void
  /** The current screen's content. */
  children?: React.ReactNode
}

export function AppShell({ title = 'Home', destinations = DEFAULT_DESTINATIONS, activeId, onNavigate, children }: AppShellProps) {
  const isMobile = useIsMobile()
  const [internal, setInternal] = React.useState(destinations[0]?.id ?? '')
  const active = activeId ?? internal
  const go = (id: string) => { setInternal(id); onNavigate?.(id) }
  const current = destinations.find((d) => d.id === active)?.label ?? title
  const brand = (
    <>
      <Logo variant="black" width={46} className="dark:hidden" />
      <Logo variant="white" width={46} className="hidden dark:block" />
    </>
  )

  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background">
        <AppBar title={current} brand={brand} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4">{children}</main>
        <nav aria-label="Primary" className="flex shrink-0 border-t bg-background">
          {destinations.map((d) => (
            <BottomNavItem
              key={d.id}
              icon={d.icon}
              label={d.label}
              selected={d.id === active}
              onClick={() => go(d.id)}
            />
          ))}
        </nav>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <a href="/" className="flex items-center rounded-md px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={title}>
            {brand}
          </a>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {destinations.map((d) => (
                <SidebarMenuItem key={d.id}>
                  <SidebarMenuButton isActive={d.id === active} onClick={() => go(d.id)}>
                    {d.icon}
                    <span>{d.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className={cn('min-w-0')}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="font-heading text-base font-bold text-foreground">{current}</span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
