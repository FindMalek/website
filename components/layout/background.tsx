"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { PAGES } from "@/config/consts"

import { DitherBackdrop } from "@/components/dither/dither-backdrop"

function getPageLabel(pathname: string): string {
  // Check if path has more than one segment (has a dynamic part)
  const pathSegments = pathname.split("/").filter(Boolean)

  // Post slugs are sentence-length; at 200px they read as noise, not a label.
  if (pathSegments[0] === "blog" && pathSegments.length > 1) return ""

  if (pathSegments.length > 1) {
    // Use the last segment as the label
    return pathSegments[pathSegments.length - 1]
  }

  const currentPage = Object.values(PAGES).find(
    (page) => page.path === pathname
  )
  return currentPage?.label || PAGES.NOT_FOUND.label
}

// Distance (px) over which the page label fades out as the footer wordmark
// rises into view, so the two big words never stack on each other.
const LABEL_FADE_DISTANCE = 320

/**
 * The page's static ground: a dithered nebula and starfield, and a huge mono page label.
 * Nothing moves here. The old drifting squares and blurred glow blobs are
 * gone; motion now lives only in deliberate scenes (see the dither design
 * system rules).
 */
export function Background() {
  const pathname = usePathname()
  const pageLabel = getPageLabel(pathname)
  const labelRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const label = labelRef.current
    const footer = document.querySelector("footer")
    if (!label || !footer) return

    let frame: number | null = null
    const update = (): void => {
      frame = null
      const visible = window.innerHeight - footer.getBoundingClientRect().top
      const progress = Math.min(1, Math.max(0, visible / LABEL_FADE_DISTANCE))
      label.style.opacity = String(1 - progress)
      label.style.transform = `translateY(${progress * 48}px)`
    }
    const schedule = (): void => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [pageLabel])

  return (
    <div className="bg-background fixed left-0 top-0 isolate -z-50 h-full w-full overflow-hidden">
      <DitherBackdrop className="absolute inset-0 -z-10 simple:hidden" />

      {pageLabel && (
        <h1
          ref={labelRef}
          className="text-foreground/5 fixed -bottom-24 -left-10 -z-40 select-none font-mono text-9xl font-bold lowercase"
        >
          {pageLabel}
        </h1>
      )}
    </div>
  )
}
