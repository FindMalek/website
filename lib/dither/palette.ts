import {
  brandAt,
  clamp01,
  mixRgb,
  readWordmarkPalette,
  type Rgb,
  type WordmarkPalette,
} from "@/lib/wordmark-canvas"

export type DitherPalette = WordmarkPalette

export const readDitherPalette = (el: HTMLElement): DitherPalette =>
  readWordmarkPalette(el)

/**
 * Colour for one dithered level. Level 0 is transparent in the pixel
 * surfaces; every other level mixes the page background toward the brand
 * gradient, so the same ramp reads as a glow in dark mode and as ink in light.
 */
export function ditherColor(
  palette: DitherPalette,
  level: number,
  levels: number,
  position: number
): Rgb {
  const strength = 0.22 + 0.78 * (level / Math.max(1, levels - 1))
  return mixRgb(palette.background, brandAt(palette, position), strength)
}

export { brandAt, clamp01, mixRgb }
export type { Rgb }

/** Re-run `cb` whenever the theme class/attributes on <html> change. */
export function watchTheme(cb: () => void): () => void {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  })
  return () => observer.disconnect()
}
