"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

import { useIntroductionJourneyStart } from "@/components/app/introduction-journey-provider"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AvatarIntroTrigger({
  large = false,
  className,
}: {
  large?: boolean
  className?: string
}) {
  const { start } = useIntroductionJourneyStart()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={start}
          aria-label="Play the introduction"
          className={cn(
            className,
            "group pointer-events-auto relative cursor-pointer rounded-full outline-none",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          {/* Pulsing halo hints the avatar is interactive */}
          <span
            aria-hidden
            className="bg-primary/40 absolute -inset-1 animate-pulse rounded-full blur-md motion-reduce:animate-none"
          />
          <Image
            src="/about/author.png"
            alt="Malek Gara-Hellal avatar"
            sizes={large ? "4rem" : "2.25rem"}
            className={cn(
              "bg-background relative rounded-full object-cover",
              "transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none",
              large
                ? "size-12 sm:size-12 md:size-16 xl:size-16"
                : "size-9 sm:size-9 md:size-9 lg:size-10 xl:size-10"
            )}
            width={300}
            height={300}
            priority
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-mono text-xs">
        want to experience something cool?
      </TooltipContent>
    </Tooltip>
  )
}
