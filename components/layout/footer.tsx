import Link from "next/link"

import { siteConfig } from "@/config/site"

import { FooterSkyClock } from "@/components/layout/footer-sky-clock"
import { ViewSwitch } from "@/components/shared/view-switch"
import { FooterWordmark } from "@/components/layout/footer-wordmark"
import { Icons } from "@/components/shared/icons"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full space-y-4 px-2 pb-4">
      <div className="stripe-divider" />
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
        <div className="flex items-center gap-4">
          <FooterSkyClock className="hidden sm:inline-flex" />
          <ViewSwitch />
        </div>
      </div>

      <div className="mb-20 pt-2 simple:hidden">
        <FooterWordmark />
      </div>
    </footer>
  )
}
