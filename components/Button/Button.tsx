import type { ButtonHTMLAttributes, ReactNode } from 'react'

/*
  Button — Mobile App Design System, component set "Button" (node 152:36).

  Figma context (verbatim):
  "Primary: main action for the screen/section, use once per view. Highest visual
   weight. Secondary: alternate action, can pair with Primary, never the sole CTA
   if a Primary equivalent exists.
   Do: Use one Primary button per view/section.
   Do: Pair Secondary with Primary when offering a lesser alternative action.
   Don't: Use two Primary buttons in the same group.
   Don't: Use Secondary as the only CTA when a Primary equivalent exists.
   Don't: Combine leading and trailing icons on the same button."

  Properties (1:1 with Figma): appearance (primary | secondary),
  style (no icon | leading icon | trailing icon), state (default | pressed |
  disabled). Pill shape (radius-Full). State is the live CSS state, not a prop.
*/
type Appearance = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: Appearance
  /** A single icon. Per the Figma rules, never pass both leading and trailing. */
  icon?: ReactNode
  iconPosition?: 'leading' | 'trailing'
}

const appearanceClasses: Record<Appearance, string> = {
  primary:
    'bg-neutral-950 text-white hover:bg-neutral-600 active:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-300',
  secondary:
    'bg-white border border-neutral-950 text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300 disabled:border-neutral-300 disabled:text-neutral-300 disabled:hover:bg-white',
}

export function Button({
  appearance = 'primary',
  icon,
  iconPosition = 'trailing',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2.5 rounded-full px-4 py-3 text-base font-normal transition-colors ${appearanceClasses[appearance]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'leading' && icon}
      {children}
      {icon && iconPosition === 'trailing' && icon}
    </button>
  )
}
