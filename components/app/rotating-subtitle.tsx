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
    <p className="text-muted-foreground grid text-base">
      {/*
       * Invisible sizer stack: every line placed in the same grid cell
       * (col-start-1 row-start-1) makes the row's auto height the max of
       * all of them, so rotating between a 1-line and a 2-line subtitle
       * (e.g. on mobile, where the headline wraps but the other line
       * doesn't) never shifts the content below it. Which one wraps
       * tallest depends on font metrics and viewport width, so this has
       * to be measured by the browser rather than precomputed.
       */}
      {lines.map((line) => (
        <span
          key={line}
          aria-hidden
          className="invisible col-start-1 row-start-1 block w-fit"
        >
          {line}
        </span>
      ))}

      <AnimatePresence mode="wait">
        <motion.span
          key={lines[index]}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="animate-shine col-start-1 row-start-1 block w-fit bg-[length:200%_100%] bg-clip-text text-transparent [background-image:linear-gradient(110deg,var(--muted-foreground)_40%,var(--foreground)_50%,var(--muted-foreground)_60%)]"
        >
          {lines[index]}
        </motion.span>
      </AnimatePresence>
    </p>
  )
}
