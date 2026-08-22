"use client"

import Link from "next/link"

import { OpenSourceProject } from "@/types"

import { Icons } from "@/components/shared/icons"

export function ProjectOpenSourceCard({
  project,
}: {
  project: OpenSourceProject
}) {
  const formattedStars =
    project.stars >= 1000
      ? `${(project.stars / 1000).toFixed(1)}k`
      : project.stars.toString()

  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground group bg-secondary/30 border-foreground/20 hover:border-primary/30 hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 no-underline transition-colors duration-300"
    >
      <h3 className="truncate text-sm font-medium">{project.name}</h3>
      <div className="flex shrink-0 items-center gap-3 text-xs">
        {project.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: project.languageColor }}
            />
            <span className="text-muted-foreground">{project.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Icons.star className="h-3 w-3 fill-amber-400/90 stroke-amber-400 transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:fill-amber-400" />
          <span className="font-medium">{formattedStars}</span>
        </div>
      </div>
    </Link>
  )
}
