"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

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
  const [displayedChars, setDisplayedChars] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const completedRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)
  const countRef = useRef(0)

  // Respect prefers-reduced-motion on mount.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mq.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const shouldRevealInstantly = skip || prefersReducedMotion

  useEffect(() => {
    completedRef.current = false
    countRef.current = 0
    setDisplayedChars(0)
    lastFrameRef.current = 0

    if (shouldRevealInstantly) {
      countRef.current = text.length
      setDisplayedChars(text.length)
      completedRef.current = true
      onComplete?.()
      return
    }

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

  // When skip flips to true mid-animation, finish immediately.
  useEffect(() => {
    if (skip && countRef.current < text.length) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      countRef.current = text.length
      setDisplayedChars(text.length)
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
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
