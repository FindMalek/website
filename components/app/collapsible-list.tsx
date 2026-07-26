"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

interface CollapsibleListProps {
  /** All items, already rendered server-side -- a client component consumed
   * from a Server Component page can only receive pre-rendered JSX as props,
   * not a renderItem callback (functions can't cross that boundary). */
  items: React.ReactNode[]
  /** How many items are visible before any "Show more" click. */
  initialCount: number
  /** How many more items each "Show more" click reveals. */
  step: number
  /** Layout classes (e.g. "grid gap-3") applied to the item container. */
  className?: string
}

/**
 * Progressive reveal: shows `initialCount` items, "Show more" reveals
 * `step` more at a time until everything is visible. The one canonical
 * "show more" pattern reused across Work and Projects.
 */
export function CollapsibleList({
  items,
  initialCount,
  step,
  className,
}: CollapsibleListProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount)

  return (
    <div>
      <div className={className}>{items.slice(0, visibleCount)}</div>

      {visibleCount < items.length && (
        <div className="mt-3 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="min-w-32 gap-2"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + step, items.length)
              )
            }
          >
            Show more
            <Icons.down className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
