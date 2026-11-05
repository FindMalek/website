"use client"

import { useRef } from "react"

import { createGlyphAtlas, type GlyphAtlas } from "@/lib/dither/atlas"
import { avoidMask, measureAvoid } from "@/lib/dither/avoid"
import { Galaxy, type Ring } from "@/lib/dither/galaxy"
import { ditherTheme, readmeStep, type DitherTheme } from "@/lib/dither/theme"
import { cn } from "@/lib/utils"

import {
  useDitherLoop,
  type LoopInfo,
} from "@/components/dither/use-dither-loop"

const LEVELS = 6
const IDLE_SPIN = 0.045
const DRAG_RADIANS_PER_PX = 0.004
const STAR_GLYPHS = ["·", "+", "*"]
const HIT_RADIUS = 24
const DEATH_SECONDS = 4.4
const AVOID_STRENGTH = 0.9
const AVOID_FEATHER = 70

const LABELS = {
  idle: "you live here",
  hover: "don't click.",
  died: (n: number) => `you live here (died ${n}x)`,
}

const ATLAS_CHARS = Array.from(
  new Set(
    [...STAR_GLYPHS, ..."you live here don't click. (died x) 0123456789 gamma-ray burst. never saw coming respawning ..."]
  )
).filter((c) => c !== " ")

type Meteor = { x: number; y: number; vx: number; vy: number; t0: number }

type State = {
  galaxy: Galaxy
  theme: DitherTheme
  atlas: GlyphAtlas
  layer: HTMLCanvasElement
  lctx: CanvasRenderingContext2D
  image: ImageData
  mask: Float32Array
  cols: number
  rows: number
  cell: number
  spin: number
  vel: number
  rings: Ring[]
  meteor: Meteor | null
  nextMeteor: number
  death: { t0: number } | null
  deaths: number
  cursor: boolean
}

const smooth = (t: number): number => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}

function setup(info: LoopInfo): State {
  const { width: W, height: H } = info
  const cell = W > 1000 ? 5 : 4
  const cols = Math.ceil(W / cell)
  const rows = Math.ceil(H / cell)
  const mobile = W < 640
  const galaxy = new Galaxy(
    cols,
    rows,
    cell,
    mobile ? W * 0.5 : W * 0.8,
    mobile ? H * 0.36 : H * 0.5,
    mobile ? Math.min(H * 0.6, W * 0.52) : Math.min(H * 0.8, W * 0.3),
    -0.42,
    0.5
  )
  const layer = document.createElement("canvas")
  layer.width = cols
  layer.height = rows
  const lctx = layer.getContext("2d") as CanvasRenderingContext2D
  const theme = ditherTheme(info.palette.dark)
  const family = getComputedStyle(info.canvas).fontFamily
  return {
    galaxy,
    theme,
    atlas: createGlyphAtlas({
      font: `600 14px ${family}`,
      cellW: 9,
      cellH: 14,
      dpr: info.dpr,
      chars: ATLAS_CHARS,
      colors: theme.ink,
    }),
    layer,
    lctx,
    image: lctx.createImageData(cols, rows),
    mask: avoidMask(cols, rows, cell, measureAvoid(info.canvas), AVOID_FEATHER),
    cols,
    rows,
    cell,
    spin: 0.6,
    vel: 0,
    rings: [],
    meteor: null,
    nextMeteor: 4,
    death: null,
    deaths: 0,
    cursor: false,
  }
}

function drawText(
  s: State,
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: number,
  align: "left" | "right" | "center"
): void {
  const w = text.length * 9
  const x0 = align === "left" ? x : align === "right" ? x - w : x - w / 2
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== " ") s.atlas.draw(ctx, text[i], color, x0 + i * 9 + 4.5, y)
  }
}

/**
 * A spiral galaxy you can play with. Drag to spin it, tap to send out a
 * shockwave, move the pointer through it to bend the light. Drawn the README
 * way: a density field quantised through a 4x4 Bayer threshold into six
 * palette steps, with the brightest stars lifted out as ASCII glyphs. It
 * dissolves around anything marked `data-scene-avoid` so text stays readable.
 * And there is a marker saying where you live. Do not click it.
 */
