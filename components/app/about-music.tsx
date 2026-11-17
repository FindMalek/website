import type { MusicSnapshot } from "@/types"

import { NowPlaying } from "@/components/app/now-playing"
import { Icons } from "@/components/shared/icons"
import { SectionHeading } from "@/components/shared/section-heading"

export function AboutMusic({ music }: { music: MusicSnapshot | null }) {
  const maxWeight = Math.max(...(music?.genres.map((g) => g.weight) ?? [1]))

  return (
    <section
      id="music"
      className="[scroll-margin-top:var(--header-height,6rem)]"
    >
      <SectionHeading
        title="Music"
        copyLinkSectionId="music"
        description="I stopped renting my library, it plays from my own server now"
        direct={{
          href: "/projects/lodesong",
          text: "Built with lodesong",
          icon: <Icons.arrowUpRight className="size-5" />,
        }}
      />

      {music ? (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="sm:w-72 sm:shrink-0">
            <NowPlaying initial={music.track} />
          </div>

          {music.genres.length > 0 && (
            <ul className="flex flex-1 flex-col gap-2.5">
              {music.genres.map((genre) => (
                <li key={genre.name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-sm">
                    {genre.name}
                  </span>
                  <div className="bg-secondary h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${(genre.weight / maxWeight) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          My server is asleep right now, check back later.
        </p>
      )}
    </section>
  )
}
