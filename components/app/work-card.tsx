"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { convertWorkType } from "@/config/converter"
import { WorkRo } from "@/config/schemas"
import { cn } from "@/lib/utils"

interface MousePosition {
  x: number
  y: number
}

export function WorkCardPattern({
  mousePosition,
}: {
  mousePosition: MousePosition
}) {
  return (
    <div
      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 70%)`,
      }}
    />
  )
}

export function WorkCard({ work }: { work: WorkRo }) {
  const {
    logo,
    logoClassName,
    company,
    position,
    overview,
    type,
    startDate,
    endDate,
    place,
    href,
  } = work

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  function onMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const { currentTarget, clientX, clientY } = event
    const { left, top } = currentTarget.getBoundingClientRect()
    setMousePosition({
      x: clientX - left,
      y: clientY - top,
    })
  }

  return (
    <Link
      href={href}
      onMouseMove={onMouseMove}
      className="border-foreground/20 hover:border-primary/30 hover:bg-muted/50 group relative rounded-2xl border-[1.15px] p-6 transition-all duration-300"
    >
      <WorkCardPattern mousePosition={mousePosition} />
      <div className="flex items-start gap-4">
        <div className="border-border size-12 overflow-hidden rounded-lg border">
          <Image
            src={logo}
            alt={`${company} logo`}
            width={48}
            height={48}
            className={cn("size-full object-cover", logoClassName)}
          />
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="text-xl font-semibold">{position}</h3>
          <p className="text-muted-foreground text-lg">{company}</p>
          <p className="text-muted-foreground mt-4">{overview}</p>
          <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
            <span>{convertWorkType(type)}</span>
            <span>•</span>
            <span>{`${startDate} - ${endDate}`}</span>
            <span>•</span>
            <span>{place}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
