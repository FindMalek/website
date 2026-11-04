import { createHash } from "node:crypto"

import { env } from "@/env"
import type { GenreStat, MusicSnapshot, NowPlayingTrack } from "@/types"

const TIMEOUT_MS = 5000
const GENRE_LIMIT = 8
const FREQUENT_ALBUMS = 100
// A fixed salt keeps the token stable so Next can cache these fetches.
const SALT = "findmalek"

interface SubsonicAlbum {
  name: string
  artist: string
  coverArt?: string
  genre?: string
  genres?: Array<{ name: string }>
  playCount?: number
  played?: string
}

interface SubsonicEntry {
  title: string
  artist: string
  coverArt?: string
  username: string
}

function getConfig() {
  const { NAVIDROME_URL, NAVIDROME_USER, NAVIDROME_PASSWORD } = env
  if (!NAVIDROME_URL || !NAVIDROME_USER || !NAVIDROME_PASSWORD) return null
  return {
    url: NAVIDROME_URL.replace(/\/$/, ""),
    user: NAVIDROME_USER,
    password: NAVIDROME_PASSWORD,
  }
}

function buildUrl(endpoint: string, params: Record<string, string>) {
  const config = getConfig()
  if (!config) return null

  const query = new URLSearchParams({
    u: config.user,
    t: createHash("md5")
      .update(config.password + SALT)
      .digest("hex"),
    s: SALT,
    v: "1.16.1",
    c: "findmalek",
    f: "json",
    ...params,
  })

  return `${config.url}/rest/${endpoint}?${query}`
}

async function subsonic<T>(
  endpoint: string,
  params: Record<string, string>,
  revalidate: number
): Promise<T | null> {
  const url = buildUrl(endpoint, params)
  if (!url) return null

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate },
    })
    if (!response.ok) throw new Error(response.statusText)

    const body = (await response.json()) as {
      "subsonic-response": { status: string } & T
    }
    const data = body["subsonic-response"]
    return data.status === "ok" ? data : null
  } catch (error) {
    console.error(`Navidrome ${endpoint} failed:`, error)
    return null
  }
}

function weightGenres(albums: SubsonicAlbum[]): GenreStat[] {
  const totals = new Map<string, GenreStat>()

  for (const album of albums) {
    const names = album.genres?.map((g) => g.name) ?? [album.genre]
    for (const name of names) {
      if (!name) continue
      const key = name.toLowerCase()
      const entry = totals.get(key) ?? { name, weight: 0 }
      entry.weight += album.playCount ?? 0
      totals.set(key, entry)
    }
  }

  return [...totals.values()]
    .filter((genre) => genre.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, GENRE_LIMIT)
}

async function getTopGenres(): Promise<GenreStat[]> {
  const frequent = await subsonic<{ albumList2?: { album?: SubsonicAlbum[] } }>(
    "getAlbumList2",
    { type: "frequent", size: String(FREQUENT_ALBUMS) },
    3600
  )
  const byPlays = weightGenres(frequent?.albumList2?.album ?? [])
  if (byPlays.length > 0) return byPlays

  // No play history yet, so fall back to what the library holds.
  const library = await subsonic<{
    genres?: { genre?: Array<{ value: string; songCount: number }> }
  }>("getGenres", {}, 86400)

  return (library?.genres?.genre ?? [])
    .map((genre) => ({ name: genre.value, weight: genre.songCount }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, GENRE_LIMIT)
}

export async function getCurrentTrack(): Promise<NowPlayingTrack | null> {
  const live = await subsonic<{ nowPlaying?: { entry?: SubsonicEntry[] } }>(
    "getNowPlaying",
    {},
    0
  )
  const playing = live?.nowPlaying?.entry?.find(
    (entry) => entry.username === env.NAVIDROME_USER
  )

  if (playing) {
    return {
      title: playing.title,
      artist: playing.artist,
      coverArt: playing.coverArt ?? null,
      isLive: true,
      kind: "track",
      playedAt: null,
    }
  }

  const recent = await subsonic<{ albumList2?: { album?: SubsonicAlbum[] } }>(
    "getAlbumList2",
    { type: "recent", size: "1" },
    60
  )
  const album = recent?.albumList2?.album?.[0]
  if (!album) return null

  return {
    title: album.name,
    artist: album.artist,
    coverArt: album.coverArt ?? null,
    isLive: false,
    kind: "album",
    playedAt: album.played ?? null,
  }
}

export async function getMusicSnapshot(): Promise<MusicSnapshot | null> {
  const [track, genres] = await Promise.all([getCurrentTrack(), getTopGenres()])
  return track || genres.length > 0 ? { track, genres } : null
}

export async function fetchCoverArt(id: string): Promise<Response | null> {
  const url = buildUrl("getCoverArt", { id, size: "300" })
  if (!url) return null

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    return response.ok &&
      response.headers.get("content-type")?.startsWith("image/")
      ? response
      : null
  } catch (error) {
    console.error("Navidrome getCoverArt failed:", error)
    return null
  }
}
