# Contributing to the 2one Design Language System

The design/build rules live in [`docs/building-with-the-dls.md`](docs/building-with-the-dls.md)
(prose) and [`rules/ux-rules.json`](rules/ux-rules.json) (machine-readable, enforced by
`npm run check:rules`). This file covers the **workflow** — how to branch, verify, and
land work without the repository drifting. It's written from real friction: branches
piled up, `main` fell behind, and local-only work sat at risk.

## Before you open a PR

Run the whole gate locally — one command runs every invariant CI checks:

```bash
npm run verify
```

It runs typecheck · check:exports · check:claims · validate (+ check:rules) · a11y ·
check:meta · build. If you touched the dev sampler pages (`dev/`), also run
**`npm run build:site`** — the multi-page production build is the definitive check for the
app, and it fails on a dangling reference or missing export that dev-mode HMR papers over
(a green `typecheck` alone does **not** prove the `dev/` pages render — `noUnusedLocals`
doesn't even cover `dev/`).

## Branch & PR hygiene

- **Branch off `main`; one concern per branch.** Name it for the work
  (`feat/…`, `fix/…`, `chore/…`, `docs/…`). Don't stack unrelated changes on one branch —
  it makes the PR hard to review and the history hard to read.
- **Land finished work promptly.** Open the PR, get it green, merge to `main`. Work that
  sits unmerged across sessions is how `main` falls behind and branches multiply.
- **Prune merged branches** — local **and** remote — once they're in `main`:
  ```bash
  git branch --merged main | grep -vE '^\*| main$' | xargs -r -n1 git branch -d
  git push origin --delete <merged-branch>
  ```
- **Keep your local `main` current** (`git fetch` + fast-forward) before branching, so you
  don't build on a stale base.

## Don't lose local-only work

- **Stashes are never pushed.** A `git stash` lives only on your machine — if you need it
  backed up, apply it to a branch and push, don't leave it stashed.
- **Build output is not source.** `dist/`, `dist-site/`, `site/`, and `*.tgz` are
  gitignored — never commit them. Regenerate with `npm run build` / `build:site` /
  `npm pack` as needed.
- **Untracked ≠ safe.** Anything untracked (and not ignored) can be swept in by
  `git add .` — stage explicit paths, and back up work you care about by pushing a branch.

## Bilingual showcase (English + French)

The `dev/` showcase ships in **English and French**. Copy is not hard-coded in the page
components — it lives in [`dev/i18n/en.json`](dev/i18n/en.json) (the source of truth) and
[`dev/i18n/fr.json`](dev/i18n/fr.json), read through `react-i18next` (`useTranslation` /
`<Trans>`). A `LanguageToggle` sits in every page header next to the theme toggle; the
choice is persisted to `localStorage` (`2one-lang`) so it survives the multi-page app's
full page loads, and drives `<html lang>`.

**When you add or change any user-facing string in `dev/`:**

1. Add the key to **`en.json`**, then the translated value to **`fr.json`** — same key
   path, same shape, same interpolation placeholders (`{{count}}`, `{{name}}`, …).
2. Render it with `t('some.key')`, or `<Trans i18nKey="…" components={{ … }} />` for copy
   with inline emphasis (`<b>`, `<em>`, `<mono>`, `<code>`, `<a>`). For a fixed code/asset
   token inside translated prose, use a **self-closing** placeholder (`<mono/>`) and supply
   the literal as the component's own children — an entity like `&lt;id&gt;` written inside
   the translation string will **not** be decoded by `<Trans>`.
3. Keep genuinely language-neutral content out of i18n: component/block IDs (`login-01`),
   token/class names (`--brand`, `text-h1`), the build-prompt code block, and brand facts
   pulled live from `brand/brand.json`.

`npm run check:i18n` (part of `npm run verify`) fails the build if the locales drift —
a missing key, an empty value, a shape mismatch, or mismatched placeholders. So a new
English string can never land without its French translation.

The vanilla graph explorer (`dev/graph.html` / `dev/graph-main.ts`) is localised too: it
has no React, so it runs its own i18next instance ([`dev/i18n/graph-i18n.ts`](dev/i18n/graph-i18n.ts))
over the **same** `en.json`/`fr.json` (the `graph.*` keys), reads the same `2one-lang`,
and reloads on switch. Its strings are covered by `check:i18n` like everything else.

## Default theme

The showcase **defaults to light** and never derives dark from the OS. The React pages use
`ThemeProvider` (`defaultTheme="light"`, `enableSystem={false}`); the graph page falls back
to `'light'` when no theme is persisted. The light/dark toggle still works and its choice
persists across pages via `localStorage` (`theme`).

## When you add or remove a capability

Everything the repo says about itself is generated or checked (see
[`AGENTS.md` → Invariants](AGENTS.md#invariants--generated-or-checked-never-asserted-by-hand)).
So when a capability changes:

- Regenerate the metadata: `npm run build:meta` (tokens, `manifest.json`, `graph.json`).
- Fix **every** place that asserts the old state in the **same** change, and let
  `npm run check:claims` catch stale wording.
- If it's a new design decision, add it to `rules/ux-rules.json` (severity + precedence),
  not just prose — so the graph and `check:rules` enforce it.
