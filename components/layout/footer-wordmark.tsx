"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

import { geistMono, purplePurse } from "@/config/fonts"
import { subscribeChatActivity } from "@/lib/chat-activity"
import { getTunisDaylight, getTunisSky, type TunisSky } from "@/lib/tunis-sky"
import {
  brandAt,
  clamp01,
  createSpring,
  mixRgb,
  readWordmarkPalette,
  stepSpring,
  toCss,
  WORDMARK,
  WORDMARK_FONT_WEIGHT,
  type Rgb,
  type Spring,
  type WordmarkPalette,
} from "@/lib/wordmark-canvas"

type Grid = {
  cols: number
  rows: number
  cellW: number
  cellH: number
  font: string
  wordLeft: number
  wordCols: number
  wordRows: number
  contentLeft: number
  contentRight: number
  fadeReach: number
  horizon: number
  coverage: Float32Array
  normalX: Float32Array
  normalY: Float32Array
  normalZ: Float32Array
  starPhase: Float32Array
  edgeJitter: Float32Array
}

type Ripple = { x: number; y: number; start: number; strength: number }

type Celestial = { x: number; y: number; sun: boolean; strength: number }

type Content = { width: number; left: number }

const WORD_RAMP = " .:-=+*%#@"
const SUN_DISK = "oO@"
const RAY_CHARS = ["-", "/", "|", "\\"]
const SUN_RAYS = 8
const RAY_STEPS = [1.5, 1.95]

const SKY_ROWS = 8
const SEA_ROWS = 7
const LINE_HEIGHT = 1.18
const FONT_MIN = 5
const FONT_MAX = 11
const FONT_DIVISOR = 104
const WORD_WIDTH = 0.96
const SUPERSAMPLE = 4
const BEVEL_RADIUS = 1.4
const BEVEL_DEPTH = 2.6
const STAR_SHARE = 0.03

// Thin serif strokes vanish at character resolution, so letters are read
// from the blurred field instead of raw ink, which fattens them slightly.
const STROKE_THRESHOLD = 0.16
const STROKE_SOFTNESS = 0.28

const LIGHT_HEIGHT = 380
const AMBIENT = 0.32
const SPOT_REACH = 170
const SUN_RADIUS = 2.1
const MOON_RADIUS = 2.3

const RIPPLE_SPEED = 22
const RIPPLE_WIDTH = 1.4
const RIPPLE_LIFETIME = 2.2
const WAKE_INTERVAL_MS = 120
const FRAME_INTERVAL = 1000 / 30
const SKY_REFRESH_MS = 60_000

