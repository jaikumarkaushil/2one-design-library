import { useRef } from 'react'

/*
  OTP field — Mobile App Design System (node 210:204).

  A row of single-character boxes for entering a one-time passcode. Figma
  properties: State (Default / Active — active = the focused box). The Figma
  component carries no description; authored context: use for SMS/email
  verification codes (typically 4–6 digits), one character per box, auto-advance
  on entry and backspace to the previous box.
*/
export interface OtpFieldProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  isInvalid?: boolean
  disabled?: boolean
  className?: string
}

export function OtpField({
  length = 6,
  value = '',
  onChange,
  isInvalid = false,
  disabled = false,
  className = '',
}: OtpFieldProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const chars = value.split('').slice(0, length)

  const setChar = (i: number, ch: string) => {
    const next = value.split('')
    next[i] = ch.slice(-1)
    onChange?.(next.join('').slice(0, length))
    if (ch && i < length - 1) refs.current[i + 1]?.focus()
  }

  const border = isInvalid ? 'border-danger-600' : 'border-neutral-300 focus:border-neutral-950'
  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={chars[i] ?? ''}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !chars[i] && i > 0) refs.current[i - 1]?.focus()
          }}
          aria-invalid={isInvalid || undefined}
          aria-label={`Digit ${i + 1}`}
          className={`h-12 w-10 rounded-md border bg-neutral-50 text-center text-base text-neutral-950 outline-none disabled:opacity-40 ${border}`}
        />
      ))}
    </div>
  )
}
