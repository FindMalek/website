export type BayerSize = 2 | 4 | 8

function build(size: number): Float32Array {
  let n = 1
  let m = [0]
  while (n < size) {
    const nn = n * 2
    const next = new Array<number>(nn * nn)
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = m[y * n + x] * 4
        next[y * nn + x] = v
        next[y * nn + x + n] = v + 2
        next[(y + n) * nn + x] = v + 3
        next[(y + n) * nn + x + n] = v + 1
      }
    }
    m = next
    n = nn
  }
  return Float32Array.from(m, (v) => (v + 0.5) / (size * size))
}

export const BAYER: Record<BayerSize, Float32Array> = {
  2: build(2),
  4: build(4),
  8: build(8),
}

export function threshold(size: BayerSize, x: number, y: number): number {
  const mask = size - 1
  return BAYER[size][(y & mask) * size + (x & mask)]
}

/**
 * Ordered-dither a 0..1 tone onto `levels` discrete steps. The tone's
 * fractional part is compared with the Bayer threshold, so a flat 0.5 tone
 * lands as a checkerboard between two neighbouring levels.
 */
export function quantize(tone: number, levels: number, th: number): number {
  const scaled = Math.min(1, Math.max(0, tone)) * (levels - 1)
  const base = Math.floor(scaled)
  return Math.min(levels - 1, base + (scaled - base > th ? 1 : 0))
}
