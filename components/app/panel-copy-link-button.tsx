"use client"

import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"

/**
 * Copy-link button for a section's anchor URL. Hidden until the enclosing
 * Panel (a `group/panel`, only set when the Panel has an `id`) is hovered,
 * then fades in slowly -- not hover-on-the-button-itself, hover-anywhere-in-
 * the-section. `focus-visible` still reveals it for keyboard navigation,
 * since focus can't be discovered by hovering.
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
        "text-muted-foreground hover:text-foreground inline-flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100 focus-visible:opacity-100",
        className
      )}
    >
      {copied ? (
        <Icons.check className="size-3.5" aria-hidden />
      ) : (
        <Icons.link className="size-3.5" aria-hidden />
      )}
    </button>
  )
}
