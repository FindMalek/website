"use client"

import { useRef } from "react"

import { quantize, threshold } from "@/lib/dither/bayer"
import { hash2 } from "@/lib/dither/noise"
import { brandAt } from "@/lib/dither/palette"

import { useDitherLoop } from "@/components/dither/use-dither-loop"

export type StripMode = "threshold" | "bayer2" | "bayer4" | "bayer8" | "noise"

const CELL = 3

type State = { image: ImageData }

/** A 0 to 1 gradient squeezed to two tones by one dithering strategy. */
export function GradientStrip({ mode }: { mode: StripMode }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<State>(ref, {
    fps: 1,
    cell: CELL,
    still: true,
    setup: (info) => ({
      image: info.ctx.createImageData(info.bufferWidth, info.bufferHeight),
    }),
    frame: (state, info) => {
      const cols = info.bufferWidth
      const rows = info.bufferHeight
      const [cr, cg, cb] = brandAt(info.palette, 0.45)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tone = c / (cols - 1)
          const th =
            mode === "threshold"
              ? 0.5
              : mode === "noise"
                ? hash2(c, r, 3)
                : threshold(Number(mode.slice(5)) as 2 | 4 | 8, c, r)
          const on = quantize(tone, 2, th) === 1
          const o = (r * cols + c) * 4
          state.image.data[o] = cr
          state.image.data[o + 1] = cg
          state.image.data[o + 2] = cb
          state.image.data[o + 3] = on ? 255 : 0
        }
      }
      info.ctx.putImageData(state.image, 0, 0)
    },
  })

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pixelated bg-muted/40 h-10 w-full rounded-sm"
    />
  )
}
