"use client"

import { useState } from "react"

import type { BayerSize } from "@/lib/dither/bayer"
import { RAMPS, type RampName } from "@/lib/dither/glyphs"

import { AsciiText } from "@/components/dither/ascii-text"
import { DitherField } from "@/components/dither/dither-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

function Control({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
          {label}
        </Label>
        {value && <span className="font-mono text-xs tabular-nums">{value}</span>}
      </div>
      {children}
    </div>
  )
}

type Preset = {
  name: string
  cell: number
  levels: number
  intensity: number
  matrix: BayerSize
  tint: "brand" | "mono"
  ramp: RampName
}

const PRESETS: Preset[] = [
  { name: "aurora", cell: 4, levels: 5, intensity: 82, matrix: 8, tint: "brand", ramp: "ascii" },
  { name: "fine", cell: 2, levels: 8, intensity: 90, matrix: 8, tint: "brand", ramp: "code" },
  { name: "coarse", cell: 10, levels: 2, intensity: 75, matrix: 2, tint: "brand", ramp: "dust" },
  { name: "ink", cell: 6, levels: 3, intensity: 70, matrix: 4, tint: "mono", ramp: "binary" },
]

export function Playground() {
  const [cell, setCell] = useState(4)
  const [levels, setLevels] = useState(5)
  const [intensity, setIntensity] = useState(82)
  const [matrix, setMatrix] = useState<BayerSize>(8)
  const [tint, setTint] = useState<"brand" | "mono">("brand")
  const [ramp, setRamp] = useState<RampName>("ascii")
  const [text, setText] = useState("dither")

  const apply = (p: Preset): void => {
    setCell(p.cell)
    setLevels(p.levels)
    setIntensity(p.intensity)
    setMatrix(p.matrix)
    setTint(p.tint)
    setRamp(p.ramp)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">presets</span>
        {PRESETS.map((p) => (
          <Button key={p.name} variant="outline" size="sm" onClick={() => apply(p)}>
            {p.name}
          </Button>
        ))}
      </div>
      <div className="border-line relative h-72 overflow-hidden rounded-lg border sm:h-80">
        <DitherField
          key={`${cell}-${levels}-${tint}`}
          cell={cell}
          levels={levels}
          matrix={matrix}
          tint={tint}
          intensity={intensity / 100}
          fade="both"
          lift={-0.04}
          className="absolute inset-0 size-full"
        />
        <AsciiText
          key={`${text}-${ramp}`}
          text={text.trim() || "dither"}
          ramp={ramp}
          decorative
          className="absolute inset-x-6 bottom-8 top-8"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Control label="cell size" value={`${cell}px`}>
          <Slider min={2} max={10} step={1} value={[cell]} onValueChange={([v]) => setCell(v)} />
        </Control>
        <Control label="levels" value={String(levels)}>
          <Slider min={2} max={8} step={1} value={[levels]} onValueChange={([v]) => setLevels(v)} />
        </Control>
        <Control label="intensity" value={`${intensity}%`}>
          <Slider min={30} max={100} step={1} value={[intensity]} onValueChange={([v]) => setIntensity(v)} />
        </Control>
        <Control label="text">
          <Input
            value={text}
            maxLength={12}
            onChange={(e) => setText(e.target.value)}
            className="font-mono"
          />
        </Control>
        <Control label="bayer matrix">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={String(matrix)}
            onValueChange={(v) => v && setMatrix(Number(v) as BayerSize)}
          >
            <ToggleGroupItem value="2">2×2</ToggleGroupItem>
            <ToggleGroupItem value="4">4×4</ToggleGroupItem>
            <ToggleGroupItem value="8">8×8</ToggleGroupItem>
          </ToggleGroup>
        </Control>
        <Control label="tint">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={tint}
            onValueChange={(v) => v && setTint(v as "brand" | "mono")}
          >
            <ToggleGroupItem value="brand">brand</ToggleGroupItem>
            <ToggleGroupItem value="mono">mono</ToggleGroupItem>
          </ToggleGroup>
        </Control>
        <Control label="glyph ramp">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={ramp}
            onValueChange={(v) => v && setRamp(v as RampName)}
          >
            {(Object.keys(RAMPS) as RampName[]).map((name) => (
              <ToggleGroupItem key={name} value={name}>
                {name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Control>
      </div>
    </div>
  )
}
