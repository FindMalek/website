"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

const ROTATE_INTERVAL_MS = 4000

export function RotatingSubtitle({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || lines.length <= 1) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [lines.length, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <p className="text-muted-foreground text-base">{lines[0]}</p>
  }

  return (
    <p className="text-muted-foreground relative block h-6 overflow-hidden text-base">
      <AnimatePresence mode="wait">
        <motion.span
          key={lines[index]}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {lines[index]}
        </motion.span>
      </AnimatePresence>
    </p>
  )
}
