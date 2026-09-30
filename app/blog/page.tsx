import type { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { formatPostDate, getVisiblePosts } from "@/lib/blog"

import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/app/panel"
import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"

const DESCRIPTION =
  "Notes from building things: what broke, what I tried, and what actually worked."

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: "Blog | Malek Gara-Hellal",
    description: DESCRIPTION,
    images: [{ url: siteConfig.images.default, alt: siteConfig.name }],
  },
}

export default function BlogPage() {
  const posts = getVisiblePosts()

  return (
    <div className="w-full pt-8 md:pt-12">
      <Panel>
        <PanelHeader>
          <PanelTitle className="flex items-center gap-2">
            <Icons.blog className="text-muted-foreground size-5" aria-hidden />
            Blog
            <PanelTitleSup>({posts.length})</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>{DESCRIPTION}</PanelDescription>
        </PanelHeader>

        <PanelContent>
          {posts.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Nothing published yet. Soon.
            </p>
          ) : (
            <ul className="flex flex-col">
              {posts.map((post) => (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    className="border-foreground/10 hover:bg-muted/50 focus-visible:ring-ring group -mx-2 flex items-start gap-3 rounded-lg border-b px-2 py-4 outline-none transition-colors focus-visible:ring-2 [li:last-child_&]:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold leading-snug">
                          {post.title}
                        </h2>
                        {post.status === "draft" && (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
                        <time dateTime={post.publishedAt}>
                          {formatPostDate(post.publishedAt)}
                        </time>
                        <span aria-hidden>•</span>
                        <span>{post.readingTimeMinutes} min read</span>
                        {post.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Icons.arrowUpRight className="text-muted-foreground group-hover:text-foreground mt-1 size-4 shrink-0 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PanelContent>
      </Panel>
    </div>
  )
}
