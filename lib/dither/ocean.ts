/**
 * A small living ocean. The behaviour model follows ascii-sharks (MIT,
 * stackedlol): boid schools whose alarm spreads from fish to fish, sharks that
 * wander, pursue and bend a follow-the-leader spine, and a wake field that
 * diffuses like ripples. This is a compact re-implementation sized for a
 * banner; the rendering is our own.
 */

const TAU = Math.PI * 2

const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v

function angleDiff(a: number, b: number): number {
  let d = (b - a) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}

const rand = (lo: number, hi: number): number => lo + Math.random() * (hi - lo)

export type Pointer = { x: number; y: number; active: boolean }

export type OceanOptions = {
  /** How far off horizontal a shark may aim, in radians. */
  maxAngle?: number
  /** 0 to 1: how hard sharks are pulled back toward the vertical middle. */
  pull?: number
  /** Weave toward a random depth, re-rolled every few seconds: sharks dive and climb. */
  dive?: number
  /** Share of the height sharks start and re-enter within. */
  yRange?: [number, number]
}

export type Fish = {
  x: number
  y: number
  vx: number
  vy: number
  species: number
  /** 0 calm to 1 panicking; spreads to neighbours. */
  alarm: number
  alive: boolean
  respawnAt: number
  /** Smoothed angular velocity; hard turns glint. */
  turn: number
  /** 0.55 far to 1 near. */
  depth: number
  millDir: 1 | -1
}

export const SHARK_NODES = 18

export type Shark = {
  length: number
  /** Spine positions, snout first: [x0, y0, x1, y1, ...]. */
  nodes: Float32Array
  heading: number
  speed: number
  phase: number
  hunger: number
  wander: number
  dive: number
  diveAt: number
  orbitDir: 1 | -1
  target: Fish | null
  retargetAt: number
}

type Species = {
  cruise: number
  max: number
  min: number
  school: [number, number]
  sep: [number, number]
  align: number
  cohesion: number
  jitter: number
  mill: number
  vdrag: number
}

const SPECIES: Species[] = [
  { cruise: 34, max: 64, min: 16, school: [10, 16], sep: [13, 9], align: 1.6, cohesion: 1.5, jitter: 34, mill: 60, vdrag: 0.5 },
  { cruise: 44, max: 78, min: 20, school: [8, 12], sep: [11, 8], align: 3, cohesion: 0.5, jitter: 24, mill: 0, vdrag: 1.3 },
  { cruise: 28, max: 56, min: 12, school: [5, 8], sep: [15, 10], align: 1.8, cohesion: 1, jitter: 22, mill: 0, vdrag: 1.8 },
]

const SEPARATION_K = 420
const ALIGN_K = 1.4
const COHESION_K = 1
const FLEE_K = 1100
const BLIND_COS = -0.6
const PERCEPTION = 56
export type SharkGlyphs = { skin: string; light: string; heavy: string; detail?: boolean }

const ASCII_GLYPHS: SharkGlyphs = { skin: ":;t%S8#@", light: ".',`", heavy: ":;" }

