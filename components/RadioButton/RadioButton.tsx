import type { InputHTMLAttributes } from 'react'

/*
  Radio button — Mobile App Design System (node 250:1224).

  Figma context (verbatim):
  "Single-select control for choosing one option from a mutually exclusive group.
   Only one radio in a group can be isSelected=true at a time — selecting one
   deselects any other in the same group. Not for independent multi-select (use
   Checkbox) or immediate on/off action (use Switch). RULES: DON'T combine
   isInvalid=true with state=disabled. Selecting one radio in a group must set
   isSelected=false on all others — the containing group enforces this, not this
   component. isInvalid alone does not carry the error message — pair with inline
   error text at the group level."

  Properties: state (default/pressed/disabled), isSelected (native checked),
  isInvalid. Use a shared `name` to form a group.
*/
export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  isInvalid?: boolean
}

export function RadioButton({
  label,
  isInvalid = false,
  disabled = false,
  className = '',
  id,
  ...props
}: RadioButtonProps) {
  const border = isInvalid ? 'border-danger-600' : 'border-neutral-400'
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 ${disabled ? '' : 'cursor-pointer'} ${className}`}
    >
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input
          id={id}
          type="radio"
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          className={`peer h-4 w-4 appearance-none rounded-full border bg-neutral-50 checked:border-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600 disabled:opacity-40 ${border}`}
          {...props}
        />
        <span className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950 peer-checked:block" />
      </span>
      {label && (
        <span className={`text-sm leading-sm ${disabled ? 'text-neutral-300' : 'text-neutral-950'}`}>
          {label}
        </span>
      )}
    </label>
  )
}
