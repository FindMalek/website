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
          icon: <Icons.spotify className="size-6" />,
        }}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {playlists.slice(0, displayCount).map((playlist) => (
          <Link
            key={playlist.id}
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary group relative aspect-square overflow-hidden rounded-lg"
          >
            {/* This is for Vercel crazy image optimization pricing */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={playlist.images[0]?.url || "/placeholder.svg"}
              alt={playlist.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="bg-secondary-foreground/80 absolute inset-0 flex flex-col items-center justify-center p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                className="mb-2 rounded-full"
              >
                Play
              </Button>
              <span className="text-secondary line-clamp-2 text-center text-sm font-medium">
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
