import Image from "next/image"

import { AsciiText } from "@/components/dither/ascii-text"
import { DitherField } from "@/components/dither/dither-field"
import { DitherGalaxy } from "@/components/dither/dither-galaxy"
import { SoundIcon } from "@/components/dither/pixel-icon"
import { DitherImage } from "@/components/dither/dither-image"

const BOX = "border-line relative overflow-hidden rounded-lg border"

export function FieldPreview() {
  return (
    <div className={`${BOX} h-36`}>
      <DitherField cell={4} fade="both" className="absolute inset-0 size-full" />
    </div>
  )
}

export function AsciiPreview() {
  return (
    <div className={`${BOX} h-32 px-4`}>
      <AsciiText text="ascii" ramp="code" className="size-full" />
    </div>
  )
}

export function ImagePreview() {
  return (
    <div className="flex items-center gap-4">
      <DitherImage
        src="/about/author.png"
        cell={3}
        className="border-line size-32 rounded-lg border"
      >
        <Image
          src="/about/author.png"
          alt="Portrait used to demo the dither veil"
          fill
          sizes="8rem"
          className="object-cover"
        />
      </DitherImage>
      <p className="text-muted-foreground font-mono text-xs">hover the portrait</p>
    </div>
  )
}

export function GalaxyPreview() {
  return (
    <div className={`${BOX} h-48`}>
      <DitherGalaxy className="absolute inset-0" />
    </div>
  )
}

export function IconPreview() {
  return (
    <div className="flex items-center gap-6">
      <SoundIcon className="size-8" />
      <SoundIcon playing className="size-8" />
      <p className="text-muted-foreground font-mono text-xs">idle, then playing</p>
    </div>
  )
}
