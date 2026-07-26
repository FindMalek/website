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
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ProjectItem({ project }: { project: ProjectRo }) {
  const {
    image,
    name,
    overview,
    status,
    link,
    href,
    tags,
    startDate,
    endDate,
  } = project

  return (
    <Collapsible className="group/project border-foreground/10 border-b py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="border-border relative size-9 shrink-0 overflow-hidden rounded-md border">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            {(startDate || endDate) && (
              <p className="text-muted-foreground text-xs">
                {startDate}
                {startDate && endDate ? " — " : ""}
                {endDate}
              </p>
            )}
          </div>

          <Badge
            variant="outline"
            className={cn(
              "shrink-0 px-2 py-0.5 text-xs font-medium capitalize",
              convertProjectStatusColor(status)
            )}
          >
            {convertProjectStatus(status)}
          </Badge>

          <Icons.chevronsUpDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/project:rotate-180" />
        </CollapsibleTrigger>

        {link && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={link}
                target="_blank"
                rel="noopener"
                className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
              >
                <Icons.externalLink className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit project</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
        <div className="space-y-3 pl-12 pt-3">
          <p className="text-muted-foreground text-sm">{overview}</p>

          {tags && tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={href}
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
