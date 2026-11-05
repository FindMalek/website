"use client"

import { useSyncExternalStore } from "react"

export const VIEW_KEY = "findmalek:view"

const subscribe = (): (() => void) => () => {}
const isSimple = (): boolean => document.documentElement.dataset.view === "simple"

/** Flip between the full and simple views. The choice is remembered and applied before paint. */
export function toggleView(): void {
  const next = isSimple() ? "full" : "simple"
  try {
    window.localStorage.setItem(VIEW_KEY, next)
  } catch {
    // Private mode: the view just will not be remembered.
  }
  // A reload is the honest way to stop or start every scene at once.
  window.location.reload()
}

/** A text control for the footer, so the simple view is reachable without a long press. */
export function ViewSwitch() {
  const simple = useSyncExternalStore(subscribe, isSimple, () => false)

  return (
    <button
      type="button"
      onClick={toggleView}
      className="text-muted-foreground hover:text-foreground text-xs lowercase underline underline-offset-4"
    >
      {simple ? "full view" : "simple view"}
    </button>
  )
}
