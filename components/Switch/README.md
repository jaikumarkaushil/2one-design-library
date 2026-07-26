# Switch

> Immediate on/off toggle. NOTE: the Figma variant was named "state2" (flagged) → ON; "default" → OFF. No description in Figma — context authored.

**Figma:** Mobile App Design System, node `265:1895` · **Status:** new

```tsx
import { Switch } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `checked` | `true` \| `false` |
| `onChange` | `(checked) => void ?` |
| `disabled` | `true` \| `false` |
| `label` | `string?` |

## Rules (from Figma)

- Use for settings that take effect immediately (not form submit — use Checkbox there).
