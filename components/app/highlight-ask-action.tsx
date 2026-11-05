"use client"

import { useChatDock } from "@/providers/chat-provider"

import { clamp } from "@/lib/utils"
import { useHighlightToAsk } from "@/hooks/use-highlight-to-ask"

const ACTION_WIDTH = 140

/**
 * The chip that appears over selected text. A square, mono, bordered prompt
 * line, like everything else: `> ask about this`.
 */
export function HighlightAskAction() {
  const { selection, clearSelection } = useHighlightToAsk()
  const { seedInput } = useChatDock()

  if (!selection || typeof window === "undefined") return null

  const handleClick = () => {
    seedInput(`> "${selection.text}"\n\n`)
    clearSelection()
  }

  // getBoundingClientRect() is viewport-relative, which is exactly what a
  // `position: fixed` element needs -- no scroll-offset correction here.
  const top = Math.max(8, selection.rect.top - 40)
  const left = clamp(
    selection.rect.left + selection.rect.width / 2 - ACTION_WIDTH / 2,
    8,
    window.innerWidth - ACTION_WIDTH - 8
  )

  return (
    <button
      type="button"
      className="dither-hover border-foreground/40 bg-background text-foreground fixed z-[60] flex items-center gap-2 rounded-none border px-2.5 py-1.5 font-mono text-xs lowercase"
      style={{ top, left }}
      onClick={handleClick}
    >
      <span aria-hidden="true" className="text-chart-1">
        &gt;
      </span>
      ask about this
    </button>
  )
}
