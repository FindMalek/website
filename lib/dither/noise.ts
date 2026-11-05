export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

export function smoothstep(e0: number, e1: number, v: number): number {
  const t = clamp01((v - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

export function hash2(x: number, y: number, seed = 0): number {
  let h =
    Math.imul(x | 0, 374761393) ^
    Math.imul(y | 0, 668265263) ^
    Math.imul(seed | 0, 1442695041)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

export function valueNoise(x: number, y: number, seed = 0): number {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const tx = x - x0
  const ty = y - y0
  const sx = tx * tx * (3 - 2 * tx)
  const sy = ty * ty * (3 - 2 * ty)
  const a = hash2(x0, y0, seed)
  const b = hash2(x0 + 1, y0, seed)
  const c = hash2(x0, y0 + 1, seed)
  const d = hash2(x0 + 1, y0 + 1, seed)
  const top = a + (b - a) * sx
  return top + (c + (d - c) * sx - top) * sy
}

export function fbm(x: number, y: number, seed = 0, octaves = 4): number {
  let total = 0
  let amplitude = 0.5
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    total += valueNoise(x, y, seed + i * 17) * amplitude
    norm += amplitude
    x = x * 2.03 + 7.1
    y = y * 2.03 - 3.7
    amplitude *= 0.5
  }
  return total / norm
}

export const signedNoise = (x: number, y: number, seed: number): number =>
  valueNoise(x, y, seed) * 2 - 1
