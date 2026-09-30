import Image from "next/image"

import type { PostSummary } from "@/lib/blog"
import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"

interface PostCoverProps {
  post: Pick<PostSummary, "image" | "imageAlt" | "title">
  sizes: string
  priority?: boolean
  className?: string
}

export function PostCover({
  post,
  sizes,
  priority = false,
  className,
}: PostCoverProps) {
  return (
    <div
      className={cn(
        "border-line bg-muted/40 relative aspect-[1200/630] overflow-hidden rounded-lg border",
        className
      )}
    >
      {post.image ? (
        <Image
          src={post.image}
          alt={post.imageAlt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="text-muted-foreground/50 flex size-full items-center justify-center bg-[repeating-linear-gradient(315deg,var(--line)_0,var(--line)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]"
        >
          <Icons.blog className="size-6" />
        </div>
      )}
    </div>
  )
}
