# LEARNINGS — self-improving log

A running record of mistakes, bugs, gotchas, and decisions so the system keeps
improving instead of repeating them. Newest first.

## 2026-08-28 — 10-item product overhaul (consolidate/full-app-test)

### Decisions (from the user)
- **Trend colours (data deltas):** success/danger are now sanctioned for data
  growth/decline (not just validation), ALWAYS paired with a direction arrow
  (never colour-alone). The `validation-only` rule is being evolved to say so —
  rules must track reality, not lag it.
- **Charts:** move off the all-grey `--chart-1..5` (neutral ramp) to a real
  multi-hue **categorical palette** (5 distinct, APCA-checked hues, accent-led).
  Grey-only charts fail to highlight the data they exist to show.
- **Navigation:** one shared global sidebar across ALL pages (Overview,
  Components, Components for AI Interface, Knowledge graph, What-is-a-DLS).
  Per-page bespoke sidebars were the inconsistency.
- **Rename:** "Elements" → **"Components for AI Interface"** everywhere incl.
  internals. Internal slug `ai-component` (node type `ai-component:*`, dirs
  `src/ai-components` + `rules/ai-components`, manifest key `aiComponents`,
  guard `check:ai-components`).

### Bugs / issues found & fixed earlier this cycle (context)
- **`--ring` repurposed to the brand accent** broke two stale neutral aliases in
  `dev/graph.html` (`--ink-3`, `--line-2`) → labels/hover-borders went blue.
  LESSON: when a token's ROLE changes (neutral → accent), grep every alias of it;
  aliases silently inherit the new meaning.
- **`animate-bounce` had no keyframes** in this Tailwind build (only `pulse`/`spin`
  exist). LESSON: only use `animate-pulse` / `animate-spin`, or add keyframes.
- **login-04 `<img src="/placeholder.svg">`** 404'd → broken image shipped in a
  block. LESSON: blocks must be self-contained; use a themed `bg-muted` slot, not
  an external placeholder asset.
- **Dev showcase only rendered a subset** (50/58 components, 3/9 blocks). LESSON:
  a showcase that samples silently hides components from humans + AI; render all.

### Bugs / gotchas from the 10-item overhaul
- **Rename `element:` → `ai-component:` via sed missed the node-group KEY** `"element":`
  (a quote sits between `element` and `:`, so `s/element:/.../` didn't match). Node-type
  keys need a distinct edit from `id:` values.
- **Consumer code that hand-builds ids must be renamed too.** `dev/ai-components.tsx`
  ITEMS still used `element:*` ids after the rename, so `SPECS.get(id)` missed and the
  governance chips silently vanished. Renames must sweep code that CONSTRUCTS ids, not
  just definitions.
- **The "What is a DLS?" page had no sidebar at all** (header-only), with dead `NAV` +
  `EXPLORE_LINKS` consts — that was the nav inconsistency. Fixed by a shared
  `dev/global-nav.tsx` (`GlobalNav`) rendered first in every page's sidebar, so the
  top-level menu is identical everywhere; each page keeps its own in-page section group.
- **Chart palette, dark band:** brand-300 (#7cc4ff) and even the identity #30A1FF sit
  ABOVE the dark categorical lightness band (L 0.48–0.67) — both FAILED the validator.
  Used the validated mid-blue #3987e5 as the dark lead. Compute, never eyeball.
- **check-usage `color-only-state` false-positived on a trend-down** (text-destructive
  with no aria-invalid). A trend arrow IS the non-colour cue, so the check now accepts
  Trending/Arrow/Chevron icons as a valid signal — the checker must track the rule it enforces.
- **Decision recorded:** data-viz is the sanctioned exception to grayscale (charts +
  the knowledge-graph node dots); everywhere else stays grayscale + one accent.

### Gotchas (testing / tooling)
- Non-composited Browser pane throttles CSS animations → Radix overlay exit
  never fires `animationend` → overlays look "stuck". Not a bug; use DOM state
  (`data-state`) as source of truth, disable animations to test unmount.
- Radix menu-type triggers (Dropdown/Menubar/ContextMenu) open on pointerdown,
  not synthetic `.click()`. Test via keyboard or real pointer events.

### Nav model (2026-08-28, follow-up)
Two-tier navigation: the GLOBAL menu lives in the TOP HEADER on every page
(`TopNav` from dev/global-nav.tsx, mirrored into the graph page's HTML header);
the SIDEBAR is scoped to the current page's own sections (Overview → Overview/
How to use; Components → the tiers; etc.). Better UX than repeating the global
menu in every sidebar. `GlobalNav` (sidebar) was replaced by `TopNav` (header).
