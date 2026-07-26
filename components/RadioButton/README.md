# RadioButton

> Single-select control for one option from a mutually exclusive group. Not for multi-select (use Checkbox) or on/off (use Switch).

**Figma:** Mobile App Design System, node `250:1224` · **Status:** new

```tsx
import { RadioButton } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `label` | `string?` |
| `name` | `string?` |
| `isInvalid` | `true` \| `false` |
| `disabled` | `true` \| `false` |

## Rules (from Figma)

- Only one selected per group — the group enforces this (share a `name`).
- Don't combine isInvalid with disabled.
- Error text lives at the group level, not per radio.
