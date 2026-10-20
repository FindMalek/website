"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

function subscribePrefersReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

function getPrefersReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getPrefersReducedMotionServerSnapshot() {
  return false
}

interface TypewriterTextProps {
  text: string
  speed?: number
  skip?: boolean
  onComplete?: () => void
  onTick?: (charIndex: number) => void
  className?: string
}

export function TypewriterText({
  text,
  speed = 16,
  skip = false,
  onComplete,
  onTick,
  className,
}: TypewriterTextProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot
  )

  // Latch the transient skip so a brief Space press keeps the current text
  // instance revealed even after the prop returns to false.
  const [latchedSkip, setLatchedSkip] = useState(skip)
  useEffect(() => {
    if (!skip || latchedSkip) return
    let cancelled = false
    const id = setTimeout(() => {
      if (!cancelled) setLatchedSkip(true)
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [skip, latchedSkip])

  const shouldRevealInstantly = latchedSkip || prefersReducedMotion

  // Parent passes key={text} so a text change remounts and resets this state.
  const [displayedChars, setDisplayedChars] = useState(0)
  const shownChars = shouldRevealInstantly ? text.length : displayedChars

  const completedRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)
  const onTickRef = useRef(onTick)

  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // Animation loop. State resets happen through remounts, so this effect only
  // drives the reveal forward.
  useEffect(() => {
    if (shouldRevealInstantly) {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }

    completedRef.current = false
    lastFrameRef.current = 0

    const animate = (timestamp: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp
      const elapsed = timestamp - lastFrameRef.current

      if (elapsed >= speed) {
        lastFrameRef.current = timestamp
        setDisplayedChars((prev) => {
          const next = Math.min(prev + 1, text.length)
          const nextChar = text[next - 1]
          if (next > prev && nextChar && nextChar !== " ") {
            onTickRef.current?.(next)
          }
          if (next === text.length && !completedRef.current) {
            completedRef.current = true
            onComplete?.()
          }
          return next
        })
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [text, speed, shouldRevealInstantly, onComplete])

  const visibleText = text.slice(0, shownChars)

  return (
    <span className={cn("relative", className)}>
      {/* Visible animated text */}
      <span aria-hidden={!shouldRevealInstantly}>{visibleText}</span>
      {/* Screen readers and final DOM always see the full text */}
      <span className="sr-only">{text}</span>
      {/* Editorial terminal caret */}
      {shownChars < text.length && !shouldRevealInstantly && (
        <span
          className="bg-primary ml-1 inline-block h-[0.88em] w-[2.5px] translate-y-[0.08em] animate-pulse align-baseline"
          aria-hidden
        />
      )}
    </span>
  )
}
