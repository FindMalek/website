"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

type Point = [number, number]

type Grid = {
  columns: number
  filled: boolean[]
  order: Point[]
  letterAt: (string | null)[]
}

type Scene = {
  width: number
  height: number
  unit: number
  originX: number
  originY: number
}

type Palette = {
  mix: string[]
  edge: string
  floor: string
  hatch: CanvasPattern | null
}

type Ripple = { x: number; y: number; start: number }

type Spring = { value: number; velocity: number; target: number }

const GLYPHS: Record<string, string[]> = {
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  N: ["#...#", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
}

const WORD = "FINDMALEK"
const ROWS = 7
const LETTER_GAP = 1

// Oblique projection of a floor seen from the front-right and above: depth
// shears right by SKEW and climbs by FORESHORTEN per cell.
const SKEW = 0.2
const FORESHORTEN = 0.72
const MAX_FIGURE_WIDTH = 1500
const SIDE_MARGIN = 1.5
const TOP_MARGIN = 0.4
const FRONT_FLOOR = 1

const REST_HEIGHT = 0.8
const PEAK_RISE = 1.9
const HEIGHT_CAP = REST_HEIGHT + PEAK_RISE + 0.2
const RISE_RADIUS = 2.8

const ENTRANCE_STAGGER = 0.022
const ENTRANCE_DURATION = 0.75
const ENTRANCE_OVERSHOOT = 1.3

const RIPPLE_SPEED = 16
const RIPPLE_WIDTH = 1.5
const RIPPLE_HEIGHT = 1.5
const RIPPLE_LIFETIME = 2.6

const SPRING_STIFFNESS = 140
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS)
const SETTLE_EPSILON = 0.0005

const MIX_STEPS = 100
const EDGE_WIDTH = 0.85

function buildGrid(): Grid {
  const columns =
    [...WORD].reduce((sum, char) => sum + GLYPHS[char][0].length, 0) +
    LETTER_GAP * (WORD.length - 1)
  const filled = new Array<boolean>(ROWS * columns).fill(false)
  const letterAt = new Array<string | null>(columns).fill(null)

  let cursor = 0
  for (const char of WORD) {
    const glyph = GLYPHS[char]
    glyph.forEach((row, r) => {
      ;[...row].forEach((pixel, c) => {
        if (pixel === "#") filled[(ROWS - 1 - r) * columns + cursor + c] = true
      })
    })
    for (let c = 0; c < glyph[0].length; c++) letterAt[cursor + c] = char
    cursor += glyph[0].length + LETTER_GAP
  }

  // Back row first, left to right: the painter's order for a heightfield seen
  // from the front-right, so nearer blocks always cover farther ones.
  const order: Point[] = []
  for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < columns; x++) {
      if (filled[y * columns + x]) order.push([x, y])
    }
  }

  return { columns, filled, order, letterAt }
}

const GRID = buildGrid()

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function easeOutBack(progress: number): number {
  const p = progress - 1
  return 1 + (ENTRANCE_OVERSHOOT + 1) * p * p * p + ENTRANCE_OVERSHOOT * p * p
}

function stepSpring(spring: Spring, dt: number): boolean {
  const offset = spring.target - spring.value
  spring.velocity +=
    (SPRING_STIFFNESS * offset - SPRING_DAMPING * spring.velocity) * dt
  spring.value += spring.velocity * dt
  return (
    Math.abs(offset) < SETTLE_EPSILON &&
    Math.abs(spring.velocity) < SETTLE_EPSILON
  )
}

function measureScene(width: number): Scene {
  const span = GRID.columns + ROWS * SKEW + SIDE_MARGIN * 2
  const unit = Math.min(width, MAX_FIGURE_WIDTH) / span
  const height =
    (TOP_MARGIN + HEIGHT_CAP + ROWS * FORESHORTEN + FRONT_FLOOR * FORESHORTEN) *
    unit
  return {
    width,
    height,
    unit,
    originX: (width - span * unit) / 2 + SIDE_MARGIN * unit,
    originY: height - FRONT_FLOOR * FORESHORTEN * unit,
  }
}

