// @expect handrolled-control
// A poster tile built as a clickable div: one resting state, and a developer
// left to invent the other four.
export function PosterTile({ onOpen, name }: { onOpen: () => void; name: string }) {
  return (
    <div onClick={onOpen} className="rounded-md bg-card p-2">
      {name}
    </div>
  )
}
