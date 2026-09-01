# Decision: expressive "warmth" for consumer / social personas

**Status: OPEN — owner decision required.** This record states a real tension in
the system and lays out the options. It does **not** change any token; the palette
rules stand until this is decided.

## The tension

The colour system is deliberately austere:

> "Grayscale foundation + one brand accent (`--brand`, identity #30A1FF) for
> emphasis only — no other decorative hue." — `tokens/colors.json → rules`

That restraint is exactly right for the personas the system leads with — fintech
and B2B/SaaS, who distrust polish. But `brand/brand.json → personas` also lists:

> "Social networking & accessibility products" (`social-accessibility`)

Applied to a casual, social product, a strictly grayscale + single-accent palette
produces something tasteful but **austere**, and the rules offer no in-system lever
to add warmth — colour is reserved for the one accent plus validation hues. So a
builder targeting the social persona has to *guess* whether that restraint is the
intended answer or a gap. Today the answer is unstated.

## Why it isn't just "add a colour"

A second decorative hue would violate a **non-negotiable** and would have to clear
the APCA audit in both themes (`npm run a11y`) for every pair it touches. This is a
brand-level decision about what the system *is*, not a token tweak — which is why
it is escalated here rather than resolved in a PR.

## Options

1. **Hold the line (no change).** The social persona is served by the same
   restraint; "calm, close-circle" is the intended feel. Cheapest; keeps one
   coherent system. Action: state it in `brand/brand.json`/docs so builders stop
   guessing.
2. **A sanctioned, still-accessible expressive layer.** Define an *optional*
   secondary accent (or a small warm neutral shift) that is APCA-audited, opt-in
   per product, and never the sole signal of state — with explicit rules for where
   it may and may not appear. More work; must not erode the fintech restraint that
   is the system's calling card.
3. **A documented "expressive" theme variant.** Keep the default palette; ship a
   named alternate theme for consumer products, audited independently. Largest
   scope; needs its own token set + audit.

## Interim guidance (until decided)

Default to **Option 1 — restraint**. Build social/consumer surfaces in the
grayscale + single-accent system; do not introduce a second decorative hue or tint
placeholders for warmth (see [`docs/placeholders.md`](../placeholders.md)). If a
product genuinely needs an expressive layer, raise it against this record rather
than inventing an off-system colour.

## Acceptance (to close this)

`brand/brand.json` (or a doc it points to) states, for the `social-accessibility`
persona, whether extra warmth is sanctioned and — if so — exactly how, so builders
don't have to infer it.
