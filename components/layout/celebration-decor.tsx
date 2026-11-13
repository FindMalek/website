"use client"

import { useCelebration } from "@/providers/celebration-provider"
import { useReducedMotion } from "motion/react"

const PARTICLE_COUNT = 18

export function CelebrationDecor() {
  const { celebration, enabled } = useCelebration()
  const prefersReducedMotion = useReducedMotion()
  if (!celebration || !enabled || prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${(i * 37) % 100}%`,
            fontSize: `${14 + ((i * 5) % 14)}px`,
            opacity: 0.55,
            animation: `celebration-${celebration.motion} ${12 + ((i * 7) % 10)}s linear ${-((i * 5) % 14)}s infinite`,
            ["--drift" as string]: `${((i % 5) - 2) * 24}px`,
          }}
        >
          {celebration.particles[i % celebration.particles.length]}
        </span>
      ))}
    </div>
  )
}
