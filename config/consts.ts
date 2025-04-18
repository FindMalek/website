import type { Client, FeatureOption } from "@/types"

export const PAGES = {
  HOME: {
    path: "/",
    label: "FindMalek.",
    name: "Home",
    text: "Learn more about me",
  },
  ABOUT: {
    path: "/about",
    label: "About Me.",
    name: "About",
    text: "Learn more about me",
  },
  WORK: {
    path: "/work",
    label: "Work.",
    name: "Work",
    text: "Have a look at my work",
  },
  PROJECTS: {
    path: "/projects",
    label: "Projects.",
    name: "Projects",
    text: "Check out my projects",
  },
  STACK: {
    path: "/stack",
    label: "Stack.",
    name: "Stack",
    text: "Explore my tech stack",
  },
  CONTACT: {
    path: "/contact",
    label: "Contact Me.",
    name: "Contact",
    text: "Get in touch with me",
  },
  NOT_FOUND: {
    path: "*",
    label: "404 Not Found.",
    name: "404",
    text: "Return to home",
  },
} as const

export const NAV_ITEMS = {
  ABOUT: PAGES.ABOUT,
  WORK: PAGES.WORK,
  PROJECTS: PAGES.PROJECTS,
  STACK: PAGES.STACK,
  CONTACT: PAGES.CONTACT,
} as const

export type PagePath = (typeof PAGES)[keyof typeof PAGES]["path"]
export type PageLabel = (typeof PAGES)[keyof typeof PAGES]["label"]

export const BOOKS = [
  {
    id: "1",
    link: "https://www.goodreads.com/book/show/40121378-atomic-habits",
    image: "/books/atomic-habit.jpg",
    title: "Atomic Habits",
    author: "James Clear",
  },
  {
    id: "2",
    link: "https://www.goodreads.com/book/show/1303.The_48_Laws_of_Power",
    image: "/books/the-48-laws-of-power.jpg",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
  },
  {
    id: "3",
    link: "https://www.goodreads.com/book/show/118700.The_Brothers_Karamazov",
    image: "/books/the-brothers-karamazov.jpg",
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
  },
]

export const CLIENTS: Client[] = [
  {
    name: "Real Reach",
    logo: "/clients/real-reach.png",
  },
  {
    name: "OpenStatus",
    logo: "/clients/open-status.png",
    href: "https://www.openstatus.dev",
  },
  {
    name: "Ultrabeam",
    logo: "/clients/ultabeam.png",
    href: "https://www.ultrabeam.app",
  },
  {
    name: "Lead Insight",
    logo: "/clients/leadinsight.svg",
    href: "https://lead-insight.vercel.app",
  },
  {
    name: "Waste Not",
    href: "https://waste-not.findmalek.com/",
  },
  {
    name: "Thryve",
    logo: "/clients/thryve.png",
  },
  {
    name: "Magic UI",
    logo: "/clients/magic-ui.png",
    href: "https://magicui.design",
  },
  {
    name: "Karhba Go",
    logo: "/clients/karhba-go.ico",
  },
  {
    name: "StageUp",
    logo: "/clients/stageup.ico",
    href: "https://stage-up.vercel.app/",
  },
  {
    name: "Luna",
  },
  {
    name: "MotionEMR",
    href: "https://motionemr.com",
  },
  {
    name: "Kachouri",
    href: "https://www.kachouri-getraenke-service.de",
    logo: "/clients/kachouri.svg",
  },
]

export const REPOSITORIES = [
  "https://github.com/findmalek/findmalek",
  "https://github.com/undrstnd-labs/education",
  "https://github.com/undrstnd-labs/developers",
  "https://github.com/FindMalek/lead-insight",
  "https://github.com/FindMalek/event-duration-calculator",
  "https://github.com/FindMalek/muslim-fasting",
  "https://github.com/FindMalek/findauth",
]

export const LANGUAGES_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Ruby: "#701516",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#ffac45",
}

export const PRICING = {
  BASE_PRICES: {
    website: 1000,
    ecommerce: 2000,
    webapp: 3000,
    automation: 500,
    other: 1200,
  },
  MULTIPLIERS: {
    complexity: {
      min: 0.8,
      max: 1.5,
      range: 0.7, // max - min
    },
    timeframe: {
      min: 0.9,
      max: 1.3,
      range: 0.4, // max - min
    },
  },
  CURRENCY: "USD",
  CALCULATION_DELAY: 1500,
}

export const FEATURE_OPTIONS: FeatureOption[] = [
  { id: "auth", label: "Authentication", value: 1000 },
  { id: "payment", label: "Payment Processing", value: 1500 },
  { id: "cms", label: "Content Management", value: 1200 },
  { id: "ai", label: "AI Integration", value: 2000 },
  { id: "analytics", label: "Analytics", value: 800 },
  { id: "responsive", label: "Responsive Design", value: 500 },
  { id: "seo", label: "SEO Optimization", value: 600 },
]

export const MAX_MESSAGES_ALLOWED = 20
