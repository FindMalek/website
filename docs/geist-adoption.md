# Geist adoption

The site follows Vercel's Geist rules for type, color, materials and focus, and keeps its own identity: hairline borders, full-bleed guide lines, a sharp boxy feel, a cyan accent in the header, and the serif footer wordmark.

## Adopted rules

| Rule                                                                                                                                           | Where in code                                                                                | Source                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Geist Sans and Geist Mono via the `geist` package (`--font-geist-sans`, `--font-geist-mono`)                                                   | `config/fonts.ts`, `app/layout.tsx`, `--font-sans` and `--font-mono` in `styles/globals.css` | https://vercel.com/font                                  |
| 10-step gray scale plus background 1/2: 100-300 component bg, 400-600 borders, 700-800 high contrast bg, 900 secondary text, 1000 primary text | `styles/geist-tokens.css`, mapped onto the shadcn variable names                             | https://vercel.com/geist/colors                          |
| Gray values (light and dark)                                                                                                                   | `styles/geist-tokens.css`                                                                    | https://vercel.com/geist/vercel-brand.css                |
| Text styles `text-heading-*`, `text-button-*`, `text-label-*`, `text-copy-*`, Strong via nested `<strong>`                                     | `styles/geist-type.css`, merged correctly by `cn` in `lib/utils.ts`                          | https://vercel.com/geist/typography                      |
| Radii 6px base, 12px medium, 16px fullscreen                                                                                                   | `--radius-*` in `styles/globals.css`                                                         | https://vercel.com/geist/materials                       |
| Shadow tiers: small, medium, large, tooltip, menu, modal, fullscreen                                                                           | `--ds-shadow-*` in tokens, `shadow-*` utilities in `styles/globals.css`                      | https://vercel.com/geist/materials                       |
| Draw each border once, gray-alpha only where the edge blends                                                                                   | `--border`, `--input`, `--line` use gray-alpha 400                                           | https://vercel.com/geist/colors                          |
| Focus: 2px solid ring, 2px offset, blue, on every interactive element                                                                          | `:focus-visible` in `styles/globals.css`; ring classes removed from primitives               | https://vercel.com/design.md (focus-visible 2px outline) |
| Motion only explains state; respect reduced motion                                                                                             | `prefers-reduced-motion` block in `styles/globals.css`                                       | https://vercel.com/design.md                             |
| Button heights 24/32/40/48, button-14 label, one secondary treatment                                                                           | `components/ui/button.tsx`                                                                   | https://vercel.com/geist/button                          |
| Monochrome first, color only for meaning                                                                                                       | `--primary` is gray-1000, cyan stays in header and avatar                                    | https://vercel.com/design.md                             |

Not on a page I could fetch: button pixel heights, shadow CSS, and most text style values. Heading 48/64 values come from `design.md`, heading 24/20/16 tracking from `vercel-brand.css`. The rest follow the same pattern and are unverified.

## Contrast

Computed from the oklch tokens (WCAG 2.x). Targets: body 4.5, large 3, UI 3.

| Pair                                         | Light | Dark |
| -------------------------------------------- | ----- | ---- |
| foreground (gray-1000) on background         | 17.9  | 17.9 |
| muted text (gray-900) on background          | 8.5   | 8.0  |
| muted text on gray-100                       | 7.6   | 6.7  |
| primary button text on primary               | 17.9  | 17.9 |
| destructive (red-900) on background          | 5.3   | 6.8  |
| destructive button text on destructive       | 5.3   | 6.8  |
| focus ring (blue) on background              | 4.6   | 8.3  |
| strong border (gray-alpha-700) on background | 3.2   | 5.5  |

Exceptions:

- `--border`, `--line`, `--sidebar-border` are decorative hairlines (1.2:1), exempt.
- `--input` is Geist's default input border (1.2:1), below the 3:1 UI target. Hover uses `--border-strong` (3.2:1) and focus uses the ring. Decide if form fields need the strong border at rest.
- Placeholder text uses `muted-foreground` and passes.

## Not done yet (phase 2)

- Spacing and grid audit of panels beyond the 4px multiples already used.
- Motion audit: the clients marquee, rotating subtitle and card stacks still animate with reduced motion off.
- Marketing heading sizes 72-48 and the `subtle` heading modifier are defined or planned but unused.
- Remaining `text-sm`/`text-xs` in feature components move to label and copy styles.
- Dialog, popover, dropdown and select to the menu and modal shadow tiers.
- Pre-existing axe issues: `link-name` on project card links, `svg-img-alt` on social icons, `user-scalable=no` in the viewport, `scrollable-region-focusable` on `.no-scrollbar`.
