"use client"

import Link from "next/link"

import type { ResumeData } from "@/lib/get-resume-data"

import { Icons } from "@/components/shared/icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type EducationEntry = ResumeData["sections"]["education"]["items"][number]

export function EducationItem({ item }: { item: EducationEntry }) {
  const { school, degree, area, grade, location, period, website, description } =
    item

  const degreeLine = area ? `${degree}, ${area}` : degree

  return (
    <Collapsible className="group/education border-foreground/10 border-b py-4 last:border-b-0">
      <CollapsibleTrigger className="hover:bg-muted/50 -mx-2 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors">
        <Icons.graduationCap className="text-muted-foreground size-4 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{school}</p>
          <p className="text-muted-foreground text-xs">
            {degreeLine}
            {period ? ` · ${period}` : ""}
            {location ? ` · ${location}` : ""}
          </p>
        </div>

        <Icons.chevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/education:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
        <div className="pb-3 pl-7 text-sm">
          {grade && (
            <p className="text-muted-foreground mb-1 font-medium">{grade}</p>
          )}
          {description && (
            <div
              className="text-muted-foreground leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {website?.url && (
            <Link
              href={website.url}
              target="_blank"
              rel="noopener"
              className="text-muted-foreground hover:text-foreground mt-1 inline-block underline-offset-2 hover:underline"
            >
              {website.label || website.url}
            </Link>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
