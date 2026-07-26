"use client"

import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"

interface PronounceNameButtonProps {
  name: string
  className?: string
}

/**
 * chanhdai's version plays a real recording of his own voice. No recording
 * exists for this site, so this uses the browser's native speechSynthesis
 * API instead -- a generic TTS voice, not the site owner's actual voice.
 * There's no realistic pronunciation-hint mechanism available without a
 * real audio file; that's an accepted trade-off of this approach, not a
 * bug to chase.
 *
 * Support is feature-detected inside the click handler, not during render --
 * branching render output on `typeof window`/`"speechSynthesis" in window`
 * would make the client's first render disagree with the server-rendered
 * HTML (which always runs with no `window`), causing a hydration mismatch.
 */
export function PronounceNameButton({
  name,
  className,
}: PronounceNameButtonProps) {
  const handleClick = () => {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(name))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Pronounce ${name}`}
      className={cn(
        "text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors",
        className
      )}
    >
      <Icons.volume className="size-4.5" aria-hidden />
    </button>
  )
}
