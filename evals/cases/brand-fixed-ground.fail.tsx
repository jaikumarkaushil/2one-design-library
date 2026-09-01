// @expect fixed-vs-theme-color
// A brand mark that ships one fixed fill and sits on a THEME surface: a black
// wordmark that vanishes on the dark ground. login-05 shipped exactly this, and
// nothing caught it because the rule was advisory-only.
import { Logo } from '@2one/design-library'

export function BrandHeader() {
  return (
    <header className="flex items-center bg-card p-4">
      <Logo width={120} />
    </header>
  )
}
