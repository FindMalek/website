"use client"

import { useEffect, useRef, type RefObject } from "react"

import { readDitherPalette, watchTheme, type DitherPalette } from "@/lib/dither/palette"
import { subscribe } from "@/lib/dither/ticker"

/** A pleasing frozen moment, used when the user prefers reduced motion. */
export const STILL_TIME = 21.5

export type LoopInfo = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  /** CSS size of the canvas. */
  width: number
  height: number
  /** Backing-store size: equals the grid in pixel mode, CSS px * dpr otherwise. */
  bufferWidth: number
  bufferHeight: number
  dpr: number
  palette: DitherPalette
}

export type LoopInput = {
  /** CSS px relative to the canvas; `active` while the pointer is over it. */
  pointer: { x: number; y: number; active: boolean }
  clicks: { x: number; y: number; t: number }[]
  reduced: boolean
  /** True while the primary button is held after pressing inside the canvas. */
  pressed: boolean
  /** Horizontal pointer travel while pressed, in CSS px since the last frame. Consumers reset it. */
  dragX: number
  /** Presses that were released without dragging. Consumers drain it. */
  taps: { x: number; y: number; t: number }[]
  /** True while drawing the single frozen frame (reduced motion, still, or hover mode at rest). */
  still: boolean
}

type Options<S> = {
  fps: number
  /** Pixel mode: one backing pixel per `cell` CSS px, scaled up pixelated. */
  cell?: number
  interactive?: boolean
  /** Draw once per (re)size instead of running a frame loop. */
  still?: boolean
  /** Static at rest: one frozen frame, looping only while the pointer is near. */
  hover?: boolean
  /** Cap on the device pixel ratio for text-mode canvases. Large scenes use less. */
  maxDpr?: number
  /** Hold the last frame while the page scrolls. On by default. */
  pauseOnScroll?: boolean
  setup: (info: LoopInfo) => S
  frame: (state: S, info: LoopInfo, time: number, dt: number, input: LoopInput) => void
}

const IDLE = -1e5

