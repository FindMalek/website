import { SiteConfig } from "@/types"

export const TIMEZONE = "Africa/Tunis"

export const siteConfig: SiteConfig = {
  name: "Malek Gara-Hellal — Design Engineer & Developer, Tunisia",
  description:
    "Malek Gara-Hellal is a design engineer and developer based in Tunisia, specialized in web development, design engineering, and creative entrepreneurship. Explore his work and ventures.",
  url: "https://www.findmalek.com",
  images: {
    default: "https://www.findmalek.com/og.png",
    notFound: "https://www.findmalek.com/not-found.png",
    logo: "https://www.findmalek.com/author.jpg",
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
    "Web Development",
    "Design Engineering",
    "Creative Entrepreneurship",
    "Project Management",
    "Innovative Solutions",
    "Business Ventures",
    "Technology",
    "Software Development",
    "Digital Transformation",
    "Startups",
    "Tech Entrepreneur",
    "Innovation",
    "Product Development",
    "User Experience",
    "Agile Methodologies",
    "MobX",
    "Zustand",
    "tRPC",
    "T3 Stack",
    "Prisma",
    "TailwindCSS",
    "Shadcn",
    "Next.js",
    "React",
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
