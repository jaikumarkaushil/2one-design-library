import type { ReactNode } from 'react'

/*
  Matches the App bar component (2one Solutions "Mobile App Design System"
  file, node 160:417): fixed 64px height, back icon (leading-only per the
  component's own "Do" rules), centered Heading 6 title, single trailing
  slot (its docs explicitly say never more than one trailing action).

  The back button renders only when an onBack handler is supplied — a top-
  level screen with no parent to return to should show no back affordance
  at all, rather than a dead button that does nothing when clicked.
*/
export interface AppBarProps {
  title: string
  onBack?: () => void
  trailingSlot?: ReactNode
  className?: string
}

function LeftArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3 4 8l6 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AppBar({ title, onBack, trailingSlot, className = '' }: AppBarProps) {
  return (
    <div
      className={`flex h-16 w-full items-center justify-between border-b border-border px-5 ${className}`}
    >
      <div className="flex w-8 items-center">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="flex items-center justify-center rounded-lg p-2 text-neutral-950 hover:bg-neutral-100"
          >
            <LeftArrowIcon />
          </button>
        )}
      </div>
      <p className="font-heading text-h6 font-bold leading-h6 text-neutral-950">{title}</p>
      <div className="flex w-8 items-center justify-end">{trailingSlot}</div>
    </div>
  )
}
