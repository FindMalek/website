"use client"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

interface CollapsibleListProps {
  /** Already-rendered, always-visible items. */
  visible: React.ReactNode[]
  /** Already-rendered items revealed by "Show more". */
  hidden: React.ReactNode[]
  /** Layout classes (e.g. "grid gap-3") applied to both groups, so they
   * read as one continuous grid/list rather than two visually distinct
   * blocks. Pre-rendered nodes (not a renderItem callback) because this
   * is a client component consumed from Server Component pages -- functions
   * can't cross that boundary as props, JSX already can. */
  className?: string
}

/**
 * Shows `visible` directly, wraps `hidden` in a Collapsible with a
 * "Show more/less" trigger -- the one canonical "show more" pattern reused
 * across Work and Projects, instead of a bespoke version per section.
 */
export function CollapsibleList({
  visible,
  hidden,
  className,
}: CollapsibleListProps) {
  return (
    <Collapsible>
      <div className={className}>{visible}</div>

      {hidden.length > 0 && (
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
          <div className={cn(className, "mt-3")}>{hidden}</div>
        </CollapsibleContent>
      )}

      {hidden.length > 0 && (
        <div className="mt-3 flex justify-center">
          <CollapsibleTrigger asChild>
            <Button variant="secondary" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">
                Show more
              </span>
              <span className="hidden group-data-[state=open]:block">
                Show less
              </span>
              <Icons.chevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  )
}
