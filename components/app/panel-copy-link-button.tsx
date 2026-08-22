"use client"

import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"

/**
 * Copy-link button for a section's anchor URL. Always visible at reduced
 * opacity so touch devices (no hover) can still find and tap it; full
 * opacity on hover/focus for desktop discoverability.
 */
export function PanelCopyLinkButton({
  sectionId,
  className,
}: {
  sectionId: string
  className?: string
}) {
  const { copied, copy } = useCopyClipboard()

  const handleClick = () => {
    copy(`${siteConfig.url}/#${sectionId}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Copy link to this section`}
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex items-center justify-center opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100",
        className
      )}
    >
      {copied ? (
        <Icons.check className="size-3.5" aria-hidden />
      ) : (
        <Icons.copy className="size-3.5" aria-hidden />
      )}
    </button>
  )
}
