import Link from "next/link"

import { REPOSITORIES } from "@/config/consts"
import { siteConfig } from "@/config/site"

import { getContributionCalendar } from "@/actions/github"
import { GithubHeatmap } from "@/components/app/github-heatmap"
import { Icons } from "@/components/shared/icons"
import { ModeToggle } from "@/components/shared/mode-toggle"

const SOURCE_REPO_URL = REPOSITORIES[0]
const GITHUB_USERNAME = SOURCE_REPO_URL.split("/").at(-2) ?? "findmalek"

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const contributions = await getContributionCalendar(GITHUB_USERNAME)

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

      {contributions && (
        <div className="container">
          <GithubHeatmap
            days={contributions.days}
            totalContributions={contributions.totalContributions}
          />
        </div>
      )}

      <div className="container flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          © {currentYear} Malek Gara-Hellal. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={SOURCE_REPO_URL}
            target="_blank"
            className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
          >
            View source
          </Link>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
