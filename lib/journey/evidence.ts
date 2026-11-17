import { allProjects, allWorks } from "content-collections"

import { getVisiblePosts } from "@/lib/blog"

import type { MatchProof } from "./match-schema"

export function getEvidenceCatalog(): MatchProof[] {
  return [
    ...allWorks.map((work) => ({
      label: `${work.company}, ${work.position}`,
      href: work.href,
    })),
    ...allProjects.map((project) => ({
      label: project.name,
      href: project.href,
    })),
    ...getVisiblePosts().map((post) => ({
      label: post.title,
      href: post.href,
    })),
  ]
}
