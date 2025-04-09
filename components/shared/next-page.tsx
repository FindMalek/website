"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

import { PAGES } from "@/config/consts"
import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { HyperText } from "@/components/x/hyper-text"

export function NextPage() {
  const pathname = usePathname()

  const getNextPage = () => {
    switch (pathname) {
      case PAGES.HOME.path:
        return PAGES.ABOUT
      case PAGES.ABOUT.path:
        return PAGES.WORK
      case PAGES.WORK.path:
        return PAGES.PROJECTS
      case PAGES.PROJECTS.path:
        return PAGES.STACK
      case PAGES.STACK.path:
        return PAGES.CONTACT
      case PAGES.CONTACT.path:
        return PAGES.HOME
      default:
        return PAGES.HOME
    }
  }

  const nextPage = getNextPage()

  return (
    <div className="mb-16 mt-10 px-4 md:mb-0">
      <Link
        href={nextPage.path}
        className="flex items-center gap-2 text-lg font-normal leading-6 dark:text-white"
      >
        <HyperText className="text-base" duration={200} delay={1000}>
          {nextPage.text}
        </HyperText>
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
