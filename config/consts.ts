export const PAGES = {
  HOME: {
    path: "/",
    label: "FindMalek.",
  },
  ABOUT: {
    path: "/about",
    label: "About Me.",
  },
  PROJECTS: {
    path: "/projects",
    label: "Projects.",
  },
  CONTACT: {
    path: "/contact",
    label: "Contact Me.",
  },
  NOT_FOUND: {
    path: "*",
    label: "404 Not Found.",
  },
} as const

export type PagePath = (typeof PAGES)[keyof typeof PAGES]["path"]
export type PageLabel = (typeof PAGES)[keyof typeof PAGES]["label"]
