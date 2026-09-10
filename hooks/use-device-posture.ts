"use client"

import { useEffect, useState } from "react"

type DevicePosture = "continuous" | "folded"

interface NavigatorWithDevicePosture extends Navigator {
  devicePosture: {
    type: DevicePosture
    addEventListener: (type: "change", listener: () => void) => void
    removeEventListener: (type: "change", listener: () => void) => void
  }
}

/**
 * Wraps the Device Posture API (`navigator.devicePosture`). Returns
 * `undefined` when the API isn't supported -- Chromium/Samsung Internet
 * only, WebKit has no committed position (see
 * https://github.com/WebKit/standards-positions/issues/328) -- so callers
 * should treat `undefined` as "no-op on this browser" rather than a loading
 * state.
 */
export function useDevicePosture(): DevicePosture | undefined {
  const [posture, setPosture] = useState<DevicePosture | undefined>(
    undefined
  )

  useEffect(() => {
    if (!("devicePosture" in navigator)) return

    const nav = navigator as NavigatorWithDevicePosture
    const handleChange = () => setPosture(nav.devicePosture.type)

    handleChange()
    nav.devicePosture.addEventListener("change", handleChange)

    return () => nav.devicePosture.removeEventListener("change", handleChange)
  }, [])

  return posture
}
