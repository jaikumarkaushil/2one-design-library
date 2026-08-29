// @expect unguarded-motion
// A hover-preview card — the single most common motion pattern in a media UI,
// and the one that most reliably ships with no prefers-reduced-motion guard.
import { Card } from '@2one/design-library'

export function PosterCard({ title }: { title: { name: string } }) {
  return (
    <Card className="transition-transform duration-500 hover:scale-110">
      <span>{title.name}</span>
    </Card>
  )
}
