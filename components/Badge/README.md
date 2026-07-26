# Badge

> Status/notification indicator, anchored to the top-right corner of another element (icon, avatar, nav item).

**Figma:** Mobile App Design System, node `138:39` · **Status:** verified

```tsx
import { Badge } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `type` | `text` \| `notext` |
| `count` | `number | string ?` |

## Rules (from Figma)

- notext = simple presence/alert; text = a count or short label.
- Cap long counts (e.g. 99+).
- Always anchored to a parent element — never standalone.
