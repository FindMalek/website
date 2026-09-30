import { allPosts, type Post } from "content-collections"

import { siteConfig } from "@/config/site"

// Drafts render under `pnpm dev` so they can be previewed, but are never
// listed, routed, or put in the sitemap in a production build.
const SHOW_DRAFTS = process.env.NODE_ENV === "development"

export const BLOG_REPO_URL = "https://github.com/FindMalek/website"

export type PostSummary = Pick<
  Post,
  | "slug"
  | "href"
  | "title"
  | "excerpt"
  | "publishedAt"
  | "tags"
  | "status"
  | "image"
  | "imageAlt"
  | "readingTimeMinutes"
>

export function getVisiblePosts() {
  return allPosts
    .filter((post) => SHOW_DRAFTS || post.status === "published")
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) ||
        a.href.localeCompare(b.href)
    )
}

export function getPostBySlug(slug: string) {
  return getVisiblePosts().find((post) => post.slug === slug)
}

export function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    href: post.href,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    tags: post.tags,
    status: post.status,
    image: post.image,
    imageAlt: post.imageAlt,
    readingTimeMinutes: post.readingTimeMinutes,
  }
}

/** Posts are listed newest first, so "next" is the older neighbour. */
export function getAdjacentPosts(slug: string) {
  const posts = getVisiblePosts()
  const index = posts.findIndex((post) => post.slug === slug)

  return {
    previous: index > 0 ? toPostSummary(posts[index - 1]) : undefined,
    next:
      index >= 0 && index < posts.length - 1
        ? toPostSummary(posts[index + 1])
        : undefined,
  }
}

export function getPostUrl(post: Pick<Post, "href">) {
  return `${siteConfig.url}${post.href}`
}

export function getPostMarkdownUrl(post: Pick<Post, "href">) {
  return `${getPostUrl(post)}.md`
}

export function getPostImageUrl(post: Pick<Post, "image">) {
  return post.image
    ? `${siteConfig.url}${post.image}`
    : siteConfig.images.default
}

// Root-relative links and images are made absolute so the markdown still
// resolves when it's pasted into a chat or fetched by an agent.
export function getPostMarkdown(post: Post) {
  const body = post.content
    .trim()
    .replace(/(\]\()\/(?!\/)/g, `$1${siteConfig.url}/`)

  return `# ${post.title}\n\n${body}\n`
}
