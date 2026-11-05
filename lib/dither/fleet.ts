/**
 * A fleet of small sailing boats on a dithered sea. The water is a sum of
 * travelling sine waves; each boat is a damped spring that follows the surface
 * height and pitches to the wave slope, so it bobs and rolls the way a boat
 * does. All coordinates are in grid cells, y down.
 */

const WAVES = [
  { a: 2.6, k: 0.04, w: 0.17, p: 0 },
  { a: 1.3, k: 0.1, w: 0.27, p: 1.3 },
  { a: 0.5, k: 0.21, w: 0.4, p: 2.7 },
]

export type Layer = "back" | "mid" | "front"

/** Where each water layer sits, as a fraction of the grid height, and its phase shift. */
const LAYERS: Record<Layer, { base: number; shift: number; scale: number }> = {
  back: { base: 0.6, shift: 1.9, scale: 0.7 },
  mid: { base: 0.67, shift: 0, scale: 1 },
  front: { base: 0.67, shift: 0.5, scale: 1.1 },
}

export type Boat = {
  client: number
  x: number
  y: number
  vy: number
  angle: number
  vang: number
  speed: number
}

/** The sprite is drawn at this multiple of its design size. */
export const BOAT_SCALE = 1.4
export const BOAT_HALF_WIDTH = Math.ceil(8 * BOAT_SCALE)
export const BOAT_HEIGHT = Math.ceil(13 * BOAT_SCALE)

export class Fleet {
  boats: Boat[] = []
  time = 0
  private nextClient: number

  constructor(
    readonly cols: number,
    readonly rows: number,
    private clientCount: number
  ) {
    const n = Math.max(3, Math.min(clientCount, Math.floor((cols + 24) / 40)))
    this.nextClient = n % clientCount
    const span = cols + 28
    for (let i = 0; i < n; i++) {
      const x = -14 + (span * (i + 0.5)) / n
      this.boats.push({
        client: i % clientCount,
        x,
        y: this.surface("mid", x, 0),
        vy: 0,
        angle: 0,
        vang: 0,
        speed: 1.1 + 0.5 * ((i * 7) % 5) / 4,
      })
    }
  }

  /** Surface row of a water layer at column x. */
  surface(layer: Layer, x: number, t: number): number {
    const l = LAYERS[layer]
    let h = this.rows * l.base
    for (const w of WAVES) h += w.a * l.scale * Math.sin(w.k * x - w.w * t + w.p + l.shift)
    return h
  }

  /** d(surface)/dx of the boats' layer: the slope a boat pitches to. */
  slope(x: number, t: number): number {
    let s = 0
    for (const w of WAVES) s += w.a * w.k * Math.cos(w.k * x - w.w * t + w.p)
    return s
  }

  step(dt: number): void {
    this.time += dt
    const t = this.time
    for (const b of this.boats) {
      b.x += b.speed * dt
      if (b.x > this.cols + 14) {
        b.x = -14
        b.client = this.pickClient()
      }
      // Buoyancy: a damped spring toward the local waterline.
      const target = this.surface("mid", b.x, t)
      b.vy += (14 * (target - b.y) - 5.2 * b.vy) * dt
      b.y += b.vy * dt
      // Pitch: a softer spring toward the wave slope.
      const want = Math.max(-0.26, Math.min(0.26, Math.atan(this.slope(b.x, t) * 1.1)))
      b.vang += (9 * (want - b.angle) - 4.2 * b.vang) * dt
      b.angle += b.vang * dt
    }
  }

  /** The next company not already sailing, so a narrow screen still cycles through all of them. */
  private pickClient(): number {
    for (let tries = 0; tries < this.clientCount; tries++) {
      const c = this.nextClient
      this.nextClient = (this.nextClient + 1) % this.clientCount
      if (!this.boats.some((b) => b.client === c)) return c
    }
    return this.nextClient
  }
}

const LOGO = 10

/**
 * The palette step (0 = nothing) of the boat sprite at local point (u, v):
 * u to the right of the mast, v down from the waterline.
 */
export function spriteIndex(su: number, sv: number, logo: Float32Array | null): number {
  const u = su / BOAT_SCALE
  const v = sv / BOAT_SCALE
  // Hull: a flat deck line over a tapering body.
  if (v >= -1 && v < 3) {
    const half = v < 0 ? 8 : v < 1 ? 7.4 : v < 2 ? 6.2 : 4.4
    if (Math.abs(u) <= half) return v < 0 ? 5 : 3
    return 0
  }
  // Mast.
  if (Math.abs(u) < 0.55 && v >= -13 && v < -1) return 4
  // Sail: a square carrying the company's logo, dithered.
  if (u >= -5.5 && u < 4.5 && v >= -11.5 && v < -2.5) {
    const edge = u < -4.5 || u >= 3.5 || v < -10.5 || v >= -3.5
    if (edge) return 5
    if (!logo) return ((Math.floor(u) + Math.floor(v)) & 1) === 0 ? 2 : 3
    const lx = Math.min(LOGO - 1, Math.max(0, Math.floor(((u + 4.5) / 8) * LOGO)))
    const ly = Math.min(LOGO - 1, Math.max(0, Math.floor(((v + 10.5) / 7) * LOGO)))
    return 2 + Math.round(logo[ly * LOGO + lx] * 2)
  }
  return 0
}

export const LOGO_SIZE = LOGO
