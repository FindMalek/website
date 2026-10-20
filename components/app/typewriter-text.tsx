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
  const [displayedChars, setDisplayedChars] = useState(() =>
    shouldRevealInstantly ? text.length : 0
  )

  const completedRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)
  const countRef = useRef(displayedChars)

  // Sync the ref whenever displayedChars changes externally (e.g. skip).
  countRef.current = displayedChars

  // Animation loop. Resetting displayedChars happens through a remount (key=...)
  // so this effect only has to drive the animation forward.
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

      if (elapsed >= speed && countRef.current < text.length) {
        lastFrameRef.current = timestamp
        countRef.current += 1
        setDisplayedChars(countRef.current)
      }

      if (countRef.current < text.length) {
        rafRef.current = requestAnimationFrame(animate)
      } else if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [text, speed, shouldRevealInstantly, onComplete])

  // When skip flips to true mid-animation, finish in a microtask so we don't
  // synchronously setState inside the effect body.
  useEffect(() => {
    if (skip && countRef.current < text.length) {
      let cancelled = false
      const finish = () => {
        if (cancelled) return
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        countRef.current = text.length
        setDisplayedChars(text.length)
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
      }
      const id = setTimeout(finish, 0)
      return () => {
        cancelled = true
        clearTimeout(id)
      }
    }
  }, [skip, text.length, onComplete])

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
