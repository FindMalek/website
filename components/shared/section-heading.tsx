import Link from "next/link"

import { link } from "@/config/styles"
import { cn } from "@/lib/utils"

import { PanelCopyLinkButton } from "@/components/app/panel-copy-link-button"

interface Direct {
  href: string
  text: string
  icon?: React.ReactNode
}

interface SectionHeadingProps {
  id?: string
  /**
   * Section anchor to copy a link to, e.g. "playlists" -> /#playlists.
   * Separate from `id` (the actual DOM id) since the enclosing <section>
   * often already owns that id -- setting both here would create a
   * duplicate DOM id.
   */
  copyLinkSectionId?: string
  title: string
  count?: number
  description?: string
  direct?: Direct
  className?: string
}

export function SectionHeading({
  id,
  copyLinkSectionId,
  title,
  count,
  description,
  direct,
  className,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn(
        "mb-6 flex items-center justify-between",
        id && "[scroll-margin-top:var(--header-height,6rem)]",
        className
      )}
    >
      <div>
        <h2 className="group/title mb-2 flex items-center gap-1.5 text-3xl font-bold">
          {title}
          {count !== undefined && (
            <sup className="text-muted-foreground top-[-0.75em] ml-2.5 text-sm font-medium tracking-normal">
              ({count})
            </sup>
          )}
          {copyLinkSectionId && (
            <PanelCopyLinkButton sectionId={copyLinkSectionId} />
          )}
        </h2>
        {description && (
          <p className="text-secondary-foreground/80">{description}</p>
        )}
      </div>
      {direct && (
        <Link
          href={direct.href}
          className="flex items-center gap-2 hover:underline"
        >
          <span
            className={cn("text-secondary-foreground hidden md:inline", link)}
          >
            {direct.text}
          </span>
          {direct.icon}
        </Link>
      )}
    </div>
  )
}
