"use client"

import { useEffect, useRef } from "react"

import { useDevicePosture } from "@/hooks/use-device-posture"

/**
 * Fold/unfold sound for the (currently Chromium/Samsung-Internet-only)
 * Device Posture API -- see hooks/use-device-posture.ts. No-ops on every
 * other browser, including Safari, so this never plays on a real iPhone
 * today. Paired with the `.hero-name` dim effect in globals.css, which uses
 * the CSS `device-posture` media feature directly and needs no JS.
 *
 * Playback isn't armed by a dedicated click listener -- it just attempts
 * `.play()` on each posture change and swallows the rejection if the
 * browser hasn't yet registered any interaction with the page.
 */
export function FoldableEasterEgg() {
  const posture = useDevicePosture()
  const previousPosture = useRef(posture)
  const foldAudioRef = useRef<HTMLAudioElement | null>(null)
  const unfoldAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const previous = previousPosture.current
    previousPosture.current = posture

    if (posture === undefined || posture === previous) return

    const audio =
      posture === "folded" ? foldAudioRef.current : unfoldAudioRef.current

    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [posture])

  return (
    <>
      <audio ref={foldAudioRef} src="/audio/device-fold.mp3" preload="none" />
      <audio
        ref={unfoldAudioRef}
        src="/audio/device-unfold.mp3"
        preload="none"
      />
    </>
  )
}
