import { allPosts } from "content-collections"
import { format, parseISO } from "date-fns"

// Drafts render under `pnpm dev` so they can be previewed, but are never
// listed, routed, or put in the sitemap in a production build.
const SHOW_DRAFTS = process.env.NODE_ENV === "development"

export function getVisiblePosts() {
  return allPosts
    .filter((post) => SHOW_DRAFTS || post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getPostBySlug(slug: string) {
  return getVisiblePosts().find((post) => post.href === `/blog/${slug}`)
}

export function formatPostDate(date: string) {
  return format(parseISO(date), "MMM d, yyyy")
}
