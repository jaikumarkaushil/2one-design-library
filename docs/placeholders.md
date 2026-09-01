# Placeholders — avatars and media, on-brand

The system ships **no** photography, illustration, or avatar imagery, and says so
plainly (`manifest.json → index.assets.absent`). Inventing stock substitutes is
off-brand by definition, so this guide gives the **sanctioned** way to fill an
image-shaped hole with on-system primitives — an on-brand default instead of
"initials or nothing."

Nothing here adds a new asset or token; it composes what already exists.

## Avatars — a monogram, from `AvatarFallback`

Use `Avatar` + `AvatarFallback`. The fallback renders one or two initials on the
`--muted` surface — a real, themed, contrast-audited placeholder. Never reach for
an invented illustration or a remote stock face.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@2one/design-library'

// Real image when you have one; the monogram is the guaranteed on-brand fallback.
<Avatar>
  <AvatarImage src={user.photoUrl} alt="" />
  <AvatarFallback>{initials(user.name)}</AvatarFallback>
</Avatar>
```

- Derive initials from the display name (1–2 chars); never fabricate a face.
- The fallback already sits on `bg-muted text-muted-foreground` — do not recolour
  it per user. A grayscale monogram is the on-brand identity placeholder; a
  per-user hue would introduce a second decorative colour, which the palette
  forbids (`tokens/colors.json → rules`).

## Media (hero, feed image, thumbnail) — a neutral surface + an icon

When there is no image yet, render the **frame**, not a fake photo: a `--muted`
surface at the intended aspect ratio, a centered lucide icon, and an `sr-only`
label. It reads as "image goes here," stays grayscale, and never claims to be real
content.

```tsx
import { ImageOff } from 'lucide-react'

function MediaPlaceholder({ label = 'Image unavailable', className = '' }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-lg border bg-muted text-muted-foreground ${className}`}
    >
      <ImageOff className="size-6" aria-hidden />
    </div>
  )
}

// e.g. a 16:9 feed image slot:
<MediaPlaceholder className="aspect-video w-full" />
```

- Keep it grayscale (`bg-muted`, `text-muted-foreground`) — the data-viz palette is
  the *only* sanctioned hue exception, and a placeholder is not data.
- Give it a real accessible name (`aria-label` / `sr-only`), never colour or a bare
  icon alone (`docs/accessibility.md` — never signal by icon/colour alone).
- Pick a lucide icon that names the slot: `ImageOff`, `Image`, `Film` (video),
  `Music` (audio). lucide only — no other icon set.

## What NOT to do

- Don't generate or embed an illustration, stock photo, or texture — those
  categories are declared absent (`manifest.json → index.assets.absent`); say so
  instead of substituting.
- Don't tint avatars or media by user/category to add "warmth" — that is a second
  decorative hue. Whether the consumer/social persona gets a sanctioned expressive
  layer is an **open decision**: see
  [`docs/decisions/expressive-warmth-for-consumer-personas.md`](decisions/expressive-warmth-for-consumer-personas.md).
