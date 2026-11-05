import { hash2, smoothstep, valueNoise } from "@/lib/dither/noise"

export type Ring = { x: number; y: number; t0: number; power?: number }
export type BrightStar = { x: number; y: number; phase: number }

const TAU = Math.PI * 2
const TWIST = 2.6
const RING_LIFE = 2.4
const RING_SPEED = 240

/**
 * A spiral galaxy as a density field, in the same spirit as the README
 * aurora: tone per cell, quantised later through a Bayer threshold. Everything
 * that does not change with time (radius, the arm phase, the dust envelope,
 * the field of fixed stars) is computed once; a frame only rotates the arm
 * pattern, which is a density wave, so the spiral turns rigidly instead of
 * winding itself up.
 */
export class Galaxy {
  readonly tones: Float32Array
  /** The brightest fixed stars, in px, for a glyph overlay. */
  readonly bright: BrightStar[] = []
  private x1: Float32Array
  private y1: Float32Array
  private c2: Float32Array
  private s2: Float32Array
  private base: Float32Array
  private env: Float32Array
  private star: Float32Array
  private phase: Float32Array
  private cosA: number
  private sinA: number
  /** Dust noise per cell in the rotating frame; only refreshed when the spin has moved. */
  private noise: Float32Array
  private noiseSpin = Number.NaN