export function DitherGalaxy({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<State>(ref, {
    fps: 20,
    interactive: true,
    setup,
    frame: (s, info, time, dt, input) => {
      const { ctx, width: W, height: H } = info
      const { theme } = s
      const top = theme.ink.length - 1
      const live = !input.still && !input.reduced

      if (input.still) {
        s.spin = 0.7
      } else {
        const m = s.galaxy.markerAt(s.spin)
        for (const tap of input.taps) {
          if (!s.death && Math.hypot(tap.x - m.x, tap.y - m.y) < HIT_RADIUS) {
            s.death = { t0: time }
            s.deaths++
            s.rings.push(
              { x: m.x, y: m.y, t0: time, power: 1.8 },
              { x: m.x, y: m.y, t0: time + 0.18, power: 1.4 },
              { x: m.x, y: m.y, t0: time + 0.36, power: 1 }
            )
          } else {
            s.rings.push({ x: tap.x, y: tap.y, t0: tap.t })
          }
        }
        input.taps.length = 0
        s.rings = s.rings.filter((r) => time - r.t0 < 2.4)

        if (input.pressed) {
          const d = input.dragX * DRAG_RADIANS_PER_PX
          s.spin += d
          s.vel = s.vel * 0.6 + (d / Math.max(dt, 0.001)) * 0.4
          input.dragX = 0
        } else {
          s.spin += (IDLE_SPIN + s.vel) * dt
          s.vel *= Math.exp(-dt * 1.6)
        }
      }

      const p = input.pointer
      const pointer = p.active && live ? p : null
      s.galaxy.render(time, s.spin, pointer, s.rings, time)

      // The death sequence: a flash, the galaxy going dark, then coming back.
      let factor = 1
      let flash = 0
      let dead = -1
      if (s.death) {
        dead = time - s.death.t0
        if (dead > DEATH_SECONDS) s.death = null
        else {
          flash = dead < 0.35 ? 1 - dead / 0.35 : 0
          factor =
            dead < 0.35 ? 1 : dead < 1.15 ? 1 - smooth((dead - 0.35) / 0.8) * 0.93 : dead < 3.2 ? 0.07 : 0.07 + 0.93 * smooth((dead - 3.2) / 1.2)
        }
      }

      const data = s.image.data
      const tones = s.galaxy.tones
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          const i = r * s.cols + c
          const o = i * 4
          const tone = Math.min(1, tones[i] * (1 - AVOID_STRENGTH * s.mask[i]) * factor + flash * 0.8)
          const idx = readmeStep(tone, c, r, LEVELS)
          if (idx === 0) {
            data[o + 3] = 0
            continue
          }
          const col = theme.palette[idx]
          data[o] = col[0]
          data[o + 1] = col[1]
          data[o + 2] = col[2]
          data[o + 3] = 255
        }
      }
      s.lctx.putImageData(s.image, 0, 0)

      ctx.fillStyle = theme.bg
      ctx.fillRect(0, 0, W, H)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(s.layer, 0, 0, s.cols * s.cell, s.rows * s.cell)

      for (const star of s.galaxy.bright) {
        const cc = Math.min(s.cols - 1, Math.floor(star.x / s.cell))
        const rr = Math.min(s.rows - 1, Math.floor(star.y / s.cell))
        if (s.mask[rr * s.cols + cc] > 0.3 || factor < 0.5) continue
        const tw = Math.sin(time * 2.2 + star.phase)
        const glyph = tw > 0.6 ? 2 : tw > 0 ? 1 : 0
        s.atlas.draw(ctx, STAR_GLYPHS[glyph], Math.min(top, 3 + glyph), star.x, star.y)
      }

      // A shooting star now and then, always in the open sky.
      if (live) {
        if (!s.meteor && time > s.nextMeteor) {
          s.meteor = { x: Math.random() * W * 0.55, y: Math.random() * H * 0.2, vx: 460, vy: 190, t0: time }
          s.nextMeteor = time + 6 + Math.random() * 9
        }
        if (s.meteor) {
          const age = time - s.meteor.t0
          if (age > 0.9) s.meteor = null
          else {
            for (let k = 0; k < 9; k++) {
              const back = k * 0.02
              const x = s.meteor.x + s.meteor.vx * (age - back)
              const y = s.meteor.y + s.meteor.vy * (age - back)
              const fade = (1 - age / 0.9) * (1 - k / 9)
              s.atlas.draw(ctx, k === 0 ? "*" : k < 4 ? "+" : "·", Math.round(top * Math.max(0.3, fade)), x, y)
            }
          }
        }
      }

      // Where you live.
      const m = s.galaxy.markerAt(s.spin)
      const near = pointer ? Math.hypot(pointer.x - m.x, pointer.y - m.y) < HIT_RADIUS : false
      if (live) {
        const wrap = info.canvas.parentElement
        const hovering = near && !s.death
        if (wrap && s.cursor !== hovering) {
          wrap.style.cursor = hovering ? "pointer" : ""
          s.cursor = hovering
        }
      }
      if (factor > 0.5) {
        const pulse = Math.sin(time * 3) > 0
        s.atlas.draw(ctx, pulse ? "*" : "+", top, m.x, m.y)
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2 + time * 0.6
          const rad = 11 + (pulse ? 1.5 : 0)
          s.atlas.draw(ctx, "·", top - 1, m.x + Math.cos(a) * rad, m.y + Math.sin(a) * rad * 0.8)
        }
        const label = near ? LABELS.hover : s.deaths > 0 ? LABELS.died(s.deaths) : LABELS.idle
        const flip = m.x > W - label.length * 9 - 40
        drawText(s, ctx, label, flip ? m.x - 20 : m.x + 20, m.y - 20, top, flip ? "right" : "left")
        s.atlas.draw(ctx, "·", top - 1, m.x + (flip ? -9 : 9), m.y - 9)
      }

      if (dead >= 0 && dead > 0.55 && dead < 3.5) {
        const a = smooth((dead - 0.55) / 0.3) * (1 - smooth((dead - 3.0) / 0.5))
        const size = Math.max(32, Math.min(84, W * 0.07))
        ctx.save()
        ctx.globalAlpha = a
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = `700 ${size}px ${getComputedStyle(info.canvas).fontFamily}`
        const cx = W * 0.5
        const cy = H * 0.36
        const [br, bg, bb] = theme.palette[3]
        ctx.fillStyle = `rgb(${br},${bg},${bb})`
        ctx.fillText("YOU DIED", cx + 4, cy + 2)
        ctx.fillStyle = theme.ink[top]
        ctx.fillText("YOU DIED", cx, cy)
        ctx.restore()
        drawText(s, ctx, dead < 2.1 ? "gamma-ray burst. you never saw it coming." : "respawning...", cx, cy + size * 0.8, top - 1, "center")
      }
    },
  })

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("size-full font-mono", className)}
    />
  )
}
