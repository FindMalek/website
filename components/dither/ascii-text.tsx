"use client"

import { useRef } from "react"

import { quantize, threshold } from "@/lib/dither/bayer"
import { RAMPS, SCATTER, type RampName } from "@/lib/dither/glyphs"
import { hash2, smoothstep } from "@/lib/dither/noise"
import { brandAt, clamp01, mixRgb } from "@/lib/dither/palette"
import { cn } from "@/lib/utils"

import {
  useDitherLoop,
  type LoopInfo,
} from "@/components/dither/use-dither-loop"

type AsciiTextProps = {
  text: string
  className?: string
  ramp?: RampName
  weight?: number
  /** Skip the screen-reader label when the same text is already in the DOM. */
  decorative?: boolean
  /** Static at rest; animates only while the pointer is over it. */
  hover?: boolean
}

type Atlas = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  drawn: Uint8Array
  chars: string[]
  index: Map<string, number>
  sw: number
  sh: number
}

type Grid = {
  cols: number
  rows: number
  cellW: number
  cellH: number
  coverage: Float32Array
  halo: Float32Array
  gx: Float32Array
  gy: Float32Array
  ox: Float32Array
  oy: Float32Array
  vx: Float32Array
  vy: Float32Array
  plates: HTMLCanvasElement
  atlas: Atlas
  colBand: Float32Array
  started: number
  lastClick: number
}

const SUPERSAMPLE = 3
const REVEAL_SECONDS = 2
const REPEL_RADIUS = 90
const SPRING = 70
const DAMPING = 9
const TONES = 6
const POSITIONS = 12
const ATLAS_COLUMNS = 48

function blur(src: Float32Array, cols: number, rows: number): Float32Array {
  const out = new Float32Array(src.length)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const rr = r + dy
          const cc = c + dx
          if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue
          sum += src[rr * cols + cc]
          n++
        }
      }
      out[r * cols + c] = sum / n
    }
  }
  return out
}

function headingFamily(): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-heading")
    .trim()
  return value && !value.includes("var(")
    ? value
    : "Geist, system-ui, sans-serif"
}

function rasterize(
  g: Grid,
  info: LoopInfo,
  text: string,
  weight: number
): void {
  const { cols, rows } = g
  const w = cols * SUPERSAMPLE
  const h = rows * SUPERSAMPLE
  const family = headingFamily()
  const off = document.createElement("canvas")
  off.width = w
  off.height = h
  const octx = off.getContext("2d", { willReadFrequently: true })
  if (!octx) return

  octx.font = `${weight} 100px ${family}`
  const m = octx.measureText(text)
  const size =
    Math.min(
      (w * 0.98) / m.width,
      (h * 0.92) / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)
    ) * 100
  octx.font = `${weight} ${size}px ${family}`
  octx.textAlign = "center"
  octx.textBaseline = "alphabetic"
  const fit = octx.measureText(text)
  const top =
    (h - (fit.actualBoundingBoxAscent + fit.actualBoundingBoxDescent)) / 2
  octx.fillStyle = "#fff"
  octx.fillText(text, w / 2, top + fit.actualBoundingBoxAscent)

  const px = octx.getImageData(0, 0, w, h).data
  g.coverage.fill(0)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          sum += px[((r * SUPERSAMPLE + sy) * w + c * SUPERSAMPLE + sx) * 4 + 3]
        }
      }
      g.coverage[r * cols + c] = sum / (255 * SUPERSAMPLE * SUPERSAMPLE)
    }
  }

  const soft = blur(blur(g.coverage, cols, rows), cols, rows)
  g.halo.set(blur(blur(soft, cols, rows), cols, rows))
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const i = r * cols + c
      g.gx[i] = soft[i + 1] - soft[i - 1]
      g.gy[i] = soft[i + cols] - soft[i - cols]
    }
  }

  // Dark stencil plates under every letter cell, painted once.
  const dpr = info.dpr
  g.plates.width = Math.round(info.width * dpr)
  g.plates.height = Math.round(info.height * dpr)
  const pctx = g.plates.getContext("2d")
  if (!pctx) return
  pctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const [pr, pg, pb] = info.palette.background
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cov = g.coverage[r * cols + c]
      if (cov < 0.08) continue
      const a = 0.8 * smoothstep(0.1, 0.9, cov)
      pctx.fillStyle = `rgba(${pr | 0},${pg | 0},${pb | 0},${a})`
      pctx.fillRect(c * g.cellW, r * g.cellH, g.cellW + 0.5, g.cellH + 0.5)
    }
  }
}

