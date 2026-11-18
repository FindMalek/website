"use client"

import { useCelebration } from "@/providers/celebration-provider"

import { cn } from "@/lib/utils"

export function CelebrationBadge() {
  const { celebration, enabled, toggle } = useCelebration()
  if (!celebration) return null

  const label = enabled
    ? `Turn off the ${celebration.name} theme`
    : `Celebrate ${celebration.name}`

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="absolute -right-1.5 -top-1.5 z-10 grid size-6 place-items-center"
    >
      {!enabled && (
        <span className="bg-primary/40 absolute inset-0 animate-ping rounded-full" />
      )}
      <span
        className={cn(
          "bg-background relative grid size-6 place-items-center rounded-full border text-sm shadow-sm transition-transform hover:scale-110",
          !enabled && "animate-bounce"
        )}
      >
        {celebration.emoji}
      </span>
    </button>
  )
}
