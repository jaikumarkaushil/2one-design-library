# Avatar

> User identity representation. Circular, fixed size per instance. Image when a photo exists; Initial as fallback with a name; Icon as the generic default.

**Figma:** Mobile App Design System, node `138:81` · **Status:** verified

```tsx
import { Avatar } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `type` | `icon` \| `initial` \| `image` |
| `initial` | `string?` |
| `src` | `string?` |
| `size` | `number?` |

## Rules (from Figma)

- Fallback priority: image > initial > icon.
- Don't show Initial and Icon simultaneously.
- Center-crop images to the circular mask — never stretch.
