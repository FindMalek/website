import { allProjects, allRecommendations, allWorks } from "content-collections"

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

    // Placeholder entries (see #65) are structural only and must never be
    // indexed as if they were a real, publishable recommendation.
    const recommendationUrls = allRecommendations
      .filter((recommendation) => !recommendation.isPlaceholder)
      .map((recommendation) => ({
        url: `https://www.findmalek.com${recommendation.href}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.5,
      }))

    return [...baseUrls, ...workUrls, ...projectUrls, ...recommendationUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return []
  }
}
