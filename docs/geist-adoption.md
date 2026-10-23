# Geist Design-System Adoption Plan

## Current state

The site already uses the Geist Sans font (`--font-geist-sans`) and Tailwind v4 CSS theme. The remaining gap is the **color/spacing/radius language** — current tokens are teal-forward and slightly warmer than Geist.

## Scope (in order)

1. **Color tokens** — move the `:root`/`.dark` tokens from `styles/globals.css` into `styles/geist-tokens.css`.
2. **Radius** — move from `0.5rem` to Geist's `0.375rem` (6px) for cards/buttons.
3. **Components** — update `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx` to match Geist's flatter, border-heavy style.
4. **Layout spacing** — audit panels for Geist's tighter density.
5. **Motion** — reduce durations; Geist is very restrained.
6. **Dark mode** — the token file already includes a dark palette.

## Status

Token swap is done: `styles/geist-tokens.css` (custom properties only, no Tailwind import) is imported after `styles/globals.css` in `app/layout.tsx`, and the old `:root`/`.dark` blocks are gone from `globals.css`. Radius stays `0.5rem` until the component pass.

## Files to touch

- `styles/globals.css` — remove old token blocks, keep utilities
- `styles/geist-tokens.css` — already drafted
- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/app/panel.tsx`
- `app/page.tsx` — spacing audits

## Recommendation

Do the token swap first in isolation. It will immediately change the whole site's personality. Component-specific polish should be follow-up PRs so we don't mix "global color change" with "button hover state" reviews.
