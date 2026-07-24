import { ContributionDay } from "@/actions/github"
import { cn } from "@/lib/utils"

interface GithubHeatmapProps {
  days: ContributionDay[]
  totalContributions: number
}

function levelForCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-muted",
  1: "bg-primary/25",
  2: "bg-primary/50",
  3: "bg-primary/75",
  4: "bg-primary",
}

export function GithubHeatmap({
  days,
  totalContributions,
}: GithubHeatmapProps) {
  // GitHub already returns days grouped into full Sun-Sat weeks in order,
  // so chunking sequentially into columns of 7 reconstructs the weeks --
  // no date-math needed.
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-[3px] overflow-x-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                className={cn(
                  "size-[10px] rounded-[2px]",
                  LEVEL_CLASSES[levelForCount(day.count)]
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        {totalContributions.toLocaleString()} contributions in the last year
      </p>
    </div>
  )
}
