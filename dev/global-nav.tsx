/*
  The ONE global navigation, shared by every page so the product's top-level
  menu is identical everywhere (Overview · Components · Components for AI
  Interface · Knowledge graph · What is a DLS?). Each page renders
  <GlobalNav current="…" /> as the first group in its sidebar, then its own
  in-page section anchors below.
*/
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export const GLOBAL_NAV: [string, string][] = [
  ['/', 'Overview'],
  ['/components.html', 'Components'],
  ['/ai-components.html', 'Components for AI Interface'],
  ['/graph.html', 'Knowledge graph'],
  ['/dls.html', 'What is a DLS?'],
]

export function GlobalNav({ current }: { current: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>2one DLS</SidebarGroupLabel>
      <SidebarMenu>
        {GLOBAL_NAV.map(([href, label]) => (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton asChild isActive={current === href}>
              <a href={href}>{label}</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