export function useDitherLoop<S>(
  ref: RefObject<HTMLCanvasElement | null>,
  options: Options<S>
): void {
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // The simple view runs no scenes at all: nothing is set up, drawn or observed.
    if (document.documentElement.dataset.view === "simple") return

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const input: LoopInput = {
      pointer: { x: IDLE, y: IDLE, active: false },
      clicks: [],
      reduced: reducedQuery.matches,
      pressed: false,
      dragX: 0,
      taps: [],
      still: false,
    }
    let travel = 0
    let info: LoopInfo | null = null
    let state: S | null = null
    let unsubscribe: (() => void) | null = null
    let resizeFrame = 0
    let sleepTimer: ReturnType<typeof setTimeout> | undefined

    const drawStill = (): void => {
      input.still = true
      draw(STILL_TIME, 0)
      input.still = false
    }

    const draw = (time: number, dt: number): void => {
      if (info && state !== null) {
        optionsRef.current.frame(state, info, time, dt, input)
      }
    }

    const start = (): void => {
      unsubscribe?.()
      unsubscribe = null
      input.reduced = reducedQuery.matches
      if (input.reduced || optionsRef.current.still || optionsRef.current.hover) {
        drawStill()
      } else {
        wake()
      }
    }

    function wake(): void {
      clearTimeout(sleepTimer)
      if (unsubscribe) return
      unsubscribe = subscribe(
        canvas as HTMLCanvasElement,
        draw,
        optionsRef.current.fps,
        optionsRef.current.pauseOnScroll ?? true
      )
    }

    // Let springs settle before the loop stops and the last frame is kept.
    const sleepSoon = (): void => {
      clearTimeout(sleepTimer)
      sleepTimer = setTimeout(() => {
        unsubscribe?.()
        unsubscribe = null
      }, 1600)
    }

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const o = optionsRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const dpr = o.cell ? 1 : Math.min(window.devicePixelRatio || 1, o.maxDpr ?? 2)
      const bufferWidth = o.cell
        ? Math.ceil(rect.width / o.cell)
        : Math.round(rect.width * dpr)
      const bufferHeight = o.cell
        ? Math.ceil(rect.height / o.cell)
        : Math.round(rect.height * dpr)
      canvas.width = bufferWidth
      canvas.height = bufferHeight
      if (!o.cell) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      info = {
        canvas,
        ctx,
        width: rect.width,
        height: rect.height,
        bufferWidth,
        bufferHeight,
        dpr,
        palette: readDitherPalette(canvas),
      }
      state = o.setup(info)
      if (input.reduced || o.still || o.hover) drawStill()
    }

    // Set up lazily: a scene that never nears the viewport never costs anything.
    let ready = false

    const scheduleResize = (): void => {
      if (!ready) return
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(resize)
    }

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const pad = 24
      const inside =
        x >= -pad && y >= -pad && x <= rect.width + pad && y <= rect.height + pad
      return { x, y, inside }
    }
    const interactive = (e: Event): boolean =>
      e.target instanceof Element &&
      !!e.target.closest("a, button, input, textarea, select, [role=button]")
    const onMove = (e: PointerEvent): void => {
      if (input.pressed) {
        input.dragX += e.movementX
        travel += Math.hypot(e.movementX, e.movementY)
      }
      const p = toLocal(e)
      input.pointer.x = p.x
      input.pointer.y = p.y
      input.pointer.active = p.inside && e.pointerType !== "touch"
      if (optionsRef.current.hover && !input.reduced) {
        if (input.pointer.active) wake()
        else if (unsubscribe) sleepSoon()
      }
    }
    const onUp = (e: PointerEvent): void => {
      if (!input.pressed) return
      input.pressed = false
      if (travel < 6 && !input.reduced) {
        const p = toLocal(e)
        input.taps.push({ x: p.x, y: p.y, t: performance.now() / 1000 })
        if (input.taps.length > 6) input.taps.shift()
      }
    }
    const onDown = (e: PointerEvent): void => {
      const p = toLocal(e)
      if (p.inside && !input.reduced && !interactive(e)) {
        input.pressed = true
        travel = 0
        input.clicks.push({ x: p.x, y: p.y, t: performance.now() / 1000 })
        if (input.clicks.length > 6) input.clicks.shift()
      }
    }
    const onLeave = (): void => {
      input.pointer.active = false
      if (optionsRef.current.hover && unsubscribe) sleepSoon()
    }

    const observer = new ResizeObserver(scheduleResize)
    observer.observe(canvas)
    const stopTheme = watchTheme(scheduleResize)
    const onMotionChange = (): void => {
      if (ready) start()
    }
    reducedQuery.addEventListener("change", onMotionChange)
    // Only re-run setup for late fonts if they have not already loaded.
    if (document.fonts && document.fonts.status !== "loaded") {
      void document.fonts.ready.then(scheduleResize)
    }

    if (optionsRef.current.interactive) {
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("pointerdown", onDown, { passive: true })
      window.addEventListener("pointerup", onUp, { passive: true })
      window.addEventListener("pointercancel", onUp, { passive: true })
      document.documentElement.addEventListener("pointerleave", onLeave)
      window.addEventListener("blur", onLeave)
    }

    const init = (): void => {
      if (ready) return
      ready = true
      resize()
      start()
    }
    const wakeObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (records) => {
              if (records.some((r) => r.isIntersecting)) {
                init()
                wakeObserver?.disconnect()
              }
            },
            { rootMargin: "240px" }
          )
    if (wakeObserver) wakeObserver.observe(canvas)
    else init()

    return () => {
      wakeObserver?.disconnect()
      cancelAnimationFrame(resizeFrame)
      clearTimeout(sleepTimer)
      unsubscribe?.()
      observer.disconnect()
      stopTheme()
      reducedQuery.removeEventListener("change", onMotionChange)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
    }
  }, [ref])
}
