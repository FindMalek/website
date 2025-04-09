"use server"

import { env } from "@/env"
import { PlaylistsResponse } from "@/types"

const client_id = env.SPOTIFY_CLIENT_ID
const client_secret = env.SPOTIFY_CLIENT_SECRET
const client_user_id = env.SPOTIFY_USER_ID

interface AccessTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

/**
 * Get an access token from Spotify using client credentials flow
 */
async function getAccessToken(): Promise<string> {
  const tokenEndpoint = "https://accounts.spotify.com/api/token"

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id,
      client_secret,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  const data = (await response.json()) as AccessTokenResponse
  return data.access_token
}

/**
 * Get current user's playlists
 */
export async function getUserPlaylists(
  limit = 20,
  offset = 0
): Promise<PlaylistsResponse> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.spotify.com/v1/users/${client_user_id}/playlists?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.statusText}`)
    }

    const data = (await response.json()) as PlaylistsResponse
    return data
  } catch (error) {
    console.error("Error fetching user playlists:", error)
    throw error
  }
}
