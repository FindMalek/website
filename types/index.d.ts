import { Popover } from "@headlessui/react"

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

export type AvatarContainerType = React.ComponentProps<"div">

export type NavItemType = {
  href: string
  children: React.ReactNode
}

export type MobileNavigationType = React.ComponentProps<typeof Popover>

export type DesktopNavigationType = React.ComponentPropsWithoutRef<"nav">