function smoothstep(value: number): number {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function boxBlur(
  source: Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  const horizontal = new Float32Array(source.length)
  const out = new Float32Array(source.length)
  const span = radius * 2 + 1
  for (let y = 0; y < height; y++) {
    let sum = 0
    for (let x = -radius; x <= radius; x++) {
      sum += source[y * width + Math.min(width - 1, Math.max(0, x))]
    }
    for (let x = 0; x < width; x++) {
      horizontal[y * width + x] = sum / span
      const add = Math.min(width - 1, x + radius + 1)
      const drop = Math.max(0, x - radius)
      sum += source[y * width + add] - source[y * width + drop]
    }
  }
  for (let x = 0; x < width; x++) {
    let sum = 0
    for (let y = -radius; y <= radius; y++) {
      sum += horizontal[Math.min(height - 1, Math.max(0, y)) * width + x]
    }
    for (let y = 0; y < height; y++) {
      out[y * width + x] = sum / span
      const add = Math.min(height - 1, y + radius + 1)
      const drop = Math.max(0, y - radius)
      sum += horizontal[add * width + x] - horizontal[drop * width + x]
    }
  }
  return out
}

// The scene spans the viewport but the word is sized to the content column;
// its blurred coverage doubles as a height map for per-cell bevel normals.
function buildGrid(
  width: number,
  content: Content,
  serif: string,
  mono: string,
  weight: number
): Grid {
  const fontSize = Math.min(
    FONT_MAX,
    Math.max(FONT_MIN, content.width / FONT_DIVISOR)
  )
  const font = `${weight} ${fontSize}px ${mono}`
  const probe = document.createElement("canvas").getContext("2d")
  let cellW = fontSize * 0.6
  let wordWidth = 1
  let ascent = 0.7
  if (probe) {
    probe.font = font
    cellW = probe.measureText("M").width
    probe.font = `${WORDMARK_FONT_WEIGHT} 100px ${serif}`
    const metrics = probe.measureText(WORDMARK)
    wordWidth = metrics.width / 100
    ascent = metrics.actualBoundingBoxAscent / 100
  }
  const cellH = Math.round(fontSize * LINE_HEIGHT)
  const cols = Math.ceil(width / cellW)
  const aspect = cellW / cellH

  const contentLeft = Math.floor(content.left / cellW)
  const contentRight = Math.ceil((content.left + content.width) / cellW)
  const wordCols = Math.floor((contentRight - contentLeft) * WORD_WIDTH)
  const wordLeft =
    contentLeft + Math.floor((contentRight - contentLeft - wordCols) / 2)
  const serifSize = wordCols / wordWidth
  const wordRows = Math.ceil(ascent * serifSize * aspect) + 1
  const rows = SKY_ROWS + wordRows + SEA_ROWS

  const maskW = wordCols * SUPERSAMPLE
  const maskH = wordRows * SUPERSAMPLE
  const mask = document.createElement("canvas")
  mask.width = maskW
  mask.height = maskH
  const maskCtx = mask.getContext("2d", { willReadFrequently: true })
  const fine = new Float32Array(maskW * maskH)
  if (maskCtx) {
    maskCtx.setTransform(SUPERSAMPLE, 0, 0, SUPERSAMPLE * aspect, 0, 0)
    maskCtx.font = `${WORDMARK_FONT_WEIGHT} ${serifSize}px ${serif}`
    maskCtx.textBaseline = "alphabetic"
    maskCtx.fillStyle = "#000"
    maskCtx.fillText(WORDMARK, 0, (wordRows - 0.35) / aspect)
    const data = maskCtx.getImageData(0, 0, maskW, maskH).data
    for (let i = 0; i < fine.length; i++) fine[i] = data[i * 4 + 3] / 255
  }

  const radius = Math.max(1, Math.round(BEVEL_RADIUS * SUPERSAMPLE))
  const height = boxBlur(
    boxBlur(fine, maskW, maskH, radius),
    maskW,
    maskH,
    radius
  )
  const sample = (x: number, y: number): number =>
    height[
      Math.min(maskH - 1, Math.max(0, y)) * maskW +
        Math.min(maskW - 1, Math.max(0, x))
    ]

  const cells = wordCols * wordRows
  const coverage = new Float32Array(cells)
  const normalX = new Float32Array(cells)
  const normalY = new Float32Array(cells)
  const normalZ = new Float32Array(cells)
  const step = SUPERSAMPLE / 2
  for (let row = 0; row < wordRows; row++) {
    for (let col = 0; col < wordCols; col++) {
      const i = row * wordCols + col
      const cx = col * SUPERSAMPLE + step
      const cy = row * SUPERSAMPLE + step
      coverage[i] = clamp01(
        (sample(cx, cy) - STROKE_THRESHOLD) / STROKE_SOFTNESS
      )
      const gx = (sample(cx + step, cy) - sample(cx - step, cy)) / cellW
      const gy = (sample(cx, cy + step) - sample(cx, cy - step)) / cellH
      const nx = -gx * BEVEL_DEPTH * cellW
      const ny = -gy * BEVEL_DEPTH * cellW
      const length = Math.hypot(nx, ny, 1)
      normalX[i] = nx / length
      normalY[i] = ny / length
      normalZ[i] = 1 / length
    }
  }

  const starPhase = new Float32Array(cols * SKY_ROWS)
  for (let i = 0; i < starPhase.length; i++) {
    starPhase[i] = Math.random() < STAR_SHARE ? Math.random() * Math.PI * 2 : -1
  }
  const edgeJitter = new Float32Array(rows)
  for (let row = 0; row < rows; row++) {
    edgeJitter[row] =
      Math.sin(row * 0.9) * 0.35 +
      Math.sin(row * 2.3 + 1.7) * 0.2 +
      (hash(row, 7) - 0.5) * 0.5
  }

  return {
    cols,
    rows,
    cellW,
    cellH,
    font,
    wordLeft,
    wordCols,
    wordRows,
    contentLeft,
    contentRight,
    fadeReach: Math.max(6, Math.min(contentLeft, cols - contentRight) * 0.85),
    horizon: SKY_ROWS + wordRows,
    coverage,
    normalX,
    normalY,
    normalZ,
    starPhase,
    edgeJitter,
  }
}

function dayOfYear(date: Date): number {
  return (
    Math.floor(
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 1)) /
        86_400_000
    ) + 1
  )
}

