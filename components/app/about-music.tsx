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
    <section
      id="playlists"
      className="mb-32 [scroll-margin-top:var(--header-height,6rem)]"
    >
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

            <div className="flex items-center justify-between gap-1.5">
              <span className="line-clamp-1 text-sm font-medium">
                {playlist.name}
              </span>
              <Icons.externalLink className="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-colors" />
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
