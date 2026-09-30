import { Contribution, OpenSourceProject } from "@/types"

import { RepoCard } from "@/components/app/repo-card"

const GITHUB_USERNAME = "FindMalek"

export function ProjectContributionCard({
  contribution,
  info,
}: {
  contribution: Contribution
  info?: OpenSourceProject
}) {
  const searchUrl = `${contribution.repo}/pulls?q=${encodeURIComponent(
    `is:pr is:merged author:${GITHUB_USERNAME}`
  )}`

  return (
    <RepoCard
      repoUrl={contribution.repo}
      href={searchUrl}
      info={info}
      showOwnerAvatar
    >
      <div className="mt-3 border-t pt-2.5">
        <p className="text-muted-foreground mb-1 text-xs font-medium">
          Merged {contribution.pullRequests.length === 1 ? "PR" : "PRs"}
        </p>
        <ul>
          {contribution.pullRequests.map((pullRequest) => (
            <li key={pullRequest.number}>
              <a
                href={`${contribution.repo}/pull/${pullRequest.number}`}
                target="_blank"
                rel="noopener noreferrer"
                title={pullRequest.title}
                className="hover:bg-muted -mx-1.5 flex min-w-0 items-baseline gap-2 rounded px-1.5 py-1 text-xs no-underline transition-colors"
              >
                <span className="text-muted-foreground shrink-0 font-mono tabular-nums">
                  #{pullRequest.number}
                </span>
                <span className="truncate">{pullRequest.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </RepoCard>
  )
}
