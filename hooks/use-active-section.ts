"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export type SectionId = "work" | "projects" | "stack" | "about"
export type ActiveSection = SectionId | null

/**
 * Scroll-spy over the one-pager's anchor sections. Only observes on "/" —
 * on /work/[slug] and /projects/[slug] there's nothing to spy on, so this
 * returns null without ever creating an IntersectionObserver.
 */
export function useActiveSection(sectionIds: SectionId[]): ActiveSection {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)

  useEffect(() => {
    if (pathname !== "/") return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting)
        if (intersecting.length === 0) return

        const closest = intersecting.reduce((best, entry) =>
          entry.boundingClientRect.top < best.boundingClientRect.top
            ? entry
            : best
        )

        setActiveSection(closest.target.id as SectionId)
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      setActiveSection(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return activeSection
}
