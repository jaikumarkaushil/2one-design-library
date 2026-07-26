# Build marketing material

Marketing assets use the **brand** layer, not the interactive components.

- **Logo:** `brand/logo/svg/` (vector, for print/large) and `brand/logo/png/`
  (256/512/1024w, for raster). Rules in `brand/logo/manifest.json`: black on
  light, white on dark, no recolor/rotate/effects, min width 96px.
- **Colors & type:** pull from `tokens/colors.css` and `tokens/typography.css`
  so campaigns match the product exactly (grayscale system; danger/success are
  the only hues).
- Keep the logo's clear space (½ its height) on all sides.
