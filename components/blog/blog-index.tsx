"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import type { PostSummary } from "@/lib/blog"
import { cn } from "@/lib/utils"

import { PostCard } from "@/components/blog/post-card"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 8
const SEARCH_PARAM = "q"

interface BlogIndexProps {
  posts: PostSummary[]
}

// useSearchParams() bails a static page out to client rendering up to the
// nearest Suspense boundary, so the fallback is the same list with no query:
// the server HTML still carries every card for crawlers and no-JS visitors.
export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <Suspense fallback={<BlogIndexView posts={posts} initialQuery="" />}>
      <BlogIndexWithParams posts={posts} />
    </Suspense>
  )
}

function BlogIndexWithParams({ posts }: BlogIndexProps) {
  const searchParams = useSearchParams()
  return (
    <BlogIndexView
      posts={posts}
      initialQuery={searchParams.get(SEARCH_PARAM) ?? ""}
    />
  )
}

function matchesQuery(post: PostSummary, terms: string[]) {
  const haystack = [post.title, post.excerpt, ...(post.tags ?? [])]
    .join(" ")
    .toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

function syncQueryToUrl(query: string) {
  const url = new URL(window.location.href)
  if (query) {
    url.searchParams.set(SEARCH_PARAM, query)
  } else {
    url.searchParams.delete(SEARCH_PARAM)
  }
  window.history.replaceState(null, "", url)
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

function BlogIndexView({
  posts,
  initialQuery,
}: BlogIndexProps & { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const inputRef = useRef<HTMLInputElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filteredPosts = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return terms.length === 0
      ? posts
      : posts.filter((post) => matchesQuery(post, terms))
  }, [posts, query])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  const updateQuery = (value: string) => {
    setQuery(value)
    setVisibleCount(PAGE_SIZE)
    syncQueryToUrl(value.trim())
  }

  const showMore = () => setVisibleCount((count) => count + PAGE_SIZE)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Re-created whenever the count changes: a fresh observer reports the
  // sentinel's current state, so a still-visible sentinel keeps loading.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!hasMore || !sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((count) => count + PAGE_SIZE)
        }
      },
      { rootMargin: "0px 0px 600px 0px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, visibleCount])

  const trimmedQuery = query.trim()
  const statusText = trimmedQuery
    ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "post" : "posts"} found`
    : `Showing ${visiblePosts.length} of ${posts.length} posts`

  return (
    <>
      <div role="search" className="screen-line-bottom p-2">
        <label htmlFor="blog-search" className="sr-only">
          Search posts
        </label>
        <div className="relative">
          <Icons.search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          />
          <input
            ref={inputRef}
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return
              if (query) {
                event.preventDefault()
                updateQuery("")
              } else {
                event.currentTarget.blur()
              }
            }}
            placeholder="Search posts…"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-lg border pl-9 pr-10 text-base outline-none transition-[border-color,box-shadow] focus-visible:ring-[3px] sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                updateQuery("")
                inputRef.current?.focus()
              }}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring/50 absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
            >
              <Icons.close className="size-4" aria-hidden />
            </button>
          ) : (
            <kbd
              aria-hidden
              className="border-line bg-muted text-muted-foreground pointer-events-none absolute right-2.5 top-1/2 hidden h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded border px-1 font-mono text-[11px] sm:flex"
            >
              /
            </kbd>
          )}
        </div>
      </div>

      <p role="status" className="sr-only">
        {statusText}
      </p>

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {posts.length === 0 ? (
              "Nothing published yet. Soon."
            ) : (
              <>
                No posts match{" "}
                <span className="text-foreground font-medium">
                  &ldquo;{trimmedQuery}&rdquo;
                </span>
                .
              </>
            )}
          </p>
          {posts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateQuery("")
                inputRef.current?.focus()
              }}
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2">
          {visiblePosts.map((post, index) => (
            <li
              key={post.href}
              className={cn(
                "border-line p-2 sm:odd:border-r",
                "max-sm:[&:not(:first-child)]:screen-line-top sm:[&:nth-child(2n+3)]:screen-line-top"
              )}
            >
              <PostCard post={post} priority={index < 2} />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="screen-line-top flex justify-center p-4"
        >
          <Button variant="outline" size="sm" onClick={showMore}>
            Show more posts
          </Button>
        </div>
      )}

      {!trimmedQuery && posts.length > PAGE_SIZE && (
        <noscript>
          <ul className="screen-line-top flex flex-col gap-2 p-4 text-sm">
            {posts.slice(PAGE_SIZE).map((post) => (
              <li key={post.href}>
                <Link href={post.href} className="link-underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </noscript>
      )}
    </>
  )
}
