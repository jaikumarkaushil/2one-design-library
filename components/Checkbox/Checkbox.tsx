import { useEffect, useRef } from 'react'
import type { InputHTMLAttributes } from 'react'

/*
  Checkbox — Mobile App Design System (node 202:130).

  Figma context (verbatim):
  "Binary or tri-state selection control. Use for multi-select lists,
   agreements/consent, and toggleable settings. Not a substitute for Radio
   (mutually exclusive single-select) or Switch (immediate on/off action).
   RULES: DO drive indeterminate programmatically from child checkbox selection.
   DON'T expose indeterminate as a state the user clicks into directly. DON'T
   combine isInvalid=true with state=disabled — a disabled checkbox has nothing
   to validate."

  Properties: state (default/pressed/disabled — live CSS), checkState
  (unchecked/checked/indeterminate), isInvalid.
*/
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  /** Tri-state dash. Drive programmatically from child selection, not user click. */
  indeterminate?: boolean
  isInvalid?: boolean
}

export function Checkbox({
  label,
  indeterminate = false,
  isInvalid = false,
  disabled = false,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])
  const inputId = id ?? (label ? `cb-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)
  const border = isInvalid ? 'border-danger-600' : 'border-neutral-400'
  const filled = indeterminate ? 'bg-neutral-950 border-neutral-950' : ''
  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2 ${disabled ? '' : 'cursor-pointer'} ${className}`}
    >
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          className={`peer h-4 w-4 appearance-none rounded-xs border bg-neutral-50 checked:border-neutral-950 checked:bg-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600 disabled:opacity-40 ${border} ${filled}`}
          {...props}
        />
        {!indeterminate && (
          <svg
            className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-white peer-checked:block"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 8.5l2.5 2.5L12 5.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && (
          <svg
            className="pointer-events-none absolute inset-0 h-4 w-4 text-white"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 8h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {label && (
        <span className={`text-sm leading-sm ${disabled ? 'text-neutral-300' : 'text-neutral-950'}`}>
          {label}
        </span>
      )}
    </label>
  )
}
