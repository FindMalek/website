import { useEffect, useRef } from "react"

/**
 * The nav pill sits flush with the top edge at scrollY 0 and drops to 1.5rem
 * as soon as the page scrolls. That is the only scroll-linked state, so it
 * is toggled on the header element only when it flips, never per scroll tick.
 * (The old version rewrote ~10 variables on <html> every scroll event, which
 * invalidated style for the whole document.)
 */
export function useHeaderAnimation(isHomePage: boolean) {
  const headerRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current?.parentElement
    if (!header) return

    let atTop: boolean | null = null
    const update = (): void => {
      const next = window.scrollY <= 0
      if (next === atTop) return
      atTop = next
      header.style.setProperty("--header-top", next ? "0px" : "1.5rem")
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      header.style.removeProperty("--header-top")
    }
  }, [isHomePage])

  return { headerRef, avatarRef }
}
