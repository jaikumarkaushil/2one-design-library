// A sized, theme-adaptive Logo inside a Button is fine — an explicit width locks
// the 109:33 ratio (nothing for the button's icon rule to crush), and the .dark
// swap keeps the wordmark visible on both grounds.
import { Button, Logo } from '@2one/design-library'

export function HomeButton() {
  return (
    <Button variant="ghost">
      <Logo variant="black" width={24} className="dark:hidden" />
      <Logo variant="white" width={24} className="hidden dark:block" />
    </Button>
  )
}
