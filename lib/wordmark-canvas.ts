export type Rgb = [number, number, number]

export type Spring = { value: number; velocity: number; target: number }

export type WordmarkPalette = {
  dark: boolean
  background: Rgb
  foreground: Rgb
  brand: Rgb[]
}

// The site's own glow colours (see components/layout/background.tsx).
export const BRAND_STOPS: readonly string[] = [
  "#02ff84",
  "#00c8ff",
  "#00a6ff",
  "#3002ff",
]
const BRAND_STEPS = 64

export const WORDMARK = "FindMalek."
export const WORDMARK_FONT_WEIGHT = 700

const SPRING_STIFFNESS = 150
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS)

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function mixRgb(a: Rgb, b: Rgb, amount: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ]
}

export function toCss([r, g, b]: Rgb, alpha = 1): string {
  return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`
}

export function createSpring(value = 0): Spring {
  return { value, velocity: 0, target: value }
}

export function stepSpring(spring: Spring, dt: number): void {
  const offset = spring.target - spring.value
  spring.velocity +=
    (SPRING_STIFFNESS * offset - SPRING_DAMPING * spring.velocity) * dt
  spring.value += spring.velocity * dt
}

function resolveColor(probe: CanvasRenderingContext2D, color: string): Rgb {
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = color
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

// Canvas can't read theme tokens, so they're resolved to RGB through a probe;
// `stops` lets a caller swap the brand gradient (e.g. for the Tunis sky).
export function readWordmarkPalette(
  el: HTMLElement,
  stops: readonly string[] = BRAND_STOPS
): WordmarkPalette {
  const probeCanvas = document.createElement("canvas")
  probeCanvas.width = BRAND_STEPS
  probeCanvas.height = 1
  const probe = probeCanvas.getContext("2d", { willReadFrequently: true })
  const fallback: WordmarkPalette = {
    dark: true,
    background: [3, 7, 18],
    foreground: [250, 250, 250],
    brand: [[0, 200, 255]],
  }
  if (!probe) return fallback

  const styles = getComputedStyle(el)
  const background = resolveColor(
    probe,
    styles.getPropertyValue("--background").trim() || "#030712"
  )
  const foreground = resolveColor(
    probe,
    styles.getPropertyValue("--foreground").trim() || "#fafafa"
  )
  const dark =
    background[0] * 0.299 + background[1] * 0.587 + background[2] * 0.114 < 128

  const gradient = probe.createLinearGradient(0, 0, BRAND_STEPS, 0)
  stops.forEach((stop, i) =>
    gradient.addColorStop(i / Math.max(1, stops.length - 1), stop)
  )
  probe.clearRect(0, 0, BRAND_STEPS, 1)
  probe.fillStyle = gradient
  probe.fillRect(0, 0, BRAND_STEPS, 1)
  const data = probe.getImageData(0, 0, BRAND_STEPS, 1).data
  const brand: Rgb[] = []
  for (let i = 0; i < BRAND_STEPS; i++) {
    const color: Rgb = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]
    // Neon on white washes out; deepen the same hues for the light theme.
    brand.push(dark ? color : mixRgb(color, [0, 20, 60], 0.35))
  }

  return { dark, background, foreground, brand }
}

export function brandAt(palette: WordmarkPalette, position: number): Rgb {
  return palette.brand[
    Math.round(clamp01(position) * (palette.brand.length - 1))
  ]
}