// Canvas can't blend theme tokens itself, so every fill is pre-resolved to an
// opaque background→foreground mix; opaque fills keep adjacent faces seamless.
function readPalette(ctx: CanvasRenderingContext2D, el: HTMLElement): Palette {
  const styles = getComputedStyle(el)
  const background = styles.getPropertyValue("--background").trim() || "#000"
  const foreground = styles.getPropertyValue("--foreground").trim() || "#fff"

  const probe = document.createElement("canvas")
  probe.width = MIX_STEPS + 1
  probe.height = 1
  const probeCtx = probe.getContext("2d", { willReadFrequently: true })
  const mix: string[] = []
  if (probeCtx) {
    probeCtx.fillStyle = background
    probeCtx.fillRect(0, 0, MIX_STEPS + 1, 1)
    for (let i = 0; i <= MIX_STEPS; i++) {
      probeCtx.globalAlpha = i / MIX_STEPS
      probeCtx.fillStyle = foreground
      probeCtx.fillRect(i, 0, 1, 1)
    }
    const data = probeCtx.getImageData(0, 0, MIX_STEPS + 1, 1).data
    for (let i = 0; i <= MIX_STEPS; i++) {
      mix.push(`rgb(${data[i * 4]},${data[i * 4 + 1]},${data[i * 4 + 2]})`)
    }
  }

  const tile = document.createElement("canvas")
  tile.width = 6
  tile.height = 6
  const tileCtx = tile.getContext("2d")
  if (tileCtx) {
    tileCtx.strokeStyle = foreground
    tileCtx.globalAlpha = 0.28
    tileCtx.lineWidth = 0.8
    tileCtx.beginPath()
    tileCtx.moveTo(0, 6)
    tileCtx.lineTo(6, 0)
    tileCtx.moveTo(-1, 1)
    tileCtx.lineTo(1, -1)
    tileCtx.moveTo(5, 7)
    tileCtx.lineTo(7, 5)
    tileCtx.stroke()
  }

  return {
    mix,
    edge: mix[Math.round(MIX_STEPS * 0.82)] ?? foreground,
    floor: mix[Math.round(MIX_STEPS * 0.09)] ?? foreground,
    hatch: ctx.createPattern(tile, "repeat"),
  }
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  palette: Palette,
  heights: Float32Array
): void {
  const { unit, originX, originY, width, height } = scene
  const { columns, filled, order } = GRID
  const project = (x: number, y: number, z: number): Point => [
    originX + (x + y * SKEW) * unit,
    originY - (y * FORESHORTEN + z) * unit,
  ]
  const at = (x: number, y: number): number =>
    x >= 0 && x < columns && y >= 0 && y < ROWS && filled[y * columns + x]
      ? heights[y * columns + x]
      : Number.NEGATIVE_INFINITY
  const shade = (amount: number): string =>
    palette.mix[Math.round(clamp01(amount) * MIX_STEPS)]

  ctx.clearRect(0, 0, width, height)

  const fade = ctx.createLinearGradient(0, 0, width, 0)
  fade.addColorStop(0, "transparent")
  fade.addColorStop(0.18, palette.floor)
  fade.addColorStop(0.82, palette.floor)
  fade.addColorStop(1, "transparent")
  ctx.strokeStyle = fade
  ctx.lineWidth = 1
  ctx.beginPath()
  const firstX = Math.floor(-originX / unit - ROWS * SKEW) - 1
  const lastX = Math.ceil((width - originX) / unit) + 1
  for (let x = firstX; x <= lastX; x++) {
    const [ax, ay] = project(x, -FRONT_FLOOR, 0)
    const [bx, by] = project(x, ROWS + 0.5, 0)
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
  }
  for (let y = -1; y <= ROWS; y++) {
    const [ax, ay] = project(firstX, y, 0)
    const [bx, by] = project(lastX, y, 0)
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
  }
  ctx.stroke()

  const face = (
    points: Point[],
    fill: string,
    pattern?: CanvasPattern | null
  ): void => {
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1])
    }
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.strokeStyle = fill
    ctx.lineWidth = 0.6
    ctx.fill()
    ctx.stroke()
    if (pattern) {
      ctx.fillStyle = pattern
      ctx.fill()
    }
  }

  const segment = (a: Point, b: Point): void => {
    ctx.moveTo(a[0], a[1])
    ctx.lineTo(b[0], b[1])
  }

  ctx.lineJoin = "round"
  ctx.lineCap = "round"

  for (const [x, y] of order) {
    const h = heights[y * columns + x]
    const front = at(x, y - 1)
    const back = at(x, y + 1)
    const left = at(x - 1, y)
    const right = at(x + 1, y)
    const solid = clamp01((h - REST_HEIGHT) / PEAK_RISE)
    const x1 = x + 1
    const y1 = y + 1

    if (front < h && h > 0.01) {
      face(
        [
          project(x, y, 0),
          project(x1, y, 0),
          project(x1, y, h),
          project(x, y, h),
        ],
        shade(0.08 + 0.42 * solid)
      )
    }
    if (right < h && h > 0.01) {
      face(
        [
          project(x1, y, 0),
          project(x1, y1, 0),
          project(x1, y1, h),
          project(x1, y, h),
        ],
        shade(0.04 + 0.2 * solid),
        palette.hatch
      )
    }
    face(
      [
        project(x, y, h),
        project(x1, y, h),
        project(x1, y1, h),
        project(x, y1, h),
      ],
      shade(0.16 + 0.78 * solid)
    )

    // Only creases and silhouettes get a line; flush neighbours merge into
    // one surface, so a letter at rest reads as a single solid.
    ctx.strokeStyle = palette.edge
    ctx.lineWidth = EDGE_WIDTH
    ctx.beginPath()
    if (front < h) segment(project(x, y, h), project(x1, y, h))
    if (right < h) segment(project(x1, y, h), project(x1, y1, h))
    if (back !== h) segment(project(x, y1, h), project(x1, y1, h))
    if (left !== h) segment(project(x, y, h), project(x, y1, h))
    if (h > 0.01) {
      if (right < h) {
        segment(project(x1, y, Math.max(0, right)), project(x1, y, h))
        segment(project(x1, y1, Math.max(0, right)), project(x1, y1, h))
        if (right < 0) segment(project(x1, y, 0), project(x1, y1, 0))
      }
      if (left < h && front < h) {
        segment(project(x, y, Math.max(0, left)), project(x, y, h))
      }
      if (front < 0) segment(project(x, y, 0), project(x1, y, 0))
    }
    ctx.stroke()
  }
}

