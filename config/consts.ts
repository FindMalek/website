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
    text: "Check out my work",
  },
  WORK: {
    path: "/work",
    label: "Work.",
    name: "Work",
    text: "View my projects",
  },
  PROJECTS: {
    path: "/projects",
    label: "Projects.",
    name: "Projects",
    text: "Explore my tech stack",
  },
  STACK: {
    path: "/stack",
    label: "Stack.",
    name: "Stack",
    text: "Convinced yet to work with me ?",
  },
  CONTACT: {
    path: "/contact",
    label: "Contact Me.",
    name: "Contact",
    text: "Start over again ?",
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
