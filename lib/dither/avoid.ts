export type AvoidRect = { x: number; y: number; w: number; h: number }

/**
 * Keep-out zones for a scene: every `[data-scene-avoid]` element inside the
 * canvas's nearest section, in the canvas's own CSS px.
 */
export function measureAvoid(canvas: HTMLCanvasElement): AvoidRect[] {
  const host = canvas.closest("section") ?? document.body
  const c = canvas.getBoundingClientRect()
  return Array.from(host.querySelectorAll("[data-scene-avoid]")).map((el) => {
    const r = el.getBoundingClientRect()
    return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height }
  })
}

/**
 * A per-cell mask: 1 inside a keep-out rect, easing to 0 `feather` px away.
 * Multiply a tone by `1 - strength * mask` and the scene dissolves around the text.
 */
export function avoidMask(
  cols: number,
  rows: number,
  cell: number,
  rects: AvoidRect[],
  feather: number
): Float32Array {
  const mask = new Float32Array(cols * rows)
  if (rects.length === 0) return mask
  for (let r = 0; r < rows; r++) {
    const py = (r + 0.5) * cell
    for (let c = 0; c < cols; c++) {
      const px = (c + 0.5) * cell
      let best = 0
      for (const a of rects) {
        const dx = Math.max(a.x - px, 0, px - (a.x + a.w))
        const dy = Math.max(a.y - py, 0, py - (a.y + a.h))
        const t = 1 - Math.hypot(dx, dy) / feather
        if (t > best) best = t
      }
      mask[r * cols + c] = best > 0 ? best * best * (3 - 2 * best) : 0
    }
  }
  return mask
}
