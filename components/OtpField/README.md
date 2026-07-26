# OtpField

> A row of single-character boxes for a one-time passcode (SMS/email verification). State: Default / Active (active = focused box). NOTE: no description in Figma — context authored.

**Figma:** Mobile App Design System, node `210:204` · **Status:** new

```tsx
import { OtpField } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `length` | `number?` |
| `value` | `string?` |
| `onChange` | `(value) => void ?` |
| `isInvalid` | `true` \| `false` |
| `disabled` | `true` \| `false` |

## Rules (from Figma)

- One character per box; auto-advance on entry, backspace to previous.
- Typically 4–6 digits.
