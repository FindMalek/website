"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { clamp } from "@/lib/utils"
import { useChatDock } from "@/providers/chat-provider"

import { Icons } from "@/components/shared/icons"

const APPEAR_AT = 200
const FULL_OPACITY_AT = 800
const MIN_OPACITY = 0.35

/**
 * Homepage-only "back to top" button. Hidden near the top of the page (no
 * point offering it when you're already there), then fades in and keeps
 * getting more visible the further down you scroll -- not a single jump from
 * invisible to fully opaque.
 */
export function ScrollToTop() {
  const pathname = usePathname()
  const { dockState } = useChatDock()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollY = () => {
      setScrollY(window.scrollY)
      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateScrollY)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname !== "/" || dockState === "docked" || scrollY < APPEAR_AT) {
    return null
  }

  const opacity = clamp(
    MIN_OPACITY +
      ((scrollY - APPEAR_AT) / (FULL_OPACITY_AT - APPEAR_AT)) *
        (1 - MIN_OPACITY),
    MIN_OPACITY,
    1
  )

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{ opacity }}
      className="bg-background fixed right-4 bottom-24 z-30 flex size-10 items-center justify-center rounded-full border shadow-lg transition-opacity md:right-6"
    >
      <Icons.up className="size-4" />
    </button>
  )
}
