"use client"

import { useState } from "react"
import Link from "next/link"

import { SpotifyPlaylist } from "@/types"

import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"

export function AboutMusic({ playlists }: { playlists: SpotifyPlaylist[] }) {
  const [displayCount, setDisplayCount] = useState(8)

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + 8, playlists.length))
  }

  return (
    <section className="mb-32">
      <SectionHeading
        title="Music"
        description="I love listening to music and creating playlists"
        direct={{
          href: siteConfig.links.spotify,
          text: "View profile",
          icon: <Icons.spotify className="size-4" />,
        }}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {playlists.slice(0, displayCount).map((playlist) => (
          <Link
            key={playlist.id}
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg bg-slate-800"
          >
            <img
              src={playlist.images[0]?.url || "/placeholder.svg"}
              alt={playlist.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                className="mb-2 rounded-full"
              >
                Play
              </Button>
              <span className="line-clamp-2 text-center text-sm font-medium text-white">
                {playlist.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {displayCount < playlists.length && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleShowMore}
          >
            Show more
          </Button>
        </div>
      )}
    </section>
  )
}
