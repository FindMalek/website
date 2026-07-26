"use client"

import { useChatDock } from "@/providers/chat-provider"

import { clamp } from "@/lib/utils"
import { useHighlightToAsk } from "@/hooks/use-highlight-to-ask"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

const ACTION_WIDTH = 148

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
  const top = Math.max(8, selection.rect.top - 44)
  const left = clamp(
    selection.rect.left + selection.rect.width / 2 - ACTION_WIDTH / 2,
    8,
    window.innerWidth - ACTION_WIDTH - 8
  )

  return (
    <Button
      size="sm"
      className="fixed z-[60] rounded-full shadow-lg"
      style={{ top, left }}
      onClick={handleClick}
    >
      <Icons.logo className="mr-1.5 size-3.5" />
      Ask about this
    </Button>
  )
}
