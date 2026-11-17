"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNowStrict, parseISO } from "date-fns"

import type { NowPlayingTrack } from "@/types"

import { cn } from "@/lib/utils"

const POLL_MS = 60_000

function getLabel(track: NowPlayingTrack) {
  if (track.isLive) return "Now playing"

  const ago = track.playedAt
    ? ` · ${formatDistanceToNowStrict(parseISO(track.playedAt), { addSuffix: true })}`
    : ""
  return `${track.kind === "album" ? "Last played album" : "Last played"}${ago}`
}

export function NowPlaying({ initial }: { initial: NowPlayingTrack | null }) {
  const [track, setTrack] = useState(initial)

  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== "visible") return

      try {
        const response = await fetch("/api/music/now-playing")
        if (!response.ok) return
        const next = (await response.json()) as NowPlayingTrack | null
        if (next) setTrack(next)
      } catch {
        // Keep showing the last known track.
      }
    }

    const interval = setInterval(refresh, POLL_MS)
    document.addEventListener("visibilitychange", refresh)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [])

  if (!track) return null

  return (
    <div className="border-line flex items-center gap-3 rounded-lg border p-3">
      <div className="bg-secondary relative size-16 shrink-0 overflow-hidden rounded-md">
        {track.coverArt && (
          // Proxied through our own route so credentials stay server-side.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/music/cover/${track.coverArt}`}
            alt={`${track.title} cover`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0">
        <p
          className="text-muted-foreground flex items-center gap-2 text-xs"
          suppressHydrationWarning
        >
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              track.isLive
                ? "bg-primary animate-pulse"
                : "bg-muted-foreground/40"
            )}
          />
          {getLabel(track)}
        </p>
        <p className="line-clamp-1 text-sm font-medium">{track.title}</p>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          {track.artist}
        </p>
      </div>
    </div>
  )
}
