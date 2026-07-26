import Link from "next/link"

import resumeData from "@/data/resume.json"

import { siteConfig, TIMEZONE } from "@/config/site"

import { CurrentLocalTimeItem } from "@/components/app/current-local-time-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "@/components/app/intro-item"
import { CopyText } from "@/components/shared/copy-text"
import { Icons } from "@/components/shared/icons"

const SOCIAL_LINKS = [
  { href: siteConfig.links.instagram, icon: Icons.instagram, label: "Instagram" },
  { href: siteConfig.links.linkedin, icon: Icons.linkedin, label: "LinkedIn" },
  { href: siteConfig.links.github, icon: Icons.github, label: "GitHub" },
  { href: siteConfig.links.twitter, icon: Icons.x, label: "X (Twitter)" },
  { href: siteConfig.links.facebook, icon: Icons.facebook, label: "Facebook" },
] as const

export function AboutFacts() {
  return (
    <div className="mb-8 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
      <IntroItem className="sm:col-span-2">
        <IntroItemIcon>
          <Icons.briefcase />
        </IntroItemIcon>
        <IntroItemContent>{resumeData.basics.headline}</IntroItemContent>
      </IntroItem>

      <IntroItem>
        <IntroItemIcon>
          <Icons.location />
        </IntroItemIcon>
        <IntroItemContent>{resumeData.basics.location}</IntroItemContent>
      </IntroItem>

      <CurrentLocalTimeItem timeZone={TIMEZONE} />

      <IntroItem>
        <IntroItemIcon>
          <Icons.mail />
        </IntroItemIcon>
        <IntroItemContent>
          <CopyText
            text={siteConfig.author.email}
            className="hover:text-primary underline-offset-4 transition-colors hover:underline"
          />
        </IntroItemContent>
      </IntroItem>

      <IntroItem>
        <IntroItemIcon>
          <Icons.globe />
        </IntroItemIcon>
        <IntroItemContent>
          <IntroItemLink href={siteConfig.author.url}>
            {resumeData.basics.website.label}
          </IntroItemLink>
        </IntroItemContent>
      </IntroItem>

      <div className="flex items-center gap-3.5">
        {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener"
            aria-label={label}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="size-4" />
          </Link>
        ))}
      </div>
    </div>
  )
}
