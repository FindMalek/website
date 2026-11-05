type Entry = {
  el: Element
  cb: (time: number, dt: number) => void
  interval: number
  last: number
  visible: boolean
  pauseOnScroll: boolean
}

const entries = new Set<Entry>()
const byElement = new Map<Element, Set<Entry>>()
let raf = 0
let io: IntersectionObserver | null = null
let lastScroll = -1e9
let scrollBound = false

// Heavy canvases hold their last frame while the page is actively scrolling,
// so scrolling never competes with canvas work on the main thread.
const SCROLL_QUIET_MS = 140

function loop(now: number): void {
  raf = 0
  let running = false
  for (const e of entries) {
    if (!e.visible) continue
    running = true
    if (e.pauseOnScroll && now - lastScroll < SCROLL_QUIET_MS) continue
    const dt = now - e.last
    if (dt >= e.interval - 1) {
      e.last = now
      e.cb(now / 1000, Math.min(dt, 100) / 1000)
    }
  }
  if (running) raf = requestAnimationFrame(loop)
}

const wake = (): void => {
  if (!raf) raf = requestAnimationFrame(loop)
}

/**
 * One shared rAF loop for every dither canvas on the page. Each subscriber
 * is capped to its own fps and only ticks while its element is on screen.
 */
export function subscribe(
  el: Element,
  cb: Entry["cb"],
  fps: number,
  pauseOnScroll = true
): () => void {
  if (!scrollBound) {
    scrollBound = true
    window.addEventListener(
      "scroll",
      () => {
        lastScroll = performance.now()
      },
      { passive: true }
    )
  }
  io ??= new IntersectionObserver(
    (records) => {
      for (const rec of records) {
        byElement.get(rec.target)?.forEach((e) => {
          e.visible = rec.isIntersecting
          e.last = 0
        })
      }
      wake()
    },
    { rootMargin: "120px" }
  )

  const entry: Entry = {
    el,
    cb,
    interval: 1000 / fps,
    last: 0,
    visible: false,
    pauseOnScroll,
  }
  entries.add(entry)
  const bucket = byElement.get(el) ?? new Set<Entry>()
  bucket.add(entry)
  byElement.set(el, bucket)
  io.observe(el)

  return () => {
    entries.delete(entry)
    bucket.delete(entry)
    if (bucket.size === 0) {
      byElement.delete(el)
      io?.unobserve(el)
    }
  }
}
