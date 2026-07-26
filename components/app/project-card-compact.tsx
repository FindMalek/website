"use client"

import Image from "next/image"
import Link from "next/link"

import {
  convertProjectStatus,
  convertProjectStatusColor,
} from "@/config/converter"
import { ProjectRo } from "@/config/schemas"
import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function ProjectCardCompact({ project }: { project: ProjectRo }) {
  return (
    <Collapsible className="border-foreground/10 hover:border-primary/30 group rounded-xl border transition-colors">
      <CollapsibleTrigger className="w-full text-left">
        <div className="border-border relative overflow-hidden rounded-t-xl border-b">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={project.image}
              alt={project.name}
              className="object-cover"
              fill
            />
          </AspectRatio>
        </div>

        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{project.name}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {project.overview}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 px-2 py-0.5 text-xs font-medium capitalize",
              convertProjectStatusColor(project.status)
            )}
          >
            {convertProjectStatus(project.status)}
          </Badge>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
        <div className="space-y-3 border-t p-3 pt-3">
          <p className="text-muted-foreground text-sm">{project.overview}</p>

          {project.tags && project.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={project.href}
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View case study
            <Icons.arrowRight className="size-3.5" />
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
