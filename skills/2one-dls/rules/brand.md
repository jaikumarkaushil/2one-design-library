# Brand rules — logo, colour, voice

Checked by `npx 2one check`. Rule ids in brackets.

## The wordmark is an asset, never type `[typeset-wordmark]`

The most common way 2one output goes off-brand. Typesetting the name in Satoshi
looks *nearly* right, which is why it survives review.

❌ **Wrong** — the name as text
```tsx
<h1 className="font-heading text-2xl font-bold">2one</h1>
<span className="text-xl font-bold tracking-tight">2one</span>
```

❌ **Wrong** — a generic icon standing in for the mark `[placeholder-brand-mark]`
```tsx
import { GalleryVerticalEnd } from "lucide-react"

<a href="/">
  <GalleryVerticalEnd className="size-6" />
  <span className="sr-only">2one</span>
</a>
```

✅ **Right** — React
```tsx
import { Logo } from "@2one/design-library"

<Logo width={96} />                     {/* light surfaces */}
<Logo variant="white" width={96} />     {/* dark surfaces */}
```

✅ **Right** — non-React output: inline the SVG
```
https://raw.githubusercontent.com/yokesh-2one/2one-design-library/main/brand/logo/svg/2one-logo-black.svg
https://raw.githubusercontent.com/yokesh-2one/2one-design-library/main/brand/logo/svg/2one-logo-white.svg
```

`Logo` has **no colour prop by design** — the mark cannot be recoloured by
accident. Never recolour, rotate, distort, or add effects. Minimum width 96px,
clear space 0.5× the logo height.

`sr-only` text naming a logo link is correct accessibility practice, not a
violation — pair it with the real mark, not instead of it.

**In-app marks must be theme-adaptive.** A black logo vanishes on a dark
sidebar. Swap by theme (`dark:hidden` / `hidden dark:block`) or paint with
`currentColor`. When *demonstrating* the logo, put it on a fixed tile
(`bg-white`, `bg-neutral-950`) — never a theme-relative surface, or the white
mark disappears when `--background` flips.

## Grayscale foundation + one accent `[foreign-palette]` `[hardcoded-color]`

The system is grayscale-founded. There is exactly **one** brand hue — the accent
`--brand` (identity `#30A1FF`) — and it is for **emphasis only**: links, the focus
ring, selection/active indicators. It never fills a primary action (primary stays
grayscale) and it is never the sole carrier of state. `danger` and `success` are
the validation-only hues — never decoration, never "success green" for a status
chip that isn't a validation result. A raw tailwind hue (`bg-blue-600`) or a
hardcoded hex is still wrong: reach the accent through the token, never a literal.

❌ **Wrong**
```tsx
<div className="bg-blue-600 text-white">…</div>   {/* raw hue, and a blue-filled block is not the accent's job */}
<Button className="bg-blue-600">Save</Button>      {/* primary stays grayscale — accent never fills the primary */}
<Badge className="bg-emerald-500">Active</Badge>
<CheckIcon className="fill-green-500" />
<div style={{ background: "#30A1FF" }}>…</div>      {/* even the brand hex goes through the token, not a literal */}
```

✅ **Right**
```tsx
<div className="bg-primary text-primary-foreground">…</div>
<a className="text-brand underline">Learn more</a>   {/* the accent, for emphasis, via the token */}
<Button>Save</Button>                                {/* grayscale primary pill */}
<Badge variant="secondary">Active</Badge>
<CheckIcon className="fill-current" />
```

Theme through the semantic tokens — `background`, `foreground`, `card`, `muted`,
`muted-foreground`, `primary`, `brand`, `border`, `ring`, `destructive`, `success`.
Never a raw hex, never a second palette. Exact values: `tokens/colors.json`.

## Buttons are pills

The 2one signature, enforced by an unlayered `[data-slot="button"]` rule in
`globals.css` that beats the Tailwind utility. You get it for free — do not
add `rounded-*` to a Button, and do not "fix" a size variant that carries
`rounded-md`; the override already wins.

## Icons: lucide only `[foreign-icons]`

❌ `@tabler/icons-react`, `react-icons`, `@heroicons/react`, hand-drawn SVG glyphs
✅ `lucide-react`

A second icon set is one of the most visible "AI-generated" tells. Icons inherit
`currentColor` and default to `size-4` inside a Button.

## Voice

Minimalistic · Contemporary · Empathetic · Bold · Factual.

Pull tone, vocabulary, and the writing rules from `brand/brand.json` — do not
approximate them. Tighten wordy prose. No exclamation marks, no hype, no
invented product claims. If a fact about 2one is not in the repo, say so rather
than producing something plausible.
