"use client"

import Link from "next/link"

import { OpenSourceProject } from "@/types"

import { Icons } from "@/components/shared/icons"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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
      className="text-foreground block no-underline"
    >
      <Card className="bg-secondary/30 border-foreground/20 hover:border-primary/30 hover:bg-muted/50 w-full max-w-md border transition-all duration-300 hover:shadow-md">
        <CardHeader className="px-4 md:px-5">
          <h3 className="flex items-center text-base font-semibold md:text-lg">
            {project.name}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3 px-4 md:px-5">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {project.description}
          </p>
          <div className="flex items-center gap-3 text-xs md:text-sm">
            {project.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: project.languageColor }}
                />
                <span>{project.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Icons.star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400 md:h-4 md:w-4" />
              <span className="font-medium">{formattedStars}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
