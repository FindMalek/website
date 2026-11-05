"use client"

import { useRef } from "react"

import { computeAurora, type Ripple } from "@/lib/dither/aurora"
import { quantize, threshold, type BayerSize } from "@/lib/dither/bayer"
import { brandAt, clamp01 } from "@/lib/dither/palette"
import { smoothstep } from "@/lib/dither/noise"
import { cn } from "@/lib/utils"

import { useDitherLoop, type LoopInfo } from "@/components/dither/use-dither-loop"

type Fade = "none" | "top" | "bottom" | "both"

type DitherFieldProps = {
  className?: string
  /** CSS px per dither cell. */
  cell?: number
  fps?: number
  levels?: number
  lift?: number
  intensity?: number
  fade?: Fade
  interactive?: boolean
  /** Bayer matrix size: bigger matrices give finer, less regular stipple. */
  matrix?: BayerSize
  /** Static at rest; animates only while the pointer is over it. */
  hover?: boolean
  /** Fade to nothing toward this side, for canvases that sit beside content. */
  edge?: "none" | "left" | "right"
  /** Seconds added to the clock, so sibling fields don't show the same sky. */
  phase?: number
  /** "brand" follows the gradient across x; "mono" uses the foreground colour. */
  tint?: "brand" | "mono"
  style?: React.CSSProperties
}

type State = {
  tones: Float32Array
  image: ImageData
  lut: Uint8ClampedArray
  smooth: { x: number; y: number }
  colFade: Float32Array
}

const LUT_POSITIONS = 64

function buildLut(
  info: LoopInfo,
  levels: number,
  tint: "brand" | "mono"
): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(LUT_POSITIONS * levels * 4)
  for (let p = 0; p < LUT_POSITIONS; p++) {
    const [r, g, b] =
      tint === "mono"
        ? info.palette.foreground
        : brandAt(info.palette, p / (LUT_POSITIONS - 1))
    for (let l = 1; l < levels; l++) {
      const o = (p * levels + l) * 4
      lut[o] = r
      lut[o + 1] = g
      lut[o + 2] = b
      lut[o + 3] = 255 * (0.34 + 0.66 * (l / (levels - 1)))
    }
  }
  return lut
}

function fadeAt(fade: Fade, y: number): number {
  const top = fade === "top" || fade === "both" ? smoothstep(0, 0.35, y) : 1
  const bottom = fade === "bottom" || fade === "both" ? smoothstep(1, 0.55, y) : 1
  return top * bottom
}

export function DitherField({
  className,
  cell = 4,
  fps = 20,
  levels = 5,
  lift = 0,
  intensity = 0.82,
  fade = "bottom",
  interactive = true,
  matrix = 8,
  hover = false,
  edge = "none",
  phase = 0,
  tint = "brand",
  style,
}: DitherFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<State>(ref, {
    fps,
    cell,
    interactive,
    hover,
    setup: (info) => ({
      tones: new Float32Array(info.bufferWidth * info.bufferHeight),
      image: info.ctx.createImageData(info.bufferWidth, info.bufferHeight),
      lut: buildLut(info, levels, tint),
      smooth: { x: -1e5, y: -1e5 },
      colFade: Float32Array.from({ length: info.bufferWidth }, (_, c) => {
        const x = c / Math.max(1, info.bufferWidth - 1)
        return edge === "right"
          ? smoothstep(1, 0.4, x)
          : edge === "left"
            ? smoothstep(0, 0.6, x)
            : 1
      }),
    }),
    frame: (state, info, time, _dt, input) => {
      const cols = info.bufferWidth
      const rows = info.bufferHeight
      const live = interactive && input.pointer.active
      if (live) {
        const tx = input.pointer.x / cell
        const ty = input.pointer.y / cell
        if (state.smooth.x < -1e4) {
          state.smooth.x = tx
          state.smooth.y = ty
        }
        state.smooth.x += (tx - state.smooth.x) * 0.18
        state.smooth.y += (ty - state.smooth.y) * 0.18
      }
      const ripples: Ripple[] = input.clicks.map((c) => ({
        x: c.x / cell,
        y: c.y / cell,
        t0: c.t,
      }))

      computeAurora(state.tones, cols, rows, {
        time: time + phase,
        lift,
        intensity,
        pointer: live ? state.smooth : null,
        ripples,
        now: time,
      })

      const data = state.image.data
      const drift = Math.sin(time * 0.07) * 0.12
      for (let r = 0; r < rows; r++) {
        const f = fadeAt(fade, r / rows)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const tone = state.tones[i] * f * state.colFade[c]
          const level = tone < 0.07 ? 0 : quantize(tone, levels, threshold(matrix, c, r))
          const o = i * 4
          if (level === 0) {
            data[o + 3] = 0
            continue
          }
          const pos = clamp01((c / cols) * 0.8 + 0.1 + drift)
          const l = ((pos * (LUT_POSITIONS - 1)) | 0) * levels * 4 + level * 4
          data[o] = state.lut[l]
          data[o + 1] = state.lut[l + 1]
          data[o + 2] = state.lut[l + 2]
          data[o + 3] = state.lut[l + 3]
        }
      }
      info.ctx.putImageData(state.image, 0, 0)
    },
  })

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={style}
      className={cn("pixelated pointer-events-none", className)}
    />
  )
}
