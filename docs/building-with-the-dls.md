# Building apps with the 2one DLS — consistency rules

> Written from real mistakes made while building this repo's own showcase. Follow
> these so the same inconsistencies don't reappear when anyone (human or AI) builds
> on the 2one Design Language System. See also [`AGENTS.md`](../AGENTS.md) and
> [`manifest.json`](../manifest.json).

The goal is **consistently good applications** — every screen should look like it
came from the same system. Most "it looks AI-generated / inconsistent" problems
trace back to breaking one of these rules.

## 1. Build *from* the library, not beside it
Compose real components — `Card`, `Sidebar` / `SidebarInset`, `Button`, `Badge`,
`Input`, `Table`, … from `@yokesh-2one/design-library` (or `src/components/ui/` in
this repo). **Never hand-roll a parallel chrome** (a custom sidebar, a bespoke
"stage" box) for something the library already provides. If you're writing CSS for
a sidebar, card, or badge — stop and use the component.

## 2. One token system — never a second palette
Theme **only** through the DLS tokens (`--background`, `--foreground`, `--border`,
`--muted`, `--muted-foreground`, `--primary`, `--radius`…) via their Tailwind
utilities (`bg-muted`, `text-muted-foreground`, `border`, `rounded-xl`). **Never
hard-code a hex** (`#e4e4e7`, `#09090b`) and never invent a parallel token set
(e.g. a `--g-*` chrome palette). Hard-coded colour drifts from the tokens and
breaks recolour + theming.

## 3. One spacing scale
Use the 8px system through Tailwind utilities (`gap-4`, `mt-6`, `p-6`, `space-y-4`).
**No ad-hoc inline margins** (`style={{ marginTop: 18 }}`) and no mixing
14 / 16 / 18 / 26 / 46 px by hand. Inconsistent gaps are the single most visible
"AI-generated" tell.

## 4. One container language
Every panel is a real `Card` — same border, radius, padding, and shadow. Don't
invent bespoke boxes with heavier shadows sitting next to real Cards, and **don't
nest a Card inside a Card**.

## 5. Never signal state by colour alone
An invalid field needs an **icon + text** (plus `aria-invalid` and
`aria-describedby`), not just a red border. This is a non-negotiable brand +
accessibility rule. Any new/changed colour token must pass `npm run a11y`.

## 6. Theme via the ThemeProvider — light + audited dark
The system ships two themes (light `:root` + dark `.dark` in `globals.css`), both
grayscale-founded with the single brand accent (`--brand`, identity `#30A1FF`, for
emphasis only), both APCA-audited. Wrap your app in the exported `ThemeProvider` to
switch them (it adds a `.dark` class); don't hand-roll a third palette or a second
hue, or `data-*` dark hacks. Any token change must pass `npm run a11y` (it audits
both themes).

## 7. Icons: lucide only
One icon library across the whole app. Don't mix `@tabler/icons-react` (or any
other set) alongside `lucide-react`.

## 8. Don't scope critical CSS to a wrapper you might remove
Base rules (heading font, selection, mono) belong in `globals.css` base layer —
not a `.some-wrapper`-scoped block that silently dies the day the wrapper changes.

## 9. Match the brand voice in copy
Minimalistic · Contemporary · Empathetic · Bold · Factual — pull tone from
[`brand/brand.json`](../brand/brand.json). Tighten wordy prose.

## 10. Cap width by content type — don't put a reading cap on an app
A `max-width` exists to keep **long-form text** readable (~65–75 characters per
line — cap the prose block, e.g. `max-w-[60ch]` on a lede). It is the **wrong
default for component/app layouts** — grids, dashboards, and tables want the
space. Give an app page a **generous, responsive cap** (`max-w-7xl` ≈ 1280px,
centered with `mx-auto`, fluid below the cap) — or go fluid with padding — and
cap only the prose inside it. Never wrap a whole component page in
`max-w-5xl mx-auto`: on a large monitor you waste half the screen in empty
gutters. The cap is per **content type**, not per page.