function createAtlas(
  info: LoopInfo,
  cellW: number,
  cellH: number,
  chars: string[],
  font: string
): Atlas {
  const dpr = info.dpr
  const sw = Math.ceil(cellW * dpr)
  const sh = Math.ceil(cellH * dpr)
  const slots = POSITIONS * TONES * chars.length
  const canvas = document.createElement("canvas")
  canvas.width = ATLAS_COLUMNS * sw
  canvas.height = Math.ceil(slots / ATLAS_COLUMNS) * sh
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.font = font.replace(/[\d.]+px/, `${(sh / 1.12).toFixed(2)}px`)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
  }
  return {
    canvas,
    ctx: ctx as CanvasRenderingContext2D,
    drawn: new Uint8Array(slots),
    chars,
    index: new Map(chars.map((ch, i) => [ch, i])),
    sw,
    sh,
  }
}

function drawGlyph(
  out: CanvasRenderingContext2D,
  g: Grid,
  info: LoopInfo,
  ch: string,
  pos: number,
  tone: number,
  x: number,
  y: number
): void {
  const a = g.atlas
  const ci = a.index.get(ch)
  if (ci === undefined) return
  const slot = (pos * TONES + tone) * a.chars.length + ci
  const sx = (slot % ATLAS_COLUMNS) * a.sw
  const sy = Math.floor(slot / ATLAS_COLUMNS) * a.sh
  if (!a.drawn[slot]) {
    a.drawn[slot] = 1
    const t = tone / (TONES - 1)
    const [r, gr, b] = mixRgb(
      brandAt(info.palette, (pos + 0.5) / POSITIONS),
      info.palette.foreground,
      t * 0.85
    )
    a.ctx.fillStyle = `rgba(${r | 0},${gr | 0},${b | 0},${0.38 + t * 0.62})`
    a.ctx.fillText(ch, sx + a.sw / 2, sy + a.sh / 2)
  }
  out.drawImage(
    a.canvas,
    sx,
    sy,
    a.sw,
    a.sh,
    x - g.cellW / 2,
    y - g.cellH / 2,
    g.cellW,
    g.cellH
  )
}

function setupGrid(
  info: LoopInfo,
  text: string,
  weight: number,
  chars: string
): Grid {
  const glyph = info.width < 480 ? 9 : info.width < 768 ? 11 : 13
  const cellW = glyph * 0.6
  const cellH = glyph * 1.12
  const cols = Math.max(8, Math.floor(info.width / cellW))
  const rows = Math.max(4, Math.floor(info.height / cellH))
  const n = cols * rows
  const family = getComputedStyle(info.canvas).fontFamily
  const set = Array.from(new Set([...chars, ...SCATTER, "·"]))
  const grid: Grid = {
    cols,
    rows,
    cellW,
    cellH,
    coverage: new Float32Array(n),
    halo: new Float32Array(n),
    gx: new Float32Array(n),
    gy: new Float32Array(n),
    ox: new Float32Array(n),
    oy: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    plates: document.createElement("canvas"),
    atlas: createAtlas(info, cellW, cellH, set, `600 ${glyph}px ${family}`),
    colBand: new Float32Array(cols),
    started: Number.NaN,
    lastClick: 0,
  }
  rasterize(grid, info, text, weight)
  void document.fonts
    ?.load(`${weight} 64px ${headingFamily()}`)
    .then(() => rasterize(grid, info, text, weight))
  return grid
}

/**
 * Text drawn as a living ASCII relief. The word is rasterized into a glyph
 * grid, each cell picks a character from a density ramp through a Bayer
 * threshold (so shading reads as stipple, not banding), and the letters
 * scatter and spring back around the pointer. Glyphs are blitted from a
 * lazily filled sprite atlas, so a frame is a few hundred drawImage calls.
 */
