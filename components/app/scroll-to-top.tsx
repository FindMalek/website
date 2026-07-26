"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useChatDock } from "@/providers/chat-provider"

import { Icons } from "@/components/shared/icons"

const APPEAR_AT = 200
const DIRECTION_DELTA_THRESHOLD = 5

/**
 * Homepage-only "back to top" button. Hidden near the top of the page (no
 * point offering it when you're already there). Below that, it's driven by
 * scroll *direction*, not position: scrolling up (a "let me go back" signal)
 * reveals it clearly; scrolling down keeps it stealthy -- barely-there on
 * desktop, fully hidden on mobile so it doesn't sit in the way of reading.
 */
export function ScrollToTop() {
  const pathname = usePathname()
  const { dockState } = useChatDock()
  const [scrollY, setScrollY] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (Math.abs(delta) > DIRECTION_DELTA_THRESHOLD) {
        setIsScrollingUp(delta < 0)
        lastScrollY.current = currentY
      }

      setScrollY(currentY)
      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname !== "/" || dockState === "docked" || scrollY < APPEAR_AT) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "bg-background fixed right-4 bottom-20 z-30 flex size-8 items-center justify-center rounded-full border shadow-md transition-opacity duration-300 md:right-6",
        isScrollingUp
          ? "opacity-70 hover:opacity-100"
          : "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-15 md:hover:opacity-60"
      )}
    >
      <Icons.up className="size-3.5" />
    </button>
  )
}
