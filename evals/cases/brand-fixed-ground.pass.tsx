// The compliant pattern: a theme-adaptive brand mark (a .dark variant swap), so
// the wordmark reads on both grounds. Clean.
import { Logo } from '@2one/design-library'

export function BrandHeader() {
  return (
    <header className="flex items-center bg-card p-4">
      <Logo variant="black" width={120} className="dark:hidden" />
      <Logo variant="white" width={120} className="hidden dark:block" />
    </header>
  )
}
