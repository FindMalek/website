import Link from "next/link"

import { ABOUT_BIO, aboutSegmentsToText } from "@/config/about"
import { siteConfig } from "@/config/site"
import { link } from "@/config/styles"
import { cn } from "@/lib/utils"

import { AboutFacts } from "@/components/app/about-facts"
import { AboutOverviewCardsStack } from "@/components/app/about-overview-cards-stack"
import { Icons } from "@/components/shared/icons"

const SOCIAL_LINKS = [
  {
    href: siteConfig.links.instagram,
    icon: Icons.instagram,
    label: "Instagram",
  },
  { href: siteConfig.links.linkedin, icon: Icons.linkedin, label: "LinkedIn" },
  { href: siteConfig.links.github, icon: Icons.github, label: "GitHub" },
  { href: siteConfig.links.twitter, icon: Icons.x, label: "X (Twitter)" },
  { href: siteConfig.links.facebook, icon: Icons.facebook, label: "Facebook" },
] as const

export function AboutOverview() {
  return (
    <section id="overview">
      <AboutFacts />

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="space-y-6 lg:w-3/5">
          {ABOUT_BIO.map((paragraph) => (
            <p key={aboutSegmentsToText(paragraph)} className="text-lg">
              {paragraph.map((segment) =>
                typeof segment === "string" ? (
                  segment
                ) : segment.href ? (
                  <Link
                    key={segment.text}
                    href={segment.href}
                    target={segment.href.startsWith("/") ? undefined : "_blank"}
                    className={cn(link, "font-semibold")}
                  >
                    {segment.text}
                  </Link>
                ) : (
                  <span key={segment.text} className="font-semibold">
                    {segment.text}
                  </span>
                )
              )}
            </p>
          ))}
        </div>

        <div className="relative lg:w-2/5">
          <div className="lg:sticky lg:top-8">
            <div className="mb-6 rounded-3xl p-12 lg:p-0">
              <AboutOverviewCardsStack />
            </div>

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
        </div>
      </div>
    </section>
  )
}
