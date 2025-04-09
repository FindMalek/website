import Image from "next/image"
import Link from "next/link"

import { AvatarContainerType } from "@/types"

import { siteConfig } from "@/config/site"
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
  className,
  style,
}: {
  large?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const imageUrl =
    process.env.NODE_ENV === "development"
      ? "/author.jpg"
      : siteConfig.images.logo

  return (
    <Link
      href="/"
      aria-label="Home"
      className={cn(className, "pointer-events-auto")}
      style={style}
    >
      <Image
        src={imageUrl}
        alt="Malek Gara-Hellal avatar"
        sizes={large ? "4rem" : "2.25rem"}
        className={cn(
          "rounded-full",
          "bg-cyan-800 dark:bg-cyan-400",
          "object-cover",
          large
            ? "size-12 sm:size-12 md:size-12 lg:size-16 xl:size-16"
            : "size-9 sm:size-9 md:size-9 lg:size-10 xl:size-10"
        )}
        width={300}
        height={300}
        priority
      />
    </Link>
  )
}
