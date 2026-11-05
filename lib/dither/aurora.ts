import {
  fbm,
  signedNoise,
  smoothstep,
  valueNoise,
} from "@/lib/dither/noise"

export type Ripple = { x: number; y: number; t0: number }

export type AuroraOptions = {
  time: number
  /** Exact README clock: the generator's `11 + phase`, bypassing `time`. */
  phase?: number
  /** Extra light per cell (e.g. a wake field), added before tone mapping. */
  boost?: Float32Array
  /** Raises (+) or lowers (-) the curtains, as a fraction of canvas height. */
  lift?: number
  intensity?: number
  /** Pointer in cell coordinates, or null when idle. */
  pointer?: { x: number; y: number } | null
  ripples?: Ripple[]
  now?: number
}

const CURTAINS = 4
const RIPPLE_LIFE = 2.4
const RIPPLE_SPEED = 0.85

type Columns = { edge: Float32Array; ray: Float32Array; weight: Float32Array }

let scratch: Columns[] = []
let scratchCols = 0

function columns(cols: number): Columns[] {
  if (scratchCols !== cols) {
    scratch = Array.from({ length: CURTAINS }, () => ({
      edge: new Float32Array(cols),
      ray: new Float32Array(cols),
      weight: new Float32Array(cols),
    }))
    scratchCols = cols
  }
  return scratch
}

/**
 * Fills `out` (cols*rows, 0..1) with a drifting four-curtain aurora. All the
 * expensive noise depends only on x and time, so it is evaluated once per
 * column; the per-cell work is a handful of exponentials. Row 0 is the top.
 */
export function computeAurora(
  out: Float32Array,
  cols: number,
  rows: number,
  o: AuroraOptions
): void {
  const time = o.phase !== undefined ? 11 + o.phase : 11 + o.time * 0.8
  const lift = o.lift ?? 0
  const intensity = o.intensity ?? 0.82
  const col = columns(cols)

  for (let c = 0; c < cols; c++) {
    const x = (c - cols / 2) / rows + time * 0.01
    for (let i = 0; i < CURTAINS; i++) {
      const depth = i / (CURTAINS - 1)
      col[i].edge[c] =
        0.38 +
        i * 0.06 +
        lift +
        0.154 * signedNoise(x * 0.55 + i * 3.1, time * 0.035 + i * 1.7, 41) +
        0.04 * signedNoise(x * 2.1 - i * 1.3, time * 0.07 + i, 73)
      const rayX = (x + signedNoise(x * 0.8, time * 0.03 + i, 101) * 0.74) * 12
      let ray =
        0.2 + 0.8 * smoothstep(0.25, 0.75, fbm(rayX + i * 9, time * 0.045 + i, 131 + i * 11))
      ray *= 0.75 + 0.25 * valueNoise(rayX * 3.2, i * 4 + time * 0.02, 173 + i * 7)
      col[i].ray[c] = ray
      const patch =
        0.3 + 0.7 * smoothstep(0.25, 0.7, fbm(x * 0.45 + i * 5, time * 0.02 + i * 2, 211 + i * 13))
      col[i].weight[c] = patch * (1 - 0.5 * depth)
    }
  }

  const px = o.pointer ? o.pointer.x : 0
  const py = o.pointer ? o.pointer.y : 0
  const now = o.now ?? 0
  const live = (o.ripples ?? []).filter((r) => now - r.t0 < RIPPLE_LIFE)

  for (let r = 0; r < rows; r++) {
    const y = 1 - (r + 0.5) / rows
    for (let c = 0; c < cols; c++) {
      let light = 0
      for (let i = 0; i < CURTAINS; i++) {
        const above = y - col[i].edge[c]
        const abs = above < 0 ? -above : above
        const curtain =
          above > 0
            ? Math.exp(-above * 4.12 * (1 + i * 0.4))
            : Math.exp(above * 48)
        const ray = col[i].ray[c]
        const rim = Math.exp(-abs * 34) * 1.1
        const haze = above > 0 ? Math.exp(-above * 5) * 0.09 : Math.exp(above * 14) * 0.05
        light += (curtain * ray + rim * (0.5 + 0.5 * ray) + haze) * col[i].weight[c]
      }

      if (o.boost) light += o.boost[r * cols + c]

      if (o.pointer) {
        const dx = (c - px) / rows
        const dy = (r - py) / rows
        light += 0.55 * Math.exp(-(dx * dx + dy * dy) / 0.05)
      }
      for (const rip of live) {
        const dx = (c - rip.x) / rows
        const dy = (r - rip.y) / rows
        const d = Math.sqrt(dx * dx + dy * dy)
        const age = now - rip.t0
        const ring = d - age * RIPPLE_SPEED
        light += 0.9 * (1 - age / RIPPLE_LIFE) * Math.exp(-(ring * ring) / 0.003)
      }

      const tone = (1 - Math.exp(-light * 1.25)) * intensity
      out[r * cols + c] = smoothstep(0.035, 0.96, tone)
    }
  }
}