  constructor(
    readonly cols: number,
    readonly rows: number,
    readonly cell: number,
    private cx: number,
    private cy: number,
    private radius: number,
    angle: number,
    private squash: number
  ) {
    const n = cols * rows
    this.tones = new Float32Array(n)
    this.x1 = new Float32Array(n)
    this.y1 = new Float32Array(n)
    this.c2 = new Float32Array(n)
    this.s2 = new Float32Array(n)
    this.base = new Float32Array(n)
    this.env = new Float32Array(n)
    this.star = new Float32Array(n)
    this.phase = new Float32Array(n)
    this.noise = new Float32Array(n)
    this.cosA = Math.cos(angle)
    this.sinA = Math.sin(angle)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const px = (c + 0.5) * cell
        const py = (r + 0.5) * cell
        this.place(i, px, py)
        const h = hash2(c, r, 11)
        if (h > 0.986) {
          const s = 0.3 + 0.7 * hash2(c, r, 12)
          this.star[i] = s
          this.phase[i] = hash2(c, r, 13) * TAU
          if (s > 0.9) this.bright.push({ x: px, y: py, phase: this.phase[i] })
        }
      }
    }
  }

  private sample(px: number, py: number): { x: number; y: number; r: number } {
    const dx = px - this.cx
    const dy = py - this.cy
    const x = (dx * this.cosA + dy * this.sinA) / this.radius
    const y = (-dx * this.sinA + dy * this.cosA) / this.radius / this.squash
    return { x, y, r: Math.hypot(x, y) }
  }

  private place(i: number, px: number, py: number): void {
    const { x, y, r } = this.sample(px, py)
    const phiStatic = Math.atan2(y, x) - TWIST * Math.log(r + 0.06)
    this.x1[i] = x
    this.y1[i] = y
    this.c2[i] = Math.cos(2 * phiStatic)
    this.s2[i] = Math.sin(2 * phiStatic)
    this.base[i] = Galaxy.baseAt(r)
    this.env[i] = Galaxy.envAt(r)
  }

  static baseAt(r: number): number {
    if (r > 2.4) return 0
    return Math.exp(-Math.pow(r / 0.11, 1.1)) * 1.25 + Math.exp(-r / 0.36) * 0.32
  }

  static envAt(r: number): number {
    return r > 1.5 ? 0 : smoothstep(0.05, 0.28, r) * Math.exp(-r * 1.7)
  }

  private density(
    c2: number,
    s2: number,
    base: number,
    env: number,
    cs2: number,
    sn2: number,
    lc: number,
    ls: number,
    noise: number
  ): number {
    let dens = base
    if (env > 0.004) {
      const a = 0.5 + 0.5 * (c2 * cs2 + s2 * sn2)
      const arm = a * a * (0.35 + 0.65 * a)
      dens += arm * env * (0.5 + noise) * 1.3
      // Dust lanes: a darker ribbon hugging the inside edge of each arm.
      const l = 0.5 + 0.5 * (c2 * lc + s2 * ls)
      dens -= l * l * l * env * (0.25 + noise) * 0.7
      if (dens < 0) dens = 0
    }
    return 1 - Math.exp(-1.7 * dens)
  }

  /** Where "you are": on an arm, two thirds of the way out, turning with the galaxy. */
  markerAt(spin: number): { x: number; y: number } {
    const r = 0.62
    const th = spin + TWIST * Math.log(r + 0.06)
    const X = Math.cos(th) * r * this.radius
    const Y = Math.sin(th) * r * this.radius * this.squash
    return {
      x: this.cx + X * this.cosA - Y * this.sinA,
      y: this.cy + X * this.sinA + Y * this.cosA,
    }
  }

  private refreshNoise(cs: number, sn: number, spin: number): void {
    for (let i = 0; i < this.noise.length; i++) {
      if (this.env[i] <= 0.004) continue
      const x = this.x1[i]
      const y = this.y1[i]
      this.noise[i] = valueNoise((x * cs + y * sn) * 9, (-x * sn + y * cs) * 9, 5)
    }
    this.noiseSpin = spin
  }

  /**
   * Fill `tones` for one frame. `spin` rotates the arms; `pointer` bends the
   * light around it like a lens; each ring is a shockwave from a tap.
   */
  render(
    time: number,
    spin: number,
    pointer: { x: number; y: number } | null,
    rings: Ring[],
    now: number
  ): void {
    const { cols, rows, cell, tones } = this
    const cs = Math.cos(spin)
    const sn = Math.sin(spin)
    const cs2 = Math.cos(2 * spin)
    const sn2 = Math.sin(2 * spin)
    const lc = Math.cos(2 * spin - 0.9)
    const ls = Math.sin(2 * spin - 0.9)

    if (Number.isNaN(this.noiseSpin) || Math.abs(spin - this.noiseSpin) > 0.01) {
      this.refreshNoise(cs, sn, spin)
    }

    for (let i = 0; i < tones.length; i++) {
      let tone = this.density(this.c2[i], this.s2[i], this.base[i], this.env[i], cs2, sn2, lc, ls, this.noise[i])
      const s = this.star[i]
      if (s > 0) tone = Math.max(tone, s * (0.65 + 0.35 * Math.sin(time * 2.2 + this.phase[i])))
      tones[i] = tone
    }

    if (pointer) {
      const sigma = 70
      const reach = Math.ceil((sigma * 3) / cell)
      const c0 = Math.max(0, Math.floor(pointer.x / cell) - reach)
      const c1 = Math.min(cols - 1, Math.floor(pointer.x / cell) + reach)
      const r0 = Math.max(0, Math.floor(pointer.y / cell) - reach)
      const r1 = Math.min(rows - 1, Math.floor(pointer.y / cell) + reach)
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const px = (c + 0.5) * cell
          const py = (r + 0.5) * cell
          const dx = pointer.x - px
          const dy = pointer.y - py
          const g = 0.45 * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
          if (g < 0.01) continue
          const { x, y, r: rr } = this.sample(px + dx * g, py + dy * g)
          const phiStatic = Math.atan2(y, x) - TWIST * Math.log(rr + 0.06)
          const i = r * cols + c
          const noise = valueNoise((x * cs + y * sn) * 9, (-x * sn + y * cs) * 9, 5)
          let tone = this.density(Math.cos(2 * phiStatic), Math.sin(2 * phiStatic), Galaxy.baseAt(rr), Galaxy.envAt(rr), cs2, sn2, lc, ls, noise)
          const s = this.star[i]
          if (s > 0) tone = Math.max(tone, s * (0.65 + 0.35 * Math.sin(time * 2.2 + this.phase[i])))
          tones[i] = Math.min(1, tone + g * 0.25)
        }
      }
    }

    for (const ring of rings) {
      const age = now - ring.t0
      if (age < 0 || age > RING_LIFE) continue
      const radius = age * RING_SPEED
      const amp = (1 - age / RING_LIFE) * 0.9 * (ring.power ?? 1)
      for (let r = 0; r < rows; r++) {
        const py = (r + 0.5) * cell - ring.y
        for (let c = 0; c < cols; c++) {
          const px = (c + 0.5) * cell - ring.x
          const d = Math.sqrt(px * px + py * py) - radius
          if (d > 40 || d < -40) continue
          const i = r * cols + c
          tones[i] = Math.min(1, tones[i] + amp * Math.exp(-(d * d) / 200))
        }
      }
    }
  }
}
