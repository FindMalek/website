"use client"

import { useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LocationItemProps {
  place: string
  note?: string
}

/**
 * The place is always visible; the note ("Remote, open to relocation") shows
 * on hover and focus, toggles on tap for touch screens, and is always present
 * for screen readers.
 */
export function LocationItem({ place, note }: LocationItemProps) {
  const [open, setOpen] = useState(false)

  if (!note) return <>{place}</>

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="hover:text-primary decoration-muted-foreground/50 cursor-default underline decoration-dotted underline-offset-4 transition-colors"
        >
          {place}
          <span className="sr-only">, {note}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} aria-hidden>
        {note}
      </TooltipContent>
    </Tooltip>
  )
}
