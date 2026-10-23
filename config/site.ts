import { SiteConfig } from "@/types"

export const TIMEZONE = "Africa/Tunis"

export const siteConfig: SiteConfig = {
  name: "Malek Gara-Hellal — Senior Full-Stack Engineer, AI Products",
  description:
    "Malek Gara-Hellal is a senior full-stack engineer in Tunisia building AI products: LLM pipelines with evals, search, and full products like Dukkani and Sonaraem. Explore his work, projects and writing.",
  url: "https://www.findmalek.com",
  images: {
    default: "https://www.findmalek.com/og.png",
    notFound: "https://www.findmalek.com/not-found.png",
    logo: "https://www.findmalek.com/about/author.png",
  },
  links: {
    twitter: "https://go.findmalek.com/x",
    github: "https://go.findmalek.com/gh",
    facebook: "https://go.findmalek.com/fb",
    instagram: "https://go.findmalek.com/ig",
    linkedin: "https://go.findmalek.com/li",
    spotify: "https://go.findmalek.com/sp",
    resume: "https://go.findmalek.com/cv",
  },
  author: {
    name: "Malek Gara-Hellal",
    url: "https://www.findmalek.com",
    email: "hi@findmalek.com",
    github: "https://go.findmalek.com/gh",
  },
  keywords: [
    "Senior Full-Stack Engineer",
    "AI Engineer",
    "LLM Systems",
    "RAG",
    "AI Evals",
    "TypeScript",
    "Next.js",
    "React",
    "PostgreSQL",
    "Open Source",
    "Remote",
    "Tunisia",
  ],
}

export const notFoundMetadata = () => {
  return {
    title: "Page not found",
    description: "Page not found",
    openGraph: {
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [
        {
          url: siteConfig.images.notFound,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [siteConfig.images.notFound],
      creator: "@foundmalek",
    },
  }
}
