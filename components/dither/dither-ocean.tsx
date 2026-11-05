"use client"

import { useRef } from "react"

import { createGlyphAtlas, type GlyphAtlas } from "@/lib/dither/atlas"
import { computeAurora } from "@/lib/dither/aurora"
import { Ocean, fishGlyph, type SharkGlyphs } from "@/lib/dither/ocean"
import { ditherTheme, readmeStep, type DitherTheme } from "@/lib/dither/theme"
import { cn } from "@/lib/utils"

import {
  useDitherLoop,
  type LoopInfo,
} from "@/components/dither/use-dither-loop"

// The profile README generator's aurora, constants verbatim: 4px cells, a 4x4
// Bayer threshold, six palette steps, and a ping-pong loop (forward 4.5s then
// back, 9s in all) over a phase span of 7.6.
const CELL = 4
const LEVELS = 6
const PERIOD = 9
const SPAN = 7.6
const STRENGTH = 0.82

export type OceanLook = "ascii" | "binary" | "dots" | "blocks" | "letters"

type Look = SharkGlyphs & { fish: string; directional: boolean }

/** ascii-magic's idea: one scene, redrawn in another set of characters. */
const LOOKS: Record<OceanLook, Look> = {
  ascii: { skin: ":;t%S8#@", light: ".',`", heavy: ":;", fish: "-\\|/", directional: true, detail: true },
  binary: { skin: "01", light: "0", heavy: "1", fish: "01", directional: false },
  dots: { skin: "·•●", light: "·", heavy: "•", fish: "•", directional: false },
  blocks: { skin: "░▒▓█", light: "░", heavy: "▒", fish: "▪", directional: false },
  letters: { skin: "ilcoeaxkdbAHMW", light: "i", heavy: "l", fish: "-", directional: false },
}

type State = {
  section: boolean
  cell: number
  look: Look
  ocean: Ocean
  theme: DitherTheme
  atlas: GlyphAtlas
  aurora: HTMLCanvasElement
  actx: CanvasRenderingContext2D
  image: ImageData
  tones: Float32Array
  boost: Float32Array
  map: Int32Array
  cols: number
  rows: number
  stamp: Uint32Array
  mask: Uint8Array
  frameId: number
  lastClick: number
  warmed: boolean
}

const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v

export type OceanVariant = "banner" | "section"

function setup(info: LoopInfo, lookName: OceanLook, variant: OceanVariant): State {
  const look = LOOKS[lookName]
  const section = variant === "section"
  const cell = section ? 5 : CELL
  const { width: W, height: H } = info
  const cols = Math.ceil(W / cell)
  const rows = Math.ceil(H / cell)
  const aurora = document.createElement("canvas")
  aurora.width = cols
  aurora.height = rows
  const actx = aurora.getContext("2d") as CanvasRenderingContext2D

  const cw = section ? 8 : clamp(Math.round(W / 90), 7, 10)
  const ch = section ? 12 : Math.round(cw * 1.45)
  const ocean = section
    ? new Ocean(
        W,
        H,
        cw,
        ch,
        clamp(Math.round((W * H) / 9000), 70, 140),
        [Math.min(W * 0.3, 430), Math.min(W * 0.2, 290), Math.min(W * 0.14, 200)],
        { maxAngle: 0.9, pull: 0.15, dive: 0.9, yRange: [0.1, 0.9] }
      )
    : new Ocean(
        W,
        H,
        cw,
        ch,
        clamp(Math.round((W * H) / 2400), 36, 90),
        [Math.min(H * 0.88, W * 0.34), Math.min(H * 0.6, W * 0.23)]
      )
  const theme = ditherTheme(info.palette.dark)
  const family = getComputedStyle(info.canvas).fontFamily
  const atlas = createGlyphAtlas({
    font: `600 ${ch}px ${family}`,
    cellW: cw,
    cellH: ch,
    dpr: info.dpr,
    chars: Array.from(new Set(look.skin + look.light + look.heavy + look.fish + " .:-=+*%@|o^#=/\\")).filter((c) => c !== " "),
    colors: theme.ink,
  })

  const map = new Int32Array(cols * rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const gc = Math.min(ocean.cols - 1, Math.floor(((c + 0.5) * cell) / cw))
      const gr = Math.min(ocean.rows - 1, Math.floor(((r + 0.5) * cell) / ch))
      map[r * cols + c] = gr * ocean.cols + gc
    }
  }

  return {
    section,
    cell,
    look,
    ocean,
    theme,
    atlas,
    aurora,
    actx,
    image: actx.createImageData(cols, rows),
    tones: new Float32Array(cols * rows),
    boost: new Float32Array(cols * rows),
    map,
    cols,
    rows,
    stamp: new Uint32Array(ocean.cols * ocean.rows),
    mask: new Uint8Array(ocean.cols * ocean.rows),
    frameId: 0,
    lastClick: 0,
    warmed: false,
  }
}

