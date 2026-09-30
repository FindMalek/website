import { allProjects, allWorks } from "content-collections"

import { getVisiblePosts } from "@/lib/blog"

export default async function sitemap() {
  try {
    const currentDate = new Date().toISOString()

    const baseUrls = [
      {
        url: "https://www.findmalek.com/",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 1,
      },
    ]

    const workUrls = allWorks.map((work) => ({
      url: `https://www.findmalek.com${work.href}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

    const projectUrls = allProjects.map((project) => ({
      url: `https://www.findmalek.com${project.href}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

    const blogUrls = [
      {
        url: "https://www.findmalek.com/blog",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...getVisiblePosts().map((post) => ({
        url: `https://www.findmalek.com${post.href}`,
        lastModified: post.updatedAt ?? post.publishedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      })),
    ]

    return [...baseUrls, ...workUrls, ...projectUrls, ...blogUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return []
  }
}
