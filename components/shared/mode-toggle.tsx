"use client"

import { useRef, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

import { PixelBitmap } from "@/components/dither/pixel-icon"
import { toggleView } from "@/components/shared/view-switch"

// 7x7 bitmaps rendered at 14px: exactly 2px per cell, so they stay crisp.
const SUN = [
  "...#...",
  ".#...#.",
  "..###..",
  "#.###.#",
  "..###..",
  ".#...#.",
  "...#...",
]
const MOON = [
  "..###..",
  ".##....",
  "##.....",
  "##.....",
  "##.....",
  ".##..##",
  "..#####",
]

type Mode = "light" | "dark"

const MONO_CLICKS = 6
const MONO_WINDOW_MS = 3500
const HOLD_MS = 900
const recentClicks: number[] = []

export const MONO_EVENT = "findmalek:mono"

/**
 * Six quick clicks on the theme switch turns black and white on, for good: it is
 * announced full screen (see MonoAnnouncement) and never turned back off.
 */
function registerClick(): void {
  if (document.documentElement.classList.contains("mono")) return
  const now = Date.now()
  recentClicks.push(now)
  while (recentClicks.length > 0 && now - recentClicks[0] > MONO_WINDOW_MS) recentClicks.shift()
  if (recentClicks.length < MONO_CLICKS) return
  recentClicks.length = 0
  window.dispatchEvent(new Event(MONO_EVENT))
}

const emptySubscribe = (): (() => void) => () => {}

/** The active mode, or null until the client knows it (avoids a hydration mismatch). */
function useMode() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const mode: Mode | null =
    mounted && (resolvedTheme === "dark" || resolvedTheme === "light") ? resolvedTheme : null
  const held = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const set = (next: Mode): void => {
    // A press long enough to open the plain version must not also flip the theme.
    if (held.current) {
      held.current = false
      return
    }
    setTheme(next)
    registerClick()
  }
  const holdProps = {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>): void => {
      held.current = false
      const el = e.currentTarget
      el.dataset.holding = "true"
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        held.current = true
        delete el.dataset.holding
        toggleView()
      }, HOLD_MS)
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>): void => {
      clearTimeout(timer.current)
      delete e.currentTarget.dataset.holding
    },
    onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>): void => {
      clearTimeout(timer.current)
      delete e.currentTarget.dataset.holding
    },
  }
  return { mode, set, holdProps }
}

function ModeIcon({ mode, className }: { mode: Mode; className?: string }) {
  return (
    <PixelBitmap
      rows={mode === "light" ? SUN : MOON}
      className={cn("size-3.5 shrink-0", className)}
    />
  )
}

/**
 * A two-way switch, icons only: sun | moon. The active side is stippled, so the
 * current mode is obvious at a glance. Labels live in aria-label and title.
 */
export function ModeToggle({ className }: { className?: string }) {
  const { mode, set, holdProps } = useMode()

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={cn("border-foreground/25 inline-flex border", className)}
    >
      {(["light", "dark"] as const).map((m) => {
        const active = mode === m
        return (
          <button
            key={m}
            type="button"
            aria-pressed={active}
            aria-label={`${m} theme`}
            title={`${m} theme`}
            onClick={() => set(m)}
            {...holdProps}
            className={cn(
              "dither-hover flex size-8 items-center justify-center transition-colors",
              m === "dark" && "border-foreground/25 border-l",
              active ? "dither-active text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ModeIcon mode={m} />
          </button>
        )
      })}
    </div>
  )
}

/** One square button for tight spaces (the nav bar): shows the current mode, toggles on click. */
export function ModeToggleCompact({ className }: { className?: string }) {
  const { mode, set, holdProps } = useMode()
  const next: Mode = mode === "dark" ? "light" : "dark"

  return (
    <button
      type="button"
      onClick={() => set(next)}
      {...holdProps}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme. Hold for the simple view.`}
      className={cn(
        "dither-hover text-foreground flex size-8 items-center justify-center",
        className
      )}
    >
      <ModeIcon mode={mode ?? "dark"} />
    </button>
  )
}
