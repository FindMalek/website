import Link from "next/link"

import { REPOSITORIES } from "@/config/consts"
import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { FooterInteractiveLogotype } from "@/components/layout/footer-interactive-logotype"
import { FooterShimmerText } from "@/components/layout/footer-shimmer-text"

const SOURCE_REPO_URL = REPOSITORIES[0]

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

      <dl className="container flex flex-col gap-2 font-mono text-sm [&_dd]:text-foreground [&_dt]:text-muted-foreground">
        <div className="flex items-center justify-between">
          <dt>Crafted by</dt>
          <dd>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              className="underline decoration-current/30 underline-offset-4 hover:decoration-current"
            >
              {siteConfig.author.name}
            </Link>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Deployed on</dt>
          <dd>Vercel</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Source code</dt>
          <dd>
            <Link
              href={SOURCE_REPO_URL}
              target="_blank"
              className="underline decoration-current/30 underline-offset-4 hover:decoration-current"
            >
              GitHub
            </Link>
          </dd>
        </div>
      </dl>

      <FooterInteractiveLogotype />
      <FooterShimmerText />

      <div className="container flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          © {currentYear} Malek Gara-Hellal. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  )
}
