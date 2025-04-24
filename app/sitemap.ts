import { allProjects, allWorks } from "content-collections"

export default async function sitemap() {
  try {
    const currentDate = new Date().toISOString()
    
    const baseUrls = [
      {
        url: "https://www.findmalek.com/",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: "https://www.findmalek.com/about",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: "https://www.findmalek.com/work",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://www.findmalek.com/projects",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://www.findmalek.com/stack",
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "https://www.findmalek.com/contact",
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.7,
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
    
    return [...baseUrls, ...workUrls, ...projectUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return []
  }
}
