"use client"

import { useEffect, useState } from "react"

import type { NowPlaying as NowPlayingData } from "@/lib/lodesong"

import { SoundIcon } from "@/components/dither/pixel-icon"

const POLL_MS = 30_000

/** What is playing in my own player right now, refreshed while the tab is visible. */
export function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null)

  useEffect(() => {
    let stopped = false
    const load = async (): Promise<void> => {
      if (document.visibilityState === "hidden") return
      try {
        const res = await fetch("/api/now-playing")
        if (res.ok && !stopped) setData((await res.json()) as NowPlayingData)
      } catch {
        // Offline or blocked: keep the last value.
      }
    }
    void load()
    const timer = setInterval(load, POLL_MS)
    return () => {
      stopped = true
      clearInterval(timer)
    }
  }, [])

  if (!data?.song) return null

  return (
    <p className="border-foreground/10 flex items-center gap-3 border-b py-2 font-mono text-sm">
      <SoundIcon playing={data.playing} className="text-chart-1 shrink-0" />
      <span className="text-muted-foreground shrink-0 lowercase">
        {data.playing ? "now playing" : "last played"}
      </span>
      <span className="truncate">
        {data.song.title}
        <span className="text-muted-foreground"> · {data.song.artist}</span>
      </span>
    </p>
  )
}
