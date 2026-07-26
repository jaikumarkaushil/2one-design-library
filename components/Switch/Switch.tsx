/*
  Switch — Mobile App Design System (node 265:1895).

  Immediate on/off toggle. The Figma variant was named "state2" (flagged as lazy
  naming) — interpreted here as ON, with "default" = OFF. The Figma component
  carries no description; authored context: use for settings that take effect
  immediately (not for values submitted with a form — use Checkbox there).
*/
export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
  id?: string
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  id,
}: SwitchProps) {
  const swId = id ?? (label ? `sw-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)
  return (
    <label
      htmlFor={swId}
      className={`inline-flex items-center gap-2 ${disabled ? '' : 'cursor-pointer'} ${className}`}
    >
      <button
        id={swId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 ${checked ? 'bg-neutral-950' : 'bg-neutral-300'}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
      {label && (
        <span className={`text-sm leading-sm ${disabled ? 'text-neutral-300' : 'text-neutral-950'}`}>
          {label}
        </span>
      )}
    </label>
  )
}
