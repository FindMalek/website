"use client"

import { useId } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const TEXT = "CRAFTED BY FINDMALEK • "
const DURATION = 4
const RADIUS = 40

export function FooterShimmerText() {
  const shouldReduceMotion = useReducedMotion()
  const pathId = useId()
  const chars = TEXT.split("")

  return (
    <div className="flex items-center justify-center py-4">
      <svg
        viewBox="0 0 100 100"
        className={cn("size-20", !shouldReduceMotion && "animate-spin-slow")}
      >
        <defs>
          <path
            id={pathId}
            d={`M 50, 50 m -${RADIUS}, 0 a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
          />
        </defs>
        <text className="fill-muted-foreground font-mono text-[9px] uppercase">
          <textPath href={`#${pathId}`}>
            {chars.map((char, index) =>
              shouldReduceMotion ? (
                <tspan key={index} className="fill-foreground">
                  {char}
                </tspan>
              ) : (
                <tspan
                  key={index}
                  className="animate-shimmer-char"
                  style={{
                    animationDelay: `${(index * DURATION) / chars.length}s`,
                    animationDuration: `${DURATION}s`,
                  }}
                >
                  {char}
                </tspan>
              )
            )}
          </textPath>
        </text>
      </svg>
    </div>
  )
}
