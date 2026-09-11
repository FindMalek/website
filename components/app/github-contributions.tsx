"use client"

import { use, useMemo } from "react"
import { format, isToday, parseISO } from "date-fns"

import { cn } from "@/lib/utils"

import type { Activity } from "@/components/app/contribution-graph"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/app/contribution-graph"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const STREAK_FILL = "#f59e0b"

// Consecutive contribution days counting back from today. A contribution-less
// "today" doesn't break the streak yet since the day isn't over.
function getCurrentStreakDates(data: Activity[]): Set<string> {
  const sortedByDateDesc = [...data].sort((a, b) => b.date.localeCompare(a.date))
  const streakDates = new Set<string>()
  let skippedToday = false

  for (const activity of sortedByDateDesc) {
    if (activity.count === 0) {
      if (!skippedToday && isToday(parseISO(activity.date))) {
        skippedToday = true
        continue
      }
      break
    }
    streakDates.add(activity.date)
  }

  return streakDates
}

export function GitHubContributions({
  contributions,
  className,
}: {
  contributions: Promise<Activity[]>
  className?: string
}) {
  const data = use(contributions)
  const streakDates = useMemo(() => getCurrentStreakDates(data), [data])

  return (
    <ContributionGraph
      className={cn("mx-auto py-2", className)}
      data={data}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
    >
      <ContributionGraphCalendar
        className="no-scrollbar px-2"
        title="GitHub Contributions"
      >
        {({ activity, dayIndex, weekIndex }) => {
          const style = streakDates.has(activity.date)
            ? { fill: STREAK_FILL }
            : undefined

          return activity.count === 0 ? (
            <g>
              <ContributionGraphBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
                style={style}
              />
            </g>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <g>
                  <ContributionGraphBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                    style={style}
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent className="font-sans">
                <p>
                  {activity.count} contribution
                  {activity.count > 1 ? "s" : null} on{" "}
                  {format(new Date(activity.date), "MMM d, yyyy")}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        }}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="px-2">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="text-muted-foreground">
              {totalCount.toLocaleString("en")} contributions in {year}
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  )
}

export function GitHubContributionsFallback() {
  return (
    <div className="h-40.5 flex w-full items-center justify-center">
      <Spinner className="text-muted-foreground" />
    </div>
  )
}
