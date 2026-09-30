import { siteConfig } from "@/config/site"
import { getPostMarkdownUrl, getVisiblePosts } from "@/lib/blog"

export const dynamic = "force-static"

export function GET() {
  const posts = getVisiblePosts()
    .map(
      (post) =>
        `- [${post.title}](${getPostMarkdownUrl(post)}): ${post.excerpt}`
    )
    .join("\n")

  const body = [
    `# ${siteConfig.author.name}`,
    `> ${siteConfig.description}`,
    `Portfolio: ${siteConfig.url}`,
    "## Blog",
    posts || "No posts published yet.",
  ].join("\n\n")

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
