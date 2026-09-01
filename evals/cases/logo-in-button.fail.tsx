// @expect logo-in-button
// The lockup a video-conferencing app shipped: a clickable home mark. The
// Button's base cva ([&_svg:not([class*='size-'])]:size-4) crushes the UNSIZED
// <Logo> svg to a 16px square, distorting the 109:33 wordmark. typecheck,
// build and the old check-usage all passed — only the render showed it.
import { Button, Logo } from '@2one/design-library'

export function HomeButton() {
  return (
    <Button variant="ghost">
      <Logo />
    </Button>
  )
}
