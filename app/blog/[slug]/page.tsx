import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXContent } from "@content-collections/mdx/react"
import { ArrowLeft } from "lucide-react"

import { siteConfig } from "@/config/site"
import {
  BLOG_REPO_URL,
  getAdjacentPosts,
  getPostBySlug,
  getPostImageUrl,
  getPostMarkdown,
  getPostMarkdownUrl,
  getPostUrl,
  getVisiblePosts,
} from "@/lib/blog"
import { formatPostDate } from "@/lib/format-post-date"

import { ArticleContent } from "@/components/app/article-content"
import { POST_MDX_COMPONENTS } from "@/components/blog/mdx-components"
import { PostCover } from "@/components/blog/post-cover"
import { PostPager } from "@/components/blog/post-pager"
import { PostToolbar } from "@/components/blog/post-toolbar"
import { Badge } from "@/components/ui/badge"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return getVisiblePosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const image = {
    url: getPostImageUrl(post),
    alt: post.image ? (post.imageAlt ?? post.title) : siteConfig.name,
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: post.href,
      types: { "text/markdown": getPostMarkdownUrl(post) },
    },
    openGraph: {
      type: "article",
      url: getPostUrl(post),
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [siteConfig.author.name],
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { previous, next } = getAdjacentPosts(slug)
  const {
    title,
    excerpt,
    publishedAt,
    updatedAt,
    tags,
    status,
    image,
    readingTimeMinutes,
    html,
  } = post

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    url: getPostUrl(post),
    image: getPostImageUrl(post),
    keywords: tags,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  }

  return (
    <div className="w-full pt-20 md:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article className="border-line border-x">
        <div className="screen-line-top screen-line-bottom flex items-center justify-between gap-2 px-2 py-2">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 group flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px]"
          >
            <ArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            Blog
          </Link>

          <PostToolbar
            title={title}
            markdown={getPostMarkdown(post)}
            postUrl={getPostUrl(post)}
            markdownPath={`${post.href}.md`}
            markdownUrl={getPostMarkdownUrl(post)}
            sourceUrl={`${BLOG_REPO_URL}/blob/main/data/blog/${post._meta.filePath}`}
            previous={previous}
            next={next}
          />
        </div>

        <header className="screen-line-top screen-line-bottom mt-4 px-4 pb-6 pt-5">
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {title}
          </h1>

          <p className="text-muted-foreground mt-4 text-pretty text-base leading-relaxed sm:text-lg">
            {excerpt}
          </p>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>
            {updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span>
                  Updated{" "}
                  <time dateTime={updatedAt}>{formatPostDate(updatedAt)}</time>
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{readingTimeMinutes} min read</span>
          </div>

          {(status === "draft" || (tags && tags.length > 0)) && (
            <ul className="mt-4 flex flex-wrap items-center gap-1.5">
              {status === "draft" && (
                <li>
                  <Badge variant="outline" className="text-xs">
                    Draft
                  </Badge>
                </li>
              )}
              {tags?.map((tag) => (
                <li key={tag}>
                  <Badge variant="secondary" className="text-xs" asChild>
                    <Link href={`/blog?q=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Link>
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </header>

        {image && (
          <div className="screen-line-bottom p-2">
            <PostCover
              post={post}
              priority
              sizes="(min-width: 1280px) 752px, (min-width: 768px) 656px, (min-width: 640px) 496px, 100vw"
            />
          </div>
        )}

        <ArticleContent className="blog-prose prose prose-gray max-w-none px-4 pb-12 pt-8">
          <MDXContent code={html} components={POST_MDX_COMPONENTS} />
        </ArticleContent>
      </article>

      {(previous || next) && (
        <>
          <div className="stripe-divider" />
          <div className="screen-line-top screen-line-bottom border-line border-x">
            <PostPager previous={previous} next={next} />
          </div>
        </>
      )}
    </div>
  )
}