// The real sun (or moon) over Tunis, arcing left to right through the sky
// band above the word so it never breaks the letterforms.
function placeCelestial(sky: TunisSky, grid: Grid, now: Date): Celestial {
  const [hours, minutes] = sky.time.split(":").map(Number)
  const hour = hours + minutes / 60
  const { sunrise, sunset } = getTunisDaylight(dayOfYear(now))
  const sun = hour >= sunrise && hour <= sunset
  const progress = sun
    ? (hour - sunrise) / (sunset - sunrise)
    : ((hour - sunset + 24) % 24) / (24 - (sunset - sunrise))
  const left = grid.contentLeft * grid.cellW
  const span = (grid.contentRight - grid.contentLeft) * grid.cellW
  const low = (SKY_ROWS - 2.4) * grid.cellH
  const high = 2.6 * grid.cellH
  return {
    x: left - span * 0.1 + span * 1.2 * progress,
    y: low - Math.sin(progress * Math.PI) * (low - high),
    sun,
    strength: sun ? 1 : 0.6,
  }
}

export function FooterWordmark() {
  const reduceMotion = useReducedMotion() ?? false
  const measureRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const measure = measureRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!measure || !canvas || !ctx) return

    const serif = purplePurse.style.fontFamily
    const mono = geistMono.style.fontFamily
    const lightX: Spring = createSpring()
    const lightY: Spring = createSpring()
    const spot: Spring = createSpring()
    const wake: Spring = createSpring()
    const ripples: Ripple[] = []

    let grid: Grid | null = null
    let sky = getTunisSky()
    let palette: WordmarkPalette = readWordmarkPalette(measure, sky.stops)
    let celestial: Celestial | null = null
    let wordLight = new Float32Array(0)
    let glitter = 0
    let lastWake = 0
    let frame: number | null = null
    let lastTime = 0
    let lastDraw = 0
    let visible = false
    let disposed = false

    const updateCelestial = (): void => {
      if (!grid) return
      celestial = placeCelestial(sky, grid, new Date())
      if (spot.target === 0) {
        lightX.target = celestial.x
        lightY.target = celestial.y
      }
    }

    // Dark theme: light pushes ink toward the bright hue. Light theme: toward
    // a deep, near-foreground version of it, so characters stay crisp on white.
    const inkFor = (hue: Rgb, level: number): Rgb => {
      const { background, foreground, dark } = palette
      if (dark) {
        return mixRgb(
          mixRgb(background, hue, clamp01(0.4 + 0.6 * level)),
          foreground,
          Math.max(0, level - 0.72) * 1.6
        )
      }
      const deepHue = mixRgb(hue, foreground, 0.35)
      return mixRgb(background, deepHue, clamp01(0.45 + 0.55 * level))
    }

    const wordInk = (hue: Rgb, shade: number): Rgb => {
      const { background, foreground, dark } = palette
      if (dark) {
        return mixRgb(
          mixRgb(background, hue, 0.55 + 0.45 * shade),
          foreground,
          Math.max(0, shade - 0.72) * 1.8
        )
      }
      return mixRgb(foreground, hue, 0.2 + 0.5 * shade)
    }

    const draw = (now: number): void => {
      if (!grid || !celestial) return
      const {
        cols,
        rows,
        cellW,
        cellH,
        font,
        wordLeft,
        wordCols,
        wordRows,
        contentLeft,
        contentRight,
        fadeReach,
        horizon,
        coverage,
        normalX,
        normalY,
        normalZ,
        starPhase,
        edgeJitter,
      } = grid
      const t = reduceMotion ? 0 : now / 1000
      const dpr = window.devicePixelRatio || 1
      const width = canvas.width / dpr
      const height = rows * cellH
      const { dark, foreground } = palette
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.font = font
      ctx.textBaseline = "top"

      const fade = (col: number, row: number): number => {
        const outside =
          col < contentLeft
            ? contentLeft - col
            : col > contentRight
              ? col - contentRight
              : 0
        if (outside === 0) return 1
        const ragged = outside + edgeJitter[row] * fadeReach * 0.35
        return smoothstep(1 - ragged / fadeReach)
      }

      let currentStyle = ""
      const put = (
        char: string,
        col: number,
        row: number,
        color: Rgb,
        alpha = 1
      ): void => {
        const style = toCss(color, Math.round(alpha * 20) / 20)
        if (style !== currentStyle) {
          ctx.fillStyle = style
          currentStyle = style
        }
        ctx.fillText(char, col * cellW, row * cellH)
      }

      const sunCol = celestial.x / cellW
      const sunRow = celestial.y / cellH
      const bodyColor: Rgb = celestial.sun
        ? mixRgb(brandAt(palette, 0.3), foreground, dark ? 0.45 : 0.25)
        : mixRgb(foreground, brandAt(palette, 0.85), dark ? 0.2 : 0.35)

      const spotOn = spot.value
      const strength = celestial.strength * (1 - spotOn) + spotOn
      if (wordLight.length !== wordCols * wordRows) {
        wordLight = new Float32Array(wordCols * wordRows)
      }
      for (let row = 0; row < wordRows; row++) {
        for (let col = 0; col < wordCols; col++) {
          const i = row * wordCols + col
          const cover = coverage[i]
          if (cover < 0.06) {
            wordLight[i] = 0
            continue
          }
          const gridCol = wordLeft + col
          const px = (gridCol + 0.5) * cellW
          const py = (SKY_ROWS + row + 0.5) * cellH
          const dx = lightX.value - px
          const dy = lightY.value - py
          const length = Math.hypot(dx, dy, LIGHT_HEIGHT)
          const diffuse = Math.max(
            0,
            (normalX[i] * dx + normalY[i] * dy + normalZ[i] * LIGHT_HEIGHT) /
              length
          )
          // The cursor is a spotlight: everything outside its pool sinks
          // toward ambient so the lit area reads clearly.
          const pool = Math.exp(
            -(dx * dx + dy * dy) / (SPOT_REACH * SPOT_REACH)
          )
          const falloff = 1 - spotOn + spotOn * (0.35 + 0.9 * pool)
          const glint = Math.pow(diffuse, 18) * (0.5 + 0.5 * pool * spotOn)
          const shade = clamp01(
            (AMBIENT + 0.1 * wake.value + 0.62 * diffuse * strength) * falloff +
              glint * 0.4
          )
          // Shape picks the glyph so the word always reads as solid letters;
          // light only shifts tone, with a one-step dip on shadowed bevels.
          const density = Math.pow(cover, 0.55)
          let index = Math.round(density * (WORD_RAMP.length - 1))
          if (shade < 0.4 && index > 3) index -= 1
          wordLight[i] = density * (0.45 + 0.55 * shade)
          put(
            WORD_RAMP[index],
            gridCol,
            SKY_ROWS + row,
            wordInk(brandAt(palette, col / wordCols), shade)
          )
        }
      }

      const isWord = (col: number, row: number): boolean => {
        const wc = col - wordLeft
        const wr = row - SKY_ROWS
        return (
          wr >= 0 &&
          wr < wordRows &&
          wc >= 0 &&
          wc < wordCols &&
          coverage[wr * wordCols + wc] >= 0.06
        )
      }

      const night = !celestial.sun
      const radius = celestial.sun ? SUN_RADIUS : MOON_RADIUS
      for (let row = 0; row < horizon; row++) {
        for (let col = 0; col < cols; col++) {
          if (isWord(col, row)) continue
          const dx = (col + 0.5 - sunCol) * cellW
          const dy = (row + 0.5 - sunRow) * cellH
          const distance = Math.hypot(dx, dy) / (cellH * radius)

          if (celestial.sun) {
            if (distance < 1) {
              const char =
                SUN_DISK[Math.min(2, Math.floor((1 - distance) * 3.2))]
              put(char, col, row, inkFor(bodyColor, 0.95))
              continue
            }
          } else {
            const nx = dx / (cellH * radius)
            const ny = dy / (cellH * radius)
            const lit = distance < 1 && Math.hypot(nx - 0.55, ny + 0.2) > 0.92
            if (lit) {
              put(
                distance > 0.72 ? "@" : "O",
                col,
                row,
                inkFor(bodyColor, 0.95)
              )
              continue
            }
            if (distance < 1) {
              put(".", col, row, inkFor(bodyColor, 0.25))
              continue
            }
            if (distance < 1.6 && hash(col, row) > 0.6) {
              put(".", col, row, inkFor(bodyColor, 0.35 * (1.6 - distance)))
              continue
            }
          }

          if (row < SKY_ROWS && night && dark) {
            const phase = starPhase[row * cols + col]
            if (phase < 0) continue
            const twinkle = 0.5 + 0.5 * Math.sin(t * 1.3 + phase * 7)
            put(
              twinkle > 0.8 ? "*" : twinkle > 0.45 ? "+" : ".",
              col,
              row,
              inkFor(foreground, 0.25 + 0.55 * twinkle),
              fade(col, row)
            )
          }
        }
      }

      if (celestial.sun) {
        for (let k = 0; k < SUN_RAYS; k++) {
          const angle = (k / SUN_RAYS) * Math.PI * 2 + t * 0.15
          const ray =
            RAY_CHARS[((Math.round(angle / (Math.PI / 4)) % 4) + 4) % 4]
          const flicker = 0.7 + 0.3 * Math.sin(t * 3 + k * 1.7)
          for (const reach of RAY_STEPS) {
            const col = Math.round(
              sunCol - 0.5 + (Math.cos(angle) * reach * radius * cellH) / cellW
            )
            const row = Math.round(
              sunRow - 0.5 - Math.sin(angle) * reach * radius
            )
            if (row < 0 || row >= horizon || col < 0 || col >= cols) continue
            if (isWord(col, row)) continue
            put(ray, col, row, inkFor(bodyColor, flicker * (2.6 - reach)))
          }
        }
      }

      const deep = brandAt(palette, 0.7)
      glitter *= 0.95
      const bodyAboveSea = celestial.y < horizon * cellH
      const pathCol = spotOn > 0.3 ? lightX.value / cellW : sunCol
      for (let r = 0; r < SEA_ROWS; r++) {
        const row = horizon + r
        const depth = r / (SEA_ROWS - 1)
        const bottomFade = 1 - smoothstep((depth - 0.55) / 0.45) * 0.6
        const wavelength = 2.2 + depth * 9
        const drift = t * (0.6 + depth * 1.1) * (r % 2 === 0 ? 1 : -0.6)
        for (let col = 0; col < cols; col++) {
          const edge = fade(col, row) * bottomFade
          if (edge <= 0.02) continue
          let char = " "
          let level = 0
          let hue = deep

          if (r === 0) {
            char = "-"
            level = 0.42
          } else {
            const phase =
              (col + hash(r, 3) * 50) / wavelength +
              drift +
              Math.sin(col * 0.05 + r) * 0.6
            const crest = Math.pow(
              Math.max(0, Math.sin(phase * Math.PI * 2)),
              4
            )
            if (crest > 0.55) {
              char = "~"
              level = 0.3 + 0.35 * crest
            } else if (crest > 0.2) {
              char = "-"
              level = 0.22 + 0.2 * crest
            }
          }

          const wc = col - wordLeft
          const sway = Math.round(
            Math.sin(r * 1.4 + t * 2.1 + col * 0.18) * (0.4 + r * 0.5)
          )
          const mirror = wordRows - 1 - Math.floor(r * 1.2)
          const source = wc + sway
          if (mirror >= 0 && source >= 0 && source < wordCols) {
            const broken = hash(col, r * 31 + Math.floor(t * 3)) < 0.15
            const reflection = broken
              ? 0
              : wordLight[mirror * wordCols + source] * (0.9 - r * 0.09)
            if (reflection > level && reflection > 0.12) {
              level = reflection
              char = reflection > 0.55 ? "=" : reflection > 0.3 ? "~" : "-"
              hue = brandAt(palette, source / wordCols)
            }
          }

          if (bodyAboveSea || spotOn > 0.3) {
            const spread = 0.6 + r * 1.1
            const offset = Math.abs(col - pathCol)
            if (offset < spread) {
              const shimmer = hash(col, r * 7 + Math.floor(t * 8))
              if (shimmer > 0.45 - glitter * 0.3) {
                const sparkle = (1 - offset / spread) * (0.6 + 0.3 * strength)
                if (sparkle > level) {
                  level = sparkle
                  char = sparkle > 0.6 ? "=" : "-"
                  hue = spotOn > 0.3 ? brandAt(palette, col / cols) : bodyColor
                }
              }
            }
          }

          for (const ripple of ripples) {
            const age = (now - ripple.start) / 1000
            const ring =
              (Math.hypot(col - ripple.x, (r - ripple.y) * 3) -
                age * RIPPLE_SPEED) /
              RIPPLE_WIDTH
            const lifeFade = 1 - age / RIPPLE_LIFETIME
            const boost =
              Math.exp(-ring * ring) * lifeFade * lifeFade * ripple.strength
            if (boost > 0.15) {
              level = Math.max(level, 0.35 + boost * 0.6)
              char = boost > 0.5 ? "o" : "~"
              hue = brandAt(palette, col / cols)
            }
          }

          if (char === " ") continue
          put(char, col, row, inkFor(hue, clamp01(level)), edge)
        }
      }

      if (spotOn > 0.02) {
        const glow = ctx.createRadialGradient(
          lightX.value,
          lightY.value,
          0,
          lightX.value,
          lightY.value,
          SPOT_REACH * 1.4
        )
        const hue = brandAt(palette, lightX.value / width)
        glow.addColorStop(0, toCss(hue, (dark ? 0.16 : 0.1) * spotOn))
        glow.addColorStop(1, toCss(hue, 0))
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)
      }
    }

    const tick = (now: number): void => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 20)
      lastTime = now
      stepSpring(lightX, dt)
      stepSpring(lightY, dt)
      stepSpring(spot, dt)
      stepSpring(wake, dt)
      while (
        ripples.length &&
        (now - ripples[0].start) / 1000 > RIPPLE_LIFETIME
      ) {
        ripples.shift()
      }
      if (now - lastDraw >= FRAME_INTERVAL) {
        lastDraw = now
        draw(now)
      }
      frame = visible ? requestAnimationFrame(tick) : null
    }

    const start = (): void => {
      if (frame !== null || !visible || reduceMotion) return
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const readContent = (): Content => {
      const canvasRect = canvas.getBoundingClientRect()
      const rect = measure.getBoundingClientRect()
      const styles = getComputedStyle(measure)
      const padLeft = parseFloat(styles.paddingLeft) || 0
      const padRight = parseFloat(styles.paddingRight) || 0
      return {
        left: rect.left - canvasRect.left + padLeft,
        width: rect.width - padLeft - padRight,
      }
    }

    const layout = (): void => {
      const dpr = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      grid = buildGrid(
        width,
        readContent(),
        serif,
        mono,
        palette.dark ? 500 : 700
      )
      const height = grid.rows * grid.cellH
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.height = `${height}px`
      updateCelestial()
      if (celestial && spot.target === 0) {
        lightX.value = celestial.x
        lightY.value = celestial.y
      }
      draw(performance.now())
    }

    const addRipple = (x: number, y: number, strength: number): void => {
      if (reduceMotion) return
      ripples.push({ x, y, start: performance.now(), strength })
      start()
    }

    const localPoint = (event: PointerEvent): [number, number] => {
      const rect = canvas.getBoundingClientRect()
      return [event.clientX - rect.left, event.clientY - rect.top]
    }

    const handleMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch" || reduceMotion || !grid) return
      const [x, y] = localPoint(event)
      lightX.target = x
      lightY.target = y
      spot.target = 1
      const seaRow = y / grid.cellH - grid.horizon
      if (seaRow >= 0 && event.timeStamp - lastWake > WAKE_INTERVAL_MS) {
        lastWake = event.timeStamp
        addRipple(x / grid.cellW, seaRow, 0.55)
      }
      start()
    }

    const handleLeave = (): void => {
      spot.target = 0
      updateCelestial()
    }

    const handleDown = (event: PointerEvent): void => {
      if (!grid) return
      const [x, y] = localPoint(event)
      const seaRow = Math.max(
        0,
        Math.min(SEA_ROWS - 1, y / grid.cellH - grid.horizon)
      )
      addRipple(x / grid.cellW, seaRow, 1)
    }

    const unsubscribe = subscribeChatActivity((activity) => {
      if (!grid) return
      if (activity.type === "focus") wake.target = 1
      if (activity.type === "blur" || activity.type === "reply-end") {
        wake.target = 0
      }
      if (activity.type === "keystroke") {
        const span = grid.contentRight - grid.contentLeft
        addRipple(
          grid.contentLeft + Math.random() * span,
          1 + Math.random() * 3,
          0.6
        )
      }
      if (activity.type === "submit") addRipple(grid.cols / 2, 0, 1.3)
      if (activity.type === "reply-chunk") glitter = Math.min(1, glitter + 0.25)
      start()
    })

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    const sizing = new ResizeObserver(layout)
    const theme = new MutationObserver(() => {
      palette = readWordmarkPalette(measure, sky.stops)
      layout()
    })
    const skyTimer = window.setInterval(() => {
      sky = getTunisSky()
      palette = readWordmarkPalette(measure, sky.stops)
      updateCelestial()
      draw(performance.now())
    }, SKY_REFRESH_MS)

    Promise.all([
      document.fonts.load(`${WORDMARK_FONT_WEIGHT} 100px ${serif}`),
      document.fonts.load(`500 12px ${mono}`),
      document.fonts.load(`700 12px ${mono}`),
    ])
      .catch(() => undefined)
      .then(() => {
        if (disposed) return
        layout()
        sizing.observe(canvas)
        sizing.observe(measure)
        visibility.observe(canvas)
      })

    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })
    canvas.addEventListener("pointermove", handleMove)
    canvas.addEventListener("pointerleave", handleLeave)
    canvas.addEventListener("pointerdown", handleDown)

    return () => {
      disposed = true
      unsubscribe()
      visibility.disconnect()
      sizing.disconnect()
      theme.disconnect()
      window.clearInterval(skyTimer)
      canvas.removeEventListener("pointermove", handleMove)
      canvas.removeEventListener("pointerleave", handleLeave)
      canvas.removeEventListener("pointerdown", handleDown)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <div className="screen-line-top screen-line-bottom py-4">
      <div ref={measureRef} className="container h-0" aria-hidden />
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <canvas
          ref={canvasRef}
          className="block w-full touch-pan-y select-none"
          role="img"
          aria-label="FindMalek., drawn in ASCII over the sea, lit by the sun over Tunis"
        />
      </div>
    </div>
  )
}
