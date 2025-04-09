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
