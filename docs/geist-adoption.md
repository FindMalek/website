# Geist Design-System Adoption Plan

## Current state

The site already uses the Geist Sans font (`--font-geist-sans`) and Tailwind v4 CSS theme. The remaining gap is the **color/spacing/radius language** — current tokens are teal-forward and slightly warmer than Geist.

## Scope (in order)

1. **Color tokens** — replace `:root`/`.dark` blocks in `styles/globals.css` with the mapping in `styles/geist-tokens.css`.
2. **Radius** — move from `0.5rem` to Geist's `0.375rem` (6px) for cards/buttons.
3. **Components** — update `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx` to match Geist's flatter, border-heavy style.
4. **Layout spacing** — audit panels for Geist's tighter density.
5. **Motion** — reduce durations; Geist is very restrained.
6. **Dark mode** — the token file already includes a dark palette.

## How to activate

In `app/layout.tsx`, replace:

```tsx
import "@/styles/globals.css"
```

with:

```tsx
import "@/styles/globals.css"
import "@/styles/geist-tokens.css"
```

Then remove the old `:root` and `.dark` token blocks from `globals.css` so they don't override the new tokens.

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
