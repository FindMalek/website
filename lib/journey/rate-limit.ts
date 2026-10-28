const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_IP = 5
const MAX_GLOBAL = 120
const MAX_TRACKED_IPS = 2000

const hits = new Map<string, number[]>()
let globalHits: number[] = []

function recent(timestamps: number[], now: number): number[] {
  return timestamps.filter((t) => now - t < WINDOW_MS)
}

/**
 * In-memory limiter: 5 match requests per IP and 120 in total per 10 minutes,
 * per server instance. Instances do not share it, so it caps accidents and
 * casual abuse, not a distributed attacker.
 */
export function checkMatchRateLimit(ip: string): {
  allowed: boolean
  retryAfterSeconds: number
} {
  const now = Date.now()
  const own = recent(hits.get(ip) ?? [], now)
  globalHits = recent(globalHits, now)

  if (own.length >= MAX_PER_IP || globalHits.length >= MAX_GLOBAL) {
    const oldest = own.length >= MAX_PER_IP ? own[0] : globalHits[0]
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((WINDOW_MS - (now - oldest)) / 1000)
      ),
    }
  }

  if (hits.size >= MAX_TRACKED_IPS) hits.clear()
  own.push(now)
  hits.set(ip, own)
  globalHits.push(now)
  return { allowed: true, retryAfterSeconds: 0 }
}
