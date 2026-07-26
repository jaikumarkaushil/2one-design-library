/*
  Matches the Badges component (2one Solutions "Mobile App Design System"
  file, node 138:39): danger/600 fill, "text" for a count/short label
  (cap at "99+" per its documented rule), "notext" for a plain presence dot.
  Meant to be anchored to a parent element (avatar, icon, nav item), not
  used standalone — the wrapper is the caller's responsibility.
*/
export interface BadgeProps {
  type?: 'text' | 'notext'
  count?: number | string
  className?: string
}

export function Badge({ type = 'text', count, className = '' }: BadgeProps) {
  if (type === 'notext') {
    return <span className={`inline-block h-2 w-2 rounded-full bg-danger-600 ${className}`} />
  }

  const display = typeof count === 'number' && count > 99 ? '99+' : count

  return (
    <span
      className={`inline-flex min-w-[16px] items-center justify-center rounded-full bg-danger-600 px-1 text-xs leading-xs text-white ${className}`}
    >
      {display}
    </span>
  )
}
