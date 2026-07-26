# Dropdown

> Single-select form field that opens a panel of options. Trailing chevron always present (down when closed, up when open). Not for typeable/filterable lists or multi-select.

**Figma:** Mobile App Design System, node `230:631` · **Status:** new

```tsx
import { Dropdown } from '@yokesh-2one/design-library'
```

## Props

| Prop | Values / type |
|---|---|
| `label` | `string?` |
| `value` | `string?` |
| `placeholder` | `string?` |
| `leadingIcon` | `ReactNode?` |
| `helperText` | `string?` |
| `isInvalid` | `true` \| `false` |
| `disabled` | `true` \| `false` |
| `open` | `true` \| `false` |

## Rules (from Figma)

- Don't combine isInvalid with disabled.
- Don't combine active(open) with disabled.
- Single-select only — use a Multiselect field for many.
- This is the trigger field; the options panel is a separate component.
