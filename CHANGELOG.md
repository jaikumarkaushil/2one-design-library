# Changelog

All notable changes to `@yokesh-2one/design-library` are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/); this project
uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `LICENSE` (MIT) and a `license` field in `package.json` — the package can now
  be distributed unambiguously.
- CI workflow (`.github/workflows/ci.yml`): typecheck, public-API completeness,
  data validation, accessibility thresholds, generated-file sync, and library build.
- `scripts/check-exports.mjs` (`npm run check:exports`) — guards that every
  component is re-exported from `src/index.ts`.
- `npm run check:meta` — fails if the generated `tokens/*.json`, `manifest.json`,
  or `graph.json` drift from their sources.
- `engines.node >= 18`.
- `docs/building-with-the-dls.md` — consistency rules for building on the DLS.
- `scripts/check-claims.mjs` (`npm run check:claims`) — fails the build if a stale
  capability claim (e.g. a single-theme claim after dark shipped) survives in any
  tracked prose/config. Wired into `npm run validate` and CI. Seeded from the real
  drift found after dark mode shipped, so the same class of drift can never return.
- "Definition of Done for a capability change" section in
  `docs/building-with-the-dls.md` (near rule 15): run `check:claims` and grep the old
  claim repo-wide in the same PR.
- `docs/consuming.md` — the exact, **end-to-end-verified** setup for consuming the DLS in
  a fresh Vite + Tailwind v4 app: how to get the package (local `npm pack` tarball today;
  registry when published), the theme + Tailwind `@source` wiring (the #1 silent failure),
  `ThemeProvider`, peer deps, troubleshooting, and a maintainer release checklist. Linked
  from `README.md` and `AGENTS.md`. `scripts/check-exports.mjs` now also fails if this doc
  drifts from the package name / `./styles` export.

### Changed
- **Killed the "light-only" truth-drift.** Corrected stale single-theme wording to
  reflect the shipped light + audited dark themes across `README.md`,
  `src/styles/globals.css`, `package.json`, `guide-app/knowledge-base.md`,
  `guide-app/VERSIONLOG.md`, and `recipes/build-a-website.md`. Renamed the graph's
  theming rule id (`rule:light-only` → `rule:theming`) so the id no longer encodes a
  stale claim; `graph.json` regenerated.
- **Trimmed the shipped dependency surface.** Moved dev-showcase-only packages
  (`@dnd-kit/*`, `@tanstack/react-table`, `date-fns`) from `dependencies` to
  `devDependencies`, and removed `@tabler/icons-react` (→ lucide). Consumers no
  longer install those.
- `sonner` reads the active theme via `next-themes`, which is bundled as a runtime
  dependency for the exported `ThemeProvider` (light + audited dark).

### Fixed
- **Consumption path was broken:** the shipped `dist/styles.css` does
  `@import 'tw-animate-css'`, but that package was a **devDependency**, so a consumer
  installing `@yokesh-2one/design-library` hit `Can't resolve 'tw-animate-css'` and the
  documented setup failed. Moved `tw-animate-css` to `dependencies`. Verified end to end:
  a blank Vite + Tailwind v4 app that follows `docs/consuming.md` now builds a themed pill
  `Button` with the audited `.dark` palette and no unstyled flash.
- Corrected the "removed `next-themes`" changelog claim — `next-themes` is a runtime
  dependency again (the exported `ThemeProvider` and `sonner` use it).

### Changed
- **Told the truth about the install path.** `@yokesh-2one/design-library` isn't on a
  public registry yet, so rule #1 ("import from the package") in `README.md`, `AGENTS.md`,
  `.cursorrules`, and `llms.txt` now points at the works-today path (local tarball / vendored
  source) and marks registry install as "when published" — no more documenting an install
  command that 404s.

## [0.1.0] - 2026-08-12

- Initial 2one DLS: 54 shadcn/ui primitives re-skinned to the 2one tokens, 3
  2one-only components (`Logo`, `AppBar`, `BottomNavItem`), token pipeline,
  brand, templates, and the AI-legibility layer (manifest, graph, llms.txt).
