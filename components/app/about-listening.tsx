import { env } from "@/env"
import { getListeningStats, type StatItem } from "@/lib/lodesong"

import { NowPlaying } from "@/components/app/now-playing"
import { SectionHeading } from "@/components/shared/section-heading"

const HEAT = [
  "bg-foreground/10",
  "bg-chart-3/40",
  "bg-chart-3/70",
  "bg-chart-2",
  "bg-chart-1",
]

function Ranked({
  title,
  items,
  unit,
}: {
  title: string
  items: StatItem[]
  unit: "hours" | "plays"
}) {
  const max = Math.max(1, ...items.map((i) => (unit === "hours" ? i.minutes : i.plays)))
  return (
    <div>
      <h3 className="text-muted-foreground mb-2 text-xs lowercase">{title}</h3>
      <ol className="divide-foreground/10 border-foreground/10 divide-y border-y">
        {items.map((item, index) => {
          const value = unit === "hours" ? item.minutes : item.plays
          return (
            <li key={item.id} className="py-1.5 text-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{item.name}</span>
                <span className="text-muted-foreground ml-auto shrink-0 tabular-nums">
                  {unit === "hours" ? `${Math.round(item.minutes / 60)}h` : `${item.plays}x`}
                </span>
              </div>
              <div className="pl-7 pt-1">
                <div
                  className="dither-bar h-1.5"
                  style={{ width: `${Math.max(4, (value / max) * 100)}%` }}
                />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/**
 * What I listen to, kept small: what is playing now, my top three artists and
 * tracks of the last month, and the last seven days. From my own lodesong player.
 */
export async function AboutListening() {
  const stats = await getListeningStats(30)
  if (!stats) return null

  const week = stats.days.slice(-7)
  const peak = Math.max(1, ...week.map((d) => d.minutes))
  const daysListened = week.filter((d) => d.minutes > 0).length

  return (
    <section
      id="listening"
      className="[scroll-margin-top:var(--header-height,6rem)]"
    >
      <SectionHeading
        title="Listening"
        copyLinkSectionId="listening"
        description="Straight from the player I built."
        direct={
          env.LODESONG_URL ? { href: env.LODESONG_URL, text: "lodesong" } : undefined
        }
      />

      <NowPlaying />

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <Ranked title="top artists" items={stats.top.artists.slice(0, 3)} unit="hours" />
        <Ranked title="top tracks" items={stats.top.songs.slice(0, 3)} unit="plays" />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-muted-foreground text-xs lowercase">last 7 days</h3>
          <p className="text-muted-foreground text-xs tabular-nums">
            {daysListened}/7 days
          </p>
        </div>
        <div className="grid grid-cols-7 gap-1" role="img" aria-label="Listening in the last 7 days">
          {week.map((d) => {
            const level = d.minutes === 0 ? 0 : Math.min(4, Math.ceil((d.minutes / peak) * 4))
            const weekday = new Date(`${d.day}T12:00:00`).toLocaleDateString("en", { weekday: "short" })
            return (
              <div key={d.day} title={`${d.day}: ${d.minutes} min`}>
                <div className={`h-6 ${HEAT[level]}`} />
                <p className="text-muted-foreground mt-1 text-center text-xs lowercase">{weekday}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