export function FooterWordmark() {
  const reduceMotion = useReducedMotion() ?? false
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!wrapper || !canvas || !ctx) return

    const { columns, filled, letterAt } = GRID
    const heights = new Float32Array(ROWS * columns)
    const pointerX: Spring = {
      value: columns / 2,
      velocity: 0,
      target: columns / 2,
    }
    const pointerY: Spring = { value: ROWS / 2, velocity: 0, target: ROWS / 2 }
    const presence: Spring = { value: 0, velocity: 0, target: 0 }
    const ripples: Ripple[] = []

    let scene = measureScene(wrapper.clientWidth)
    let palette = readPalette(ctx, wrapper)
    let entranceStart: number | null = reduceMotion ? 0 : null
    let introRippleFired = reduceMotion
    let frame: number | null = null
    let lastTime = 0
    let visible = false

    const entranceEnd = (columns * ENTRANCE_STAGGER + ENTRANCE_DURATION) * 1000

    const entrance = (x: number, now: number): number => {
      if (entranceStart === null) return 0
      if (reduceMotion) return 1
      const progress = clamp01(
        ((now - entranceStart) / 1000 - x * ENTRANCE_STAGGER) /
          ENTRANCE_DURATION
      )
      return easeOutBack(progress)
    }

    const computeHeights = (now: number): void => {
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < columns; x++) {
          const i = y * columns + x
          if (!filled[i]) continue
          const rise = entrance(x, now)
          const dx = x + 0.5 - pointerX.value
          const dy = y + 0.5 - pointerY.value
          const distance = Math.sqrt(dx * dx + dy * dy)
          let lift =
            PEAK_RISE *
            presence.value *
            Math.exp(-(distance * distance) / (RISE_RADIUS * RISE_RADIUS))
          for (const ripple of ripples) {
            const age = (now - ripple.start) / 1000
            const rx = x + 0.5 - ripple.x
            const ry = y + 0.5 - ripple.y
            const ring =
              (Math.sqrt(rx * rx + ry * ry) - age * RIPPLE_SPEED) / RIPPLE_WIDTH
            const decay = 1 - age / RIPPLE_LIFETIME
            lift += RIPPLE_HEIGHT * Math.exp(-ring * ring) * decay * decay
          }
          heights[i] = Math.min(
            HEIGHT_CAP,
            REST_HEIGHT * rise + lift * clamp01(rise)
          )
        }
      }
    }

    const render = (now: number): void => {
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      computeHeights(now)
      drawScene(ctx, scene, palette, heights)
    }

    const tick = (now: number): void => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now

      let settled = stepSpring(presence, dt)
      settled = stepSpring(pointerX, dt) && settled
      settled = stepSpring(pointerY, dt) && settled

      while (
        ripples.length &&
        (now - ripples[0].start) / 1000 > RIPPLE_LIFETIME
      ) {
        ripples.shift()
      }
      const entering =
        entranceStart !== null &&
        !reduceMotion &&
        now - entranceStart < entranceEnd
      if (
        !introRippleFired &&
        entranceStart !== null &&
        now - entranceStart > entranceEnd * 0.8
      ) {
        introRippleFired = true
        ripples.push({ x: columns / 2, y: ROWS / 2, start: now })
      }

      render(now)
      frame =
        visible && (!settled || entering || ripples.length)
          ? requestAnimationFrame(tick)
          : null
    }

    const wake = (): void => {
      if (frame !== null || !visible) return
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const resize = (): void => {
      const dpr = window.devicePixelRatio || 1
      scene = measureScene(wrapper.clientWidth)
      canvas.width = Math.round(scene.width * dpr)
      canvas.height = Math.round(scene.height * dpr)
      canvas.style.height = `${scene.height}px`
      render(performance.now())
    }

    const toFloor = (event: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      const sy = event.clientY - rect.top
      const sx = event.clientX - rect.left
      const y = ((scene.originY - sy) / scene.unit - REST_HEIGHT) / FORESHORTEN
      const x = (sx - scene.originX) / scene.unit - y * SKEW
      return [x, Math.min(ROWS + 1, Math.max(-1, y))]
    }

    const updateReadout = (x: number, y: number): void => {
      const readout = readoutRef.current
      if (!readout) return
      const column = Math.floor(x)
      const row = Math.floor(y)
      const inside = column >= 0 && column < columns && row >= 0 && row < ROWS
      const z = inside ? heights[row * columns + column] : 0
      const letter = inside ? (letterAt[column] ?? "·") : "·"
      const pad = (value: number): string =>
        String(Math.max(0, value)).padStart(2, "0")
      readout.textContent = `${letter}  x ${pad(column)}  y ${pad(row)}  z ${z.toFixed(2)}`
    }

    const handleMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch" || reduceMotion) return
      const [x, y] = toFloor(event)
      pointerX.target = x
      pointerY.target = y
      if (presence.target === 0) {
        pointerX.value = x
        pointerY.value = y
      }
      presence.target = 1
      updateReadout(x, y)
      wake()
    }

    const handleLeave = (): void => {
      presence.target = 0
      if (readoutRef.current) readoutRef.current.textContent = "hover · click"
      wake()
    }

    const handleDown = (event: PointerEvent): void => {
      if (reduceMotion) return
      const [x, y] = toFloor(event)
      ripples.push({ x, y, start: performance.now() })
      wake()
    }

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (
          visible &&
          entranceStart === null &&
          entry.intersectionRatio > 0.35
        ) {
          entranceStart = performance.now()
        }
        wake()
      },
      { threshold: [0, 0.35] }
    )
    const sizing = new ResizeObserver(resize)
    const theme = new MutationObserver(() => {
      palette = readPalette(ctx, wrapper)
      render(performance.now())
    })

    visibility.observe(canvas)
    sizing.observe(wrapper)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })
    canvas.addEventListener("pointermove", handleMove)
    canvas.addEventListener("pointerleave", handleLeave)
    canvas.addEventListener("pointerdown", handleDown)
    resize()

    return () => {
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
    <div className="screen-line-top screen-line-bottom relative">
      <div className="text-muted-foreground container pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-end font-mono text-[11px] uppercase tracking-[0.18em]">
        <span
          ref={readoutRef}
          className="hidden tabular-nums sm:inline"
          aria-hidden
        >
          hover · click
        </span>
      </div>
      <div
        ref={wrapperRef}
        className="relative left-1/2 w-screen -translate-x-1/2"
      >
        <canvas
          ref={canvasRef}
          className="block w-full cursor-crosshair touch-pan-y"
          role="img"
          aria-label="FindMalek, drawn as raised blocks on a drafting grid"
        />
      </div>
    </div>
  )
}
