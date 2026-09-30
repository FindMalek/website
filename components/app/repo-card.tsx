"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { OpenSourceProject } from "@/types"

import { Icons } from "@/components/shared/icons"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function formatStars(stars: number) {
  return stars >= 1000
    ? `${Number((stars / 1000).toFixed(1))}k`
    : stars.toString()
}

function OwnerAvatar({
  owner,
  className,
}: {
  owner: string
  className: string
}) {
  return (
    // github.com/<owner>.png redirects to the avatar CDN, so skip the optimizer
    <Image
      src={`https://github.com/${owner}.png?size=40`}
      alt=""
      width={20}
      height={20}
      unoptimized
      className={className}
    />
  )
}

export function RepoCard({
  repoUrl,
  href,
  info,
  showOwnerAvatar = false,
  children,
}: {
  repoUrl: string
  href: string
  info?: OpenSourceProject
  showOwnerAvatar?: boolean
  children?: React.ReactNode
}) {
  const [owner, repoSlug] = new URL(repoUrl).pathname.split("/").filter(Boolean)
  const name = info?.name ?? repoSlug
  const [open, setOpen] = useState(false)
  // A tap focuses the link, which Radix treats as a hover. On touch the card
  // is just a link; the details live on the page it opens.
  const isTouchRef = useRef(false)

  return (
    <HoverCard
      open={open}
      onOpenChange={(next) => setOpen(next && !isTouchRef.current)}
      openDelay={250}
      closeDelay={120}
    >
      <HoverCardTrigger asChild>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={`${owner}/${name}`}
          onPointerDown={(event) => {
            isTouchRef.current = event.pointerType === "touch"
          }}
          className="text-foreground bg-secondary/30 border-foreground/20 hover:border-primary/30 hover:bg-muted/50 focus-visible:ring-ring/50 group flex h-10 min-w-0 items-center justify-between gap-3 rounded-lg border px-3 no-underline outline-none transition-colors duration-300 focus-visible:ring-[3px]"
        >
          <span className="flex min-w-0 items-center gap-2">
            {showOwnerAvatar && (
              <OwnerAvatar owner={owner} className="size-5 shrink-0 rounded" />
            )}
            <h3 className="truncate text-sm font-medium">{name}</h3>
          </span>
          {info && (
            <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums">
              <Icons.star className="h-3 w-3 fill-amber-400/90 stroke-amber-400 transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:fill-amber-400" />
              <span className="font-medium">{formatStars(info.stars)}</span>
            </span>
          )}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        collisionPadding={16}
        className="w-80 max-w-[calc(100vw-2rem)] p-3"
      >
        <div className="flex min-w-0 items-center gap-2">
          <OwnerAvatar owner={owner} className="size-5 shrink-0 rounded" />
          <p className="truncate text-sm">
            <span className="text-muted-foreground">{owner}/</span>
            <span className="font-medium">{name}</span>
          </p>
        </div>
        {info?.description && (
          <p className="text-muted-foreground mt-2 line-clamp-3 text-xs leading-relaxed">
            {info.description}
          </p>
        )}
        {info && (
          <div className="mt-2.5 flex items-center gap-3 text-xs">
            {info.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: info.languageColor }}
                />
                <span className="text-muted-foreground">{info.language}</span>
              </span>
            )}
            <span className="flex items-center gap-1 tabular-nums">
              <Icons.star className="h-3 w-3 fill-amber-400/90 stroke-amber-400" />
              <span className="font-medium">
                {info.stars.toLocaleString("en-US")}
              </span>
            </span>
          </div>
        )}
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}