## 11. Reading a `@theme` token at runtime? Keep it alive
Tailwind v4 **tree-shakes any `@theme` variable no utility references** — it never
emits `--color-neutral-50` into `:root` unless something uses `bg-neutral-50` (etc.).
So if you paint a swatch / palette / token view from `var(--color-<ramp>-<step>)` or
read it via `getComputedStyle`, the raw ramp vars may be **absent** and you get blank
output — even though the token "exists" in `tokens/colors.css`. Fix: reference every
ramp utility in a hidden **safelist** element (literal class names only — Tailwind
can't see interpolated `bg-${x}` names) so the vars are emitted. Corollary: prefer
the **semantic** tokens (`--primary`, `--muted`…) which are always live; only the raw
`--color-*` ramps get shaken out.

## 12. Scan every folder you render (Tailwind keeps only what it sees)
Tailwind generates a class only if its **content scanner** finds that literal class
in a scanned file — two failure modes hit this repo. (a) `@theme` vars get tree-shaken
when no utility references them (rule 11). (b) A class written in a folder the config
never `@source`s is never generated **at all**: the dev sampler scanned `src/components`
and `dev` but not `src/blocks`, so the area chart's `h-[250px]` (an arbitrary class
living only in a block) was dropped and the chart collapsed to **0px height**. Scan
every folder whose classes you render. Canary: an **arbitrary value** (`h-[250px]`,
`w-[37ch]`) used in exactly one place — if it "does nothing", it was never generated.

## 13. Multi-theme: dark is not "invert and ship"
With more than one theme, **every** surface×text and non-text pair changes — re-audit
all of them in **both** themes (`npm run a11y` parses `:root` and `.dark` separately;
both must pass). Keep token **relationships** consistent across themes (if
`muted`/`secondary`/`accent` are one value in light, keep them unified in dark). And
keep component colours **token-driven**: a component that hardcodes `text-white` or
bakes in `dark:bg-destructive/60` diverges from the audited token, so the audit passes
green while the button is unreadable. Full detail + the dark palette rationale:
[`docs/accessibility.md`](accessibility.md).

## 14. Fixed colour vs theme token — brand marks are the exception to rule 2
Rule 2 says theme through tokens, never hard-code. The **exception** is an asset with an
*intrinsic* colour shown on a *specific* ground — a brand mark. The 2one logo is
black-on-light / white-on-dark. Demo it on **fixed** tiles (`bg-white`, `bg-neutral-950`),
never a theme-relative surface — putting the white logo on `bg-foreground` made it
invisible in dark (foreground flips to near-white). In-app marks must be **theme-adaptive**:
swap by `.dark` (`dark:hidden` / `hidden dark:block`) or paint with `currentColor`. A
black logo on the dark sidebar simply vanishes.

## 15. Keep the claims in sync with the capabilities
When you ship (or remove) a capability, fix **every** place that asserts the old state in
the same change. Shipping dark mode meant updating the stale single-theme wording in
`globals.css`, `registry.json`, `AGENTS.md`, the manifest, `.cursorrules`, and the
copilot instructions — a repo that contradicts itself teaches the next reader (and every
AI) the wrong thing. Generated files (`manifest.json`, `graph.json`) regenerate from
source; prose files are updated by hand.

**Definition of Done for a capability change.** A capability change is not done until the
claims match it *and a check enforces the match*:

1. Run `npm run check:claims` — it fails the build if a known-stale phrase (e.g. a
   single-theme claim after dark shipped) survives anywhere in tracked prose/config.
2. Grep the old claim repo-wide in the **same** PR and fix every hit (prose is hand-edited;
   `manifest.json` / `graph.json` regenerate via `npm run build:meta`).
3. If the change introduces a *new* class of stale phrasing, add it to the banned list in
   `scripts/check-claims.mjs` so the same drift can never silently return.

The rule of thumb for this whole repo: **generate it or check it — never hand-maintain a
claim about the repo in prose alone.** See the *Invariants* list in `AGENTS.md`.

## 16. Verify the render, not just the build — in every theme
Compiling and a green audit are **not** "done." **Look** at the page — at multiple widths
(ultrawide/laptop/mobile) **and in both themes** — spot-checking dialogs, inputs, cards,
tables, a chart, and brand marks. The APCA audit passed while the dark destructive button
was unreadable and the logo was invisible; only looking caught them. Run `npm run a11y`
after any token change, and remove dead CSS as you go.

