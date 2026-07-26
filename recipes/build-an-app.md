# Build an app

```bash
npm install @yokesh-2one/design-library react react-dom
```

Add the tokens once at your app root, and point Tailwind at the package so its
utility classes are generated:

```ts
// main.tsx
import 'tailwindcss'
import '@yokesh-2one/design-library/styles'
```

```css
/* app.css */
@source '../node_modules/@yokesh-2one/design-library/dist';
```

Then compose screens from components (each obeys its Figma rules — see the
component's README / component.json):

```tsx
import { AppBar, TextField, Button, Checkbox } from '@yokesh-2one/design-library'

<AppBar title="Sign in" onBack={() => history.back()} />
<TextField label="Email" placeholder="you@example.com" />
<Checkbox label="Remember me" />
<Button appearance="primary">Continue</Button>   // one primary per view
```
