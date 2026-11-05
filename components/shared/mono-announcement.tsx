"use client"

import { useEffect, useRef, useState } from "react"

import { MONO_EVENT } from "@/components/shared/mode-toggle"

const SWITCH_AT_MS = 1300
const TOTAL_MS = 4200

/**
 * The full-screen announcement that the site has gone black and white. It
 * follows the "YOU DIED" card on the hero: a dark screen, one big mono line
 * with a coloured offset, and a quiet second line. The page behind switches
 * to monochrome while the screen is still opaque, then is revealed. It lasts
 * until the page is refreshed; nothing is saved.
 */
export function MonoAnnouncement() {
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const start = (): void => {
      if (document.documentElement.classList.contains("mono")) return
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setPhase("in")
      timers.current.push(
        setTimeout(() => {
          document.documentElement.classList.add("mono")
        }, reduced ? 200 : SWITCH_AT_MS),
        setTimeout(() => setPhase("out"), reduced ? 1600 : TOTAL_MS - 700),
        setTimeout(() => setPhase("idle"), reduced ? 2000 : TOTAL_MS)
      )
    }
    window.addEventListener(MONO_EVENT, start)
    const pending = timers.current
    return () => {
      window.removeEventListener(MONO_EVENT, start)
      pending.forEach(clearTimeout)
    }
  }, [])

  if (phase === "idle") return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mono-announce fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black px-6 text-center font-mono ${phase === "out" ? "mono-announce-out" : ""}`}
    >
      <p className="mono-announce-title text-4xl font-bold uppercase tracking-tight text-white sm:text-7xl">
        black &amp; white
      </p>
      <p className="mono-announce-sub text-sm text-neutral-400 sm:text-base">
        the colour is gone. it is not coming back.
      </p>
    </div>
  )
}