## 17. Change a component's colour with its `variant`, not a `className`
To recolour a component, use its **`variant` prop** (`<Button variant="destructive">`),
never a raw colour utility (`<Button className="bg-destructive">`). `twMerge` de-dupes
*known* conflicting utilities, but a component's base colour often comes from a
`data-slot`/CVA rule that `twMerge` can't see as conflicting — so your `bg-*` className
and the variant's base **both** apply, and the variant usually wins the cascade. A
destructive button written as `className="bg-destructive"` silently rendered as the
primary. Reach for the variant; add a new variant to the component if none fits.

## 18. Critical actions must never require horizontal scroll — use `Toolbar`
An action bar that overflows its width must **wrap**, never hide controls behind an
`overflow-x-auto` scroll. A hand-rolled control bar that used horizontal scroll clipped
its **Leave** button at narrow widths — the one control a user most needs. Compose action
rows from the `Toolbar` primitive (it is `flex-wrap` by default and never scrolls);
`ToolbarSpacer` pushes trailing actions over when there's room and collapses when it wraps.

## 19. A side panel must be reachable at *every* width
Never gate a panel's **only** entry point behind `hidden md:block` — a "People" button
that existed only on desktop was dead on mobile. Render the trigger **always**; switch the
*presentation* (inline on `md+`, a `Sheet` on mobile via the exported `useIsMobile`), not
the *existence*:

```tsx
import { useIsMobile, Sheet, SheetContent, SheetTrigger, Button } from '@yokesh-2one/design-library'

function DetailsPanel({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild><Button variant="outline">People</Button></SheetTrigger>
        <SheetContent side="right">{children}</SheetContent>
      </Sheet>
    )
  }
  return <aside className="w-80 shrink-0 border-l p-4">{children}</aside>   // inline on md+
}
```

## 20. Generated, not asserted — UI data comes from source
Any **count, badge number, or list** shown in the UI must be **derived from the
generated source** (`manifest.json` / `graph.json`), never hand-typed. The canary
we hit: a sidebar badge read **198** while the graph actually held **213** —
the literal froze the day it was typed and the repo moved on. Read the number,
don't write it: `String(manifest.index.templates.charts.count)`,
`String(graphData.nodes.length)`. This is rule 2 ("one token system, no
hard-coded values") extended from colour to **every fact the UI states about
itself**. Machine rule: `no-hardcoded-ui-data` (`rules/ux-rules.json`).

## 21. Monospace is for code, not chrome
Use the **mono** font only for **code blocks and literal commands/paths**
(`npm run a11y`, `tokens/*.json`). Everything else — headers, labels, nav,
prose — uses the UI font (Inter / Satoshi). A monospace header
(`@yokesh-2one/design-library · shadcn · 2one-themed`) reads as a *dev sampler*,
not a product, and quietly undercuts the whole SaaS feel. Machine rule:
`mono-for-code-only`.

## 22. Ship a product, not a sampler — pages, a short menu, a way home
A single long "everything" page is a **sampler, not a product**. Split by
**destination** — Dashboard, Components, Guide, Graph — each its own page. Keep
the **global menu short** and destination-oriented; deep section lists belong
**on the page**, not in the sidebar. A **content/reading page** (an explainer)
doesn't need the app menu at all — a header with the **clickable logo + a
breadcrumb back to the dashboard** is clearer. And every page needs an **obvious
way home** (breadcrumbs + logo). Machine rules: `pages-over-scroll`,
`content-page-chrome`.

## 23. One system across every surface — even bespoke ones
"One product" means **every** surface shares the logo, fonts, tokens and theme —
*including* surfaces that can't be a React component shell, like a data-viz
canvas. When the knowledge graph (`graph.html`) opted out of the shell it still
had to opt **into** the system: the 2one wordmark (theme-adaptive via
`currentColor`), Satoshi/Inter, and the DLS tokens for its chrome. A single
off-system page breaks cohesion more than any missing feature. Machine rule:
`one-system-all-surfaces`.

## 24. Know your checks — and that a green build isn't a rendered page
Different checks prove different things; know which one you're leaning on.
`typecheck` proves types (and **note**: `noUnusedLocals` does **not** cover the
`dev/` sampler — dead imports there won't fail it). The library `build` proves
the package compiles. For a **multi-page app**, **`npm run build:site` is the
definitive correctness check** — it fails on a dangling reference or a missing
export that dev-mode HMR papers over. And none of these prove it *looks* right:
when you can't screenshot (a hidden preview pane), fall back to **DOM /
computed-style checks** — but treat "it builds" and "it renders correctly" as
two separate claims.
