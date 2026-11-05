"use client"

import { useRef } from "react"

import { clamp01 } from "@/lib/dither/palette"
import { ditherTheme, readmeStep } from "@/lib/dither/theme"
import { cn } from "@/lib/utils"

import { useDitherLoop, type LoopInfo } from "@/components/dither/use-dither-loop"

type DitherImageProps = {
  /** Same-origin image URL to dither. Remote images that taint the canvas are skipped. */
  src: string
  /** The real image (usually next/image), shown when the veil dissolves. */
  children: React.ReactNode
  className?: string
  /** CSS px per dither cell. */
  cell?: number
  /** Dissolve the veil once on load instead of on hover. */
  reveal?: boolean
}

type State = { paint: () => void }

function paintImage(info: LoopInfo, img: HTMLImageElement): void {
  const cols = info.bufferWidth
  const rows = info.bufferHeight
  const off = document.createElement("canvas")
  off.width = cols
  off.height = rows
  const octx = off.getContext("2d", { willReadFrequently: true })
  if (!octx || !img.naturalWidth) return

  octx.fillStyle = "#808080"
  octx.fillRect(0, 0, cols, rows)
  const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight)
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  octx.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h)

  let pixels: Uint8ClampedArray
  try {
    pixels = octx.getImageData(0, 0, cols, rows).data
  } catch {
    return
  }

  // Stretch the 2nd to 98th luminance percentile to the full ramp, so dark or
  // low-contrast images still use every dither level.
  const hist = new Uint32Array(256)
  for (let i = 0; i < cols * rows; i++) {
    const o = i * 4
    hist[Math.round(0.2126 * pixels[o] + 0.7152 * pixels[o + 1] + 0.0722 * pixels[o + 2])]++
  }
  const total = cols * rows
  let acc = 0
  let lo = 0
  let hi = 255
  for (let v = 0; v < 256; v++) {
    acc += hist[v]
    if (acc < total * 0.02) lo = v
    if (acc <= total * 0.98) hi = v
  }
  const span = Math.max(24, hi - lo)

  const theme = ditherTheme(info.palette.dark)
  const out = info.ctx.createImageData(cols, rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = (r * cols + c) * 4
      const lum =
        0.2126 * pixels[o] + 0.7152 * pixels[o + 1] + 0.0722 * pixels[o + 2]
      const tone = clamp01((lum - lo) / span)
      const [cr, cg, cb] = theme.palette[readmeStep(tone, c, r, theme.palette.length)]
      out.data[o] = cr
      out.data[o + 1] = cg
      out.data[o + 2] = cb
      out.data[o + 3] = 255
    }
  }
  info.ctx.putImageData(out, 0, 0)
}

/**
 * Lays an ordered-dither duotone of `src` over its children. Hovering the
 * host (or any ancestor marked `data-dither-group`) dissolves the veil with a
 * stepped Bayer mask, revealing the real image.
 */
export function DitherImage({
  src,
  children,
  className,
  cell = 3,
  reveal = false,
}: DitherImageProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<State>(ref, {
    fps: 1,
    cell,
    still: true,
    setup: (info) => {
      const img = new Image()
      const paint = (): void => paintImage(info, img)
      img.onload = paint
      img.src = src
      return { paint }
    },
    frame: () => {},
  })

  return (
    <div className={cn("dither-host relative overflow-hidden", className)}>
      {children}
      <canvas
        ref={ref}
        aria-hidden="true"
        className={cn(
          "dither-veil pointer-events-none absolute inset-0 size-full",
          reveal && "dither-veil-reveal"
        )}
      />
    </div>
  )
}
