import type { ReactNode } from 'react'

/*
  Dropdown — Mobile App Design System (node 230:631). This is the TRIGGER field
  only; the options panel is a separate component (per the Figma spec).

  Figma context (verbatim):
  "Single-select form field that opens a panel of options (bottom sheet or native
   picker on mobile — panel is a separate component, not part of this trigger
   field). Use for choosing one value from a predefined list. Not for
   typeable/filterable lists (use Search Field) or multiple selections (use
   Multiselect Field). FIXED ELEMENT (not a variant): trailing chevron icon —
   always present, signals the field opens a panel. Points down when closed, up
   when open. RULES: DON'T combine isInvalid=true with state=disabled. DON'T
   combine state=active with state=disabled. isInvalid alone does not carry the
   error message — pair with helper text."

  Properties: state (default/active/disabled/filled), isInvalid, hasLabel,
  hasHelperText, hasLeadingIcon.
*/
export interface DropdownProps {
  label?: string
  placeholder?: string
  /** The chosen value; when set the field renders as "filled". */
  value?: string
  leadingIcon?: ReactNode
  helperText?: string
  isInvalid?: boolean
  disabled?: boolean
  /** Panel open state (the "active" state) — rotates the chevron up. */
  open?: boolean
  onClick?: () => void
  className?: string
  id?: string
}

export function Dropdown({
  label,
  placeholder = 'Select',
  value,
  leadingIcon,
  helperText,
  isInvalid = false,
  disabled = false,
  open = false,
  onClick,
  className = '',
  id,
}: DropdownProps) {
  const border = isInvalid
    ? 'border-danger-600'
    : open
      ? 'border-neutral-950'
      : 'border-neutral-200'
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm leading-sm ${disabled ? 'text-neutral-300' : 'text-neutral-800'}`}
        >
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={isInvalid || undefined}
        className={`flex h-10 items-center gap-2 rounded-md border bg-neutral-50 px-3 text-left disabled:opacity-40 ${border}`}
      >
        {leadingIcon && <span className="shrink-0 text-neutral-600">{leadingIcon}</span>}
        <span
          className={`flex-1 truncate text-sm leading-sm ${value ? 'text-neutral-950' : 'text-neutral-600'}`}
        >
          {value ?? placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {helperText && (
        <p className={`text-xs leading-xs ${isInvalid ? 'text-danger-600' : 'text-neutral-600'}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}
