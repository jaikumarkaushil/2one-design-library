// @expect ambiguous-date
// Two different days depending on who reads it.
import { Card } from '@2one/design-library'

export function Renewal() {
  return (
    <Card>
      <span>Renews 03/04/2026</span>
    </Card>
  )
}
