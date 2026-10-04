"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

import { purplePurse } from "@/config/fonts"

type Rgb = [number, number, number]

type Field = {
  cell: number
  columns: number
  rows: number
  width: number
  height: number
  coverage: Float32Array
  phase: Float32Array
  inked: Int32Array
}

type Palette = {
  dark: boolean
  background: Rgb
  foreground: Rgb
  brand: Rgb[]
}

type Spring = { value: number; velocity: number; target: number }

type Ripple = { x: number; y: number; start: number }

const WORDMARK = "FindMalek."
const FONT_WEIGHT = 700
const MAX_FIGURE_WIDTH = 1600
const SIDE_MARGIN = 0.04
const TOP_PADDING = 0.14

const MIN_CELL = 3
const MAX_CELL = 6.5
const CELLS_ACROSS = 240
const SQUARE_FILL = 0.92

// Ink thins toward the floor so the letters dissolve instead of ending hard.
const INK_TOP = 1
const INK_BOTTOM = 0.14

const LENS_RADIUS = 120
const RIPPLE_SPEED = 1100
const RIPPLE_WIDTH = 46
const RIPPLE_LIFETIME = 1.5
const PRINT_DURATION = 1.5
const PRINT_SOFTNESS = 0.08

const TWINKLE_SHARE = 0.18
const TWINKLE_SPEED = 0.55
const TWINKLE_SHARPNESS = 90

const SPRING_STIFFNESS = 150
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS)

// The site's own glow colours (see components/layout/background.tsx).
const BRAND_STOPS = ["#02ff84", "#00c8ff", "#00a6ff", "#3002ff"]
const BRAND_STEPS = 64

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function mixRgb(a: Rgb, b: Rgb, amount: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ]
}

