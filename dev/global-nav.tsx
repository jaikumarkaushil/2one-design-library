/*
  The ONE global navigation, shown as a horizontal menu in the TOP HEADER of
  every page (matching the Knowledge-graph page). The sidebar is then scoped to
  the current page's own sections — e.g. Overview's sidebar shows only its
  in-page anchors, Components' shows the component tiers.
*/
export const GLOBAL_NAV: [string, string][] = [
  ['/', 'Overview'],
  ['/components.html', 'Components'],
  ['/ai-components.html', 'Components for AI Interface'],
  ['/graph.html', 'Knowledge graph'],
  ['/dls.html', 'What is a DLS?'],
]

export function TopNav({ current }: { current: string }) {
  return (
    <nav aria-label="Primary" className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
      {GLOBAL_NAV.map(([href, label]) => {
        const active = current === href
        return (
          <a
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={
              'whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ' +
              (active
                ? 'bg-accent font-medium text-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground')
            }
          >
            {label}
          </a>
        )
      })}
    </nav>
  )
}
