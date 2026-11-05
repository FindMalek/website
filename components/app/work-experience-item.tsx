"use client"

import Image from "next/image"
import Link from "next/link"
import { Work } from "content-collections"

import { cn, WorkExperienceGroup } from "@/lib/utils"

import { WorkPositionItem } from "@/components/app/work-position-item"
import { Icons } from "@/components/shared/icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

/**
 * One row per company: logo, name, and how many roles I held there. It expands
 * to the roles themselves. Links sit beside the trigger, not inside it.
 */
export function WorkExperienceItem({
  group,
  defaultOpen = false,
}: {
  group: WorkExperienceGroup<Work>
  defaultOpen?: boolean
}) {
  const { company, logo, logoClassName, link, location, isCurrentEmployer, positions } = group
  const caseStudyHref = positions[0]?.href
  const roles = `${positions.length} ${positions.length === 1 ? "position" : "positions"}`

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="group/company border-foreground/10 border-b last:border-b-0"
    >
      <div className="flex items-center gap-1">
        <CollapsibleTrigger className="dither-hover -mx-2 flex min-w-0 flex-1 items-center gap-3 px-2 py-3 text-left transition-colors">
          <div className="border-border relative size-10 shrink-0 overflow-hidden border">
            <Image
              src={logo}
              alt={`${company} logo`}
              fill
              sizes="40px"
              className={cn("object-cover", logoClassName)}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">{company}</span>
              {isCurrentEmployer && (
                <span
                  className="relative flex size-2 shrink-0"
                  role="img"
                  aria-label="Current employer"
                  title="current employer"
                >
                  <span className="absolute inline-flex size-full animate-ping rounded-none bg-green-500/60" />
                  <span className="relative inline-flex size-2 rounded-none bg-green-500" />
                </span>
              )}
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {roles}
              {location ? ` · ${location}` : ""}
            </p>
          </div>

          <Icons.chevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/company:rotate-180" />
        </CollapsibleTrigger>

        {link && (
          <Link
            href={link}
            target="_blank"
            rel="noopener"
            aria-label={`${company} website`}
            title="website"
            className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center transition-colors"
          >
            <Icons.externalLink />
          </Link>
        )}
        {caseStudyHref && (
          <Link
            href={caseStudyHref}
            aria-label="View full case study"
            title="case study"
            className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center transition-colors"
          >
            <Icons.arrowUpRight />
          </Link>
        )}
      </div>

      <CollapsibleContent className="overflow-hidden">
        <div className="border-foreground/10 divide-foreground/10 mb-3 ml-5 divide-y border-l pl-5">
          {positions.map((position) => (
            <WorkPositionItem key={position.id} work={position} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
