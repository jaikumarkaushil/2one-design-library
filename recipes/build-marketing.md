# Build marketing material

## Landing pages — `src/blocks/marketing/`

Copy-in section templates, built entirely from the library (grayscale, light +
dark, lucide icons). Compose them like `marketing/page.tsx` does:

| Section | File | Built from |
| --- | --- | --- |
| Hero | `hero.tsx` | `Button`, `Badge` |
| Logo cloud | `logo-cloud.tsx` | lucide marks (grayscale) |
| Feature grid | `feature-grid.tsx` | `Card` + lucide icons |
| Stats band | `stats.tsx` | `Separator` |
| Testimonial | `testimonial.tsx` | `Card`, `Avatar` |
| Pricing | `pricing.tsx` | `Card`, `Badge`, `Button` |
| FAQ | `faq.tsx` | `Accordion` |
| CTA banner | `cta-banner.tsx` | `Button` (inverted `bg-foreground` panel) |
| Footer | `footer.tsx` | `Logo`, `Separator` |
| **Full page** | `page.tsx` | composes all of the above |

Rules: one primary pill CTA per section; full-bleed sections with content capped
at `max-w-7xl mx-auto`; grayscale-founded with the one brand accent (`--brand`) for
emphasis only — the primary CTA stays grayscale; the `Logo` is theme-adaptive
(`dark:hidden` / `hidden dark:block`). Edit the copy — the components stay.

## Brand assets

Marketing assets use the **brand** layer, not the interactive components.

- **Logo:** `brand/logo/svg/` (vector, for print/large) and `brand/logo/png/`
  (256/512/1024w, for raster). Rules in `brand/logo/manifest.json`: black on
  light, white on dark, no recolor/rotate/effects, min width 96px.
- **Colors & type:** pull from `tokens/colors.css` and `tokens/typography.css`
  so campaigns match the product exactly (grayscale-founded + the one brand accent
  `--brand` / `#30A1FF` for emphasis; danger/success are the validation-only hues).
- Keep the logo's clear space (½ its height) on all sides.
