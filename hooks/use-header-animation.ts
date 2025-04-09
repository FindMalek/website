import { useEffect, useRef } from "react"

import { clamp } from "@/lib/utils"

export function useHeaderAnimation(isHomePage: boolean) {
  const isInitial = useRef(true)
  const headerRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const upDelay = 64

    function setProperty(property: string, value: string) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      const downDelay = avatarRef.current?.offsetTop ?? 0

      const { top, height } = headerRef.current?.getBoundingClientRect() ?? {
        top: 0,
        height: 0,
      }
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      )

      if (isInitial.current) {
        setProperty("--header-position", "sticky")
      }

      setProperty("--content-offset", `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty("--header-height", `${downDelay + height}px`)
        setProperty("--header-mb", `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay)
        setProperty("--header-height", `${offset}px`)
        setProperty("--header-mb", `${height - offset}px`)
      } else if (top === 0) {
        setProperty("--header-height", `${scrollY + height}px`)
        setProperty("--header-mb", `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty("--header-inner-position", "fixed")
        removeProperty("--header-top")
        removeProperty("--avatar-top")
      } else {
        removeProperty("--header-inner-position")
        setProperty("--header-top", "0px")
        setProperty("--avatar-top", "0px")
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        // Reset avatar styles when not on homepage
        setProperty("--avatar-image-transform", "translate3d(0, 0, 0) scale(1)")
        setProperty(
          "--avatar-border-transform",
          "translate3d(0, 0, 0) scale(1)"
        )
        setProperty("--avatar-border-opacity", "0")
        setProperty("--header-top", "0px")
        setProperty("--avatar-top", "0px")
        return
      }

      const downDelay = avatarRef.current?.offsetTop ?? 0

      const fromScale = 1
      const toScale = 36 / 64
      const fromX = 0
      const toX = 2 / 16

      const scrollY = downDelay - window.scrollY

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      setProperty(
        "--avatar-image-transform",
        `translate3d(${x}rem, 0, 0) scale(${scale})`
      )

      const borderScale = 1 / (toScale / scale)
      const borderX = (-toX + x) * borderScale
      const borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`

      setProperty("--avatar-border-transform", borderTransform)
      setProperty("--avatar-border-opacity", String(scale === toScale ? 1 : 0))
    }

    function updateStyles() {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    // Reset all properties when component mounts or isHomePage changes
    function resetProperties() {
      // Clear all CSS custom properties
      removeProperty("--header-position")
      removeProperty("--content-offset")
      removeProperty("--header-height")
      removeProperty("--header-mb")
      removeProperty("--header-inner-position")
      removeProperty("--header-top")
      removeProperty("--avatar-top")
      removeProperty("--avatar-image-transform")
      removeProperty("--avatar-border-transform")
      removeProperty("--avatar-border-opacity")

      isInitial.current = true
    }

    // Special handler for resize events that does a complete reset and update
    function handleResize() {
      resetProperties()
      // Add a small delay to ensure the DOM has updated
      setTimeout(updateStyles, 0)
    }

    resetProperties()
    updateStyles()

    window.addEventListener("scroll", updateStyles, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", updateStyles)
      window.removeEventListener("resize", handleResize)
      // Clean up all properties on unmount
      resetProperties()
    }
  }, [isHomePage])

  return { headerRef, avatarRef }
}
