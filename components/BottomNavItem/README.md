# BottomNavItem

> A single destination item within a bottom navigation — icon + label — repeated in a row to form the tab bar. State: default / pressed / selected.

**Figma:** Mobile App Design System, node `265:1453` · **Status:** new

```tsx
import { BottomNavItem } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `icon` | `ReactNode` |
| `label` | `string` |
| `selected` | `true` \| `false` |
| `onClick` | `() => void ?` |

## Rules (from Figma)

- This is one tab item, not the whole bar — compose several in a row.
- Only one item selected at a time (the bar enforces this).
- Icon is swappable per instance.
