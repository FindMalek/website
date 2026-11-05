import { env } from "@/env"

export type StatItem = {
  id: string
  name: string
  plays: number
  minutes: number
  detail?: string
}

export type ListeningStats = {
  minutes: number
  plays: number
  songs: number
  streaks: { current: number; longest: number }
  top: { songs: StatItem[]; artists: StatItem[]; albums: StatItem[] }
  days: { day: string; minutes: number }[]
}

export type NowPlaying = {
  song: { title: string; artist: string; album: string } | null
  playing: boolean
}

const HOUR = 3_600_000
const TUNIS_OFFSET_MINUTES = 60

function configured(): { url: string; token: string } | null {
  if (!env.LODESONG_URL || !env.LODESONG_TOKEN) return null
  return { url: env.LODESONG_URL.replace(/\/$/, ""), token: env.LODESONG_TOKEN }
}

/**
 * My listening over the last `days` days, from my own lodesong player. Server
 * only: the API token never reaches the browser. Returns null when lodesong is
 * not configured or unreachable, so the page simply omits the block.
 */
export async function getListeningStats(days = 30): Promise<ListeningStats | null> {
  const cfg = configured()
  if (!cfg) return null
  // Round to the hour so the request URL, and so the cache entry, is stable.
  const to = Math.floor(Date.now() / HOUR) * HOUR
  const from = to - days * 24 * HOUR
  try {
    const res = await fetch(
      `${cfg.url}/api/stats?from=${from}&to=${to}&tz=${TUNIS_OFFSET_MINUTES}`,
      {
        headers: { Authorization: `Bearer ${cfg.token}` },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return null
    return (await res.json()) as ListeningStats
  } catch {
    return null
  }
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const cfg = configured()
  if (!cfg) return { song: null, playing: false }
  try {
    const res = await fetch(`${cfg.url}/api/remote/now`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return { song: null, playing: false }
    const json = (await res.json()) as {
      song?: { title: string; artist: string; album: string } | null
      playing?: boolean
    }
    // Only the public bits: never the device name or the position.
    return {
      song: json.song
        ? { title: json.song.title, artist: json.song.artist, album: json.song.album }
        : null,
      playing: !!json.playing,
    }
  } catch {
    return { song: null, playing: false }
  }
}
