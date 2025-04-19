import Image from "next/image"
import Link from "next/link"

import {
  convertProjectStatus,
  convertProjectStatusColor,
} from "@/config/converter"
import { ProjectRo } from "@/config/schemas"
import { cn } from "@/lib/utils"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ProjectCard({ project }: { project: ProjectRo }) {
  return (
    <Link href={project.href}>
      <Card
        className={cn(
          "bg-secondary/30 hover:bg-secondary/60 overflow-hidden rounded-xl border-2 transition-all duration-200",
          "hover:translate-y-[-2px] hover:shadow-md"
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 pt-2">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1 font-medium capitalize",
              convertProjectStatusColor(project.status)
            )}
          >
            {convertProjectStatus(project.status)}
          </Badge>
        </CardHeader>
        <CardContent className="px-4">
          <CardDescription className="text-muted-foreground mb-4 pb-4 text-sm">
            {project.overview}
          </CardDescription>
          <div className="border-secondary relative min-h-[120px] w-full overflow-hidden rounded-lg border-2 bg-white md:min-h-[180px]">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={project.image}
                alt={project.name}
                className="object-cover"
                fill
              />
            </AspectRatio>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
