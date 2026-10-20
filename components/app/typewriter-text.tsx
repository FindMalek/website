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
  className?: string
}

export function TypewriterText({
  text,
  speed = 18,
  skip = false,
  onComplete,
  className,
}: TypewriterTextProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot
  )

  const shouldRevealInstantly = skip || prefersReducedMotion

  // Initialize to the full text when we should reveal instantly; otherwise 0.
  // Parent passes key={text} so a text change remounts and resets this state.
  const [displayedChars, setDisplayedChars] = useState(() =>
    shouldRevealInstantly ? text.length : 0
  )

  const completedRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)

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

  // When skip flips to true mid-animation, finish in a microtask so we don't
  // synchronously setState inside the effect body.
  useEffect(() => {
    if (skip && displayedChars < text.length) {
      let cancelled = false
      const id = setTimeout(() => {
        if (cancelled) return
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        setDisplayedChars(text.length)
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
      }, 0)
      return () => {
        cancelled = true
        clearTimeout(id)
      }
    }
  }, [skip, displayedChars, text.length, onComplete])

  const visibleText = text.slice(0, displayedChars)

  return (
    <span className={cn("relative", className)}>
      {/* Visible animated text */}
      <span aria-hidden={!shouldRevealInstantly}>{visibleText}</span>
      {/* Screen readers and final DOM always see the full text */}
      <span className="sr-only">{text}</span>
      {/* Cursor */}
      {displayedChars < text.length && !shouldRevealInstantly && (
        <span className="animate-pulse" aria-hidden>
          |
        </span>
      )}
    </span>
  )
}
