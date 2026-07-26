"use client"

import { useId, useRef } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

const SIZE_CLASSES = {
  sm: "h-16 w-24",
  md: "h-28 w-44",
  lg: "h-40 w-full max-w-md",
} as const

interface AbstractMarkProps {
  className?: string
  size?: keyof typeof SIZE_CLASSES
  caption?: string
}

/**
 * Original isometric-flavored abstract shape (two offset stacked cubes) --
 * NOT letterforms. chanhdai's isometric mark and footer wordmark are both
 * hand-drawn SVG path art spelling his own initials, built in Figma with an
 * isometric-drawing plugin; that can't be mechanically retargeted to spell
 * "findmalek" through code. This keeps the same technical-drawing/mouse-
 * reactive-gradient feel with original, non-letter geometry instead, shared
 * between the hero (size="lg") and the footer (size="sm").
 */
export function AbstractMark({
  className,
  size = "md",
  caption,
}: AbstractMarkProps) {
  const id = useId()
  const gradientId = `abstract-mark-gradient-${id}`

  const ref = useRef<SVGSVGElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 200]), {
    stiffness: 200,
    damping: 30,
    mass: 0.2,
  })
  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 140]), {
    stiffness: 200,
    damping: 30,
    mass: 0.2,
  })

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left) / rect.width)
    mouseY.set((event.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <div className={cn("relative", SIZE_CLASSES[size], className)}>
      <motion.svg
        ref={ref}
        viewBox="0 0 200 140"
        fill="none"
        className="size-full overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-hidden
      >
        <defs>
          <motion.radialGradient
            id={gradientId}
            cx={cx}
            cy={cy}
            r="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </motion.radialGradient>
        </defs>

        {/* Cube A -- top face, left face, right face */}
        <g>
          <path d="M40 30 L70 15 L100 30 L70 45 Z" fill="var(--muted)" />
          <path d="M40 30 L70 45 L70 75 L40 60 Z" fill="var(--secondary)" />
          <path d="M100 30 L70 45 L70 75 L100 60 Z" fill="var(--accent)" />
        </g>

        {/* Cube B -- offset, larger */}
        <g>
          <path d="M95 70 L135 50 L175 70 L135 90 Z" fill="var(--muted)" />
          <path d="M95 70 L135 90 L135 130 L95 110 Z" fill="var(--secondary)" />
          <path d="M175 70 L135 90 L135 130 L175 110 Z" fill="var(--accent)" />
        </g>

        {/* Mouse-reactive gradient outline over both cubes */}
        <path
          d="M40 30 L70 15 L100 30 L70 45 Z M40 30 L70 45 L70 75 L40 60 Z M100 30 L70 45 L70 75 L100 60 Z M95 70 L135 50 L175 70 L135 90 Z M95 70 L135 90 L135 130 L95 110 Z M175 70 L135 90 L135 130 L175 110 Z"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <path
          d="M40 30 L70 15 L100 30 L70 45 Z M40 30 L70 45 L70 75 L40 60 Z M100 30 L70 45 L70 75 L100 60 Z M95 70 L135 50 L175 70 L135 90 Z M95 70 L135 90 L135 130 L95 110 Z M175 70 L135 90 L135 130 L175 110 Z"
          stroke={`url(#${gradientId})`}
          strokeWidth="1"
          strokeOpacity="0.6"
        />
      </motion.svg>

      {caption && (
        <span className="text-muted-foreground/60 pointer-events-none absolute right-0 bottom-0 font-mono text-xs select-none">
          {caption}
        </span>
      )}
    </div>
  )
}
