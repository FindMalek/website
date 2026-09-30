import Link from "next/link"

import type { PostSummary } from "@/lib/blog"
import { formatPostDate } from "@/lib/format-post-date"

import { PostCover } from "@/components/blog/post-cover"
import { Badge } from "@/components/ui/badge"

export function PostCard({
  post,
  priority = false,
}: {
  post: PostSummary
  priority?: boolean
}) {
  return (
    <Link
      href={post.href}
      className="focus-visible:ring-ring/50 group flex h-full flex-col gap-3 rounded-lg outline-none focus-visible:ring-[3px]"
    >
      <PostCover
        post={post}
        priority={priority}
        sizes="(min-width: 1280px) 368px, (min-width: 768px) 320px, (min-width: 640px) 240px, 100vw"
        className="group-hover:border-foreground/20 transition-[border-color]"
      />

      <div className="flex flex-col gap-1.5 px-2 pb-2">
        <h2 className="decoration-foreground/30 text-pretty text-base font-semibold leading-snug underline-offset-4 group-hover:underline">
          {post.title}
          {post.status === "draft" && (
            <Badge
              variant="outline"
              className="ml-2 translate-y-[-1px] align-middle text-[11px]"
            >
              Draft
            </Badge>
          )}
        </h2>

        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>
      </div>
    </Link>
  )
}
