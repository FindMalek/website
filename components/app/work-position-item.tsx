"use client"

import { Work } from "content-collections"

import { convertWorkType } from "@/config/converter"

import { WorkDateWithTooltip } from "@/components/app/work-date-with-tooltip"
import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function WorkPositionItem({ work }: { work: Work }) {
  const { position, type, startDate, endDate, overview, skills } = work

  return (
    <Collapsible className="group/position">
      <CollapsibleTrigger className="flex w-full items-center gap-3 py-3 text-left">
        <Icons.briefcase className="text-muted-foreground size-4 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{position}</p>
          <p className="text-muted-foreground text-xs">
            {convertWorkType(type)} ·{" "}
            <WorkDateWithTooltip startDate={startDate} endDate={endDate} />
          </p>
        </div>

        <Icons.chevronsUpDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/position:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
        <p className="text-muted-foreground pb-3 pl-7 text-sm leading-relaxed">
          {overview}
        </p>
      </CollapsibleContent>

      {skills && skills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pb-3 pl-7">
          {skills.map((skill) => (
            <li key={skill}>
              <Badge variant="secondary" className="text-xs">
                {skill}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
  )
}
