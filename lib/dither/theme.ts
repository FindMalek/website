/**
 * The dither design system's colour tokens. Dark is the README profile
 * generator's palette verbatim; light is the same ramp as ink on paper.
 * Scenes read these instead of defining their own colours.
 */
export type DitherTheme = {
  /** Scene background. */
  bg: string
  /** Translucent backing under glyphs so they read over bright dither. */
  plate: string
  /** Six-step palette, step 0 first (step 0 is the background). */
  palette: number[][]
  /** Glyph inks from least to most visible. */
  ink: string[]
  /** Light themes read darkest-is-strongest, so lit things map to the faint end. */
  invert: boolean
}

const rgb = (hex: string): number[] =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

export const DITHER_DARK: DitherTheme = {
  bg: "#0c1017",
  plate: "rgba(12,16,23,0.55)",
  palette: ["#0c1017", "#1b2a44", "#24457f", "#2f66c9", "#5b95f0", "#a9c8ff"].map(rgb),
  ink: ["#24457f", "#2f66c9", "#5b95f0", "#8fb4f6", "#c9dbff", "#ffffff"],
  invert: false,
}

export const DITHER_LIGHT: DitherTheme = {
  bg: "#f6f9ff",
  plate: "rgba(246,249,255,0.55)",
  palette: ["#f6f9ff", "#dbe6fb", "#b3cdf8", "#7fa9f0", "#4b80de", "#2c58b0"].map(rgb),
  ink: ["#b3cdf8", "#7fa9f0", "#4b80de", "#2c58b0", "#1b3f8a", "#10285c"],
  invert: true,
}

export const MONO_DARK: DitherTheme = {
  bg: "#0c0c0c",
  plate: "rgba(12,12,12,0.55)",
  palette: ["#0c0c0c", "#262626", "#444444", "#6b6b6b", "#a0a0a0", "#e6e6e6"].map(rgb),
  ink: ["#444444", "#6b6b6b", "#8e8e8e", "#b8b8b8", "#dcdcdc", "#ffffff"],
  invert: false,
}

export const MONO_LIGHT: DitherTheme = {
  bg: "#f6f6f6",
  plate: "rgba(246,246,246,0.55)",
  palette: ["#f6f6f6", "#e0e0e0", "#bdbdbd", "#8c8c8c", "#555555", "#222222"].map(rgb),
  ink: ["#bdbdbd", "#8c8c8c", "#666666", "#444444", "#2a2a2a", "#111111"],
  invert: true,
}

/** True when the visitor has switched on the black-and-white mode. */
export const isMonochrome = (): boolean =>
  typeof document !== "undefined" && document.documentElement.classList.contains("mono")

export const ditherTheme = (dark: boolean): DitherTheme =>
  isMonochrome() ? (dark ? MONO_DARK : MONO_LIGHT) : dark ? DITHER_DARK : DITHER_LIGHT

/** The README generator's 4x4 Bayer matrix, raw ranks 0 to 15. */
export const BAYER4_RANKS = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

/**
 * README-exact quantiser: tone 0..1 to a palette step through a 4x4 Bayer
 * threshold. Returns 0 below the generator's 0.025 cutoff.
 */
export function readmeStep(tone: number, col: number, row: number, levels: number): number {
  if (tone < 0.025) return 0
  const scaled = tone * (levels - 1)
  const base = Math.floor(scaled)
  const th = BAYER4_RANKS[(row & 3) * 4 + (col & 3)] / 16
  return Math.min(levels - 1, base + (scaled - base > th ? 1 : 0))
}
