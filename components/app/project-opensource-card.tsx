import { OpenSourceProject } from "@/types"

import { RepoCard } from "@/components/app/repo-card"

export function ProjectOpenSourceCard({
  repoUrl,
  info,
}: {
  repoUrl: string
  info?: OpenSourceProject
}) {
  return <RepoCard repoUrl={repoUrl} href={info?.url ?? repoUrl} info={info} />
}
