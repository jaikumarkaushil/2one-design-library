# 2one-system

The **one-point source** for the 2one design system — components, design tokens,
and brand assets, structured so both people and AI tools can pull from it to build
**apps, websites, marketing material, and slide decks**.

It consolidates what used to be scattered across separate projects: the verified
component code (`@yokesh-2one/ui`), the design tokens, and the brand logo.

## Layout

```
tokens/            design tokens (Tailwind v4 @theme) — the source of truth for color/type/spacing
components/<Name>/  one folder per component; <Name>.tsx is the source
brand/logo/        2one logo — SVG + PNG + manifest + rules
recipes/           how to build an app / website / marketing asset / deck
registry.json      machine index of every component + token + known issue
AGENTS.md          entry point for AI agents (Claude Code, Codex, Gemini, Copilot)
```

## For developers

```bash
npm install @yokesh-2one/ui react react-dom
```

```tsx
import { Button, TextField, Logo } from '@yokesh-2one/ui'
import '@yokesh-2one/ui/styles'
```

Browse every component and state in Storybook (config in `.storybook/`).

## For AI tools

Point the agent at [`AGENTS.md`](AGENTS.md) → [`registry.json`](registry.json).
Between them they describe every component's props, rules, Figma origin, and the
known source issues — enough to generate correct UI without guessing.

## Status

All **12 components** are implemented 1:1 with the Mobile App Design System,
each carrying its verbatim Figma context (`component.json` + `README.md` per
folder). Verified: type-check + Vite library build (ES/CJS + types) + install→
import smoke test + Storybook render. See `registry.json` for per-component props
and the list of Figma-source issues found and corrected during extraction.

Browse everything locally:

```bash
npm install
npm run storybook      # interactive catalog at http://localhost:6006
npm run build          # library build → dist/
```

## Source

Figma — *Mobile App Design System* (`YzxnyL6a69WCOw9U8WJqBo`) and *Components*
(`bIIZWa7XK9ajJYpI8RjwSz`), team "2one Solutions".
