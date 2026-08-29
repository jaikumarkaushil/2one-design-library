// Creative but grounded: the library has no kanban primitive. Composing one
// from real primitives must stay legal — if this ever fails, the rules have
// started blocking invention, which is the behaviour the system most needs
// to allow.
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@2one/design-library'
import { Plus } from 'lucide-react'

export function KanbanBoard({ columns }: { columns: { id: string; name: string; cards: { id: string; title: string }[] }[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((col) => (
        <Card key={col.id}>
          <CardHeader>
            <CardTitle>{col.name}</CardTitle>
            <Badge variant="secondary">{col.cards.length}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {col.cards.map((c) => (
              <div key={c.id} className="rounded-md border bg-card p-3 text-card-foreground">{c.title}</div>
            ))}
            <Button variant="ghost" size="sm"><Plus />Add card</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
