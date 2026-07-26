import Link from "next/link"

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
    <section className="mb-32" id="overview">
      <AboutFacts />

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="space-y-6 lg:w-3/5">
          <p className="text-lg">
            Hi, I&apos;m Malek Gara-Hellal. I&apos;m a Design Engineer, Founder,
            and Product Builder focused on turning ideas into real, scalable
            systems.
          </p>

          <p className="text-lg">
            I founded{" "}
            <Link
              href="https://undrstnd.dev"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Undrstnd Labs
            </Link>
            , an AI development and research lab focused on solving real-world
            problems through thoughtfully designed products. Our work spans
            education with{" "}
            <span className={cn("font-semibold")}>Undrstnd Education</span> and{" "}
            <span className={cn("font-semibold")}>Undrstnd Developers</span>,
            and we continue to ship new applications in production.
          </p>

          <p className="text-lg">
            Before that, I founded{" "}
            <Link
              href="https://www.linkedin.com/company/endless-byte/posts/?feedView=all"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Endless Byte
            </Link>
            , a web development startup in Tunisia where I worked closely with
            founders and businesses to ship production-grade web applications,
            mainly in e-commerce and internal tools.
          </p>

          <p className="text-lg">
            I also co-founded{" "}
            <Link
              href="https://www.instagram.com/artweave.originals/"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Artweave
            </Link>
            , a clothing brand that explored creative direction, branding, and
            product execution, and was later acquired by Tunisian Design in
            2023.
          </p>

          <p className="text-lg">
            More recently, I&apos;ve been building{" "}
            <Link
              href="/projects/dukkani"
              className={cn(link, "font-semibold")}
            >
              Dukkani
            </Link>
            , a product focused on simplifying digital operations for local
            businesses by combining design, automation, and practical tooling.
          </p>

          <p className="text-lg">
            My philosophy is simple: I don&apos;t build features, I build
            systems. I focus on creating structures that scale — in code, in
            products, and in how teams work. I care deeply about
            maintainability, clarity, and long-term leverage over short-term
            hacks.
          </p>

          <p className="text-lg">
            My journey hasn&apos;t been linear. I started by taking on small
            freelance work, building and shipping constantly, failing fast, and
            iterating in public and private. Over time, that evolved into
            founding products, working with teams, contributing to open-source,
            and designing systems that survive real usage.
          </p>

          <p className="text-lg">
            I&apos;m an active open-source contributor and builder. Some
            projects I&apos;ve contributed to include{" "}
            <Link
              href="https://midday.ai/"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Midday
            </Link>
            ,{" "}
            <Link
              href="https://github.com/function03-labs"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Function03
            </Link>{" "}
            in Web3,{" "}
            <Link
              href="https://tally-zero.preview.tally.xyz/"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              TallyZero
            </Link>
            ,{" "}
            <Link
              href="https://www.openstatus.dev"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              OpenStatus
            </Link>{" "}
            for{" "}
            <Link
              href="https://github.com/openstatusHQ/goat-stack"
              target="_blank"
              className={cn(link, "font-semibold")}
            >
              Goat Stack
            </Link>
            , and other production-grade tools.
          </p>
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
