// A sized Logo inside a Button is fine — an explicit width locks the 109:33
// ratio, so the button's icon-sizing rule has nothing to crush.
import { Button, Logo } from '@2one/design-library'

export function HomeButton() {
  return (
    <Button variant="ghost">
      <Logo width={24} />
    </Button>
  )
}
