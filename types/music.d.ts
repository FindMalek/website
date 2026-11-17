export interface NowPlayingTrack {
  title: string
  artist: string
  coverArt: string | null
  isLive: boolean
  kind: "track" | "album"
  playedAt: string | null
}

export interface GenreStat {
  name: string
  weight: number
}

export interface MusicSnapshot {
  track: NowPlayingTrack | null
  genres: GenreStat[]
}
