"use client"

import { useState } from "react"

import {
  DitherOcean,
  type OceanLook,
} from "@/components/dither/dither-ocean"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const LOOKS: OceanLook[] = ["ascii", "binary", "dots", "blocks", "letters"]

/** The ocean, redrawn in a different set of characters. */
export function OceanLab() {
  const [look, setLook] = useState<OceanLook>("ascii")

  return (
    <div className="space-y-4">
      <div className="border-line relative h-64 overflow-hidden rounded-lg border">
        <DitherOcean key={look} look={look} className="absolute inset-0" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">look</span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={look}
          onValueChange={(v) => v && setLook(v as OceanLook)}
        >
          {LOOKS.map((name) => (
            <ToggleGroupItem key={name} value={name}>
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
