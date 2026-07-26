# AppBar

> Mobile app top navigation bar. Fixed height 64px, full width, below the status bar. Centered, short title.

**Figma:** Mobile App Design System, node `160:417` · **Status:** verified

```tsx
import { AppBar } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `title` | `string` |
| `onBack` | `() => void ?` |
| `trailingSlot` | `ReactNode?` |

## Rules (from Figma)

- Leading slot = back/menu navigation only.
- Max one trailing action — use an overflow menu for more.
- Never leave the title blank.