function toCss([r, g, b]: Rgb, alpha = 1): string {
  return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`
}

function stepSpring(spring: Spring, dt: number): void {
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

function readPalette(el: HTMLElement): Palette {
  const probeCanvas = document.createElement("canvas")
  probeCanvas.width = BRAND_STEPS
  probeCanvas.height = 1
  const probe = probeCanvas.getContext("2d", { willReadFrequently: true })
  const styles = getComputedStyle(el)
  const fallback: Palette = {
    dark: true,
    background: [3, 7, 18],
    foreground: [250, 250, 250],
    brand: [[0, 200, 255]],
  }
  if (!probe) return fallback

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
  BRAND_STOPS.forEach((stop, i) =>
    gradient.addColorStop(i / (BRAND_STOPS.length - 1), stop)
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

// The wordmark is typeset once into a canvas the size of the cell grid, so
// each pixel's alpha is that cell's ink coverage.
function buildField(width: number, family: string): Field {
  const cell = Math.min(MAX_CELL, Math.max(MIN_CELL, width / CELLS_ACROSS))
  const columns = Math.ceil(width / cell)
  const figure = Math.min(width, MAX_FIGURE_WIDTH) / cell
  const textWidth = figure * (1 - SIDE_MARGIN * 2)

  const sizer = document.createElement("canvas").getContext("2d")
  const font = (size: number): string => `${FONT_WEIGHT} ${size}px ${family}`
  let ascent = 0.72
  let fontSize = 1
  if (sizer) {
    sizer.font = font(100)
    const metrics = sizer.measureText(WORDMARK)
    fontSize = (100 * textWidth) / metrics.width
    ascent = metrics.actualBoundingBoxAscent / 100
  }

  const capCells = ascent * fontSize
  const top = Math.ceil(capCells * TOP_PADDING)
  const rows = Math.ceil(capCells) + top + 1
  const coverage = new Float32Array(columns * rows)
  const phase = new Float32Array(columns * rows)

  const mask = document.createElement("canvas")
  mask.width = columns
  mask.height = rows
  const maskCtx = mask.getContext("2d", { willReadFrequently: true })
  if (maskCtx) {
    maskCtx.font = font(fontSize)
    maskCtx.textBaseline = "alphabetic"
    maskCtx.fillStyle = "#000"
    maskCtx.fillText(WORDMARK, (columns - textWidth) / 2, top + capCells)
    const data = maskCtx.getImageData(0, 0, columns, rows).data
    for (let i = 0; i < columns * rows; i++) {
      coverage[i] = data[i * 4 + 3] / 255
    }
  }

  const inked: number[] = []
  for (let i = 0; i < columns * rows; i++) {
    if (coverage[i] > 0.04) inked.push(i)
    phase[i] = Math.random() < TWINKLE_SHARE ? Math.random() * Math.PI * 2 : -1
  }

  return {
    cell,
    columns,
    rows,
    width,
    height: rows * cell,
    coverage,
    phase,
    inked: Int32Array.from(inked),
  }
}

export function FooterWordmark() {
  const reduceMotion = useReducedMotion() ?? false
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!wrapper || !canvas || !ctx) return

    const family = purplePurse.style.fontFamily
    const lensX: Spring = { value: 0, velocity: 0, target: 0 }
    const lensY: Spring = { value: 0, velocity: 0, target: 0 }
    const presence: Spring = { value: 0, velocity: 0, target: 0 }
    const ripples: Ripple[] = []

    let field: Field | null = null
    let palette = readPalette(wrapper)
    let printStart: number | null = reduceMotion ? 0 : null
    let frame: number | null = null
    let lastTime = 0
    let visible = false
    let disposed = false

    const draw = (now: number): void => {
      if (!field) return
      const { cell, columns, rows, width, height, coverage, phase, inked } =
        field
      const dpr = window.devicePixelRatio || 1
      const seconds = now / 1000
      const lensAmount = reduceMotion ? 0 : presence.value
      const printed =
        printStart === null
          ? 0
          : reduceMotion
            ? 1 + PRINT_SOFTNESS
            : ((now - printStart) / 1000 / PRINT_DURATION) *
              (1 + PRINT_SOFTNESS)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      if (lensAmount > 0.01) {
        const brand =
          palette.brand[
            Math.round(clamp01(lensX.value / width) * (BRAND_STEPS - 1))
          ]
        const glow = ctx.createRadialGradient(
          lensX.value,
          lensY.value,
          0,
          lensX.value,
          lensY.value,
          LENS_RADIUS * 1.6
        )
        glow.addColorStop(
          0,
          toCss(brand, (palette.dark ? 0.22 : 0.12) * lensAmount)
        )
        glow.addColorStop(1, toCss(brand, 0))
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)

        // The lens also surfaces the empty grid the letters are printed on.
        const reach = Math.ceil((LENS_RADIUS * 1.2) / cell)
        const cx = Math.floor(lensX.value / cell)
        const cy = Math.floor(lensY.value / cell)
        const yEnd = Math.min(rows, cy + reach)
        const xEnd = Math.min(columns, cx + reach)
        for (let y = Math.max(0, cy - reach); y < yEnd; y++) {
          for (let x = Math.max(0, cx - reach); x < xEnd; x++) {
            if (coverage[y * columns + x] > 0.04) continue
            const dx = (x + 0.5) * cell - lensX.value
            const dy = (y + 0.5) * cell - lensY.value
            const falloff = Math.exp(
              -(dx * dx + dy * dy) / (LENS_RADIUS * LENS_RADIUS)
            )
            if (falloff < 0.05) continue
            ctx.fillStyle = toCss(
              palette.foreground,
              0.28 * falloff * lensAmount
            )
            ctx.fillRect((x + 0.5) * cell - 0.5, (y + 0.5) * cell - 0.5, 1, 1)
          }
        }
      }

      for (let n = 0; n < inked.length; n++) {
        const i = inked[n]
        const x = i % columns
        const y = (i / columns) | 0
        const depth = y / rows

        const reveal = clamp01((printed - depth) / PRINT_SOFTNESS)
        if (reveal <= 0) continue

        const px = (x + 0.5) * cell
        const py = (y + 0.5) * cell
        const ink = INK_TOP + (INK_BOTTOM - INK_TOP) * Math.pow(depth, 1.6)
        let glow = 0
        if (lensAmount > 0.01) {
          const dx = px - lensX.value
          const dy = py - lensY.value
          glow =
            lensAmount *
            Math.exp(-(dx * dx + dy * dy) / (LENS_RADIUS * LENS_RADIUS))
        }
        for (const ripple of ripples) {
          const age = (now - ripple.start) / 1000
          const dx = px - ripple.x
          const dy = py - ripple.y
          const ring =
            (Math.sqrt(dx * dx + dy * dy) - age * RIPPLE_SPEED) / RIPPLE_WIDTH
          const fade = 1 - age / RIPPLE_LIFETIME
          glow = Math.max(glow, Math.exp(-ring * ring) * fade * fade)
        }
        let twinkle = 0
        if (!reduceMotion && phase[i] >= 0) {
          twinkle = Math.pow(
            Math.max(0, Math.sin(seconds * TWINKLE_SPEED + phase[i])),
            TWINKLE_SHARPNESS
          )
        }

        const density = Math.sqrt(coverage[i] * ink)
        const size =
          cell *
          SQUARE_FILL *
          Math.min(1, density + (1 - density) * glow) *
          reveal
        if (size < 0.6) continue

        const brand =
          palette.brand[Math.round((px / width) * (BRAND_STEPS - 1))]
        const base = mixRgb(
          palette.background,
          palette.foreground,
          0.2 + 0.62 * ink
        )
        const color = mixRgb(base, brand, Math.min(1, glow + twinkle * 0.85))
        ctx.fillStyle = toCss(color)
        ctx.fillRect(px - size / 2, py - size / 2, size, size)
      }

      if (printStart !== null && printed < 1 + PRINT_SOFTNESS) {
        const scanY = printed * height
        const brand = palette.brand[Math.round(BRAND_STEPS / 2)]
        const beam = ctx.createLinearGradient(0, 0, width, 0)
        beam.addColorStop(0, toCss(brand, 0))
        beam.addColorStop(0.5, toCss(brand, 0.9))
        beam.addColorStop(1, toCss(brand, 0))
        ctx.fillStyle = beam
        ctx.fillRect(0, scanY, width, 1)
        const trail = ctx.createLinearGradient(0, scanY - cell * 6, 0, scanY)
        trail.addColorStop(0, toCss(brand, 0))
        trail.addColorStop(1, toCss(brand, 0.1))
        ctx.fillStyle = trail
        ctx.fillRect(0, scanY - cell * 6, width, cell * 6)
      }
    }

    const tick = (now: number): void => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now
      stepSpring(presence, dt)
      stepSpring(lensX, dt)
      stepSpring(lensY, dt)
      while (
        ripples.length &&
        (now - ripples[0].start) / 1000 > RIPPLE_LIFETIME
      ) {
        ripples.shift()
      }
      draw(now)
      frame = visible ? requestAnimationFrame(tick) : null
    }

    const wake = (): void => {
      if (frame !== null || !visible || reduceMotion) return
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const layout = (): void => {
      const dpr = window.devicePixelRatio || 1
      field = buildField(wrapper.clientWidth, family)
      canvas.width = Math.round(field.width * dpr)
      canvas.height = Math.round(field.height * dpr)
      canvas.style.height = `${field.height}px`
      draw(performance.now())
    }

    const localPoint = (event: PointerEvent): [number, number] => {
      const rect = canvas.getBoundingClientRect()
      return [event.clientX - rect.left, event.clientY - rect.top]
    }

    const handleMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return
      const [x, y] = localPoint(event)
      if (presence.target === 0) {
        lensX.value = x
        lensY.value = y
      }
      lensX.target = x
      lensY.target = y
      presence.target = 1
    }

    const handleLeave = (): void => {
      presence.target = 0
    }

    const handleDown = (event: PointerEvent): void => {
      const [x, y] = localPoint(event)
      ripples.push({ x, y, start: performance.now() })
    }

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && printStart === null && entry.intersectionRatio > 0.4) {
          printStart = performance.now()
        }
        wake()
      },
      { threshold: [0, 0.4] }
    )
    const sizing = new ResizeObserver(layout)
    const theme = new MutationObserver(() => {
      palette = readPalette(wrapper)
      draw(performance.now())
    })

    // Typesetting before the serif arrives would bake the fallback font into
    // the grid, so the first layout waits for it.
    document.fonts
      .load(`${FONT_WEIGHT} 100px ${family}`)
      .catch(() => undefined)
      .then(() => {
        if (disposed) return
        layout()
        sizing.observe(wrapper)
        visibility.observe(canvas)
      })

    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })
    if (!reduceMotion) {
      canvas.addEventListener("pointermove", handleMove)
      canvas.addEventListener("pointerleave", handleLeave)
      canvas.addEventListener("pointerdown", handleDown)
    }

    return () => {
      disposed = true
      visibility.disconnect()
      sizing.disconnect()
      theme.disconnect()
      canvas.removeEventListener("pointermove", handleMove)
      canvas.removeEventListener("pointerleave", handleLeave)
      canvas.removeEventListener("pointerdown", handleDown)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <div className="screen-line-top screen-line-bottom">
      <div
        ref={wrapperRef}
        className="relative left-1/2 w-screen -translate-x-1/2"
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-pan-y"
          role="img"
          aria-label="FindMalek."
        />
      </div>
    </div>
  )
}
