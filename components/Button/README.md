# Button

> Primary: main action for the screen/section, use once per view. Highest visual weight. Secondary: alternate action, can pair with Primary, never the sole CTA if a Primary equivalent exists.

**Figma:** Mobile App Design System, node `152:36` · **Status:** verified

```tsx
import { Button } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `appearance` | `primary` \| `secondary` |
| `icon` | `ReactNode?` |
| `iconPosition` | `leading` \| `trailing` |

## Rules (from Figma)

- One Primary per view/section.
- Pair Secondary with Primary for a lesser action.
- Don't use two Primary buttons in one group.
- Don't combine leading and trailing icons on the same button.
