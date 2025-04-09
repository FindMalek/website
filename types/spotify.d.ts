export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  owner: {
    display_name: string
  }
  tracks: {
    total: number
  }
  external_urls: {
    spotify: string
  }
}

export interface PlaylistsResponse {
  items: SpotifyPlaylist[]
  total: number
  limit: number
  offset: number
}
