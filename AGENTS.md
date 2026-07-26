# 2one-system — agent guide

This repository is the **single source of truth** for the 2one design system:
components, design tokens, brand assets, and the context needed to use them
correctly. It is written to be read by both humans and AI agents (Claude Code,
Codex, Gemini, Copilot).

**If you are an AI agent, start here, then read [`registry.json`](registry.json).**

## How this repo is organized

- `registry.json` — machine index of every component + token + known issue. Read
  this first; it tells you what exists, where it lives, its props, and its rules.
- `tokens/` — design tokens (Tailwind v4 `@theme` CSS). The single source of truth
  for color, type, and spacing. Never hard-code values that a token covers.
- `components/<Name>/` — one folder per component. `<Name>.tsx` is the source.
  (Being expanded to also hold `component.json`, `README.md`, `*.stories.tsx`, and
  per-target `examples/`.)
- `brand/logo/` — the 2one logo (SVG + PNG + manifest). See its rules before use.
- `recipes/` — how to assemble the system into an app, website, marketing asset,
  or slide deck.

## Rules for using components (read before generating code)

1. **Obey each component's `rules`** in `registry.json` — they encode real design
   constraints (e.g. one primary Button per view; Logo must never be recolored;
   Checkbox must never be `disabled` + `invalid` at once). Do not emit
   combinations a component's rules forbid.
2. **Import from the package**, don't copy source: `import { Button } from '@yokesh-2one/ui'`.
3. **Use tokens, not literals.** Colors/spacing/type come from `tokens/`.
4. **Match existing conventions.** Read a neighboring component before adding one.

## Status of components

`registry.json` marks each component `verified` (implemented and build-tested) or
`pending` (extracted from Figma, not yet implemented). Do not assume a `pending`
component exists in the package yet.

## Known Figma-source issues

`registry.json → issues` lists inconsistencies found during extraction (duplicate
variants, mislabeled frames, case-duplicated states). Treat the code here as the
corrected source of truth where it diverges from Figma.

## Source of truth chain

Figma (`Mobile App Design System`, key `YzxnyL6a69WCOw9U8WJqBo`) → this repo →
`@yokesh-2one/ui` (published package). When design and code disagree, this repo wins
for code; Figma wins for visual intent.
