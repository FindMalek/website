"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

import { PAGES } from "@/config/consts"
import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"

export function NextPage() {
  const pathname = usePathname()

  const getNextPage = () => {
    switch (true) {
      case pathname === PAGES.HOME.path:
        return PAGES.ABOUT
      case pathname.startsWith(PAGES.ABOUT.path):
        return PAGES.WORK
      case pathname.startsWith(PAGES.WORK.path):
        return PAGES.PROJECTS
      case pathname.startsWith(PAGES.PROJECTS.path):
        return PAGES.STACK
      case pathname.startsWith(PAGES.STACK.path):
        return PAGES.CONTACT
      case pathname.startsWith(PAGES.CONTACT.path):
        return PAGES.HOME
      default:
        return PAGES.HOME
    }
  }

  const nextPage = getNextPage()

  return (
    <div className="mb-16 mt-10 px-4 md:mb-4">
      <Link
        href={nextPage.path}
        className="flex items-center gap-2 pb-2 text-lg font-normal leading-6"
      >
        <span className="pb-2 text-base">{nextPage.text}</span>

        <motion.span
          className="inline-flex"
          animate={{
            x: [0, 10, 0],
            transition: {
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            },
          }}
        >
          <Icons.moveRight className="h-4 w-4" />
        </motion.span>
      </Link>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Link href={siteConfig.links.facebook} className="text-sm">
            <Icons.facebook className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
          </Link>
          <Link href={siteConfig.links.instagram} className="text-sm">
            <Icons.instagram className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
          </Link>
          <Link href={siteConfig.links.linkedin} className="text-sm">
            <Icons.linkedin className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
          </Link>
          <Link href={siteConfig.links.twitter} className="text-sm">
            <Icons.x className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
          </Link>
          <Link href={siteConfig.links.github} className="text-sm">
            <Icons.github className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
          </Link>
        </div>
      </div>
    </div>
  )
}
