# Checkbox

> Binary or tri-state selection control. Use for multi-select lists, agreements/consent, and toggleable settings. Not a substitute for Radio (single-select) or Switch (immediate on/off).

**Figma:** Mobile App Design System, node `202:130` · **Status:** verified

```tsx
import { Checkbox } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `label` | `string?` |
| `indeterminate` | `true` \| `false` |
| `isInvalid` | `true` \| `false` |

## Rules (from Figma)

- Drive indeterminate programmatically from child selection.
- Don't expose indeterminate as a state the user clicks into.
- Don't combine isInvalid with disabled.