export function AsciiText({
  text,
  className,
  ramp = "ascii",
  weight = 800,
  decorative = false,
  hover = false,
}: AsciiTextProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const chars = RAMPS[ramp]

  useDitherLoop<Grid>(ref, {
    fps: 24,
    interactive: true,
    hover,
    setup: (info) => setupGrid(info, text, weight, chars),
    frame: (g, info, time, dt, input) => {
      const { ctx } = info
      const { cols, rows, cellW, cellH } = g
      ctx.clearRect(0, 0, info.width, info.height)

      if (Number.isNaN(g.started)) g.started = input.still ? -1e9 : time
      const reveal = input.reduced ? 1.4 : (time - g.started) / REVEAL_SECONDS
      const { pointer } = input
      const live = pointer.active && !input.reduced
      const sweep = ((time * 0.11) % 1.7) - 0.35
      const lx = live
        ? pointer.x
        : info.width * (0.5 + 0.4 * Math.sin(time * 0.35))
      const ly = live ? pointer.y : info.height * 0.1
      const drift = 0.05 * Math.sin(time * 0.4)

      for (let c = 0; c < cols; c++) {
        const p = c / cols - sweep
        g.colBand[c] = Math.exp(-(p * p) / 0.004) * 0.5
      }

      ctx.globalAlpha = clamp01(reveal)
      ctx.drawImage(g.plates, 0, 0, info.width, info.height)
      ctx.globalAlpha = 1

      const burst = input.clicks.filter((c) => c.t > g.lastClick)
      if (burst.length) g.lastClick = burst[burst.length - 1].t
      const snapA = time * 0.5
      const snapB = time * 0.35
      const flick = Math.floor(time * 3)
      const scatterFrame = Math.floor(time * 14)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const cov = g.coverage[i]
          const cx = (c + 0.5) * cellW
          const cy = (r + 0.5) * cellH
          const position = c / cols
          const pos = Math.min(
            POSITIONS - 1,
            Math.floor(clamp01(position + drift) * POSITIONS)
          )

          if (cov < 0.08) {
            const halo = g.halo[i]
            if (halo < 0.04 || reveal < 0.6) continue
            if (hash2(c, r, flick) > halo * 0.35) continue
            drawGlyph(ctx, g, info, "·", pos, 0, cx, cy)
            continue
          }

          if (!input.reduced) {
            if (live) {
              const dx = cx - pointer.x
              const dy = cy - pointer.y
              const d2 = dx * dx + dy * dy
              if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 1) {
                const d = Math.sqrt(d2)
                const push = (1 - d / REPEL_RADIUS) ** 2 * 1800
                g.vx[i] += (dx / d) * push * dt
                g.vy[i] += (dy / d) * push * dt
              }
            }
            for (const click of burst) {
              const dx = cx - click.x
              const dy = cy - click.y
              const d = Math.max(1, Math.hypot(dx, dy))
              if (d < REPEL_RADIUS * 2.2) {
                const kick = (1 - d / (REPEL_RADIUS * 2.2)) * 420
                g.vx[i] += (dx / d) * kick
                g.vy[i] += (dy / d) * kick
              }
            }
            if (
              g.ox[i] !== 0 ||
              g.oy[i] !== 0 ||
              g.vx[i] !== 0 ||
              g.vy[i] !== 0
            ) {
              g.vx[i] += (-SPRING * g.ox[i] - DAMPING * g.vx[i]) * dt
              g.vy[i] += (-SPRING * g.oy[i] - DAMPING * g.vy[i]) * dt
              g.ox[i] += g.vx[i] * dt
              g.oy[i] += g.vy[i] * dt
              if (
                Math.abs(g.ox[i]) +
                  Math.abs(g.oy[i]) +
                  Math.abs(g.vx[i]) +
                  Math.abs(g.vy[i]) <
                0.02
              ) {
                g.ox[i] = g.oy[i] = g.vx[i] = g.vy[i] = 0
              }
            }
          }

          const gate = reveal * 1.2 - position * 0.28 - threshold(8, c, r)
          if (gate < -0.1) continue
          const resolving = gate < 0.04

          const body = smoothstep(0.1, 0.9, cov)
          const shimmer =
            0.5 + 0.5 * Math.sin(c * 0.37 + snapA) * Math.cos(r * 0.53 - snapB)
          let tone = body * (0.62 + 0.38 * shimmer) + g.colBand[c]

          const gxv = g.gx[i]
          const gyv = g.gy[i]
          const lx2 = cx - lx
          const ly2 = cy - ly
          const sd2 = lx2 * lx2 + ly2 * ly2
          if (gxv !== 0 || gyv !== 0) {
            tone += clamp01(-(gxv * lx2 + gyv * ly2) / (Math.sqrt(sd2) + 1)) * 1.2
          }
          if (sd2 < 90000) tone += Math.exp(-sd2 / 22000) * 0.45
          tone = clamp01(tone)

          const moved = Math.abs(g.ox[i]) + Math.abs(g.oy[i])
          const ch =
            resolving || moved > 4
              ? SCATTER[Math.floor(hash2(c, r, scatterFrame) * SCATTER.length)]
              : chars[quantize(tone, chars.length, threshold(4, c, r))]
          if (ch === " ") continue

          const tb = resolving ? 0 : Math.round(tone * (TONES - 1))
          drawGlyph(ctx, g, info, ch, pos, tb, cx + g.ox[i], cy + g.oy[i])
        }
      }
    },
  })

  return (
    <div className={cn("relative", className)}>
      {!decorative && <span className="sr-only">{text}</span>}
      <canvas
        ref={ref}
        aria-hidden="true"
        className="absolute inset-0 size-full font-mono"
      />
    </div>
  )
}
