import { Popover } from "@headlessui/react"

export * from "./spotify"

export type SiteConfig = {
  name: string
  description: string
  url: string
  links: {
    twitter: string
    github: string
    facebook: string
    instagram: string
    linkedin: string
    spotify: string
    resume: string
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

export interface Client {
  name: string
  logo?: string
  color?: string
  textColor?: string
  href?: string
}

export interface OpenSourceProject {
  name: string
  description: string
  stars: number
  language: string
  languageColor: string
  url: string
}

export interface StackItem {
  title: string
  description: string
  imageUrl: string
  url: string
}

export interface StackSection {
  title: string
  items: StackItem[]
}

export interface FeatureOption {
  id: string
  label: string
  value: number
}

export interface ToolData {
  state: string
  step?: number
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  result?: Record<string, unknown>
}

export interface MessagePart {
  type: string
  text?: string
  toolInvocation?: {
    state: string
    step?: number
    toolCallId: string
    toolName: string
    args: Record<string, unknown>
    result?: Record<string, unknown>
  }
  [key: string]: unknown
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  toolInvocations?: ToolData[]
  toolCalls?: ToolData[]
  parts?: MessagePart[]
  [key: string]: unknown
}

export interface ConversationHistory {
  role: string
  message: string
}

export interface ContactEmailIntroductionProps {
  userName: string
  userEmail: string
  contactPurpose: string
  conversation: ConversationHistory[]
}

export interface CardData {
  id: number
  type: "image" | "text"
  imageUrl?: string
  text?: string
  subtext?: string
  backgroundColor: string
  textColor: string
}
