import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXContent } from "@content-collections/mdx/react"

import { siteConfig } from "@/config/site"
import { formatPostDate, getPostBySlug, getVisiblePosts } from "@/lib/blog"
import { cn } from "@/lib/utils"

import { ArticleContent } from "@/components/app/article-content"
import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getVisiblePosts().map((post) => ({
    slug: post.href.split("/").pop(),
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: post.href },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}${post.href}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [siteConfig.author.name],
      tags: post.tags,
      images: [{ url: siteConfig.images.default, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [siteConfig.images.default],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const {
    title,
    excerpt,
    publishedAt,
    updatedAt,
    tags,
    status,
    readingTimeMinutes,
    html,
  } = post

  return (
    <div className="container max-w-4xl px-4 py-16 md:py-24">
      <article className="relative mx-auto">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "absolute -top-8 left-0"
          )}
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Back to Blog
        </Link>

        <header className="pt-6">
          <h1 className="mb-4 text-balance text-center text-4xl font-bold">
            {title}
          </h1>

          <p className="text-muted-foreground mb-6 text-center text-lg">
            {excerpt}
          </p>

          <div className="text-muted-foreground mb-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>
            {updatedAt && (
              <>
                <span aria-hidden>•</span>
                <span>
                  Updated{" "}
                  <time dateTime={updatedAt}>{formatPostDate(updatedAt)}</time>
                </span>
              </>
            )}
            <span aria-hidden>•</span>
            <span>{readingTimeMinutes} min read</span>
          </div>

          {(status === "draft" || (tags && tags.length > 0)) && (
            <div className="mb-12 flex flex-wrap items-center justify-center gap-1.5">
              {status === "draft" && (
                <Badge variant="outline" className="text-xs">
                  Draft
                </Badge>
              )}
              {tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <ArticleContent className="prose prose-gray dark:prose-invert prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-pre:[&_code]:bg-transparent prose-pre:[&_code]:p-0 mx-auto max-w-3xl">
          <MDXContent code={html} />
        </ArticleContent>
      </article>
    </div>
  )
}
