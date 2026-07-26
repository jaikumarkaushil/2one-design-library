# Build a slide deck

Slides (Keynote / PowerPoint / Google Slides) don't run React — use the static
brand assets and token values.

- **Logo:** drop `brand/logo/png/2one-logo-black-1024w.png` (or the white version
  on dark slides) onto the title/closing slides. SVG works in Google Slides.
- **Palette:** use the hex values from `tokens/colors.css` for shapes/text so the
  deck matches the product (e.g. neutral-950 `#09090b` for headings).
- **Type:** Satoshi Bold for headings, Inter for body (see `tokens/typography.css`).
- Respect the logo rules in `brand/logo/manifest.json`.
