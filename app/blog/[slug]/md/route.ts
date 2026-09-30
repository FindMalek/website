import { getPostBySlug, getPostMarkdown, getVisiblePosts } from "@/lib/blog"

// Served publicly as /blog/<slug>.md via the rewrite in next.config.ts.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getVisiblePosts().map((post) => ({ slug: post.slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(getPostMarkdown(post), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
