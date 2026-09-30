import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import type { PostSummary } from "@/lib/blog"
import { cn } from "@/lib/utils"

interface PostPagerProps {
  previous?: PostSummary
  next?: PostSummary
}

export function PostPager({ previous, next }: PostPagerProps) {
  if (!previous && !next) return null

  return (
    <nav aria-label="More posts" className="grid sm:grid-cols-2">
      {previous && <PagerLink post={previous} direction="previous" />}
      {next && (
        <PagerLink
          post={next}
          direction="next"
          className={cn(
            "sm:col-start-2",
            previous && "max-sm:screen-line-top sm:border-line sm:border-l"
          )}
        />
      )}
    </nav>
  )
}

function PagerLink({
  post,
  direction,
  className,
}: {
  post: PostSummary
  direction: "previous" | "next"
  className?: string
}) {
  const isNext = direction === "next"
  const Icon = isNext ? ArrowRight : ArrowLeft

  return (
    <Link
      href={post.href}
      rel={isNext ? "next" : "prev"}
      className={cn(
        "hover:bg-muted/40 focus-visible:ring-ring/50 group flex flex-col gap-1.5 p-4 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-inset",
        isNext && "items-end text-right",
        className
      )}
    >
      <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
        {!isNext && (
          <Icon
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            aria-hidden
          />
        )}
        {isNext ? "Next post" : "Previous post"}
        {isNext && (
          <Icon
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        )}
      </span>
      <span className="line-clamp-2 text-pretty text-base font-semibold leading-snug">
        {post.title}
      </span>
    </Link>
  )
}
