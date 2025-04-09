export const PAGES = {
  HOME: {
    path: "/",
    label: "FindMalek.",
    name: "Home",
  },
  ABOUT: {
    path: "/about",
    label: "About Me.",
    name: "About",
  },
  WORK: {
    path: "/work",
    label: "Work.",
    name: "Work",
  },
  PROJECTS: {
    path: "/projects",
    label: "Projects.",
    name: "Projects",
  },
  STACK: {
    path: "/stack",
    label: "Stack.",
    name: "Stack",
  },
  CONTACT: {
    path: "/contact",
    label: "Contact Me.",
    name: "Contact",
  },
  NOT_FOUND: {
    path: "*",
    label: "404 Not Found.",
    name: "404",
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
