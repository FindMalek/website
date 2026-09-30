import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { getVisiblePosts, toPostSummary } from "@/lib/blog"

import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/app/panel"
import { BlogIndex } from "@/components/blog/blog-index"

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
  const posts = getVisiblePosts().map(toPostSummary)

  return (
    <div className="w-full pt-20 md:pt-12">
      <Panel>
        <PanelHeader>
          <PanelTitle>
            Blog
            <PanelTitleSup>({posts.length})</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>{DESCRIPTION}</PanelDescription>
        </PanelHeader>

        <BlogIndex posts={posts} />
      </Panel>
    </div>
  )
}
