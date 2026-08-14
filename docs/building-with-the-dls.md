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
grayscale, both APCA-audited. Wrap your app in the exported `ThemeProvider` to switch
them (it adds a `.dark` class); don't hand-roll a third palette, a brand hue, or
`data-*` dark hacks. Any token change must pass `npm run a11y` (it audits both themes).

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

## 12. Verify the render, not just the build
Compiling is not "done." Look at the page at **multiple widths** (ultrawide,
laptop, mobile) — check for horizontal overflow and wasted gutters — run
`npm run a11y` after any token change, and remove dead CSS as you go.
