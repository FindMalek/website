import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { PostSummary } from "@/lib/blog"
import { formatPostDate } from "@/lib/format-post-date"

import { PostCover } from "@/components/blog/post-cover"

export function LatestPosts({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">
        {posts.map((post) => (
          <li key={post.href}>
            <Link
              href={post.href}
              className="border-foreground/10 hover:bg-muted/50 focus-visible:ring-ring group -mx-2 flex items-center gap-4 rounded-lg border-b px-2 py-3 outline-none transition-colors focus-visible:ring-2 [li:last-child_&]:border-b-0"
            >
              <PostCover
                post={post}
                sizes="112px"
                className="w-24 shrink-0 rounded-md sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-pretty text-sm font-semibold leading-snug sm:text-base">
                  {post.title}
                </p>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  <time dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                  <span aria-hidden> · </span>
                  {post.readingTimeMinutes} min read
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground group mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium transition-colors"
      >
        All posts
        <ArrowRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  )
}
