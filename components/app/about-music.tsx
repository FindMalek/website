"use client"

import { useState } from "react"
import Link from "next/link"

import { SpotifyPlaylist } from "@/types"

import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"

export function AboutMusic({ playlists }: { playlists: SpotifyPlaylist[] }) {
  const [displayCount, setDisplayCount] = useState(12)

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + 12, playlists.length))
  }

  return (
    <section
      id="playlists"
      className="mb-32 [scroll-margin-top:var(--header-height,6rem)]"
    >
      <SectionHeading
        title="Music"
        count={playlists.length}
        description="I love listening to music and creating playlists"
        direct={{
          href: siteConfig.links.spotify,
          text: "View profile",
          icon: <Icons.spotify className="size-6" />,
        }}
      />

      <div className="grid grid-cols-6 gap-3">
        {playlists.slice(0, displayCount).map((playlist) => (
          <Link
            key={playlist.id}
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2"
          >
            <div className="bg-secondary relative aspect-square overflow-hidden rounded-lg">
              {/* This is for Vercel crazy image optimization pricing */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={playlist.images[0]?.url || "/placeholder.svg"}
                alt={playlist.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            <span className="line-clamp-1 text-sm font-medium">
              {playlist.name}
            </span>
          </Link>
        ))}
      </div>

      {displayCount < playlists.length && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="min-w-32 gap-2"
            onClick={handleShowMore}
          >
            Show more
            <Icons.down className="size-4" />
          </Button>
        </div>
      )}
    </section>
  )
}
