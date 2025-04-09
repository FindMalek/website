export type SiteConfig = {
  name: string
  description: string
  url: string
  links: {
    twitter?: string
    github?: string
    discord?: string
  }
  images: {
    default: string
    notFound: string
    logo: string
  }
  author: {
    name: string
    url: string
    email: string
    github?: string
  }
  keywords: string[]
}
