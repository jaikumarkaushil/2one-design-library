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

## When you add or remove a capability

Everything the repo says about itself is generated or checked (see
[`AGENTS.md` → Invariants](AGENTS.md#invariants--generated-or-checked-never-asserted-by-hand)).
So when a capability changes:

- Regenerate the metadata: `npm run build:meta` (tokens, `manifest.json`, `graph.json`).
- Fix **every** place that asserts the old state in the **same** change, and let
  `npm run check:claims` catch stale wording.
- If it's a new design decision, add it to `rules/ux-rules.json` (severity + precedence),
  not just prose — so the graph and `check:rules` enforce it.
