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

### Gotchas (testing / tooling)
- Non-composited Browser pane throttles CSS animations → Radix overlay exit
  never fires `animationend` → overlays look "stuck". Not a bug; use DOM state
  (`data-state`) as source of truth, disable animations to test unmount.
- Radix menu-type triggers (Dropdown/Menubar/ContextMenu) open on pointerdown,
  not synthetic `.click()`. Test via keyboard or real pointer events.