/**
 * The README's dithered aurora as the water, with an ascii-sharks style school
 * and sharks swimming through it. Everything that swims leaves a wake that
 * brightens the dither behind it. The pointer scares the fish; a click splashes.
 */
export function DitherOcean({
  className,
  look = "ascii",
  variant = "banner",
}: {
  className?: string
  look?: OceanLook
  /** "section" fills a tall block behind its content: transparent, dimmed, free-roaming. */
  variant?: OceanVariant
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<State>(ref, {
    fps: variant === "section" ? 20 : 30,
    interactive: true,
    maxDpr: variant === "section" ? 1.25 : 2,
    setup: (info) => setup(info, look, variant),
    frame: (s, info, time, dt, input) => {
      const { ctx, width: W, height: H } = info
      const { ocean, theme } = s

      if (input.still && !s.warmed) {
        s.warmed = true
        for (let i = 0; i < 240; i++) ocean.step(1 / 60, null)
      }
      if (!input.still) {
        for (const click of input.clicks) {
          if (click.t > s.lastClick) {
            ocean.splash(click.x, click.y)
            s.lastClick = click.t
          }
        }
        const p = input.pointer
        ocean.step(Math.min(dt, 0.05), p.active ? p : null)
      }

      const loop = (time % PERIOD) / (PERIOD / 2)
      const phase = (loop <= 1 ? loop : 2 - loop) * SPAN
      for (let i = 0; i < s.boost.length; i++) {
        s.boost[i] = Math.min(1, ocean.energy[s.map[i]]) * 0.9
      }
      if (s.section) {
        // No aurora here: the water is only lit where something has swum.
        for (let i = 0; i < s.tones.length; i++) {
          const w = s.boost[i]
          s.tones[i] = w > 0.04 ? (w > 1 ? 1 : w) : 0
        }
      } else {
        computeAurora(s.tones, s.cols, s.rows, {
          time: 0,
          phase,
          intensity: STRENGTH,
          boost: s.boost,
        })
      }

      const data = s.image.data
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          const i = r * s.cols + c
          const o = i * 4
          const tone = s.tones[i]
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
      s.actx.putImageData(s.image, 0, 0)

      if (s.section) ctx.clearRect(0, 0, W, H)
      else {
        ctx.fillStyle = theme.bg
        ctx.fillRect(0, 0, W, H)
      }
      ctx.imageSmoothingEnabled = false
      ctx.globalAlpha = s.section ? 0.4 : 1
      ctx.drawImage(s.aurora, 0, 0, s.cols * s.cell, s.rows * s.cell)
      ctx.globalAlpha = s.section ? 0.55 : 1

      const cw = ocean.cellW
      const ch = ocean.cellH
      const vis = (tone: number): number =>
        Math.round(clamp(theme.invert ? 1 - tone : tone, 0, 1) * (theme.ink.length - 1))

      s.mask.fill(0)
      const cells: [number, number, string, number][] = []
      ocean.forEachSharkCell((c, r, ch2, tone) => {
        cells.push([c, r, ch2, vis(tone)])
        s.mask[r * ocean.cols + c] = 1
      }, s.look)

      ctx.fillStyle = theme.plate
      for (const [c, r] of cells) ctx.fillRect(c * cw, r * ch, cw + 0.5, ch + 0.5)

      const frame = ++s.frameId
      for (const f of ocean.fish) {
        if (!f.alive) continue
        const i = ocean.cellIndex(f.x, f.y)
        if (i < 0 || s.stamp[i] === frame || s.mask[i]) continue
        s.stamp[i] = frame
        const glint = clamp(Math.abs(f.turn) / 3.5, 0, 1)
        const v = 0.3 + (0.4 * (f.depth - 0.55)) / 0.45 + 0.3 * Math.max(glint, f.alarm)
        const color = clamp(Math.floor(v * theme.ink.length), 0, theme.ink.length - 1)
        s.atlas.draw(
          ctx,
          s.look.directional ? fishGlyph(f.vx, f.vy) : s.look.fish[0],
          color,
          (i % ocean.cols) * cw + cw / 2,
          Math.floor(i / ocean.cols) * ch + ch / 2
        )
      }

      for (const [c, r, glyph, color] of cells) {
        s.atlas.draw(ctx, glyph, color, c * cw + cw / 2, r * ch + ch / 2)
      }
      ctx.globalAlpha = 1
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
