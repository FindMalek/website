"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { toast } from "sonner"

import {
  findActiveCelebration,
  findCelebrationById,
  type Celebration,
} from "@/config/celebrations"

interface CelebrationContextValue {
  celebration: Celebration | null
  enabled: boolean
  toggle: () => void
}

const CelebrationContext = createContext<CelebrationContextValue>({
  celebration: null,
  enabled: false,
  toggle: () => {},
})

const STORAGE_PREFIX = "celebration:"

function storageKey(celebration: Celebration, now: Date): string {
  return `${STORAGE_PREFIX}${celebration.id}:${now.getFullYear()}`
}

export function useCelebration(): CelebrationContextValue {
  return useContext(CelebrationContext)
}

export function CelebrationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [now, setNow] = useState<Date | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [choice, setChoice] = useState<"on" | "off" | null>(null)

  useEffect(() => {
    // Date, query string and geo only exist client-side, so they can't seed
    // useState without a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setNow(new Date())
    setPreviewId(new URLSearchParams(window.location.search).get("celebration"))
    /* eslint-enable react-hooks/set-state-in-effect */

    const controller = new AbortController()
    fetch("/api/geo", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { country: string | null }) => setCountry(data.country))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const celebration = useMemo(() => {
    if (!now) return null
    const preview = previewId ? findCelebrationById(previewId) : undefined
    return preview ?? findActiveCelebration(now, country)
  }, [now, country, previewId])

  useEffect(() => {
    if (!celebration || !now) return
    try {
      const stored = localStorage.getItem(storageKey(celebration, now))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(stored === "on" || stored === "off" ? stored : null)
    } catch {
      setChoice(null)
    }
  }, [celebration, now])

  const enabled = !celebration
    ? false
    : choice
      ? choice === "on"
      : celebration.mode === "auto" || previewId !== null

  useEffect(() => {
    const root = document.documentElement
    if (!celebration || !enabled) {
      delete root.dataset.celebration
      return
    }
    root.dataset.celebration = celebration.id
    root.style.setProperty("--cel-h", String(celebration.hue))
    root.style.setProperty("--cel-c", String(celebration.chroma))
    celebration.glow.forEach((color, i) =>
      root.style.setProperty(`--glow-${i}`, color)
    )
    return () => {
      delete root.dataset.celebration
    }
  }, [celebration, enabled])

  const toggle = useCallback(() => {
    if (!celebration || !now) return
    const next = enabled ? "off" : "on"
    setChoice(next)
    try {
      localStorage.setItem(storageKey(celebration, now), next)
    } catch {}
    if (next === "on") toast(celebration.greeting)
  }, [celebration, now, enabled])

  const value = useMemo(
    () => ({ celebration, enabled, toggle }),
    [celebration, enabled, toggle]
  )

  return (
    <CelebrationContext.Provider value={value}>
      {children}
    </CelebrationContext.Provider>
  )
}
