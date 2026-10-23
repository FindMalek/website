import { useCallback, useEffect, useState, useSyncExternalStore } from "react"

const CHARS_PER_SECOND = 220
export const TYPEWRITER_MAX_CHARS = 450

function subscribe(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )
}

export function useTypewriter(totalChars: number, enabled: boolean) {
  const reduced = usePrefersReducedMotion()
  const animate = enabled && !reduced && totalChars <= TYPEWRITER_MAX_CHARS
  const [count, setCount] = useState(0)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    if (!animate || skipped) return
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const next = Math.min(
        totalChars,
        Math.floor(((now - start) / 1000) * CHARS_PER_SECOND)
      )
      setCount(next)
      if (next < totalChars) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [animate, skipped, totalChars])

  const finish = useCallback(() => setSkipped(true), [])
  const done = !animate || skipped || count >= totalChars

  return { count: done ? totalChars : count, done, finish }
}
