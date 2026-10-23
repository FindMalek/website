import Link from "next/link"

import { Contribution, OpenSourceProject } from "@/types"

import { cn } from "@/lib/utils"

import { RepoCard } from "@/components/app/repo-card"
import { Icons } from "@/components/shared/icons"

const GITHUB_USERNAME = "FindMalek"

export function ProjectContributionCard({
  contribution,
  info,
}: {
  contribution: Contribution
  info?: OpenSourceProject
}) {
  const { archive } = contribution
  // An archived repo is a fork: the upstream PR search can't work there and
  // the fork's own star count says nothing about the project.
  const href = archive
    ? contribution.repo
    : `${contribution.repo}/pulls?q=${encodeURIComponent(
        `is:pr is:merged author:${GITHUB_USERNAME}`
      )}`

  return (
    <RepoCard
      repoUrl={contribution.repo}
      href={href}
      info={archive ? undefined : info}
      showOwnerAvatar
    >
      <div className="mt-3 border-t pt-2.5">
        <p className="text-muted-foreground mb-1 text-xs font-medium">
          Merged {contribution.pullRequests.length === 1 ? "PR" : "PRs"}
        </p>
        <ul>
          {contribution.pullRequests.map((pullRequest) => (
            <li
              key={pullRequest.number}
              className="flex min-w-0 items-baseline gap-2"
            >
              <a
                href={
                  pullRequest.url ??
                  `${contribution.repo}/pull/${pullRequest.number}`
                }
                target="_blank"
                rel="noopener noreferrer"
                title={pullRequest.title}
                className={cn(
                  "hover:bg-muted -mx-1.5 flex min-w-0 flex-1 items-baseline gap-2 rounded px-1.5 py-1 text-xs no-underline transition-colors",
                  pullRequest.post && "mr-0"
                )}
              >
                <span className="text-muted-foreground shrink-0 font-mono tabular-nums">
                  #{pullRequest.number}
                </span>
                <span className="truncate">{pullRequest.title}</span>
              </a>
              {pullRequest.post && (
                <Link
                  href={pullRequest.post}
                  aria-label="Read the write-up"
                  title="Read the write-up"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring/50 -mr-1 shrink-0 self-center rounded p-1 outline-none transition-colors focus-visible:ring-[3px]"
                >
                  <Icons.post className="size-3.5" />
                </Link>
              )}
            </li>
          ))}
        </ul>
        {archive && (
          <p className="text-muted-foreground mt-2 text-xs">
            {archive.note}{" "}
            {archive.post && (
              <Link
                href={archive.post}
                className="text-foreground underline underline-offset-2"
              >
                Read the overview
              </Link>
            )}
          </p>
        )}
      </div>
    </RepoCard>
  )
}
