// @expect literal-content-array
// Fake product data inlined beside the JSX — passes review, ships to a demo.
import { Card } from '@2one/design-library'

const PLANS = [
  { id: 'basic', name: 'Basic', price: '$8' },
  { id: 'standard', name: 'Standard', price: '$14' },
  { id: 'premium', name: 'Premium', price: '$18' },
]

export function Plans() {
  return <Card>{PLANS.map((p) => <div key={p.id}>{p.name} {p.price}</div>)}</Card>
}
