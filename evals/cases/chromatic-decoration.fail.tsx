// @expect chromatic-decoration
// A validation hue used to mark the active subscription tier. Nothing here is
// invalid; the colour is decoration, which is what drains its meaning.
import { Badge } from '@2one/design-library'

export function TierMarker({ active }: { active: boolean }) {
  return <Badge variant={active ? 'destructive' : 'secondary'}>Premium</Badge>
}
