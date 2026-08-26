# Consuming the 2one DLS in your app

The exact, end-to-end setup for using `@2one/design-library` in a fresh
Vite + React + Tailwind v4 app. Following this verbatim yields a themed, pill-radius
`Button` with working light/dark — and **no unstyled flash**.

> **This package is distributed from the repository, not from a registry.**
> Install it at a tag (path A). The theme + Tailwind wiring in step 2 is the
> part consumers most often get wrong, whichever path you take.

## Requirements

- **React 18 or 19** (`react`, `react-dom` are peer deps).
- **Tailwind CSS v4** in your app (e.g. `@tailwindcss/vite`). The components ship as
  Tailwind class *strings*; your app's Tailwind is what compiles them to CSS.
- Node 18+.

`next-themes` (for `<ThemeProvider>`) and every other runtime dep are **bundled** —
you don't install them separately.

## 1 · Get the package

### A · Install from the repo (the supported path)

No token, no registry account, nothing to build by hand.

**Starting from nothing** — the whole sequence:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install -D tailwindcss @tailwindcss/vite
npm install github:yokesh-2one/2one-design-library
```

The Vite template already installs `react` and `react-dom`, so you do not add
them again.

**Adding to an app you already have:**

```bash
npm install github:yokesh-2one/2one-design-library react react-dom
```

A `prepare` hook builds `dist/` during install, so you get a real `dist/`
without building anything by hand.

This tracks `main`, so you always get the current system — which is what you
want while the system is under active development. To freeze a version instead,
append a tag: `#v0.2.0`. Re-run `npm install` to pick up changes.

Tailwind v4 is a peer dependency, so npm installs it for you. You still need
`@tailwindcss/vite` (or your bundler's Tailwind plugin) yourself, which is why
it is in the sequence above.

### B · Local tarball (offline, or no GitHub access)

In a clone of this repo:

```bash
npm install && npm pack     # → 2one-design-library-0.2.0.tgz
```

Then in your app:

```bash
npm install /path/to/2one-design-library-0.2.0.tgz react react-dom
```

### C · Vendor the source (fallback)

If you can't install a package at all, copy `src/components/`, `src/lib/`,
`src/styles/globals.css`, and `tokens/` into your app and import from your local
path instead of the package name. You then own the copies (shadcn-style).

## 2 · Wire the theme + Tailwind  ← the #1 silent failure

The components are plain React + Tailwind classes. **Your app's Tailwind has to _see_
those class strings to generate the CSS.** Import the theme once, and point Tailwind
at the package's `dist` with `@source`:

```css
/* app.css */
@import 'tailwindcss';
@import '@2one/design-library/styles';               /* 2one tokens, variables, fonts */
@source '../node_modules/@2one/design-library/dist'; /* scan the components' classes */
```

> **If you skip the `@source` line, you get a silent failure:** the components render
> with their class names but Tailwind never generated those utilities, so the UI is
> **unstyled with no error**. This is the single most common consumer mistake — if your
> `Button` looks like a plain browser button, this line is missing or the path is wrong.

Import that CSS once at your app root:

```tsx
// main.tsx
import './app.css'
```

## 3 · Add the ThemeProvider (light + dark)

Wrap your app so the audited `.dark` palette can activate (`<ThemeProvider>` adds the
`.dark` class via `next-themes`; default is `light`):

```tsx
import { ThemeProvider } from '@2one/design-library'

export function Root() {
  return (
    <ThemeProvider>          {/* defaultTheme="light"; pass enableSystem / defaultTheme to change */}
      <App />
    </ThemeProvider>
  )
}
```

## 4 · Use a component

```tsx
import { Button } from '@2one/design-library'

export function Example() {
  return <Button>Continue</Button>   // renders as a pill (radius-full), 2one-themed
}
```

## Verify it worked

Fastest check — run it in your app, not in the DLS repo:

```bash
npx 2one info      # version, component count, and the setup mistakes that fail silently
npx 2one check src # audit your own code against the 2one rules (non-zero exit on a violation)
```

`info` reports the three setup failures by name, and tells you the `@source`
path relative to *your* stylesheet rather than a guessed one. Then, by eye:

- The `Button` is a **pill** (fully rounded), not a square browser button → step 2 worked.
- Toggling the theme (via `next-themes`' `useTheme().setTheme('dark')`) flips the whole
  UI to the audited dark palette → step 3 worked.
- If the button is unstyled: the `@source` line in step 2 is missing or its path is wrong.

## Troubleshooting

- **Unstyled components, no error** → missing/incorrect `@source` (step 2).
- **Fonts 403 with a `file:`/symlinked dep** → add the package path to your bundler's
  filesystem allow-list (Vite: `server.fs.allow`). A normal install doesn't hit this.
- **Consumer TS props become `any`/required** → the published `.d.ts` must use relative
  imports (handled by `tsc-alias` in the library build); don't drop that step if you fork.
- **Barrel drags in `recharts`** (via `Chart`) → all deps are declared; this is expected
  until per-component subpath exports land. Run `npm run what-uses recharts` in the DLS
  repo to see exactly which components pull it.

