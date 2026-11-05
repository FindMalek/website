"use client"

import { useRef } from "react"

import type { Client } from "@/types"

import { BOAT_HEIGHT, BOAT_HALF_WIDTH, Fleet, LOGO_SIZE, spriteIndex } from "@/lib/dither/fleet"
import { ditherTheme, readmeStep, type DitherTheme } from "@/lib/dither/theme"
import { cn } from "@/lib/utils"

import {
  useDitherLoop,
  type LoopInfo,
} from "@/components/dither/use-dither-loop"

const CELL = 4
const LEVELS = 6

type State = {
  fleet: Fleet
  theme: DitherTheme
  image: ImageData
  idx: Uint8Array
  cols: number
  rows: number
  logos: (Float32Array | null)[]
  label: HTMLDivElement | null
  hovered: number
  cursor: boolean
}

/** Load a logo into an 8x8 tone grid, stretched to full contrast so it reads as a sail emblem. */
function loadLogo(src: string, into: (tones: Float32Array) => void): void {
  const img = new Image()
  img.onload = () => {
    const c = document.createElement("canvas")
    c.width = LOGO_SIZE
    c.height = LOGO_SIZE
    const ctx = c.getContext("2d", { willReadFrequently: true })
    if (!ctx || !img.naturalWidth) return
    ctx.fillStyle = "#8c8c8c"
    ctx.fillRect(0, 0, LOGO_SIZE, LOGO_SIZE)
    const scale = Math.min(LOGO_SIZE / img.naturalWidth, LOGO_SIZE / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (LOGO_SIZE - w) / 2, (LOGO_SIZE - h) / 2, w, h)
    let px: Uint8ClampedArray
    try {
      px = ctx.getImageData(0, 0, LOGO_SIZE, LOGO_SIZE).data
    } catch {
      return
    }
    const lum = new Float32Array(LOGO_SIZE * LOGO_SIZE)
    let lo = 1
    let hi = 0
    for (let i = 0; i < lum.length; i++) {
      lum[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255
      lo = Math.min(lo, lum[i])
      hi = Math.max(hi, lum[i])
    }
    const span = Math.max(0.15, hi - lo)
    for (let i = 0; i < lum.length; i++) lum[i] = (lum[i] - lo) / span
    into(lum)
  }
  img.src = src
}

function setup(info: LoopInfo, clients: Client[]): State {
  const cols = info.bufferWidth
  const rows = info.bufferHeight
  const logos: (Float32Array | null)[] = clients.map(() => null)
  clients.forEach((client, i) => {
    if (client.logo) loadLogo(client.logo, (t) => { logos[i] = t })
  })
  return {
    fleet: new Fleet(cols, rows, clients.length),
    theme: ditherTheme(info.palette.dark),
    image: info.ctx.createImageData(cols, rows),
    idx: new Uint8Array(cols * rows),
    cols,
    rows,
    logos,
    label: info.canvas.parentElement?.querySelector<HTMLDivElement>("[data-fleet-label]") ?? null,
    hovered: -1,
    cursor: false,
  }
}

function paintWater(s: State, layer: "back" | "mid" | "front", base: number, t: number): void {
  const { cols, rows, idx, fleet } = s
  for (let c = 0; c < cols; c++) {
    const crest = fleet.surface(layer, c, t)
    const top = Math.max(0, Math.ceil(crest))
    for (let r = top; r < rows; r++) {
      const depth = (r - crest) / Math.max(1, rows - crest)
      let tone = base * (1 - 0.55 * depth)
      if (r - crest < 1.3) tone += 0.2
      idx[r * cols + c] = readmeStep(tone, c, r, LEVELS)
    }
  }
}

/**
 * A fleet of little boats on a night sea. Each carries a company's logo on its
 * sail. They ride the waves (bobbing and pitching with the swell), drift slowly,
 * and are quiet by design. Hover a boat for the company name; click to visit.
 */
export function DitherFleet({
  clients,
  className,
}: {
  clients: Client[]
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useDitherLoop<State>(ref, {
    fps: 20,
    cell: CELL,
    interactive: true,
    setup: (info) => setup(info, clients),
    frame: (s, info, time, dt, input) => {
      const { fleet, cols, rows, idx } = s
      if (!input.still) fleet.step(Math.min(dt, 0.1))
      const t = fleet.time

      idx.fill(0)
      paintWater(s, "back", 0.09, t)
      paintWater(s, "mid", 0.15, t)

      // Boats, with the sprite rotated by the boat's pitch.
      for (const b of fleet.boats) {
        const cos = Math.cos(b.angle)
        const sin = Math.sin(b.angle)
        const logo = s.logos[b.client]
        for (let dy = -BOAT_HEIGHT - 3; dy <= 6; dy++) {
          for (let dx = -BOAT_HALF_WIDTH - 4; dx <= BOAT_HALF_WIDTH + 4; dx++) {
            const c = Math.round(b.x) + dx
            const r = Math.round(b.y) + dy
            if (c < 0 || r < 0 || c >= cols || r >= rows) continue
            const px = c + 0.5 - b.x
            const py = r + 0.5 - b.y
            const u = px * cos + py * sin
            const v = -px * sin + py * cos
            const p = spriteIndex(u, v, logo)
            if (p > 0) idx[r * cols + c] = p
          }
        }
      }

      paintWater(s, "front", 0.2, t)

      const data = s.image.data
      for (let i = 0; i < idx.length; i++) {
        const o = i * 4
        const p = idx[i]
        if (p === 0) {
          data[o + 3] = 0
          continue
        }
        const col = s.theme.palette[p]
        data[o] = col[0]
        data[o + 1] = col[1]
        data[o + 2] = col[2]
        data[o + 3] = 255
      }
      info.ctx.putImageData(s.image, 0, 0)

      // Hover: name the boat under the pointer; click: visit its site.
      if (input.still) return
      const pointer = input.pointer
      let hovered = -1
      if (pointer.active) {
        fleet.boats.forEach((b, i) => {
          const bx = b.x * CELL
          const by = b.y * CELL
          if (
            Math.abs(pointer.x - bx) < (BOAT_HALF_WIDTH + 1) * CELL &&
            pointer.y > by - (BOAT_HEIGHT + 1) * CELL &&
            pointer.y < by + 4 * CELL
          ) {
            hovered = i
          }
        })
      }
      for (const tap of input.taps) {
        fleet.boats.forEach((b) => {
          const bx = b.x * CELL
          const by = b.y * CELL
          if (
            Math.abs(tap.x - bx) < (BOAT_HALF_WIDTH + 1) * CELL &&
            tap.y > by - (BOAT_HEIGHT + 1) * CELL &&
            tap.y < by + 4 * CELL
          ) {
            const href = clients[b.client]?.href
            if (href) window.open(href, "_blank", "noopener")
          }
        })
      }
      input.taps.length = 0

      const label = s.label
      if (label) {
        if (hovered >= 0) {
          const b = fleet.boats[hovered]
          label.textContent = clients[b.client]?.name ?? ""
          label.style.opacity = "1"
          label.style.transform = `translate(${Math.round(b.x * CELL)}px, ${Math.round((b.y - BOAT_HEIGHT - 2) * CELL)}px) translate(-50%, -100%)`
        } else {
          label.style.opacity = "0"
        }
      }
      const linked = hovered >= 0 && !!clients[fleet.boats[hovered].client]?.href
      if (linked !== s.cursor) {
        info.canvas.style.cursor = linked ? "pointer" : ""
        s.cursor = linked
      }
      s.hovered = hovered
      void time
      void rows
    },
  })

  return (
    <div className={cn("relative", className)}>
      <canvas ref={ref} aria-hidden="true" className="pixelated absolute inset-0 size-full" />
      <div
        data-fleet-label
        aria-hidden="true"
        className="bg-background border-foreground/40 pointer-events-none absolute left-0 top-0 border px-1.5 py-0.5 font-mono text-xs opacity-0"
      />
    </div>
  )
}
