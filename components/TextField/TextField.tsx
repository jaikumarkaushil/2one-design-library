import type { InputHTMLAttributes, ReactNode } from 'react'

/*
  Text field — Mobile App Design System (node 167:44).

  Figma context (verbatim):
  "Single-line text entry field with label. Properties: Icon (none / leading-icon
   / trailing-icon), State (default / active / disabled), Feedback (default /
   invalid / message) — independently combinable, except: Don't set State=disabled
   together with Feedback=invalid. Do use leading-icon for input type context
   (search, email); trailing-icon for actions (clear, toggle visibility). Do use
   Feedback=message for persistent guidance; Feedback=invalid only after failed
   validation. Don't show message and invalid text at the same time — invalid
   replaces message, doesn't stack with it."

  State is native: active = focus, disabled = the disabled attr.
*/
export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  isInvalid?: boolean
  /** Helper text. Rendered in danger styling when isInvalid (invalid replaces helper). */
  message?: string
}

export function TextField({
  label,
  leadingIcon,
  trailingIcon,
  isInvalid = false,
  message,
  disabled = false,
  className = '',
  id,
  ...props
}: TextFieldProps) {
  const inputId = id ?? (label ? `tf-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)
  const border = isInvalid
    ? 'border-danger-600'
    : 'border-neutral-200 focus-within:border-neutral-950'
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm leading-sm ${disabled ? 'text-neutral-300' : 'text-neutral-800'}`}
        >
          {label}
        </label>
      )}
      <div
        className={`flex h-10 items-center gap-2 rounded-md border bg-neutral-50 px-3 ${border} ${disabled ? 'opacity-60' : ''}`}
      >
        {leadingIcon && <span className="shrink-0 text-neutral-600">{leadingIcon}</span>}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          className="w-full bg-transparent text-sm leading-sm text-neutral-800 outline-none placeholder:text-neutral-600 disabled:text-neutral-300 disabled:placeholder:text-neutral-300"
          {...props}
        />
        {trailingIcon && <span className="shrink-0 text-neutral-600">{trailingIcon}</span>}
      </div>
      {message && (
        <p className={`text-xs leading-xs ${isInvalid ? 'text-danger-600' : 'text-neutral-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
