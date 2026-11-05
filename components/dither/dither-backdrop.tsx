"use client"

import { useRef } from "react"

import { Galaxy } from "@/lib/dither/galaxy"
import { fbm, hash2, smoothstep } from "@/lib/dither/noise"
import { ditherTheme, readmeStep } from "@/lib/dither/theme"
import { cn } from "@/lib/utils"

import {
  useDitherLoop,
  type LoopInfo,
} from "@/components/dither/use-dither-loop"

const CELL = 6
const LEVELS = 6
/** Half the content column, in px. */
const COLUMN = 384
const FEATHER = 300

type Star = { c: number; r: number; base: number; phase: number; speed: number; cross: boolean }

function paintPixel(
  data: Uint8ClampedArray,
  cols: number,
  rows: number,
  c: number,
  r: number,
  palette: number[],
): void {
  if (c < 0 || r < 0 || c >= cols || r >= rows) return
  const o = (r * cols + c) * 4
  data[o] = palette[0]
  data[o + 1] = palette[1]
  data[o + 2] = palette[2]
  data[o + 3] = 255
}

/** The nebula: painted once, then drifted by a CSS transform. Costs nothing per frame. */
function Nebula({ className, seed = 0 }: { className?: string; seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<object>(ref, {
    fps: 1,
    cell: CELL,
    still: true,
    setup: () => ({}),
    frame: (_s, info) => {
      const cols = info.bufferWidth
      const rows = info.bufferHeight
      const theme = ditherTheme(info.palette.dark)
      const img = info.ctx.createImageData(cols, rows)
      const mid = info.width / 2
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const out = Math.abs((c + 0.5) * CELL - mid) - COLUMN
          // Present everywhere: strongest in the gutters, a soft veil behind the text.
          const gutter = 0.34 + 0.66 * smoothstep(0, FEATHER, out)
          const x = c * 0.026
          const y = r * 0.026
          const warp = fbm(x * 0.6 + seed * 11.3, y * 0.6, 3, 2 + seed)
          const cloud = fbm(x + warp * 2.4 + seed * 5.7, y + warp * 2.4, 5, 7 + seed * 3)
          const body = smoothstep(0.28, 0.74, cloud)
          const lanes = 1 - 0.5 * smoothstep(0.55, 0.72, fbm(x * 1.7 + 9 + seed * 3.1, y * 1.7, 3, 19 + seed))
          const dawn = smoothstep(0.6, 1, (r + 0.5) / rows) * 0.3
          const tone = Math.min(0.5, body * lanes * gutter * 0.6 + dawn * 0.5)
          const idx = readmeStep(tone, c, r, LEVELS)
          if (idx > 0) paintPixel(img.data, cols, rows, c, r, theme.palette[idx])
        }
      }
      info.ctx.putImageData(img, 0, 0)
    },
  })

  return <canvas ref={ref} aria-hidden="true" className={cn("pixelated", className)} />
}

type StarState = { stars: Star[]; image: ImageData; theme: ReturnType<typeof ditherTheme> }

/** Stars that breathe: a handful dim and brighten slowly. Five frames a second. */
function Stars({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<StarState>(ref, {
    fps: 5,
    cell: CELL,
    setup: (info: LoopInfo) => {
      const cols = info.bufferWidth
      const rows = info.bufferHeight
      const mid = info.width / 2
      const stars: Star[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const h = hash2(c, r, 91)
          if (h < 0.9935) continue
          const inColumn = Math.abs((c + 0.5) * CELL - mid) < COLUMN
          stars.push({
            c,
            r,
            base: inColumn ? 2 : 3 + (h > 0.997 ? 1 : 0),
            phase: hash2(c, r, 5) * 6.28,
            speed: 0.4 + hash2(c, r, 6) * 0.9,
            cross: !inColumn && h > 0.9992,
          })
        }
      }
      return {
        stars,
        image: info.ctx.createImageData(cols, rows),
        theme: ditherTheme(info.palette.dark),
      }
    },
    frame: (s, info, time) => {
      const cols = info.bufferWidth
      const rows = info.bufferHeight
      s.image.data.fill(0)
      for (const star of s.stars) {
        const tw = Math.sin(time * star.speed + star.phase)
        const level = Math.max(1, Math.min(LEVELS - 1, star.base + (tw > 0.55 ? 1 : tw < -0.55 ? -1 : 0)))
        const color = s.theme.palette[level]
        paintPixel(s.image.data, cols, rows, star.c, star.r, color)
        if (star.cross) {
          const dim = s.theme.palette[Math.max(1, level - 2)]
          paintPixel(s.image.data, cols, rows, star.c - 1, star.r, dim)
          paintPixel(s.image.data, cols, rows, star.c + 1, star.r, dim)
          paintPixel(s.image.data, cols, rows, star.c, star.r - 1, dim)
          paintPixel(s.image.data, cols, rows, star.c, star.r + 1, dim)
        }
      }
      info.ctx.putImageData(s.image, 0, 0)
    },
  })

  return <canvas ref={ref} aria-hidden="true" className={cn("pixelated", className)} />
}

/** A small far-off galaxy, painted once and glided across the gutter by CSS. */
function DistantGalaxy({ className, angle }: { className?: string; angle: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<object>(ref, {
    fps: 1,
    cell: 4,
    still: true,
    setup: () => ({}),
    frame: (_s, info) => {
      const cols = info.bufferWidth
      const rows = info.bufferHeight
      const theme = ditherTheme(info.palette.dark)
      const galaxy = new Galaxy(cols, rows, 4, info.width / 2, info.height / 2, Math.min(info.width, info.height * 1.6) * 0.46, angle, 0.5)
      galaxy.render(0, 0.9 + angle, null, [], 0)
      const img = info.ctx.createImageData(cols, rows)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = readmeStep(galaxy.tones[r * cols + c] * 0.9, c, r, LEVELS)
          if (idx > 0) paintPixel(img.data, cols, rows, c, r, theme.palette[idx])
        }
      }
      info.ctx.putImageData(img, 0, 0)
    },
  })

  return <canvas ref={ref} aria-hidden="true" className={cn("pixelated", className)} />
}

/**
 * The page ground. Three nebula layers crossfade and drift on different slow
 * cycles, so the clouds slowly change shape; two small galaxies glide across
 * the gutters; stars breathe. Dim by design and cheap: every layer is painted
 * once and moved by the compositor, only the stars tick (5fps).
 */
export function DitherBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)}>
      <div className="absolute -inset-8 opacity-20">
        <div className="nebula-a absolute inset-0">
          <Nebula seed={0} className="size-full" />
        </div>
        <div className="nebula-b absolute inset-0">
          <Nebula seed={1} className="size-full" />
        </div>
        <div className="nebula-c absolute inset-0">
          <Nebula seed={2} className="size-full" />
        </div>
      </div>

      <div className="hidden xl:block">
        <div className="galaxy-a absolute left-6 top-1/4 opacity-25">
          <DistantGalaxy angle={-0.5} className="h-28 w-44" />
        </div>
        <div className="galaxy-b absolute right-8 top-2/3 opacity-25">
          <DistantGalaxy angle={0.6} className="h-24 w-40" />
        </div>
      </div>

      <Stars className="absolute inset-0 size-full opacity-35" />
    </div>
  )
}
