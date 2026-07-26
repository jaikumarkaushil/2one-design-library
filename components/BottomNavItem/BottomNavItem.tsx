import type { ReactNode } from 'react'

/*
  Bottom nav item — Mobile App Design System (node 265:1453).

  Figma context (verbatim):
  "Single destination item within a bottom navigation. Represents one tab — icon
   + label — repeated multiple times in a row to form the full tab bar. This
   component is one item, not the full bar. Properties: state (default/pressed/
   selected). RULES: Only one item in a tab bar row should be state=selected at a
   time — this component does not enforce that; the containing tab bar does. Icon
   is swappable per instance."

  1:1 with Figma: this is the item. Compose several in a flex row to build the bar.
*/
export interface BottomNavItemProps {
  icon: ReactNode
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function BottomNavItem({
  icon,
  label,
  selected = false,
  onClick,
  className = '',
}: BottomNavItemProps) {
  const tone = selected ? 'text-neutral-950' : 'text-neutral-600'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'page' : undefined}
      className={`flex flex-1 flex-col items-center gap-1 px-2 py-2 active:bg-neutral-100 ${tone} ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      <span className="text-xs leading-xs">{label}</span>
    </button>
  )
}
