"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { convertProjectStatus } from "@/config/converter"
import { ProjectRo } from "@/config/schemas"
import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const STATUS_DOT_COLOR: Record<ProjectRo["status"], string> = {
  published: "bg-green-500",
  wip: "bg-yellow-500",
  "on-hold": "bg-orange-500",
  draft: "bg-gray-400",
}

export function ProjectItem({ project }: { project: ProjectRo }) {
  const router = useRouter()
  const { image, name, status, link, href, tags, startDate, endDate } =
    project

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      router.push(href)
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={handleCardKeyDown}
      className="group border-foreground/10 hover:bg-muted/50 focus-visible:ring-ring -mx-2 flex cursor-pointer items-center gap-3 rounded-lg border-b px-2 py-3 outline-none transition-colors last:border-b-0 focus-visible:ring-2"
    >
      <div className="border-border relative size-9 shrink-0 overflow-hidden rounded-md border">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{name}</p>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="relative flex size-2 shrink-0">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                    STATUS_DOT_COLOR[status]
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-2 rounded-full",
                    STATUS_DOT_COLOR[status]
                  )}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{convertProjectStatus(status)}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {(startDate || endDate) && (
          <p className="text-muted-foreground text-xs">
            {startDate}
            {startDate && endDate ? " — " : ""}
            {endDate}
          </p>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {link && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={link}
              target="_blank"
              rel="noopener"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-foreground relative z-10 shrink-0 transition-colors"
            >
              <Icons.externalLink className="size-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visit project</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Icons.arrowUpRight className="text-muted-foreground size-4 shrink-0" />
    </div>
  )
}
