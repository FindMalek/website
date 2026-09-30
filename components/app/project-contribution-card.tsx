import Image from "next/image"
import Link from "next/link"

import { Contribution } from "@/types"

import { Icons } from "@/components/shared/icons"

const GITHUB_USERNAME = "FindMalek"

export function ProjectContributionCard({
  contribution,
  stars,
}: {
  contribution: Contribution
  stars?: number
}) {
  const [owner, repo] = new URL(contribution.repo).pathname
    .split("/")
    .filter(Boolean)
  const mergedCount = contribution.pullRequests.length
  const searchUrl = `${contribution.repo}/pulls?q=${encodeURIComponent(
    `is:pr is:merged author:${GITHUB_USERNAME}`
  )}`
  const formattedStars =
    stars === undefined
      ? null
      : stars >= 1000
        ? `${(stars / 1000).toFixed(1)}k`
        : stars.toString()

  return (
    <Link
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground bg-secondary/30 border-foreground/20 hover:border-primary/30 hover:bg-muted/50 group flex items-center justify-between gap-3 rounded-lg border px-3 py-2 no-underline transition-colors duration-300"
    >
      <div className="flex min-w-0 items-center gap-2">
        {/* github.com/<owner>.png redirects to the avatar CDN, so skip the optimizer */}
        <Image
          src={`https://github.com/${owner}.png?size=40`}
          alt=""
          width={20}
          height={20}
          unoptimized
          className="size-5 shrink-0 rounded"
        />
        <h3 title={`${owner}/${repo}`} className="truncate text-sm font-medium">
          {repo}
        </h3>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs">
        <span className="text-muted-foreground">
          {mergedCount} merged {mergedCount === 1 ? "PR" : "PRs"}
        </span>
        {formattedStars && (
          <div className="flex items-center gap-1">
            <Icons.star className="h-3 w-3 fill-amber-400/90 stroke-amber-400 transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:fill-amber-400" />
            <span className="font-medium">{formattedStars}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
