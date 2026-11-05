"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { quantize, threshold } from "@/lib/dither/bayer"
import { RAMPS } from "@/lib/dither/glyphs"
import {
  brandAt,
  clamp01,
  ditherColor,
  mixRgb,
  readDitherPalette,
  watchTheme,
  type DitherPalette,
  type Rgb,
} from "@/lib/dither/palette"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Mode = "dither" | "ascii" | "halftone" | "lines"
type Tint = "brand" | "mono"

const SAMPLE = "/about/author.png"
const LEVELS = 4
const ASCII_ASPECT = 1.8

type Settings = { mode: Mode; cell: number; contrast: number; invert: boolean; tint: Tint }

function inkColor(palette: DitherPalette, tint: Tint, tone: number): Rgb {
  return tint === "mono"
    ? mixRgb(palette.background, palette.foreground, tone)
    : mixRgb(brandAt(palette, 0.45), palette.foreground, tone * 0.45)
}

function render(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  width: number,
  s: Settings
): void {
  const palette = readDitherPalette(canvas)
  const cellH = s.mode === "ascii" ? s.cell * ASCII_ASPECT : s.cell
  const cols = Math.max(8, Math.floor(width / s.cell))
  const rows = Math.max(4, Math.round((width * (img.naturalHeight / img.naturalWidth)) / cellH))

  const off = document.createElement("canvas")
  off.width = cols
  off.height = rows
  const octx = off.getContext("2d", { willReadFrequently: true })
  if (!octx) return
  octx.fillStyle = "#808080"
  octx.fillRect(0, 0, cols, rows)
  octx.drawImage(img, 0, 0, cols, rows)
  let px: Uint8ClampedArray
  try {
    px = octx.getImageData(0, 0, cols, rows).data
  } catch {
    return
  }

  const tone = (i: number): number => {
    const lum = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255
    const ink = palette.dark ? lum : 1 - lum
    return clamp01(((s.invert ? 1 - ink : ink) - 0.5) * s.contrast + 0.5)
  }

  const cssH = rows * cellH
  canvas.style.width = `${cols * s.cell}px`
  canvas.style.height = `${cssH}px`

  if (s.mode === "dither") {
    canvas.width = cols
    canvas.height = rows
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const out = ctx.createImageData(cols, rows)
    const lut = Array.from({ length: LEVELS }, (_, l) =>
      s.tint === "mono"
        ? mixRgb(palette.background, palette.foreground, l / (LEVELS - 1))
        : ditherColor(palette, l, LEVELS, 0.45)
    )
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const [cr, cg, cb] = lut[quantize(tone(i), LEVELS, threshold(8, c, r))]
        out.data.set([cr, cg, cb, 255], i * 4)
      }
    }
    ctx.putImageData(out, 0, 0)
    return
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(cols * s.cell * dpr)
  canvas.height = Math.round(cssH * dpr)
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = `rgb(${palette.background.map((v) => v | 0).join(",")})`
  ctx.fillRect(0, 0, cols * s.cell, cssH)

  if (s.mode === "ascii") {
    ctx.font = `600 ${cellH * 0.92}px ${getComputedStyle(canvas).fontFamily}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = tone(r * cols + c)
      if (t < 0.04) continue
      const [cr, cg, cb] = inkColor(palette, s.tint, t)
      ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`
      const x = c * s.cell
      const y = r * cellH
      if (s.mode === "ascii") {
        const g = RAMPS.code[Math.min(RAMPS.code.length - 1, Math.floor(t * RAMPS.code.length))]
        ctx.fillText(g, x + s.cell / 2, y + cellH / 2)
      } else if (s.mode === "halftone") {
        ctx.beginPath()
        ctx.arc(x + s.cell / 2, y + s.cell / 2, t * s.cell * 0.62, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const h = Math.max(1, t * s.cell * 0.9)
        ctx.fillRect(x, y + (s.cell - h) / 2, s.cell + 0.5, h)
      }
    }
  }
}

export function ImageLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const objectUrl = useRef<string | null>(null)
  const [src, setSrc] = useState(SAMPLE)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [width, setWidth] = useState(0)
  const [themeTick, setThemeTick] = useState(0)
  const [settings, setSettings] = useState<Settings>({
    mode: "dither",
    cell: 5,
    contrast: 1.3,
    invert: false,
    tint: "brand",
  })
  const patch = (next: Partial<Settings>): void => setSettings((s) => ({ ...s, ...next }))

  useEffect(() => {
    const el = new Image()
    el.onload = () => setImg(el)
    el.src = src
    return () => {
      el.onload = null
    }
  }, [src])

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  useEffect(() => watchTheme(() => setThemeTick((t) => t + 1)), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && img && width > 0) render(canvas, img, width, settings)
  }, [img, width, settings, themeTick])

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    },
    []
  )

  const onFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    objectUrl.current = URL.createObjectURL(file)
    setSrc(objectUrl.current)
  }, [])

  const save = (): void => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `dither-${settings.mode}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="space-y-4">
      <div
        ref={boxRef}
        className="border-line bg-muted/30 flex w-full justify-center overflow-hidden rounded-lg border"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFile(e.dataTransfer.files[0])
        }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Your image converted with the selected dither mode"
          className="pixelated font-mono"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-muted-foreground font-mono text-xs uppercase tracking-wider">mode</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={settings.mode}
            onValueChange={(v) => v && patch({ mode: v as Mode })}
          >
            <ToggleGroupItem value="dither">dither</ToggleGroupItem>
            <ToggleGroupItem value="ascii">ascii</ToggleGroupItem>
            <ToggleGroupItem value="halftone">halftone</ToggleGroupItem>
            <ToggleGroupItem value="lines">lines</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground font-mono text-xs uppercase tracking-wider">tint</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={settings.tint}
            onValueChange={(v) => v && patch({ tint: v as Tint })}
          >
            <ToggleGroupItem value="brand">brand</ToggleGroupItem>
            <ToggleGroupItem value="mono">mono</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground font-mono text-xs uppercase tracking-wider">cell size</Label>
            <span className="font-mono text-xs tabular-nums">{settings.cell}px</span>
          </div>
          <Slider min={3} max={14} step={1} value={[settings.cell]} onValueChange={([v]) => patch({ cell: v })} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground font-mono text-xs uppercase tracking-wider">contrast</Label>
            <span className="font-mono text-xs tabular-nums">{settings.contrast.toFixed(1)}</span>
          </div>
          <Slider min={5} max={25} step={1} value={[settings.contrast * 10]} onValueChange={([v]) => patch({ contrast: v / 10 })} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="lab-invert" checked={settings.invert} onCheckedChange={(v) => patch({ invert: v })} />
          <Label htmlFor="lab-invert" className="font-mono text-xs">invert</Label>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              upload image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
          </Button>
          <Button variant="outline" size="sm" onClick={save}>
            save png
          </Button>
        </div>
      </div>
    </div>
  )
}
