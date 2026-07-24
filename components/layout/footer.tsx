import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { ModeToggle } from "@/components/shared/mode-toggle"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-secondary-foreground/20 w-full space-y-4 border-t px-2 py-4">
      <div className="container flex items-center gap-4">
        <Link href={siteConfig.links.facebook} target="_blank">
          <Icons.facebook className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
        </Link>
        <Link href={siteConfig.links.instagram} target="_blank">
          <Icons.instagram className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
        </Link>
        <Link href={siteConfig.links.linkedin} target="_blank">
          <Icons.linkedin className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
        </Link>
        <Link href={siteConfig.links.twitter} target="_blank">
          <Icons.x className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
        </Link>
        <Link href={siteConfig.links.github} target="_blank">
          <Icons.github className="text-foreground/80 hover:text-foreground size-4 transition-all duration-200" />
        </Link>
      </div>

      <div className="container flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          © {currentYear} Malek Gara-Hellal. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  )
}
