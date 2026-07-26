import Link from "next/link"

import {
  convertProjectStatus,
  convertProjectStatusColor,
} from "@/config/converter"
import { ProjectRo } from "@/config/schemas"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

export function ProjectCardCompact({ project }: { project: ProjectRo }) {
  return (
    <Link
      href={project.href}
      className="border-foreground/10 hover:border-primary/30 hover:bg-muted/50 group flex items-center justify-between gap-3 rounded-xl border p-3 transition-all duration-200"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{project.name}</p>
        <p className="text-muted-foreground truncate text-xs">
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
    </Link>
  )
}
