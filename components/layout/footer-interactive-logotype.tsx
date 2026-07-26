"use client"

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"

export function FooterInteractiveLogotype() {
  const shouldReduceMotion = useReducedMotion()

  const gradientXRaw = useMotionValue(50)
  const gradientX = useSpring(gradientXRaw, { stiffness: 150, damping: 25 })
  const backgroundPosition = useTransform(gradientX, (x) => `${x}% center`)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    gradientXRaw.set(((event.clientX - rect.left) / rect.width) * 100)
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    gradientXRaw.set(50)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex w-full items-center justify-center overflow-hidden py-8"
    >
      <motion.span
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--muted-foreground) 0%, var(--foreground) 50%, var(--muted-foreground) 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: shouldReduceMotion
            ? "50% center"
            : backgroundPosition,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
        className="font-heading text-4xl font-bold tracking-tight select-none sm:text-6xl"
      >
        findmalek
      </motion.span>
      <span className="sr-only">findmalek</span>
    </div>
  )
}
