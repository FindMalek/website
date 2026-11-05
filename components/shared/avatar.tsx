import Image from "next/image"
import Link from "next/link"

import { AvatarContainerType } from "@/types"

import { DitherImage } from "@/components/dither/dither-image"

import { cn } from "@/lib/utils"

export function AvatarContainer({ className, ...props }: AvatarContainerType) {
  return (
    <div
      className={cn(
        className,
        "h-10 w-10 rounded-full",
        "bg-cyan-400/40 dark:bg-cyan-600/80",
        "p-0.5 shadow-lg shadow-zinc-800/5",
        "ring-1 ring-zinc-900/5 dark:ring-black/10",
        "backdrop-blur",
        "sm:h-10 sm:w-10 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-12 xl:w-12"
      )}
      {...props}
    />
  )
}

export function Avatar({
  large = false,
  square = false,
  className,
  style,
}: {
  large?: boolean
  /** Square, hard-edged and framed: the dither design system's portrait. */
  square?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Link
      href="/"
      aria-label="Home"
      data-dither-group
      className={cn(className, "pointer-events-auto")}
      style={style}
    >
      <DitherImage
        src="/about/author.png"
        cell={2}
        className={cn(
          square ? "border-foreground/30 rounded-none border" : "rounded-full",
          "bg-cyan-800 dark:bg-cyan-400",
          square
            ? "size-20 sm:size-24"
            : large
              ? "size-12 sm:size-12 md:size-16 xl:size-16"
              : "size-9 sm:size-9 md:size-9 lg:size-10 xl:size-10"
        )}
      >
        <Image
          src={"/about/author.png"}
          alt="Malek Gara-Hellal avatar"
          sizes={square ? "6rem" : large ? "4rem" : "2.25rem"}
          className={cn("size-full object-cover", !square && "rounded-full")}
          width={300}
          height={300}
          priority
        />
      </DitherImage>
    </Link>
  )
}
