import Link from "next/link"

import { REPOSITORIES } from "@/config/consts"
import { siteConfig } from "@/config/site"

import { AbstractMark } from "@/components/app/abstract-mark"
import { Icons } from "@/components/shared/icons"
import { ModeToggle } from "@/components/shared/mode-toggle"

const SOURCE_REPO_URL = REPOSITORIES[0]

const INSPIRED_BY = [
  { name: "Next.js", href: "https://nextjs.org" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com" },
  { name: "Radix UI", href: "https://www.radix-ui.com" },
  { name: "Motion", href: "https://motion.dev" },
]

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
          <dt>Inspired by</dt>
          <dd>
            <ul className="flex flex-wrap justify-end gap-x-1.5">
              {INSPIRED_BY.map((tool, index) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    target="_blank"
                    className="underline decoration-current/30 underline-offset-4 hover:decoration-current"
                  >
                    {tool.name}
                  </Link>
                  {index < INSPIRED_BY.length - 1 ? "," : ""}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Deployed on</dt>
          <dd>Vercel</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Analytics</dt>
          <dd>Vercel Analytics</dd>
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

      <div className="container">
        <AbstractMark size="sm" />
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