const smooth = (e0: number, e1: number, v: number): number => {
  const t = clamp((v - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Top-down trunk half-width at s in [0, 1] (snout to tail), as a fraction of length. */
function bodyHalf(s: number): number {
  if (s < 0.13) return 0.06 * Math.pow(Math.sin(((s / 0.13) * Math.PI) / 2), 0.95)
  if (s < 0.3) return 0.06 + 0.012 * smooth(0.13, 0.3, s)
  if (s < 0.84) return 0.014 + 0.058 * Math.pow(1 - (s - 0.3) / 0.54, 1.25)
  return 0.014 * (1 - (s - 0.84) / 0.16) + 0.004
}

/** Extra half-width from the swept pectoral fins and the flared tail. */
function finHalf(s: number): number {
  const ft = clamp((s - 0.25) / 0.2, 0, 1)
  const fin = s >= 0.25 && s < 0.45 ? 0.2 * Math.sqrt(ft) * Math.pow(1 - ft, 1.5) : 0
  const tail = s > 0.9 ? 0.07 * smooth(0.9, 1, s) : 0
  return fin + tail
}

export function fishGlyph(vx: number, vy: number): string {
  const a = ((Math.atan2(vy, vx) % Math.PI) + Math.PI) % Math.PI
  const o = Math.round(a / (Math.PI / 4)) % 4
  return o === 0 ? "-" : o === 1 ? "\\" : o === 2 ? "|" : "/"
}

export class Ocean {
  fish: Fish[] = []
  sharks: Shark[] = []
  time = 0
  readonly cols: number
  readonly rows: number
  /** Wake field on the glyph grid: things that swim leave energy that diffuses and fades. */
  energy: Float32Array
  private energyTmp: Float32Array
  private spine = new Float32Array(SHARK_NODES * 2)
  private arc = new Float32Array(SHARK_NODES)
  private lastSpawn = 0
  private o: Required<OceanOptions>

  constructor(
    readonly width: number,
    readonly height: number,
    readonly cellW: number,
    readonly cellH: number,
    fishCount: number,
    sharkLengths: number[],
    options: OceanOptions = {}
  ) {
    this.o = { maxAngle: 0.5, pull: 1, dive: 0, yRange: [0.3, 0.7], ...options }
    this.cols = Math.ceil(width / cellW)
    this.rows = Math.ceil(height / cellH)
    this.energy = new Float32Array(this.cols * this.rows)
    this.energyTmp = new Float32Array(this.cols * this.rows)
    this.seed(fishCount, sharkLengths)
  }

  private seed(count: number, lengths: number[]): void {
    const { width: W, height: H } = this
    this.sharks = lengths.map((length, i) => {
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1
      const x = dir > 0 ? W * 0.3 : W * 0.72
      const y = H * rand(this.o.yRange[0], this.o.yRange[1])
      const heading = dir > 0 ? 0 : Math.PI
      const nodes = new Float32Array(SHARK_NODES * 2)
      const seg = length / (SHARK_NODES - 1)
      for (let k = 0; k < SHARK_NODES; k++) {
        nodes[k * 2] = x - Math.cos(heading) * seg * k
        nodes[k * 2 + 1] = y - Math.sin(heading) * seg * k
      }
      return {
        length,
        nodes,
        heading,
        speed: 28,
        phase: rand(0, TAU),
        hunger: rand(0.25, 0.7),
        wander: 0,
        dive: 0,
        diveAt: 0,
        orbitDir: dir,
        target: null,
        retargetAt: 0,
      }
    })
    this.sharks.sort((a, b) => a.length - b.length)

    while (this.fish.length < count) {
      const species = Math.floor(Math.random() * SPECIES.length)
      const sp = SPECIES[species]
      const size = Math.min(
        Math.round(rand(sp.school[0], sp.school[1])),
        count - this.fish.length
      )
      const millDir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
      const cx = rand(W * 0.06, W * 0.94)
      const cy = rand(H * 0.12, H * 0.88)
      const dir = (Math.random() < 0.5 ? 0 : Math.PI) + rand(-0.5, 0.5)
      for (let k = 0; k < size; k++) {
        this.fish.push({
          x: cx + rand(-1, 1) * sp.sep[0] * Math.sqrt(size),
          y: cy + rand(-1, 1) * sp.sep[1] * Math.sqrt(size) * 0.6,
          vx: Math.cos(dir) * sp.cruise,
          vy: Math.sin(dir) * sp.cruise,
          species,
          alarm: 0,
          alive: true,
          respawnAt: 0,
          turn: 0,
          depth: rand(0.55, 1),
          millDir,
        })
      }
    }
  }

  splash(x: number, y: number): void {
    this.stamp(x, y, 6, 1.4)
    const r = 150
    for (const f of this.fish) {
      if (!f.alive) continue
      const dx = f.x - x
      const dy = f.y - y
      const d = Math.hypot(dx, dy)
      if (d > r || d < 1e-3) continue
      const k = (1 - d / r) * 240
      f.vx += (dx / d) * k
      f.vy += (dy / d) * k
      f.alarm = 1
    }
  }

  step(dt: number, pointer: Pointer | null): void {
    this.time += dt
    this.stepFish(dt, pointer)
    this.stepSharks(dt)
    this.respawn()
    this.deposit(pointer)
    this.diffuse(dt)
  }

  private stepFish(dt: number, pointer: Pointer | null): void {
    const { fish, sharks, width: W, height: H, time } = this
    const R2 = PERCEPTION * PERCEPTION
    const calmDecay = Math.exp(-dt * 0.7)
    const contagion = Math.min(1, dt * 6)

    for (const f of fish) {
      if (!f.alive) continue
      const sp = SPECIES[f.species]
      const spread = 1 + 1.8 * f.alarm
      const sepX = sp.sep[0] * spread
      const sepY = sp.sep[1] * spread
      const speed = Math.hypot(f.vx, f.vy) || 1
      const hx = f.vx / speed
      const hy = f.vy / speed

      let sx = 0
      let sy = 0
      let avx = 0
      let avy = 0
      let cx = 0
      let cy = 0
      let n = 0
      let neighbourAlarm = 0

      for (const o of fish) {
        if (o === f || !o.alive) continue
        const dx = o.x - f.x
        const dy = o.y - f.y
        const d2 = dx * dx + dy * dy
        if (d2 >= R2 || d2 < 1e-6) continue
        const d = Math.sqrt(d2)
        if ((dx * hx + dy * hy) / d <= BLIND_COS) continue
        const qx = dx / sepX
        const qy = dy / sepY
        const q2 = qx * qx + qy * qy
        if (q2 < 1) {
          const q = Math.sqrt(q2) || 1e-3
          const k = (1 - q) / q
          sx -= qx * k
          sy -= qy * k
        }
        if (o.species === f.species) {
          avx += o.vx
          avy += o.vy
          cx += dx
          cy += dy
          n++
        } else if (d < 28) {
          const k = ((1 - d / 28) / d) * 0.6
          sx -= dx * k
          sy -= dy * k
        }
        if (o.alarm > neighbourAlarm) neighbourAlarm = o.alarm
      }

      let ax = sx * SEPARATION_K
      let ay = sy * SEPARATION_K
      if (n > 0) {
        ax += (avx / n - f.vx) * ALIGN_K * sp.align + (cx / n) * COHESION_K * sp.cohesion * (1 - 0.8 * f.alarm)
        ay += (avy / n - f.vy) * ALIGN_K * sp.align + (cy / n) * COHESION_K * sp.cohesion * (1 - 0.8 * f.alarm)
        if (sp.mill > 0) {
          const cl = Math.hypot(cx, cy) || 1
          ax += (-cy / cl) * f.millDir * sp.mill * (1 - f.alarm)
          ay += (cx / cl) * f.millDir * sp.mill * (1 - f.alarm)
        }
      }

      let fear = 0
      for (const sh of sharks) {
        const fearR = sh.length * 0.6 + 40
        let best = Infinity
        let bx = 0
        let by = 0
        for (let k = 0; k <= 12; k += 3) {
          const nx = sh.nodes[k * 2]
          const ny = sh.nodes[k * 2 + 1]
          const d2 = (f.x - nx) ** 2 + (f.y - ny) ** 2
          if (d2 < best) {
            best = d2
            bx = nx
            by = ny
          }
        }
        const d = Math.sqrt(best)
        if (d >= fearR || d < 1e-3) continue
        const w = (1 - d / fearR) ** 2
        const shx = Math.cos(sh.heading)
        const shy = Math.sin(sh.heading)
        const side = shx * (f.y - sh.nodes[1]) - shy * (f.x - sh.nodes[0]) >= 0 ? 1 : -1
        ax += ((f.x - bx) / d * 0.7 - shy * side * 0.9) * FLEE_K * w
        ay += ((f.y - by) / d * 0.7 + shx * side * 0.9) * FLEE_K * w
        fear = Math.max(fear, Math.sqrt(w))
      }

      if (pointer?.active) {
        const dx = f.x - pointer.x
        const dy = f.y - pointer.y
        const d = Math.hypot(dx, dy)
        if (d < 90 && d > 1e-3) {
          const w = (1 - d / 90) ** 2
          ax += (dx / d) * FLEE_K * w
          ay += (dy / d) * FLEE_K * w
          fear = Math.max(fear, Math.sqrt(w) * 0.8)
        }
      }

      let alarm = Math.max(f.alarm * calmDecay, fear)
      const relayed = neighbourAlarm * 0.86
      if (relayed > alarm) alarm += (relayed - alarm) * contagion
      f.alarm = alarm

      const m = 26
      if (f.x < m) ax += (m - f.x) * 7
      else if (f.x > W - m) ax -= (f.x - (W - m)) * 7
      if (f.y < m) ay += (m - f.y) * 7
      else if (f.y > H - m) ay -= (f.y - (H - m)) * 7

      ax += 20 * Math.sin(f.y * 0.02 + time * 0.3) * 0.5 + (Math.random() - 0.5) * sp.jitter
      ay += 10 * Math.cos(f.x * 0.015 - time * 0.25) * 0.5 + (Math.random() - 0.5) * sp.jitter
      ay -= f.vy * sp.vdrag * (1 - 0.7 * f.alarm)

      const preferred = sp.cruise * (1 + 1.3 * f.alarm)
      ax += (preferred - speed) * hx * 1.6
      ay += (preferred - speed) * hy * 1.6

      const before = Math.atan2(f.vy, f.vx)
      f.vx += ax * dt
      f.vy += ay * dt
      const maxSpeed = sp.max * (1 + 1.8 * f.alarm)
      const s = Math.hypot(f.vx, f.vy)
      if (s > maxSpeed) {
        f.vx *= maxSpeed / s
        f.vy *= maxSpeed / s
      } else if (s < sp.min && s > 1e-3) {
        f.vx *= sp.min / s
        f.vy *= sp.min / s
      }
      f.turn += (angleDiff(before, Math.atan2(f.vy, f.vx)) / dt - f.turn) * Math.min(1, dt * 8)
      f.x = clamp(f.x + f.vx * dt, -40, W + 40)
      f.y = clamp(f.y + f.vy * dt, -40, H + 40)
    }
  }

  private stepSharks(dt: number): void {
    const { sharks, width: W, height: H, time } = this
    const cyW = H / 2

    for (const sh of sharks) {
      const L = sh.length
      const nodes = sh.nodes
      const hx = nodes[0]
      const hy = nodes[1]
      sh.hunger = Math.min(1, sh.hunger + dt * 0.03)

      // Sharks make passes: they never turn around. They cross the frame, leave
      // it and re-enter, and a weave toward prey (or a slow wander) bends the course.
      const base = sh.orbitDir > 0 ? 0 : Math.PI
      let dx = Math.cos(base) * 1.2
      let dy = 0
      sh.wander = clamp(sh.wander + (Math.random() - 0.5) * dt * 3.2, -1.1, 1.1)
      dy += Math.sin(sh.wander) * 0.5

      if (time >= sh.retargetAt) {
        sh.target = this.findPrey(sh)
        sh.retargetAt = time + 0.45
      }
      const t = sh.target
      let hunting = false
      let closing = 0
      if (t && t.alive && sh.hunger > 0.3) {
        const tx = t.x + t.vx * 0.35 - hx
        const ty = t.y + t.vy * 0.35 - hy
        const d = Math.hypot(tx, ty) || 1
        const w = 1.4 + 2.6 * sh.hunger
        dx += (tx / d) * w
        dy += (ty / d) * w
        hunting = true
        closing = clamp(1 - d / (L * 0.9), 0, 1)
      }

      for (const other of sharks) {
        if (other === sh) continue
        for (let k = 0; k < SHARK_NODES; k += 4) {
          const ox = hx - other.nodes[k * 2]
          const oy = hy - other.nodes[k * 2 + 1]
          const d = Math.hypot(ox, oy)
          const range = (L + other.length) * 0.45
          if (d < range && d > 1e-3) dy += (oy / d) * (1 - d / range) * 3
        }
      }

      // Dive: every few seconds pick a new depth to weave toward.
      if (time >= sh.diveAt) {
        sh.dive = rand(-1, 1)
        sh.diveAt = time + rand(5, 9)
      }
      dy += sh.dive * this.o.dive

      // Keep the body inside the scene vertically.
      dy += clamp((cyW - hy) / (H * 0.45), -1, 1) * 0.9 * this.o.pull
      const edge = this.o.pull >= 1 ? 0.16 : 0.05
      for (let k = 4; k < SHARK_NODES; k += 4) {
        const ny = nodes[k * 2 + 1]
        if (ny < H * edge || ny > H * (1 - edge)) dy += clamp((cyW - ny) / (H * 0.5), -1, 1) * 0.8
      }

      const raw = Math.atan2(dy, dx)
      const desired = base + clamp(angleDiff(base, raw), -this.o.maxAngle, this.o.maxAngle)
      const agility = Math.min(hunting ? 1.7 + closing : 0.8, sh.speed / (L * 0.22))
      sh.heading += clamp(angleDiff(sh.heading, desired), -agility * dt, agility * dt)

      const cruise = 26 + L * 0.05
      const targetSpeed = hunting ? cruise * (1.45 + closing * 1.5) : cruise
      sh.speed += (targetSpeed - sh.speed) * Math.min(1, dt * 1.1)
      sh.phase += dt * (2 + sh.speed / 24)

      nodes[0] += Math.cos(sh.heading) * sh.speed * dt
      nodes[1] += Math.sin(sh.heading) * sh.speed * dt

      const seg = L / (SHARK_NODES - 1)
      let prevAngle = sh.heading + Math.PI
      for (let k = 1; k < SHARK_NODES; k++) {
        const px = nodes[(k - 1) * 2]
        const py = nodes[(k - 1) * 2 + 1]
        let angle = Math.atan2(nodes[k * 2 + 1] - py, nodes[k * 2] - px)
        angle = prevAngle + clamp(angleDiff(prevAngle, angle), -0.16, 0.16)
        nodes[k * 2] = px + Math.cos(angle) * seg
        nodes[k * 2 + 1] = py + Math.sin(angle) * seg
        prevAngle = angle
      }

      const tail = (SHARK_NODES - 1) * 2
      if (sh.orbitDir > 0 ? nodes[tail] > W + L * 0.05 : nodes[tail] < -L * 0.05) {
        this.reenter(sh)
        continue
      }

      if (sh.hunger > 0.15) {
        const mouthR = L * 0.06 + 6
        for (const f of this.fish) {
          if (!f.alive) continue
          if ((f.x - nodes[0]) ** 2 + (f.y - nodes[1]) ** 2 < mouthR * mouthR) {
            f.alive = false
            f.respawnAt = time + rand(3, 8)
            sh.hunger = Math.max(0, sh.hunger - 0.16)
            this.stamp(f.x, f.y, 3, 0.9)
          }
        }
      }
    }
  }

  /** A shark that has swum out of frame comes back in from a random side. */
  private reenter(sh: Shark): void {
    const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
    const heading = dir > 0 ? 0 : Math.PI
    const x = dir > 0 ? 0 : this.width
    const y = this.height * rand(this.o.yRange[0], this.o.yRange[1])
    const seg = sh.length / (SHARK_NODES - 1)
    for (let k = 0; k < SHARK_NODES; k++) {
      sh.nodes[k * 2] = x - Math.cos(heading) * seg * k
      sh.nodes[k * 2 + 1] = y
    }
    sh.orbitDir = dir
    sh.heading = heading
    sh.speed = 28
    sh.hunger = rand(0.3, 0.7)
    sh.target = null
  }

  private findPrey(sh: Shark): Fish | null {
    const range = sh.length * 0.9 + 120
    const fx = Math.cos(sh.heading)
    const fy = Math.sin(sh.heading)
    let best: Fish | null = null
    let bestScore = Infinity
    let currentScore = Infinity
    for (const f of this.fish) {
      if (!f.alive) continue
      const dx = f.x - sh.nodes[0]
      const dy = f.y - sh.nodes[1]
      const d = Math.hypot(dx, dy)
      if (d > range || d < 1e-3) continue
      const cos = (dx * fx + dy * fy) / d
      if (cos < 0.2) continue
      const score = d * (1 + (1 - cos) * 0.8)
      if (score < bestScore) {
        bestScore = score
        best = f
      }
      if (f === sh.target) currentScore = score
    }
    if (sh.target && currentScore < bestScore * 1.3) return sh.target
    return best
  }

  private respawn(): void {
    const { time, width: W, height: H } = this
    const due = this.fish.filter((f) => !f.alive && f.respawnAt <= time)
    if (due.length === 0 || (due.length < 5 && time - this.lastSpawn < 9)) return
    this.lastSpawn = time
    const side = Math.floor(Math.random() * 4)
    const along = rand(0.2, 0.8)
    const x = side === 0 ? -16 : side === 1 ? W + 16 : along * W
    const y = side === 2 ? -16 : side === 3 ? H + 16 : along * H
    const inward = Math.atan2(H / 2 - y, W / 2 - x) + rand(-0.5, 0.5)
    const species = Math.floor(Math.random() * SPECIES.length)
    const sp = SPECIES[species]
    for (const f of due.slice(0, sp.school[1])) {
      f.alive = true
      f.species = species
      f.alarm = 0
      f.turn = 0
      f.x = x + rand(-1, 1) * PERCEPTION * 0.5
      f.y = y + rand(-1, 1) * PERCEPTION * 0.5
      f.vx = Math.cos(inward) * sp.cruise * 1.4
      f.vy = Math.sin(inward) * sp.cruise * 1.4
    }
  }

  /** Cell index for a point, or -1 off-grid. */
  cellIndex(x: number, y: number): number {
    const c = Math.floor(x / this.cellW)
    const r = Math.floor(y / this.cellH)
    return c < 0 || r < 0 || c >= this.cols || r >= this.rows ? -1 : r * this.cols + c
  }

  private stamp(x: number, y: number, radius: number, amount: number): void {
    const c0 = Math.floor(x / this.cellW)
    const r0 = Math.floor(y / this.cellH)
    for (let r = r0 - radius; r <= r0 + radius; r++) {
      for (let c = c0 - radius; c <= c0 + radius; c++) {
        if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) continue
        const d = Math.hypot(c - c0, (r - r0) * 1.4)
        if (d > radius + 0.5) continue
        const i = r * this.cols + c
        this.energy[i] = Math.min(1.6, this.energy[i] + amount * (1 - d / (radius + 1)))
      }
    }
  }

  private deposit(pointer: Pointer | null): void {
    for (const f of this.fish) {
      if (!f.alive) continue
      const i = this.cellIndex(f.x, f.y)
      if (i >= 0) this.energy[i] = Math.min(1.6, this.energy[i] + 0.012 + f.alarm * 0.03)
    }
    for (const sh of this.sharks) {
      for (let k = SHARK_NODES - 6; k < SHARK_NODES; k++) {
        const i = this.cellIndex(sh.nodes[k * 2], sh.nodes[k * 2 + 1])
        if (i >= 0) this.energy[i] = Math.min(1.6, this.energy[i] + 0.05 + sh.speed * 0.0012)
      }
    }
    if (pointer?.active) this.stamp(pointer.x, pointer.y, 1, 0.08)
  }

  private diffuse(dt: number): void {
    const { cols, rows, energy, energyTmp: tmp } = this
    const decay = Math.exp(-dt * 1.5)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const l = c > 0 ? energy[i - 1] : energy[i]
        const rt = c < cols - 1 ? energy[i + 1] : energy[i]
        const u = r > 0 ? energy[i - cols] : energy[i]
        const d = r < rows - 1 ? energy[i + cols] : energy[i]
        tmp[i] = (energy[i] * 4 + l + rt + u + d) * 0.125 * decay
      }
    }
    this.energy = tmp
    this.energyTmp = energy
  }

  /**
   * Rasterise every shark onto the glyph grid, smallest first so the big one
   * swims over it. With `detail`, the body is anatomical: an outline whose
   * glyph follows the edge, a bright spine, gill slits, an eye, a dorsal
   * ridge and ribbed fins. `tone` is 0 (faint) to 1 (bright).
   */
  forEachSharkCell(
    emit: (col: number, row: number, ch: string, tone: number) => void,
    glyphs: SharkGlyphs = ASCII_GLYPHS
  ): void {
    const { cellW, cellH, cols, rows, spine, arc } = this
    const LIGHT_X = -0.55
    const LIGHT_Y = -0.83
    const GRID = glyphs.detail ? 3 : 2
    const SAMPLES = GRID * GRID
    for (const sh of this.sharks) {
      const L = sh.length
      const N = SHARK_NODES
      for (let k = 0; k < N; k++) {
        const a = k === 0 ? 0 : k - 1
        const b = k === 0 ? 1 : k
        const tx = sh.nodes[b * 2] - sh.nodes[a * 2]
        const ty = sh.nodes[b * 2 + 1] - sh.nodes[a * 2 + 1]
        const tl = Math.hypot(tx, ty) || 1
        const amp = Math.pow(k / (N - 1), 1.5) * L * 0.035 * Math.sin(sh.phase - k * 0.55)
        spine[k * 2] = sh.nodes[k * 2] + (-ty / tl) * amp
        spine[k * 2 + 1] = sh.nodes[k * 2 + 1] + (tx / tl) * amp
      }
      arc[0] = 0
      for (let k = 1; k < N; k++) {
        arc[k] = arc[k - 1] + Math.hypot(spine[k * 2] - spine[(k - 1) * 2], spine[k * 2 + 1] - spine[(k - 1) * 2 + 1])
      }
      const total = arc[N - 1] || 1

      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity
      for (let k = 0; k < N; k++) {
        minX = Math.min(minX, spine[k * 2])
        maxX = Math.max(maxX, spine[k * 2])
        minY = Math.min(minY, spine[k * 2 + 1])
        maxY = Math.max(maxY, spine[k * 2 + 1])
      }
      const pad = L * 0.12
      const c0 = Math.max(0, Math.floor((minX - pad) / cellW))
      const c1 = Math.min(cols - 1, Math.floor((maxX + pad) / cellW))
      const r0 = Math.max(0, Math.floor((minY - pad) / cellH))
      const r1 = Math.min(rows - 1, Math.floor((maxY + pad) / cellH))

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          let hits = 0
          let bodyHits = 0
          let tone = 0
          let sAvg = 0
          let latAvg = 0
          let nx = 0
          let ny = 0
          for (let sy = 0; sy < GRID; sy++) {
            for (let sx = 0; sx < GRID; sx++) {
              const px = (c + (sx + 0.5) / GRID) * cellW
              const py = (r + (sy + 0.5) / GRID) * cellH
              let bestD2 = Infinity
              let bestS = 0
              let bnx = 0
              let bny = 0
              let side = 1
              for (let k = 0; k < N - 1; k++) {
                const ax = spine[k * 2]
                const ay = spine[k * 2 + 1]
                const bx = spine[(k + 1) * 2] - ax
                const by = spine[(k + 1) * 2 + 1] - ay
                const sl = bx * bx + by * by || 1
                const t = clamp(((px - ax) * bx + (py - ay) * by) / sl, 0, 1)
                const qx = px - (ax + bx * t)
                const qy = py - (ay + by * t)
                const d2 = qx * qx + qy * qy
                if (d2 < bestD2) {
                  bestD2 = d2
                  bestS = (arc[k] + (arc[k + 1] - arc[k]) * t) / total
                  side = bx * (py - ay) - by * (px - ax) >= 0 ? 1 : -1
                  const bl = Math.sqrt(sl)
                  bnx = (-by / bl) * side
                  bny = (bx / bl) * side
                }
              }
              const body = bodyHalf(bestS) * L * 1.2
              const hw = (bodyHalf(bestS) + finHalf(bestS)) * L * 1.2
              const d = Math.sqrt(bestD2)
              const notch = bestS > 0.93 ? ((bestS - 0.93) / 0.07) * 0.032 * L : 0
              if (d < hw && d >= notch) {
                hits++
                if (d < body) bodyHits++
                const across = d / Math.max(1, body)
                const lit = bnx * LIGHT_X + bny * LIGHT_Y
                tone += clamp(0.62 - across * across * 0.42 + lit * 0.28, 0, 1)
                sAvg += bestS
                latAvg += across
                nx += bnx
                ny += bny
              }
            }
          }
          if (hits === 0) continue
          tone /= hits
          sAvg /= hits
          latAvg /= hits

          if (!glyphs.detail) {
            let ch: string
            if (hits < 3) {
              const set = tone >= 0.5 ? glyphs.heavy : glyphs.light
              ch = set[(c * 7 + r * 13) % set.length]
            } else {
              ch = glyphs.skin[clamp(Math.floor((1 - tone) * (glyphs.skin.length - 0.01)), 0, glyphs.skin.length - 1)]
            }
            emit(c, r, ch, hits < 3 ? tone * 0.8 : tone)
            continue
          }

          const cover = hits / SAMPLES
          if (cover < 0.62) {
            // Outline: the glyph lies along the edge, so the silhouette reads.
            emit(c, r, fishGlyph(-ny, nx), 0.95)
            continue
          }
          const finDominant = bodyHits < hits * 0.5
          if (finDominant) {
            // Fins and tail: ribbed, and the tail forks into "=" lobes.
            const ch = sAvg > 0.9 ? "=" : (c + r) % 2 === 0 ? (nx > 0 ? "/" : "\\") : ":"
            emit(c, r, ch, 0.62 + 0.2 * Math.sin(sh.phase + sAvg * 9))
            continue
          }
          // Trunk.
          let ch: string
          let t = 0.34 + 0.5 * (1 - Math.pow(Math.min(1, latAvg), 1.6)) + (tone - 0.45) * 0.3
          if (sAvg > 0.055 && sAvg < 0.09 && latAvg > 0.4 && latAvg < 0.9) {
            ch = "o"
            t = 1
          } else if (sAvg > 0.16 && sAvg < 0.27 && latAvg > 0.25) {
            ch = "|"
            t = 0.8
          } else if (sAvg > 0.34 && sAvg < 0.52 && latAvg < 0.2) {
            ch = "^"
            t = 1
          } else if (latAvg < 0.1) {
            ch = "#"
            t = Math.max(t, 0.75)
          } else {
            const ramp = " .:-=+*%@"
            const stripe = Math.sin(sAvg * 38) > 0.55 && latAvg > 0.35 ? 0.14 : 0
            ch = ramp[clamp(Math.floor(clamp(t - stripe, 0, 0.999) * ramp.length), 1, ramp.length - 1)]
          }
          emit(c, r, ch, clamp(t, 0, 1))
        }
      }
    }
  }
}
